import React, { useCallback } from "react";
import { Row, Col, Switch } from "antd";
import get from "lodash/get";
import set from "lodash/set";
import isString from "lodash/isString";

type QuestionSwitchOptionsType = {
    options: Array<any>;
    onChange: Function;
}

const QuestionSwitchOptions: React.FC<QuestionSwitchOptionsType> = ({ options = [], onChange = () => {} }) => {
    const handelSetOption = useCallback((e, index) => {
        set(options, `[${index}].value`, e.target.textContent.trim());
        onChange(options);
    }, options);

    const setOptionValidation = useCallback((value, index) => {
        set(options, `[${index}].validOption`, value);
        onChange(options);
    }, options);

    const handelSetValidateMessage = useCallback((e, index) => {
        set(options, `[${index}].validMessage`, e.target.textContent.trim());
        onChange(options);
    }, options);

    return (
        <div style={{ paddingLeft: 30, width: "60%" }}>
            <Row gutter={32}>
                <Col span={12}>
                    <Row>
                        <Col span={18}>
                            <h4
                                contentEditable={true}
                                placeholder={"Checked Label"}
                                onBlur={e => handelSetOption(e, 0)}
                                dangerouslySetInnerHTML={{
                                    __html: isString(options[0]) ? options[0] : get(options, "[0].value", ""),
                                }}
                            />
                            {!get(options, `[0].validOption`, true) && (
                                <h4
                                    contentEditable={true}
                                    placeholder={"Valid Message"}
                                    onBlur={e => handelSetValidateMessage(e, 0)}
                                    dangerouslySetInnerHTML={{
                                        __html: get(options, "[0].validMessage", ""),
                                    }}
                                />
                            )}
                        </Col>
                        <Col span={6}>
                            <Switch
                                style={{ marginBottom: 3 }}
                                disabled={!get(options, `[1].validOption`, true)}
                                size="small"
                                defaultChecked={get(options, `[0].validOption`, true)}
                                onChange={value => setOptionValidation(value, 0)}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    <Row>
                        <Col span={18}>
                            <h4
                                contentEditable={true}
                                placeholder={"Unchecked Label"}
                                onBlur={e => handelSetOption(e, 1)}
                                dangerouslySetInnerHTML={{
                                    __html: isString(options[1]) ? options[1] : get(options, "[1].value", ""),
                                }}
                            />
                            {!get(options, `[1].validOption`, true) && (
                                <h4
                                    contentEditable={true}
                                    placeholder={"Valid Message"}
                                    onBlur={e => handelSetValidateMessage(e, 1)}
                                    dangerouslySetInnerHTML={{
                                        __html: get(options, "[1].validMessage", ""),
                                    }}
                                />
                            )}
                        </Col>
                        <Col span={6}>
                            <Switch
                                style={{ marginBottom: 3 }}
                                disabled={!get(options, `[0].validOption`, true)}
                                size="small"
                                defaultChecked={get(options, `[1].validOption`, true)}
                                onChange={value => setOptionValidation(value, 1)}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default QuestionSwitchOptions;
