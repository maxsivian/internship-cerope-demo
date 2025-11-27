import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    isRouteLoading: false,
};

export const routeSlice = createSlice({
    name: "route",
    initialState,
    reducers: {
        setRouteLoading: (state, action)=>{
            state.isRouteLoading = action.payload
        }
    },
   
}) 

export const { setRouteLoading } = routeSlice.actions

export default routeSlice.reducer