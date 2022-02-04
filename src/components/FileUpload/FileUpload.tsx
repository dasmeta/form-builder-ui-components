import React, { useRef } from "react";
import { Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import useUpload from "../../hooks/useUpload";
import Preview from "./Preview";
import "./FileUpload.less";

type FileUploadProps = {
    type?: string;
    folder: string;
    accept?: string;
    listType?: any;
    label: string;
    value?: any;
    multiple?: boolean;
    withName?: boolean;
    showButtonAfterUpload?: boolean;
    host: string,
    action: string;
    onChange?: Function;
    onFileListChange?: Function;
    onUploaded?: Function;
    onDelete?: Function;
    disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
    type = "files",
    folder,
    accept,
    listType,
    label,
    value: defaultValue,
    multiple = false,
    withName = false,
    showButtonAfterUpload = false,
    host,
    action,
    onChange = () => {},
    onFileListChange = () => {},
    onUploaded = () => {},
    onDelete = () => {},
    disabled,
}) => {
    const previewRef = useRef(null);
    const { fileList, uploadProps } = useUpload({
        type,
        folder,
        defaultValue,
        multiple,
        accept,
        listType,
        withName,
        host,
        action,
        onChange,
        onFileListChange,
        onUploaded,
        onDelete,
        previewRef,
    });

    return (
        <Upload
            {...uploadProps}
            showUploadList={{
                showDownloadIcon: disabled,
                showRemoveIcon: !disabled,
            }}
        >
            {(multiple || fileList < 1 || showButtonAfterUpload) && (
                <Button
                    disabled={disabled}
                    icon={<UploadOutlined />}
                    className="attachment-btn"
                >
                    {label}
                </Button>
            )}
            <Preview ref={previewRef} />
        </Upload>
    );
};

export default FileUpload;
