import { useEffect, useState } from "react";

import { FormikForm } from "../Forms/FormikForm";
import * as Yup from 'yup'
import { Input } from "../Forms/Input";
import { TextArea } from "../Forms/TextArea";

interface IFormData {
    id?: string | number;
    name: string;
    description: string;
}

interface IGroupsForm {
    updateValue: IFormData
    handleClose: () => void
}

const GroupSchema = Yup.object().shape({
    name: Yup.string().required().min(2, 'Identity is too short.'),
    description: Yup.string().required().min(5, 'Identity is too short.')
})

const initialGroupFormState = {
    id: '',
    name: '',
    description: ''
};

export default function GroupsForm({ updateValue, handleClose }: IGroupsForm) {

    const [formData, setFormData] = useState<IFormData>(initialGroupFormState)

    useEffect(() => updateValue && setFormData(updateValue), [updateValue])

    return (
        <FormikForm
        url="admin/groups/add"
        method="post"
        form={false}
        initialValues={formData}
        validationSchema={GroupSchema}
        handleModalClose={handleClose}
    >

                <Input 
                    id="name"  
                    name="name" 
                    label="Name" 
                    className="form-control"
                    placeholder="Group Name"
                />
                <TextArea
                    id="description"
                    name="description"
                    label="Description"
                    className="form-control"
                    placeholder="Group Description"
                />
                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">
                        save change
                    </button>
                </div>
    </FormikForm>
    )
}