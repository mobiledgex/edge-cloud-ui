import React, {Component} from 'react';

import ReactMapboxGl, { Layer, Feature, Marker } from 'react-mapbox-gl';
import type {TypeAppInstance} from "../../shared/Types";
const Map = ReactMapboxGl({
    accessToken:
        'pk.eyJ1Ijoia3l1bmdqb29uLWdvLWNvbnN1bHRhbnQiLCJhIjoiY2s2Mnk2eHl0MDI5bzNzcGc0MTQ3NTM4NSJ9.BVwP4hu1ySJCJpGyVQBWSQ'
});
export default class Test001 extends Component {

    state = {
        viewport: {
            width: '100%',
            height: '100%',
            latitude: 10.4515,
            longitude: 51.1657,
            zoom: 0.8
        }
    };

    render() {
        return (
           <div style={{width:1000, height:1000}}>
               <Map
                   style={'mapbox://styles/mapbox/dark-v10'}
                   containerStyle={{
                       height: '100vh',
                       width: '100vw'
                   }}
               >
                   <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
                       <Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
                   </Layer>
               </Map>
           </div>


        );
    }
}
