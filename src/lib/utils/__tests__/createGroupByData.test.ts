import { createGroupByData, createGroupName, createPriceRangeRowData, mutateTargetGroup } from "../propertyDataSetting";
const rawData = [
  {
    id: "1",
    state: "Georgia",
    city: "Leesburg",
    price: 1483,
    type: "Condo",
  },
  {
    id: "2",
    state: "Georgia",
    city: "Leesburg",
    price: 1497,
    type: "Condo",
  },
  {
    id: "3",
    state: "Georgia",
    city: "Manassas",
    price: 1483,
    type: "849",
  },
  {
    id: "4",
    state: "Georgia",
    city: "Manassas",
    price: 849,
    type: "Condo",
  },
  {
    id: "5",
    state: "Georgia",
    city: "Manassas",
    price: 618,
    type: "Townhomes",
  },
  {
    id: "6",
    state: "Georgia",
    city: "Newport News",
    price: 550,
    type: "Townhomes",
  },
];
const groupByColumns = ["state", "city"];
const groupByPriceRange = ["500-599"];

describe("Create groupby data", () => {
  describe("to generate group name", () => {
    test("with groupByColumns options", () => {
      const property = {
        id: "1",
        state: "Georgia",
        city: "Leesburg",
        price: 1483,
        type: "Condo",
      };
      const groupName = createGroupName(property, { groupByColumns, groupByPriceRange: [] });
      expect(groupName).toBe(`${property.state} ${property.city}`);
    });
    test("with groupByPriceRange options", () => {
      const notInRangeProperty = {
        id: "1",
        state: "Georgia",
        city: "Leesburg",
        price: 1483,
        type: "Condo",
      };
      const notInRangeResult = createGroupName(notInRangeProperty, {
        groupByPriceRange,
        groupByColumns: []
      });
      expect(notInRangeResult).toBe(`not_in_range`);

      const inRangeProperty = notInRangeProperty;
      inRangeProperty.price = 550;
      const inRangeResult = createGroupName(inRangeProperty, {
        groupByPriceRange,
        groupByColumns: []
      });
      expect(inRangeResult).toBe("500-599");
    });
    test("with groupByColumns and groupByPriceRange options", () => {
      const notInRangeProperty = {
        id: "1",
        state: "Georgia",
        city: "Leesburg",
        price: 1483,
        type: "Condo",
      };
      const groupName = createGroupName(notInRangeProperty, {
        groupByColumns,
        groupByPriceRange,
      });
      expect(groupName).toBe(
        `${notInRangeProperty.state} ${notInRangeProperty.city} not_in_range`,
      );
    });
  });

  describe('to create row data of price range', ()=>{
    test('with in range price', ()=> {
      const property = {
        id: "1",
        state: "Georgia",
        city: "Leesburg",
        price: 550,
        type: "Condo",
      };
      const rowData = createPriceRangeRowData(property, groupByPriceRange)
        expect(rowData).toHaveProperty('500-599', 'Yes')
    })
    test('with not in range price', ()=> {
      const property = {
        id: "1",
        state: "Georgia",
        city: "Leesburg",
        price: 1000,
        type: "Condo",
      };
      const rowData = createPriceRangeRowData(property, groupByPriceRange)
        expect(rowData).toHaveProperty('500-599', 'No')
    })
  })

  describe('to mutate target group data', ()=> {
    test('with no grouping data', ()=> {
    const property = {
      id: "1",
      state: "Georgia",
      city: "Leesburg",
      price: 1483,
      type: "Condo",
    }
    const targetProperty = {
      id: "1",
      state: "Georgia",
      city: "Leesburg",
      price: 1200,
      type: "Condo",
      houses: 1,
      avgPrice: 1200,
      groupName: 'Georgia Leesburg'
    }
    const expectAvgPrice = (property.price + targetProperty.price) / 2
    const nextTargetGroup = mutateTargetGroup(property, targetProperty)

    expect(nextTargetGroup.houses).toBe(2)
    expect(nextTargetGroup.avgPrice).toBe(expectAvgPrice)
    expect(nextTargetGroup).toHaveProperty('groupingData')
    expect(nextTargetGroup.groupingData.length).toBe(2)
    nextTargetGroup.groupingData.forEach((data)=>{
      expect(data).toHaveProperty('groupName', targetProperty.groupName)
    })
    })
  })

  test("with state and city", async () => {
    const data = createGroupByData(rawData, groupByColumns);
    expect(data.length).toBe(3);
  });
});
