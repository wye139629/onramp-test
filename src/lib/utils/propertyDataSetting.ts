export type RawPropertyDataTypes = {
  id: string;
  state: string;
  city: string;
  type: string;
  price: number;
};

export type FilterOptinosTypes = {
  stateFilterOptions: string[];
  cityFilterOptions: string[];
  typeFilterOptinos: string[];
  priceFilterOptions: string[];
};

type GroupByDataTypes = (RawPropertyDataTypes & {
  houses: number;
  avgPrice: number;
  groupName?: string;
  groupingData?: RawPropertyDataTypes[];
})[];

const groupTypeHashMap: {
  [key: string]: string;
} = {
  state: "state",
  city: "city",
  type: "type",
  "500-599": "price",
  "600-699": "price",
  "700-799": "price",
  "800-899": "price",
  "900-999": "price",
  "1000-1099": "price",
  "1100-1199": "price",
  "1200-1299": "price",
  "1300-1399": "price",
  "1400-1499": "price",
};

export function createDynamicColumns (groupByOptions: string[]) {
  const allColumn = ["state", "city", "type", "price"];
  const columns = groupByOptions.length === 0 ? allColumn : groupByOptions;

  return columns.map((option) => {
    const title = option.charAt(0).toUpperCase() + option.slice(1);
    return {
      title,
      dataIndex: option,
      key: option,
    };
  });
};


export function createGroupByData (
  data: RawPropertyDataTypes[],
  groupByOptions: string[],
) {
  const reduceInitValue: GroupByDataTypes = [];

  return data.reduce((acc, curr) => {
    if (groupByOptions.length === 0) {
      return [
        ...acc,
        {
          id: curr.id,
          state: curr.state,
          city: curr.city,
          price: curr.price,
          type: curr.type,
          houses: 1,
          avgPrice: curr.price,
        },
      ];
    }
    const groupName = groupByOptions
      .map((option) => {
        if (groupTypeHashMap[option] === "price") {
          const price = curr[groupTypeHashMap[option] as keyof typeof curr];
          const [min, max] = option.split("-");
          const isInRange = Number(min) < price && price < Number(max);
          return isInRange ? option : `not_in_range`;
        }
        return curr[groupTypeHashMap[option] as keyof typeof curr];
      })
      .join(" ");
    const specificGroup = acc.find(
      (property) => property.groupName === groupName,
    );

    if (specificGroup) {
      const nextSubData = specificGroup.groupingData
        ? [...specificGroup.groupingData, curr]
        : [
            specificGroup,
            curr,
          ];
      const nextHouses = specificGroup.houses + 1;
      const prevTotalPrice = specificGroup.houses * specificGroup.avgPrice;
      const nextTotalPrice = prevTotalPrice + curr.price;

      specificGroup.houses = nextHouses;
      specificGroup.avgPrice = nextTotalPrice / nextHouses;
      specificGroup.groupingData = nextSubData;
      return acc;
    }

    const priceRangeColumns = groupByOptions.reduce((_acc, option) => {
      if (groupTypeHashMap[option] !== "price"){
        return _acc
      }

      const price = curr[groupTypeHashMap[option] as keyof typeof curr];
      const [min, max] = option.split("-");
      const isInRange = Number(min) < price && price < Number(max);
      const value = isInRange ? "Yes" : "No";
      return { ..._acc, [option]: value };
    }, {});

    const nextProperty = {
      ...curr,
      groupName,
      houses: 1,
      avgPrice: curr.price,
      ...priceRangeColumns,
    };
    return [...acc, nextProperty];
  }, reduceInitValue);
};

export function filterGroupByData(
  data: GroupByDataTypes,
  {
    stateFilterOptions,
    cityFilterOptions,
    typeFilterOptinos,
    priceFilterOptions,
  }: FilterOptinosTypes,
) {
  let filteredData = data;
  if (stateFilterOptions) {
    filteredData = filteredData.filter((property) => {
      if (stateFilterOptions.length === 0) return property;
      return stateFilterOptions.includes(property.state!);
    });
  }

  if (cityFilterOptions) {
    filteredData = filteredData.filter((property) => {
      if (cityFilterOptions.length === 0) return property;
      return cityFilterOptions.includes(property.city!);
    });
  }

  if (typeFilterOptinos) {
    filteredData = filteredData.filter((property) => {
      if (typeFilterOptinos.length === 0) return property;
      return typeFilterOptinos.includes(property.type!);
    });
  }

  if (priceFilterOptions) {
    filteredData = filteredData.filter((property) => {
      if (priceFilterOptions.length === 0) return property;
      const price = property.price;
      const result = priceFilterOptions.filter((priceRange) => {
        const [min, max] = priceRange.split("-");
        return Number(min) < price! && price! < Number(max);
      });
      return result.length > 0;
    });
  }
  return filteredData;
};
