import React, { ReactElement, useContext } from "react";
import { Typography, Row, Col } from "antd";
import { ConfigContext } from "../../context/Config";
import FormSteps from "../FormSteps";
import "./Form.less";

const { Title } = Typography;
const ColTitle = {
    xs: 19,
    sm: 20,
};
const ColLogo = {
    xs: 5,
    sm: 4,
};

type FormProps = {
    beautifulPreview?: boolean;
    onSubmit?: (data: any) => any;
    editable?: boolean;
    readOnly?: boolean;
    filterHidden?: boolean;
    sections: Array<any>;
    description?: string;
    inactive?: boolean;
    cover?: {
        backgroundImage?: string;
        logo?: string;
        title?: string;

    }
    title: string; // old form.name;
    inactiveMessage?: string;
    successText?: ReactElement;
    footer?: ReactElement;
    defaultValues?: Array<any>;
}

const Form: React.FC<FormProps> = ({
    beautifulPreview = true,
    onSubmit = async () => ({}),
    editable = false,
    readOnly = false,
    filterHidden = true,
    sections,
    description,
    cover,
    inactive = false,
    title,
    inactiveMessage,
    successText,
    footer,
    defaultValues,
}) => {

    const { translate } = useContext(ConfigContext);

    if (!beautifulPreview) {
        return (
            <FormSteps 
                onSubmit={onSubmit} 
                sections={sections}
                description={description}
                readOnly={readOnly}
                defaultValues={defaultValues}
                beautifulPreview={false} 
            />
        )
    }

    return (
        <div className="form-builder-form">
            <div className="wrapper">
                {cover && (
                    <>
                        <div className="background">
                            <div className="background-gradient" />
                            <div
                                className="background-image"
                                style={{ backgroundImage: `url(${cover.backgroundImage})` }}
                            />
                        </div>
                        <div className="header">
                            <Row>
                                <Col {...ColLogo}>
                                    <img className="header-logo" src={cover.logo} alt="logo" />
                                </Col>
                                <Col {...ColTitle}>
                                    <span className="header-title">{cover.title}</span>
                                </Col>
                            </Row>
                        </div>
                    </>
                )}

                <div className="form-container">
                    <Title level={2} className="title">
                        {inactive ? translate('sorry') : title}
                    </Title>

                    <div className="form">
                        {inactive ? (
                            <div className="finished-form">
                                <Title level={2}>
                                    {inactiveMessage || translate('inactive-form')}
                                </Title>
                            </div>
                        ) : (
                            <FormSteps
                                filterHidden={filterHidden}
                                editable={editable}
                                readOnly={readOnly}
                                onSubmit={onSubmit}
                                sections={sections}
                                successText={successText}
                                defaultValues={defaultValues}
                            />
                        )}
                    </div>
                </div>

                <div className="footer">
                    {footer || <span className="footer-text">Powered by DasMeta</span>}
                </div>
            </div>
        </div>
    );
};

export default Form;
