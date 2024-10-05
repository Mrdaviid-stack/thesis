import { Accept, useDropzone } from "react-dropzone"
import { useField } from "formik"
import React, { useEffect, useState } from "react";

interface DropZoneProps {
    label: string;
    type?: string;
    multiple?: boolean;
    previewSize: 'img-thumb' | 'img-banner' | 'img-multi-thumb'
    [x: string]: any;
}

export const DropZone: React.FC<DropZoneProps> = ({ label, multiple = false, previewSize, ...props }) => {
    const [field, meta, helpers ] = useField(props as any)
    const { setValue } = helpers

    const [preview, setPreview] = useState<any[]>([])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles: any[]) => {
            setPreview((prev) => [...prev, ...acceptedFiles.map(file => URL.createObjectURL(file))])
            setValue(acceptedFiles)
        },
        multiple: multiple,
        accept: {'image/*': ['.jpeg', '.jpg', '.png']} as Accept
    })

    const handleRemoveFile = (url: string) => {
        setPreview(prevFiles => {
          const updatedFiles = prevFiles.filter(file => file !== url);
          return updatedFiles;
        });
      };

    const thumbs = preview?.map((url, index) => (
        <div key={index} className="dropzone-container">
            <img
                key={index}
                src={url}
                className={previewSize}
                onLoad={() => { URL.revokeObjectURL(url) }}
            />
            <button className="btn btn-danger" style={{ 
                position: 'absolute',
                top: 5, 
                right:5,
            }} onClick={() => handleRemoveFile(url)}>Remove</button>
        </div>
    ))

    useEffect(() => {
        return () => preview?.forEach(url => URL.revokeObjectURL(url))
    }, [])

    useEffect(() =>{
        if (typeof field.value === 'string' && field.value !== '') {
            setPreview([`http://localhost:3333/${field.value}`])
        }
    }, [field.value])

    return (
        <div className="mb-3">
            <label htmlFor={props.id || props.name}>{label}</label>
            {
                multiple
                    ?   <>
                            <div className="d-flex justify-content-center align-items-center mt-5 border rounded" style={{cursor: 'pointer'}}>
                                <div {...getRootProps({ className: 'dropzone' })}>
                                    <input {...getInputProps()} />
                                    <p>Click to select files</p>
                                    {meta.touched && meta.error ? (
                                        <div className="text-danger">{ meta.error }</div>
                                    ) : null}
                                </div>
                                <div className="d-flex">{thumbs}</div>
                            </div>
                        </>
                    :   <>
                            {
                            preview.length === 0 
                                ?   <div className="dropzone-container">
                                    <div {...getRootProps({ className: 'dropzone' })}>
                                        <input {...getInputProps()} />
                                        <p>{isDragActive ? "Drop files here..." : "Drag 'n' drop some files here, or click to select files"}</p>
                                        {meta.touched && meta.error ? (
                                            <div className="text-danger">{ meta.error }</div>
                                        ) : null}
                                    </div>
                                    </div>
                                :   <>
                                        { thumbs }
                                    </>
                            }
                        </>
            }
     
        </div>
    )
}