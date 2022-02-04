import React, { memo } from "react";
import startCase from "lodash/startCase";
import Value from './Value';

type ObjectValueProps = {
    data: any;
    level?: number;
}

const renderObject = (data, level) => {
    return <ObjectValue data={data} level={level} />;
};

const ObjectValue: React.FC<ObjectValueProps> = memo(({
    data,
    level = 0
}) => {

    const newLine = level ? <span style={{ opacity: 0.5 }}>↵</span> : null;
    const endLine = level ? <div style={{ height: 10 }} /> : null;
    return (
        <>
            {[
                newLine,
                ...Object.keys(data).map(key => {
                    const value = data[key];
                    return (
                        <div key={`${level}-${key}`} style={{ paddingLeft: level * 10 }}>
                            <strong>{startCase(key)}</strong>: <Value value={value} renderObject={renderObject} level={level} />
                        </div>
                    );
                }),
                endLine,
            ].filter(Boolean)}
        </>
    );
});

export default ObjectValue;
