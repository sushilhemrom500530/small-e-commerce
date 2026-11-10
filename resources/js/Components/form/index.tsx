import React, { type ReactNode } from "react";
import {
    Form,
    Input,
    InputNumber,
    Select,
    Radio,
    Checkbox,
    Switch,
    DatePicker,
    Upload,
} from "antd";
import { UploadCloud } from "lucide-react";
import type { FormRule as Rule } from "antd";

const { TextArea } = Input;
const { Dragger } = Upload;

export type Option = {
    label: string;
    value: string | number;
    extraText?: string;
};

export interface FormFieldProps {
    /** The type of input field to render */
    type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "select"
    | "radio"
    | "checkbox"
    | "switch"
    | "file"
    | "file-input"
    | "textarea"
    | "tel"
    | "date";
    /** The name of the field, used by antd Form for binding */
    name: string | (string | number)[];
    /** The label displayed above the field */
    label?: string | ReactNode;
    /** Placeholder text for text, email, password, number, textarea, and select */
    placeholder?: string;
    /** Optional icon to display alongside text-based inputs */
    icon?: ReactNode;
    /** Which side of the input the icon sits on (default "left") */
    iconPosition?: "left" | "right";
    /** antd validation rules */
    rules?: Rule[];
    /** Marks the field as required (adds a rule + asterisk) */
    required?: boolean;
    /** Options array for select and radio types */
    options?: Option[];
    /** Custom color classes for focus states */
    colorClass?: string;
    /** Additional custom classes for the input */
    className?: string;
    /** Whether to allow multiple file uploads (only for type="file") */
    multiple?: boolean;
    /** Accept attribute for file uploads (e.g. 'image/*') */
    accept?: string;
    rows?: number;
    fileUploadClass?: string;
    /** Default image to show in file dragger (when no file is selected) */
    defaultImage?: string | null | undefined;
    allowClear?: boolean;
    checkedChildren?: ReactNode;
    unCheckedChildren?: ReactNode;
    disabled?: boolean;
    showSearch?: boolean;
    [key: string]: any;
}

// Normalize the Upload event into the file list antd Form expects
const normFile = (e: any) => (Array.isArray(e) ? e : e?.fileList);

type FileLineInputProps = {
    fileList?: any[];
    onChange?: (info: any) => void;
    placeholder?: string | undefined;
    accept?: string | undefined;
    icon?: ReactNode | undefined;
    className?: string | undefined;
};

const FileLineInput: React.FC<FileLineInputProps> = ({
    fileList,
    onChange,
    placeholder,
    accept,
    icon,
    className,
}) => {
    const fileName =
        Array.isArray(fileList) && fileList.length > 0 ? fileList[0]?.name : "";

    return (
        <Upload
            accept={accept as any}
            maxCount={1}
            showUploadList={false}
            beforeUpload={() => false}
            fileList={Array.isArray(fileList) ? fileList : []}
            {...(onChange !== undefined ? { onChange } : {})}
            className="w-full [&_.ant-upload-select]:!block [&_.ant-upload-select]:!w-full"
        >
            <Input
                readOnly
                value={fileName}
                placeholder={placeholder}
                suffix={icon}
                className={className}
                style={{ width: "100%", cursor: "pointer" }}
            />
        </Upload>
    );
};

const FileDraggerWrapper = ({ fileList, onChange, draggerName, multiple, accept, fileUploadClass, defaultImage, ...rest }: any) => {
    const hasFiles = Array.isArray(fileList) && fileList.length > 0;

    return (
        <Dragger
            name={draggerName}
            multiple={multiple}
            {...(multiple ? {} : { maxCount: 1 })}
            accept={accept as any}
            beforeUpload={() => false}
            listType="picture"
            className="!h-[360px]"
            rootClassName={fileUploadClass}
            fileList={fileList}
            onChange={onChange}
            showUploadList={!defaultImage} // Hide standard antd list if we are taking over preview rendering
            {...rest}
        >
            {defaultImage ? (
                <div className="flex flex-col items-center justify-center p-4">
                    <img src={defaultImage} alt="Preview" className="max-h-[250px] object-cover mb-4 rounded-lg" />
                    <p className="ant-upload-text">Click or drag new image to replace</p>
                </div>
            ) : (
                <>
                    <p className="flex justify-center">
                        <UploadCloud className="h-6 w-6 text-gray-400" />
                    </p>
                    <p className="ant-upload-text">
                        Click to upload or Drag &amp; drop or{" "}
                    </p>
                    <p className="ant-upload-hint">PDF, JPG, PNG - max 10 MB each</p>
                </>
            )}
        </Dragger>
    );
};

const FormField: React.FC<FormFieldProps> = ({
    type = "text",
    name,
    label,
    placeholder,
    icon,
    iconPosition = "left",
    rules = [],
    required = false,
    options = [],
    colorClass = "",
    className = "",
    multiple = false,
    accept,
    rows = 4,
    fileUploadClass = "",
    defaultImage,
    allowClear,
    checkedChildren,
    unCheckedChildren,
    disabled,
    showSearch,
    ...rest
}) => {
    const mergedRules: Rule[] = [
        ...rules,
        ...(required
            ? [{ required: true, message: `${typeof label === "string" ? label : "This field"} is required` }]
            : []),
    ];

    const textInputControlClass =
        `${colorClass || "!rounded-md"} !w-full !min-h-[44px] !h-[44px] !rounded-md !border-slate-200 !px-4 text-sm hover:!border-primary focus:!border-primary !focus:outline-none focus:!shadow-[0_0_0_2px_rgba(67,83,255,0.12)] transition-all duration-200`.trim();

    const textareaControlClass =
        `${colorClass || "!rounded-md"} !w-full !rounded-md !border-slate-200 !py-2.5 !px-4 text-sm hover:!border-primary focus:!border-primary !focus:outline-none focus:!shadow-[0_0_0_2px_rgba(67,83,255,0.12)] transition-all duration-200`.trim();

    const draggerName =
        typeof name === "string"
            ? name
            : Array.isArray(name)
                ? // Use the first element as a fallback string.
                // You can adjust this logic to suit your naming scheme.
                String(name[0])
                : "";

    const renderControl = () => {
        switch (type) {
            case "select":
                return (
                    <Select
                        placeholder={placeholder}
                        allowClear={allowClear}
                        disabled={disabled}
                        showSearch={showSearch}
                        className={`!w-full ${colorClass || "!rounded-md"} text-sm [&_.ant-select-selector]:!min-h-[44px] [&_.ant-select-selector]:!h-[44px] [&_.ant-select-selector]:!px-4 [&_.ant-select-selector]:!rounded-md [&_.ant-select-selector]:!border-slate-200 hover:[&_.ant-select-selector]:!border-primary [&_.ant-select-selector]:!transition-all [&_.ant-select-selector]:!duration-200 [&.ant-select-focused_.ant-select-selector]:!border-primary [&.ant-select-focused_.ant-select-selector]:!shadow-[0_0_0_2px_rgba(67,83,255,0.12)] [&.ant-select-open_.ant-select-selector]:!border-primary [&.ant-select-open_.ant-select-selector]:!shadow-[0_0_0_2px_rgba(67,83,255,0.12)] [&_.ant-select-selection-item]:!flex [&_.ant-select-selection-item]:!items-center [&_.ant-select-selection-item]:!text-sm [&_.ant-select-selection-item]:!text-slate-800 [&_.ant-select-selection-placeholder]:!flex [&_.ant-select-selection-placeholder]:!items-center [&_.ant-select-selection-placeholder]:!text-sm [&_.ant-select-selection-placeholder]:!text-slate-400 [&_.ant-select-arrow]:!right-4 [&_.ant-select-arrow]:!text-slate-400 [&.ant-select-disabled_.ant-select-selector]:!bg-slate-50 [&.ant-select-disabled_.ant-select-selector]:!text-slate-400`.trim()}
                        options={options.map((opt) => ({
                            value: opt.value,
                            label: opt.extraText ? (
                                <div className="flex flex-col">
                                    <span className="!font-semibold">{opt.label}</span>
                                    <span className="text-[10px] text-gray-500">
                                        {opt.extraText}
                                    </span>
                                </div>
                            ) : (
                                opt.label
                            ),
                        }))}
                        {...rest}
                    />
                );

            case "textarea":
                return (
                    <TextArea
                        rows={rows}
                        placeholder={placeholder}
                        disabled={disabled}
                        className={textareaControlClass}
                        {...rest}
                    />
                );

            case "radio":
                return (
                    <Radio.Group className={colorClass} disabled={disabled} {...rest}>
                        {options.map((opt) => (
                            <Radio key={opt.value} value={opt.value}>
                                {opt.label}
                            </Radio>
                        ))}
                    </Radio.Group>
                );

            case "number":
                return (
                    <InputNumber
                        placeholder={placeholder}
                        prefix={icon}
                        controls={false}
                        disabled={disabled}
                        className={`!w-full ${colorClass || "!rounded-md"} !min-h-[44px] !h-[44px] !rounded-md !border-slate-200 [&_.ant-input-number-input]:!h-[42px] [&_.ant-input-number-input]:!px-4 [&_.ant-input-number-input]:!text-sm hover:!border-primary focus:!border-primary focus-within:!border-primary [&.ant-input-number-focused]:!border-primary [&.ant-input-number-focused]:!shadow-[0_0_0_2px_rgba(67,83,255,0.12)]`.trim()}
                        style={{ width: "100%" }}
                        {...rest}
                    />
                );

            case "password":
                return (
                    <Input.Password
                        placeholder={placeholder}
                        prefix={icon}
                        disabled={disabled}
                        className={textInputControlClass}
                        {...rest}
                    />
                );

            case "date":
                return (
                    <DatePicker
                        {...(placeholder !== undefined ? { placeholder } : {})}
                        disabled={disabled}
                        className={textInputControlClass}
                        style={{ width: "100%" }}
                        {...rest}
                    />
                );

            default:
                // text, email, tel
                return (
                    <Input
                        type={type}
                        placeholder={placeholder}
                        prefix={iconPosition === "left" ? icon : undefined}
                        suffix={iconPosition === "right" ? icon : undefined}
                        disabled={disabled}
                        className={textInputControlClass}
                        {...rest}
                    />
                );
        }
    };

    // Switch binds its value via "checked"
    if (type === "switch") {
        return (
            <Form.Item
                name={name}
                label={label}
                valuePropName="checked"
                rules={mergedRules}
                className={className}
            >
                <Switch
                    checkedChildren={checkedChildren || "Live"}
                    unCheckedChildren={unCheckedChildren || "Hidden"}
                />
            </Form.Item>
        );
    }

    // Checkbox binds its value via "checked"
    if (type === "checkbox") {
        return (
            <Form.Item
                name={name}
                valuePropName="checked"
                rules={mergedRules}
                className={className}
            >
                <Checkbox>{placeholder || label}</Checkbox>
            </Form.Item>
        );
    }

    // Single-line file picker styled like a text input
    if (type === "file-input") {
        return (
            <Form.Item
                name={name}
                label={label}
                required={required}
                rules={mergedRules}
                valuePropName="fileList"
                getValueFromEvent={normFile}
                className={className}
            >
                <FileLineInput
                    placeholder={placeholder}
                    accept={accept}
                    icon={icon}
                    className={textInputControlClass}
                />
            </Form.Item>
        );
    }

    // File upload uses a dragger and a file-list value
    if (type === "file") {
        return (
            <Form.Item
                name={name}
                label={label}
                required={required}
                rules={mergedRules}
                valuePropName="fileList"
                getValueFromEvent={normFile}
                className={className}
            >
                <Dragger
                    name={draggerName}
                    multiple={multiple}
                    {...(multiple ? {} : { maxCount: 1 })}
                    accept={accept as any}
                    beforeUpload={() => false}
                    listType="picture"
                    className="!h-[360px]"
                    rootClassName={fileUploadClass}
                >
                    <p className="flex justify-center">
                        <UploadCloud className="h-6 w-6 text-gray-400" />
                    </p>
                    <p className="ant-upload-text">
                        Click to upload or Drag &amp; drop or{" "}
                    </p>
                    <p className="ant-upload-hint">PDF, JPG, PNG - max 10 MB each</p>
                </Dragger>
            </Form.Item>
        );
    }

    return (
        <Form.Item
            name={name}
            label={label}
            required={required}
            rules={mergedRules}
            className={className}
        >
            {renderControl()}
        </Form.Item>
    );
};

export default FormField;