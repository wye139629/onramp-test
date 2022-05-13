import './App.css'

import { useEffect, useState } from 'react'
import { client } from './lib/api/client'
import { mockStart } from './lib/mocks'
import { PropertyTable } from './components/PropertyTable'
import { Form, Button, Select } from 'antd'
import { states, cities } from './lib/region_data/USAStatesCity'
mockStart()

const { Option } = Select
const types = ['Apartment', 'Single-family', 'Townhomes', 'Condo']
const priceRange = [
  '500-599',
  '600-699',
  '700-799',
  '800-899',
  '900-999',
  '1000-1099',
  '1100-1199',
  '1200-1299',
  '1300-1399',
  '1400-1499',
]
const group = ['state', 'city', 'type', ...priceRange]

enum PropertyDataStatusEnum {
  idle,
  pending,
  success,
}

type PropertyDataTypes = {
  key: string
  state: string
  city: string
  type: string
  price: number
}[]

type ReportDataTypes = {
  key: string
  state?: string
  city?: string
  type?: string
  price?: number
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
  const [form] = Form.useForm()
  const [reportSetting, setReportSetting] = useState<{ [key: string]: string[] }>({
    state: ['Georgia'],
    city: [],
    type: [],
    price: [],
    groupBy: ['state', 'city'],
  })
  const [reportData, setReportData] = useState<ReportDataTypes>([])
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
      const nextData = data.map(({ id, state, city, type, price }) => ({
        key: id,
        state,
        city,
        type,
        price,
      }))

      setPropertyData((prev) => ({ ...prev, data: nextData, status: PropertyDataStatusEnum.success }))
    })
  }, [])

  useEffect(() => {
    const {
      state: stateFilterOptions,
      city: cityFilterOptions,
      type: typeFilterOptinos,
      price: priceFilterOptions,
      groupBy,
    } = reportSetting

    const reduceInitValue: {
      key: string
      state?: string
      city?: string
      type?: string
      price?: number
      houses: number
      avgPrice: number
      groupName?: string
    }[] = []

    const groupByData = data
      .reduce((acc, curr) => {
        if (groupBy.length === 0)
          return [
            ...acc,
            {
              key: curr.key,
              state: curr.state,
              city: curr.city,
              price: curr.price,
              type: curr.type,
              houses: 1,
              avgPrice: curr.price,
            },
          ]
        const groupName = groupBy.map((option) => curr[option as keyof typeof curr]).join(' ')
        const specificGroup = acc.find((property) => property.groupName === groupName)

        if (specificGroup) {
          const nextHouses = specificGroup.houses + 1
          const prevTotalPrice = specificGroup.houses * specificGroup.avgPrice
          const nextTotalPrice = prevTotalPrice + curr.price

          specificGroup.houses = nextHouses
          specificGroup.avgPrice = nextTotalPrice / nextHouses
          return acc
        }
        const attrs = groupBy.reduce((acc, option) => {
          return { ...acc, [option]: curr[option as keyof typeof curr] }
        }, {})

        const nextProperty = {
          ...attrs,
          key: curr.key,
          groupName,
          houses: 1,
          avgPrice: curr.price,
        }
        return [...acc, nextProperty]
      }, reduceInitValue)
      .map((data) => ({ ...data, avgPrice: data.avgPrice.toFixed(2) }))

    let nextData = groupByData
    if (stateFilterOptions) {
      nextData = nextData.filter((property) => {
        if (stateFilterOptions.length === 0) return property
        return stateFilterOptions.includes(property.state!)
      })
    }

    if (cityFilterOptions) {
      nextData = nextData.filter((property) => {
        if (cityFilterOptions.length === 0) return property
        return cityFilterOptions.includes(property.city!)
      })
    }

    if (typeFilterOptinos) {
      nextData = nextData.filter((property) => {
        if (typeFilterOptinos.length === 0) return property
        return typeFilterOptinos.includes(property.type!)
      })
    }

    if (priceFilterOptions) {
      nextData = nextData.filter((property) => {
        if (priceFilterOptions.length === 0) return property
        const price = property.price
        const result = priceFilterOptions.filter((priceRange) => {
          const [min, max] = priceRange.split('-')
          return Number(min) < price! && price! < Number(max)
        })
        return result.length > 0
      })
    }

    setReportData(nextData)
  }, [data, reportSetting, isLoading])

  const handleCityOptionChange = (value: any) => {
    form.setFieldsValue({ city: value })
  }
  const handleStateOptionChange = (value: any) => {
    form.setFieldsValue({ state: value })
  }
  const handleTypeOptionChange = (value: any) => {
    form.setFieldsValue({ type: value })
  }
  const handleGroupOptionChange = (value: any) => {
    form.setFieldsValue({ groupBy: value })
  }

  const handlePriceRangeOptionChange = (value: any) => {
    form.setFieldsValue({ price: value })
  }

  const onFinish = (value: any) => {
    setReportSetting(value)
  }

  return (
    <div className="App">
      <Form form={form} onFinish={onFinish} initialValues={reportSetting}>
        <Form.Item label="Group By" name="groupBy">
          <Select mode="multiple" style={{ width: '50%' }} placeholder="GroupBy" onChange={handleGroupOptionChange}>
            {group.map((column) => (
              <Option key={column}>{column}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="State Filter" name="state">
          <Select mode="multiple" style={{ width: '50%' }} placeholder="States" onChange={handleStateOptionChange}>
            {states.map((state) => (
              <Option key={state}>{state}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="City Filter" name="city">
          <Select mode="multiple" style={{ width: '50%' }} placeholder="Cities" onChange={handleCityOptionChange}>
            {cities.map((city) => (
              <Option key={city}>{city}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Type Filter" name="type">
          <Select mode="multiple" style={{ width: '50%' }} placeholder="Types" onChange={handleTypeOptionChange}>
            {types.map((type) => (
              <Option key={type}>{type}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Price Filter" name="price">
          <Select mode="multiple" style={{ width: '50%' }} placeholder="Price" onChange={handlePriceRangeOptionChange}>
            {priceRange.map((price) => (
              <Option key={price}>{price}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            確認
          </Button>
        </Form.Item>
      </Form>
      <PropertyTable data={reportData} loading={isLoading} />
    </div>
  )
}

export default App
