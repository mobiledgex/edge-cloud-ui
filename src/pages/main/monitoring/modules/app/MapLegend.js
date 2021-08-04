import { MapControl, withLeaflet } from "react-leaflet";
import L from "leaflet";
import { fields } from '../../../../../services/model/format';

const tableKeys = [
  { label: 'App', field: fields.appName },
  { label: 'Version', field: fields.version },
  { label: 'Cloudlet', field: fields.cloudletName },
  { label: 'Operator', field: fields.operatorName },
  { label: 'Cluster', field: fields.clusterName },
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
