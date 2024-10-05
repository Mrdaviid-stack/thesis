import { ReactNode } from "react"
import MainLayout from "~/components/Layouts/main"

import DataTable from "datatables.net-react"
import DT from "datatables.net-bs5"
DataTable.use(DT)

import { useStore } from "~/context/store"

import { deleteService } from "~/services/deleteService"

const column = [
    { data: 'name' },
    { data: 'sku' },
    { data: 'color' },
    { data: 'storage' },
    { data: 'stock'},
    { data: 'status',render: (data: string) => {
        return data === 'active' ? `<span class="badge text-bg-info text-white">Active</span>` : `<span class="badge text-bg-warning text-white">Draft</span>`
    } },
]

export default function Products(props: { datatable: any[] }) {

    const { hasAbility } = useStore()

    // Datatable action button
    const TableActionComponent = (data: any) => {
        return (
            <div className="dropdown">
            <a href="#" className="nav-link" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="fa fa-ellipsis-v cursor-pointer"></i>
            </a>
            <ul className="navbar-nav p-3 dropdown-menu">
                {/* { hasAbility('admin-users-edit') && 
                    <li className="nav-item">
                        <a onClick={() => onUpdate(data)} href="#" className="nav-link">
                            <i className="fas fa-fw fa-thumbs-up"></i> 
                            {onStatusState(data.row.status) ? 'Deactivate' : 'Activate'}</a>
                    </li> } */}
                { hasAbility('admin-users-edit') && 
                    <li className="nav-item"><a href={`/dashboard/websites/products/form/${data.row.id}`} className="nav-link"><i className="fas fa-fw fa-edit"></i> Update</a></li> }
                { hasAbility('admin-users-delete') && 
                    <li className="nav-item"><a onClick={() => deleteService(`/dashboard/websites/products/delete/${data.row.id}`)} href="#" className="nav-link"><i className="fas fa-fw fa-trash-alt"></i> Delete</a></li> }
            </ul>
        </div>
        )
    }

    return (
        <div className="products">
            <div className="card card-body">
                <div className="d-flex justify-content-end">
                    <a href="/dashboard/websites/products/form" className="btn btn-primary">add new product</a>
                </div>
                <DataTable
                    columns={column}
                    data={props.datatable}
                    className="table table-striped"
                    slots={{
                        6: (data: any, row: any) => <TableActionComponent data={data} row={row} />
                    }}
                >
                    <thead>
                        <tr>
                            <th>Product name</th>
                            <th>SKU</th>
                            <th>color</th>
                            <th>Storage</th>
                            <th>Stock</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                </DataTable>
            </div>
        </div>
    )
}

Products.layout = (page: ReactNode) => <MainLayout children={page} title="Products" />