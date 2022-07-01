import React, { useRef, useContext } from "react";
import { Checkbox, Input, InputNumber, Radio, Switch, DatePicker, Select } from "antd";
import get from "lodash/get";
import keyBy from "lodash/keyBy";
import isString from "lodash/isString";
import isArray from "lodash/isArray";
import { CameraProps, ConfigContext, PhoneNumberProps, SignatureProps, UploadProps } from '../../context/Config';
import Rate from "../Rate";
import BirthDay from "../Birthday";
import Signature from "../Signature";
import CascadeSelect from "../CascadeSelect";
import WebCam from "../WebCam";
import TermCondition from "../TermCondition";
import PhoneInput from "../PhoneInput";
import countryList from "../Country/list.json";
import Upload from "../Upload";

type FormElementProps = {
    item: any;
    form: any;
    readOnly?: boolean;
    disabled?: boolean;
    scrollToRef?: Function;
    handleCondition?: Function;
    handleSwitchChange?: Function;
    editable: boolean; 
}

const FormElement: React.FC<FormElementProps> = ({ 
    item, 
    readOnly = false, 
    disabled = false,
    scrollToRef = () => {},
    handleCondition = () => {},
    handleSwitchChange = () => {},
    editable,
}) => {
    const myRef = useRef(null);

    const { types } = useContext(ConfigContext);

    if (item.type === "multiple-choice") {
        return (
            <Radio.Group
                disabled={disabled || readOnly}
                style={{ display: "grid" }}
                options={item.options
                    .map((option) => (isString(option) ? option : get(option, "value", "").trim()))
                    .filter(Boolean)
                    .map((value) => ({ label: value, value }))}
            />
        );
    }
    if (item.type === "checkboxes") {
        return (
            <Checkbox.Group
                disabled={disabled || readOnly}
                style={{ display: "grid" }}
                options={item.options
                    .map((option) => (isString(option) ? option : get(option, "value", "").trim()))
                    .filter(Boolean)
                    .map((value) => ({ label: value, value }))}
            />
        );
    }
    if (item.type === "dropdown") {
        return (
            <Select
                id={item.id}
                ref={myRef}
                disabled={disabled || readOnly}
                showSearch
                allowClear={!item.required}
                onDropdownVisibleChange={() => scrollToRef(myRef)}
                placeholder={item.placeholder || item.question}
                mode={item.multipleMode ? "multiple" : undefined}
                options={(item.options || [])
                    .map((option) => (isString(option) ? option : get(option, "value", "").trim()))
                    .filter(Boolean)
                    .map((item) => ({ key: item, value: item }))}
            />
        );
    }
    if (item.type === "date-picker") {
        return (
            <DatePicker
                style={{ width: "100%" }}
                disabled={disabled || readOnly}
                allowClear={!item.required}
                placeholder={item.placeholder || item.question}
            />
        );
    }
    if (item.type === "number") {
        return (
            <InputNumber
                id={item.id}
                ref={myRef}
                disabled={disabled || readOnly}
                placeholder={item.placeholder || item.question}
                onClick={() => scrollToRef(myRef)}
            />
        );
    }
    if (item.type === "birthday") {
        return <BirthDay />;
    }
    if (item.type === "term-condition") {
        return (
            <TermCondition
                data={item}
                onChange={(value) => handleCondition(value)}
                disabled={disabled || readOnly}
            />
        );
    }
    if (item.type === "signature") {
        const options = types['signature'] as SignatureProps;

        return (
            <Signature
                onUpload={options.onUpload}
                onClick={(ref) => scrollToRef(ref)}
                editable={editable}
            />
        );
    }
    if (item.type === "camera") {
        const options = types['camera'] as CameraProps;

        return (
            <WebCam
                host={options.host}
                action={options.action}
                folder={options.folder}
                onScreenshotUpload={options.onScreenshotUpload}
                onDelete={options.onDelete}
                editable={editable}
            />
        );
    }
    if (item.type === "switch") {
        return (
            <Switch
                onChange={(value) => handleSwitchChange(item.name, value)}
                disabled={disabled || readOnly}
                checkedChildren={get(item, "options[0].value", "")}
                unCheckedChildren={get(item, "options[1].value", "")}
            />
        );
    }
    if (item.type === "checkbox") {
        return <Checkbox disabled={disabled || readOnly} />;
    }
    if (item.type === "phone-number") {
        const options = types['phone-number'] as PhoneNumberProps;
        const defaultCountry = options && get(keyBy(countryList, "name"), options.countryCode);

        return <PhoneInput disabled={disabled || readOnly} defaultCountry={defaultCountry} />;
    }
    if (item.type === "file-upload") {
        const options = types['file-upload'] as UploadProps;
        const attachments = isArray(item.options[0].value) ? item.options[0].value: [];

        return (
            <Upload
                attachments={attachments}
                host={options.host}
                action={options.action}
                folder={options.folder}
                onDelete={options.onDelete}
                editable={editable} 
            />
        )
    }
    if (item.type === "cascader") {
        return <CascadeSelect stages={item.stages} options={item.options} />;
    }
    if (item.type === "rating") {
        return <Rate />;
    }
    return (
        <Input
            ref={myRef}
            disabled={disabled || readOnly}
            id={item.type}
            placeholder={item.placeholder || item.question}
            onClick={() => scrollToRef(myRef)}
        />
    );
};

export default FormElement;
