import React, { useContext } from "react";
import { DownloadOutlined } from "@ant-design/icons";
import { ConfigContext } from '../../context/Config';
import FileUpload from "../FileUpload";

type UploadProps = {
    host: string,
    action: string,
    folder: string;
    value?: any;
    editable: boolean;
    onChange?: Function;
    onDelete?: Function;
    attachments?: Array<any>;
}

const Upload: React.FC<UploadProps> = ({ 
    host,
    action,
    folder, 
    value, 
    onChange, 
    onDelete,
    editable = false,
    attachments = []
}) => {

    const { translations } = useContext(ConfigContext);

    if(!editable) {
        return (
            <>
                {(value || []).map((item) => (
                    <div>
                        <DownloadOutlined />{" "}
                        <a href={item.src} download target="_blank">
                            {item.name}
                        </a>
                    </div>
                ))}
            </>
        )
    }

    return (
        <>
            {attachments.map((item) => (
                <div>
                    <DownloadOutlined />{" "}
                    <a href={item.src} download target="_blank">
                        {item.name}
                    </a>
                </div>
            ))}
            <FileUpload
                host={host}
                action={action}
                folder={folder}
                multiple
                withName
                label={translations.attachFile}
                onChange={onChange}
                onDelete={onDelete}
            />
            {(value || []).map((item) => (
                <div>
                    <DownloadOutlined />{" "}
                    <a href={item.src} download target="_blank">
                        {item.name}
                    </a>
                </div>
            ))}
        </>
    );
};

export default Upload;