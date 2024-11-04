import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

function AuthContextProvider({children}){
    const [isAuth,setIsAuth] = useState(localStorage.getItem("token") ? true : false)
    const [token,setToken] = useState(localStorage.getItem("token") || "")
    const [user,setUser] = useState(JSON.parse(localStorage.getItem("user")) || {})

    useEffect(() => {
        if (token && user) {
          localStorage.setItem("token", token);
          localStorage.setItem("user",JSON.stringify(user));
        }
      }, [token, user]);

    const login = (token,user) => {
        setIsAuth(true);
        setToken(token);
        setUser(user)
    }

    const logout = () => {
        setIsAuth(false);
        setToken("")
        setUser("")
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }

    return (
        <AuthContext.Provider value={{isAuth, login, logout, token, user}}>
           {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider
