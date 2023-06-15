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

export type DatePickerProps = {
    rangePicker?: boolean;
}

export type TranslationsProps = Partial<{
    'all-changes-saved': ReactElement | string;
    'saving': ReactElement | string;
    'nothing-to-copy': ReactElement | string;
    'nothing-to-paste': ReactElement | string;
    'copy-form':  ReactElement | string;
    'paste':  ReactElement | string;
    'preview':  ReactElement | string;
    'add-section': ReactElement | string;
    'remove-section': ReactElement | string;
    'copy-again': ReactElement | string;
    'copy-question': ReactElement | string;
    'nothing-copied': ReactElement | string;
    'add-other-option': ReactElement | string;
    'inactive-form': ReactElement | string;
    'sorry': ReactElement | string;
    'add-field': ReactElement | string;
    'changes-will-be-lost': ReactElement | string;
    'registration-is-accepted': ReactElement | string;
    'our-specialist-will-contact-you': ReactElement | string;
    'form-title': string;
    'section-title': string;
    'add-stage': ReactElement | string;
    'remove-stage': ReactElement | string;
    'email-validation-message': ReactElement | string;
    'phone-validation-message': ReactElement | string;
    'number-validation-message': ReactElement | string;
    'description': ReactElement | string;
    'attach-file': string;
    'multiple-mode': ReactElement | string;
    'show': ReactElement | string;
    'unique': ReactElement | string;
    'required': ReactElement | string;
    'term-condition-agree-text': string;
    'media-grant-access': string;
    'take-photo': string;
    'upload-photo': string;
    'attach-photo': string;
    'term-condition':  ReactElement | string;
    'signature':  ReactElement | string;
    'short-answer':  ReactElement | string;
    'static-text': ReactElement | string;
    'multiple-choice':  ReactElement | string;
    'cascader':  ReactElement | string;
    'checkboxes':  ReactElement | string;
    'dropdown':  ReactElement | string;
    'date-picker':  ReactElement | string;
    'phone-number':  ReactElement | string;
    'birthday': ReactElement | string;
    'number':  ReactElement | string;
    'switch':  ReactElement | string;
    'camera':  ReactElement | string;
    'file-upload':  ReactElement | string;
    'rating':  ReactElement | string;
    'submit': ReactElement | string;
    'next': ReactElement | string;
}>

const defaultTranslations: TranslationsProps = {
    'all-changes-saved': 'All changes saved',
    'saving': 'Saving...',
    'nothing-to-copy': 'Nothing to copy',
    'nothing-to-paste': 'Nothing to paste',
    'copy-form': 'Copy Form',
    'paste': 'Paste',
    'preview': 'Preview',
    'add-section': 'Add Section',
    'remove-section': 'Remove Section',
    'copy-again': 'Please copy again',
    'copy-question': 'Copy Question',
    'nothing-copied': 'Nothing copied or wrong copy',
    'add-other-option': 'Add other option',
    'inactive-form': 'The form you are attempting to access is no longer active.',
    'sorry': 'Sorry',
    'add-field': 'Add Field',
    'changes-will-be-lost': 'All changes in this section will be lost',
    'registration-is-accepted': 'Your registration is accepted.',
    'our-specialist-will-contact-you': 'Our specialist will contact you.',
    'form-title': 'Form Title',
    'section-title': 'Section Title (optional)',
    'add-stage': 'Add stage',
    'remove-stage': 'Remove stage',
    'email-validation-message': 'The input is not valid E-mail!',
    'phone-validation-message': 'Please fill correct phone number.',
    'number-validation-message': 'Only numbers are allowed.',
    'description': 'Description',
    'attach-file': 'Attach File',
    'multiple-mode': 'Multiple Mode',
    'show': 'Show In List',
    'unique': 'Unique',
    'required': 'Required',
    'term-condition-agree-text': 'I have read and agree to conditions',
    'media-grant-access': 'Please grant access to your media',
    'take-photo': 'Take a photo',
    'upload-photo': 'Upload a photo',
    'attach-photo': 'Attach Photo',
    'term-condition':  'Term Condition',
    'signature':  'Signature',
    'short-answer':  'Short Answer',
    'static-text': 'Static Text',
    'multiple-choice':  'Multiple choice',
    'cascader':  'Cascader',
    'checkboxes':  'Checkboxes',
    'dropdown':  'Dropdown',
    'date-picker':  'Date Picker',
    'phone-number':  'Phone Number',
    'birthday': 'Birth Day',
    'number':  'Number',
    'switch': 'Switch',
    'camera':  'Camera',
    'file-upload':  'File Upload',
    'rating':  'Rating',
    'submit': 'Submit',
    'next': 'Next'
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
      'date-picker'?: DatePickerProps | false;
      'phone-number'?: PhoneNumberProps | false;
      'birthday'?: boolean;
      'number'?: boolean;
      'switch'?: boolean;
      'camera'?: CameraProps | false;
      'file-upload'?: UploadProps | false;
      'rating'?: boolean;
    },
    prefix: string;
    translate?: (
        key: keyof TranslationsProps,
        params?: { [key: string]: any },
    ) => string;
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
        'date-picker': {
            rangePicker: false
        },
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
    translate: (key: string) => defaultTranslations[key] || key,
    prefix: 'form'
}

export const ConfigContext = createContext(defaultProps);

const Provider: React.FC<ConfigProps> = ({ children, ...props }) => {

    const types = { ...defaultProps.types, ...props.types };
    const availableTypes = Object.keys(types).map(key => types[key] ? key : false).filter(Boolean);

    return (
        <ConfigContext.Provider
            value={{ ...defaultProps, ...props, availableTypes, types }}
        >
            {children}
        </ConfigContext.Provider>
    )
}

export default Provider;