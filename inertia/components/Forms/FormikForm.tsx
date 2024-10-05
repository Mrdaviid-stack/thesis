import React, { ReactNode } from "react"
import { Form, Formik, FormikHelpers } from "formik"
import { requestService } from "~/services/api.service"
import { Toast } from "~/helpers/Toast";
import { router, usePage } from "@inertiajs/react";

interface FormikFormProps {
    url: string;
    method: 'get' | 'post' | 'put' | 'delete' | 'patch';
    attachement?: boolean;
    label?: string;
    form?: boolean;
    initialValues: Object;
    validationSchema?: any;
    handleModalClose?: Function;
    children: ReactNode;
}

export const FormikForm: React.FC<FormikFormProps> = ({ 
    url, 
    method, 
    attachement = false, 
    label, 
    form = true, 
    initialValues,
    validationSchema,
    handleModalClose, 
    children 
}) => {

    const {url:pageURL } = usePage()

    return (
        <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values: any, actions: FormikHelpers<any>) => {
                console.log(values)
                const id = (values && values.id) ? values.id : '' 
                const redirect = pageURL.split('/').slice(0, id ? -2 : -1).join('/').toString()
                delete values.id
                requestService({
                    method: method,
                    url: '/dashboard/' + url + `/${id}`,
                    payload: values,
                    hasAttachment: attachement
                })
                    .then(response => {
                        actions.setSubmitting(true)
                        Toast.fire({
                            icon: "success",
                            text: response.data.message
                        })
                        if (form) {
                            setTimeout(() => {
                                actions.resetForm()
                                router.visit(redirect)
                            },  1000)
                        
                        } else {
                            router.reload()
                            if (handleModalClose)
                                handleModalClose()
                        }
                    })
                    .catch(error => {
                        Toast.fire({
                            icon: "error",
                            text: error.response.data.message
                        })
                        return
                    })
            }}
        >
            {() => (
                <Form>
                    <div className="d-flex justify-content-between align-items-center">
                        <h3>{label}</h3>
                        {
                            form && 
                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-primary">save changed</button>
                                </div>
                        }
                    </div>
                    {children}
                </Form>
            )}
        </Formik>
    )
}