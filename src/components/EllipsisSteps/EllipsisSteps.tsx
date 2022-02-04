import React, { useState, useEffect, useCallback } from "react";
import { Steps } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import cloneDeep from "lodash/cloneDeep";
import isEmpty from "lodash/isEmpty";
import set from "lodash/set";
import get from "lodash/get";
import "./EllipsisSteps.less";

let template = [];

const ellipsisTemplate = {
    icon: (
        <div className="steps-item-icon">
            <EllipsisOutlined />
        </div>
    ),
};

const createTemplate = (data, length, limit) => {
    if (length <= limit) {
        template = data;
        return;
    }

    const middleIndex = Math.ceil(length / 2) - 1;

    set(template, 0, { ...data[0], stepIndex: 1, icon: <div className="steps-item-icon">1</div> });
    set(template, middleIndex, { stepIndex: middleIndex + 1, ...ellipsisTemplate });
    set(template, length - 1, {
        ...data[length - 1],
        stepIndex: length,
        icon: <div className="steps-item-icon">{length}</div>,
    });
};

type EllipsisStepsProps = {
    currentStep: number;
    steps: Array<any>;
    limit?: number;
    handleNext: Function;
    renderTitle?: any;
}

const EllipsisSteps: React.FC<EllipsisStepsProps> = ({ 
    currentStep, 
    steps = [], 
    limit = 3, 
    handleNext = () => {},
    renderTitle = value => (value.name || "")
 }) => {
    const middleIndex = Math.ceil(steps.length / 2) - 1;
    const [stepsForRender, setSteps] = useState(template.filter(Boolean));
    const [lastStep, setLastStep] = useState(currentStep - 1 > 0 ? currentStep - 1 : 0);

    useEffect(() => {
        if (!isEmpty(template)) {
            return;
        }
        createTemplate(steps, steps.length, limit);
    }, []);

    const onNext = useCallback(
        current => {
            const index = get(stepsForRender, `${current}.stepIndex`);
            handleNext(index);
        },
        [stepsForRender]
    );

    useEffect(() => {
        const res = cloneDeep(template);

        if (![0, middleIndex, steps.length - 1].includes(lastStep)) {
            res[lastStep] = undefined;
        } else if (lastStep === middleIndex && steps.length > limit) {
            res[lastStep] = { stepIndex: middleIndex + 1, ...ellipsisTemplate };
        }

        res[currentStep] = {
            ...steps[currentStep],
            icon: <div className="active-steps-item-icon">{currentStep + 1}</div>,
        };

        setLastStep(currentStep);
        setSteps(res.filter(Boolean));
    }, [currentStep, steps]);

    return (
        <Steps current={currentStep} onChange={current => onNext(current)}>
            {stepsForRender.map((section, index) => (
                <Steps.Step key={`section-${section.id || index}`} title={renderTitle(section)} icon={section.icon} />
            ))}
        </Steps>
    );
};

export default EllipsisSteps;
