import { ReactNode } from "react";
import MainLayout from "~/components/Layouts/main";

import DataTable from "datatables.net-react"
import DT from "datatables.net-bs5"

import { useStore } from "~/context/store";
import { requestService } from "~/services/api.service";
import { deleteService } from "~/services/deleteService";
import { Toast } from "~/helpers/Toast";
import { router } from "@inertiajs/react";

DataTable.use(DT)

interface IDataTable {
    id: number;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;

}

export default function Users(props: { datatable: IDataTable[] }) {

    const { hasAbility } = useStore() 

    const columns = [
        { data: 'fullname' },
        { data: 'username' },
        { data: 'email' },
        { data: 'status',render: (data: number) => {
            return data ===1 ? `<span class="badge text-bg-info text-white">Active</span>` : `<span class="badge text-bg-warning text-white">Deactivate</span>`
        } },
        { title: 'Actions' },
    ]

    // handle update status
    const onUpdate = (data: any) => requestService({url:`/admin/users/update/status/${data.row.id}`, method: "patch"})
        .then(response => {
            Toast.fire({
                icon: 'success',
                text: response.data.message
            })
            router.reload()

        })
        .catch(error => {
            Toast.fire({
                icon: 'error',
                text: error.response.data.message
            })
            return
        })

    // handle delete record
    const onDelete = (data: any) => deleteService(`/admin/users/delete/${data.row.id}`)

    // handle status state
    const onStatusState = (id:number) => (id == 1)

    // Datatable action button
    const TableActionComponent = (data: any) => {
        return (
            <div className="dropdown">
            <a href="#" className="nav-link" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="fa fa-ellipsis-v cursor-pointer"></i>
            </a>
            <ul className="navbar-nav p-3 dropdown-menu">
                { hasAbility('admin-users-edit') && 
                    <li className="nav-item">
                        <a onClick={() => onUpdate(data)} href="#" className="nav-link">
                            <i className="fas fa-fw fa-thumbs-up"></i> 
                            {onStatusState(data.row.status) ? 'Deactivate' : 'Activate'}</a>
                    </li> }
                { hasAbility('admin-users-edit') && 
                    <li className="nav-item"><a href={`/dashboard/admin/users/form/${data.row.id}`} className="nav-link"><i className="fas fa-fw fa-edit"></i> Update</a></li> }
                { hasAbility('admin-users-delete') && 
                    <li className="nav-item"><a onClick={() => onDelete(data)} href="#" className="nav-link"><i className="fas fa-fw fa-trash-alt"></i> Delete</a></li> }
            </ul>
        </div>
        )
    }
    
    return (
        <>
            <div className="d-flex justify-content-between">
                <h4>Users List</h4>
                <a href="/dashboard/admin/users/form" className="btn btn-primary">add users</a>
            </div>
            <div className="card card-body">
                <DataTable
                    data={
                        props.datatable.map(data => 
                            ({...data, fullname: `${data.firstname} ${data.lastname}`}))
                    }
                    columns={columns}
                    className="table table-striped"
                    slots={{
                        4: (data: any, row: any) => <TableActionComponent data={data} row={row} />
                    }}
                >
                    <thead>
                        <tr>
                            <th>Fullname</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                </DataTable>
            </div>


        </>
    )
}

Users.layout = (page: ReactNode) => <MainLayout children={page} title="Users" />