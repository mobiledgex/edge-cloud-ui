import React, { useEffect } from 'react';
import { latLng } from 'leaflet';
import { CircleMarker, Tooltip, Popup } from 'react-leaflet';

const renderPopup = (dataList) => {
    return (
        <Popup className="map-control-div-marker-popup" >
            <div className="map-control-div-marker-popup-label">
                {dataList.map((data, i) => {
                    return (
                        <div key={i}>
                            <code>{data}</code>
                            <br />
                        </div>
                    )
                })}
            </div>
        </Popup>
    )
}

const MexCircleMarker = props => {
    const { radius, coords, popupData, label, popup, color, onClick, interactive } = props
    const center = latLng(coords.lat, coords.lng)
    const [rad, setRadius] = React.useState(radius ? radius : 13)


    useEffect(() => {
        if (radius > 0) {
            setRadius(radius)
        }
    }, [radius]);

    const updateRadius = (value) => {
        if (radius && radius < 13) {
            setRadius(value)
        }
    }

    return (
        <CircleMarker radius={rad} center={center} color={color ? color : '#3288FF'} onClick={onClick} onMouseOver={() => { updateRadius(13) }} onMouseOut={() => { updateRadius(radius) }} interactive={interactive ? interactive : true}>
            {label ? <Tooltip permanent={true} direction={'center'} className='text'>
                {label}
            </Tooltip> : null}
            {popupData ? renderPopup(popupData) : popup ? popup : null}
        </CircleMarker>
    );
}

export default MexCircleMarker