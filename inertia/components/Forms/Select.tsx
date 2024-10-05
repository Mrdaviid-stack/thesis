import React from "react";
import { useField } from "formik";

interface InputProps {
    label: string;
    type?: string;
    options: [{ label: string, value: string | number }]
    [x: string]: any;
}

export const Select: React.FC<InputProps> = ({ label, type, options, ...props }) => {
    const [field, meta] = useField(props as any)
    return (
        <div className="mb-3">
            <label htmlFor={props.id || props.name}>{ label }</label>
            <select
                {...field}
                {...props}
            >
                <option value="" disabled hidden>Select on option</option>
                {
                    options.map((option, index) => (
                        <option key={index} value={option.value}>{ option.label }</option>
                    ))
                }
            </select>
            {meta.touched && meta.error ? (
                <div className="text-danger">{ meta.error }</div>
            ) : null}
        </div>
    )
}