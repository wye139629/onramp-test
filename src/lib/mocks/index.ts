import { createServer, Model, Factory } from 'miragejs'
import {states, data as regionData} from '../region_data/USAStatesCity'

import { faker } from '@faker-js/faker';

let currenState: string
let currentStateIndex = 0

const getRadomIndex = (max: number)=> Math.floor(Math.random() * max)


export function mockStart (){
  createServer({
    models: {
      property: Model,
    },
    factories:{
      property: Factory.extend({
        state(){
          currenState = states[currentStateIndex]
          if (currentStateIndex > 50){
            currentStateIndex = 0
          } else {
            currentStateIndex +=1
          }
          return currenState
        },
        city(i){
          const citys = regionData[currenState]
          return citys[getRadomIndex(citys.length)]
        },
        type(){
          const types = ['Apartment', 'Single-family', 'Townhomes', 'Condo']

          return types[getRadomIndex(types.length)]
        },
        price(){
          return Number(faker.commerce.price(500, 1500))
        }
      })
    },

    seeds(server) {
      server.createList('property', 1000)
    },

    routes() {
      this.namespace = 'api'
      this.get('/properties', (schema) => (
        {
          data: schema.db.properties
        }
      ))
    },
  })
}
