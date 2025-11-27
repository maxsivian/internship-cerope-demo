export const validateName = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return { status: false, message: "Name cannot be empty." };

    if (trimmed.length >= 40)
        return { status: false, message: "Name must be under 40 characters." };

    if (!/^[A-Za-z ]+$/.test(trimmed))
        return { status: false, message: "Name must contain only letters and spaces." };

    return { status: true };
};

export const validateEmail = (email) => {
    // if (!email) return { status: false, message: "Email cannot be empty." };
    const trimmed = email.trim();
    if (!trimmed) return { status: false, message: "Email cannot be empty." };

    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.trim());
    return ok
        ? { status: true }
        : { status: false, message: "Invalid email format." };
};



export const validatePassword = (password) => {
    if (!password) return { status: false, message: "Password cannot be empty." };

    password = String(password).trim();
    const minCharLimit = password.length >= 8;
    const includesUpperCase = /[A-Z]/.test(password);
    const includesLowerCase = /[a-z]/.test(password);
    const includesNumber = /[0-9]/.test(password);
    const notContainsForbidden = !(/[*@#]/.test(password));

    // return minCharLimit && includeUpperCase && includeNumber && notContainsForbidden;
    const status = minCharLimit && includesUpperCase && includesLowerCase && includesNumber && notContainsForbidden
    // console.log("password local", password);
    
    // console.log("local", status, minCharLimit, includesUpperCase, includesLowerCase, includesNumber, notContainsForbidden);

    return { status, minCharLimit, includesUpperCase, includesLowerCase, includesNumber, notContainsForbidden };
};


