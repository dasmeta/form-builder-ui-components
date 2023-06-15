import React, { useEffect, useState, useRef, useContext, ReactElement } from "react";
import { ColumnHeightOutlined, EyeInvisibleOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { Divider, Typography, message } from "antd";
import store from "store2";
import { DragDropContext } from "react-beautiful-dnd";
import cloneDeep from "lodash/cloneDeep";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import { ConfigContext } from "../../context/Config";
import Section from "../Section";
import Form from "../Form";

import "./FormEditor.less";

const { Text } = Typography;

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const getSectionIndex = (droppableId) => {
    const arr = droppableId.split("|");
    arr.shift();
    const [sectionIndex] = arr.map(Number);
    return sectionIndex;
};

type FormEditorProps = {
    title: string;
    description?: string;
    showValidateField: boolean;
    showAssociationField?: boolean;
    showDependencyField?: boolean;
    showAddSection?: boolean;
    showFormTitle?: boolean;
    showInListOption?: boolean;
    showUniqueOption?: boolean;
    isExpert: boolean;
    beautifulPreview?: boolean;
    association?: Array<any>;
    sections: Array<any>;
    successText?: ReactElement;
    onSave: (data: any) => Promise<any>;
};

const FormEditor: React.FC<FormEditorProps> = ({
    title,
    description,
    showValidateField = false,
    showAssociationField = true,
    showDependencyField = true,
    showAddSection = true,
    showFormTitle = true,
    showInListOption = false,
    showUniqueOption = false,
    isExpert = false,
    beautifulPreview = true,
    successText,
    association = [],
    sections = [],
    onSave = async () => {}
}) => {

    const { translate, prefix } = useContext(ConfigContext);

    const [state, setState] = useState<any>({
        sections: [],
        name: "",
        logo: "",
        backgroundImage: "",
        preview: false,
        lastData: {},
        focusSection: -1,
        focusQuestion: -1,
    });

    const [updating, setUpdating] = useState<boolean>(false);
    const [preview, setPreview] = useState<boolean>(false);

    const changeState = (data: any) => {
        setState(oldState => ({...oldState, ...data}));
    }

    useEffect(() => {
        changeState({
            sections,
            name: title || "",
            lastData: cloneDeep({ sections }),
        })
    }, []);

    const firstUpdate = useRef(true);
    useEffect(() => {
        if(firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }

        const { sections, lastData } = state;

        const data = {
            sections
        };

        if(!isEqual(lastData, data)) {
            setUpdating(true);
            changeState({ lastData: cloneDeep(data) });

            onSave(data).then(() => {
                new Promise((resolve) => setTimeout(resolve, 777 + Math.random() * 777)).then(() => {
                    setUpdating(false);
                });
            })
        }
    }, [state.sections]);

    const addSection = () => {
        const newState = [...state.sections, { id: Date.now() }];
        changeState({ sections: newState });
    }

    const removeSection = (index: number) => {
        const newState = [...state.sections];
        newState.splice(index, 1);
        changeState({ sections: newState });
    }

    const setSection = (index: number, data: any) => {
        const newState = [...state.sections];
        let newName = state.name;
        newState[index] = data;
        if(index === 0) {
            newName = data.name;
        }
        changeState({
            sections: newState,
            name: newName
        })
    }

    const handleFocusSection = (section: number) => {
        if (state.focusSection === section) {
            return;
        }

        changeState({
            focusSection: section,
            focusQuestion: -1
        })
    };

    const handleDragEnd = (result: any) => {
        if (!result.destination) {
            return;
        }

        const newState = [...state.sections];
        if (result.source.droppableId.includes("droppable-option-")) {
            const arr = result.source.droppableId.split("|");
            arr.shift();
            const [sectionIndex, questionIndex] = arr.map(Number);
            const { options } = newState[sectionIndex].questions[questionIndex];

            newState[sectionIndex].questions[questionIndex].id = Date.now();
            newState[sectionIndex].questions[questionIndex].options = reorder(
                options,
                result.source.index,
                result.destination.index
            );

            changeState({
                sections: newState,
                focusSection: sectionIndex,
                focusQuestion: questionIndex
            })
            return;
        }

        if (result.destination.droppableId === result.source.droppableId) {
            const sectionIndex = getSectionIndex(result.source.droppableId);
            const { questions } = newState[sectionIndex];

            newState[sectionIndex].id = Date.now();
            newState[sectionIndex].questions = reorder(questions, result.source.index, result.destination.index);

            changeState({
                sections: newState,
                focusSection: sectionIndex,
                focusQuestion: result.destination.index
            })

            return;
        }

        const sourceSectionIndex = getSectionIndex(result.source.droppableId);
        const destinationSectionIndex = getSectionIndex(result.destination.droppableId);

        newState[sourceSectionIndex].id = Date.now();
        const [removed] = newState[sourceSectionIndex].questions.splice(result.source.index, 1);

        newState[destinationSectionIndex].id = Date.now() + 1;
        newState[destinationSectionIndex].questions.splice(result.destination.index, 0, removed);

        changeState({
            sections: newState,
            focusSection: destinationSectionIndex,
            focusQuestion: result.destination.index
        })
    };

    const handlePastSections = () => {
        try {
            const { sectionData, validateKey } = store.get(`${prefix}-section-copy`);
            if (Date.now() - validateKey > 10 * 60 * 1000) {
                message.warn(translate('copy-again'));
                store.remove(`${prefix}-section-copy`);
                return;
            }

            if (isEmpty(sectionData)) {
                message.warn(translate('nothing-to-paste'));
                return;
            }

            changeState({
                sections: sectionData.map((section) => ({ ...section, id: Date.now() }))
            })
          
        } catch (e) {
            console.error(e);
            message.warn(translate('nothing-copied'));
        }
    };

    return (
        <div className="form-builder">
            <div
                style={{
                    margin: 5,
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <div>
                    <strong>{state.name}</strong> {updating ? <i>{translate('saving')}</i> : <span>{translate('all-changes-saved')}</span>}
                </div>
                <div>
                    <Text
                        copyable={{
                            onCopy: () => {
                                if (!state.sections.filter((section) => !isEmpty(section.questions)).length) {
                                    message.warn(translate('nothing-to-copy'));
                                    return;
                                }
                                store.set(`${prefix}-section-copy`, { sectionData: state.sections, validateKey: Date.now() });
                            },
                        }}
                    >
                        {translate('copy-form')}
                    </Text>
                    <Divider type="vertical" />
                    <span onClick={handlePastSections} style={{ cursor: "pointer" }}>
                        {translate('paste')}
                    </span>
                    <Divider type="vertical" />
                    <span onClick={() => setPreview(preview => !preview)} className="preview">
                        {translate('preview')} {preview ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    </span>
                </div>
            </div>
            <Divider style={{ margin: 5 }} />

            {preview ? (
                <Form
                    title={title}
                    sections={state.sections}
                    description={description}
                    beautifulPreview={beautifulPreview}
                    successText={successText}
                />
            ) : (
                <div>
                    <DragDropContext onDragEnd={handleDragEnd}>
                        {state.sections.map((section, index) => (
                            <Section
                                showValidateField={showValidateField}
                                showAssociationField={showAssociationField}
                                showDependencyField={showDependencyField}
                                key={section.id}
                                sectionIndex={index}
                                data={section}
                                focus={index === state.focusSection}
                                onFocusSection={handleFocusSection}
                                focusQuestion={state.focusQuestion}
                                onRemove={state.sections.length > 1 ? () => removeSection(index) : null}
                                onChange={(section) => setSection(index, section)}
                                association={association}
                                showFormTitle={showFormTitle}
                                isExpert={isExpert}
                                showInListOption={showInListOption}
                                showUniqueOption={showUniqueOption}
                            />
                        ))}
                    </DragDropContext>
                </div>
            )}

            {showAddSection && (
                <a onClick={addSection}>
                    <PlusOutlined /> {translate('add-section')} <ColumnHeightOutlined />
                </a>
            )}
        </div>
    );
}

export default FormEditor;