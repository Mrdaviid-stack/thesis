import { router } from "@inertiajs/react"
import { ReactNode } from "react"
import ShopLayout from "~/components/Layouts/shop"

import { useStore } from "~/context/store"
import { Toast } from "~/helpers/Toast"
import { requestService } from "~/services/api.service"

export default function Cart() {

    const { user, cart, setCart } = useStore()

    const handleAddQty = (id: number, user: number) => {
        setCart((prev:any) => prev.map((item: any) => item.id == id ? {...item, qty: item.qty + 1 }: item))
        requestService({
            url: `/shop/cart-item/${id}/${user}/${1}`,
            method: "patch",
        })

    }
    const handleRemoveQty = (id: number, user: number) => {
        setCart((prev:any) => prev.map((item: any) => item.id == id ? {...item, qty: item.qty - 1 }: item))
        requestService({
            url: `/shop/cart-item/${id}/${user}/${0}`,
            method: "patch",
        })
    }
    const handleRemoveItem = (id: number, user: number) => {
        requestService({
            url: `/shop/cart-item/${id}/${user}`,
            method: "delete"
        })
            .then(() => {
                Toast.fire({
                    icon: 'info',
                    text:  `Item removed.`
                })
                setCart((prev:any) => prev.filter((item: any) => item.id != id))
            })
    }

    return (
        <section style={{
            paddingTop: '3%',
            paddingLeft: '5%',
            paddingRight: '5%'
        }}>
            <div className="row">
                <div className="col-8">

                    <div className="card card-body">

                            <p className="mb-5"><span className="h6">Your Cart</span> <span className="text-muted">( {cart.length } {cart.length > 1 ? 'items' : 'item'} )</span></p>
                            {
                                cart.map((c:any) => ( 
                                    <div className="d-flex justify-content-between align-items-center border-bottom pb-4 px-5">
                                        <div className="d-flex flex-column gap-2">
                                            <div className="lh-1">
                                                <h5><ins>{c.name}</ins></h5>
                                                <small>{c.color}, {c.storage}</small>
                                                <br />
                                                <small>{c.modelNumber}</small>
                                                <br />
                                            </div>
                                            <div className="btn-group btn-group-sm" role="group" aria-label="Basic outlined example">
                                                <button disabled={c.qty === 0} onClick={() => handleRemoveQty(c.id, c.user)} type="button" className="btn btn-outline-primary">-</button>
                                                <button type="button" className="btn btn-outline-primary" disabled>{c.qty}</button>
                                                <button disabled={c.qty >= c.stock} onClick={() => handleAddQty(c.id, c.user)} type="button" className="btn btn-outline-primary">+</button>
                                            </div>
                                        </div>
                                        <div className="d-flex flex-column gap-4">
                                   
                                            <h5 className="text-center">₱ {c.price.toLocaleString()}</h5>
                                     
                                            <button onClick={() => handleRemoveItem(c.id, c.user)}  className="btn btn-danger btn-sm"><i className="fa-solid fa-trash text-lg"></i></button>
                                        </div>
                                    </div>
                                ))
                            }
                     
                    </div>

                </div>
                <div className="col-4">
                    <div className="card card-body">
                        <h4>Order Summary</h4>
                        <hr />
                        <h4>Total</h4>
                        <dl className="row">

                            <dt className="col-sm-9 text-sm"><b>12% VAT (Inclusive)</b></dt>
                            <dd className="col-sm-3 text-sm">₱ { cart.reduce((total:number, item:any) => total + item.price * item.qty, 0).toLocaleString()  }</dd>

                        </dl>

                        <button disabled={cart.length === 0 || !user.email} onClick={() => router.visit('/shop/shops/order')} className="btn btn-primary mt-4">Checkout</button>
                    </div>
                </div>
            </div>
        </section>
    )
}

Cart.layout = (page: ReactNode) => <ShopLayout children={page} title="Cart" />