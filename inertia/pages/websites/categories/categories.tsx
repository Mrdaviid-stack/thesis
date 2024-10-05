import { ReactNode, useState } from "react"
import MainLayout from "~/components/Layouts/main"

import DataTable from "datatables.net-react"
import DT from "datatables.net-bs5"
DataTable.use(DT)

import { useStore } from "~/context/store"
import { useModal } from "~/hooks/useModal"
import { Modal } from "~/components/Modal"

import * as Yup from 'yup'
import { FormikForm } from "~/components/Forms/FormikForm"
import { Input } from "~/components/Forms/Input"
import { TextArea } from "~/components/Forms/TextArea"

import { deleteService } from "~/services/deleteService"

interface ICategory {
    id?: number;
    name: string;
    description: string;
}

const CategorySchema = Yup.object().shape({
    name: Yup.string().required().min(2, 'Identity is too short.'),
    description: Yup.string().required().min(5, 'Identity is too short.')
})


const initialValue = {
    name: '',
    description: ''
}

export default function Categories(props: { datatable: ICategory[] }) {

    const [formValue, setFormValue] = useState<ICategory>(initialValue)

    const { hasAbility } = useStore()
    const { modal, onShow, onClose } = useModal()

    const column = [
        { data: 'name' },
        { data: 'description' },
        { title: 'Actions'}
    ]

    const onUpdate = (data:any) => {
        setFormValue(data.row)
        onShow()
    }

    const TableActionComponent = (data: any) => {
        return (
            <div className="dropdown">
                <a href="#" className="nav-link" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="fa fa-ellipsis-v cursor-pointer"></i>
                </a>
                <ul className="navbar-nav p-3 dropdown-menu">
                    { hasAbility('websites-categories-edit') && 
                        <li className="nav-item"><a onClick={() => onUpdate(data)} href="#" className="nav-link"><i className="fas fa-fw fa-edit"></i> Update</a></li> }
                    { hasAbility('admin-groups-delete') && 
                        <li className="nav-item"><a onClick={() => deleteService(`websites/categories/delete/${data.row.id}`)} href="#" className="nav-link"><i className="fas fa-fw fa-trash-alt"></i> Delete</a></li> }
                </ul>
            </div>
        )
    }

    return (
        <div className="categories">
            <div className="card card-body">
                <div className="d-flex justify-content-end">
                    <button onClick={() => { setFormValue(initialValue); onShow()}} className="btn btn-primary">add categories</button>
                </div>
                <DataTable
                    data={props.datatable}
                    columns={column}
                    className="table table-striped"
                    slots={{
                        2: (data: string, row: any[]) => <TableActionComponent data={data} row={row} />
                    }}
                >
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                </DataTable>
            </div>
            {/* MODAL FORM */}
            <Modal
                show={modal}
                handleClose={onClose}
                title="Category"
            >
                <FormikForm
                    url="websites/categories/store"
                    method="post"
                    form={false}
                    initialValues={formValue}
                    validationSchema={CategorySchema}
                    handleModalClose={onClose}
                >
                    <Input
                        id="name"
                        name="name"
                        label="Name"
                        className="form-control"
                        placeholder="Category name"
                    />
                    <TextArea
                        id="description"
                        name="description"
                        label="Description"
                        className="form-control"
                        placeholder="Description"
                    />
                    <button type="submit" className="btn btn-primary float-end">save chage</button>
                </FormikForm>
            </Modal>
        </div>
    )
}

Categories.layout = (page: ReactNode) => <MainLayout children={page} title="Pages" />