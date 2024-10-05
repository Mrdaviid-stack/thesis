import { ReactNode, useEffect, useState } from "react"
import MainLayout from "~/components/Layouts/main"

import { FormikForm } from "~/components/Forms/FormikForm";
import * as Yup from "yup"
import { Input } from "~/components/Forms/Input";
import { Select } from "~/components/Forms/Select";
import { DropZone } from "~/components/Forms/DropZone";
import { TextArea } from "~/components/Forms/TextArea";

interface IFormValue {
    id?: number;
    firstname: string;
    lastname: string;
    username?: string;
    address: string;
    email: string;
    image: any;
    group: string;
} 

const UserSchema = Yup.object().shape({
    firstname: Yup.string().required(),
    lastname: Yup.string().required(),
    email: Yup.string().email(),
    address: Yup.string().required(),
    status: Yup.boolean(),
    group: Yup.number(),
})

const initialFormValue = {
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    address: '',
    image: '',
    group: '',
}

export default function UsersForm(props: { data: any, options: [{label: string,value: string | number}] }) {

    const [formValue, setFormValue] = useState<IFormValue>(initialFormValue)

    useEffect(() => {
        if (props.data)
            setFormValue(props.data[0])
    }, [props.data])

    return (
        <>
            <h3>Users Form</h3>
            <div className="card card-body">
                <FormikForm
                    url="admin/users/add"
                    method="post"
                    initialValues={formValue}
                    validationSchema={UserSchema}
                >
                    <div className="row">
                        <div className="col-7">
                            <Input
                                id="firstname"  
                                name="firstname" 
                                label="Firstname" 
                                className="form-control"
                            />
                            <Input
                                id="lastname"  
                                name="lastname" 
                                label="Lastname" 
                                className="form-control"
                            />
                            <Input
                                id="email"  
                                name="email" 
                                label="Email" 
                                className="form-control"
                            />
                            <TextArea
                                id="address"
                                name="address" 
                                label="Address" 
                                rows="3" 
                                className="form-control"
                            />
                        </div>
                        <div className="col-5">
                            <Select
                                id="group"
                                name="group"
                                label="Group"
                                className="form-select"
                                options={props.options}
                            />
                            <DropZone
                                id="image"
                                name="image"
                                label="Profile"
                                previewSize="img-thumb"
                            />
                            <button type="submit" className="btn btn-primary w-100">
                                save change
                            </button>
                        </div>
                    </div>
                </FormikForm>
            </div>
        </>
    )
}

UsersForm.layout = (page: ReactNode) => <MainLayout children={page} title="Users form" />