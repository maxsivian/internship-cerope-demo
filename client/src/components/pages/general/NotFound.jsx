import styles from "./NotFound.module.css"
import { useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { setRouteLoading } from "../../../redux/routeSlice"
import { useDispatch } from "react-redux"
import { useEffect } from "react"

import LOGO from "../../../assets/cerope-symbol.svg"

const NotFound = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        dispatch(setRouteLoading(false))
    }, [location]);

    // useEffect(() => {
    //   console.log("location", location);
    // }, [location])
    
    const handleClick = () => {
        navigate("/")
    }

    const handlePreviousClick = ()=>{
        navigate(-1)
    }
 
    return (
        <div className={styles.container}>
            <div className={styles.imageC}>
                <img src={LOGO} alt="logo" className={styles.image} />
            </div>
            <div>
                404: Page Not Found
            </div>
            <div>
                {location.pathname}
            </div>
            <button onClick={handleClick} className={styles.homeButton}>
                Go to Homepage
            </button>
            <button onClick={handlePreviousClick} className={styles.previousButton}>
                Go to Previous Page
            </button>
        </div>
    )
}

export default NotFound


// Oops! The page you're looking for doesn't exist.

// It might have been moved or deleted. Please check the URL or return to one of the following options: