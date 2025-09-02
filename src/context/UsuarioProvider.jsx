import {useState } from "react";
import { UsuarioContext } from "./UsuarioContext";
import { useReducer } from "react";
import { types } from "../utils/types";

// Un ejemplo de Provider para version totalmente inicial sin tokens.
const init = () => {
    const valor = localStorage.getItem("isAuthenticated")
    return{
      isAuthenticated:!!valor
    }
}

const reducer = (state={},action) => {
    switch(action.type){
        case(types.login) : 
            return {
              isAuthenticated:true
            }
        case(types.logout) :
            return {
              isAuthenticated:false
            }
        default: 
            return state
    }
}

export const UsuarioProvider = ({children}) => { 
    const appLogin = () => {
        localStorage.setItem("isAuthenticated",true)
        dispatch({type : types.login})
    }

    const appLogout =() => {
        localStorage.removeItem("isAuthenticated")
        dispatch({type:types.logout})
    }

    const [state,dispatch] = useReducer(reducer,{},init)
  return (
    <UsuarioContext.Provider value={{...state ,appLogin, appLogout}}>
        {children}
    </UsuarioContext.Provider>
  )
}
