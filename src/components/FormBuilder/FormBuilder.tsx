import React, { useContext, useEffect, useState } from "react";
import { Form, FormInstance } from "antd";
import moment from "moment";
import isString from "lodash/isString";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import set from "lodash/set";
import uniq from "lodash/uniq";
import { ConfigContext } from "../../context/Config";
import { normalize as phoneInputNormalize, validator as phoneInputValidator } from "../PhoneInput";
import formElement from "../FormElement";

const width = window.innerWidth;

const mainFormItemDefaultLayout = {
    labelCol: {
        style: { fontSize: 16, width: "100%" },
    },
};

const mainFormItemLayouts = {
    "multiple-choice": { ...mainFormItemDefaultLayout, wrapperCol: { span: 24 } },
    "term-condition": { ...mainFormItemDefaultLayout, wrapperCol: { span: 24 } },
    checkboxes: { ...mainFormItemDefaultLayout, wrapperCol: { span: 24 } },
};

const optionsMap = {};

const calcOptionsMap = (item) => {
    const setOptionMap = (options) => {
        options.forEach((option) => {
            const path = isString(option) ? `${item.id}[value-${option}]` : `${item.id}[value-${option.value}]`;
            const value = isString(option)
                ? { value: option, validOption: true }
                : {
                      value: option.value,
                      validOption: get(option, "validOption", true),
                      validMessage: get(option, "validMessage", "not valid"),
                  };

            set(optionsMap, path, value);
        });
    };

    if (isEmpty(optionsMap[item.id])) {
        if (["switch"].includes(item.type)) {
            const [option1, option2] = item.options;
            setOptionMap([
                { ...option1, value: true },
                { ...option2, value: false },
            ]);
            return;
        }

        setOptionMap(item.options);
    }
};

const getNormalizer = (item) => {
    if (item.type === "phone-number") {
        return phoneInputNormalize;
    }
    return undefined;
};

const getRules = (item, form, translations) => {
    const disabled = item.depend ? !form.getFieldValue(item.depend) : false;
    const rules: any = [
        {
            required: !disabled && item.required,
            message: `${item.question} is required`,
        },
    ];
    if (["multiple-choice", "checkboxes", "dropdown", "switch"].includes(item.type)) {
        rules.push({
            validator: (rule, value) => {
                const valueRules = get(optionsMap, `${item.id}.value-${value}`, { validOption: true });
                if (!valueRules.validOption) {
                    return Promise.reject(valueRules.validMessage);
                }

                return Promise.resolve();
            },
        });
    }
    if (item.question === "Email") {
        rules.push({
            type: "email",
            message: translations.emailValidationMessage,
        });
    }
    if (item.question === "Phone Number") {
        rules.push({
            pattern: /^[0-9\s\-()]+$/i,
            message: translations.phoneValidationMessage,
        });
    }
    if (item.type === "number") {
        rules.push({
            pattern: /^[0-9]+$/i,
            message: translations.numberValidationMessage,
        });
    }
    if (item.type === "phone-number") {
        rules.push({ validator: phoneInputValidator });
    }

    return rules;
};

const getValuePropName = (item) => {
    if (["switch"].includes(item.type)) {
        return "checked";
    }
    return "value";
};

type FormBuilderProps = {
    form: FormInstance;
    defaultQuestions: Array<any>;
    data: any;
    editable?: boolean;
    readOnly?: boolean;
    filterHidden?: boolean;
    formItemDefaultLayout?: any;
    formItemLayouts?: any;
    wrapper?: any;
    handleCondition?: Function;
    fulfillCondition?: boolean;
}

const FormBuilder: React.FC<FormBuilderProps> = ({
    form,
    defaultQuestions = [],
    data = {},
    handleCondition = () => {},
    editable = false,
    readOnly = false,
    filterHidden = true,
    formItemDefaultLayout = mainFormItemDefaultLayout,
    formItemLayouts = mainFormItemLayouts,
    wrapper: Wrapper,
    fulfillCondition = false
}) => {

    const dependFieldList = uniq(defaultQuestions.map(item => item.depend).filter(Boolean));
    const { translations } = useContext(ConfigContext);
    const [dependFieldValues, setDependFieldValues] = useState<any>({});

    const scrollToRef = (ref) => {
        if (width <= 978) {
            const element = document.getElementById(get(ref, "current.props.id"));
            if (!element) {
                return;
            }
            element.scrollIntoView();
        }
    };

    const getValue = (item, data) => {
        const key = item.name || item.question;
        if (item.type === "date-picker") {
            if (!get(data, key)) {
                return;
            }
            return moment(get(data, key));
        }
        if (item.type === "switch") {
            return get(data, key, false);
        }
        if (item.type === "cascader") {
            return item.stages.reduce((acc, stage) => {
                const val = get(data, stage);
                if (!val) {
                    return acc;
                }
                acc[stage] = val;
                return acc;
            }, {});
        }
        return get(data, key);
    };

    const handleSwitchChange = (name, value) => {
        if(!dependFieldList.includes(name)) {
            return;
        }
        setDependFieldValues((values) => ({ ...values, [name]: value }));
    }

    const elementProps = (item, disabled) => ({ 
        item,
        form,
        handleCondition,
        editable,
        readOnly,
        scrollToRef,
        handleSwitchChange,
        disabled,
        fulfillCondition
    });

    return (
        <>
        {
            defaultQuestions
            .filter((item) => item.name || item.question || item.type === "static-text")
            .filter((item) => (!readOnly && filterHidden ? !item.hiddenField : true))
            .map((item, index) => {
                const path = (item.name || item.question).split(".");

                const formLayouts = formItemLayouts[item.type] || formItemDefaultLayout;

                const isDisabled = item.depend ? !get(data, item.depend, dependFieldValues[item.depend]) : false;

                if (["multiple-choice", "checkboxes", "dropdown", "switch"].includes(item.type)) {
                    calcOptionsMap(item);
                }

                if (["cascader"].includes(item.type)) {
                    path.unshift("cascader");
                }

                const FormItemElement = (options: any = {}) => (
                    <Form.Item
                        name={path}
                        key={index}
                        label={options.showLabel && !["term-condition"].includes(item.type) ? item.question : undefined}
                        valuePropName={getValuePropName(item)}
                        normalize={getNormalizer(item)}
                        initialValue={getValue(item, data)}
                        rules={getRules(item, form, translations)}
                        {...formLayouts}
                    >
                        {formElement({ ...elementProps(item, isDisabled) })}
                    </Form.Item>
                );
                if (Wrapper) {
                    return <Wrapper key={index} renderItem={(props) => <FormItemElement {...props} />} />;
                }
                return <FormItemElement key={index} showLabel />;
            })
        }
        </>
    ) 
};

export default FormBuilder;
