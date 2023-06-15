import React, { memo, useEffect, useRef, useState, useContext } from "react";
import { Checkbox, Radio, Switch } from "antd";
import { DeleteOutlined, DragOutlined } from "@ant-design/icons";
import { Draggable, Droppable } from "react-beautiful-dnd";
import isString from "lodash/isString";
import set from "lodash/set";
import get from "lodash/get";
import { ConfigContext } from "../../context/Config";

import "./QuestionOptions.less";

const getListStyle = isDraggingOver => ({
    // background: isDraggingOver ? "lightblue" : "lightgrey",
});

const getItemStyle = (isDragging, { transform, ...draggableStyle }) => ({
    userSelect: "none",

    // background: isDragging ? "lightgreen" : "grey",

    ...draggableStyle,
    transform: transform && `translate(0, ${transform.substring(transform.indexOf(",") + 1, transform.indexOf(")"))})`,
});

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

type QuestionOptionsProps = {
    id: string;
    type: string;
    questionIndex: number;
    sectionIndex: number;
    showValidateField: boolean;
    options: Array<any>;
    onChange: Function;
}

const QuestionOptions: React.FC<QuestionOptionsProps> = memo(({
    id,
    type,
    questionIndex,
    sectionIndex,
    showValidateField,
    options: optionsProps = [],
    onChange = () => {}
}) => {

    const { translate } = useContext(ConfigContext);

    const [focusState, setFocusState] = useState<any>({
        focus: false,
        focusIndex: true,
    });
    const [key, setKey] = useState<number>();
    const [options, setOptions] = useState<Array<any>>(optionsProps);

    const firstUpdate = useRef(true);
    useEffect(() => {
        if(firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        onChange(options);
    }, [options])

    const changeFocusState = (data: any) => {
        setFocusState((oldState => ({...oldState, ...data})));
    }
    
    const setOption = (e, index) => {
        const newState = [...options];
        set(newState, `[${index}].value`, e.target.textContent.trim());
        setOptions(newState);
    };

    const setValidMessage = (e, index) => {
        const newState = [...options];
        set(newState, `[${index}].validMessage`, e.target.textContent.trim());
        setOptions(newState);
    };
   
    const setOptionValidation = (value, index) => {
        const newState = [...options];
        set(newState, `[${index}].validOption`, value);
        setOptions(newState);
        setKey(Date.now());
    };

    const addOption = () => {
        const newState = [...options];
        newState.push({ value: "", validOption: true });
        setOptions(newState);
        // setFocusState({ focus: true, focusIndex: newState.length - 1 })
    };

    const removeOption = (index, focus = true) => {
        const newState = [...options];
        newState.splice(index, 1);
        setOptions(newState);
        // setFocusState({ focus, focusIndex: index - 1 })
    };
    
    return (
        <div className="question-options">
            <Droppable
                droppableId={`droppable-option-${id}|${sectionIndex}|${questionIndex}`}
                type={`options-${id}`}
            >
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                        {options.map((option, index) => (
                            <Draggable key={index} draggableId={`draggableOptionId--${id}-${index}`} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        className="question-option"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                    >
                                        <div className="drag-handle" {...provided.dragHandleProps}>
                                            <DragOutlined />
                                        </div>

                                        <div className="question-option-component">
                                            {type === "multiple-choice" && <Radio disabled />}
                                            {type === "checkboxes" && <Checkbox disabled />}
                                            {type === "dropdown" && <span>{index + 1}.</span>}
                                        </div>
                                        <div className="question-option-text">
                                            <h4
                                                contentEditable={true}
                                                placeholder={translate('option')}
                                                onBlur={e => setOption(e, index)}
                                                dangerouslySetInnerHTML={{
                                                    __html: isString(option) ? option : get(option, "value", ""),
                                                }}
                                                ref={ref => {
                                                    if (focus && ref && index === focusState.focusIndex) {
                                                        changeFocusState({ focus: false });
                                                        ref.focus();
                                                        const range = document.createRange();
                                                        range.selectNodeContents(ref);
                                                        const sel = window.getSelection();
                                                        sel.removeAllRanges();
                                                        sel.addRange(range);
                                                    }
                                                }}
                                                onKeyDown={(e: any) => {
                                                    if ([13, 38, 40].includes(e.keyCode)) {
                                                        e.preventDefault();
                                                    }
                                                    if ([8, 46].includes(e.keyCode)) {
                                                        e.target.dataset.text = e.target.textContent;
                                                    }
                                                }}
                                                onKeyUp={(e: any) => {
                                                    if ([8, 46].includes(e.keyCode) && !e.target.dataset.text) {
                                                        removeOption(index);
                                                    }
                                                    if (e.keyCode === 13) {
                                                        e.preventDefault();
                                                        if (index === options.length - 1) {
                                                            addOption();
                                                        } else {
                                                            changeFocusState({
                                                                focus: true,
                                                                focusIndex: index + 1,
                                                            });
                                                        }
                                                    }
                                                    if (e.keyCode === 38 && index > 0) {
                                                        changeFocusState({
                                                            focus: true,
                                                            focusIndex: index - 1,
                                                        });
                                                    }
                                                    if (e.keyCode === 40 && index < options.length - 1) {
                                                        changeFocusState({
                                                            focus: true,
                                                            focusIndex: index + 1,
                                                        });
                                                    }
                                                }}
                                            />
                                            {!get(options, `[${index}].validOption`, true) && (
                                                <h4
                                                    contentEditable={true}
                                                    placeholder={translate('validation-message')}
                                                    onBlur={e => setValidMessage(e, index)}
                                                    dangerouslySetInnerHTML={{
                                                        __html: get(option, "validMessage", ""),
                                                    }}
                                                    ref={ref => {
                                                        if (focus && ref && index === focusState.focusIndex) {
                                                            changeFocusState({ focus: false });
                                                            ref.focus();
                                                            const range = document.createRange();
                                                            range.selectNodeContents(ref);
                                                            const sel = window.getSelection();
                                                            sel.removeAllRanges();
                                                            sel.addRange(range);
                                                        }
                                                    }}
                                                    onKeyDown={(e: any) => {
                                                        if ([13, 38, 40].includes(e.keyCode)) {
                                                            e.preventDefault();
                                                        }
                                                        if ([8, 46].includes(e.keyCode)) {
                                                            e.target.dataset.text = e.target.textContent;
                                                        }
                                                    }}
                                                    onKeyUp={(e: any) => {
                                                        if ([8, 46].includes(e.keyCode) && !e.target.dataset.text) {
                                                            removeOption(index);
                                                        }
                                                        if (e.keyCode === 13) {
                                                            e.preventDefault();
                                                            if (index === options.length - 1) {
                                                                addOption();
                                                            } else {
                                                                changeFocusState({
                                                                    focus: true,
                                                                    focusIndex: index + 1,
                                                                });
                                                            }
                                                        }
                                                        if (e.keyCode === 38 && index > 0) {
                                                            changeFocusState({
                                                                focus: true,
                                                                focusIndex: index - 1,
                                                            });
                                                        }
                                                        if (e.keyCode === 40 && index < options.length - 1) {
                                                            changeFocusState({
                                                                focus: true,
                                                                focusIndex: index + 1,
                                                            });
                                                        }
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div className="tool">
                                            {showValidateField && (
                                                <Switch
                                                    style={{ marginBottom: 3 }}
                                                    disabled={options.length <= 1}
                                                    size="small"
                                                    defaultChecked={get(options, `[${index}].validOption`, true)}
                                                    onChange={value => setOptionValidation(value, index)}
                                                />
                                            )}
                                            <DeleteOutlined
                                                className="action-icon"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    removeOption(index, false);
                                                }}
                                            />
                                        </div>
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Draggable>
                        ))}
                    </div>
                )}
            </Droppable>
            <div className="tool">
                <div className="question-option">
                    <div />
                    <div className="question-option-component">
                        {type === "multiple-choice" && <Radio disabled />}
                        {type === "checkboxes" && <Checkbox disabled />}
                    </div>
                    <div className="question-option-text">
                        <h4>
                            <span onClick={addOption} style={{ cursor: "pointer" }}>
                                <span className="action">{translate('add-other-option')}</span>
                            </span>
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    );
})

export default QuestionOptions;
