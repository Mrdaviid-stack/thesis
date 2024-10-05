import { router } from "@inertiajs/react"
import { ReactNode } from "react"
import MainLayout from "~/components/Layouts/main"
import { Toast } from "~/helpers/Toast"
import { requestService } from "~/services/api.service"

export default function OrderTrackings(props: {orders: any[]}) {
    console.log(props.orders)

    const statuses = [
        {value: "pending", label: "Pending"},
        {value: "order-placed", label: "Order Placed"},
        {value: "out-for-delivery", label: "Out For Delivery"},
        {value: "order-received", label: "Order Received"},
        {value: "delivered", label: "Delivered"},
        {value: "completed", label: "Completed"},
    ]

    const handleAcknowledge = (transactionId: number, status: string) => {
        requestService({
            url: `/dashboard/cashiers/order-acknowledgements/status/${transactionId}/${status}`,
            method: "put"
        }).then((response) => {
            console.log('acknowledged')
            Toast.fire({
                icon: "success",
                text: response.data.message
            })
            router.reload()
        })
    }

    return (
        <>
            <h4>Order Tracking list</h4>
            <div className="card card-body">
                {
                    props.orders.map((orders: any) => (
                        <div className="d-flex justify-content-between gap-5 border px-2 py-3">
                            {orders.order.orderProducts.map((product: any) => (
                                <>
                                    <div>
                                        <h6 className="card-title">{product.products.name}</h6>
                                        <small>{product.products.color} | {product.products.storage}</small>
                                        <br /> 
                                        <small>SKU: {product.products.sku}</small>
                                        <br />
                                        <small>Payment: {orders.payment.paymentMethod}</small>
                                        <br />
                                        <small>Reference: {orders.payment.reference}</small>
                                    </div>
                                    <div>
                                        <h6 className="card-title">Customer Information </h6>
                                        <small>{orders.order.user.firstname} {orders.order.user.lastname}</small>
                                        <br />
                                        <small>{orders.order.user.email}</small>
                                        <br />
                                        <small>{orders.order.user.address}</small>
                                    </div>
                                    <div className="w-25">
                                        <select onChange={(e) => handleAcknowledge(orders.id, e.target.value)} className="form-select">
                                            {
                                                statuses.map((status) => (
                                                    <option value={status.value} selected={orders.status == status.value}>{ status.label }</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </>
                            ))}
                        </div>
                    ))
                }
            </div>

        </>
    )
}

OrderTrackings.layout = (page: ReactNode) => <MainLayout children={page} title='Order Tracking' />