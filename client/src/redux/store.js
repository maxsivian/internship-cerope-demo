import {configureStore} from "@reduxjs/toolkit"
import routeReducer from "./routeSlice"
import authReducer from "./authSlice"
import accountReducer from "./accountSlice"


export const store = configureStore({
    reducer:{
        route: routeReducer,
        auth: authReducer,
        account: accountReducer
    }
})
