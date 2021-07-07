import { MapControl, withLeaflet } from "react-leaflet";
import L from "leaflet";
import { fields } from "../../../../services/model/format";
import { operators } from "../../../../helper/constant";
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
        const { data } = this.props
        let gt = `<table class="scroll">\
        <thead>
                <tr align='left'>
                    <th style='width:50px;'></th>
                    <th style='border-bottom:1px solid white;'><code>Cloudlet</code></th>
                    <th style='border-bottom:1px solid white;'><code>Cluster</code></th>
                    <th style='width:50px;border-bottom:1px solid white;'>Location Tile</th>
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
                </td>
                <td>
                    <code>${item[fields.clusterName]} [${item[fields.clusterdeveloper]}]</code>
                </td>
                <td style='width:50px'>
                    <button onMouseOver="this.style.backgroundColor='rgb(57,58,63)';this.style.borderRadius='100px'" onMouseOut="this.style.backgroundColor='transparent'" style='background:transparent;border:none;width:40px;height:40px;'>
                        <span id='${i}' class='material-icons-outlined' style='cursor:pointer;color:${item['locationColor']}' onClick=''>gps_fixed</span>
                    </button>
                </td></tr>`
            }
        })
        gt = gt + '</tbody></table>'
        const appName = data[0][fields.appName]
        const version = data[0][fields.version]
        this.legend = L.control({ position: "topright" });
        this.legend.onAdd = () => {
            const div = L.DomUtil.create("div", "info legend");
            div.innerHTML = `\
            <div style="background:rgba(41,44,51,0.8);border-radius:5px;padding:10px;font-size:14px;">\
                <div align='center' style='margin-bottom:10px;'><code style='margin-left:30px;font-weight:700;font-size:17px;'>${appName} [${version}]</code></div> \
                <div>
                        ${gt}
                </div>
            </div>`
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
