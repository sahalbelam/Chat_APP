import { onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import { auth } from "@/utils/firebase";

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth,(user)=>{
           setIsAuthenticated(user ? true : false)
        })
        return()=>unsubscribe()
    },[])
    return isAuthenticated
}

export default useAuth
