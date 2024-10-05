import { ReactNode, useState } from "react"
import MainLayout from "~/components/Layouts/main"
import PermissionsForm from "~/components/GroupPermissions/PermissionsForm"
import GroupsForm from "~/components/GroupPermissions/GroupsForm"

import { useModal } from "~/hooks/useModal"
import { Modal } from "~/components/Modal"

import DataTable from "datatables.net-react"
import DT from "datatables.net-bs5"
import { deleteService } from "~/services/deleteService"

import { useStore } from "~/context/store"

DataTable.use(DT)

interface IPermissions {
    id: number
    name: string
    description: string
}

export default function Groups(props: { datatable: any[], permissions: IPermissions[] }) {

    const { hasAbility } = useStore()

    // handle open and close of modal
    const { modal, onShow,onClose } = useModal()

    // use for group form edit mode
    const [updateValue, setUpdateValue] = useState<any>()
    // checking if group or permission form is used.
    const [isGroupForm, setIsGroupForm] = useState<boolean>(true)
    // storing group id for permission update
    const [groupId, setGroupId] = useState<number>()

    // datatable column
    const columnDefs = [
        { data: 'name' },
        { data: 'description' },
        { title: 'Actions' }
    ];

    // update groups
    const onUpdate = (data: any) => {
        //set true in edit mode
        setIsGroupForm(true)
        // store value from table
        setUpdateValue(data.row)
        // show modal
        onShow()
    }

    // delete groups
    const onDelete = (data: any) => deleteService(`/dahsboard/admin/groups/${data.row.id}`)

    // set Modal to permission mode
    const onPermissions = (data: any) => {
        setGroupId(data.row.id)
        setIsGroupForm(false)
        setTimeout(() => {
            onShow()
        }, 500)
    }

    const TableActionComponent = (data: any) => {
        return (
            <div className="dropdown">
                <a href="#" className="nav-link" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="fa fa-ellipsis-v cursor-pointer"></i>
                </a>
                <ul className="navbar-nav p-3 dropdown-menu">
                    <li className="nav-item"><a onClick={() => onPermissions(data)} href="#" className="nav-link"><i className="fa-solid fa-key"></i> Permission</a></li>
                    { hasAbility('admin-groups-edit') && 
                        <li className="nav-item"><a onClick={() => onUpdate(data)} href="#" className="nav-link"><i className="fas fa-fw fa-edit"></i> Update</a></li> }
                    { hasAbility('admin-groups-delete') && 
                        <li className="nav-item"><a onClick={() => onDelete(data)} href="#" className="nav-link"><i className="fas fa-fw fa-trash-alt"></i> Delete</a></li> }
                </ul>
            </div>
        )
    }

    return (
        <div className="card card-body">
            <div className="d-flex justify-content-between align-items-center">
                <h3>Groups</h3>
                {
                    hasAbility('admin-groups-add') &&
                        <button className="btn btn-primary" onClick={() => { setIsGroupForm(true); onShow()}}>add groups</button>  
                }
            </div> 

            <DataTable 
                data={props.datatable} 
                columns={columnDefs} 
                className="table table-striped"
                slots={{
                    2: (data: string, row: any[]) => <TableActionComponent data={data} row={row} />
                }}
            >
                <thead>
                    <tr>
                        <th className="w-25">Name</th>
                        <th className="w-50">Description</th>
                    </tr>
                </thead>
            </DataTable>
            <Modal
                show={modal}
                handleClose={onClose}
                title="Groups"
            >
                {
                    isGroupForm
                        ?   <GroupsForm
                                updateValue={updateValue}
                                handleClose={() => onClose()}
                            />
                        :   <PermissionsForm 
                                id={groupId} 
                                permissions={props.permissions}
                                handleClose={() => onClose()} 
                            />
                }
            </Modal>


        </div>
    )
}

Groups.layout = (page: ReactNode) => <MainLayout children={page} title="Groups" />