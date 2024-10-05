import { ReactNode, useMemo, useState } from "react"
import { ProductCard } from "~/components/Cards/ProductCard"
import ShopLayout from "~/components/Layouts/shop"
import { useStore } from "~/context/store"

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

export default function Products(props: { products: any, categories: any }) {

    const {compare, setCompare } = useStore()

    const [search, setSearch] = useState<string>('')

    const search_product = useMemo(() => {
        const keys = Object.keys(props.products).filter(productKey => 
            props.products[productKey][0].name.toLowerCase().includes(search.toLowerCase())
        )
        return keys.map(key => props.products[key][0])
    }, [search])

    const handleOnCompare = (name: string) => {
        if (compare.some(product => product.name.includes(name))) {
            setCompare(compare.filter(products =>products.name !== name))
        } else setCompare([...compare, search_product.filter(product =>product.name === name)[0]])
    }

    return (
        <div className="shop-products">
            <section className="container-fluid p-5">
                <div className="row">
                    <div className="col-lg-3">
                        <div className="card card-body" style={{ height: '600px' }}>
                            <h4>Filter list</h4>
                            <ul className="navbar-nav">
                                {
                                    props.categories.map((category: any) => (
                                        <li className="nav-item">
                                            <a onClick={() => setSearch(category.name)} className="nav-link" href="#">{ category.name }</a>
                                        </li>
                                    ))
                                }
                                <button onClick={() => { setSearch(''); setCompare([])}} className="btn btn-info btn-sm mt-5">Reset filter and compare</button>
                            </ul>
                        </div>
                    </div>
                    <div className="col-9">
                        <input onChange={(e) => setSearch(e.target.value)} type="text" className="form-control w-25 mb-4" placeholder="Search product by name" />
                        <div className="row">
                            {
                                search_product.map((product: ProductsProps) => (
                                    <div className="col-4 mb-4">
                                        <ProductCard 
                                            name={product.name}
                                            modelNumber={product.modelNumber}
                                            handleCompareChange={handleOnCompare}
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

Products.layout = (page: ReactNode) => <ShopLayout children={page} title="Products" />
