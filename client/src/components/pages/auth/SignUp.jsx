import styles from "./Auth.module.css"
import { useRef } from "react"
import { useState } from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { setRouteLoading } from "../../../redux/routeSlice"
import { useDispatch } from "react-redux"
import PasswordConditions from "../../layouts/auth/PasswordConditions"
import { validateName, validateEmail, validatePassword } from "../../../../scripts/validateForm"
import { debounce } from "../../../../scripts/debounce"
import { checkEmail } from "../../../redux/authSlice"

import BACKGROUND_IMAGE from "../../../assets/images/signup1.jpg"
import FOREGROUND_IMAGE from "../../../assets/images/signup2.jpg"
import PASSWORD_HIDE from "../../../assets/svg/password-hide.svg"
import PASSWORD_SHOW from "../../../assets/svg/password-show.svg"

import { preSignUp } from "../../../redux/authSlice"
import { useSelector } from "react-redux"

import { toast } from "react-toastify"

const SignUp = () => {
    const dispatch = useDispatch()

    const firstRun = useRef(true)
    const navigate = useNavigate()
    const [form, setForm] = useState({ name: "", email: "", password: "", confirm_password: "" })
    const [formInfo, setFormInfo] = useState({ name: true, email: true, password: true, confirm_password: true })

    const [isPasswordFocused, setisPasswordFocused] = useState(false)
    const [passwordVisibility, setPasswordVisibility] = useState(false)
    const [confirm_passwordVisibility, setConfirm_passwordVisibility] = useState(false)

    const [isAgreed, setIsAgreed] = useState(null)

    const isLoading = useSelector((state) => state.auth.isLoading)
    const [isEmailLoading, setIsEmailLoading] = useState(false)
    const isAccountSignedIn = useSelector((state) => state.auth.isAccountSignedIn)

    // useEffect(() => {
    //     if (isAccountSignedIn) {
    //         navigate("/")
    //     }
    // }, [isAccountSignedIn])


    // useEffect(() => {
    //     console.log("formInfo", formInfo);
    // }, [formInfo])

    // useEffect(() => {
    //     // console.log("form", form);
    //     console.log("isAgreed", isAgreed);
    // }, [form, isAgreed])

    useEffect(() => {
        if (!firstRun.current) debounceEmail(form.email);
    }, [form.email]);

    useEffect(() => {
        if (!firstRun.current) debounceName(form.name);
    }, [form.name]);

    useEffect(() => {
        if(form.confirm_password){
            debounceConfirm(form.password, form.confirm_password);
        }
    }, [form.confirm_password, form.password]);


    useEffect(() => {
        dispatch(setRouteLoading(false))
        setTimeout(() => {
            firstRun.current = false;
        }, 0);
    }, []);


    const debounceEmail = useRef(
        debounce((email) => {
            const v = validateEmail(email);
            setFormInfo(p => ({ ...p, email: v }));
            if (v.status) checkEmailLocal({ email });
        }, 800)
    ).current;

    const debounceName = useRef(
        debounce((name) => {
            setFormInfo(p => ({ ...p, name: validateName(name) }));
        }, 800)
    ).current;

    const debounceConfirm = useRef(
        debounce((password, confirm) => {
            setFormInfo(p => ({
                ...p,
                confirm_password:
                    confirm === password
                        ? { status: true }
                        : { status: false, message: "Passwords do not match." }
            }));
        }, 800)
    ).current;



    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("form", form);


        // let isNameValid = validateName(form.name)
        // if (!isNameValid.status) {
        //     console.warn(isNameValid.message);
        //     return
        // }

        let isEmailValid = validateEmail(form.email)
        if (!isEmailValid.status) {
            // console.log(isEmailValid.message);
            toast.warn(isEmailValid.message)
            return
        }

        let isPasswordValid = validatePassword(form.password)
        if (!isPasswordValid.status) {
            // console.log(isPasswordValid.message);
            toast.warn(isPasswordValid.message)
            return
        }

        if (form.password !== form.confirm_password) {
            // console.log("Passwords don't match");
            toast.warn("Passwords don't match")
            return
        }

        if (!isAgreed) {
            // console.log("Please tick the checkbox to agree to the terms.");
            toast.warn("Please tick the checkbox to agree to the terms.")
            setIsAgreed(false)
            return
        }

        dispatch(preSignUp({ form: form }))
        console.log("Submited");
    }

    const handleSignInClick = (e) => {
        e.preventDefault()
        navigate("/signin")
    }



    const checkEmailLocal = async ({ email }) => {
        try {
            setIsEmailLoading(true)
            let response = await dispatch(checkEmail({ email })).unwrap()
            console.log("response", response);
            // if (response?.status == 200) {
            //     console.log("response.status", response.status);
            // }
            setFormInfo(p => ({
                ...p, email: { status: "special", message: response.message }
            }))
        } catch (error) {
            console.log("checkEmailLocal (error): ", error);

            if (error?.status == 409) {
                // console.log("error.status", error.status);
                // console.log("error.message", error.message);
                setFormInfo(p => ({
                    ...p, email: { status: "special", message: error.message }
                }))
            }

        } finally {
            setIsEmailLoading(false)
        }

    }

    // if (isAccountSignedIn) return

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
                            <h1>Set up Your Cerope Account</h1>
                            <div className={styles.formInfo}>
                                {isAgreed ? "" : isAgreed == null ? "" : "Please tick the checkbox to agree to the terms."}
                            </div>
                        </div>

                        {/* <div className={styles.formItemC}>
                            <input type="text" name="name" aria-label="name" placeholder="Name" value={form.name} onChange={handleFormChange} />
                            <div className={styles.formInfo}>
                                {formInfo.name.status ? "" : formInfo.name.message}
                            </div>
                        </div> */}

                        <div className={styles.formItemC}>
                            <input type="text" name="email" aria-label="email" placeholder="Email" value={form.email} onChange={handleFormChange} />
                            <div className={styles.formInfo}>
                                {
                                    isEmailLoading && (
                                        <div className={styles.loading}>
                                            Checking...
                                        </div>
                                    )
                                }
                                {
                                    !isEmailLoading && formInfo.email.status == "special" && (
                                        <>
                                            {
                                                formInfo.email.message == "Email is available." && (
                                                    <div className={styles.green}>
                                                        {formInfo.email.message}
                                                    </div>
                                                )
                                            }
                                            {
                                                formInfo.email.message == "Email already exists. Try signing in." && (
                                                    <div className={styles.formInfoSignIn}>
                                                        <span>
                                                            Looks like you already have an account.
                                                        </span>
                                                        <button onClick={handleSignInClick}>
                                                            Sign In
                                                        </button>
                                                    </div>
                                                )
                                            }

                                        </>
                                    )
                                }
                                {
                                    !isEmailLoading && !formInfo.email.status && (
                                        formInfo.email.message
                                    )
                                }
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
                                    onFocus={() => setisPasswordFocused(true)}
                                    onBlur={() => setisPasswordFocused(false)}
                                />
                                <img src={passwordVisibility ? PASSWORD_HIDE : PASSWORD_SHOW} alt="passwrod-show" className={styles.password}
                                    onClick={() => setPasswordVisibility(v => !v)}
                                />
                                <div className={styles.formInfo}>
                                    {/* Invalid Name! Please Do Not Enter Numerals. */}
                                    {formInfo.password.status ? "" : formInfo.password.message}
                                </div>
                                <div className={styles.passwordConditons}>
                                    {
                                        isPasswordFocused && (
                                            <PasswordConditions password={form.password} />
                                        )
                                    }
                                </div>
                            </div>
                        </div>

                        <div className={styles.formItemC}>
                            <div className={styles.formItem}>
                                <input type={confirm_passwordVisibility ? "text" : "password"} name="confirm_password" aria-label="confirm_password" placeholder="Confirm Password" value={form.confirm_password} onChange={handleFormChange} />
                                <img src={confirm_passwordVisibility ? PASSWORD_HIDE : PASSWORD_SHOW} alt="passwrod-show" className={styles.password}
                                    onClick={() => setConfirm_passwordVisibility(v => !v)}
                                />
                            </div>
                            <div className={styles.formInfo}>
                                {/* Invalid Name! Please Do Not Enter Numerals. */}
                                {formInfo.confirm_password.status ? "" : formInfo.confirm_password.message}
                            </div>
                        </div>

                        <div className={styles.formItemCheckboxC}>
                            <div className={styles.checkboxC}>
                                <input type="checkbox" name="" id="agree" className={styles.checkbox}
                                    onChange={(e) => e.target.checked ? setIsAgreed(true) : setIsAgreed(false)}
                                />
                            </div>
                            {/* <label htmlFor="agree">I agree</label> */}
                            <label htmlFor="agree">I agree to Cerope's Terms of Service & Privacy Policy</label>
                        </div>

                        <button className={styles.signUpButton}>
                            Sign Up
                        </button>

                        <div className={styles.signIn}>
                            <div>Already a member?</div>
                            <button onClick={handleSignInClick}>Sign In</button>
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

export default SignUp