import React, { ReactNode } from "react"
import Cookies from "js-cookie"
import { router } from "@inertiajs/react"

interface MainLayoutProps {
    children: ReactNode
}

const AuthLayout: React.FC<MainLayoutProps> = ({children}) => { 
    const token = Cookies.get('token')

    if (token) {
        router.visit('/dashboard')
        return null
    }

    return (
        <main>
            { children }
        </main>
    )
}

export default AuthLayout
