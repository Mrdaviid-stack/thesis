import { router } from "@inertiajs/react"
import { ReactNode, useState } from "react"
import ShopLayout from "~/components/Layouts/shop"

import { useStore } from "~/context/store"
import { requestService } from "~/services/api.service"

export default function Order() {

    const [paymentMethod, setPaymentMethod] = useState('cod')
    const [reference, setReference] = useState('')
    const [downpayment, setDownpayment] = useState(0)
    const [alternativeUserInfo, setAlternativeUserInfo] = useState({email: '', address: ''})

    const { cart, user } = useStore()

    if (!user.email || cart.length === 0) {
        router.visit('/shop/shops/product')
        return null;
    }
    
    const handlePlacedOrder = () => {
        requestService({
            url: "/shop/placed-order",
            method: "post",
            payload: {
                cart,
                totalAmount: cart.reduce((total:number, item:any) => total + item.price * item.qty, 0),
                paymentMethod,
                downpayment,
                reference,
                user,
                alternativeUserInfo,
            }
        }).then(() => router.visit('/'))
    }

    return (
        <div className="order pt-4" style={{ marginLeft: '5%', marginRight: '5%' }}>
            <div className="card card-body">
                <div className="row">
                    <div className="col-5">

                        <ul className="list-group">
                            {
                                cart.map((crt:any) => (
                                    <li className="list-group-item">
                                        <h5 className="mb-0"><ins>{crt.name}</ins></h5>
                                        <small className="text-muted">{crt.color} | {crt.storage}</small>
                                        <p><span className="h6">P {crt.price.toLocaleString()}</span>  <span className="text-muted text-sm">x{crt.qty}</span></p>
                                    </li>
                                ))
                            }
                        </ul>

                    </div>
                    <div className="col-7">
                        <p className="mb-0"><span className="h6">Total Price:</span> <span className="h5">{cart.reduce((total:number, item:any) => total + item.price * item.qty, 0).toLocaleString() }</span></p>
                        <p><span className="h6">Total Items:</span> <span className="h5">{cart.reduce((total:number, item:any) => total + item.qty, 0).toLocaleString() }</span></p>
                        <form action="">
                            <div className="row">
                                <div className="col-6">
                                    <div className="mb-3">
                                        <label>Firtname:</label>
                                        <input type="text" value={user.firstname} className="form-control" readOnly />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="mb-3">
                                        <label>Lastname:</label>
                                        <input type="text" value={user.lastname} className="form-control" readOnly />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label>Email:</label>
                                <input onChange={(e) => setAlternativeUserInfo(prev => ({...prev, email: e.target.value}))} type="text" className="form-control" />
                            </div>
                            <div className="mb-3">
                                <label>Address:</label>
                                <textarea onChange={(e) => setAlternativeUserInfo(prev => ({...prev, address: e.target.value}))} className="form-control"></textarea>
                            </div>
                            <div className="mb-3">
                                <label>Send Downpayment here:</label>
                                <input type="text" className="form-control" readOnly value={639123456789}/>
                            </div>
                            <div className="mb-3">
                                <label>Payment Method</label>
                                <select onChange={(e) =>  setPaymentMethod(e.target.value)} className="form-select">
                                    <option value="cod">Cash on Delivery</option>
                                    <option value="gcash">Gcash</option>
                                    <option value="paymaya">PayMaya</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label>Downpayment</label>
                                <input onChange={(e) => setDownpayment(parseInt(e.target.value))} type="number" className="form-control" placeholder="Downpayment" required/>
                            </div>
                            <div className="mb-3">
                                <label>Reference number</label>
                                <input onChange={(e) => setReference(e.target.value)} type="text" className="form-control" placeholder="Reference number" required/>
                            </div>
                            <button disabled={!reference} onClick={handlePlacedOrder} className="btn btn-primary w-100">Placed Order</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

Order.layout = (page: ReactNode) => <ShopLayout children={page} title="Order" />