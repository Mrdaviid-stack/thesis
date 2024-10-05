import { ReactNode } from "react"
import { Head } from "@inertiajs/react"
import ShopLayout from "~/components/Layouts/shop"

export default function Slug(props: { page: any }) {
    console.log(props.page)
    return (
        <div className="slug">
            <Head title={props.page.name} />
            <div className="container py-5">
                <div dangerouslySetInnerHTML={{__html: props.page.content}} />
            </div>
        </div>
    )
}

Slug.layout = (page: ReactNode) => <ShopLayout children={page} />