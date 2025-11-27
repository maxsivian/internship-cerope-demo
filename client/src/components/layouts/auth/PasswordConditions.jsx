import styles from "./PasswordConditions.module.css"
import RIGHT_ICON from "../../../assets/svg/right.svg"
import WRONG_ICON from "../../../assets/svg/wrong.svg"
import { validatePassword } from "../../../../scripts/validateForm"
import { useEffect, useState } from "react"

const PasswordConditions = ({ password = "" }) => {

    const [conditions, setConditions] = useState({ minCharLimit: false, includesUpperCase: false, includesLowerCase: false, includesNumber: false, notContainsForbidden: false })

    useEffect(() => {
        // console.log("conditions", conditions);
        setConditions(validatePassword(password))
    }, [password])


    return (
        <div className={styles.container}>
            {/* <div>Password must contain</div> */}

            <div className={styles.conditions}>
                <div className={styles.iconC}>
                    <img src={conditions.minCharLimit ? RIGHT_ICON : WRONG_ICON} alt="" className={styles.icon} />
                </div>
                <div>
                    Minimum 8 characters long
                </div>
            </div>

            <div className={styles.conditions}>
                <div className={styles.iconC}>
                    <img src={conditions.includesUpperCase ? RIGHT_ICON : WRONG_ICON} alt="" className={styles.icon} />
                </div>
                <div>
                    An upper case letter
                </div>
            </div>

            <div className={styles.conditions}>
                <div className={styles.iconC}>
                    <img src={conditions.includesLowerCase ? RIGHT_ICON : WRONG_ICON} alt="" className={styles.icon} />
                </div>
                <div>
                    A lower case letter
                </div>
            </div>

            <div className={styles.conditions}>
                <div className={styles.iconC}>
                    <img src={conditions.includesNumber ? RIGHT_ICON : WRONG_ICON} alt="" className={styles.icon} />
                </div>
                <div>
                    A number
                </div>
            </div>

            <div className={styles.conditions}>
                <div className={styles.iconC}>
                    <img src={conditions.notContainsForbidden ? RIGHT_ICON : WRONG_ICON} alt="" className={styles.icon} />
                </div>
                <div>
                    Not these special characters (@, # *)
                </div>
            </div>
        </div>
    )
}

export default PasswordConditions