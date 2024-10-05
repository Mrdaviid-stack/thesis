import { ReactNode, useEffect, useState } from "react"
import MainLayout from "~/components/Layouts/main"

import { FormikForm } from "~/components/Forms/FormikForm"
import * as Yup from 'yup'
import { Input } from "~/components/Forms/Input"
import { RichEditor } from "~/components/Forms/RichEditor"
import { Radio } from "~/components/Forms/Radio"

interface PageProps {
    id?: number;
    name: string;
    shortName: string;
    content: string;
    status: string;
}

const PageSchema = Yup.object().shape({
    name: Yup.string().required().max(255),
    shortName: Yup.string().required().max(70),
    content: Yup.string().required(),
    status: Yup.string().required(),
})

const initialValue = {
    name: '',
    shortName: '',
    content: '',
    status: ''
}

export default function PagesForm(props: { data: any }) {

    const [formValue, setFormValue] = useState<PageProps>(initialValue)

    useEffect(() => {
        if (Object.keys(props.data).length !== 0) {
            setFormValue(props.data)
        } 
            //setFormValue(props.data)
    }, [props.data])

    return (
        <div className="card card-body">
            <FormikForm
                url="websites/pages/store"
                method="post"
                label="Pages"
                initialValues={formValue}
                validationSchema={PageSchema}
            >   

                <div className="row">
                    <div className="col-9">
                        <Input
                            id="name"
                            name="name"
                            label="Name"
                            className="form-control form-control-lg"
                            placeholder="Page Name"
                        />
                        <Input
                            id="shortName"
                            name="shortName"
                            label="Short name"
                            className="form-control"
                            placeholder="Page short name"
                        />
                        <RichEditor
                            id="content"
                            name="content"
                            label="Content"
                        />
                    </div>
                    <div className="col-3">
                        <div className="mb-3">
                            <label>Status</label>
                            <Radio
                                id="status"
                                name="status"
                                label="Draft"
                                value="Draft"
                            />
                            <Radio
                                id="status"
                                name="status"
                                label="Published"
                                value="Published"
                            />
                        </div>
                    </div>
                </div>
            </FormikForm>
        </div>

    )
}

PagesForm.layout = (page: ReactNode) => <MainLayout children={page} title="Pages Form" />