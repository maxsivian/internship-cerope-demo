import styles from "./Footer.module.css"
import { Link } from "react-router-dom"
import LOGO from "../../../assets/cerope-symbol.svg"

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.main}>
                <div className={styles.first}>
                    <div className={styles.ftop}>
                        <img src={LOGO} alt="logo" className={styles.logo} />
                        Cerope
                    </div>
                    <div className={styles.fbottom}>
                        Revolutionizing fashion with AI-powered styling solutions.
                    </div>
                </div>
                <div className={styles.second}>
                    <h3>Quick Links</h3>
                    <Link to={"/home"}>Home</Link>
                    <Link to={"/contatc-us"}>Contact Us</Link>
                    <Link to={"/about-us"}>About</Link>
                    <Link to={"/features"}>Features</Link>
                    <Link to={"/faqs"}>FAQ's</Link>
                </div>
                <div className={styles.third}>
                    <h3>Products</h3>
                    <Link to={"/user-styling"}>User Styling</Link>
                    <Link to={"/price-comparison"}>Price Comparison</Link>
                    <Link to={"/creator-space"}>Creator Space</Link>
                </div>
                <div className={styles.fourth}>
                    <h3>Policies</h3>
                    <Link to={"/privacy-policy"}>Privacy Policy</Link>
                    <Link to={"/copyright-policy"}>Copyright Policy</Link>
                    <Link to={"/cookie-policy"}>Cookie Policy</Link>
                    <Link to={"/terms-and-conditions"}>Terms and Conditions</Link>
                </div>
            </div>
            <div className={styles.divider}>

            </div>
            <div className={styles.bottom}>
                &copy; Cerope. All rights reserved.
            </div>
        </footer>
    )
}

export default Footer