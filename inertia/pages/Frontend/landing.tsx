import { ReactNode } from "react"
import ShopLayout from "~/components/Layouts/shop"


export default function Landing() {
    return (
        <div className="landing">
            <h1>landing page</h1>
        </div>

    )
}

Landing.layout = (page: ReactNode) => <ShopLayout children={page} title='Shop' />