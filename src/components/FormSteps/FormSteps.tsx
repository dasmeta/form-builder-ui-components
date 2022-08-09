import React, { ReactElement, useEffect, useRef, useState, useContext } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, message, Typography } from "antd";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import { ConfigContext } from "../../context/Config";
import FormWrapper from "../FormWrapper";
import FormView from '../FormView';
import EllipsisSteps from '../EllipsisSteps';

const { Title, Paragraph } = Typography;

type FormStepsProps = {
    readOnly?: boolean;
    sections?: Array<any>;
    beautifulPreview?: boolean;
    description?: string;
    editable?: boolean;
    filterHidden?: boolean;
    defaultValues?: Array<any>;
    successText?: ReactElement;
    onSubmit: (data: any) => Promise<any>;
}

const FormSteps: React.FC<FormStepsProps> = ({
    readOnly,
    sections,
    beautifulPreview = true,
    description,
    editable = false,
    filterHidden,
    defaultValues = [],
    successText,
    onSubmit
}) => {

    const { translations } = useContext(ConfigContext);
    const [state, setState] = useState<any>({
        sections: [],
        current: 1,
        loading: false,
        done: false,
        fulfillCondition: readOnly || false,
    });

    const changeState = (data: any) => {
        setState(oldState => ({...oldState, ...data}));
    }
    
    const data = useRef<Array<any>>([]);

    useEffect(() => {
        if(sections) {
            changeState({ sections });
            return;
        }

        data.current = sections;
    }, []);

    const prev = () => {
        changeState({ current: state.current - 1 });
    };

    const next = () => {
        const { current, sections, form } = state;
        const section = sections[current - 1];
        const { name } = section;

        const goToNextStep = async () => {
            if (sections.length === current && !readOnly) {
                changeState({ loading: true });
                await onSubmit(data.current);
                await new Promise((resolve) => setTimeout(resolve, 777 + Math.random() * 777));
                changeState({ done: true, loading: false, fulfillCondition: false });
                return;
            }

            changeState({ current: current + 1, fulfillCondition: readOnly || false });
        };

        if (readOnly) {
            goToNextStep().catch((err) => message.error(err.message));
            return;
        }

        form.validateFields()
            .then(async (values) => {
                data.current[current - 1] = {
                    name,
                    data: cloneDeep(values),
                };

                await goToNextStep();
            })
            .catch(({ errorFields }) => {
                errorFields.map((err) => message.error(get(err, `errors[${0}]`, get(err, `name[${0}]`))));
                if (errorFields && errorFields.length) {
                    form.scrollToField(errorFields[0].name);
                }
            });
    };

    const handleCondition = (value) => {
        changeState({ fulfillCondition: value });
    };

    if (state.done) {
        return (
            <FormView
                data={data.current}
                showDetails={!beautifulPreview}
                successText={successText}
            />
        );
    }
    if (!state.sections.length) {
        return null;
    }

    const sectionData = state.sections[state.current - 1];

    if (state.sections.length <= 1) {
        const disabled = state.sections[0].withCondition && !state.fulfillCondition;
        return (
            <div>
                <Title level={3} className="title">
                    {sectionData.name}
                </Title>
                {description && (
                    <Paragraph className="title">
                        <span>{translations.description}</span>
                        {` - ${description}`}
                    </Paragraph>
                )}
                <FormWrapper
                    filterHidden={filterHidden}
                    editable={editable}
                    readOnly={readOnly}
                    handleCondition={handleCondition}
                    init={(form) => changeState({ form })}
                    key={sectionData.id}
                    questions={sectionData.questions}
                    data={defaultValues[state.current - 1] || get(data.current, `[${state.current - 1}].data`, {})}
                    fulfillCondition={state.fulfillCondition}
                />
                <div style={{ textAlign: "center", marginTop: 60 }}>
                    <Button
                        disabled={disabled || readOnly}
                        size="large"
                        type="primary"
                        loading={state.loading}
                        onClick={next}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        );
    }

    const disabled = !!(state.sections[state.current - 1] || {}).withCondition && !state.fulfillCondition;

    return (
        <>
            <div>
                <Title level={3} className="title">
                    {sectionData.name}
                </Title>
                <FormWrapper
                    filterHidden={filterHidden}
                    editable={editable}
                    readOnly={readOnly}
                    handleCondition={handleCondition}
                    init={(form) => changeState({ form })}
                    key={sectionData.id}
                    questions={sectionData.questions}
                    data={defaultValues[state.current - 1] || get(data.current, `[${state.current - 1}].data`, {})}
                    fulfillCondition={state.fulfillCondition}
                />
            </div>

            <div style={{ maxWidth: '100%' }}>
                <EllipsisSteps
                    handleNext={readOnly ? (step) => changeState({ current: step }) : undefined}
                    currentStep={state.current - 1}
                    steps={state.sections}
                />
            </div>

            <div style={{ textAlign: "center", marginTop: 60 }}>
                <Button size="large" disabled={state.current === 1 || state.loading} onClick={prev}>
                    <LeftOutlined /> Previous
                </Button>
                <Button
                    size="large"
                    type="primary"
                    disabled={disabled || (readOnly && state.current === state.sections.length)}
                    loading={state.loading}
                    onClick={next}
                >
                    {state.current === state.sections.length ? "Submit" : "Next"}{" "}
                    {state.current !== state.sections.length && <RightOutlined />}
                </Button>
            </div>
        </>
    );
}

export default FormSteps;
