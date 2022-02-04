import React from "react";
import { Rate } from "antd";

export default ({ value, onChange }: any) => {

    const handleChange = value => {
        onChange(value);
    };

    return (
        <Rate
            allowClear
            value={value}
            onChange={handleChange}
        />
    );
};
