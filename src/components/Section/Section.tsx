import React, { useState, memo, useEffect, useRef, useContext } from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Divider, Popconfirm } from "antd";
import { Draggable, Droppable } from "react-beautiful-dnd";
import cloneDeep from "lodash/cloneDeep";
import { ConfigContext } from "../../context/Config";
import Page from "../Page";
import Question from "../Question";

const getListStyle = (isDraggingOver) => ({
    // background: isDraggingOver ? "lightblue" : "lightgrey",
});
const getItemStyle = (isDragging, { transform, ...draggableStyle }) => ({
    userSelect: "none",

    // background: isDragging ? "lightgreen" : "grey",

    ...draggableStyle,
    transform: transform && `translate(0, ${transform.substring(transform.indexOf(",") + 1, transform.indexOf(")"))})`,
});

type SectionProps = {
    data: any;
    association: Array<any>;
    showFormTitle: boolean;
    focusQuestion: number;
    sectionIndex: number;
    showValidateField: boolean;
    showAssociationField: boolean;
    showDependencyField: boolean;
    showInListOption?: boolean;
    showUniqueOption?: boolean;
    associationFieldRequired?: boolean;
    isExpert: boolean;
    focus: boolean;
    onChange: Function;
    onFocusSection: Function;
    onRemove: (e) => void;
}

const Section: React.FC<SectionProps> = memo(({
    data = {},
    association = [],
    showFormTitle = true,
    focusQuestion,
    sectionIndex,
    showValidateField,
    showAssociationField,
    showDependencyField,
    showInListOption,
    showUniqueOption,
    associationFieldRequired,
    isExpert,
    focus,
    onChange = () => {},
    onFocusSection = () => {},
    onRemove
}) => {

    const { translate } = useContext(ConfigContext);

    const [id, setId] = useState<number>(data.id || Date.now());
    const [questions, setQuestions] = useState<Array<any>>(data.questions || []);
    const [name, setName] = useState<string>(data.name || '');
    const [focusIndex, setFocusIndex] = useState<number>(focusQuestion);

    const firstUpdate = useRef(true);
    useEffect(() => {
        if(firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        const withCondition = questions.findIndex((item) => ["term-condition"].includes(item.type)) >= 0;
        onChange({ id, questions, name, description: data.description, withCondition });
    }, [questions, name]);

    const addQuestion = () => {
        const newState = [...questions, { id: Date.now() }];
        setQuestions(newState);
        setFocusIndex(questions.length - 1);
    }

    const removeQuestion = (index: number) => {
        const newState = [...questions];
        newState.splice(index, 1)
        setQuestions(newState);
        setFocusIndex(-1);
    };

    const setQuestion = (index: number, data: any) => {
        const newState = [...questions];
        newState[index] = data;
        setQuestions(newState);
    };

    const changeName = (e) => {
        setName(e.target.textContent.trim());
    }

    const focusIn = (focusIndex: number) => {
        setFocusIndex(focusIndex);
    }

    return (
        <Page inner dynamic id={`section-${data.id}`} onClick={() => onFocusSection(sectionIndex)}>
            {showFormTitle && (
                <div>
                    <h1
                        contentEditable={true}
                        placeholder={sectionIndex === 0 ? translate('form-title') : translate('section-title')}
                        onBlur={changeName}
                        dangerouslySetInnerHTML={{ __html: name }}
                    />
                </div>
            )}
            <Droppable droppableId={`droppable-section-${data.id}|${sectionIndex}`} type="questions">
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                        {questions.map((question, index) => (
                            <Draggable key={index} draggableId={"draggableQuestionId" + question.id} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                    >
                                        <Question
                                            showValidateField={showValidateField}
                                            showAssociationField={showAssociationField}
                                            showDependencyField={showDependencyField}
                                            associationFieldRequired={associationFieldRequired}
                                            key={question.id}
                                            sectionIndex={sectionIndex}
                                            questionIndex={index}
                                            data={question}
                                            focus={focus && index === focusIndex}
                                            onRemove={() => removeQuestion(index)}
                                            onChange={(questionData) => setQuestion(index, questionData)}
                                            focusIn={() => focusIn(index)}
                                            dragHandleProps={provided.dragHandleProps}
                                            association={cloneDeep(association)}
                                            questions={questions}
                                            isExpert={isExpert}
                                            showInListOption={showInListOption}
                                            showUniqueOption={showUniqueOption}
                                        />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        <div style={{ minHeight: 20 }}>{provided.placeholder}</div>
                    </div>
                )}
            </Droppable>
            <div>
                <a onClick={addQuestion}>
                    <PlusOutlined /> {translate('add-field')}
                </a>
                {!!onRemove && (
                    <>
                        <Divider type="vertical" />
                        <Popconfirm onConfirm={onRemove} title={translate('changes-will-be-lost')}>
                            <a>
                                <DeleteOutlined /> {translate('remove-section')}
                            </a>
                        </Popconfirm>
                    </>
                )}
            </div>
        </Page>
    );
})

export default Section;