import React, { useRef, useState, useCallback, useMemo, useEffect } from "react";
import { Input, Select } from "antd";
import PhoneNumber from "awesome-phonenumber";
import isObject from "lodash/isObject";
import codesToData from "../../region-code.json";

export const normalize = pn => (isObject(pn) ? (pn.getNumber() || "").replace("+", "") : pn);
export const validator = async (rule, value) => {
    if (!value) {
        return true;
    }

    const pn = new PhoneNumber(`+${value || ""}`);
    if (pn.isValid()) {
        return true;
    }

    throw "The input is not valid phone number!";
};

const regionList = PhoneNumber.getSupportedRegionCodes()
    .map(code => codesToData[code])
    .sort((a, b) => a.name.localeCompare(b.name));

type PhoneInputType = {
    value?: string;
    defaultCountry: string;
    onChange?: Function;
    disabled: boolean;
}

const PhoneInput: React.FC<PhoneInputType> = ({ value, defaultCountry = "AM", onChange = () => {}, disabled }) => {
    const [phoneNumber, setPhoneNumber] = useState(value && `+${value}`);
    const [country, setCountry] = useState(defaultCountry.toLocaleUpperCase());
    const [open, setOpen] = useState(false);
    const input = useRef<any>();
    const isFirstTime = useRef(true);

    const pn = useMemo(() => new PhoneNumber(phoneNumber || "", country), [phoneNumber, country]);
    const countryCode = useMemo(() => pn.getCountryCode(), [country]);
    const internationalNumber = useMemo(
        () => (pn.getNumber("international") || "").replace(`+${countryCode} `, "") || phoneNumber,
        [countryCode, phoneNumber]
    );

    useEffect(() => {
        if (!value) {
            return;
        }
        setPhoneNumber(`+${value}`);
    }, [value]);

    useEffect(() => {
        if (pn.getRegionCode()) {
            setCountry(pn.getRegionCode());
        }
        if (isFirstTime.current) {
            isFirstTime.current = false;
            return;
        }
        onChange(pn);
    }, [phoneNumber]);

    const handleFocus = useCallback(() => {
        setOpen(true);
    }, []);
    const handleBlur = useCallback(() => {
        setOpen(false);
    }, []);
    const handleSelect = useCallback(code => {
        setCountry(code);
        setOpen(false);
        input.current.focus();
    }, []);
    const handleChange = useCallback(e => {
        setPhoneNumber(e.target.value);
    }, []);

    const width = open ? 170 : 80;

    return (
        <Input.Group compact>
            <Select
                disabled={disabled}
                style={{ transition: "width 0.3s ease-out", width }}
                showSearch
                value={country}
                optionLabelProp="label"
                onFocus={handleFocus}
                onBlur={handleBlur}
                onSelect={handleSelect}
                filterOption={(input, option) => option.props.text.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                dropdownMatchSelectWidth={170}
            >
                {regionList.map(region => (
                    <Select.Option key={region.code} label={region.emoji} text={`${region.code} ${region.name}`}>
                        {region.emoji} {region.name}
                    </Select.Option>
                ))}
            </Select>

            <Input
                disabled={disabled}
                ref={input}
                prefix={<span style={{ color: "#ccc" }}>{`+${countryCode}`}</span>}
                // className={styles[`prefix-${countryCode.toString().length + 1}`]}
                style={{
                    transition: "width 0.3s ease-out",
                    width: `calc(100% - ${width}px)`,
                    alignItems: "center",
                }}
                value={internationalNumber}
                onChange={handleChange}
            />
        </Input.Group>
    );
};

export default PhoneInput;
