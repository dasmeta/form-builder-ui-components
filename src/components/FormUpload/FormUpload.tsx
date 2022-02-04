import React, { useCallback, useContext } from "react";
import isArray from "lodash/isArray";
import { ConfigContext, UploadProps } from '../../context/Config';
import FileUpload from "../FileUpload";

type FormUploadProps = {
    options: Array<any>;
    onChange: Function;
}

const FormUpload: React.FC<FormUploadProps> = ({ 
    options = [], 
    onChange = () => {} 
}) => {

    const { types, translations } = useContext(ConfigContext);
    const uploadOptions = types['file-upload'] as UploadProps;

    const handleFileListChange = useCallback(
        (data) => {
            onChange(options.map((item) => ({ ...item, value: data })));
        },
        [options]
    );

    return (
        <FileUpload
            host={uploadOptions.host}
            action={uploadOptions.action}
            folder={uploadOptions.folder}
            multiple
            withName
            label={translations.attachFile}
            value={isArray(options[0].value) ? options[0].value : []}
            onChange={handleFileListChange}
            onDelete={uploadOptions.onDelete}
        />
    );
};

export default FormUpload;