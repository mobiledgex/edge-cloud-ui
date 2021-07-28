import { MapControl, withLeaflet } from "react-leaflet";
import L from "leaflet";
import { fields } from "../../../../services/model/format";
import { operators } from "../../../../helper/constant";
import { PARENT_APP_INST } from "../helper/Constant";
class Legend extends MapControl {

    createLeafletElement(props) {

    }

    onChange = (e) => {
        let index = e.target.id
        if (index) {
            const data = this.props.data[e.target.id]
            const location = data[fields.cloudletLocation]
            const key = data[fields.key]
            this.props.onClick(key, [location[fields.latitude], location[fields.longitude]])
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
                    <div style='width:20px;height:10px;background-color:${item[fields.color]}'></div>
                </td>
                <td>
                    <code>${item[fields.cloudletName]} [${item[fields.operatorName]}]</code>
                </td>`
                if (id === PARENT_APP_INST) {
                    gt = gt + `<td>
                    <code>${item[fields.clusterName]} [${item[fields.clusterdeveloper]}]</code>
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
        const appName = data[0][fields.appName]
        const version = data[0][fields.version]
        this.legend = L.control({ position: "topright" });
        this.legend.onAdd = () => {
            const div = L.DomUtil.create("div", "info legend");
            let main = `<div style="background:rgba(41,44,51,0.8);border-radius:5px;padding:10px;font-size:14px;">`
            if (id === PARENT_APP_INST) {
                main = main + `<div align='center' style='margin-bottom:10px;'><code style='margin-left:30px;font-weight:700;font-size:17px;'>${appName} [${version}]</code></div>`
            }
            main = main + `<div>${gt}</div></div>`
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
