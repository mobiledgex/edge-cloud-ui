import React, {Component} from 'react';

import ReactMapboxGl, {Feature, Layer} from 'react-mapbox-gl';
import {hot} from "react-hot-loader/root";
import TagCloud from 'react-tag-cloud';
import randomColor from 'randomcolor';
const Map = ReactMapboxGl({
    accessToken:
        'pk.eyJ1Ijoia3l1bmdqb29uLWdvLWNvbnN1bHRhbnQiLCJhIjoiY2s2Mnk2eHl0MDI5bzNzcGc0MTQ3NTM4NSJ9.BVwP4hu1ySJCJpGyVQBWSQ'
});
type Props = {};
type State = {};

export default hot(
    class TagCloudTest extends React.Component<Props, State> {

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
                <div style={{width: 1000, height: 1000}}>
                    <TagCloud
                        style={{
                            fontFamily: 'sans-serif',
                            fontSize: 30,
                            fontWeight: 'bold',
                            fontStyle: 'italic',
                            color: () => randomColor(),
                            padding: 5,
                            width: '100%',
                            height: '100%'
                        }}>
                        <div style={{fontSize: 50}}>react</div>
                        <div style={{color: 'green'}}>tag</div>
                        <div rotate={90}>cloud</div>
                    </TagCloud>
                </div>


            );
        }
    }
)
