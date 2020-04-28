// @flow
import * as React from 'react';
import ReactGlobe from "react-globe";
import markers from "./marker";
import markerRenderer from "./MakerRenderer";

type Props = {};

export default function GlobeComponent() {


    return (
        <div style={{
            flex: 1,
            height: '86vh',
            width: '97vw',
            marginTop: 10,
        }}>
            <ReactGlobe
                /*globeOptions={{
                    texture:
                        'https://raw.githubusercontent.com/chrisrzhou/react-globe/master/textures/globe_dark.jpg',
                }}*/
                markers={markers}
                markerOptions={{renderer: markerRenderer}}
            />
        </div>
    )
};