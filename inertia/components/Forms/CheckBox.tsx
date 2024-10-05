import React from "react";
import { Field, useField } from "formik";

interface InputProps {
    label: string;
    type?: string;
    [x: string]: any;
}

export const CheckBox: React.FC<InputProps> = ({ label, type, ...props }) => {
    const [field, meta] = useField(props as any)
    return (
        <div className="mb-3">
            <div className="form-check">
                <Field 
                    className="form-check-input" 
                    type="checkbox" 
                    {...field}
                    {...props}
                />
                <label className="form-check-label">
                    {label}
                </label>
            </div>
            {meta.touched && meta.error ? (
                <div className="text-danger">{ meta.error }</div>
            ) : null}
        </div>
    )
}