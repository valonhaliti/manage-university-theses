export const removeFalseyValues = (obj) => {
    const res = {};
    Object.keys(obj).forEach(key => (obj[key] !== undefined && obj[key] !== null) && (res[key] = obj[key]));
    return res;
}