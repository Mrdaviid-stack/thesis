import { useEffect, useMemo, useState } from "react"
import { Formik, FormikHelpers, FormikProps, Form } from "formik"
import { requestService } from "~/services/api.service"
import { Toast } from "~/helpers/Toast"

import { CheckBox } from "../Forms/CheckBox"

import _ from 'lodash'
import { router } from "@inertiajs/react"

interface IPermissions {
    id: number
    name: string
    description: string
}

interface IFormData {
    permission: string[]
}

interface IGroupPermissions {
    id: any;
    permissions: IPermissions[]
    handleClose: () => void
}

const initialFormData = {
    permission: []
}

export default function PermissionsForm({ id, permissions, handleClose }: IGroupPermissions) {

    const [formData, setFormData] = useState<IFormData>(initialFormData)

    const _groupPermissions = useMemo(() => {
        return _.groupBy(permissions, (permission) => {
            const [first, second] = permission.name.split('-')
            return `${first}-${second}`
        }) 
    }, [permissions])

    const onSelectAll = () => setFormData(prev => ({...prev, permission: permissions.map((p) => `${p.id}`)}))

    const onUnSelectAll = () => setFormData(prev => ({...prev, permission: []}))

    useEffect(() => {
        requestService({
            url: `/dashboard/admin/permissions/${id}`,
            method: 'get',
        })
            .then(response => setFormData(response.data.data))
    }, [id])

    return (
        <Formik
            enableReinitialize={true}
            initialValues={formData}
            onSubmit={async (values: IFormData, actions: FormikHelpers<IFormData>) => {
                actions.setSubmitting(true)
                requestService({
                    url: `admin/permissions/${id}`,
                    method: 'post',
                    payload: {permissions: values.permission.map((perm) => parseInt(perm))}
                })
                    .then(response => {
                        Toast.fire({
                            icon: 'success',
                            text: response.data.message
                        })
                        actions.setSubmitting(false)
                        router.reload()
                        handleClose()
                    })
                    .catch(error => {
                        Toast.fire({
                            icon: 'error',
                            text: error.response.data.message
                        })
                        return
                    })

            }}
        >
            {(props: FormikProps<IFormData> ) => (
                <Form>
                    {
                        permissions && (
                            <>
                            <div className="d-flex justify-content-end gap-2">
                                <button onClick={onSelectAll} className="btn btn-info">Select All</button>
                                <button onClick={onUnSelectAll} className="btn btn-warning">Unselect All</button>
                            </div>
                            <div className="accordion shadow mb-3" id="accordion">
                                {
                                    Object.entries(_groupPermissions).sort().map((groups, index) => (
                                        <div key={index} className="accordion-item" style={{ borderBottom: '1px solid rgb(201, 214, 218)', borderRadius: '0' }}>
                                            <h2 className="accordion-header">
                                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#${groups[0]}`} aria-expanded="true" aria-controls={`${groups[0]}`}>
                                                <h6>{ groups[0].split('-')[1].toUpperCase() }</h6>
                                            </button>
                                            </h2>
                                            <div id={groups[0]} className="accordion-collapse collapse" data-bs-parent="#accordion">
                                            <div className="accordion-body">
                                                {
                                                    groups[1].reverse().map((permission: IPermissions, _index) => (
                                                        <CheckBox
                                                            key={_index}
                                                            label={permission.description}
                                                            name="permission"
                                                            value={`${permission.id}`}
                                                            id={permission.name}
                                                        />
                                                    ))
                                                }
                                            </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            </>

                        )
                    }
                    <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-primary">
                            { props.isSubmitting ? <i className="fa-solid fa-spinner"></i> : 'save change' }
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}