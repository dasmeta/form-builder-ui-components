import React, { useEffect } from "react";
import { Form } from "antd";
import FormBuilder from "../FormBuilder";
import "./FormWrapper.less";

type FormWrapperProps = {
    questions: Array<any>;
    data: any;
    init: any;
    handleCondition: any;
    editable: boolean;
    readOnly: boolean;
    filterHidden: boolean;
}

const FormWrapper: React.FC<FormWrapperProps> = ({ questions = [], data = {}, init, handleCondition, editable, readOnly, filterHidden }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        init(form);
    }, [form]);

    return (
        <div className="screen">
            <Form form={form} layout="vertical" labelAlign="left">
                <FormBuilder
                    form={form}
                    defaultQuestions={questions}
                    data={data}
                    editable={editable}
                    readOnly={readOnly}
                    filterHidden={filterHidden}
                    handleCondition={handleCondition}
                />
            </Form>
        </div>
    );
};

export default FormWrapper;
