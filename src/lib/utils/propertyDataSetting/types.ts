export type RawPropertyDataTypes = {
  id: string;
  state: string;
  city: string;
  type: string;
  price: number;
};

export type GroupByDataTypes = (RawPropertyDataTypes & {
  houses: number;
  avgPrice: number;
  groupName?: string;
  groupingData?: RawPropertyDataTypes[];
});

export type FilterOptinosTypes = {
  stateFilterOptions: string[];
  cityFilterOptions: string[];
  typeFilterOptinos: string[];
  priceFilterOptions: string[];
};
