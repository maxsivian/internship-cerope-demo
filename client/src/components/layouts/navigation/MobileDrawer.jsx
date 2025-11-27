import styles from "./MobileDrawer.module.css"
import MENU_ICON from "../../../assets/svg/menu.svg"
import CLOSE_ICON from "../../../assets/svg/close.svg"
import DOWN_ICON from "../../../assets/svg/down.svg"

import { useState } from "react"
import { useRef } from "react"
import { useEffect } from "react"

import { useLocation } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setRouteLoading } from "../../../redux/routeSlice"
import { NavLink } from "react-router-dom"


const MobileDrawer = () => {

    const dispatch = useDispatch()
    const location = useLocation()

    const [show, setShow] = useState(false)
    const [anim, setAnim] = useState(false)
    const drawerRef = useRef(null)

    useEffect(() => {
        if (show) {
            drawerRef.current?.focus()
        }
    }, [show])

    const handleMenuClick = () => {
        // setShow(v => !v)
        if (show) {
            setAnim(false)
            setTimeout(() => {
                setShow(false)
            }, 300);
        }
        else {
            setShow(true)
            setTimeout(() => {
                setAnim(true)
            }, 10);
        }
    }


    const handleClick = (targetPath) => {
        // console.log("location", location);
        // console.log("location.pathname", location.pathname);
        // console.log('targetPath', targetPath);
        if (location.pathname != targetPath) {
            dispatch(setRouteLoading(true))
        }

        // handleMenuClick()
    }

    const handleOverlayClick = (e) => {
        // console.log("e.currentTarget", e.currentTarget);
        // console.log("e.target", e.target); 

        if (e.target.closest(`.${styles.knowMyVibeButton}`) || e.target.classList.contains(styles.drawer)) {
            return;
        } 
        handleMenuClick()
    }

    // const handleBlur = (e) => {
    //     console.log("Blur...");
    //     handleMenuClick()
    // }

    return (
        <div className={styles.container}>
            <button className={styles.menuButton} onClick={handleMenuClick}>
                <img src={MENU_ICON} alt="menu" className={styles.menuIcon} />
            </button>

            {
                show && (
                    <div className={styles.overlay} onClick={handleOverlayClick}>
                        <div className={`${styles.drawer} ${anim ? styles.anim : ""}`}
                            onMouseDown={(e) => e.stopPropagation()}>
                            <button className={styles.closeButton}
                            // onClick={handleMenuClick}
                            >
                                <img src={CLOSE_ICON} alt="menu" className={styles.closeIcon} />
                            </button>

                            <ul>
                                <li>
                                    <NavLink to="/" className={e => e.isActive ? styles.active : ""} onClick={() => handleClick("/")}>Home</NavLink>
                                </li>
                                <li>
                                    <button className={styles.knowMyVibeButton}>
                                        Know my Vibe
                                        <img src={DOWN_ICON} alt="" />
                                    </button>
                                </li>
                                <li>
                                    <NavLink to="/plan-outfit" className={e => e.isActive ? styles.active : ""} onClick={() => handleClick("/plan-outfit")}>Plan Outfit</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/my-wardrobe" className={e => e.isActive ? styles.active : ""} onClick={() => handleClick("/my-wardrobe")}>My Wardrobe</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/ask-ai-pal" className={e => e.isActive ? styles.active : ""} onClick={() => handleClick("/ask-ai-pal")}>Ask AI Pal</NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default MobileDrawer