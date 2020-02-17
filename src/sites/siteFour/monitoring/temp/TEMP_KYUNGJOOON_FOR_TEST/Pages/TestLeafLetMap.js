// @flow
import * as React from 'react';
import L from 'leaflet';
import {SemanticToastContainer} from "react-semantic-toasts";
import {Grid} from "semantic-ui-react";
import {showToast} from "../../../PageMonitoringCommonService";
import {Modal as AModal} from "antd";
import './styles.css'
type Props = {};
type State = {
    visible: boolean
};
var greenIcon = L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    //shadowUrl : 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
    iconSize: [25, 45], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});

export default class TestLeafLetMap extends React.Component<Props, State> {

    state = {
        visible: false,
    }

    componentDidMount(): void {
        var map = L.map('map').setView([51.505, -0.09], 13,);

        //url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"

        var CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);

        let point2 = L.marker([51.5, -0.09], {
            icon: greenIcon,
        }).addTo(map).on('click', () => {
            showToast(point2.getLatLng().toString())
            /*this.setState({
                visible: !this.state.visible
            })*/
        })

        /*L.tileLayer('"https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);*/

        map.doubleClickZoom.disable();
    }

    render() {
        return (
            <div style={{flex:1, height:'100%'}}>
                <AModal
                    mask={false}
                    title="Basic Modal"
                    visible={this.state.visible}
                    onOk={() => {
                        this.setState({
                            visible: false,
                        })
                    }}
                    onCancel={() => {
                        this.setState({
                            visible: false,
                        })
                    }}
                    width={'100%'}
                >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </AModal>
                <SemanticToastContainer position={"top-right"}/>
                <div id="map" style={{height: 800}}>xx</div>
            </div>
        );
    };
};
