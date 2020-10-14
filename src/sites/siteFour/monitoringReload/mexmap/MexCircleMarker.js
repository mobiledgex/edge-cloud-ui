import React from 'react';
import { latLng } from 'leaflet';
import { CircleMarker, Tooltip } from 'react-leaflet';

const PolygonWithText = props => {
    const center = latLng(props.coords.lat, props.coords.lng)
    return (
        <CircleMarker radius={13} center={center}>
            <Tooltip permanent={true} direction={'center'} className='text'>
                {props.label}
        </Tooltip>
        </CircleMarker>
    );
}

export default PolygonWithText