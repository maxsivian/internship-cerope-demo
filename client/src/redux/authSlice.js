import { createSlice } from "@reduxjs/toolkit"
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import { googleLogout } from "@react-oauth/google";
import { toastConditions } from "../../scripts/toastConditions";

const SERVER_BASE = import.meta.env.VITE_SERVER_BASE

const delay = async (n = 1) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, n * 1000);
    })
}


const getInitialUser = () => {
    const userStr = localStorage.getItem("user");

    if (!userStr) {
        return {
            picture: "",
            name: "",
            email: "",
            mongo_id: ""
        };
    }

    try {
        return JSON.parse(userStr);
    } catch (e) {
        return {
            picture: "",
            name: "",
            email: "",
            mongo_id: ""
        };
    }
};


const getInitialOthers = () => {
    const othersStr = localStorage.getItem("others");

    if (!othersStr) {
        return {
            emailPendingVerify: "",
            isVerificationFailed: false,
            isVerificationEmailSent: false,
        }
    }

    try {
        return JSON.parse(othersStr);
    } catch (e) {
        return {
            emailPendingVerify: "",
            isVerificationFailed: false,
            isVerificationEmailSent: false,
        }
    }
};


const getInitialAccountStatus = () => {
    const status = localStorage.getItem("isAccountSignedIn")

    if (status == "true") {
        return true
    }
    return false
}


const initialState = {
    user: getInitialUser(),
    others: getInitialOthers(),
    // authToken: token,
    isLoading: false,
    // isEmailLoading: false,
    // emailMsg: "",
    errorMsg: "",
    toastId: "",
    // isAccountSignedIn: token ? true : false
    isAccountSignedIn: getInitialAccountStatus()
};


export const checkEmail = createAsyncThunk("auth/checkEmail", async ({ email }, { rejectWithValue: reject, getState }) => {

    try {
        // console.log("redux email", email);
        // await delay(1)

        let response = await fetch(`${SERVER_BASE}/api/auth/check-email?email=${email}`)
        let data = await response.json()

        console.log("data", data);
        // console.log("response.status", response.status);

        if (response.status == 409) {
            // throw new Error(data.message); // Triggers action.error.message
            return reject({ status: 409, message: data.message })
        }

        if (!response.ok) {
            return reject(data.message)
        }

        return { status: 200, message: data.message }
    } catch (error) {
        // console.log("error.code", error.code);    
        // console.log("checkEmail (error):", error);
        return reject(error.message);
    }

})

export const preSignUp = createAsyncThunk("auth/preSignUp", async ({ form }, { rejectWithValue: reject, getState }) => {

    try {
        // console.log("user", user);

        // await delay(1)

        let response = await fetch(`${SERVER_BASE}/api/auth/pre-signup`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(form),
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
        console.log("preSignUp (error):", error);
        return reject(error.message);
    }

})

// export const postSignUp = createAsyncThunk("auth/postSignUp", async ({ email, token }, { rejectWithValue: reject, getState }) => {

//     try {
//         // console.log("email, token", email, token);
//         // await delay(1)

//         let response = await fetch(`${SERVER_BASE}/api/auth/post-signup?email=${email}&token=${token}`, {
//             method: "GET",
//             headers: {
//                 "Content-type": "application/json",
//             },
//             credentials: "include"
//         })

//         let data = await response.json()
//         // console.log("data", data);

//         if (!response.ok) {
//             // throw new Error(data.message); // Triggers action.error.message
//             console.log("data", data);
//             return reject(data.message)
//         }

//         return data
//     } catch (error) {
//         console.log("postSignUp (error):", error);
//         return reject(error.message);
//     }

// })

// export const resendVerificationEmail = createAsyncThunk("auth/resendVerificationEmail", async ({ email }, { rejectWithValue: reject, getState }) => {

//     try {
//         // console.log("email", email);
//         // await delay(1)

//         let response = await fetch(`${SERVER_BASE}/api/auth/resend-verification-email`, {
//             method: "POST",
//             headers: {
//                 "Content-type": "application/json",
//             },
//             body: JSON.stringify({ email })
//         })

//         let data = await response.json()
//         // console.log("data", data);

//         if (!response.ok) {
//             // throw new Error(data.message); // Triggers action.error.message
//             console.log("data", data);
//             return reject(data.message)
//         }

//         return data
//     } catch (error) {
//         console.log("postSignUp (error):", error);
//         return reject(error.message);
//     }

// })

export const signIn = createAsyncThunk("auth/signIn", async ({ form }, { rejectWithValue: reject }) => {
    try {
        // console.log("user", user);

        // await delay(1)
        let response = await fetch(`${SERVER_BASE}/api/auth/signin`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(form),
            credentials: "include"
        })

        let data = await response.json()
        // console.log("data", data);

        if (!response.ok) {
            console.log("data", data);
            return reject(data)
        }

        return data

    } catch (error) {
        console.log("SignIn (error):", error);
        return reject(error);
    }
})

export const signOut = createAsyncThunk("auth/signOut", async (_, { rejectWithValue: reject }) => {
    try {
        // console.log("user", user);

        // await delay(1)

        let response = await fetch(`${SERVER_BASE}/api/auth/signout`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            credentials: "include"
        })

        let data = await response.json()
        // console.log("data", data);

        if (!response.ok) {
            console.log("data", data);
            return reject(data.message)
        }

        return data

    } catch (error) {
        console.log("SignIn (error):", error);
        return reject(error.message);
    }
})

// export const forgotPassword = createAsyncThunk("auth/forgotPassword", async ({ email }, { rejectWithValue: reject }) => {
//     try {
//         // console.log("email", email);

//         // await delay(1)

//         let response = await fetch(`${SERVER_BASE}/api/auth/request-reset-password`, {
//             method: "POST",
//             headers: {
//                 "Content-type": "application/json",
//             },
//             body: JSON.stringify({ email })
//         })

//         let data = await response.json()
//         // console.log("data", data);

//         if (!response.ok) {
//             console.log("data", data);
//             return reject(data.message)
//         }

//         return data
//         // return true

//     } catch (error) {
//         console.log("ForgotPassword (error):", error);
//         return reject(error.message);
//     }
// })

// export const resetPassword = createAsyncThunk("auth/resetPassword", async ({ password, token, email }, { rejectWithValue: reject }) => {
//     try {
//         // console.log("password", password);
//         // console.log("token", token);


//         // await delay(1)

//         let response = await fetch(`${SERVER_BASE}/api/auth/reset-password`, {
//             method: "POST",
//             headers: {
//                 "Content-type": "application/json",
//             },
//             body: JSON.stringify({ password, token, email })
//         })

//         let data = await response.json()
//         // console.log("data", data);

//         if (!response.ok) {
//             console.log("data", data);
//             return reject(data.message)
//         }

//         return data
//         // return true

//     } catch (error) {
//         console.log("ResetPassword (error):", error);
//         return reject(error.message);
//     }
// })

export const signInWithGoogle = createAsyncThunk("auth/signInWithGoogle", async (googleToken, { rejectWithValue: reject }) => {
    try {
        const response = await fetch(`${SERVER_BASE}/api/auth/google-auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token: googleToken }),
            credentials: "include"
        })

        const data = await response.json()
        if (!response.ok) {
            console.log("data", data);
            return reject(data)
        }

        return data

    } catch (error) {
        console.log("signInWithGoogle (error):", error);
        return reject(error);
    }
}
)


const handleClearErrorMsg = (state) => {
    state.errorMsg = ""
}

const storeUserDataLS = (state) => {
    // localStorage.setItem("authToken", state.authToken)
    localStorage.setItem("user", JSON.stringify(state.user))
    localStorage.setItem("isAccountSignedIn", state.isAccountSignedIn)
}

const storeOthersDataLS = (state) => {
    localStorage.setItem("others", JSON.stringify(state))
}

const handleSignOut = (state) => {
    state.user = {
        picture: "",
        name: "",
        email: "",
        mongo_id: ""
    };
    // state.authToken = ""
    state.isAccountSignedIn = false
    // localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    localStorage.setItem("isAccountSignedIn", false)
    googleLogout()
}



export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // clearErrorMsg: handleClearErrorMsg,
        signOut: handleSignOut
    },
    extraReducers: (builder) => {

        builder

            // .addCase(checkEmail.pending, (state, action) => {
            //     state.isEmailLoading = true
            // })
            // .addCase(checkEmail.fulfilled, (state, action) => {
            //     console.log("action.payload", action.payload);
            //     state.isEmailLoading = false
            // })
            .addCase(checkEmail.rejected, (state, action) => {
                state.errorMsg = action.payload
                console.log("state.errorMsg", state.errorMsg);
                toast.error(state.errorMsg, toastConditions)
            })


            .addCase(preSignUp.pending, (state, action) => {
                state.isLoading = true
                state.toastId = toast.loading("Signing Up...");
            })
            .addCase(preSignUp.fulfilled, (state, action) => {
                // console.log("action.payload", action.payload);

                state.others.emailPendingVerify = action.payload.data
                storeOthersDataLS(state.others)

                toast.update(state.toastId, {
                    render: "Signed Up 😊",
                    type: "success",
                    ...toastConditions,
                });
                state.isLoading = false

                setTimeout(() => {
                    // window.location.href = "/signup/verification-pending"; // or use useNavigate("/signin") if in component
                    window.location.href = "/signin";
                }, 2000);
            })
            .addCase(preSignUp.rejected, (state, action) => {
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



            // .addCase(postSignUp.pending, (state, action) => {
            //     state.isLoading = true
            //     state.others.isVerificationFailed = false
            //     state.others.isVerificationEmailSent = false
            //     state.toastId = toast.loading("Verifying...");
            // })
            // .addCase(postSignUp.fulfilled, (state, action) => {
            //     // console.log("action.payload", action.payload);

            //     let user = action.payload.user
            //     state.user.name = user.name
            //     state.user.mongo_id = user.mongo_id
            //     state.user.email = user.email
            //     // state.authToken = action.payload.authToken
            //     state.isAccountSignedIn = true
            //     storeUserDataLS(state)

            //     state.others = {}
            //     storeOthersDataLS(state.others)

            //     toast.update(state.toastId, {
            //         render: "Verified & Signed In😊",
            //         type: "success",
            //         ...toastConditions,
            //     });

            //     let redirectUrl = ""
            //     if (action?.payload?.redirectToSetup) {
            //         redirectUrl = "/setup"
            //     }
            //     else {
            //         redirectUrl = "/"
            //     }

            //     setTimeout(() => {
            //         window.location.href = redirectUrl;
            //     }, 2000);

            //     // state.isLoading = false
            // })
            // .addCase(postSignUp.rejected, (state, action) => {
            //     // console.log("action.payload", action.payload);
            //     state.errorMsg = action.payload

            //     state.others.isVerificationFailed = true
            //     storeOthersDataLS(state.others)

            //     console.log("state.errorMsg", state.errorMsg);

            //     toast.update(state.toastId, {
            //         render: `${state.errorMsg} 🥺`,
            //         type: "error",
            //         ...toastConditions,
            //     });
            //     state.isLoading = false
            // })



            // .addCase(resendVerificationEmail.pending, (state, action) => {
            //     state.isLoading = true
            //     state.toastId = toast.loading("Sending email...");
            // })
            // .addCase(resendVerificationEmail.fulfilled, (state, action) => {
            //     // console.log("action.payload", action.payload);

            //     toast.update(state.toastId, {
            //         render: "Email sent 😊",
            //         type: "success",
            //         ...toastConditions,
            //     });
            //     state.others.isVerificationFailed = false
            //     state.others.isVerificationEmailSent = true
            //     storeOthersDataLS(state.others)

            //     state.isLoading = false
            // })
            // .addCase(resendVerificationEmail.rejected, (state, action) => {
            //     // console.log("action.payload", action.payload);
            //     state.errorMsg = action.payload

            //     state.others.isVerificationFailed = true
            //     storeOthersDataLS(state.others)

            //     console.log("state.errorMsg", state.errorMsg);

            //     toast.update(state.toastId, {
            //         render: `${state.errorMsg} 🥺`,
            //         type: "error",
            //         ...toastConditions,
            //     });
            //     state.isLoading = false
            // })



            .addCase(signIn.pending, (state, action) => {
                state.isLoading = true
                state.toastId = toast.loading("Signing In...");
            })
            .addCase(signIn.fulfilled, (state, action) => {
                // console.log("action.payload", action.payload);

                let user = action.payload.user
                state.user.name = user.name
                state.user.mongo_id = user.mongo_id
                state.user.email = user.email

                // state.authToken = action.payload.authToken

                state.isAccountSignedIn = true
                storeUserDataLS(state)


                state.others = {}
                storeOthersDataLS(state.others)

                toast.update(state.toastId, {
                    render: "Signed In 😊",
                    type: "success",
                    ...toastConditions,
                });

                let redirectUrl = ""
                if (action?.payload?.redirectToSetup) {
                    redirectUrl = "/setup"
                }
                else {
                    redirectUrl = "/"
                }

                setTimeout(() => {
                    window.location.href = redirectUrl;
                }, 2000);

                // state.isLoading = false
            })
            .addCase(signIn.rejected, (state, action) => {
                // console.log("action.payload", action.payload);

                state.errorMsg = action.payload.message
                // console.log("state.errorMsg", state.errorMsg);

                if (state.errorMsg == "Email not verified yet. Check your email") {
                    // console.log("action.payload.data", action.payload.data);
                    state.others.emailPendingVerify = action.payload.data
                    storeOthersDataLS(state.others)
                    setTimeout(() => {
                        window.location.href = "/signin/verification-pending";
                    }, 2000);
                    return
                }
                else if (state.errorMsg == "This account was created using Google Sign-In. Please sign in with Google or use 'Forgot Password' to set a password.") {
                    toast.update(state.toastId, {
                        render: `${state.errorMsg} 🥺`,
                        type: "error",
                        ...toastConditions,
                        autoClose: 5000
                    });
                    setTimeout(() => {
                        window.location.href = "/signin"; // or use useNavigate("/signin") if in component
                    }, 5000);
                    state.isLoading = false
                    return;
                }
                toast.update(state.toastId, {
                    render: `${state.errorMsg} 🥺`,
                    type: "error",
                    ...toastConditions,
                });
                state.isLoading = false
            })



            .addCase(signOut.pending, (state, action) => {
                state.isLoading = true
                state.toastId = toast.loading("Signing Out...");
            })
            .addCase(signOut.fulfilled, (state, action) => {
                // console.log("action.payload", action.payload);
                handleSignOut(state)
                toast.update(state.toastId, {
                    render: "Signed Out 🙂",
                    type: "success",
                    ...toastConditions,
                });
                state.isLoading = false
                // state.isAccountSignedIn = false
            })
            .addCase(signOut.rejected, (state, action) => {
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



            // .addCase(forgotPassword.pending, (state, action) => {
            //     state.isLoading = true
            //     state.toastId = toast.loading("Sending request...");
            // })
            // .addCase(forgotPassword.fulfilled, (state, action) => {
            //     // console.log("action.payload", action.payload);

            //     toast.update(state.toastId, {
            //         render: "Request email sent 🙂",
            //         type: "success",
            //         ...toastConditions,
            //     });
            //     // state.isLoading = false
            //     setTimeout(() => {
            //         window.location.href = "/signin";
            //     }, 3000);
            // })
            // .addCase(forgotPassword.rejected, (state, action) => {
            //     // console.log("action.payload", action.payload);
            //     state.errorMsg = action.payload
            //     console.log("state.errorMsg", state.errorMsg);

            //     toast.update(state.toastId, {
            //         render: `${state.errorMsg} 🥺`,
            //         type: "error",
            //         ...toastConditions,
            //     });
            //     state.isLoading = false
            // })



            // .addCase(resetPassword.pending, (state, action) => {
            //     state.isLoading = true
            //     state.toastId = toast.loading("Resetting password...");
            // })
            // .addCase(resetPassword.fulfilled, (state, action) => {
            //     // console.log("action.payload", action.payload);

            //     toast.update(state.toastId, {
            //         render: "Password reset successfull. Redirecting to Sign In page... 🙂",
            //         type: "success",
            //         ...toastConditions,
            //     });
            //     state.isLoading = false

            //     setTimeout(() => {
            //         window.location.href = "/signin"; // or use useNavigate("/signin") if in component
            //     }, 3000); // 3 seconds delay
            // })
            // .addCase(resetPassword.rejected, (state, action) => {
            //     // console.log("action.payload", action.payload);
            //     state.errorMsg = action.payload
            //     console.log("state.errorMsg", state.errorMsg);

            //     if (state.errorMsg == "Invalid token" || state.errorMsg == "Expired token") {
            //         toast.update(state.toastId, {
            //             render: `${state.errorMsg}. Please request a new reset link using "Forgot Password". 🥺`,
            //             type: "error",
            //             ...toastConditions,
            //             autoClose: 4000
            //         });
            //         setTimeout(() => {
            //             window.location.href = "/signin"; // or use useNavigate("/signin") if in component
            //         }, 4000); // 3 seconds delay
            //         state.isLoading = false
            //         return;
            //     }
            //     toast.update(state.toastId, {
            //         render: `${state.errorMsg} 🥺`,
            //         type: "error",
            //         ...toastConditions,
            //     });

            //     state.isLoading = false
            // })



            .addCase(signInWithGoogle.pending, (state) => {
                state.isLoading = true
                state.toastId = toast.loading("Signing in with Google...")
            })
            .addCase(signInWithGoogle.fulfilled, (state, action) => {
                // console.log("action.payload", action.payload);
                const user = action.payload.user
                state.user.name = user.name
                state.user.mongo_id = user.mongo_id
                state.user.email = user.email
                state.user.picture = user.picture

                state.isAccountSignedIn = true
                storeUserDataLS(state)

                state.others = {}
                storeOthersDataLS(state.others)

                toast.update(state.toastId, {
                    render: "Signed in with Google 😊",
                    type: "success",
                    ...toastConditions,
                })

                let redirectUrl = ""
                if (action?.payload?.redirectToSetup) {
                    redirectUrl = "/setup"
                }
                else {
                    redirectUrl = "/"
                }

                setTimeout(() => {
                    window.location.href = redirectUrl;
                }, 2000);

                // state.isLoading = false
            })
            .addCase(signInWithGoogle.rejected, (state, action) => {

                // console.log("action.payload", action.payload);
                state.errorMsg = action.payload.message

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


export const { } = authSlice.actions

export default authSlice.reducer



