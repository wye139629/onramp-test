import { createDynamicColumns } from "../propertyDataSetting";

test("Create Property Table Columns", () => {
  const groupByColumns = ["state", "city"];
  const groupByPriceRange = ["500-599"];
  const columns = createDynamicColumns({ groupByColumns, groupByPriceRange });

  expect(columns).toMatchInlineSnapshot(`
    Array [
      Object {
        "dataIndex": "state",
        "key": "state",
        "title": "State",
      },
      Object {
        "dataIndex": "city",
        "key": "city",
        "title": "City",
      },
      Object {
        "dataIndex": "500-599",
        "key": "500-599",
        "title": "500-599",
      },
    ]
  `);
});
