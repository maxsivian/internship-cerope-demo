import styles from "./Home.module.css"
import { Link } from "react-router-dom"
import ImageSelector from "../../layouts/form/ImageSelector"
import ExploreButton from "../../layouts/form/ExploreButton"

import { setRouteLoading } from "../../../redux/routeSlice"
import { useDispatch } from "react-redux"
import { useEffect } from "react"

const Home = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setRouteLoading(false))
  }, []);

  return (
    <div className={styles.container}>
      Home
      <div className={styles.lists}>
        <ExploreButton/>
        <Link to="/signup">/signup</Link>
        <Link to="/signup">/signin</Link>
        <Link to="/setup">/setup</Link>
        <Link to="/profile">/profile</Link>
        {/* <ImageSelector/> */}
      </div>

    </div>
  )
}

export default Home