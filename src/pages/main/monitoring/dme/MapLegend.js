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

import { MapControl, withLeaflet } from "react-leaflet";
import L from "leaflet";
import { localFields } from "../../../../services/fields";
import { operators } from "../../../../helper/constant";
import { PARENT_APP_INST } from "../../../../helper/constant/perpetual";
class Legend extends MapControl {

    createLeafletElement(props) {

    }

    onChange = (e) => {
        let index = e.target.id
        if (index) {
            const data = this.props.data[e.target.id]
            const location = data[localFields.cloudletLocation]
            const key = data[localFields.key]
            this.props.onClick(key, [location[localFields.latitude], location[localFields.longitude]])
        }
    }

    removeLegend = () => {
        const { map } = this.props.leaflet;
        map.removeControl(this.legend)
    }

    renderMapLegend = () => {
        const { data, id } = this.props
        let gt = `<table class="scroll">\
        <thead>
                <tr align='left'>
                    <th style='width:50px;'></th>
                    <th style='border-bottom:1px solid white;'><code>Cloudlet</code></th>`
        if (id === PARENT_APP_INST) {
            gt = gt + `<th style='border-bottom:1px solid white;'><code>Cluster</code></th>`
        }
        gt = gt + `<th style='border-bottom:1px solid white;'>Cloudlet Location</th>
                </tr>
            </thead>
            <tbody>`
        data.forEach((item, i) => {
            if (item) {
                gt = gt + `<tr>
                <td style='width:50px'>
                    <div style='width:20px;height:10px;background-color:${item[localFields.color]}'></div>
                </td>
                <td>
                    <code>${item[localFields.cloudletName]} [${item[localFields.operatorName]}]</code>
                </td>`
                if (id === PARENT_APP_INST) {
                    gt = gt + `<td>
                    <code>${item[localFields.clusterName]} [${item[localFields.clusterdeveloper]}]</code>
                </td>`
                }
                gt = gt + `<td style='width:50px'>
                <span mtooltip="View aggregated cloudlet latency" flow="right">
                    <button onMouseOver="this.style.backgroundColor='rgb(57,58,63)';this.style.borderRadius='100px'" onMouseOut="this.style.backgroundColor='transparent'" style='background:transparent;border:none;width:40px;height:40px;'>
                        <span id='${i}' class='material-icons-outlined' style='cursor:pointer;color:${item['locationColor']}' onClick=''>gps_fixed</span>
                          
                    </button>
                   </span>
                </td></tr>`
            }
        })
        gt = gt + '</tbody></table>'
        const appName = data[0][localFields.appName]
        const version = data[0][localFields.version]
        this.legend = L.control({ position: "topright" });
        this.legend.onAdd = () => {
            const div = L.DomUtil.create("div", "info legend");
            let main = `<div style="background:rgba(41,44,51,0.8);border-radius:5px;padding:10px;font-size:14px;">`
            if (id === PARENT_APP_INST) {
                main = main + `<div align='center' style='margin-bottom:10px;'><code style='margin-left:30px;font-weight:700;font-size:17px;'>${appName} [${version}]</code></div>`
            }
            main = main + `<div class='legend'>${gt}</div></div>`
            div.innerHTML = main
            div.addEventListener('click', this.onChange);
            return div;
        };
        const { map } = this.props.leaflet;
        this.legend.addTo(map);
    }

    componentDidUpdate = (preProps, preState) => {
        if (!operators.equal(preProps.data, this.props.data)) {
            this.removeLegend()
            this.renderMapLegend()
        }
    }

    demo = () => {
        alert()
    }

    componentDidMount() {
        this.renderMapLegend()
    }

    componentWillUnmount() {
        this.removeLegend()
    }
}

export default withLeaflet(Legend);
