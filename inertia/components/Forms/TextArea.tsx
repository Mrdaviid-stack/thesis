import React from "react";
import { useField } from "formik";

interface InputProps {
    label: string;
    type?: string;
    [x: string]: any;
}

export const TextArea: React.FC<InputProps> = ({ label, type, ...props }) => {
    const [field, meta] = useField(props as any)
    return (
        <div className="mb-3">
            <label htmlFor={props.id || props.name}>{ label }</label>
            <textarea {...field} {...props}>{ props.value || '' }</textarea>
            {meta.touched && meta.error ? (
                <div className="text-danger">{ meta.error }</div>
            ) : null}
        </div>
    )
}