import { MapControl, withLeaflet } from "react-leaflet";
import L from "leaflet";

class Legend extends MapControl {

    createLeafletElement(props) {

    }

    onChange = (e)=>{
        this.props.onChange(e.target.value)
    }


    componentDidMount() {
        this.legend = L.control({ position: "topright" });

        this.legend.onAdd = () => {
            const div = L.DomUtil.create("div", "info legend");
            let labels = [];


            div.innerHTML = `\
            <div >\
                <select (click)="onChange()" style="border-radius:5px;width:70px;background-color:#000;color:white;padding:2px">\
                    <option value='min'>Min</option>\
                    <option value='max'>Max</option>\
                    <option value='avg'>Avg</option>\
                </select>\
            </div>`
            div.addEventListener('change', this.onChange);
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
