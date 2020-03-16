import 'react-hot-loader';
import * as React from 'react';
import {
    Map,
    Marker,
    Popup,
    TileLayer,
    Tooltip,
    Polyline
} from "../../../../../../components/react-leaflet_kj/src/index";
import L from 'leaflet';
import {hot} from "react-hot-loader/root";

import '../../../PageMonitoring.css'


type Props = {};
type State = {
    visible: boolean
};
let greenIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    //iconUrl: require('../images/cloud003.png'),
    //iconUrl: 'https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-and-shapes-1/177800/11-512.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [21, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var redIcon = L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    //shadowUrl : 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
    iconSize: [21, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var cloud = L.icon({
    iconUrl: require('./images/cloud_green.png'),
    //shadowUrl : 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
    iconSize: [40, 21],
    iconAnchor: [20, 21],
    shadowSize: [41, 41]
});

var cell_phone = L.icon({
    iconUrl: require('./images/cellhone_white003.png'),
    //shadowUrl : 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export default hot(
    class
         extends React.Component<Props, State> {
        map = null;

        state = {
            visible: false,
        }

        componentDidMount(): void {


        }

        render() {

            const position = [51.505, -0.09]
            const position2 = [37.3875, 122.0575]
            const position3 = [37.4449, 127.1389]
            const position4 = [36.7783, -119.4179]

            const position5 = [50.1109, 8.6821]
            const posSeoul = [37.5665, 126.9780]

            return (
                <div className='page_monitoring_container'>
                    <div style={{height: '100%', width: '100%', zIndex: 1}}>
                        <Map center={[45.4, 51.7]}
                             duration={0.9}
                             style={{width: '100%', height: '100%', zIndex: 1,}}
                             zoom={3}
                             easeLinearity={1}
                             useFlyTo={true}
                             dragging={true}
                             boundsOptions={{padding: [50, 50]}}
                        >
                            <TileLayer
                                url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
                                //url={'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'}
                                minZoom={2}
                                style={{zIndex: 1}}
                                //maxZoom={15}
                            />

                            <Marker
                                position={[50.1109, 8.6821]}
                                icon={cloud}
                            >
                                <Popup>Frankfurutu eu.</Popup>
                            </Marker>

                            <Marker
                                position={[37.5665, 126.9780]}
                                icon={cell_phone}
                            >
                                <Popup>seoul WeWork.</Popup>
                            </Marker>

                            <Marker

                                position={[37.3947, 127.1112]}
                                icon={cell_phone}

                            >
                                <Popup>성남 고경준.</Popup>
                            </Marker>

                            {/*°*/}

                            <Marker

                                position={[37.2411, 127.1776]}
                                icon={cell_phone}

                            >
                                <Popup>용인 jessica.</Popup>
                            </Marker>
                            <Polyline
                                dashArray={['10, 10']}
                                positions={[
                                    [50.1109, 8.6821], [37.2411, 127.1776],
                                ]}
                                color={'grey'}
                            />
                            <Polyline
                                dashArray={['10, 10']}
                                positions={[
                                    [50.1109, 8.6821], [37.3947, 127.1112],
                                ]}
                                color={'grey'}
                            />
                            <Polyline
                                dashArray={['10, 10']}
                                positions={[
                                    [50.1109, 8.6821], [37.5665, 126.9780],
                                ]}
                                color={'grey'}
                            />


                        </Map>
                    </div>
                </div>
            );
        };
    }
)
