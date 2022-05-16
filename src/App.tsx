import './App.css'

import { useEffect, useState } from 'react'
import { client } from './lib/api/client'
import { mockStart } from "./lib/mocks";
import { PropertyTable } from "./components/PropertyTable";
import { Form, Button, Select } from "antd";
import { states, cities } from "./lib/region_data/USAStatesCity";
import {
  createDynamicColumns,
  createGroupByData,
  filterGroupByData,
} from "./lib/utils/propertyDataSetting";
import {
  FilterOptinosTypes,
  RawPropertyDataTypes,
} from "./lib/utils/propertyDataSetting/types";
mockStart();

const { Option } = Select;
const types = ["Apartment", "Single-family", "Townhomes", "Condo"];
const priceRange = [
  "500-599",
  "600-699",
  "700-799",
  "800-899",
  "900-999",
  "1000-1099",
  "1100-1199",
  "1200-1299",
  "1300-1399",
  "1400-1499",
];
const group = ["state", "city", "type"];

enum PropertyDataStatusEnum {
  idle,
  pending,
  success,
}

type PropertyDataStateTypes = {
  status: PropertyDataStatusEnum;
  data: RawPropertyDataTypes[];
  error: {
    messages: string | null;
  };
};

type GroupByOptionsType = {
  groupByColumns: string[];
  groupByPriceRange: string[];
};

type ReportSettingStateTypes = FilterOptinosTypes & GroupByOptionsType;

function App() {
  const [propertyData, setPropertyData] = useState<PropertyDataStateTypes>({
    status: PropertyDataStatusEnum.idle,
    data: [],
    error: {
      messages: null,
    },
  });
  const [form] = Form.useForm();
  const [reportSetting, setReportSetting] = useState<ReportSettingStateTypes>({
    stateFilterOptions: ["Georgia"],
    cityFilterOptions: [],
    typeFilterOptinos: [],
    priceFilterOptions: [],
    groupByColumns: ["state", "city"],
    groupByPriceRange: [],
  });
  const { data, status } = propertyData;
  const { groupByColumns, groupByPriceRange, ...filterOptions } = reportSetting;
  const isLoading =
    status === PropertyDataStatusEnum.idle ||
    status === PropertyDataStatusEnum.pending;

  const reportColumn = createDynamicColumns({
    groupByColumns,
    groupByPriceRange,
  });
  const groupByData = createGroupByData(
    data,
    groupByColumns,
    groupByPriceRange,
  );
  const reportData = filterGroupByData(groupByData, filterOptions);

  useEffect(() => {
    (async function fetchPropertyData() {
      setPropertyData((prev) => ({
        ...prev,
        status: PropertyDataStatusEnum.pending,
      }));
      const { data } = await client("/api/properties");

      setPropertyData((prev) => ({
        ...prev,
        data,
        status: PropertyDataStatusEnum.success,
      }));
    })();
  }, []);

  const onFinish = (value: ReportSettingStateTypes) => {
    setReportSetting(value);
  };

  return (
    <div className="App">
      <Form form={form} onFinish={onFinish} initialValues={reportSetting}>
        <Form.Item label="Group By Columns" name="groupByColumns">
          <Select
            mode="multiple"
            style={{ width: "50%" }}
            placeholder="Columns"
          >
            {group.map((value) => (
              <Option key={value}>{value}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Group By Price Range" name="groupByPriceRange">
          <Select
            mode="multiple"
            style={{ width: "50%" }}
            placeholder="Price Range"
          >
            {priceRange.map((value) => (
              <Option key={value}>{value}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="State Filter" name="stateFilterOptions">
          <Select mode="multiple" style={{ width: "50%" }} placeholder="States">
            {states.map((state) => (
              <Option key={state}>{state}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="City Filter" name="cityFilterOptions">
          <Select mode="multiple" style={{ width: "50%" }} placeholder="Cities">
            {cities.map((city) => (
              <Option key={city}>{city}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Type Filter" name="typeFilterOptinos">
          <Select mode="multiple" style={{ width: "50%" }} placeholder="Types">
            {types.map((type) => (
              <Option key={type}>{type}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Price Filter" name="priceFilterOptions">
          <Select mode="multiple" style={{ width: "50%" }} placeholder="Price">
            {priceRange.map((price) => (
              <Option key={price}>{price}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            確認
          </Button>
        </Form.Item>
      </Form>
      <PropertyTable
        data={reportData}
        dataColumn={reportColumn}
        loading={isLoading}
      />
    </div>
  );
}

export default App
