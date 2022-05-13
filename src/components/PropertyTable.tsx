import { Table } from 'antd'

export function PropertyTable({
  data,
  loading = false,
}: {
  data: {
    key: string
    state?: string
    city?: string
    type?: string
    houses?: number
    avgPrice?: string
  }[]
  loading: boolean
}) {
  const columns = [
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Houses',
      dataIndex: 'houses',
      key: 'houses',
    },
    {
      title: 'Avg.Price',
      dataIndex: 'avgPrice',
      key: 'avgPrice',
    },
  ]
  return <Table columns={columns} loading={loading} dataSource={data} />
}
