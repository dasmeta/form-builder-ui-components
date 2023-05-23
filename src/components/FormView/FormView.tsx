import React, { ReactElement, useContext } from "react";
import { Divider, Tooltip } from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';
import { ConfigContext } from "../../context/Config";
import ObjectValue from '../ObjectValue'

type FormViewProps = {
    data: any;
    showDetails: boolean;
    successText?: ReactElement;
}

const FormView: React.FC<FormViewProps> = ({ 
    data, 
    showDetails = false, 
    successText 
}) => {

    const { translate } = useContext(ConfigContext);

    const classNames = [];
    if(showDetails) {
        classNames.push('screen-view');
    }

    return (
        <div className={classNames.join(' ')}>
            {showDetails ? (
                <>
                    {data.map((item, index) => {
                        const { data, name, description, ...requestData } = item;
                        return (
                            <div key={index}>
                                <Divider orientation="left">
                                    {!!name && (
                                        <h3>
                                            {name}{" "}
                                            {description && (
                                                <span>
                                                    <Tooltip title={description}>
                                                        <InfoCircleOutlined className="info-circle" />
                                                    </Tooltip>
                                                </span>
                                            )}
                                        </h3>
                                    )}
                                </Divider>
                                <ObjectValue data={data} />
                                <ObjectValue data={requestData} />
                            </div>
                        );
                    })}
                </>
            ) : !!successText ? (
                successText
            ) : (
                <>
                    {translate('registration-is-accepted')}
                    <br />
                    {translate('our-specialist-will-contact-you')}
                </>
            )}
        </div>
    );
};

export default FormView;
