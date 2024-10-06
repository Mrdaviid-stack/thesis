
import { router } from "@inertiajs/react";
import { ReactNode, useEffect, useState } from "react"

import MainLayout from "~/components/Layouts/main"
import { useStore } from "~/context/store";
import { Toast } from "~/helpers/Toast";
import { requestService } from "~/services/api.service";

interface ProductProps {
    id?: number;
    sku: string;
    modelNumber: string;
    name: string;
    description: string;
    price: number | string;
    stock: number | string;
    color: string;
    storage: number | string;
    ram: number | string;
    categoryId: string;
    status: string;
}

interface OrderProps {
    quantity: number;
    products: ProductProps
}

interface OrdersProps {
    id: number;
    status: string;
    totalAmount: number;
    orders: OrderProps[]
}

interface PaymentProps {
    orderId: number |string;
    paymentMethod: string;
    amount: number;
    status: string;
    userId: string;
}

export default function Billing(props: { orders: OrdersProps[] }) {
    const { user } = useStore()
    const [paymentDetails, setPaymentDetails] = useState<PaymentProps>({ orderId: 0, paymentMethod: 'cash', amount: 0, status: 'completed', userId: user.id})
    console.log(props.orders)

    useEffect(() => {
        setPaymentDetails(prevState => ({...prevState, orderId: props.orders[0].id, status: 'completed', amount: props.orders[0].totalAmount, userId: user.id}))
    }, [])

    console.log(paymentDetails)

    const handlePurchase = () => {
        requestService({
            url: "/dashboard/cashiers/walk-in-orders/payment",
            method: "post",
            payload: paymentDetails
        }).then(response => {
            console.log(response)
            Toast.fire({
                icon: "success",
                text: response.data.message
            })
            router.visit('/dashboard/cashiers/walk-in-orders')
        }).catch(error => {
            console.error(error)
            setPaymentDetails(prevState => ({...prevState, amount: props.orders[0].totalAmount, status: 'failed'}))
        })
    }

    return (
        <div className="billing">
            <div className="card card-body">
                <h4>Billing</h4>
                <dl className="row">
                    {
                        props.orders.map(({ orders }) => (
                            orders.map(order => (
                                    <>
                                        <dt className="col-sm-4">Product Name:</dt>
                                        <dd className="col-sm-8">{ order.products.name }</dd>

                                        <dt className="col-sm-4">SKU:</dt>
                                        <dd className="col-sm-8">{ order.products.sku }</dd>

                                        <dt className="col-sm-4">Details:</dt>
                                        <dd className="col-sm-8">{ order.products.storage }GB Storage, {order.products.ram}GB RAM, {order.products.color}</dd>

                                        <dt className="col-sm-4">Qty:</dt>
                                        <dd className="col-sm-8">{ order.quantity }</dd>

                                        <dt className="col-sm-4">Total Amount:</dt>
                                        <dd className="col-sm-8">{ props.orders[0].totalAmount }</dd>

                                        <dt className="col-sm-4">Status:</dt>
                                        <dd className="col-sm-8">{ props.orders[0].status }</dd>

                                        <dt className="col-sm-4">Payment:</dt>
                                        <dd className="col-sm-8">
                                            <select onChange={(e) => setPaymentDetails(prev => ({...prev, paymentMethod: e.target.value}))} name="payment" className="form-select">
                                                <option value="cash">Cash</option>
                                                <option value="credit_card">Debit/Credit Card</option>
                                                <option value="gcash">Gcash</option>
                                                <option value="paymaya">Paymaya</option>
                                            </select>
                                        </dd>
                                    </>
                               

                            ))
                        ))
                    }
                    <button onClick={handlePurchase} className="btn btn-primary w-100 mt-5">Purchased</button>

                </dl>
            </div>
        </div>
    )
}

Billing.layout = (page: ReactNode) => <MainLayout children={page} title='Billing' />