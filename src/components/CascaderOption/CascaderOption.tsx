import React, { useState, useCallback, useContext, useRef } from "react";
import { Row, Col, Button, Select } from "antd";
import { PlusSquareOutlined, DeleteOutlined } from "@ant-design/icons";
import uniq from "lodash/uniq";
import isEmpty from "lodash/isEmpty";
import isUndefined from "lodash/isUndefined";
import isNumber from "lodash/isNumber";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import set from "lodash/set";
import unset from "lodash/unset";
import update from "lodash/update";
import startCase from "lodash/startCase";
import { ConfigContext } from "../../context/Config";

import "./CascaderOption.less";

type CascaderOptionProps = {
    id: string;
    associationList: any;
    isExpert: boolean;
    stages: Array<any>;
    options: Array<any>;
    setStages: Function;
    setOptions: Function;
}

const CascaderOption: React.FC<CascaderOptionProps> = ({
    associationList,
    isExpert,
    stages = [],
    options = [{ value: "stage 1 option  0", label: "stage 1 option 0" }],
    setStages,
    setOptions,
}) => {
    const { translate } = useContext(ConfigContext);
    const [stateStage, setStateStage] = useState(stages);
    const section = useRef(stages.length ? stages[0].split(".")[0] : null);

    const handleSetStage = stageList => {
        if (!stageList.filter(item => !item).length) {
            setStages(stageList);
        }
        setStateStage(stageList);
    };

    const handleAddOption = useCallback(
        (adress = []) => {
            const optionList = cloneDeep(options);
            const currentOption = get(optionList, adress.join(".children."));
            if (adress.length) {
                if (isEmpty(currentOption.children)) {
                    currentOption.children = [];
                }
                currentOption.children.push({
                    value: `${stateStage[adress.length]} option ${[...adress, currentOption.children.length].join(
                        "."
                    )}`,
                    label: `${stateStage[adress.length]} option ${[...adress, currentOption.children.length].join(
                        "."
                    )}`,
                });
            } else {
                optionList.push({
                    value: `${stateStage[0]} option ${optionList.length}`,
                    label: `${stateStage[0]} option ${optionList.length}`,
                });
            }
            setOptions(optionList);
        },
        [stages, options]
    );

    const handleStageSelect = useCallback(
        (newName, index) => {
            const stagesList = [...stateStage];
            stagesList[index] = newName;

            if (isUndefined(newName) && !!section.current) {
                if (!stateStage.filter(stage => (stage || "").includes(section.current)).length) {
                    section.current = null;
                }

                handleSetStage(uniq(stagesList));
                return;
            }
            const [choosenSection] = newName.split(".");
            section.current = choosenSection;
            handleSetStage(uniq(stagesList));
        },
        [stages, section.current]
    );

    const handleChangeOption = useCallback(
        (newOptionValue, adress) => {
            if (!newOptionValue) {
                return;
            }
            const optionList = cloneDeep(options);
            set(optionList, `${adress.join(".children.")}.value`, newOptionValue);
            set(optionList, `${adress.join(".children.")}.label`, newOptionValue);
            setOptions(optionList);
        },
        [options]
    );

    const handleRemoveOption = useCallback(
        (adress = []) => {
            //todo tgxa es aveli lav gri
            const optionList = cloneDeep(options);
            const lastIndex = adress.pop();
            const adressString = adress.join(".children.");
            if (adress.length && isNumber(lastIndex)) {
                update(optionList, adressString, item => {
                    item.children.splice(lastIndex, 1);
                    if (isEmpty(item.children)) {
                        item.children = [];
                    }
                    // apushutyun a bayc navsiaki
                    item.children = item.children.filter(Boolean);
                    return item;
                });
            } else {
                optionList.splice(lastIndex, 1);
            }
            setOptions(optionList);
        },
        [stages, options]
    );

    const handleRemoveStage = useCallback(() => {
        const stagesList = [...stateStage];
        stagesList.pop();
        handleSetStage(stagesList);

        const resultData = cloneDeep(options);

        const removeLastChildren = (optionData, adress, recurseCount) => {
            optionData.forEach((item, index) => {
                adress[recurseCount] = index;
                if (recurseCount < stagesList.length - 1 && item.children) {
                    removeLastChildren(item.children, adress, recurseCount + 1);
                    return;
                }
                unset(resultData, `${adress.join(".children.")}.children`);
            });
            return null;
        };

        setOptions(resultData);

        removeLastChildren(options, new Array(stagesList.length).fill(0), 0);
    }, [stages, options]);

    const renderList = (optionsList, stageNumber, adress) => {
        const res = [];
        const spanLength = Math.round(24 / (stateStage.length - stageNumber));
        optionsList.forEach((element, index) => {
            if (!element) {
                return res;
            }
            const currentAdress = [...adress, index];
            if (!!element && element.hasOwnProperty("children") && !isEmpty(element.children)) {
                res.push(
                    <Row style={{ marginTop: 10 }} gutter={24}>
                        <Col span={spanLength}>
                            <Row>
                                <Button
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleRemoveOption(currentAdress)}
                                />
                                <h4
                                    style={{ width: "90%" }}
                                    contentEditable={true}
                                    placeholder={translate('option')}
                                    onBlur={e => handleChangeOption(get(e, "target.textContent").trim(), currentAdress)}
                                    dangerouslySetInnerHTML={{
                                        __html: element.value,
                                    }}
                                />
                                <Button
                                    type="primary"
                                    size="small"
                                    icon={<PlusSquareOutlined />}
                                    onClick={() => handleAddOption(currentAdress)}
                                />
                            </Row>
                        </Col>
                        <Col span={24 - spanLength}>{renderList(element.children, stageNumber + 1, currentAdress)}</Col>
                    </Row>
                );
                return;
            }
            res.push(
                <Row style={{ marginTop: 5 }}>
                    <Button icon={<DeleteOutlined />} onClick={() => handleRemoveOption(currentAdress)} />
                    <h4
                        style={{ width: "90%" }}
                        contentEditable={true}
                        placeholder={translate('option')}
                        onBlur={e => handleChangeOption(get(e, "target.textContent").trim(), currentAdress)}
                        dangerouslySetInnerHTML={{
                            __html: element.value,
                        }}
                    />
                    {currentAdress.length < stateStage.length && (
                        <Button
                            type="primary"
                            icon={<PlusSquareOutlined />}
                            onClick={() => handleAddOption(currentAdress)}
                        />
                    )}
                </Row>
            );
        });
        return res;
    };

    return (
        <>
            <Row>
                <div style={{ paddingLeft: 30, width: "60%" }}>
                    {stateStage.map((stage, index) => (
                        <Row style={{ paddingLeft: 10 + index * 10 }}>
                            {!isExpert ? (
                                <Select
                                    defaultValue={stage}
                                    allowClear
                                    style={{ width: "100%" }}
                                    onChange={value => handleStageSelect(value, index)}
                                >
                                    {associationList.map(item =>
                                        item.fields.length ? (
                                            <Select.OptGroup key={item.name} label={startCase(item.name)}>
                                                {item.fields.map(field => (
                                                    <Select.Option
                                                        disabled={!!section.current && item.name !== section.current}
                                                        key={`${item.name}.${field}`}
                                                    >
                                                        <small>{startCase(item.name)}</small> → {startCase(field)}
                                                    </Select.Option>
                                                ))}
                                            </Select.OptGroup>
                                        ) : null
                                    )}
                                </Select>
                            ) : (
                                <h3
                                    style={{ width: "100%" }}
                                    contentEditable={true}
                                    placeholder={translate('association')}
                                    onBlur={e => handleStageSelect(get(e, "target.textContent").trim(), index)}
                                    dangerouslySetInnerHTML={{ __html: stage }}
                                />
                            )}
                        </Row>
                    ))}
                    <div className="question-option-text">
                        <h4>
                            <span
                                onClick={() => handleSetStage(uniq([...stateStage, undefined]))}
                                style={{ cursor: "pointer" }}
                            >
                                <span className="action">{translate('add-stage')}</span>
                            </span>
                            <span onClick={handleRemoveStage} style={{ marginLeft: 10, cursor: "pointer" }}>
                                <span className="action">{translate('remove-stage')}</span>
                            </span>
                        </h4>
                    </div>
                </div>
            </Row>
            {!!stateStage.filter(Boolean).length &&
                (!stateStage.filter(stage => !(stage || "").includes(section.current)).length || isExpert) && (
                    <>
                        <Row>
                            {stateStage.map((item, index) => (
                                <Col span={Math.floor(24 / stateStage.length)}>
                                    <Row>
                                        {!index && (
                                            <Button
                                                type="primary"
                                                size="small"
                                                icon={<PlusSquareOutlined />}
                                                onClick={() => handleAddOption()}
                                            />
                                        )}
                                        <h5 style={{ width: "90%", borderBottom: "1px dashed" }}>{startCase(item)}</h5>
                                    </Row>
                                </Col>
                            ))}
                        </Row>
                        <>{renderList(options, 0, [])}</>
                    </>
                )}
        </>
    );
};

export default CascaderOption;