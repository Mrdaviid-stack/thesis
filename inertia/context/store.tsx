import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import Cookies from "js-cookie";

interface UserProps {
    id: string;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    address: string;
}

interface IContext {
    user: UserProps;
    setUser: (user: UserProps) => void;
    orders: {};
    setOrders: (order: {}) => void;
    compare: any[];
    setCompare: (compare: any[]) => void;
    cart: any;
    setCart: (cart: any) => void; 
    hasAbility: (ability: string) => boolean;
    hasAccess: (menu: string, subMenu?: any[]) => boolean;
}

const StoreContext = createContext<IContext | undefined>(undefined)

export const StoreProvider: React.FC<{children: ReactNode}> = ({ children }) => {

    const [user, setUser] = useState<UserProps>({id: '', username: '', firstname: '', lastname: '', email: '', address: ''})
    const [cart, setCart] = useState<any>([])
    const [orders, setOrders] = useState<{}>({storage: '', color: '', ram: ''})
    const [compare, setCompare] = useState<any[]>([])

    const hasAbility = (ability: string) => {
        const userAbilities = JSON.parse(localStorage.getItem('abilities')!)
        return userAbilities?.includes(ability) 
    }

    const hasAccess = (menu: string, subMenu?: any[]) => {
        const userAbilities = JSON.parse(localStorage.getItem('abilities')!)

        if (subMenu) {
            return (userAbilities.includes(menu) || subMenu?.some((sub) => userAbilities.includes(sub.permissions)))
        }
        return userAbilities.includes(menu)
    }

    useEffect(() => {
        const user = Cookies.get('user')
        if (user)
            setUser(JSON.parse(user)[0])
    }, [])

    const value = {
        user,
        setUser,
        orders,
        setOrders,
        compare,
        setCompare,
        cart,
        setCart,
        hasAbility,
        hasAccess,
    }

    return (
        <StoreContext.Provider value={value}>
            { children }
        </StoreContext.Provider>
    )
}

export const useStore = (): IContext => {
    const context = useContext(StoreContext)
    if (!context) throw new Error('context error')

    return context
}