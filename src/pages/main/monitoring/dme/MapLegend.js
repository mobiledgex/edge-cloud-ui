import { MapControl, withLeaflet } from "react-leaflet";
import L from "leaflet";
import { fields } from "../../../../services/model/format";
import { operators } from "../../../../helper/constant";

class Legend extends MapControl {

    createLeafletElement(props) {

    }

    onChange = (e) => {
        this.props.onChange(e.target.value)
    }

    // <select (click)="onChange()" style="border-radius:5px;width:70px;background-color:#000;color:white;padding:2px">\
    //                 <option value='min'>Min</option>\
    //                 <option value='max'>Max</option>\
    //                 <option value='avg'>Avg</option>\
    //             </select>\

    removeLegend = ()=>{
        const { map } = this.props.leaflet;
        map.removeControl(this.legend)
    }

    renderMapLegend = () => {
        const { data } = this.props
        let gt = `<table class="scroll">\
        <thead>
                <tr align='left'>
                    <th style='width:50px;'></th></th><th style='border-bottom:1px solid white;'><code>Cloudlet</code></th>
                    <th style='border-bottom:1px solid white;'><code>Cluster</code></th>
                </tr>
            </thead>
            <tbody>`
        data.forEach((item, i) => {
            if (item) {
                gt = gt + `<tr><td style='width:50px'><div style='width:20px;height:10px;background-color:${item[fields.color]}'></div></td><td><code>${item[fields.cloudletName]} [${item[fields.operatorName]}]</code></td><td><code>${item[fields.clusterName]} [${item[fields.clusterdeveloper]}]</code></td></tr>`
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
            div.addEventListener('change', this.onChange);
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

    componentDidMount() {
        this.renderMapLegend()
    }

    componentWillUnmount() {
        this.removeLegend()
    }
}

export default withLeaflet(Legend);
