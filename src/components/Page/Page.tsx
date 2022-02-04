import React from "react";
import Loader from "../Loader";
import "./Page.less";

type PageProps = {
    id?: string;
    loading?: boolean;
    inner?: boolean;
    transparent?: boolean;
    dynamic?: boolean;
    className?: string;
    onClick?: (e: any) => void;
}

const Page: React.FC<PageProps> = ({
    loading = false,
    inner = false,
    transparent = false,
    dynamic = false,
    className = '',
    children,
    onClick = () => {}
}) => {

    const classNames = [className];
    if(inner) {
        classNames.push('content-inner');
    }
    if(transparent) {
        classNames.push('transparent');
    }
    if(dynamic) {
        classNames.push('dynamic');
    }

    const loadingStyle = {
        height: "auto",
        overflow: "hidden",
    };

    return (
        <div
            className={classNames.join(' ')}
            style={loading ? loadingStyle : null}
            onClick={onClick}
        >
            {loading && <Loader spinning />}
            {children}
        </div>
    );
} 

export default Page;