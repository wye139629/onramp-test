export function createDynamicColumns ({groupByColumns, groupByPriceRange}: {
  groupByColumns: string[],
  groupByPriceRange: string[]
}) {
  const groupByOptions = [...groupByColumns, ...groupByPriceRange]
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
