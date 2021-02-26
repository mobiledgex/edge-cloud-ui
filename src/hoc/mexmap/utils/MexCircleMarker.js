import React from 'react';
import { latLng } from 'leaflet';
import { CircleMarker, Tooltip, Popup } from 'react-leaflet';

const renderMarkerPopup = (dataList) => {
    return (
        <Popup className="map-control-div-marker-popup" >
            <div className="map-control-div-marker-popup-label">
                {dataList.map((data, i) => {
                    return (
                        <div  key={i}>
                            <code>{data}</code>
                            <br/>
                        </div>
                    )
                })}
            </div>
        </Popup>
    )
}

const MexCircleMarker = props => {
    const center = latLng(props.coords.lat, props.coords.lng)
    const dataList = props.popupData
    return (
        <CircleMarker radius={13} center={center}>
            <Tooltip permanent={true} direction={'center'} className='text'>
                {props.label}
            </Tooltip>
            {renderMarkerPopup(dataList)}
        </CircleMarker>
    );
}

export default MexCircleMarker