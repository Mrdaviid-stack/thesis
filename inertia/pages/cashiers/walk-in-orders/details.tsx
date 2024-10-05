import { ReactNode } from "react"
import MainLayout from "~/components/Layouts/main"

export default function Details(props: { product: any }) {
    console.log(props.product)
    return (
        <div className="details">
            <div className="card card-body">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <h4>Product Details</h4>
                    <a href={`/cashiers/walk-in-orders/billing/${props.product.id}`} className="btn btn-primary">Proceed to billing</a>
                </div>
                <ul className="list-group mb-3">
                    <li className="list-group-item"><b>Product Name: </b>{props.product.name}</li>
                    <li className="list-group-item"><b>SKU: </b>{ props.product.sku }</li>
                    <li className="list-group-item"><b>Price: </b>₱ {props.product.price.toLocaleString()}</li>
                    <li className="list-group-item"><b>Color: </b>{props.product.color}</li>
                    <li className="list-group-item">
                        { <div dangerouslySetInnerHTML={{ __html: props.product.description }} /> }
                    </li>
                </ul>
                <input className="form-control" type="text" placeholder="bundles" />
            </div>
        </div>
    )
}

Details.layout = (page: ReactNode) => <MainLayout children={page} title='Dashboard' />