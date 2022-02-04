import React, { useRef, useState, useEffect } from "react";
import { CloseOutlined } from "@ant-design/icons";
import SignaturePad from "react-signature-canvas";
import { Button, message } from "antd";

import "./Signature.less";

type SignatureProps = {
    value?: any;
    editable: boolean;
    onChange?: Function;
    onClick: Function;
    onUpload: (file: File) => Promise<{url?: string, path?: string}> 
}

const Signature: React.FC<SignatureProps> = ({ 
    value, 
    onChange,
    editable = false, 
    onClick,
    onUpload
}) => {
    const [url, setUrl] = useState();
    const timeOut = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!value) {
            return;
        }
        setUrl(value);
    }, [value]);

    const onSuccess = (response) => {
        const url = response.url || response.path;
        setUrl(url);
        onChange(url);
        return url;
    };

    const onError = (err) => {
        message.error(err);
    };

    const getImage = () => {
        canvasRef.current.getCanvas().toBlob((value) => {
            onUpload(value)
                .then(res => onSuccess(res))
                .catch(err => onError(err));
        }, "image/png");
    };

    const trim = () => {
        timeOut.current = setTimeout(() => getImage(), 1000);
    };

    if (!editable) {
        return (
            <>
                <div className="readable-container">
                    <div className="sig-container">
                        {!!value && <img className="readable-signature" alt="Signature" src={value} />}
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className="container">
            <div className="sig-container">
                {!url ? (
                    <SignaturePad
                        canvasProps={{ className: "sig-pad", width: 450, height: 250 }}
                        ref={canvasRef}
                        onBegin={() => {
                            onClick(canvasRef);
                            clearTimeout(timeOut.current);
                        }}
                        onEnd={() => trim()}
                    />
                ) : (
                    <img style={{ width: "100%" }} alt="Signature" src={url} />
                )}
                {url && (
                    <Button
                        className="close-badge"
                        onClick={() => {
                            setUrl(null);
                            onChange(null);
                        }}
                        type="primary"
                        shape="circle"
                        icon={<CloseOutlined />}
                    />
                )}
            </div>
        </div>
    );
};

export default Signature;