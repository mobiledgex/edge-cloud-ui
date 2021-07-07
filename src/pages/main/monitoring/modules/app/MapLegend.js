import { MapControl, withLeaflet } from "react-leaflet";
import L from "leaflet";
import { fields } from '../../../../../services/model/format';

class Legend extends MapControl {
  
  createLeafletElement(props) {
    if(  props.data && props.data['main'] && props.data['main']['data'])
    {
      this.data = props.data['main']['data']
    }
  }
  componentDidMount() {
    this.legend = L.control({ position: "topright" });

    this.legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      let labels = [];

     
      div.innerHTML = `\
      <div style="background:#292C33;border-radius:5px;padding:10px;font-size:14px"><h4><b>App Info</b></h4>${labels.join("<br>")}\
        <table>\
          <tr>\
            <td><code><b>App:</b></code></td><td><code>${this.data[fields.appName]}</code></td>\
          </tr>\
          <tr>\
            <td><code><b>Version:</b></code></td><td>${this.data[fields.version]}</td>\
          </tr>\
          <tr>\
            <td><code><b>Cloudlet:</b></code></td><td> ${this.data[fields.cloudletName]}</td>\
          </tr>\
          <tr>\
            <td><code><b>Operator:</b></code></td><td> ${this.data[fields.operatorName]}</td>\
          </tr>\
          <tr>\
            <td><code><b>Cluster:</b></code></td><td> ${this.data[fields.clusterName]}</td>\
          </tr>\
        </table>\
      </div>`
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
