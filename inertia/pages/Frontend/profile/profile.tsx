import { ReactNode, useState } from "react"
import ShopLayout from "~/components/Layouts/shop"

import { useStore } from "~/context/store"
import { requestService } from "~/services/api.service"

export default function Profile() {

    const { user } = useStore()
    const [orders, setOrders] = useState([])
    const [active, setActive] = useState(0)

    const statuses = [
        {value: "pending", label: "Pending"},
        {value: "order-placed", label: "Order Placed"},
        {value: "out-for-delivery", label: "Out For Delivery"},
        {value: "order-received", label: "Order Received"},
        {value: "delivered", label: "Delivered"},
        {value: "completed", label: "Completed"},
    ]

    const handleViewOrderStatus = (status: string) => {
        requestService({
            url: `shop/shops/profile/orders/${user.id}/${status}`,
            method: "get"
        }).then(response => {
            setOrders(response.data.orders)
        })
    }

    return (
        <div className="profile mt-5" style={{paddingRight: '5%',paddingLeft: '5%' }}>
            <div className="row">
                <div className="col-6">
                    <div className="card card-body">
                        <form action="" className="w-100">
                            <div className="row">
                                <div className="col-6">
                                    <div className="mb-3">
                                        <label>Firstname</label>
                                        <input type="text" value={user.firstname} className="form-control" />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="mb-3">
                                        <label>Lastname</label>
                                        <input type="text" value={user.lastname} className="form-control" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="mb-3">
                                    <label>Email</label>
                                    <input type="text" value={user.email} className="form-control" />
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="mb-3">
                                    <label>Address</label>
                                    <textarea className="form-control" value={user.address}></textarea>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="col-6">
                    <div className="card card-body">
                        <h1>Invoice</h1>
                    </div>
                </div>
            </div>
            <div className="col-12 mt-5">

                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    {
                        statuses.map((status, index) => (
                            <li className="nav-item" role="presentation">
                                <button onClick={() => {handleViewOrderStatus(status.value), setActive(index)}} className={`nav-link ${active == index ? 'active' : ''}`} id={status.value} data-bs-toggle="tab" data-bs-target={`#${status.value}`} type="button" role="tab" aria-controls={status.value} aria-selected="true">{status.label}</button>
                            </li>
                        ))
                    }
                </ul>

                <div className="tab-content" id="myTabContent">
                    {
                        orders.length !== 0 ?
                            orders.map((order: any) => {
                                return (
                                    <div className="tab-pane fade show active" id={order.status} role="tabpanel" aria-labelledby={order.status} tabIndex={0}>
                                        {
                                            order.order.orderProducts.map((product: any) => (
                                                <div className="border-bottom p-2">
                                                    <h6>{product.products.name}</h6>
                                                    <small>{product.products.color} | {product.products.storage}</small>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )
                            })
                        : <h6>No item</h6>
                    }
                </div>
            </div>
        </div>
    )
}

Profile.layout = (page: ReactNode) => <ShopLayout children={page} title='Profile' />