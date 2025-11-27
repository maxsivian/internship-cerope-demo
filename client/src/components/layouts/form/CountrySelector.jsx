import styles from "./CountrySelector.module.css"
import countries from "world-countries";
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import { useCallback } from 'react';
import CLOSE_ICON from "../../../assets/svg/close.svg"


const countryOptions = countries.map((country) => ({
    value: country.cca2,
    label: country.name.common,
    flag: `https://flagcdn.com/w40/${country.cca2.toLowerCase()}.png`, // Flag URL
}));


function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value)

    // console.log('r1');
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}


const CountrySelector = ({ initialCountryValue, country, setCountry }) => {

    const [array, setArray] = useState(countryOptions)
    const [filteredArray, setFilteredArray] = useState(countryOptions)
    const [input, setInput] = useState("")
    const [isInputFocused, setIsInputFocused] = useState(false)
    const [hasUserModifiedInput, setHasUserModifiedInput] = useState(true)
    const [activeIndex, setActiveIndex] = useState(-1) // index for keyboard navigation

    const dropdownRef = useRef(null)
    const optionRefs = useRef([]);

    const debouncedInput = useDebounce(input, 500)

    // console.log('r2');
    useEffect(() => {
        // console.log("initialCountryValue", initialCountryValue);
        if (initialCountryValue) {
            const selected = array.find((item) => item.value === initialCountryValue)
            if (selected) {
                setCountry(selected)
                // setInput("")
                // setIsInputFocused(false)
                // setHasUserModifiedInput(false)
            }
        }
    }, [initialCountryValue])


    useEffect(() => {
        let newArray = array.filter((v) => v.label.toLowerCase().startsWith(debouncedInput.toLowerCase().trim()))
        // console.log(input.toLowerCase()); 
        // console.log(input.length);
        setActiveIndex(0) // reset active index on input change
        setFilteredArray(newArray)
    }, [debouncedInput])

    useEffect(() => {
        if (optionRefs.current[activeIndex]) {
            optionRefs.current[activeIndex].scrollIntoView({
                block: 'nearest',
                behavior: 'auto' // change to 'smooth' if you want
            });
        }
    }, [activeIndex]);


    // useEffect(() => {
    //     console.log(isInputFocused);
    // }, [isInputFocused])


    const handleChange = useCallback((e) => {
        // console.log('changed');
        setInput(e.target.value)
        setHasUserModifiedInput(true)

        if (!isInputFocused) {
            setIsInputFocused(true)
        }
        if (country) {
            // setSelectedOption("")
            // dispatch(setSelectedCountry(""))
            setCountry("")
        }
    })


    // Event delegation handler
    const handleDropdownClick = useCallback((e) => {
        // console.log('option clicked');
        const value = e.target.getAttribute("data-value")
        // const label = e.target.getAttribute("data-label")

        // console.log('option', option);

        const selected = array.find((item) => item.value === value)
        // console.log("selected", selected);
        // console.log("selected.label", selected.label);

        if (selected) {
            // setSelectedOption(selected)
            // dispatch(setSelectedCountry(selected))
            setCountry(selected)

            // setInput(selected.label)
            setInput("")
            setIsInputFocused(false)
            setHasUserModifiedInput(false)
        }
    })

    const handleKeyDown = useCallback((e) => {
        if (!hasUserModifiedInput || filteredArray.length === 0) return

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActiveIndex((prevIndex) =>
                prevIndex < filteredArray.length - 1 ? prevIndex + 1 : 0
            )
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActiveIndex((prevIndex) =>
                prevIndex > 0 ? prevIndex - 1 : filteredArray.length - 1
            )
        }

        if (e.key === 'Enter') {
            e.preventDefault()
            if (filteredArray[activeIndex]) {
                const option = filteredArray[activeIndex]
                console.log("option", option);

                // setSelectedOption(option)
                // dispatch(setSelectedCountry(option))
                setCountry(option)

                // setInput(option.label)
                setInput("")
                setIsInputFocused(false)
                setHasUserModifiedInput(false)
            }
        }
    })

    const handleBlur = () => {
        setTimeout(() => {
            setIsInputFocused(false)
            setInput("")
        }, 100);
    }

    const handelClearClick = () => {
        //  setSelectedOption("")
        // dispatch(setSelectedCountry(""))
        setCountry("")

        setHasUserModifiedInput(true)
    }


    return (
        <>
            <div className={styles.container}>
                <input type="search" placeholder={country ? "" : "Select country"} value={input}
                    onChange={handleChange}
                    onFocus={() => {
                        setIsInputFocused(true)
                    }}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                />

                {country && (
                    <>
                        <div className={styles.selectedOption}>
                            <img src={country.flag} alt="" className={styles.selectedFlag} />
                            <div>
                                {country.label}
                            </div>
                            <button onClick={handelClearClick} className={styles.clearBtn}>
                                <img src={CLOSE_ICON} alt="" className={styles.clearSvg} />
                            </button>
                        </div>
                    </>
                )}

                {(hasUserModifiedInput && isInputFocused) && (
                    <div className={styles.dropdown}
                        onClick={handleDropdownClick}
                        ref={dropdownRef}
                    >
                        {
                            filteredArray.length > 0 ? (
                                filteredArray.map((v, i) => {
                                    return (
                                        <div key={i}
                                            data-label={v.label}
                                            data-value={v.value}
                                            className={i === activeIndex ? styles.activeOption : ""}
                                            ref={(el) => optionRefs.current[i] = el}
                                        >
                                            <div className={styles.optionContent}>
                                                <img src={v.flag} alt={v.label} className={styles.flag} />
                                                <div>
                                                    {v.label}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div>No results</div>
                            )
                        }
                    </div>
                )
                }

            </div>
        </>
    )
}

export default CountrySelector