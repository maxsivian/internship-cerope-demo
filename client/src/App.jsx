import styles from "./App.module.css"
import { lazy, Suspense } from "react"
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"
import { ToastContainer } from "react-toastify"

import Navbar from "./components/layouts/navigation/Navbar"
import Footer from "./components/layouts/navigation/Footer"

import LoadingBarComponent from "./components/ui/LoadingBar"
import SyncDataAcrossTabs from "./components/utils/SyncDataAcrossTabs"

const SignUp = lazy(() => import("./components/pages/auth/SignUp"))
const SignIn = lazy(() => import("./components/pages/auth/SignIn"))
const Home = lazy(() => import("./components/pages/general/Home"))
const Profile = lazy(() => import("./components/pages/user/Profile"))
const Setup = lazy(() => import("./components/pages/user/Setup"))


const NotFound = lazy(() => import("./components/pages/general/NotFound"))


function Layout() {
  return (
    <>
      <Navbar />
      <div className={styles.body}>
        {/* <Suspense fallback={<div>Loading...</div>}> */}
          <Outlet />
        {/* </Suspense> */}
      </div>
      <Footer/>

      <LoadingBarComponent />
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        closeButton
      // transition={Bounce}
      />

      <SyncDataAcrossTabs/>
    </>
  )
}


// import SignUp from "./components/pages/auth/SignUp"

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: (
            <>
              <Home />
            </>
          )
        },
        {
          path: "/signup",
          element: (
            <SignUp />
          )
        },
        {
          path: "/signin",
          element: (
            <>
              <SignIn />
            </>
          )
        },
        {
          path: "/setup",
          element: (
            <>
              <Setup />
            </>
          )
        },
        {
          path: "/profile",
          element: (
            <>
              <Profile />
            </>
          )
        },
        {
          path: "*",
          element: (
            <>
              <NotFound />
            </>
          )
        }
      ]
    }
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App
