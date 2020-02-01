import React, {Component} from "react"
import {ComposableMap, Geographies, Geography, Marker, Markers, ZoomableGroup} from "react-simple-maps"
import {Button, Icon} from "semantic-ui-react";
import type {TypeAppInstance} from "../../../../shared/Types";

const geoUrl =
    "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json"

const FA = require('react-fontawesome')
type Props = {
    markerList: Array,

}

type State = {
    date: string,
    zoom: number,
    markerList: Array,
    showModal: boolean,
}


export default class MiniMapForDevMon extends Component<Props, State> {


    constructor(props) {
        super(props);
        this.state = {
            zoom: 0.45,
            markerList: [],
            showModal: false,
        }

        //this.handleWheel = this.handleWheel.bind(this);
    }

    componentDidMount(): void {

        console.log('markerList===>', this.props.markerList);
        this.setState({
            markerList: this.props.markerList
        })
        /* this.setState({
             markerList: this.props.markerList,
         }, () => {
             console.log('markerList22===>', this.state.markerList);

             let results = this.state.markerList

             results.map(item => {

                 console.log('CloudletLocation===>', item.CloudletLocation);
             })
         })*/
    }


    async componentWillReceiveProps(nextProps: Props, nextContext: any): void {
        /* if (this.props.markerList !== nextProps.markerList) {

             console.log('markerList===>', this.props.markerList);

             await this.setState({
                 markerList: nextProps.markerList,
             });
             console.log('markerList===>', this.state.markerList);
         }*/

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

    handleDoubleClick = evt => {
        this.setState({
            zoom: this.state.zoom * 1.4
        })
    }

    renderMap = (type: string) => {
        return (

            <div>
                <ComposableMap
                    projectionConfig={{
                        scale: 600,
                        //rotation: [-11, 0, 0],
                    }}
                    width={980}
                    height={700}
                    style={{
                        width: "100%",
                        height: "100%",
                        //backgroundColor:'blue'
                    }}
                >
                    <ZoomableGroup center={[0, 20]} zoom={this.state.zoom} onZoomEnd={(position) => {

                        this.setState({
                            zoom: position.zoom
                        })

                    }}>
                        <Geographies
                            geography={geoUrl}
                        >
                            {(geographies, projection) => geographies.map((geography, i) => geography.id !== "ATA" && (
                                <Geography
                                    key={i}
                                    onWheel={(e) => {
                                        this.handleWheel(e)
                                    }}
                                    geography={geography}
                                    projection={projection}
                                    style={{
                                        default: {
                                            fill: "#607D8B",
                                            stroke: "#607D8B",
                                            strokeWidth: 0.75,
                                            outline: "none",
                                        },
                                        hover: {
                                            fill: "#607D8B",
                                            stroke: "#607D8B",
                                            strokeWidth: 0.75,
                                            outline: "none",
                                        },
                                        pressed: {
                                            fill: "#607D8B",
                                            stroke: "#607D8B",
                                            strokeWidth: 0.75,
                                            outline: "none",
                                        },
                                    }}
                                />
                            ))}
                        </Geographies>
                        <Markers>
                             <Marker fill="#777" marker={{coordinates: [-101, 53]}}>
                                <text textAnchor="middle" fill="#F53">
                                   CANADA
                                </text>
                            </Marker>

                            <Marker fill="#777" marker={{coordinates: [-102, 38]}}>
                                <text textAnchor="middle" fill="#F53">
                                    USA
                                </text>
                            </Marker>

                            <Marker fill="#777" marker={{coordinates: [-102, 38]}}>
                                <text textAnchor="middle" fill="#F53">
                                    Mexico
                                </text>
                            </Marker>
                             <Marker fill="#777" marker={{coordinates: [10.4515, 51.1657]}}>
                                <text textAnchor="middle" fill="#F53">
                                    Germany
                                </text>
                            </Marker>
                        </Markers>
                        <Markers>
                            {this.props.markerList.map((item : TypeAppInstance, index) => {
                                return (

                                    <Marker
                                        onClick={() => {

                                            //alert('sdlkfsldkf')
                                        }}

                                        marker={{coordinates: [item.CloudletLocation.longitude, item.CloudletLocation.latitude]}} style={{
                                        hidden: {opacity: 0},
                                    }}>
                                        {/*<svg width="35" height="35">
                                            </svg>*/}
                                        {/*<image href="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png" style={{color: 'red'}} height="35" width="35"/>*/}
                                        <image href="https://cdn1.iconfinder.com/data/icons/basic-ui-elements-coloricon/21/06_1-512.png" style={{color: 'red'}} height="55" width="35"/>
                                        <text fill="#fff" style={{fontSize: 20, fontFamily: "Barlow Semi Condensed", fontStyle: 'italic',}}>
                                            {item.AppName} [ {item.Cloudlet} ]
                                        </text>
                                    </Marker>


                                )
                            })}
                        </Markers>
                    </ZoomableGroup>

                </ComposableMap>
                <div style={{marginTop: type==='popup' ? -900 : -250, zIndex: 999999}}>
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
                    {/*  <Button id="mapZoomCtl" size='large' icon onClick={() => {
                        this.setState({
                            showModal: !this.state.showModal
                        })
                    }}>
                        <Icon name="fullscreen square outline"/>
                    </Button>*/}
                </div>
            </div>


        )
    }

    togglePopup() {
        this.setState({
            showModal: !this.state.showModal
        });
    }


    render() {
        return (
            <div style={{
                width: "100%",
                backgroundColor: '#23252c',
                maxWidth: 1200,
                margin: "0 auto",
            }}
                 onDoubleClick={this.handleDoubleClick}
            >
                {this.renderMap()}


                {/*@todo: Modal*/}
                {/*@todo: Modal*/}
                {/*@todo: Modal*/}
                {this.state.showModal ?
                    <Popup
                        text='Close Me'
                        closePopup={this.togglePopup.bind(this)}
                        renderMap={this.renderMap}
                    />
                    : null
                }
            </div>
        )
    }
}

class Popup extends React.Component {
    render() {
        return (
            <div className='popup'>
                <Button onClick={this.props.closePopup} style={{zIndex: 99999, marginTop: 25}}>
                    Close
                </Button>
                <div className='popup_inner'>
                    <div className='popup_inner'>
                        {this.props.renderMap('popup')}
                    </div>
                </div>
            </div>
        );
    }
}
