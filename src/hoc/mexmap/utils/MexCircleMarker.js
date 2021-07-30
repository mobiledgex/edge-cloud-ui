import React from 'react';
import { latLng } from 'leaflet';
import { CircleMarker, Tooltip, Popup } from 'react-leaflet';

const renderPopup = (dataList) => {
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
    const {radius, coords, popupData, label, popup, color, onClick, interactive} = props
    const center = latLng(coords.lat, coords.lng)
    return (
        <CircleMarker radius={radius ? radius : 13} center={center} color={color ? color : '#3288FF'} onClick={onClick} interactive={interactive}>
            {label ? <Tooltip permanent={true} direction={'center'} className='text'>
                {label}
            </Tooltip> : null}
            {popupData ? renderPopup(popupData) : popup ? popup : null}
        </CircleMarker>
    );
}

export default MexCircleMarker