import { createServer, Model, Factory } from 'miragejs'

import { faker } from '@faker-js/faker';

export function mockStart (){
  createServer({
    models: {
      property: Model,
    },
    factories:{
      property: Factory.extend({
        city(){
          return faker.address.cityName()
        },
        state(){
          return faker.address.state()
        },
        type(){
          const types = ['Apartment', 'Single-family', 'Townhomes', 'Condo']

          const getRadomIndex = (max: number)=> Math.floor(Math.random() * max);
          return types[getRadomIndex(types.length)]
        },
        price(){
          return faker.commerce.price(500, 1500)
        }
      })
    },

    seeds(server) {
      server.createList('property', 100)
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
