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

import * as L from "leaflet";
import { renderSVG, renderColorSVG } from "./constant";

export const cloudGreenIcon = (cost) => L.divIcon({
    html: `<div style="width:28px; height:28px">${renderSVG(1, cost)}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    className: 'map-marker'
});

export const cloudIcon = (key, color, cost) => L.divIcon({
    html: `<div style="width:28px; height:28px">${renderColorSVG(key, color, cost)}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    className: 'map-marker'
});

export const mobileIcon = L.icon({
    iconUrl: '/assets/images/mobile-tower-green.png',
    iconSize: [21, 34],
    iconAnchor: [20, 21],
    shadowSize: [41, 41]
});