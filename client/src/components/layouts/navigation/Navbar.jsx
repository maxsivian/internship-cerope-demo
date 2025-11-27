import styles from "./Navbar.module.css"
import LOGO from "../../../assets/cerope-symbol.svg"
import DOWN_ICON from "../../../assets/svg/down.svg"
import SEARCH_ICON from "../../../assets/svg/search.svg"

import { NavLink } from "react-router-dom"
import ProfileButton from "./ProfileButton"

import { useLocation } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setRouteLoading } from "../../../redux/routeSlice"

import MobileDrawer from "./MobileDrawer"



const Navbar = () => {

  const dispatch = useDispatch()
  const location = useLocation()

  const handleClick = (targetPath) => {
    // console.log("location", location);
    // console.log("location.pathname", location.pathname);
    // console.log('targetPath', targetPath);
    if (location.pathname != targetPath) {
      dispatch(setRouteLoading(true))
    }
  }

  return (
    <header className={styles.header}>
      <nav className={styles.container}>
        <div className={styles.left}>
          <MobileDrawer />
          <NavLink to={"/"} className={styles.logoC} onClick={() => handleClick("/")}>
            <div className={styles.logoImageC}>
              <img src={LOGO} alt="logo" className={styles.logoImage} />
            </div>
            <div>
              Cerope
            </div>
          </NavLink>
        </div>
        <div className={styles.right}>
          <ul>
            <li>
              <button className={styles.searchButton}>
                <img src={SEARCH_ICON} alt="" className={styles.searchIcon} />
              </button>
            </li>
            <li>
              <NavLink to="/" className={e => e.isActive ? styles.active : ""} onClick={() => handleClick("/")}>Home</NavLink>
            </li>
            <li>
              <button className={styles.knowMyVibeButton}>
                Know my Vibe
                <img src={DOWN_ICON} alt="" />
              </button>
              {/* <NavLink to="/know-my-vibe" className={e => e.isActive ? styles.active : ""}>Know My Vibe</NavLink> */}
            </li>
            <li>
              <NavLink to="/my-wardrobe" className={e => e.isActive ? styles.active : ""} onClick={() => handleClick("/my-wardrobe")}>My Wardrobe</NavLink>
            </li>
            <li>
              <NavLink to="/ask-ai-pal" className={e => e.isActive ? styles.active : ""} onClick={() => handleClick("/ask-ai-pal")}>Ask AI Pal</NavLink>
            </li>
            <li>
              <NavLink to="/plan-outfit" className={e => e.isActive ? styles.active : ""} onClick={() => handleClick("/plan-outfit")}>Plan Outfit</NavLink>
            </li>
            <li>
              <ProfileButton />
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}

export default Navbar