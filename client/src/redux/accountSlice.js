import { createSlice } from "@reduxjs/toolkit"
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import { signOut } from "./authSlice";
import { toastConditions } from "../../scripts/toastConditions";

const SERVER_BASE = import.meta.env.VITE_SERVER_BASE


const delay = async (n = 1) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, n * 1000);
    })
}


const initialState = {
    isLoading: false,
    errorMsg: "",
    toastId: "",
    account: {

    }
};


const updateUserDataLS = ({ data = {} }) => {
    let old = JSON.parse(localStorage.getItem("user") || "{}")

    const filtered = {
        ...(data.firstName && { name: data.firstName }),
        ...(data.picture && { picture: data.picture }),
        ...(data.email && { email: data.email }),
    }
    localStorage.setItem("user", JSON.stringify({ ...old, ...filtered }))
}


export const getAccountDetails = createAsyncThunk("auth/getAccountDetails", async (_, { rejectWithValue: reject, getState }) => {

    try {
        // await delay(1)
        // const state = getState();
        // const mongo_id = state.auth.user.mongo_id;

        let response = await fetch(`${SERVER_BASE}/api/account/get-details`, {
            credentials: "include"
        })

        let data = await response.json()
        // console.log("data", data);

        if (!response.ok) {
            // throw new Error(data.message); // Triggers action.error.message
            console.log("data", data);
            return reject(data.message)
        }

        return data
    } catch (error) {
        console.log("getAccountDetails (error):", error);
        return reject(error.message);
    }

})


export const updateAccountDetails = createAsyncThunk("auth/updateAccountDetails", async ({ form, redirectPath=null }, { rejectWithValue: reject, getState }) => {

    try {
        // await delay(1)
        // console.log("redux form", form);
        // return

        // const state = getState();
        // const mongo_id = state.auth.user.mongo_id;

        let response = await fetch(`${SERVER_BASE}/api/account/update-details`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ form }),
            credentials: "include"
        })

        let data = await response.json()
        // console.log("data", data);

        if (!response.ok) {
            // throw new Error(data.message); // Triggers action.error.message
            console.log("data", data);
            return reject(data.message)
        }

        updateUserDataLS({ data: form })

        return { redirectPath }

    } catch (error) {
        console.log("updateAccountDetails (error):", error);
        return reject(error.message);
    }

})



export const deleteAccount = createAsyncThunk("auth/deleteAccount", async (_, { rejectWithValue: reject, getState, dispatch }) => {

    try {
        // await delay(1)

        // const state = getState();
        // const mongo_id = state.auth.user.mongo_id;


        let response = await fetch(`${SERVER_BASE}/api/account/`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
            },
            credentials: "include"
        })

        let data = await response.json()
        // console.log("data", data);

        if (!response.ok) {
            // throw new Error(data.message); // Triggers action.error.message
            console.log("data", data);
            return reject(data.message)
        }

        dispatch(signOut())
        clearAccountFromLS()
        return data
    } catch (error) {
        console.log("deleteAccount (error):", error);
        return reject(error.message);
    }

})



export const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {

        builder

            .addCase(getAccountDetails.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(getAccountDetails.fulfilled, (state, action) => {
                console.log("action.payload", action.payload);
                state.isLoading = false
            })
            .addCase(getAccountDetails.rejected, (state, action) => {
                // console.log("action.payload", action.payload);
                state.errorMsg = action.payload
                console.log("state.errorMsg", state.errorMsg);

                toast.error(state.errorMsg)
                state.isLoading = false
            })


            .addCase(updateAccountDetails.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(updateAccountDetails.fulfilled, (state, action) => {
                // console.log("action.payload", action.payload);

                const redirectPath = action.payload?.redirectPath

                if (redirectPath) {
                    setTimeout(() => {
                        window.location.href = redirectPath
                    }, 1000)
                }
                else{
                    state.isLoading = false
                    window.location.reload()
                }
                // else {
                //     setTimeout(() => {
                //         window.location.href = "/"
                //     }, 1000)
                // }
            })
            .addCase(updateAccountDetails.rejected, (state, action) => {
                // console.log("action.payload", action.payload);
                state.errorMsg = action.payload
                console.log("state.errorMsg", state.errorMsg);

                toast.update(state.toastId, {
                    render: `${state.errorMsg} 🥺`,
                    type: "error",
                    ...toastConditions,
                });
                state.isLoading = false
            })



            .addCase(deleteAccount.pending, (state, action) => {
                state.isLoading = true
                state.toastId = toast.loading("Deleting account...");
            })
            .addCase(deleteAccount.fulfilled, (state, action) => {
                toast.update(state.toastId, {
                    render: "Account Deleted 🙂",
                    type: "success",
                    ...toastConditions,
                });

                state.isLoading = false
            })
            .addCase(deleteAccount.rejected, (state, action) => {
                // console.log("action.payload", action.payload);
                state.errorMsg = action.payload
                console.log("state.errorMsg", state.errorMsg);

                toast.update(state.toastId, {
                    render: `${state.errorMsg} 🥺`,
                    type: "error",
                    ...toastConditions,
                });
                state.isLoading = false
            })

    }
})


export const { clearAccountFromLS } = accountSlice.actions

export default accountSlice.reducer



