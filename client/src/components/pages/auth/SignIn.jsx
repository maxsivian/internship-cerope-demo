import styles from "./Auth.module.css"
import { useRef } from "react"
import { useState } from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { setRouteLoading } from "../../../redux/routeSlice"
import { useDispatch } from "react-redux"
import { validateEmail } from "../../../../scripts/validateForm"

import BACKGROUND_IMAGE from "../../../assets/images/signup1.jpg"
import FOREGROUND_IMAGE from "../../../assets/images/signup2.jpg"
import PASSWORD_HIDE from "../../../assets/svg/password-hide.svg"
import PASSWORD_SHOW from "../../../assets/svg/password-show.svg"

import { signIn } from "../../../redux/authSlice"
import { GoogleLogin } from "@react-oauth/google"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import { toastConditions } from "../../../../scripts/toastConditions"
import { debounce } from "../../../../scripts/debounce"
import { signInWithGoogle } from "../../../redux/authSlice"

const SignIn = () => {
    const dispatch = useDispatch()

    const firstRun = useRef(true)
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: "", password: "" })
    const [formInfo, setFormInfo] = useState({ email: true })

    const [passwordVisibility, setPasswordVisibility] = useState(false)
    const isLoading = useSelector((state) => state.auth.isLoading)
    const isAccountSignedIn = useSelector((state) => state.auth.isAccountSignedIn)


    // useEffect(() => {
    //     if (isAccountSignedIn) {
    //         navigate("/")
    //     }
    // }, [isAccountSignedIn])

    // useEffect(() => {
    //     if (firstRun.current) return;
    //     let emailValidity = validateEmail(form.email)
    //     setFormInfo(p => ({
    //         ...p, email: emailValidity
    //     }))
    // }, [form.email]);

    useEffect(() => {
        if (!firstRun.current) debounceEmail(form.email);
    }, [form.email]);

    const debounceEmail = useRef(
        debounce((email) => {
            const v = validateEmail(email);
            setFormInfo(p => ({ ...p, email: v }));
        }, 800)
    ).current;



    // useEffect(() => {
    //     if (firstRun.current) return;
    //     setFormInfo(p => ({
    //         ...p, password: validatePassword(form.password)
    //     }))
    // }, [form.password]);


    useEffect(() => {
        dispatch(setRouteLoading(false))
        setTimeout(() => {
            firstRun.current = false;
        }, 0);

    }, []);

    // useEffect(() => {
    //     console.log("formInfo", formInfo);
    // }, [formInfo])


    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("form", form);

        let isEmailValid = validateEmail(form.email)
        if (!isEmailValid.status) {
            console.warn(isEmailValid.message);
            return
        }

        dispatch(signIn({ form: form }))
    }

    const handleSignUpClick = (e) => {
        e.preventDefault()
        navigate("/signup")
    }


    const handleGoogleSuccess = (credentialResponse) => {
        const idToken = credentialResponse.credential;
        dispatch(signInWithGoogle(idToken));
    };

    const handleGoogleError = () => {
        toast.error("Google Sign-In failed.", toastConditions);
    };

    const handleForgotClick = () => {

    }

    // if(isAccountSignedIn) return

    return (
        <div className={styles.superContainer}>
            {
                isLoading && (
                    <div className={styles.overlay}>
                    </div>
                )
            }
            <div className={styles.container}>
                <main className={styles.main}>
                    <img src={BACKGROUND_IMAGE} alt="" className={styles.mainBg} />
                    <form className={styles.form} onSubmit={handleSubmit}>

                        <div className={styles.heading}>
                            <h1>Welcome Back to Cerope</h1>
                            <h2>Your personalized fashion journey awaits</h2>
                        </div>


                        <div className={styles.formItemC}>
                            <input type="text" name="email" aria-label="email" placeholder="Email" value={form.email} onChange={handleFormChange} />
                            <div className={styles.formInfo}>
                                {formInfo.email.status ? "" : formInfo.email.message}
                            </div>
                        </div>

                        <div className={styles.formItemC}>
                            <div className={styles.formItem}>
                                <input type={passwordVisibility ? "text" : "password"}
                                    name="password"
                                    aria-label="password"
                                    placeholder="Password"
                                    className={styles.passwordForm}

                                    value={form.password}
                                    onChange={handleFormChange}
                                />
                                <img src={passwordVisibility ? PASSWORD_HIDE : PASSWORD_SHOW} alt="password-show" className={styles.password}
                                    onClick={() => setPasswordVisibility(v => !v)}
                                />
                            </div>
                        </div>

                        <button className={styles.forgotButton} onClick={handleForgotClick}>
                            Forgot Password?
                        </button>


                        <button className={styles.signUpButton}>
                            Sign In
                        </button>

                        <div className={styles.lineC}>
                            <div className={styles.line}></div>
                            <div>or</div>
                            <div className={styles.line}></div>
                        </div>

                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            // useOneTap // optional
                            size="large"
                            theme="filled_black"
                        />

                        <div className={styles.signIn}>
                            <div>Don't have an account?</div>
                            <button onClick={handleSignUpClick}>Sign Up</button>
                        </div>

                    </form>
                </main>
                <section className={styles.section}>
                    <div className={styles.foregroundImageC}>
                        <img className={styles.foregroundImage} src={FOREGROUND_IMAGE} alt="FOREGROUND_IMAGE" />
                    </div>
                </section>
            </div>
        </div>
    )
}

export default SignIn