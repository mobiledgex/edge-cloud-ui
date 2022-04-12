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
import { localFields } from '../../../../../services/fields';

const tableKeys = [
  { label: 'App', field: localFields.appName },
  { label: 'Version', field: localFields.version },
  { label: 'Cloudlet', field: localFields.cloudletName },
  { label: 'Operator', field: localFields.operatorName },
  { label: 'Cluster', field: localFields.clusterName },
]

class Legend extends MapControl {



  createLeafletElement(props) {
    if (props.data && props.data['main'] && props.data['main']['data']) {
      this.data = props.data['main']['data']
    }
  }
  componentDidMount() {
    this.legend = L.control({ position: "topright" });

    this.legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      let labels = [];

      let tabelView = `<div style="background:#292C33;border-radius:5px;padding:10px;font-size:14px"><h4><b>App Info</b></h4>${labels.join("<br>")}<table>`
      tableKeys.forEach(key => (
        tabelView = tabelView + `<tr>
          <td style="width:100px">
            <code><b>${key.label}:</b></code>
          </td>
          <td>
            <code>${this.data[key.field]}</code>
          </td>
        </tr>`
      ))
      tabelView = tabelView + `</table></div>`
      div.innerHTML = tabelView
      return div;
    };

    const { map } = this.props.leaflet;
    this.legend.addTo(map);
  }

  componentWillUnmount() {
    const { map } = this.props.leaflet;
    map.removeControl(this.legend)
  }
}

export default withLeaflet(Legend);
