export const validatePassword = (password) => {
    const minCharLimit = password.length >= 8;
    const includeUpperCase = /[A-Z]/.test(password);
    const includeNumber = /[0-9]/.test(password);

    return minCharLimit && includeUpperCase && includeNumber;
}