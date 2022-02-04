import React from "react";
import { Select } from "antd";
import countryList from "./list.json";

export default props => <Select {...props} options={countryList.map(item => ({ key: item.name, value: item.name }))} />;