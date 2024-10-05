
import { router } from "@inertiajs/react";
import _ from "lodash"
import { useStore } from "~/context/store";

interface ProductCardProps {
    name: string;
    modelNumber: string;
    handleCompareChange: Function
}

export const ProductCard = ({ name, modelNumber, handleCompareChange }: ProductCardProps) => {

    const {compare} = useStore()

    const onNavigate = () => router.visit(`/shop/shops/product/${modelNumber}/buy`)

    return (
        <div className="card" style={{textOverflow: "ellipsis", height: '100%'}}>
            <div className="card-body">
                <h5 className="card-title">{ name }</h5>

                <div className="d-flex flex-column justify-content-center">
                    <button onClick={onNavigate} className="btn btn-primary w-100">Buy now</button>
                    <div className="form-check">
                        <input 
                            disabled={compare.length === 3}
                            onChange={(e) => handleCompareChange(e.target.value)} className="form-check-input" type="checkbox" name="compare" value={name}/>
                        <label className="form-check-label">
                            Compare
                        </label>
                    </div>
                </div>

            </div>
        </div>
    )
}