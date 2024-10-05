import { router } from "@inertiajs/react"
import { ReactNode } from "react"
import MainLayout from "~/components/Layouts/main"
import { Toast } from "~/helpers/Toast"
import { requestService } from "~/services/api.service"

export default function OrderAknowledgements(props: {transactions: any}) {
    console.log(props.transactions)

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
        <div className="order-acknowledgement">
            <div className="card card-body">
                {
                    props.transactions.map((transaction: any) => (
                        <div className="d-flex justify-content-between gap-5 border px-2 py-3">
                            {transaction.order.orderProducts.map((product: any) => (
                                <>
                                    <div>
                                        <h6 className="card-title">{product.products.name}</h6>
                                        <small>{product.products.color} | {product.products.storage}</small>
                                        <br /> 
                                        <small>SKU: {product.products.sku}</small>
                                        <br />
                                        <small>Payment: {transaction.payment.paymentMethod}</small>
                                        <br />
                                        <small>Reference: {transaction.payment.reference}</small>
                                    </div>
                                    <div>
                                        <h6 className="card-title">Customer Information </h6>
                                        <small>{transaction.order.user.firstname} {transaction.order.user.lastname}</small>
                                        <br />
                                        <small>{transaction.order.user.email}</small>
                                        <br />
                                        <small>{transaction.order.user.address}</small>
                                    </div>
   
                                <button onClick={() => handleAcknowledge(transaction.id, 'order-placed')} className="btn btn-primary align-self-center h-25">Acknowledge</button>
                                </>
                            ))}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

OrderAknowledgements.layout = (page: ReactNode) => <MainLayout children={page} title='Order Acknowledgements' />