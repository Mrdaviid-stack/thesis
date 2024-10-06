import { ReactNode, useEffect, useState } from "react"
import MainLayout from "~/components/Layouts/main"
import { requestService } from "~/services/api.service"
import moment from "moment"

import DataTable from "datatables.net-react"
import DT from "datatables.net-bs5"
DataTable.use(DT)

export default function Sales() {
    const [sales, setSales] = useState([])
    const [filter, setFilter] = useState({
        transaction: 'all',
        startDate: moment(new Date).format('YYYY-MM-DD'),
        endDate: moment(new Date).format('YYYY-MM-DD'),
    })


    function generateSales(params: any) {
        requestService({
            url: `/dashboard/reports/sales/generate?transaction=${params.transaction}&startDate=${params.startDate}&endDate=${params.endDate}`,
            method: 'get',
        }).then(response => {
            setSales(response.data.sales)
        })
    }

    const handleFilter = () => {
        generateSales(filter)
    }

    const columns = [
        { data: 'invoice'},
        { data: 'items',render: (data: any[]) => {
            return data.map(d => {
                return `<ul class="navbar-nav text-sm"><li>${d.name}</li><li>${d.color} | ${d.storage}</li><li>${d.sku}</li></ul>`
            })
        } },
    ]
    

    useEffect(() => {
        generateSales(filter)
    }, [])
    return (
        <div className="sales">
            <div className="d-flex align-items-center gap-2">
                <div className="w-25">
                    <label>Transaction</label>
                    <select onChange={(e) => setFilter(prev => ({...prev,transaction: e.target.value}))} className="form-select">
                        <option value="all">All Transaction</option>
                        <option value="onsite">Walk In Transaction</option>
                        <option value="online">Online Transaction</option>
                    </select>
                </div>
                <div className="w-25">
                    <label>Start Date</label>
                    <input onChange={(e) => setFilter(prev => ({...prev,startDate: e.target.value}))} type="date" className="form-control"/>
                </div>
                <div className="w-25">
                    <label>End Date</label>
                    <input onChange={(e) => setFilter(prev => ({...prev,endDate: e.target.value}))} type="date" className="form-control"/>
                </div>
                <button onClick={handleFilter} className="btn btn-primary mt-5 w-25">Generate Reports</button>
            </div>
            <div className="d-flex justify-content-center">
                <div className="card card-body" style={{ width: '200px!important' }}>
                    {
                        <>
                            <h2 className="text-center">{ sales.reduce((total, product: any) => total + product.totalPrice, 0).toLocaleString() }</h2>
                            <span className="text-center">Total Sales between {moment(filter.startDate).format('ll')} to {moment(filter.endDate).format('ll')}</span>
                        </>
                    }
                </div>
            </div>
            <div className="card card-body mt-4">
                <DataTable
                    data={sales}
                    columns={columns}
                    className="table table-borderless"
                >
                    <thead>
                        <tr>
                            <th>Inovice</th>
                            <th>Items</th>
                        </tr>
                    </thead>
                </DataTable>
            </div>
        </div>
    )
}

Sales.layout = (page: ReactNode) => <MainLayout children={page} title='Sales reports' />