import { useEffect, useState } from "react"
import Cookies from "js-cookie"

export const usePermissions = () => {
    const abilities = Cookies.get('abilities')

    const [userAbilities, setUserAblities] = useState<string[]>([])
    const [isUserAbilities, setIsUserAbilities] = useState<string>('')

    useEffect(() => setUserAblities(JSON.parse(abilities!)), [abilities] )

    return {
        setIsUserAbilities
    }
}