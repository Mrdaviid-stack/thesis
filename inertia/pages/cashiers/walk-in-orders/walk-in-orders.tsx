import { ReactNode, useMemo, useState } from "react"
import MainLayout from "~/components/Layouts/main"
import Cookies from "js-cookie"

import DataTable from "datatables.net-react"
import DT from "datatables.net-bs5"
import { Modal } from "~/components/Modal"
DataTable.use(DT)

import { useModal } from "~/hooks/useModal"

import _ from 'lodash'
import { requestService } from "~/services/api.service"
import { router } from "@inertiajs/react"

import { MySwal } from "~/helpers/Toast"

interface ProductProps {
    id: number | string;
    name: string;
    description: string;
    sku: string;
    color: string;
    storage: number;
    ram: number;
    stock: number;
    modelNumber:  string;
    qty?: number;
    vat?: number;
    bundle?: string;
    price?: number;
    total_amount?: number;
}

export default function WalkInOrders(props: { products: ProductProps[] }) {

    const [searchQuery, setSearchQuery] = useState<string>('')
    const [product, setProduct] = useState<ProductProps>({id: '', name: '', description: '', sku: '',color: '', storage: 0,ram: 0, stock: 0, modelNumber: ''})

    const { modal, onClose, onShow } = useModal()

    const search_products = useMemo(() => {
        if (!searchQuery) return props.products
        return props.products.filter((product: ProductProps) => product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.sku.toLowerCase().includes(searchQuery.toLowerCase()))
    }, [searchQuery, setSearchQuery])

    const handleShowOrderDetails = (product: ProductProps) => {
        setProduct(product) 
        onShow()
    }

    const addQuantity = () => {
        setProduct(prev => ({...prev,  qty: (prev.qty ? prev.qty + 1 : 1) }))
    }
    const removeQuantity = () => {
        setProduct(prev => ({...prev,  qty: (prev.qty ? prev.qty - 1 : 0) }))
    }

    const handleOrder = async () => {
        requestService({
            url: "/dashboard/cashiers/walk-in-orders/orders",
            method: "post",
            payload: {
                ...product,
                user: JSON.parse(Cookies.get('user')!).id
            }
        })
            .then(response => {
                MySwal.fire
                ({
                    title: "Order saved!",
                    text: "Please click next button to proceed billing",
                    icon: "success",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Proceed to billing"
                  }).then((result) => {
                    if (result.isConfirmed) {
                        router.visit(`/dashboard/cashiers/walk-in-orders/billing/${response.data.data.orderId}`)
                        // requestService({
                        //     url: url,
                        //     method: 'delete'
                        // }).then(response =>{
                        //         Toast.fire({
                        //             text: response.data.message,
                        //             icon: "success"
                        //         });
                        //         router.reload()
                        //     })
                    }
                  });
                router.reload()
                onClose()
            })
            .catch(error => {
                console.log(error)
            })
    }


    return (
        <div className="walk-in-orders">

            <div className="d-flex justify-content-center mb-3">
                <input type="text" className="form-control w-25" placeholder="Search Product" onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className="row">
                {
                    search_products.map((product, index) => (
                        <div key={index} className="col-sm-4 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title text-center">{ product.name }</h4>
                                    <small className="text-sm text-muted">Details</small>
                                    <dl className="row">

                                        <dt className="col-sm-5 text-sm"><small>Price</small></dt>
                                        <dd className="col-sm-6 text-sm"><small>{ product.price?.toLocaleString() }</small></dd>

                                        {
                                            product.storage != 0 &&
                                            <>
                                                <dt className="col-sm-5 text-sm"><small>Storage</small></dt>
                                                <dd className="col-sm-6 text-sm"><small>{ product.storage }GB</small></dd>
                                            </>
                                        }
                                        {
                                            product.ram != 0 &&
                                            <>
                                                <dt className="col-sm-5 text-sm"><small>RAM</small></dt>
                                                <dd className="col-sm-6 text-sm"><small>{ product.ram }GB</small></dd>
                                            </>
                                        }

                                        <dt className="col-sm-5 text-sm"><small>Color</small></dt>
                                        <dd className="col-sm-6 text-sm"><small>{ product.color }</small></dd>

                                        <dt className="col-sm-5 text-sm"><small>Stock</small></dt>
                                        <dd className="col-sm-6 text-sm"><small>{ product.stock }</small></dd>

                                    </dl>
                                    <button disabled={product.stock == 0} onClick={() => handleShowOrderDetails(product)} className="btn btn-primary btn-sm w-100">order</button>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <Modal
                show={modal}
                handleClose={onClose}
                title="Billing"
            >
                <div>
                    <dl className="row">

                        <dt className="col-sm-3">Product:</dt>
                        <dd className="col-sm-9">{ product.name }</dd>

                        <dt className="col-sm-3">Qty:</dt>
                        <dd className="col-sm-9">
                            <div className="d-flex align-items-center">
                                <button onClick={removeQuantity} disabled={product.qty == 0} className="btn btn-secondary btn-sm">-</button>
                                    <span className="px-2 mb-3">{(product.qty !== undefined ? product.qty : 0)}</span>
                                <button onClick={addQuantity} disabled={product.stock == product.qty} className="btn btn-secondary btn-sm">+</button>
                            </div>
                        </dd>

                        <dt className="col-sm-3">Tax:</dt>
                        <dd className="col-sm-9">
                            <input 
                                type="text" 
                                className="form-control form-control-sm w-50" 
                                placeholder="VAT"
                                onChange={(e) => setProduct(prev => ({...prev, vat: parseInt(e.target.value)}))}
                            />
                        </dd>

                        <dt className="col-sm-3">Bundle:</dt>
                        <dd className="col-sm-9">
                            <input 
                                type="text" 
                                className="form-control form-control-sm w-50" 
                                placeholder="Bundle"
                                onChange={(e) => setProduct(prev => ({...prev, bundle: e.target.value}))}
                            />
                        </dd>

                        <dt className="col-sm-3">Total Price:</dt>
                        <dd className="col-sm-9">
                            <input 
                                type="text" 
                                className="form-control form-control-sm w-50 readOnly" 
                                placeholder="Bundle"
                                value={((product.price! * product.qty!) /100 * (100 + product.vat!)).toLocaleString()}
                                onChange={() => console.log()}
                            />
                        </dd>
                    </dl>
                </div>
                <div className="d-flex gap-2 mt-5">
                    <button onClick={handleOrder} className="btn btn-primary w-100">Done</button>
                </div>
            </Modal>
        </div>
    )
}

WalkInOrders.layout = (page: ReactNode) => <MainLayout children={page} title='Walk in orders' />