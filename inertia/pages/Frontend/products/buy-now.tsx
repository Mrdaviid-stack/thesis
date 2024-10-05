import { ReactNode, useMemo, useState } from "react"
import _ from "lodash";
import ShopLayout from "~/components/Layouts/shop"
import { useStore } from "~/context/store";
import { requestService } from "~/services/api.service";

import Cookies from "js-cookie";
import { Toast } from "~/helpers/Toast";
import { router } from "@inertiajs/react";

interface ProductsProps {
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
    category: {
        name: string;
    };
}


export default function Buynow(props: { product: ProductsProps[] }) {

    const { setCart } = useStore()
    let user = Cookies.get('user')


    const [product, setProduct] = useState({
        id:  props.product[0].id, 
        name: props.product[0].name, 
        color: '', 
        storage: '', 
        price: props.product[0].price,
        modelNumber: '',
        qty: 1,
        stock: props.product[0].stock,
        user: user !== undefined ? JSON.parse(Cookies.get('user')!)[0].id : null
    })

    const storage = _.groupBy(props.product, 'storage')
    const color = _.groupBy(props.product, 'color')

    const colorAvailable = useMemo(() => {
        if (!product.storage) 
            return [props.product[0].color]
        return storage[product.storage].map(prod => prod.color)
    }, [product.storage])

    const addToCart = () => {
        if (user === undefined) {
            router.visit('/shop/auth/login')
            return
        }
        setCart((prev:any) => [...prev, product])
        requestService({
            url: '/shop/add-to-cart',
            method: 'post',
            payload: {...product}
        })
            .then(() => {
                Toast.fire({
                    icon: 'info',
                    text: `${product.name} added to cart!`
                })
                router.visit('/shop/shops/cart')
            })
    }


    return (
        <section>
            <div className="d-flex justify-content-between px-5 py-4 d-flex border bg-light position-sticky">
                <h3>{ props.product[0].name }</h3>
                {/* <ul className="navbar-nav d-flex flex-row gap-4">
                    <li className="nav-item">
                        <a href="" className="nav-link">
                            <i className="fa-solid fa-user"></i>
                        </a>
                    </li>
                    <li className="nav-item">
                        <Link href="/shop/shops/cart" className="nav-link position-relative">
                            <i className="fa-solid fa-cart-shopping"></i>
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {cart.length}
                                <span className="visually-hidden">unread messages</span>
                            </span>
                        </Link>
                    </li>
                </ul> */}
            </div>
            <div className="row p-5">
                <div className="col-5">
                    IMAGE
                </div>
                <div className="col-7">
                    <h2>{ props.product[0].name }</h2>
                    <small>{ props.product[0].sku }</small>
                    <hr />
                    <div dangerouslySetInnerHTML={{ __html: props.product[0].description }} />

                    <div>
                        <p className="h5">Choose Storage</p>
                        {
                            Object.keys(storage).map(storage => (
                                <div key={storage} className="form-check form-check-inline">
                                    <input key={storage} onChange={(e) => setProduct(prev => ({
                                        ...prev,
                                        storage: e.target.value,
                                    }))} className="form-check-input" type="radio" name="storage" value={storage}/>
                                    <label className="form-check-label">{ storage }</label>
                                </div>
                            ))
                        }                        
                    </div>

                    <div>
                        <p className="h5">Choose Color</p>
                        {
                            Object.keys(color).map(color =>  {
                                return (
                                    <div key={color} className="form-check form-check-inline">
                                        <input key={color} disabled={!product.storage || !colorAvailable.includes(color) } onChange={(e) => setProduct(prev => ({
                                            ...prev, 
                                            color: e.target.value,
                                            price: props.product.filter(item => item.color == e.target.value)[0].price,
                                            id: props.product.filter(item => item.color == e.target.value)[0].id,
                                            modelNumber: props.product.filter(item => item.color == e.target.value)[0].modelNumber
                                        }))} className="form-check-input" type="radio" name="color" value={color}/>
                                        <label className="form-check-label">{ color }</label>
                                    </div>
                                )
                            })
                        }                        
                    </div>

                    <div className="card card-body mt-5 w-50">
              
                        <h6>{ props.product[0].name }</h6>
                        <p><small className="text-muted">{ product.color }</small> | <small className="text-muted">{ product.storage }</small></p>
                        <h4 className="text-center">₱ { product.price.toLocaleString() }</h4>
         
                            <button disabled={!product.storage || !product.color} onClick={addToCart} className="btn btn-primary">Add to cart</button>
                 
                    </div>

                </div>
            </div>
        </section>
    )
}

Buynow.layout = (page: ReactNode) => <ShopLayout children={page} title="Buy" />