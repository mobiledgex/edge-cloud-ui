import React, { Component } from "react"
import { Map, Popup, Tooltip, TileLayer, Marker } from "react-leaflet";
import { Button, Icon } from 'semantic-ui-react';
import isEqual from 'lodash/isEqual';
import * as d3 from 'd3';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import L from 'leaflet';
//redux
import { connect } from 'react-redux';
import * as aggregation from '../../utils';
import './styles.css';
import { fields } from '../../services/model/format'
import * as actions from "../../actions";

const grdColors = ["#d32f2f", "#fb8c00", "#66CCFF", "#fffba7", "#FF78A5", "#76FF03", '#EAAE00']
const zoomControls = { center: [53, 13], zoom: 3 }
const markerSize = [20, 24]
let zoom = 1;
let selectedIndex = 0;
let doing = false;
let locDataOld = [];

let mapTileList = [
    {
        url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
        name: 'dark1',
        value: 0,
    },
    {
        url: 'https://cartocdn_{s}.global.ssl.fastly.net/base-midnight/{z}/{x}/{y}.png',
        name: 'dark2',
        value: 1,
    },
    {
        url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png',
        name: 'dark3',
        value: 2,
    },

    {
        url: 'https://cartocdn_{s}.global.ssl.fastly.net/base-flatblue/{z}/{x}/{y}.png',
        name: 'blue',
        value: 3,
    },
    {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        name: 'light2',
        value: 4,
    },
    {
        url: 'https://cartocdn_{s}.global.ssl.fastly.net/base-antique/{z}/{x}/{y}.png',
        name: 'light3',
        value: 5,
    },
    {
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
        name: 'light4',
        value: 6,
    },
]

class ClustersMap extends Component {
    constructor() {
        super()
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
            currentPos: null,
            anchorEl: null,
            selectedIndex: 0,
            capture: true
        }
        this.handleMapClick = this.handleMapClick.bind(this);
        this.dir = 1;
    }

    handleReset = () => {
        this.setState({
            mapCenter: (this.props.region === 'US') ? [41, -74] : [53, 13],
            detailMode: false
        })
        if (this.props.onClick) {
            this.props.onClick()
        }
    }

    handleRefresh = () => {
        this.setState({ mapCenter: this.state.detailMode ? this.state.mapCenter : (this.props.region === 'US') ? [41, -74] : [53, 13] })
    }


    handleCityClick = (city) => {
        if (!this.props.onMapClick) {
            this.setState({
                mapCenter: city.coordinates,
                detailMode: true,
            })
            if (this.props.onClick) {
                this.props.onClick(city)
            }
        }
    }

    componentDidMount() {
        if (this.props.zoomControl) {
            this.setState({ center: this.props.zoomControl.center, zoom: this.props.zoomControl.zoom })
        }
        if (this.props.locData && this.props.locData.length > 0 ) {
            this.setState({ mapCenter: [this.props.locData[0].cloudletLocation.latitude, this.props.locData[0].cloudletLocation.longitude] })
        }
        this.setState({ oldCountry: this.state.selectedCity })
        let catchLeafLayer = document.getElementsByClassName("leaflet-tile-container");
        if (catchLeafLayer) {
            if (catchLeafLayer.length === 0) {
                this.handleRefresh();
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let createMode = nextProps.onMapClick ? true : false;
        let updateMode = (nextProps.locData && nextProps.locData.length > 0) ? true : false;
        let hasLocation = [];
        let newLocData = null;
        if( updateMode ) {
            createMode = false;
            let long = nextProps.locData[0].longitude;
            let lat = nextProps.locData[0].latitude;
            hasLocation = [lat ? lat : nextProps.locData[0].cloudletLocation.latitude, long ? long : nextProps.locData[0].cloudletLocation.longitude];
        }

        let initialData = (nextProps.dataList) ? nextProps.dataList : nextProps.locData;
        let data = nextProps.locData ? initialData : initialData.filter((item) => item[fields.state] == 5);
        // let mapCenter = (createMode) ? prevState.currentPos : (prevState.detailMode) ? prevState.mapCenter : (nextProps.region === 'US') ? [41, -74] : [53, 13];
        let mapCenter = (!createMode) ? nextProps.mapCenter : (prevState.detailMode) ? prevState.mapCenter : (nextProps.region === 'US') ? [41, -74] : (updateMode) ? hasLocation :[53, 13];

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
                    return ({ LAT: reduceUp(item[fields.cloudletLocation].latitude), LON: reduceUp(item[fields.cloudletLocation].longitude), cloudlet: mapName(item), status: (item[fields.cloudletStatus] === 2) ? 'green' : item[fields.cloudletStatus] === 999 ? 'yellow' : 'red' })
                }
                return ({ LAT: reduceUp(item[fields.cloudletLocation].latitude), LON: reduceUp(item[fields.cloudletLocation].longitude), cloudlet: mapName(item), status: 'green' })
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

                nameArray[i] = { name: item['cloudlet'], status: item.status };
            })
            return nameArray;
        }


        const statusColor = (key) => {

            let status = '';
            let online = false;
            let offline = false;
            let maintainance = false;

            groupbyData[key].map((item, i) => {
                if (item.status === 'yellow') {
                    maintainance = true;
                }
                else if (item.status === 'green') {
                    online = true;
                } else if (item.status === 'red') {
                    offline = true;
                }
            })

            if(maintainance)
            {
                status = 'yellow'; 
            }
            else if (online && offline) {
                status = 'orange';
            } else if (!online && offline) {
                status = 'red';
            } else if (online && !offline) {
                status = 'green';
            }

            return status;
        }

        Object.keys(groupbyData).map((key) => {
            locationData.push({ "name": cloundletName(key), "coordinates": [groupbyData[key][0]['LAT'], groupbyData[key][0]['LON']], "status": statusColor(key), "statusList": statusList(key), "cost": groupbyData[key].length })
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
           
            let newLocData = (nextProps.locData && locDataOld) ? findNewData(nextProps.locData, locDataOld) : [];
            let findIndex =  (nextProps.locData && newLocData.length > 0) ? nextProps.locData.findIndex( item => item === newLocData[0]) : 0;
            if (findIndex < 0) findIndex = 0;
            let centerLength = nextProps.locData ? nextProps.locData.length : 0;
            let center = nextProps.locData ? [nextProps.locData[findIndex].cloudletLocation.latitude, nextProps.locData[findIndex].cloudletLocation.longitude] : zoomControls.center

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

                zoom = 5
                center = nextProps.mapDetails.coordinates
                mapCenter = nextProps.mapDetails.coordinates
            }
            locDataOld = nextProps.locData;
            return { mapCenter: mapCenter ? mapCenter : center, cities: locationData, center: center, zoom: zoom, detailMode: nextProps.mapDetails ? true : false };
        }
        return null;
    }

    gradientFilter(key) {
        return `<defs><filter id="inner${key}" x0="-25%" y0="-25%" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"></feGaussianBlur><feOffset dy="2" dx="3"></feOffset><feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff"></feComposite><feFlood flood-color="${grdColors[key]}" flood-opacity="1"></feFlood><feComposite in2="shadowDiff" operator="in"></feComposite><feComposite in2="SourceGraphic" operator="over" result="firstfilter"></feComposite><feGaussianBlur in="firstfilter" stdDeviation="3" result="blur2"></feGaussianBlur><feOffset dy="-2" dx="-3"></feOffset><feComposite in2="firstfilter" operator="arithmetic" k2="-1" k3="1" result="shadowDiff"></feComposite><feFlood flood-color="${grdColors[key]}" flood-opacity="1"></feFlood><feComposite in2="shadowDiff" operator="in"></feComposite><feComposite in2="firstfilter" operator="over"></feComposite></filter></defs>`
    }



    iconMarker = (city, config) => {
        let cost = city.cost ? city.cost : '';
        let colorKey = city.status === 'red' ? 0
            : city.status === 'orange' ? 1
                : city.status === 'yellow' ? 6
                    : (config && config.pageId === 'cloudlet') ? 5
                        : (config && config.pageId === 'cluster') ? 3
                            : (config && config.pageId === 'app') ? 4
                                : 5;

        let gradient = this.gradientFilter(colorKey);

        let pathCloudlet = `<path filter="url(#inner${colorKey})" d="M 19.35 10.04 C 18.67 6.59 15.64 4 12 4 C 9.11 4 6.6 5.64 5.35 8.04 C 2.34 8.36 0 10.91 0 14 c 0 3.31 2.69 6 6 6 h 13 c 2.76 0 5 -2.24 5 -5 c 0 -2.64 -2.05 -4.78 -4.65 -4.96 Z"></path>`
        let pathCluster = `<path filter="url(#inner${colorKey})" d="M 10 4 H 4 c -1.1 0 -1.99 0.9 -1.99 2 L 2 18 c 0 1.1 0.9 2 2 2 h 16 c 1.1 0 2 -0.9 2 -2 V 8 c 0 -1.1 -0.9 -2 -2 -2 h -8 l -2 -2 Z"></path>`
        let pathApp = `<path filter="url(#inner${colorKey})" d="M 12 2 C 8.13 2 5 5.13 5 9 c 0 5.25 7 13 7 13 s 7 -7.75 7 -13 c 0 -3.87 -3.13 -7 -7 -7 Z"></path>`
        let circle = `<circle filter="url(#inner${colorKey})" cx="12" cy="12" r="12"></circle>`

        let path =
            (config && config.pageId === 'app') ? pathApp
                : (config && config.pageId === 'cluster') ? pathCluster
                    : (config && config.pageId === 'cloudlet') ? pathCloudlet
                        : circle;

        let bgColor = (mapTileList[selectedIndex].name.indexOf('light') > -1) ? "rgba(10,10,10,.7)" : "rgba(10,10,10,.5)"

        let svgImage = `<svg viewBox="0 0 24 24"><g fill=${bgColor} stroke="#fff" stroke-width="0"> ${gradient} ${path} </g><p style="position:absolute; top: 0; width: 28px; line-height: 28px; text-align: center;">${cost}</p></svg>`

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
                    key={i}
                    position={city.coordinates}
                    icon={this.iconMarker(city, config)}
                    onClick={() => this.handleCityClick(city)}
                >
                    {city.name && !this.props.onMapClick &&
                        <Tooltip
                            direction={'top'}
                            className={'map-tooltip'}
                        >
                            {city.name.map((one, index) => {
                                return (
                                    <div key={index}>{one}</div>
                                )
                            })}
                        </Tooltip>
                    }
                </Marker>
                : null
        )
    }

    handleMapClick(e) {
        if (this.props.onMapClick && this.state.capture) {
            let _lat = Math.round(e.latlng['lat'])
            let _lng = Math.round(e.latlng['lng'])

            // this.setState({ currentPos: [_lat, _lng], mapCenter: [_lat, _lng] });
            this.setState({ currentPos: [_lat, _lng] });

            let location = { lat: _lat, long: _lng }
            let locationData = [
                {
                    "name": '',
                    "coordinates": [_lat, _lng],
                    "cost": 3
                }]

            this.props.onMapClick(location)

            this.setState({ cities: locationData })
        }
    }

    handleThemeClick = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleThemeClose = () => {
        this.setState({ anchorEl: null });
    };

    handleThemeChange = (event, index) => {
        selectedIndex = index;
        this.props.setMapTyleLayer(mapTileList[index].url);
        this.setState({ anchorEl: null });
    }

    handleMove = (event) => {
        if(this.state.detailMode && !doing) {
            event.target.flyTo(this.state.center)
            setTimeout(() => {
                doing = false;
            }, 1800);
            doing = true;
        }
        
    }

    attachControll = () => {
        return (
            <div className="leaflet-top leaflet-left" style={{ top: 79, position: 'absolute' }}>
                <div className="zoom-inout-reset-clusterMap leaflet-control" style={{ left: 0, top: 0, position: 'absolute' }}>
                    <Button id="mapZoomCtl" size='small' icon 
                    onMouseOver={() => this.setState({capture: false})}
                    onMouseLeave={() => this.setState({capture: true})}
                    onClick={() => this.handleRefresh()}>
                        <Icon name='redo' />
                    </Button>
                </div>
                {this.state.detailMode &&
                    <div className="zoom-inout-reset-clusterMap leaflet-control" style={{ left: 0, top: 35, position: 'absolute' }}>
                        <Button id="mapZoomCtl" size='large' icon onClick={() => this.handleReset()}>
                            <Icon name='compress' />
                        </Button>
                    </div>
                }
            </div>
        )
    }

    render() {
        const { zoom } = this.state;
        return (
            <div className="commom-listView-map">
                <Map
                    ref={this.map}
                    useFlyTo={false}
                    center={this.state.mapCenter}
                    zoom={zoom}
                    duration={1.2}
                    // style={{ width: '100%', height: '100%' }}
                    easeLinearity={2}
                    dragging={true}
                    zoomControl={true}
                    boundsOptions={{ padding: [50, 50] }}
                    scrollWheelZoom={true}
                    // viewport={{center: this.state.mapCenter, zoom:zoom}}
                    onClick={this.handleMapClick}
                    onZoomend={this.handleMove.bind(this)}
                >
                    <TileLayer
                        url={this.props.currentTyleLayer}
                        minZoom={3}
                    />
                    {this.attachControll()}
                    <div style={{ position: 'absolute', bottom: 5, right: 5 }}>
                        <Button className='map_theme_button leaflet-control' aria-controls="map_theme" aria-haspopup="true" onClick={this.handleThemeClick}>
                            {mapTileList[selectedIndex].name}
                        </Button>
                        <Menu
                            id="map_theme"
                            anchorEl={this.state.anchorEl}
                            keepMounted
                            open={Boolean(this.state.anchorEl)}
                            onClose={this.handleThemeClose}
                        >
                            {mapTileList.map((item, index) => {
                                return (
                                    <MenuItem
                                        key={index}
                                        selected={index === selectedIndex}
                                        onClick={(event) => this.handleThemeChange(event, index)}
                                    >
                                        {item.name}
                                    </MenuItem>
                                )
                            })}
                        </Menu>

                    </div>
                    {(this.props.id === "Cloudlets" && !this.state.detailMode) ?
                        this.state.cities.map((city, i) => (
                            this.MarkerMap(this, city, i, { pageId: 'cloudlet' })
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
                                            key={i}
                                            ref={initMarker}
                                            position={city.coordinates}
                                            icon={this.iconMarker(city)}>
                                            {city.name &&
                                                <Popup ref={popupEl => assignPopupProperties(popupEl)} className={'map-popup'}>
                                                    {city.name.map((one, j) => {
                                                        let key = city.statusList.findIndex(i => i.name === one)
                                                        let oneStatus = city.statusList[key].status
                                                        return (
                                                            <div key={j} className='map-marker-list'>
                                                                {this.props.id === "Cloudlets" &&
                                                                    <div
                                                                        style={{ backgroundColor: oneStatus === 'red' ? grdColors[0] : grdColors[5] }}
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
                                    )
                                })
                    }
                </Map>
            </div>
        )
    }
}

const findNewData = (newData, oldData) => {
    let filtered = [];
    
    filtered = aggregation.filterDefine(newData, oldData);
  
    return filtered;
}

const mapStateToProps = (state, ownProps) => {
    let deleteReset = state.deleteReset.reset;
    return {
        data: state.receiveDataReduce.data,
        itemLabel: state.computeItem.item,
        currentTyleLayer: state.MapTyleLayerReducer.currentTyleLayer,
        deleteReset,
    };
};
const mapDispatchProps = (dispatch) => {
    return {
        setMapTyleLayer: (data) => {
            dispatch(actions.setMapTyleLayer(data))
        },
    };
};

export default connect(mapStateToProps, mapDispatchProps)(ClustersMap);

