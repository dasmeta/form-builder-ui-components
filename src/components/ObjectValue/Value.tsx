import React, { memo } from "react";
import isBoolean from "lodash/isBoolean";
import { Tag } from "antd";
import isArray from "lodash/isArray";
import isObject from "lodash/isObject";
import isEmpty from "lodash/isEmpty";
import moment from "moment";

const isDateJSONString = text => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(text);

type ValueProps = {
    value: any;
    renderObject?: any;
    level?: number;
}

const Value: React.FC<ValueProps> = memo(({ 
    value, 
    renderObject, 
    level = 0 
}) => {
    if ((isArray(value) || isObject(value)) && isEmpty(value)) {
        return (
            <Tag color={"#fafafa"} style={{ color: "#d9d9d9" }}>
                Empty
            </Tag>
        );
    }
    if (!value && !isBoolean(value)) {
        return <Tag>None</Tag>;
    }
    if (isArray(value)) {
        return value.map((v, index) => (
            <Tag key={index}>
                <Value value={v} />
            </Tag>
        ));
    }
    if (isObject(value)) {
        if (renderObject) {
            return renderObject(value, level + 1);
        }
        return <pre>{JSON.stringify(value, null, 2)}</pre>;
    }
    if (isBoolean(value)) {
        return <Tag color={value ? "#52c41a" : "#f5222d"}>{value ? "ON" : "OFF"}</Tag>;
    }
    if (isDateJSONString(value)) {
        return moment(value).format("llll");
    }
    return value;
});

export default Value;
