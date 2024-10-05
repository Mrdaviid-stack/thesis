import React from "react";
import { Field, useField } from "formik";

interface InputProps {
    label: string;
    type?: string;
    [x: string]: any;
}

export const Radio: React.FC<InputProps> = ({ label, type, ...props }) => {
    const [field, meta, helpers] = useField(props as any)
    return (
        <div className="form-check">
            <input 
                className="form-check-input" 
                type="radio" 
                {...field}
                {...props}
                checked={field.value === props.value}
                onChange={() => helpers.setValue(props.value)}
            />
            <label className="form-check-label" htmlFor={props.id}>
                {label }
            </label>
            {meta.touched && meta.error ? (
                <div className="text-danger">{ meta.error }</div>
            ) : null}
        </div>
    )
}