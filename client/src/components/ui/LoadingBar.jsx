import LoadingBar from "react-top-loading-bar";
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useRef } from "react";

const LoadingBarComponent = () => {

    const ref = useRef(null);
    const isRouteLoading = useSelector((state) => state.route.isRouteLoading)

    useEffect(() => {
        if (isRouteLoading) {
            ref.current.continuousStart()
        }
        else {
            ref.current.complete()
        }
    }, [isRouteLoading])
    
    return (
        <div>
            {/* <LoadingBar color={"var(--color3)"} ref={ref} /> */}
            <LoadingBar color="purple" ref={ref} height={5}/>
        </div>
    )
} 

export default LoadingBarComponent