import { ReactNode } from "react"
import MainLayout from "~/components/Layouts/main"

import { useStore } from "~/context/store"

import DataTable from "datatables.net-react"
import DT from "datatables.net-bs5"
DataTable.use(DT)

import { deleteService } from "~/services/deleteService"


export default function Pages(props: { datatable: any[] }) {

    const { hasAbility } = useStore()

    const column = [
        { data: 'name' },
        { data: 'shortName', width: '20%' },
        { data: 'status',render: (data: string) => {
            return data === 'Published' ? `<span class="badge text-bg-info text-white">Published</span>` : `<span class="badge text-bg-warning text-white">Draft</span>`
        } },
    ]

    // Datatable action button
    const TableActionComponent = (data: any) => {
        return (
            <div className="dropdown">
            <a href="#" className="nav-link" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="fa fa-ellipsis-v cursor-pointer"></i>
            </a>
            <ul className="navbar-nav p-3 dropdown-menu">
                { hasAbility('admin-users-edit') && 
                    <li className="nav-item"><a href={`/dashboard/websites/pages/form/${data.row.id}`} className="nav-link"><i className="fas fa-fw fa-edit"></i> Update</a></li> }
                { hasAbility('admin-users-delete') && 
                    <li className="nav-item"><a onClick={() => deleteService(`/dashboard/websites/pages/delete/${data.row.id}`)} href="#" className="nav-link"><i className="fas fa-fw fa-trash-alt"></i> Delete</a></li> }
            </ul>
        </div>
        )
    }

    return (
        <>
            <div className="d-flex justify-content-between">
                <h4>Page List</h4>
                <a href="/dashboard/websites/pages/form" className="btn btn-primary">add page</a>
            </div>
            <div className="card card-body">
                <DataTable
                    columns={column}
                    data={props.datatable}
                    className="table table-striped"
                    slots={{
                        3: (data: any, row: any) => <TableActionComponent data={data} row={row} />
                    }}
                >
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Short name</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                </DataTable>
            </div>
        </>
    )
}

Pages.layout = (page: ReactNode) => <MainLayout children={page} title="Pages" />