import { ReactNode } from "react"
import MainLayout from "~/components/Layouts/main"

import DataTable from "datatables.net-react"
import DT from "datatables.net-bs5"
DataTable.use(DT)


export default function Inventories(props: { datatable: any[] }) {

    const column = [
        { data: 'name' },
        { data: 'modelNumber' },
        { data: 'color', width: '20%' },
        { data: 'stock',render: (data: number) => {
            return data <= 5 ? `<span class="badge text-bg-danger text-white"><i class="fa-solid fa-circle-exclamation"></i> ${data} stock</span>` 
            : data <= 10 ? `<span class="badge text-bg-warning text-white"><i class="fa-solid fa-triangle-exclamation"></i> ${data} stock</span>`
            : `<span class="badge text-bg-primary text-white"><i class="fa-solid fa-thumbs-up"></i> ${data} stock</span>`
        } },
    ]

    return (
        <div className="inventories">
            <div className="card card-body">
                <DataTable
                    data={props.datatable}
                    columns={column}
                    className="table table-striped"
                >
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Model Number</th>
                            <th>Color</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                </DataTable>
            </div>
        </div>
    )
}

Inventories.layout = (page: ReactNode) => <MainLayout children={page} title='Inventories' />