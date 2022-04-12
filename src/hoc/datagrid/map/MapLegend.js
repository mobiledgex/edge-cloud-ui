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

import React from 'react'
import { MapControl, withLeaflet } from "react-leaflet";
import L from "leaflet";
import { mapLegendColor } from '../../mexmap/constant';


const gradientFilter = (i) =>{
    let color = mapLegendColor[i]
    return `<defs><filter id="inner${i}" x0="-25%" y0="-25%" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"></feGaussianBlur><feOffset dy="2" dx="3"></feOffset><feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff"></feComposite><feFlood flood-color="${color}" flood-opacity="1"></feFlood><feComposite in2="shadowDiff" operator="in"></feComposite><feComposite in2="SourceGraphic" operator="over" result="firstfilter"></feComposite><feGaussianBlur in="firstfilter" stdDeviation="3" result="blur2"></feGaussianBlur><feOffset dy="-2" dx="-3"></feOffset><feComposite in2="firstfilter" operator="arithmetic" k2="-1" k3="1" result="shadowDiff"></feComposite><feFlood flood-color="${color}" flood-opacity="1"></feFlood><feComposite in2="shadowDiff" operator="in"></feComposite><feComposite in2="firstfilter" operator="over"></feComposite></filter></defs>`
}
const renderIcon = (i)=>{
    let path = `<path filter="url(#inner${i})" d="M 19.35 10.04 C 18.67 6.59 15.64 4 12 4 C 9.11 4 6.6 5.64 5.35 8.04 C 2.34 8.36 0 10.91 0 14 c 0 3.31 2.69 6 6 6 h 13 c 2.76 0 5 -2.24 5 -5 c 0 -2.64 -2.05 -4.78 -4.65 -4.96 Z"></path>`
    let svgImage = `<svg viewBox="0 0 24 24" style="width:17px; height:17px;"><g fill=rgba(10,10,10,.7) stroke="#fff" stroke-width="0"> ${gradientFilter(i)} ${path} </g></svg>`
    return `<span style="vertical-align: middle; display: inline-block;">${svgImage}</span>`
}

class Legend extends MapControl {
  createLeafletElement(props) {}

  componentDidMount() {
    this.legend = L.control({ position: "bottomright" });

    this.legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      const infos = ['Offline', 'Online', 'Maintenance', 'Multiple'];
      let labels = [];

      for (let i in infos) {
        labels.push(
          `${renderIcon(i)}<span style="vertical-align: middle; margin-left: 10px; display: inline-block;">${infos[i]}</span>`
        );
      }

      div.innerHTML = `<div style="background:#292C33;border-radius:5px;padding:10px;"><h5>Cloudlet Status</h5>${labels.join("<br>")}</div>`;
      return div;
    };

    const { map } = this.props.leaflet;
    this.legend.addTo(map);
  }

  componentWillUnmount(){
    const { map } = this.props.leaflet;
    map.removeControl(this.legend)
  }
}

export default withLeaflet(Legend);
