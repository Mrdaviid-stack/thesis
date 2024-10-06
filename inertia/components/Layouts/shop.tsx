import { Head, Link } from "@inertiajs/react"
import React, { ReactNode, useEffect } from "react"

import { Modal } from "../Modal"

import { useStore } from "~/context/store"
import { useModal } from "~/hooks/useModal"

import Cookies from "js-cookie"
import { requestService } from "~/services/api.service"

// import Cookies from "js-cookie"
// import { router } from "@inertiajs/react"

interface MainLayoutProps {
    children: ReactNode
    title?: string
}

const ShopLayout: React.FC<MainLayoutProps> = ({children, title}) => { 
    // const token = Cookies.get('token')

    // if (token) {
    //     router.visit('/dashboard')
    //     return null
    // }

    const { user, compare, cart, setCart } = useStore()
    const { modal, onShow, onClose } = useModal()

    const handleClose = () => {
        onClose()
        window.location.reload()
    }

    const onLogout = () => requestService({url: '/dashboard/logout', method: 'get'}).then(() => {
        Cookies.remove('token')
        Cookies.remove('user')
        location.href = '/shop'
    })

    useEffect(() => {
        let user = Cookies.get('user')
        if (user !== undefined) {
            user = JSON.parse(user)[0].id
            requestService({
                url: `/shop/cart-item/${user}`,
                method: 'get',
            })
                .then(response => {
                    if (response.data.cartItem.length === 0) {
                        return setCart([])
                    }
                    const cartItems = response.data.cartItem.map(({ userId, cartItems }: {userId: number, cartItems: any[]}) =>
                        cartItems.map((item: any) => ({
                            user: userId,
                            name: item.product.name,
                            color: item.product.color,
                            storage: item.product.storage,
                            price: item.product.price,
                            modelNumber: item.product.modelNumber,
                            stock: item.product.stock,
                            qty: item.quantity,
                            id: item.product.id  
                        }))
                    )

                    setCart(cartItems[0])
                    
                })
        }
    }, [])

    return (
        <main>
            <Head title={title} />
            <nav className="navbar navbar-expand-lg bg-body-tertiary py-4">
                <div className="container-fluid">
                    <Link className="navbar-brand" href="/">Navbar</Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav m-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link" href="/shop/shops/product">Products</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/shop/about">About Us</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/shop/contact">Contact</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/shop/faqs">FAQs</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                    
                                <ul className="navbar-nav">
                                    {
                                        user.id === '' 
                                            ?   <li className="nav-item">
                                                    <Link className="nav-link" href="/shop/auth/login">Sign in</Link>
                                                </li>
                                            :   <li className="nav-item dropstart">
                                                    <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#">
                                                        <i className="fa-solid fa-user"></i>
                                                    </a>
                                                    <ul className="dropdown-menu">
                                                        <li><Link className="dropdown-item" href="/shop/shops/profile">Account</Link></li>
                                                        <li><a onClick={onLogout} className="dropdown-item" href="#">Sign Out</a></li>
                                                    </ul>

                                                </li>
                                    }
                                    <li className="nav-item">
                                        <Link href="/shop/shops/cart" className="nav-link position-relative">
                                            <i className="fa-solid fa-cart-shopping"></i>
                                            {
                                                cart.length > 0 && 
                                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                        {cart.length}
                                                        <span className="visually-hidden">unread messages</span>
                                                    </span>
                                            }
                                        </Link>
                                    </li>
                                </ul>
                  
                    </div>
                </div>
            </nav>
            <section>
                { children }
            </section>
            {
                compare.length > 0 && 
                <div className="position-absolute w-75" style={{ bottom: '10%', left: '15%' }}>
                    <div className="d-flex justify-content-between align-items-center rounded py-2 px-2 bg-info">
                        <div>{ compare.length } { compare.length > 1 ? 'Products' : 'product' } to compare</div>
                        <div>
                            <a href="#" onClick={() => window.location.reload()} className="px-5"><b><ins>Clear all</ins></b></a>
                            <button onClick={onShow} className="btn btn-warning mt-3">Compare</button>
                        </div>
                    </div>
                </div>
            }
            <Modal
                show={modal}
                handleClose={handleClose}
                title="Compare"
                size="modal-xl"
            >
                <div className="row">
                    {
                        compare.map(product => (
                            <div className="col">
                                <div className="card">
                                    <div className="card-body">
                                        <h3 className="card-title">{product.name}</h3>
                                        <small className="text-muted"><b>Color:</b> {product.color}</small>
                                        <p className="text-muted text-sm" dangerouslySetInnerHTML={{__html: product.description}} />
                                    </div>
                                </div>

                            </div>
                        ))
                    }
                </div>
            </Modal>
        </main>
    )
}

export default ShopLayout