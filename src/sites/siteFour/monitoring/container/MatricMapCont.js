import React from "react";
import Map from "../../../../libs/simpleMaps/with-react-motion/index_monitoring";
import { filterSearch } from "../../../../utils";

const MatricMapCont = props => {
    const [mapData, setMapData] = React.useState([]);
    const cloudlet = {};
    let markers = [];
    const makeLocation = (object, total) => {
        markers = markers.concat(object.cloudletLocation = {
            latitude: object.latitude,
            longitude: object.longitude,
            fields: {
                state: 5
            },
            cloudletName: object.cloudletName,
            callCount: total
        });
        setMapData(markers);
    };
    const onMapClick = (event, prop) => {
        //
    };
    React.useEffect(() => {
        console.log("20200521 container widget   == 9999   ", props.cloudlets, ":", props.data);
        if (props.cloudlets && props.data) {
            let findCountTotal = 0;
            props.data.map(data => {
                const { cloudlets } = data;
                let matchCloudlet = [];
                cloudlets.map((_cloudlet, i) => {
                    // _cloudlet 이름으로 prop.cloudlets 안에 정보를 찾아서
                    if (_cloudlet && data.FindCloudlet[i][_cloudlet]) {
                        matchCloudlet = filterSearch(props.cloudlets, _cloudlet, "cloudletName");
                        data.FindCloudlet[i][_cloudlet].y.map(value => {
                            findCountTotal += value;
                        });
                        matchCloudlet.map(cld => {
                            makeLocation(cld, findCountTotal);
                        });
                    }
                });
            });

        }
    }, [props]);

    return (
        <div className="panel_worldmap" style={{ width: "100%", height: "100%" }}>
            <Map dataList={mapData} id="Cloudlets" reg="cloudletAndClusterMap" zoomControl={{ center: [0, 0], zoom: 1.5 }} onMapClick={onMapClick} />
        </div>
    );
};
export default MatricMapCont;
