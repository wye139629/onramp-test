export enum RequestMethodEnum {
  GET = 'GET',POST = 'POST',PUT = 'PUT',PATCH = 'PATCH',DELETE = 'DELETE'
}

type ClientConfigTypes = {
  data?: {[key: string]: any}
  method?: RequestMethodEnum
}

export function client(endpoint: string, {data, method = RequestMethodEnum.GET}: ClientConfigTypes = {}) {
  const config = {
    method,
    body: data? JSON.stringify(data) : undefined,
    headers: {
      'Content-Type': data ? 'application/json' : 'text/plain',
    }
  }
  return fetch(endpoint, config).then(async response => {
    const data = await response.json()
    if (response.ok) {
      return data
    } else {
      return Promise.reject(data)
    }
  })
}
