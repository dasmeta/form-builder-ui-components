import React, { createContext, ReactElement } from 'react';

export type UploadProps = {
    host: string;
    action: string;
    folder?: string;
    onDelete?: (src: string) => any;  
}

export type CameraProps = UploadProps & {
    onScreenshotUpload?: (file: File) => Promise<{ url?: string; path?: string }>;
}

export type SignatureProps = {
    onUpload?: (file: File) => Promise<{ url?: string; path?: string }>;
}

export type PhoneNumberProps = {
    country?: string;
}

export type TranslationsProps = Partial<{
    allChangesSaved: ReactElement | string;
    saving: ReactElement | string;
    nothingToCopy: ReactElement | string;
    nothingToPaste: ReactElement | string;
    copyForm:  ReactElement | string;
    paste:  ReactElement | string;
    preview:  ReactElement | string;
    addSection: ReactElement | string;
    removeSection: ReactElement | string;
    copyAgain: ReactElement | string;
    copyQuestion: ReactElement | string;
    nothingCopied: ReactElement | string;
    addOtherOption: ReactElement | string;
    inactiveForm: ReactElement | string;
    sorry: ReactElement | string;
    addField: ReactElement | string;
    changesWillBeLost: ReactElement | string;
    registrationIsAccepted: ReactElement | string;
    ourSpecialistWillContactYou: ReactElement | string;
    formTitle: string;
    sectionTitle: string;
    addStage: ReactElement | string;
    removeStage: ReactElement | string;
    emailValidationMessage: ReactElement | string;
    phoneValidationMessage: ReactElement | string;
    numberValidationMessage: ReactElement | string;
    description: ReactElement | string;
    attachFile: string;
    multipleMode: ReactElement | string;
    show: ReactElement | string;
    unique: ReactElement | string;
    required: ReactElement | string;
    termConditionAgreeText: string;
    mediaGrantAccess: string;
    takePhoto: string;
    uploadPhoto: string;
    attachPhoto: string;
    termCondition:  ReactElement | string;
    signature:  ReactElement | string;
    shortAnswer:  ReactElement | string;
    staticText: ReactElement | string;
    multipleChoice:  ReactElement | string;
    cascader:  ReactElement | string;
    checkboxes:  ReactElement | string;
    dropdown:  ReactElement | string;
    datePicker:  ReactElement | string;
    phoneNumber:  ReactElement | string;
    birthDay: ReactElement | string;
    number:  ReactElement | string;
    switch:  ReactElement | string;
    camera:  ReactElement | string;
    fileUpload:  ReactElement | string;
    rating:  ReactElement | string;
    
}>

const defaultTranslations: TranslationsProps = {
    allChangesSaved: 'All Changes Saved',
    saving: 'Saving...',
    nothingToCopy: 'Nothing to copy',
    nothingToPaste: 'Nothing to paste',
    copyForm: 'Copy Form',
    paste: 'Paste',
    preview: 'Preview',
    addSection: 'Add Section',
    removeSection: 'Remove Section',
    copyAgain: 'Please copy again',
    copyQuestion: 'Copy Question',
    nothingCopied: 'Nothing copied or wrong copy',
    addOtherOption: 'Add other option',
    inactiveForm: 'The form you are attempting to access is no longer active.',
    sorry: 'Sorry',
    addField: 'Add Field',
    changesWillBeLost: 'All changes in this section will be lost',
    registrationIsAccepted: 'Your registration is accepted.',
    ourSpecialistWillContactYou: 'Our specialist will contact you.',
    formTitle: 'Form Title',
    sectionTitle: 'Section Title (optional)',
    addStage: 'Add stage',
    removeStage: 'Remove stage',
    emailValidationMessage: 'The input is not valid E-mail!',
    phoneValidationMessage: 'Please fill correct phone number.',
    numberValidationMessage: 'Only numbers are allowed.',
    description: 'Description',
    attachFile: 'Attach File',
    multipleMode: 'Multiple Mode',
    show: 'Show In List',
    unique: 'Unique',
    required: 'Required',
    termConditionAgreeText: 'I have read and agree to conditions',
    mediaGrantAccess: 'Please grant access to your media',
    takePhoto: 'Take a photo',
    uploadPhoto: 'Upload a photo',
    attachPhoto: 'Attach Photo',
    termCondition:  'Term Condition',
    signature:  'Signature',
    shortAnswer:  'Short Answer',
    staticText: 'Static Text',
    multipleChoice:  'Multiple choice',
    cascader:  'Cascader',
    checkboxes:  'Checkboxes',
    dropdown:  'Dropdown',
    datePicker:  'Date Picker',
    phoneNumber:  'Phone Number',
    birthDay: 'Birth Day',
    number:  'Number',
    switch: 'Switch',
    camera:  'Camera',
    fileUpload:  'File Upload',
    rating:  'Rating'
}

export type ConfigProps = {
    types?: {
      'term-condition'?: boolean;
      'signature'?: SignatureProps | false;
      'short-answer'?: boolean;
      'static-text'?: boolean;
      'multiple-choice'?: boolean;
      'cascader'?: boolean;
      'checkboxes'?: boolean;
      'dropdown'?: boolean;
      'date-picker'?: boolean;
      'phone-number'?: PhoneNumberProps | false;
      'birthday'?: boolean;
      'number'?: boolean;
      'switch'?: boolean;
      'camera'?: CameraProps | false;
      'file-upload'?: UploadProps | false;
      'rating'?: boolean;
    },
    translations?: TranslationsProps;
}

const defaultProps: ConfigProps & {
    availableTypes: Array<any>;
} = {
    types: {
        'term-condition': true,
        'signature': {
            onUpload: async (file) => ({})
        },
        'static-text': true,
        'short-answer': true,
        'multiple-choice': true,
        'cascader': true,
        'checkboxes': true,
        'dropdown': true,
        'date-picker': true,
        'phone-number': {},
        'birthday': true,
        'number': true,
        'switch': true,
        'camera': {
            host: '',
            action: '',
            folder: 'form',
            onDelete: () => {},
            onScreenshotUpload: async (file) => ({}),
        },
        'file-upload': {
            host: '',
            action: '',
            folder: 'form',
            onDelete: () => {}
        },
        'rating': true
    },
    availableTypes: [],
    translations: defaultTranslations,
}

export const ConfigContext = createContext(defaultProps);

const Provider: React.FC<ConfigProps> = ({ children, ...props }) => {

    const types = { ...defaultProps.types, ...props.types };
    const translations = { ...defaultProps.translations, ...props.translations };
    const availableTypes = Object.keys(types).map(key => types[key] ? key : false).filter(Boolean);

    return (
        <ConfigContext.Provider
            value={{ ...defaultProps, ...props, availableTypes, translations }}
        >
            {children}
        </ConfigContext.Provider>
    )
}

export default Provider;