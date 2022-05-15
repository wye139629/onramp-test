import { Table } from 'antd'
import { RawPropertyDataTypes } from "../lib/utils/propertyDataSetting/types";
enum PriceColorEnums {
  green = "green",
  black = "black",
  red = "red",
}

const priceColorHashmap: { [key: number]: PriceColorEnums } = {
  0: PriceColorEnums.green,
  1: PriceColorEnums.black,
  2: PriceColorEnums.red,
};

type ColumnTypes = {
  title: string;
  dataIndex: string;
  key: string;
}[];

export function PropertyTable({
  data,
  dataColumn,
  loading = false,
}: {
  data: {
    id: string;
    state: string;
    city: string;
    type: string;
    price: number;
    houses: number;
    avgPrice: number;
    groupingData?: RawPropertyDataTypes[];
  }[];
  loading: boolean;
  dataColumn: ColumnTypes;
}) {
  const columns = [
    ...dataColumn,
    {
      title: "Houses",
      dataIndex: "houses",
      key: "houses",
    },
    {
      title: "Avg.Price",
      dataIndex: "avgPrice",
      key: "avgPrice",
      render(text: number) {
        return text.toFixed(2);
      },
    },
  ];
  return (
    <Table
      columns={columns}
      rowKey="id"
      loading={loading}
      expandable={{
        expandedRowRender: (record) => (
          <Table
            rowKey="id"
            columns={[
              {
                title: "State",
                dataIndex: "state",
                key: "state",
              },
              {
                title: "City",
                dataIndex: "city",
                key: "city",
              },
              {
                title: "Type",
                dataIndex: "type",
                key: "type",
              },
              {
                title: "Price",
                dataIndex: "price",
                key: "price",
                render(price) {
                  let color = priceColorHashmap[0];
                  const avgNum = Number(record.avgPrice);
                  const standards = [avgNum * 0.8, avgNum + avgNum * 0.2];
                  standards.forEach((standard, idx) => {
                    if (price >= standard) {
                      color = priceColorHashmap[idx + 1];
                    }
                  });

                  return <span style={{ color }}>{price}</span>;
                },
              },
            ]}
            dataSource={record.groupingData}
          />
        ),
        rowExpandable: (record) => Boolean(record.groupingData),
      }}
      dataSource={data}
    />
  );
}
