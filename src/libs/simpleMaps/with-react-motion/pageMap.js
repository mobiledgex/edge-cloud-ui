
import React, { Component } from "react"
import {Map, CircleMarker, Popup, Tooltip, TileLayer, LayersControl, Marker, Path} from "react-leaflet";
import { Button, Icon, List } from 'semantic-ui-react';
import ContainerDimensions from 'react-container-dimensions';
import isEqual from 'lodash/isEqual';
import { Motion, spring } from "react-motion"
import * as d3 from 'd3';
import { scaleLinear } from "d3-scale"
import L from 'leaflet';
//redux
import { connect } from 'react-redux';

import RadialGradientSVG from '../../../chartGauge/radialGradientSVG';

import * as aggregation from '../../../utils';
import ReactTooltip from 'react-tooltip';
//style
import styles from '../../../css/worldMapStyles';
import './styles.css';
import CountryCode from '../../../libs/country-codes-lat-long-alpha3';
import { fields } from '../../../services/model/format'

const grdColors = ["#d32f2f", "#fb8c00", "#66CCFF", "#fffba7", "#FF78A5", "#76FF03"]
const zoomControls = { center: [53, 13], zoom: 3 }
const markerSize = [20, 24]

let _self = null;

class ClustersMap extends Component {
    constructor() {
        super()
        _self = this;
        this.state = {
            center: zoomControls.center,
            zoom: zoomControls.zoom,
            cities: [],
            countries: [],
            citiesSecond: [],
            detailMode: false,
            selectedCity: [],
            oldCountry: '',
            unselectCity: '',
            saveMarker: [],
            keyName: '',
            mapCenter: zoomControls.center,
        }
        // this.handleCityClick = this.handleCityClick.bind(this)
        this.dir = 1;
    }

    handleReset = () => {
        this.setState({
            mapCenter:(this.props.region === 'US') ? [41,-74] : [53,13],
            detailMode: false
        })
        if(this.props.onClick)
        {
            this.props.onClick()
        }
    }

    handleRefresh = () => {
        this.setState({mapCenter: this.state.detailMode? this.state.mapCenter : (this.props.region === 'US') ? [41,-74] : [53,13]})
    }


    handleCityClick = (city) =>{
        // if (d3.selectAll('.rsm-markers').selectAll(".levelFive")) {
        //     d3.selectAll('.rsm-markers').selectAll(".levelFive")
        //         .transition()
        //         .ease(d3.easeBack)
        //         .attr("r", markerSize[0])
        // }
        this.setState({
            mapCenter: city.coordinates,
            detailMode: true,
        })
        if(this.props.onClick)
        {
            this.props.onClick(city)
        }
    }

    componentDidMount() {
        if (this.props.zoomControl) {
            this.setState({ center: this.props.zoomControl.center, zoom: this.props.zoomControl.zoom })
        }

        let _self = this;
        _self.setState({ oldCountry: this.state.selectedCity })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let initialData = (nextProps.dataList) ? nextProps.dataList : nextProps.locData;
        let data = nextProps.locData ? initialData : initialData.filter((item) => item[fields.state] == 5);
        let mapCenter = (prevState.detailMode)? prevState.mapCenter : (nextProps.region === 'US') ? [41,-74] : [53,13];

        function reduceUp(value) {
            return Math.round(value)
        }
        const mapName = (item) => {
            let id = nextProps.id
            if (id === "Cloudlets") {
                return item[fields.cloudletName]
            } else if (id === "AppInsts") {
                return item[fields.appName]
            } else if (id === "ClusterInst") {
                if (nextProps.reg === 'cloudletAndClusterMap') {
                    return item[fields.cloudletName]
                } else {
                    return item[fields.clusterName]
                }
            } else {
                return
            }
        }

        let locations = data.map((item) => {
            if (item[fields.cloudletLocation]) {

                if (item[fields.cloudletStatus]) {
                    return ({LAT: reduceUp(item[fields.cloudletLocation].latitude), LON: reduceUp(item[fields.cloudletLocation].longitude), cloudlet: mapName(item), status: (item[fields.cloudletStatus] === 2)? 'green' : 'red'})
                }
                return ({LAT: reduceUp(item[fields.cloudletLocation].latitude), LON: reduceUp(item[fields.cloudletLocation].longitude), cloudlet: mapName(item), status:'green'})
            }
        })


        let locationData = [];
        let groupbyData = aggregation.groupByCompare(locations, ['LAT', 'LON']);

        const cloundletName = (key) => {

            let nameArray = [];
            groupbyData[key].map((item, i) => {
                nameArray[i] = item['cloudlet'];
            })
            return nameArray;
        }

        const statusList = (key) => {

            let nameArray = [];
            groupbyData[key].map((item, i) => {

                nameArray[i] = {name: item['cloudlet'], status: item.status};
            })
            return nameArray;
        }


        const statusColor = (key) => {

            let status = '';
            let online = false;
            let offline = false;


            groupbyData[key].map((item, i) => {
                if(item.status === 'green') {
                    online = true;
                } else if(item.status === 'red') {
                    offline = true;
                }
            })

            if(online && offline) {
                status = 'orange';
            } else if(!online && offline) {
                status = 'red';
            } else if(online && !offline) {
                status = 'green';
            }

            return status;
        }

        Object.keys(groupbyData).map((key) => {
            locationData.push({ "name": cloundletName(key), "coordinates": [groupbyData[key][0]['LAT'], groupbyData[key][0]['LON']],"status":statusColor(key), "statusList": statusList(key), "cost": groupbyData[key].length })
        })

        let cloudlet = data.map((item) => (
            { LAT: item[fields.cloudletLocation].latitude, LON: item[fields.cloudletLocation].longitude, cloudlet: item[fields.cloudletName] }
        ))


        let cloudletData = [];

        let groupbyClData = aggregation.groupBy(cloudlet, 'cloudlet');

        Object.keys(groupbyClData).map((key) => {
            cloudletData.push({ "name": key, "coordinates": [groupbyClData[key][0]['LAT'], groupbyClData[key][0]['LON']], "cost": groupbyClData[key].length })
        })


        if (!isEqual(locationData, prevState.cities)) {

            let clickMarker = [];
            let zoom = nextProps.locData ? prevState.zoom : zoomControls.zoom
            let center = nextProps.locData ? prevState.center : zoomControls.center

            if (nextProps.mapDetails) {
                if (d3.selectAll('.rsm-markers').selectAll(".levelFive")) {
                    d3.selectAll('.rsm-markers').selectAll(".levelFive")
                        .transition()
                        .ease(d3.easeBack)
                        .attr("r", markerSize[0])
                }

                nextProps.mapDetails.name.map((item, i) => {
                    clickMarker.push({ "name": item, "coordinates": nextProps.mapDetails.coordinates, "cost": 1 })
                })

                zoom = 4
                center = nextProps.mapDetails.coordinates
            }
            return {mapCenter:mapCenter, cities: locationData, center: center, zoom: zoom, detailMode: nextProps.mapDetails ? true : false, };
        }
        return null;
    }

    gradientFilter(key) {
        return `<defs><filter id="inner${key}" x0="-25%" y0="-25%" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"></feGaussianBlur><feOffset dy="2" dx="3"></feOffset><feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff"></feComposite><feFlood flood-color="${grdColors[key]}" flood-opacity="0.5"></feFlood><feComposite in2="shadowDiff" operator="in"></feComposite><feComposite in2="SourceGraphic" operator="over" result="firstfilter"></feComposite><feGaussianBlur in="firstfilter" stdDeviation="3" result="blur2"></feGaussianBlur><feOffset dy="-2" dx="-3"></feOffset><feComposite in2="firstfilter" operator="arithmetic" k2="-1" k3="1" result="shadowDiff"></feComposite><feFlood flood-color="${grdColors[key]}" flood-opacity="0.5"></feFlood><feComposite in2="shadowDiff" operator="in"></feComposite><feComposite in2="firstfilter" operator="over"></feComposite></filter></defs>`
    }



    iconMarker = (city, config) => {

        let cost = city.cost? city.cost : '';

        let gradientRed = this.gradientFilter(0);
        let gradientOrange = this.gradientFilter(1);
        let gradientBlue = this.gradientFilter(2);
        let gradientGold = this.gradientFilter(3);
        let gradientPink = this.gradientFilter(4);
        let gradientGreen = this.gradientFilter(5);

        let gradient =
            city.status === 'red'? "url(#inner0)"
            : city.status === 'orange'?  "url(#inner1)"
            : (config && config .pageId === 'cloudlet') ? "url(#inner2)"
            : (config && config .pageId === 'cluster') ? "url(#inner3)"
            : (config && config .pageId === 'app') ? "url(#inner4)"
            : "url(#inner5)";

        let pathCloudlet = `<path filter=${gradient} d="M 19.35 10.04 C 18.67 6.59 15.64 4 12 4 C 9.11 4 6.6 5.64 5.35 8.04 C 2.34 8.36 0 10.91 0 14 c 0 3.31 2.69 6 6 6 h 13 c 2.76 0 5 -2.24 5 -5 c 0 -2.64 -2.05 -4.78 -4.65 -4.96 Z"></path>`
        let pathCluster = `<path filter=${gradient} d="M 10 4 H 4 c -1.1 0 -1.99 0.9 -1.99 2 L 2 18 c 0 1.1 0.9 2 2 2 h 16 c 1.1 0 2 -0.9 2 -2 V 8 c 0 -1.1 -0.9 -2 -2 -2 h -8 l -2 -2 Z"></path>`
        let pathApp = `<path filter=${gradient} d="M 12 2 C 8.13 2 5 5.13 5 9 c 0 5.25 7 13 7 13 s 7 -7.75 7 -13 c 0 -3.87 -3.13 -7 -7 -7 Z"></path>`
        let circle = `<circle filter=${gradient} cx="12" cy="12" r="12"></circle>`

        let path =
            (config && config.pageId === 'app') ? pathApp
            : (config && config.pageId === 'cluster') ?  pathCluster
            : (config && config.pageId === 'cloudlet') ? pathCloudlet
            : circle;

        let svgImage = `<svg viewBox="0 0 24 24"><g fill="#0a0a0a" stroke="#fff" stroke-width="0"> ${gradientRed} ${gradientOrange} ${gradientBlue} ${gradientGold} ${gradientPink} ${gradientGreen} ${path} </g><p style="position:absolute; top: 0; width: 28px; line-height: 28px; text-align: center;">${cost}</p></svg>`

         return (
            L.divIcon({
                    html: `<div style="width:28px; height:28px">${svgImage}</div>`,
                    iconSize: [28, 28],
                    iconAnchor: [14, 14],
                    className: 'map-marker'
                }
            ))
    }


    MarkerMap = (self, city, i, config) => {

        return (
            (!isNaN(city.coordinates[0])) ?
                <Marker
                    position={city.coordinates}
                    icon={this.iconMarker(city, config)}
                    onClick={() => this.handleCityClick(city)}
                >
                    {city.name &&
                    <Tooltip
                        direction={'top'}
                        className={'map-tooltip'}
                    >
                        {city.name.map(one => {
                            return (
                                <div>{one}</div>
                            )
                        })}
                    </Tooltip>
                    }
                </Marker>
                : null
        )
    }

    render() {

        return (
            <div className="commom-listView-map">


                <div className="zoom-inout-reset-clusterMap" style={{ left: 10, top: 79, position: 'absolute', zIndex:1000 }}>
                    <Button id="mapZoomCtl" size='small' icon onClick={() => this.handleRefresh()}>
                        <Icon name='redo' />
                    </Button>
                </div>
                {this.state.detailMode &&
                    <div className="zoom-inout-reset-clusterMap" style={{ left: 10, top: 117, position: 'absolute', zIndex:1000 }}>
                        <Button id="mapZoomCtl" size='large' icon onClick={() => this.handleReset()}>
                            <Icon name='compress' />
                        </Button>
                    </div>
                }

                <ContainerDimensions>
                    {({ width, height }) =>
                        <Motion
                            defaultStyle={{
                                zoom: 1,
                                x: 30,
                                y: 40,
                            }}
                            style={{
                                zoom: spring(this.state.zoom, { stiffness: 210, damping: 30 }),
                                x: spring(this.state.center[0], { stiffness: 210, damping: 30 }),
                                y: spring(this.state.center[1], { stiffness: 210, damping: 30 }),
                            }}
                        >
                            {({ zoom, x, y }) => (
                                <Map
                                    //ref={null}
                                    center={this.state.mapCenter}
                                    zoom={zoom}
                                    duration={1.2}
                                    style={{width: '100%', height: '100%'}}
                                    easeLinearity={1}
                                    useFlyTo={true}
                                    dragging={true}
                                    zoomControl={true}
                                    boundsOptions={{padding: [50, 50]}}
                                    scrollWheelZoom={true}
                                    viewport={this.state.mapCenter}
                                >
                                    <TileLayer
                                        url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
                                        minZoom={3}
                                    />
                                    {(this.props.id === "Cloudlets" && !this.state.detailMode) ?
                                        this.state.cities.map((city, i) => (
                                            this.MarkerMap(this, city, i, { pageId: 'cloudlet'})
                                        ))
                                        : (this.props.id === "ClusterInst" && !this.state.detailMode) ?
                                            this.state.cities.map((city, i) => (
                                                (this.props.icon === 'cloudlet') ?
                                                    this.MarkerMap(this, city, i, { pageId: 'cloudlet' })
                                                    : this.MarkerMap(this, city, i, { pageId: 'cluster' })
                                            ))
                                            :
                                            (this.props.id == "AppInsts" && !this.state.detailMode) ?
                                                this.state.cities.map((city, i) => (
                                                    this.MarkerMap(this, city, i, { pageId: 'app' })
                                                ))
                                                :
                                                this.state.cities.map((city, i) => {

                                                    const initMarker = ref => {
                                                        if (ref) {
                                                            ref.leafletElement.openPopup();
                                                            ref.leafletElement.off('click', this.openPopup);
                                                        }
                                                    }

                                                    const assignPopupProperties = popup => {

                                                        if (popup) {
                                                            popup.leafletElement.options.autoClose = false;
                                                            popup.leafletElement.options.closeOnClick = false;
                                                        }
                                                    }


                                                    return (
                                                    <Marker
                                                        ref={initMarker}
                                                        position={city.coordinates}
                                                        icon={this.iconMarker(city)}
                                                    >
                                                        {city.name &&
                                                        <Popup
                                                            ref={popupEl => assignPopupProperties(popupEl)}
                                                            className={'map-popup'}
                                                        >
                                                            {city.name.map(one => {

                                                                let key = city.statusList.findIndex(i => i.name === one)
                                                                let oneStatus = city.statusList[key].status

                                                                return (
                                                                    <div
                                                                        className='map-marker-list'
                                                                        // onClick={()=> }
                                                                    >
                                                                        {this.props.id === "Cloudlets" &&
                                                                        <div
                                                                            style={{backgroundColor:oneStatus === 'red'? grdColors[0] : grdColors[5]}}
                                                                            className='map-status-mark'
                                                                        />
                                                                        }
                                                                        {one}

                                                                    </div>
                                                                )
                                                            })}
                                                        </Popup>
                                                        }
                                                    </Marker>
                                                )})
                                    }
                                </Map>

                            )}

                        </Motion>
                    }
                </ContainerDimensions>

            </div>
        )
    }
}


const mapStateToProps = (state, ownProps) => {
    let deleteReset = state.deleteReset.reset;
    return {
        data: state.receiveDataReduce.data,
        itemLabel: state.computeItem.item,
        deleteReset,
    };
};
const mapDispatchProps = (dispatch) => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchProps)(ClustersMap);

