import styles from "./Profile.module.css"
import { useRef, useState } from "react"
import { useEffect } from "react"
import CountrySelector from "../../layouts/form/CountrySelector"
import ImageSelector from "../../layouts/form/ImageSelector"
import { useDispatch } from "react-redux"
import { getAccountDetails } from "../../../redux/accountSlice"
import { useSelector } from "react-redux"
import { updateAccountDetails } from "../../../redux/accountSlice"
import { toast } from "react-toastify"
import { getChangedFields } from "../../../../scripts/getChangedFields"
import { useNavigate } from "react-router-dom"
import LoadingCircles from "../../ui/LoadingCircles"
import FOREGROUND_IMAGE from "../../../assets/images/setup1.jpg"

import EDIT_SVG from "../../../assets/svg/edit.svg"


const Profile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLoading = useSelector((state) => state.account.isLoading)
  const isAccountSignedIn = useSelector((state) => state.auth.isAccountSignedIn)

  const [original_form, setOrginal_form] = useState({})
  const [form, setForm] = useState({ firstName: "", lastName: "", dob: "", gender: "", contactNo: "", city: "", country: "" })

  const [avatar, setAvatar] = useState({ picture: "", google_picture: "", current: "" })

  const [country, setCountry] = useState("")
  const [initialCountryValue, setInitialCountryValue] = useState("")

  const containerEditRef = useRef(null)
  const [enableEdit, setEnableEdit] = useState(false)

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }


  const getAccountDetails_local = async () => {
    let response = await dispatch(getAccountDetails()).unwrap()
    // console.log("response", response);
    if (response.account) {
      const acc = { ...response.account };

      if (acc.dob) {
        // console.log("acc.dob", acc.dob);
        acc.dob = new Date(acc.dob).toISOString().slice(0, 10); // fix
        // console.log("acc.dob", acc.dob);
      }

      setForm({ ...form, ...acc });
      setOrginal_form(acc);

      if (acc.country) {
        setInitialCountryValue(acc.country)
      }
    }
    else {
      console.log("Response broken");
    }
  }

  useEffect(() => {
    getAccountDetails_local()
  }, [])


  useEffect(() => {
    setAvatar(prev => ({
      ...prev,
      picture: form.picture || prev.picture,
      google_picture: form.google_picture || prev.google_picture
    }));
  }, [form.picture, form.google_picture])


  useEffect(() => {
    // console.log("parent country", country);
    if (country?.value !== undefined) {
      setForm(f => ({ ...f, country: country.value }));
    }
  }, [country])

  const handleEditClick = () => {
    if(enableEdit){
      setEnableEdit(false) 
      containerEditRef.current.style.pointerEvents = "none"
    }
    else{
      setEnableEdit(true)
      containerEditRef.current.style.pointerEvents = "auto"
    }
  }

  const handleSubmit = (e) => {
    try {
      e.preventDefault()

      if (!isAccountSignedIn) {
        navigate("/")
        return
      }

      // console.log("Submitting...");
      // console.log("form", form);
      // console.log("country", country.value);
      // console.log("picture", avatar.current);

      let checks = !!(form.firstName.trim() && form.dob.trim() && form.gender.trim() && form.country.trim())

      if (!checks) {
        console.log("Please fill the inputs marked with *");
        toast.warn("Please fill the inputs marked with *")
        return
      }

      // dispatch(updateAccountDetails({ form: { ...form, picture: avatar.current, country: country } }))


      // include avatar + country conversions before diff
      let finalForm = {
        ...form,
        picture: avatar.current || form.picture,
        country: country?.value || form.country
      };

      const changedFields = getChangedFields(original_form, finalForm);

      if (Object.keys(changedFields).length === 0) {
        console.log("No changes to update");
        // toast.info("No changes to update");
        // navigate("/")
        return;
      }

      dispatch(updateAccountDetails({ form: changedFields }));
    } catch (error) {
      console.log("handleSubmit (error)", error);
    }
  }


  return (
    <>
      {
        isLoading && (
          <LoadingCircles />
        )
      }
      {
        !isLoading && (
          <div className={styles.containerWrapper2}>
            <h1>Profile</h1>
            <div className={styles.containerWrapper}>
              <div className={styles.formHeading}>
                <h2>Personal Details</h2>
                <button className={styles.editButton} onClick={handleEditClick}>
                  <img src={EDIT_SVG} alt="edit" />
                  {
                    enableEdit ? "Cancel":"Edit"
                  }

                </button>
              </div>
              <form className={styles.container} onSubmit={handleSubmit} ref={containerEditRef}>
                {/* <h1>Set up your account</h1> */}
                <div className={styles.formC}>
                  <div className={styles.formItemC}>
                    <label htmlFor="firstName">First Name *</label>
                    <input type="text" name="firstName" id="firstName" className={styles.inputText}
                      placeholder="Enter first name" value={form.firstName} onChange={handleFormChange}
                    />
                  </div>
                  <div className={styles.formItemC}>
                    <label htmlFor="lastName">Last Name</label>
                    <input type="text" name="lastName" id="lastName" className={styles.inputText}
                      placeholder="Enter last name" value={form.lastName} onChange={handleFormChange}
                    />
                  </div>
                  <div className={styles.formItemC}>
                    <label htmlFor="dob">Date of Birth *</label>
                    <input type="date" name="dob" id="dob" className={styles.inputText}
                      value={form.dob}
                      // value="2025-11-28T00:00:00.000+00:00"
                      onChange={handleFormChange} />
                  </div>
                  <div className={styles.formItemC}>
                    <label htmlFor="contactNo">Gender *</label>
                    <div className={styles.genderRadiosC}>
                      <div className={styles.genderRadio}>
                        <input
                          type="radio"
                          name="gender"
                          id="men"
                          value="men"
                          checked={form.gender === "men"}
                          onChange={handleFormChange}
                        />
                        <label htmlFor="men">Men</label>
                      </div>
                      <div className={styles.genderRadio}>
                        <input
                          type="radio"
                          name="gender"
                          id="women"
                          value="women"
                          checked={form.gender === "women"}
                          onChange={handleFormChange}
                        />
                        <label htmlFor="women">Women</label>
                      </div>
                      <div className={styles.genderRadio}>
                        <input
                          type="radio"
                          name="gender"
                          id="other"
                          value="other"
                          checked={form.gender === "other"}
                          onChange={handleFormChange}
                        />
                        <label htmlFor="both">Both</label>
                      </div>
                    </div>
                  </div>
                  <div className={styles.formItemC}>
                    <label htmlFor="contactNo">Phone Number</label>
                    <input type="tel" name="contactNo" id="contactNo" className={styles.inputText}
                      placeholder="Enter phone number" value={form.contactNo} onChange={handleFormChange}
                    />
                  </div>
                  <div className={styles.formItemC}>
                    <div className={styles.label}>Country *</div>
                    <CountrySelector initialCountryValue={initialCountryValue} country={country} setCountry={setCountry} />
                  </div>
                  <div className={styles.formItemC}>
                    <label htmlFor="city">City</label>
                    <input type="text" name="city" id="city" className={styles.inputText}
                      placeholder="Enter city" value={form.city} onChange={handleFormChange}
                    />
                  </div>
                </div>
                <div className={styles.imageSelectorC}>
                  <ImageSelector avatar={avatar} setAvatar={setAvatar} />
                </div>
              </form>
              {
                enableEdit && (
                  <button className={styles.continueButton} onClick={handleSubmit}>
                    Save
                  </button>
                )
              }
            </div>
          </div>
        )
      }
    </>

  )
}

export default Profile