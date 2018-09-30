export const removeFalseyValues = (obj) => {
    const res = {};
    Object.keys(obj).forEach(key => obj[key] && (res[key] = obj[key]));
    return res;
}