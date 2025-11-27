import { useEffect } from "react"
import { useDispatch } from "react-redux"

const refresh_keys = ["isAccountSignedIn", "user"]

const SyncDataAcrossTabs = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const sync = (e) => {
            if (refresh_keys.includes(e.key)) {
                window.location.reload()
            }
        }

        window.addEventListener("storage", sync)

        return () => {
            window.removeEventListener("storage", sync)
        }

    }, [dispatch])

}

export default SyncDataAcrossTabs