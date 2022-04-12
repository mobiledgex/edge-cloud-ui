/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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