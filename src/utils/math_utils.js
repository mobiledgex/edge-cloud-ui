export const toRadians = (degrees) => {
    return degrees * (Math.PI / 180)
}
export const toDegrees = (radians) => {
    return radians * (180 / Math.PI)
}

export const center = (lat1, lon1, lat2, lon2) => {
    const dLon = toRadians(lon2 - lon1);
    //convert to radians
    lat1 = toRadians(lat1);
    lat2 = toRadians(lat2);
    lon1 = toRadians(lon1);
    const Bx = Math.cos(lat2) * Math.cos(dLon);
    const By = Math.cos(lat2) * Math.sin(dLon);
    const lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + Bx) * (Math.cos(lat1) + Bx) + By * By));
    const lon3 = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);

    return { lat: toDegrees(lat3), lng: toDegrees(lon3) }
}