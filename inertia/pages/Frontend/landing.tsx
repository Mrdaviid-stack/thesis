import { ReactNode } from "react"
import ShopLayout from "~/components/Layouts/shop"


export default function Landing(props: {page:any}) {
    return (
        <div className="landing">
            
          
                    <div className="container py-5">
                            <div dangerouslySetInnerHTML={{__html: props.page === null ? '<h6>Add Content in CMS</h6>' : props.page.content}} />
                        </div>
            
        </div>

    )
}

Landing.layout = (page: ReactNode) => <ShopLayout children={page} title='Shop' />