import './App.css'

import { useEffect, useState } from 'react'
import { client } from './lib/api/client'
import { mockStart } from './lib/mocks'
import { PropertyTable } from './components/PropertyTable'
mockStart()

enum PropertyDataStatusEnum {
  idle,
  pending,
  success,
}

type PropertyDataTypes = {
  key: string
  state: string
  city: string
  houses: number
  avgPrice: string
}[]

type PropertyDataStateTypes = {
  status: PropertyDataStatusEnum
  data: PropertyDataTypes
  error: {
    messages: string | null
  }
}

function App() {
  const [propertyData, setPropertyData] = useState<PropertyDataStateTypes>({
    status: PropertyDataStatusEnum.idle,
    data: [],
    error: {
      messages: null,
    },
  })
  const { data, status } = propertyData
  const isLoading = status === PropertyDataStatusEnum.idle || status === PropertyDataStatusEnum.pending

  useEffect(() => {
    setPropertyData((prev) => ({ ...prev, status: PropertyDataStatusEnum.idle }))
    client('/api/properties').then((res) => {
      const {
        data,
      }: {
        data: {
          id: string
          state: string
          city: string
          type: string
          price: number
        }[]
      } = res

      const reduceInitValue: {
        key: string
        state: string
        city: string
        houses: number
        avgPrice: number
      }[] = []

      const groupByData = data
        .reduce((acc, curr) => {
          const groupName = `${curr.state} ${curr.city}`
          const specificGroup = acc.find((property) => `${property.state} ${property.city}` === groupName)

          if (specificGroup) {
            const nextHouses = specificGroup.houses + 1
            const prevTotalPrice = specificGroup.houses * specificGroup.avgPrice
            const nextTotalPrice = prevTotalPrice + curr.price

            specificGroup.houses = nextHouses
            specificGroup.avgPrice = nextTotalPrice / nextHouses
            return acc
          }

          const nextProperty = {
            key: curr.id,
            state: curr.state,
            city: curr.city,
            houses: 1,
            avgPrice: curr.price,
          }
          return [...acc, nextProperty]
        }, reduceInitValue)
        .filter((data) => data.state === 'Georgia')
        .map((data) => ({ ...data, avgPrice: data.avgPrice.toFixed(2) }))
      setPropertyData((prev) => ({ ...prev, data: groupByData, status: PropertyDataStatusEnum.success }))
    })
  }, [])

  return (
    <div className="App">
      <PropertyTable data={data} loading={isLoading} />
    </div>
  )
}

export default App
