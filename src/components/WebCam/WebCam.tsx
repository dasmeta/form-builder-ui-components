import React, { useEffect, useCallback, useState, useRef, useContext } from "react";
import { CameraOutlined, UploadOutlined, EditOutlined} from "@ant-design/icons";
import { message, Button, Avatar } from "antd";
import Webcam from "react-webcam";
import get from "lodash/get";
import { ConfigContext } from "../../context/Config";
import FileUpload from "../FileUpload";

import "./WebCam.less";

type WebCamProps = {
    host: string,
    action: string,
    folder: string;
    value?: any;
    editable: boolean;
    onChange?: Function;
    onScreenshotUpload?: (file: File) => Promise<{ url?: string, path?: string }>;
    onDelete?: Function;
}

const WebCam: React.FC<WebCamProps> = ({
    host,
    action,
    folder, 
    value, 
    onChange, 
    onScreenshotUpload,
    onDelete,
    editable = false 
}) => {
    const { translate } = useContext(ConfigContext);
    const [actionType, setActionType] = useState(null);
    const [permission, setPermission] = useState(false);
    const [url, setUrl] = useState();

    const ref = useRef<any>();

    useEffect(() => {
        if (!value) {
            return;
        }
        setUrl(value);
        setActionType("camera");
    }, [value]);

    const onSuccess = (response) => {
        const url = response.url || response.path;
        setUrl(url);
        onChange(url);
        setActionType("camera");
        return url;
    };

    const onError = (err) => {
        message.error(err);
    };

    const handleClick = useCallback(() => {
        if (url) {
            setActionType(null);
            setUrl(null);
            onChange(null);
            return;
        }
        getImage();
    }, [value, url]);

    const handleAccess = useCallback(
        (type) => {
            setActionType(type);
            if (type === "upload") {
                return;
            }
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then(function (stream) {
                    setPermission(get(stream, "active", "false"));
                })
                .catch(function (err) {
                    message.error(translate('media-grant-access'));
                });
        },
        [value]
    );

    const fetchFile = async (screenShotSrc) => {
        const res = await fetch(screenShotSrc);
        return await res.blob();
    };

    const getImage = () => {

        const screenShot = ref.current.getScreenshot();

        fetchFile(screenShot).then((blob: File) => {
            onScreenshotUpload(blob)
                .then(res => onSuccess(res))
                .catch(err => onError(err))
        });
    };

    if (!editable) {
        return (
            <>
                <div className="readable-container">
                    {!!value && <img className="readable-image" alt="camera" src={value} />}
                </div>
            </>
        );
    }

    if (!actionType) {
        return (
            <div className="actions-btn">
                <Button.Group>
                    <Button onClick={() => handleAccess("camera")} type="primary" icon={<CameraOutlined />}>
                        {translate('take-photo')}
                    </Button>
                    <Button onClick={() => handleAccess("upload")} type="primary" icon={<UploadOutlined />}>
                        {translate('upload-photo')}
                    </Button>
                </Button.Group>
            </div>
        );
    }

    return actionType === "camera" ? (
        <div className="container">
            {!url ? (
                <div className="webcam-section">
                    <Webcam audio={false} ref={ref} screenshotFormat="image/jpeg" width={"100%"} />
                    <Button
                        disabled={!permission && !url}
                        className="close-badge"
                        onClick={() => handleClick()}
                        type="primary"
                        shape="circle"
                        icon={<CameraOutlined />}
                    />
                </div>
            ) : (
                <div className="avatar-section">
                    <Avatar alt="camera" src={url} size={200} />
                    <Button
                        disabled={!permission && !url}
                        className="close-badge"
                        onClick={() => handleClick()}
                        type="primary"
                        shape="circle"
                        icon={<EditOutlined />}
                    />
                </div>
            )}
        </div>
    ) : (
        <FileUpload
            host={host}
            action={action}
            listType="picture"
            accept="image/*"
            onChange={(value) => onSuccess({ url: value.src })}
            onDelete={onDelete}
            folder={folder}
            withName
            label={translate('attach-photo')}
        />
    );
};

export default WebCam;
