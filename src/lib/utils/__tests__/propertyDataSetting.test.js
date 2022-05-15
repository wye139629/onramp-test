import { createGroupByData } from "../propertyDataSetting";

test("Group property data by state and city", async () => {
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
      price: 618,
      type: "Townhomes",
    },
  ];
  const groupByOptions = ["state", "city"];

  const data = createGroupByData(rawData, groupByOptions);
  expect(data.length).toBe(3);

  const firstGroup = data.find((property) => property.id === "1");
  const { state, city } = firstGroup;
  expect(firstGroup.houses).toBe(2);
  expect(firstGroup.avgPrice).toBe((1483 + 1497) / 2);
  expect(firstGroup.groupName).toBe(`${state} ${city}`);
  expect(firstGroup).toHaveProperty("groupingData");

  const groupingData = firstGroup.groupingData;
  groupingData.forEach((data) => {
    expect(data.groupName).toBe(firstGroup.groupName);
  });
});
