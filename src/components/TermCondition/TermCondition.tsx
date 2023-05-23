import React, { forwardRef, useContext } from "react";
import { Row, Col, Checkbox } from "antd";
import get from "lodash/get";
import { ConfigContext } from "../../context/Config";

import "./TermCondition.less";

type TermConditionProps = {
    data: any;
    onChange: Function;
    disabled: boolean;
    fulfillCondition: boolean; 
}

const TermCondition = forwardRef<any, TermConditionProps>(({ 
    data, 
    onChange, 
    disabled,
    fulfillCondition = false
}) => {

    const { translate } = useContext(ConfigContext);

    return (
        <Row gutter={24}>
            <Col span={24}>
                <h1>{data.question}</h1>
                <div className="term-condition" dangerouslySetInnerHTML={{ __html: data.options }} />
            </Col>
            {!disabled && (
                <Col>
                    <Checkbox
                        style={{ marginTop: 40, fontSize: 16 }}
                        onChange={value => onChange(get(value, "target.checked"), false)}
                        checked={fulfillCondition}
                    >
                        {translate('term-condition-agree-text')}
                    </Checkbox>
                </Col>
            )}
        </Row>
    );
});

export default TermCondition;
