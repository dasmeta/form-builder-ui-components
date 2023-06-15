import React, { useContext } from "react";
import { Cascader } from "antd";
import isArray from "lodash/isArray";
import isObject from "lodash/isObject";
import { ConfigContext } from "../../context/Config";

type CascadeSelectProps = {
    value?: any;
    stages: Array<any>;
    options: any;
    onChange?: Function;
}

const CascadeSelect: React.FC<CascadeSelectProps> = ({ value, stages, options, onChange }) => {

    const { translate } = useContext(ConfigContext);

    const handleChange = option => {
        const result = stages.reduce((acc, key, index) => {
            acc[key] = option[index];
            return acc;
        }, {});
        onChange(result);
    };

    return (
        <Cascader
            value={isArray(value) ? value : isObject(value) ? Object.values(value) : []}
            options={options}
            onChange={handleChange}
            placeholder={translate('please-select')}
        />
    );
};

export default CascadeSelect;
