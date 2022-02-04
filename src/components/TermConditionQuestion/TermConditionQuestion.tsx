import React, { useState, useEffect } from "react";
import { EditorState, ContentState, convertToRaw, convertFromHTML } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import isString from "lodash/isString";

const toolbar = {
    options: ["inline", "blockType", "list", "history"],
    inline: {
        options: ["bold", "italic"],
    },
    blockType: {
        options: ["Normal", "H2", "H3", "H4", "H5", "H6"],
    },
    list: {
        options: ["unordered", "ordered"],
    },
};

type TermConditionQuestionProps = {
    options: any;
    setOptions: any;
} 

const TermConditionQuestion: React.FC<TermConditionQuestionProps> = ({ options, setOptions }) => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [key, setKey] = useState<number>();

    useEffect(() => {
        if (!isString(options)) {
            return;
        }
        const newEditorState = EditorState.createWithContent(
            ContentState.createFromBlockArray(convertFromHTML(options))
        );
        setEditorState(newEditorState);
        setKey(Date.now());
    }, []);

    return (
        <>
            <Editor
                key={key}
                defaultEditorState={editorState}
                onBlur={(event, editorState) => setOptions(draftToHtml(convertToRaw(editorState.getCurrentContent())))}
                toolbar={toolbar}
            />
        </>
    );
};

export default TermConditionQuestion;
