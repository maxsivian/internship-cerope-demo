export const getChangedFields = (oldData, newData) => {
    const changed = {};

    for (let key in newData) {
        if (newData[key] !== oldData[key]) {
            changed[key] = newData[key];
        }
    }

    return changed;
};
