import React, { forwardRef, useState, useImperativeHandle, useCallback } from "react";
import { Modal } from "antd";

export default forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [url, setUrl] = useState("");

    const handleClose = useCallback(() => {
        setVisible(false);
    }, [setVisible]);

    useImperativeHandle(ref, () => ({
        open: ({ url }) => {
            setUrl(url);
            setVisible(true);
        },
    }));

    return (
        <Modal visible={visible} onCancel={handleClose}>
            <img alt="preview" style={{ width: "100%" }} src={url} />
        </Modal>
    );
});
