import { router } from "@inertiajs/react"
import { Form, Formik } from "formik"
import { ReactNode, useEffect, useState } from "react"
import { Input } from "~/components/Forms/Input"
import { TextArea } from "~/components/Forms/TextArea"
import ShopLayout from "~/components/Layouts/shop"

import { useStore } from "~/context/store"
import { requestService } from "~/services/api.service"

import Cookie from "js-cookie"
import { Toast } from "~/helpers/Toast"

export default function Profile() {

    const { user } = useStore()
    const [orders, setOrders] = useState([])

    useEffect(() => {
        requestService({
            url: `shop/shops/profile/orders/${user.id}`,
            method: "get"
        }).then(response => {
            setOrders(response.data.orders)
        })
    }, [user])

    if (!user.id || user.group !== 'Customers') {
        router.visit('/shop')
        return null
    }

    return (
        <div className="profile mt-5" style={{paddingRight: '5%',paddingLeft: '5%' }}>
            <div className="row">
                <div className="col-4">
                    <div className="card card-body">
                        <Formik
                            enableReinitialize={true}
                            initialValues={{
                                firstname: user.firstname,
                                lastname: user.lastname,
                                email: user.email,
                                password: '',
                                address: user.address
                            }}
                            onSubmit={(values: any) => {
                                requestService({
                                    url: `/dashboard/admin/users/add/${user.id}`,
                                    method: 'post',
                                    payload: values,
                                })
                                    .then(response => {
                                        Cookie.remove('user')
                                        Cookie.set('user', response.data.data)

                                        Toast.fire({
                                            icon: 'success',
                                            text: `Account updated successfully`
                                        })
                                        router.reload()
                                    })
                                    .catch(error => {
                                        console.log(error)
                                    })
                            }}
                        >
                            <Form>
                                <div className="row">
                                    <div className="col">
                                        <Input
                                            id="firstname"
                                            name="firstname"
                                            label="First Name"
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="col">
                                        <Input
                                            id="lastname"
                                            name="lastname"
                                            label="Lastname Name"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col">
                                    <Input
                                        id="email"
                                        name="email"
                                        label="Email"
                                        className="form-control"
                                    />
                                </div>
                                <div className="col">
                                    <Input
                                        id="password"
                                        name="password"
                                        label="Password"
                                        className="form-control"
                                    />
                                </div>
                                <div className="col">
                                    <TextArea
                                        id="address"
                                        name="address"
                                        label="Address"
                                        className="form-control"
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">Update</button>
                            </Form>
                        </Formik>
                    </div>
                </div>
                <div className="col-8">
                    <div className="card card-body">
                        <h5>Orders</h5>
                        {
                            orders.length !== 0 ?
                                orders.map((order: any) => {
                                    return (
                                                orders.length !== 0 ?
                                                    order.order?.orderProducts.map((product: any, index: number) => (
                                                        <div key={index} className="d-flex justify-content-start gap-4 border-bottom p-2">
                                                            <div>
                                                                <h6 className="mb-0">{product.products.name}</h6>
                                                                <small className="text-sm">{product.products.color} | {product.products.storage}</small>
                                                                <br />
                                                                <small className="text-sm">Model number: { product.products.modelNumber }</small>
                                                                <br />
                                                                <small className="text-sm">Payment mode: { order.payment.paymentMethod }</small>
                                                            </div>
                                                            <div>
                                                                <small className="text-sm">Invoice Number: { order.invoice }</small>
                                                                <br />
                                                                <small>Status: { order.status }</small>
                                                                <br />
                                                                <small className="text-sm">Total amount: { order.order.totalAmount.toLocaleString() }</small>
                                                                <br />
                                                                <small className="text-sm">Downpayment: { order.payment.amount.toLocaleString() }</small>
                                                                <br />
                                                                <small className="text-sm">Balance: { (order.order.totalAmount - order.payment.amount).toLocaleString() }</small>
                                                            </div>
                                                            <div><button className="btn btn-secondary float-end">Replace</button></div>
                                                        </div>
                                                    ))
                                                : null
                                    
                                    )
                                })
                            : <h6>No item</h6>
                        }
                    </div>
                </div>
            </div>
            <div className="col-12 mt-5">

                {/* <ul className="nav nav-tabs" id="myTab" role="tablist">
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
                </div> */}
            </div>
        </div>
    )
}

Profile.layout = (page: ReactNode) => <ShopLayout children={page} title='Profile' />