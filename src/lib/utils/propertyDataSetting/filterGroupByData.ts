import {GroupByDataTypes, FilterOptinosTypes} from './types'

export function filterGroupByData(
  data: GroupByDataTypes[],
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
