import React, {Component} from "react"
import {ComposableMap, Geographies, Geography, Marker, ZoomableGroup, Annotation} from "../../../../../../components/react-simple-maps-v1/src/ReactSimpleMapV1"
import {Button, Icon} from "semantic-ui-react";
import './mapbox.css'



type Props = {
    cloudletList: Array,
}

type State = {
    date: string,
    zoom: number,
    cloudletList: Array,
}

export default class SimpleMapTest extends Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            zoom: 1,
            cloudletList: [],
        }

        this.handleWheel = this.handleWheel.bind(this);
    }

    handleDoubleClick = evt => {
        this.setState({
            zoom: this.state.zoom * 1.4
        })
    }

    handleWheel(event) {
        event.preventDefault();
        console.log("scroll detected");
        console.log(event.deltaY);

        if (event.deltaY > 0) {
            this.setState({
                zoom: this.state.zoom / 1.1
            });
        }
        if (event.deltaY < 0) {
            this.setState({
                zoom: this.state.zoom * 1.1
            });
        }
    }

    render() {


        return (
            <div
                style={{
                    width: "100%",
                    backgroundColor: '#23252c',
                    maxWidth: 1200,
                    margin: "0 auto",
                }}

            >
                <ComposableMap
                    onDoubleClick={this.handleDoubleClick}
                >
                    <ZoomableGroup zoom={this.state.zoom}>
                        <Geographies
                            geography={require('../../../../../../components/react-simple-maps-v1/topojson-maps/world-10m')}

                        >
                            {({geographies}) =>
                                geographies.map(geo => (
                                    <Geography

                                        key={geo.rsmKey}
                                        geography={geo}
                                        onWheel={(e) => {
                                            this.handleWheel(e)
                                        }}

                                    />
                                ))
                            }
                        </Geographies>
                    </ZoomableGroup>
                    <Marker coordinates={[-101, 53]} fill="#777">
                        <text textAnchor="middle" fill="#F53">
                            Canada
                        </text>
                    </Marker>
                    <Marker coordinates={[-102, 38]} fill="#777">
                        <text textAnchor="middle" fill="#F53">
                            USA
                        </text>
                    </Marker>
                    <Marker coordinates={[-103, 25]} fill="#777">
                        <text textAnchor="middle" fill="#F53">
                            Mexico
                        </text>
                    </Marker>
                    <Annotation
                        subject={[2.3522, 48.8566]}
                        dx={-90}
                        dy={-30}
                        connectorProps={{
                            stroke: "#FF5533",
                            strokeWidth: 3,
                            strokeLinecap: "round"
                        }}
                    >
                        <text x="-8" textAnchor="end" alignmentBaseline="middle" fill="#F53">
                            {"Paris"}
                        </text>
                    </Annotation>
                </ComposableMap>
                <div className="controls" style={{marginTop: -190}}>
                    <Button id="mapZoomCtl" size='larges' icon onClick={() => {
                        this.setState({
                            zoom: 0.45,
                        })
                    }}>
                        <Icon name="refresh"/>
                    </Button>
                    <Button id="mapZoomCtl" size='large' icon onClick={() => {
                        this.setState({
                            zoom: this.state.zoom * 1.2
                        })
                    }}>
                        <Icon name="plus square outline"/>
                    </Button>
                    <Button id="mapZoomCtl" size='large' icon onClick={() => {
                        this.setState({
                            zoom: this.state.zoom * 0.8
                        })
                    }}>
                        <Icon name="minus square outline"/>
                    </Button>
                </div>
            </div>
        )
    }
}
