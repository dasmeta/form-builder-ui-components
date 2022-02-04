import React from "react";
import "./Loader.less";

type LoaderProps = {
    spinning?: boolean;
    fullScreen?: boolean;
    text?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
    spinning, 
    fullScreen, 
    text = "" 
}) => {

    const classNames = ['loader'];
    if(!spinning) {
        classNames.push('hidden');
    }
    if(fullScreen) {
        classNames.push('fullscreen');
    }

    return (
        <div
            className={classNames.join(' ')}
        >
            <div className="wrapper">
                <div className="inner" />
                <div className="text">{ text || "LOADING" }</div>
            </div>
        </div>
    );
};

export default Loader;
