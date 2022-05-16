import {RawPropertyDataTypes, GroupByDataTypes} from './types'

function createGroupName(data: RawPropertyDataTypes, {groupByColumns, groupByPriceRange } : {groupByColumns: string[], groupByPriceRange: string[]}){
      const columnsName = groupByColumns.map((option) => {
          return data[option as keyof typeof data];
      })
      const rangeName = groupByPriceRange.map((option)=> {
        const price = data.price;
        const [min, max] = option.split("-");
        const isInRange = Number(min) < price && price < Number(max);
        return isInRange ? option : `not_in_range`;
      })
      return [...columnsName, ...rangeName].join(' ')
}

function createPriceRangeRowData(data: RawPropertyDataTypes, groupByPriceRange: string[]){
  return groupByPriceRange.reduce((_acc, option) => {
    const price = data.price;
    const [min, max] = option.split("-");
    const isInRange = Number(min) < price && price < Number(max);
    const value = isInRange ? "Yes" : "No";
    return { ..._acc, [option]: value };
  }, {});
}

export function mutateTargetGroup(data: RawPropertyDataTypes, targetGroup: GroupByDataTypes){
  const nextGroupingData = targetGroup.groupingData
  ? [...targetGroup.groupingData, {...data, groupName: targetGroup.groupName}]
  : [
      targetGroup,
      {...data, groupName: targetGroup.groupName},
    ];
  const prevTotalPrice = targetGroup.houses * targetGroup.avgPrice;
  const nextTotalPrice = prevTotalPrice + data.price;
  const nextHouses = targetGroup.houses + 1

  const nextTargetGroup = {
    ...targetGroup,
    houses: nextHouses,
    avgPrice: nextTotalPrice / nextHouses,
    groupingData: nextGroupingData
  }

  return nextTargetGroup
}


function createGroupByData (
  data: RawPropertyDataTypes[],
  groupByColumns: string[] = [],
  groupByPriceRange: string[] = []
)  {
  const reduceInitValue: GroupByDataTypes[] = [];

  return data.reduce((acc, curr) => {
    const groupByOptions = [...groupByColumns, ...groupByPriceRange]
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
    const groupName = createGroupName(curr, { groupByColumns, groupByPriceRange })

    const targetIdx = acc.findIndex(
      (property) => property.groupName === groupName,
    );
    const isTargetGroup = targetIdx > -1

    if (!isTargetGroup) {
      const priceRangeRowData = createPriceRangeRowData(curr, groupByPriceRange)

      const nextProperty = {
        ...curr,
        groupName,
        houses: 1,
        avgPrice: curr.price,
        ...priceRangeRowData,
      };
      return [...acc, nextProperty];
    }

    const targetGroup = acc[targetIdx]
    const nextTargetGroup = mutateTargetGroup(curr, targetGroup)
    acc[targetIdx] = nextTargetGroup
    return acc;

  }, reduceInitValue);
};


export { createGroupByData, createPriceRangeRowData, createGroupName }
