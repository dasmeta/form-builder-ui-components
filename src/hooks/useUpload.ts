import { useCallback, useEffect, useMemo, useState } from "react";
import isEqual from "lodash/isEqual";
import { message } from "antd";

type useUploadProps = {
    type: string;
    folder: string;
    defaultValue: any;
    multiple: boolean;
    accept: string;
    listType: any;
    withName: boolean;
    host: string;
    action: string;
    onChange: Function;
    onFileListChange: Function;
    onUploaded: Function;
    onDelete: Function;
    previewRef: any;
}

const useUpload = ({
    type,
    folder,
    defaultValue,
    multiple,
    accept,
    listType,
    withName,
    host,
    action,
    onChange = () => {},
    onFileListChange = () => {},
    onUploaded = () => {},
    onDelete = () => {},
    previewRef,
}: useUploadProps) => {

    const srcToUrl = useCallback((src) => {
        if (!src) {
            return "";
        }
        if (src.indexOf("https://") === 0 || src.indexOf("http://") === 0) {
            return src;
        }
        return `${host}/${src}`;
    }, [host]);

    const toFile = useCallback((withName) => (item) => {
        const src = withName ? item.src : item;
        const uid = src.split("/").pop().split(".").shift();
        const name = withName ? item.name : uid;
        return {
            uid,
            name,
            status: "done",
            url: srcToUrl(src),
            thumbUrl: srcToUrl(src),
            src,
        };
    }, []);

    const getInitialFileList = useCallback((defaultValue, multiple, withName) => {
        if (multiple) {
            return (defaultValue || []).map(toFile(withName));
        }
        return [defaultValue].filter(Boolean).map(toFile(withName));
    }, []);

    const [fileList, setFileList] = useState(getInitialFileList(defaultValue, multiple, withName));
    const [value, setStateValue] = useState(defaultValue);

    const setValue = useCallback(
        (value) => {
            setStateValue(value);
            onChange(value);
        },
        [setStateValue, onChange]
    );

    const handleChange = useCallback(
        ({ file, fileList }) => {
            setFileList(fileList);
            if (file.response && file.status === "done") {
                const url = file.response.url || file.response.path;
                const item = withName ? { name: file.name, src: url } : url;
                if (multiple) {
                    setValue([...(value || []), item]);
                    onUploaded({ src: url, type: file.type });
                } else {
                    setValue(item);
                    onUploaded({ src: url, type: file.type });
                }
            }
        },
        [multiple, withName, setFileList, value, onUploaded]
    );

    const handleRemove = useCallback(
        (file) => {
            const src = file.src || file.response.path;

            onDelete(src).catch((err) => {
                message.error(err.message);
            });

            if (multiple) {
                const index = value.findIndex((item) => (withName ? item.src === src : item === src));
                const newFileList = fileList.slice();
                newFileList.splice(index, 1);
                setFileList(newFileList);
                const newValue = value.slice();
                newValue.splice(index, 1);
                setValue(newValue);
            } else {
                setFileList([]);
                setValue(null);
            }
        },
        [multiple, withName, value, fileList, setFileList]
    );

    const handlePreview = useCallback(
        (file) => {
            // if (previewRef) {
            //     previewRef.open({
            //         url: file.url || file.thumbUrl,
            //         ...file,
            //     });
            // }
        },
        [previewRef]
    );

    const uploadProps = useMemo(
        () => ({
            action: `${host}/${action}/${type}/${folder}`,
            fileList,
            multiple,
            accept,
            listType,
            headers: {
                "X-Requested-With": null,
            },
            withCredentials: true,
            onChange: handleChange,
            onRemove: handleRemove,
            onPreview: handlePreview,
        }),
        [type, folder, multiple, accept, listType, fileList, handleChange, handleRemove, handlePreview]
    );

    useEffect(() => {
        const initialFileList = getInitialFileList(defaultValue, multiple, withName);
        if (!isEqual(fileList, initialFileList)) {
            setFileList(initialFileList);
        }
    }, [defaultValue, multiple, withName]);

    useEffect(() => {
        onFileListChange(fileList);
    }, [fileList.length]);

    return { fileList, uploadProps };
};

export default useUpload;
