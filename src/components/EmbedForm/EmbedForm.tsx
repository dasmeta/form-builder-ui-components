import React from "react";
import type { FormInstance } from "antd";
import FormBuilder from "../FormBuilder";

type EmbedFormProps = {
    form: FormInstance; 
    item: any;
    formItemLayout: any;
    wrapper?: any;
    filterHidden?: boolean;
    questions: Array<any>;
}

const EmbedForm: React.FC<EmbedFormProps> = ({ 
    form, 
    item, 
    formItemLayout, 
    wrapper, 
    filterHidden,
    questions = []
}) => {

    return (
        <FormBuilder
            editable={true}
            filterHidden={filterHidden}
            defaultQuestions={questions}
            data={item}
            form={form}
            formItemDefaultLayout={formItemLayout}
            formItemLayouts={{}}
            wrapper={wrapper}
        />
    );
};

export default EmbedForm;
