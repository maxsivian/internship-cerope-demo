import { useState } from "react"
import styles from "./ProfileButton.module.css"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { signOut } from "../../../redux/authSlice"



const ProfileButton = () => {
    const [showDropdown, setShowDropdown] = useState(false)
    const isAccountSignedIn = useSelector((state) => state.auth.isAccountSignedIn)
    const picture = useSelector((state) => state.auth.user.picture)



    const handleClick = () => {
        console.log("Click..");
        setShowDropdown(v => !v)
    }

    const handleBlur = () => {
        // console.log("blur...");
        setTimeout(() => {
            setShowDropdown(false)
        }, 100);
    }

    return (
        <div className={styles.container} onClick={handleClick} onBlur={handleBlur} tabIndex={-1}>
            <div className={styles.imageContainer}>
                <img src={picture ? picture : "/characters/c0.jpg"}
                    alt="avatar"
                    className={styles.image}
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                />
            </div>

            {
                showDropdown && isAccountSignedIn && (
                    <SignedDropdown />
                )
            }
            {
                showDropdown && !isAccountSignedIn && (
                    <UnsignedDropdown />
                )
            }
        </div>
    )
}

export default ProfileButton




const UnsignedDropdown = () => {

    return (
        <div className={styles.dropdownContainer}>
            <ul>
                <li>
                    <Link to={"/signin"}>Sign In</Link>
                </li>
                <li>
                    <Link to={"/signup"}>Sign Up</Link>
                </li>
            </ul>
        </div>
    )
}


const SignedDropdown = () => {
    const dispatch = useDispatch()

    const handleSignOut = () => {
        dispatch(signOut())
    }
    return (
        <div className={styles.dropdownContainer}>
            <ul>
                <li>
                    <Link to={"/profile"}>Profile</Link>
                </li>
                <li>
                    <button onClick={handleSignOut}>Sign Out</button>
                </li>
            </ul>
        </div>
    )
}




