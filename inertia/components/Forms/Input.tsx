import React from "react";
import { useField } from "formik";

interface InputProps {
    label: string;
    type?: string;
    [x: string]: any;
}

export const Input: React.FC<InputProps> = ({ label, type = 'text', ...props }) => {
    const [field, meta] = useField(props as any)
    return (
        <div className="mb-3">
            <label htmlFor={props.id || props.name}>{ label }</label>
            <input
                type={type} 
                {...field} 
                {...props} 
            />
            {meta.touched && meta.error ? (
                <div className="text-danger">{ meta.error }</div>
            ) : null}
        </div>
    )
}