import React, { memo, useEffect, useState, useRef, useContext } from "react";
import { Divider, Select, Switch, Tooltip, AutoComplete, Typography, message } from "antd";
import {
    DragOutlined,
    DashOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
    CheckSquareOutlined,
    DownCircleOutlined,
    CalendarOutlined,
    PhoneOutlined,
    NumberOutlined,
    BulbOutlined,
    UploadOutlined,
    CameraOutlined,
    StarOutlined,
} from "@ant-design/icons";
import store from "store2";
import startCase from "lodash/startCase";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import { ConfigContext } from '../../context/Config';
import QuestionOptions from '../QuestionOptions';
import CascaderOption from '../CascaderOption';
import TermConditionQuestion from '../TermConditionQuestion';
import QuestionSwitchOptions from '../QuestionSwitchOptions';
import FormUpload from '../FormUpload';

import './Question.less';

const { Text } = Typography;

type QuestionProps = {
    data: any;
    focus: boolean;
    association: Array<any>;
    questions: any;
    onRemove: Function;
    onChange: Function;
    focusIn: (e: any) => void;
    isExpert: boolean;
    showAssociationField: boolean;
    showDependencyField: boolean;
    showValidateField: boolean;
    showInListOption?: boolean;
    showUniqueOption?: boolean;
    sectionIndex: number;
    questionIndex: number; 
    dragHandleProps: any;
}

const Question: React.FC<QuestionProps> = memo(({
    data = {},
    focus = false,
    association: associationProps = [],
    questions,
    onRemove = () => {},
    onChange = () => {},
    focusIn = (e: any) => {},
    isExpert = false,
    showAssociationField = true,
    showDependencyField = true,
    showValidateField,
    showInListOption = false,
    showUniqueOption = false,
    sectionIndex,
    questionIndex,
    dragHandleProps
}) => {

    const { availableTypes, translations } = useContext(ConfigContext);

    const [state, setState] = useState<any>({
        id: data.id || Date.now(),
        name: data.name || "",
        stages: data.stages || [],
        question: data.question || "",
        placeholder: data.placeholder || "",
        required: data.required,
        showInDetails: data.showInDetails,
        unique: data.unique,
        depend: data.depend || "",
        type: data.type || "multiple-choice",
        hiddenField: ["signature", "camera"].includes(data.type) || false,
        options: data.options || [{ value: "Option 1", validOption: true }],
        focus: true,
        multipleMode: true
    })

    const firstUpdate = useRef(true);
    useEffect(() => {
        if(firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }

        const { 
            id, 
            name, 
            stages, 
            question, 
            placeholder, 
            required, 
            depend, 
            type, 
            options,
            multipleMode,
            showInDetails,
            unique,
            hiddenField
        } = state;

        onChange({
            id,
            name,
            stages,
            question,
            placeholder,
            required,
            depend,
            type,
            options,
            multipleMode,
            showInDetails,
            unique,
            hiddenField,
        });

    }, [state]);

    const changeState = (data: any) => {
        setState(oldState => ({ ...oldState, ...data }))
    }
    
    const setQuestion = (e) => {
        changeState({ question: e.target.textContent.trim() });
    };

    const setPlaceholder = (e) => {
        changeState({ placeholder: e.target.textContent.trim() });
    };

    const setDepend = (depend) => {
        changeState({ depend })
    };

    const setRequired = (required) => {
        changeState({ required });
    };

    const setShowInDetails = (showInDetails) => {
        changeState({ showInDetails });
    };
    
    const setUnique = (unique) => {
        const data: any = { unique }
        if (unique) {
            data.required = unique;
        }
        changeState(data);
    };

    const setMultipleMode = (multipleMode) => {
        changeState({ multipleMode });
    };

    const setOptions = (options) => {
        changeState({ options });
    };

    const setType = (type) => {
        const data: any = { type };
        if (["signature", "camera"].includes(type)) {
            data.hiddenField = true;
        }
        changeState(data);
    };

    const setName = (name) => {
        changeState({ name });
    };

    const setStages = (stages) => {
        changeState({ stages: stages || [] })
    };

    const handlePaste = () => {
        const { question, validateKey } = store.get("question-copy");
        if (Date.now() - validateKey > 10 * 60 * 1000) {
            message.warn(translations.copyAgain);
            store.remove("question-copy");
            return;
        }

        changeState({...question, id: Date.now()});
    };

    const classNames = ['question'];
    if(focus && state.focus) {
        classNames.push('focus');
    }

    const NameSelect = isExpert ? AutoComplete : Select;
    const association = cloneDeep(associationProps);

    questions.forEach((item) => {
        if (!item.name) {
            return;
        }
        const [name, ...arr] = item.name.split(".");
        const field = arr.join(".");
        let index = association.findIndex((a) => a.name === name);
        if (index === -1) {
            index = association.length;
            association.push({ name, fields: [] });
        }
        if (association[index].fields.includes(field)) {
            return;
        }
        if (field) {
            association[index].fields.push(field);
        }
    });

    return (
        <div
            className={classNames.join(' ')}
            id={`question-${data.id}`}
            onClick={focusIn}
        >
            <div style={{ textAlign: "center", display: "block" }}>
                <DragOutlined type="drag" {...dragHandleProps} className="tool" style={{ cursor: "move" }} />
            </div>
            <div className="question-row">
                <div>
                    <div className="question-name">
                        <h3
                            contentEditable={true}
                            placeholder="Question"
                            onBlur={setQuestion}
                            dangerouslySetInnerHTML={{ __html: state.question }}
                        />
                    </div>
                    <div className="question-body">
                        {["short-answer", "dropdown", "number"].includes(state.type) && (
                            <div style={{ paddingLeft: 30, width: "60%" }}>
                                <h5
                                    title="Placeholder"
                                    contentEditable={true}
                                    placeholder={"Placeholder"}
                                    onBlur={setPlaceholder}
                                    dangerouslySetInnerHTML={{ __html: state.placeholder || state.question }}
                                />
                            </div>
                        )}
                        {["multiple-choice", "checkboxes", "dropdown"].includes(state.type) && (
                            <QuestionOptions
                                id={data.id}
                                type={state.type}
                                showValidateField={showValidateField}
                                options={state.options}
                                onChange={setOptions}
                                sectionIndex={sectionIndex}
                                questionIndex={questionIndex}
                            />
                        )}
                        {["cascader"].includes(state.type) && (
                            <CascaderOption
                                associationList={association}
                                id={data.id}
                                stages={state.stages || []}
                                setStages={setStages}
                                options={state.options}
                                setOptions={setOptions}
                                isExpert={isExpert}
                            />
                        )}
                        {["switch"].includes(state.type) && (
                            <QuestionSwitchOptions options={state.options} onChange={setOptions} />
                        )}
                        {["term-condition"].includes(state.type) && (
                            <TermConditionQuestion options={state.options} setOptions={setOptions} />
                        )}
                        {["file-upload"].includes(state.type) && (
                            <FormUpload options={state.options} onChange={setOptions} />
                        )}
                    </div>
                </div>

                <div className="tool">
                    <div style={{ marginBottom: 10 }}>
                        <Text
                            copyable={{
                                onCopy: () =>
                                    store.set("question-copy", {
                                        question: state,
                                        validateKey: Date.now(),
                                    }),
                            }}
                        >
                            {translations.copyQuestion}
                        </Text>
                        <Divider type="vertical" />
                        <span onClick={handlePaste} style={{ cursor: "pointer" }}>
                            {translations.paste}
                        </span>
                        <Divider type="vertical" />
                    </div>
                    {showAssociationField && !["cascader"].includes(state.type) && (
                        <NameSelect
                            disabled={["term-condition"].includes(state.type)}
                            className="select"
                            defaultValue={state.name || undefined}
                            onBlur={isExpert && ((value) => setName(get(value, "target.value")))}
                            onChange={!isExpert && setName}
                            allowClear
                            placeholder="Association"
                            optionLabelProp={isExpert ? "value" : undefined}
                        >
                            {association.map((item) =>
                                item.fields.length ? (
                                    <Select.OptGroup key={item.name} label={startCase(item.name)}>
                                        {item.fields.map((field) => (
                                            <NameSelect.Option key={`${item.name}.${field}`}>
                                                <small>{startCase(item.name)}</small> ??? {startCase(field)}
                                            </NameSelect.Option>
                                        ))}
                                    </Select.OptGroup>
                                ) : item.allowNull ? null : (
                                    <NameSelect.Option key={item.name}>{startCase(item.name)}</NameSelect.Option>
                                )
                            )}
                        </NameSelect>
                    )}
                    <Select
                        className="select"
                        defaultValue={state.type}
                        onChange={setType}
                        getPopupContainer={(trigger) => trigger.parentNode}
                    >
                        {availableTypes.includes('term-condition') && (
                            <Select.Option value="term-condition">
                                <DashOutlined /> {translations.termCondition}
                            </Select.Option>
                        )}
                        {availableTypes.includes('signature') && (
                            <Select.Option value="signature">
                                <DashOutlined /> {translations.signature}
                            </Select.Option>
                        )}
                        {availableTypes.includes('short-answer') && (
                            <Select.Option value="short-answer">
                                <DashOutlined /> {translations.shortAnswer}
                            </Select.Option>
                        )}
                        {availableTypes.includes('multiple-choice') && (
                            <Select.Option value="multiple-choice">
                                <CheckCircleOutlined /> {translations.multipleChoice}
                            </Select.Option>
                        )}
                        {availableTypes.includes('cascader') && (
                            <Select.Option value="cascader">
                                <CheckCircleOutlined /> {translations.cascader}
                            </Select.Option>
                        )}
                        {availableTypes.includes('checkboxes') && (
                            <Select.Option value="checkboxes">
                                <CheckSquareOutlined /> {translations.checkboxes}
                            </Select.Option>
                        )}
                        {availableTypes.includes('dropdown') && (
                            <Select.Option value="dropdown">
                                <DownCircleOutlined /> {translations.dropdown}
                            </Select.Option>
                        )}
                        {availableTypes.includes('date-picker') && (
                            <Select.Option value="date-picker">
                                <CalendarOutlined /> {translations.datePicker}
                            </Select.Option>
                        )}
                        {availableTypes.includes('phone-number') && (
                            <Select.Option value="phone-number">
                                <PhoneOutlined /> {translations.phoneNumber}
                            </Select.Option>
                        )}
                        {availableTypes.includes('birthday') && (
                            <Select.Option value="birthday">
                                <CalendarOutlined /> {translations.birthDay}
                            </Select.Option>
                        )}
                        {availableTypes.includes('number') && (
                            <Select.Option value="number">
                                <NumberOutlined /> {translations.number}
                            </Select.Option>
                        )}
                        {availableTypes.includes('switch') && (
                            <Select.Option value="switch">
                                <BulbOutlined /> {translations.switch}
                            </Select.Option>
                        )}
                        {availableTypes.includes('camera') && (
                            <Select.Option value="camera">
                                <CameraOutlined /> {translations.camera}
                            </Select.Option>
                        )}
                        {availableTypes.includes('file-upload') && (
                            <Select.Option value="file-upload">
                                <UploadOutlined /> {translations.fileUpload}
                            </Select.Option>
                        )}
                        
                        {availableTypes.includes('rating') && (
                            <Select.Option value="rating">
                                <StarOutlined /> {translations.rating}
                            </Select.Option>
                        )}
                    </Select>
                    {state.type === "dropdown" && (
                        <div style={{ marginBottom: 9 }}>
                            <label>
                                {translations.multipleMode}{" "}
                                <Switch
                                    size="small"
                                    defaultChecked={!!data.multipleMode}
                                    onChange={setMultipleMode}
                                />
                            </label>
                        </div>
                    )}
                    {showDependencyField && (
                        <Select
                            disabled={["term-condition"].includes(state.type)}
                            className="select"
                            defaultValue={state.depend || undefined}
                            onChange={setDepend}
                            placeholder="Depends from switch"
                            allowClear
                            getPopupContainer={(trigger) => trigger.parentNode}
                        >
                            {questions
                                .filter((item) => item.type === "switch" && !!(item.question || "").trim())
                                .map((item) => (
                                    <Select.Option key={item.name || item.question}>{item.question}</Select.Option>
                                ))}
                        </Select>
                    )}
                </div>
            </div>
            <div className="tools">
                <Tooltip title="Delete">
                    <DeleteOutlined
                        className="action-icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                    />
                </Tooltip>
                {state.type !== "file-upload" && showInListOption && (
                        <>
                            <Divider type="vertical" />
                            <label>
                                {translations.show}
                                <Switch
                                    size="small"
                                    defaultChecked={state.showInDetails}
                                    onChange={setShowInDetails}
                                />
                            </label>
                        </>
                    )}
                {state.type === "short-answer" && showUniqueOption && (
                        <>
                            <Divider type="vertical" />
                            <label>
                                {translations.unique}
                                <Switch size="small" defaultChecked={state.unique} onChange={setUnique} />
                            </label>
                        </>
                    )}
                {!(["term-condition"].includes(state.type) || state.unique) && (
                    <>
                        <Divider type="vertical" />
                        <label>
                            {translations.required}{" "}
                            <Switch size="small" defaultChecked={state.required} onChange={setRequired} />
                        </label>
                    </>
                )}
            </div>
        </div>
    );
})

export default Question;
