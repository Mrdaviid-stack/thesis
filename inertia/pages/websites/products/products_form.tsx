import { ReactNode, useEffect, useState } from "react"
import MainLayout from "~/components/Layouts/main"

import { FormikForm } from "~/components/Forms/FormikForm"
import * as Yup from 'yup'
import { Input } from "~/components/Forms/Input"
import { RichEditor } from "~/components/Forms/RichEditor"
import { Radio } from "~/components/Forms/Radio"
import { Select } from "~/components/Forms/Select"

interface ProductsProps {
    id?: number;
    sku: string;
    modelNumber: string;
    name: string;
    description: string;
    price: number | string;
    stock: number | string;
    color: string;
    storage: number | string;
    categoryId: string;
    status: string;
}

const ProductSchema = Yup.object().shape({
    sku: Yup.string().required().max(64),
    modelNumber: Yup.string().required(),
    name: Yup.string().required().max(255),
    description: Yup.string().required(),
    price: Yup.number().required(),
    stock: Yup.string().required(),
    color: Yup.string().required(),
    categoryId: Yup.string().required(),
    status: Yup.string().required(),
})

const initialValue = {
    sku: '',
    modelNumber: '',
    name: '',
    description: '',
    price: '',
    stock: '',
    color: '',
    storage: '',
    categoryId: '',
    status: 'active',
}

export default function PagesForm(props: { record: ProductsProps, categories: any }) {

    const [formValue, setFormValue] = useState<ProductsProps>(initialValue)

    useEffect(() => {
        if (props.record) {
            setFormValue(props.record)
        } 
            //setFormValue(props.data)
    }, [props.record])

    return (
        <div className="card card-body">
            <FormikForm
                url="websites/products/store"
                method="post"
                label="Products"
                initialValues={formValue}
                validationSchema={ProductSchema}
            >   

                <div className="row">
                    <div className="col-9">
                        <Input
                            id="name"
                            name="name"
                            label="Producut Name"
                            className="form-control form-control-lg"
                            placeholder="Product name"
                        />
                        <Input
                            id="modelNumber"
                            name="modelNumber"
                            label="Product Model Number"
                            className="form-control"
                            placeholder="Product model number"
                        />
                        <Input
                            id="sku"
                            name="sku"
                            label="Product SKU"
                            className="form-control"
                            placeholder="SKU"
                        />
                        <RichEditor
                            id="description"
                            name="description"
                            label="Product description"
                        />
                    </div>
                    <div className="col-3">
                        <div className="mb-3">
                            <label>Status</label>
                            <Radio
                                id="status"
                                name="status"
                                label="Active"
                                value="active"
                            />
                            <Radio
                                id="status"
                                name="status"
                                label="Draft"
                                value="draft"
                            />
                        </div>
                        <Input
                            id="price"
                            name="price"
                            label="Price"
                            type="number"
                            className="form-control"
                        />
                        <Input
                            id="storage"
                            name="storage"
                            type="text"
                            label="Storage"
                            className="form-control"
                            placeholder="e.g: 4GB/64GB"
                        />
                        <Input
                            id="stock"
                            name="stock"
                            type="number"
                            label="Stock"
                            className="form-control"
                        />
                        <Input
                            id="color"
                            name="color"
                            label="Product color"
                            placeholder="Product color"
                            className="form-control"
                        />
                        <Select
                            id="categoryId"
                            name="categoryId"
                            label="Category"
                            options={props.categories}
                            className="form-select"
                        />
                    </div>
                </div>
            </FormikForm>
        </div>

    )
}

PagesForm.layout = (page: ReactNode) => <MainLayout children={page} title="Pages Form" />