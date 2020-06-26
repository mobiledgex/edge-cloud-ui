
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

const zoomControls = { center: [53, 13], zoom: 3 }

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
            clickCities: [],
            saveMarker: [],
            keyName: '',
            mapCenter: zoomControls.center
        }
        this.dir = 1;
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
        let mapCenter = (nextProps.mapCenter) ? nextProps.mapCenter : [53,13];

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
                return ({ LAT: reduceUp(item[fields.cloudletLocation].latitude), LON: reduceUp(item[fields.cloudletLocation].longitude), cloudlet: mapName(item) })
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

        Object.keys(groupbyData).map((key) => {
            locationData.push({ "name": cloundletName(key), "coordinates": [groupbyData[key][0]['LAT'], groupbyData[key][0]['LON']], "population": 17843000, "cost": groupbyData[key].length })
        })
        //
        let cloudlet = data.map((item) => (
            { LAT: item[fields.cloudletLocation].latitude, LON: item[fields.cloudletLocation].longitude, cloudlet: item[fields.cloudletName] }
        ))


        let cloudletData = [];

        let groupbyClData = aggregation.groupBy(cloudlet, 'cloudlet');

        Object.keys(groupbyClData).map((key) => {
            cloudletData.push({ "name": key, "coordinates": [groupbyClData[key][0]['LAT'], groupbyClData[key][0]['LON']], "population": 17843000, "cost": groupbyClData[key].length })
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
                    clickMarker.push({ "name": item, "coordinates": nextProps.mapDetails.coordinates, "population": 17843000, "cost": 1 })
                })

                zoom = 4
                center = nextProps.mapDetails.coordinates
            }
            return {mapCenter:mapCenter, cities: locationData, center: center, zoom: zoom, detailMode: nextProps.mapDetails ? true : false, clickCities: clickMarker };
        }
        return null;
    }

    render() {

        return (
            <div>
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
                                >
                                    <TileLayer
                                        url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
                                        minZoom={3}
                                    />
                                    {(this.props.id === "Cloudlets" && !this.state.detailMode) ?
                                        this.state.cities.map((city, i) => (
                                            MarkerMap(this, city, i, { transform: "translate(-24,-18)", gColor: 6, cName: 'st1', path: 0 })
                                        ))
                                        : (this.props.id === "ClusterInst" && !this.state.detailMode) ?
                                            this.state.cities.map((city, i) => (
                                                (this.props.icon === 'cloudlet') ?
                                                    MarkerMap(this, city, i, { transform: "translate(-24,-18)", gColor: 6, cName: 'st1', path: 0 })
                                                    : MarkerMap(this, city, i, { transform: "translate(-25,-27)", gColor: 8, cName: 'st2', path: 1 })
                                            ))
                                            :
                                            (this.props.id == "AppInsts" && !this.state.detailMode) ?
                                                this.state.cities.map((city, i) => (
                                                    MarkerMap(this, city, i, { transform: "translate(-17,-21)", gColor: 7, cName: 'st3', path: 2 })
                                                ))
                                                :
                                                this.state.clickCities.map((city, i) => (
                                                    <Marker
                                                        position={city.coordinates}
                                                        icon={iconMarker()}
                                                    >
                                                    </Marker>
                                                ))
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

const iconMarker = (Count) => {

    return (
        L.divIcon({
            html:Count? Count : '',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
        }
    ))
};


const MarkerMap = (self, city, i, config) => {

    let Count = city.name.length;
    console.log("map", city,Count)

    return (
    (!isNaN(city.coordinates[0])) ?
            <Marker
                position={city.coordinates}
                style={{fill:'#fff'}}
                icon={iconMarker(Count)}
            >
                {city.name &&
                    <Tooltip
                        direction={'top'}
                        className={'map_tooltip'}
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
