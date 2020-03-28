
import React, { Component } from "react"
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
    Markers,
    Marker, Annotations, Annotation
} from "react-simple-maps"
import { Button, Icon, List } from 'semantic-ui-react';
import ContainerDimensions from 'react-container-dimensions';
import _ from "lodash";
import { Motion, spring } from "react-motion"
import * as d3 from 'd3';
import { scaleLinear } from "d3-scale"
import request from "axios"
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

const grdColors = ['#000000', '#00CC44', '#88ff00', '#FFEE00', '#FF7700', '#FF0022',
    '#66CCFF', '#FF78A5', '#fffba7']
const zoomControls = { center: [30, 40], zoom: 3 }

const cityScale = scaleLinear()
    .domain([0, 37843000])
    .range([1, 48])
const markerSize = [20, 24]

let _self = null;
const makeList = (obj) => (
    <List>
        {obj.map((key, i) => (
            <List.Item key={i}>

                {key}

            </List.Item>
        ))
        }
    </List>

)
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
            //blink
            keyName: ''
            //-blink
        }
        this.handleZoomIn = this.handleZoomIn.bind(this)
        this.handleZoomOut = this.handleZoomOut.bind(this)
        this.handleCityClick = this.handleCityClick.bind(this)
        this.handleReset = this.handleReset.bind(this)
        this.fetchCities = this.fetchCities.bind(this)
        this.handleLeave = this.handleLeave.bind(this)
        this.dir = 1;
        this.interval = null;
        this.tempData = null;
        this.tempLocation = null;
    }
    handleZoomIn() {
        this.setState({
            zoom: this.state.zoom * 2
        })
    }
    handleZoomOut() {
        this.setState({
            zoom: this.state.zoom / 2
        })
    }
    handleReset() {
        this.setState({
            center: zoomControls.center,
            zoom: 3,
            detailMode: false
        })
    }

    // Todo: Need to reimplement
    handleCityClick(city) {
        this.setState({
            zoom: 4,
            center: city.coordinates,
            detailMode: true
        })

        if (d3.selectAll('.rsm-markers').selectAll(".levelFive")) {
            d3.selectAll('.rsm-markers').selectAll(".levelFive")
                .transition()
                .ease(d3.easeBack)
                .attr("r", markerSize[0])
        }
        let clickMarker = [];
        if (city) {
            city.name.map((item, i) => {
                clickMarker.push({ "name": item, "coordinates": city.coordinates, "population": 17843000, "cost": 1 })
            })
        }
        this.setState({
            clickCities: clickMarker,
            saveMarker: clickMarker
        })
    }

    // map marker text click
    handleAnnoteClick(city) {
    }

    /**************
     * 지도 줌인 상태에서 지역을 마커를 클릭하면,  우측 패널의 지표값 변경
     * @param country
     */
    handleViewZone(country) {
        //change the data of detail Info
        _self.setState({ selectedCity: country.name })
        if (d3.selectAll('.detailMarker_' + _self.state.oldCountry)) {
            d3.selectAll('.detailMarker_' + _self.state.oldCountry)
                .transition()
                .attr("r", markerSize[0])
                .style("opacity", 1)
        }
        _self.setState({ oldCountry: country.name })
    }

    /** ************************************************
     * fetchCities
     * display marker and alarm-counter on the worldmap
     * 지도위에 마커포시하고 숫자표현
     ** ************************************************/
    fetchCities() {
        request
            .get("/data-maps/world-most-populous-cities.json")
            .then(res => {
                this.setState({
                    cities: res.data,
                })
            })
    }
    fetchCountry() {
        request
            .get("/data-maps/country-capitals.json")
            .then(res => {
                this.setState({
                    countries: res.data
                })
                let _self = this;
                setTimeout(_self.fetchMWCZone(), 1000)
            })
    }
    fetchConnectivity() {
        let indents = [0, 0]
        let _countries = [{ name: 'Berlin' }, { name: 'Paris' }, { name: 'Kyiv' }, { name: 'Vienna' }, { name: 'Budapest' }]
        let _Country = []
        _countries.map((data, i) => {
            _self.state.countries.map((cnt) => {
                if (data.name === cnt.CapitalName) {
                    _Country.push({ name: cnt.CapitalName, coordinates: [parseInt(cnt.CapitalLongitude) + indents[0], parseInt(cnt.CapitalLatitude) + indents[1]] })
                }
            })

        })

        this.setState({
            citiesSecond: _Country
        })
    }
    fetchMWCZone() {
        //Longitude, Latitude
        let _Country = []
        let _countries = [
            { "name": "Barcelona", "coordinates": [2.1734, 41.3851], "population": 1, "cost": 1, "offsets": [10, 15] },
            // { "name": "Sant Montjuic", "coordinates": [0.170459, 41.018247], "population": 1, "cost":1, "offsets": [-10,15] },
            // { "name": "Sant Gervasi", "coordinates": [1.005055, 42.493365], "population": 1, "cost":1, "offsets": [10,-15] },
            { "name": "frankfurt", "coordinates": [8.6821, 50.1109], "population": 1, "cost": 1, "offsets": [0, 15] },
            { "name": "hamburg", "coordinates": [9.9937, 53.5511], "population": 1, "cost": 1, "offsets": [0, 15] },
        ]

        this.setState({
            citiesSecond: _countries
        })
    }

    //마커의 깜박거림 크기
    blinkAnimationMarker(id, dir) {
        let radius = 0;
        let alpha = 1;
        let durate = 900;
        if (dir === 1) {
            radius = 32;
            alpha = 0;
            durate = 900;
        } else {
            radius = 16;
            alpha = 1;
            durate = 300;
        }
        if (d3.selectAll('.' + id).selectAll(".levelFive")) {
            d3.selectAll('.' + id).selectAll(".levelFive")
                .transition()
                .duration(durate)
                .ease(d3.easeBack)
                .attr("r", radius)
                .style("opacity", alpha)
        }

        // if(d3.selectAll('.'+id).selectAll(".toronto-cloudlet")) {
        //     d3.selectAll('.'+id).selectAll(".toronto-cloudlet")
        //         .transition()
        //         .duration(durate)
        //         .ease(d3.easeBack)
        //         .attr("r", radius)
        //         .style("opacity",alpha)
        // }

        //blink
        if (d3.selectAll('.' + id).selectAll((this.state.keyName !== '') ? '.' + this.state.keyName : null)) {
            d3.selectAll('.' + id).selectAll((this.state.keyName !== '') ? '.' + this.state.keyName : null)
                .transition()
                .duration(durate)
                .ease(d3.easeBack)
                .attr("r", radius)
                .style("opacity", alpha)
        }
        //-blink

        if (d3.selectAll('.detailMarker_' + _self.state.selectedCity)) {
            d3.selectAll('.detailMarker_' + _self.state.selectedCity)
                .transition()
                .duration(durate)
                .ease(d3.easeBack)
                .attr("r", (dir === 1) ? markerSize[0] : markerSize[1])
                .style("opacity", alpha)
        }

    }

    //tooltip
    handleLeave = () => {
        //this.props.dispatch(hide())
        ReactTooltip.hide(this.tooltipref)
    }
    handleMoveMk = (marker, evt) => {

        const x = evt.clientX
        const y = evt.clientY + window.pageYOffset
        let names = [];
        if (marker.name.length) {
            names = makeList(marker.name)
        }

        _self.setState({ tooltipMsg: (typeof names === 'object') ? names : marker.name })
        if (!_self.moveMouse) {
            ReactTooltip.rebuild()
            ReactTooltip.show(_self.circle)
        }

        _self.moveMouse = true;
    }
    handleLeaveMk = () => {
        //this.props.dispatch(hide())
        ReactTooltip.hide(this.tooltipref)
        this.moveMouse = false;
    }
    handleMouseDown = (a, b) => {
        let countries = CountryCode.ref_country_codes;
        let _lat = '';
        let _long = '';
        countries.map((country) => {
            if (country.alpha2 === a.properties["ISO_A2"]) {
                _lat = country['latitude'];
                _long = country['longitude'];
            }
        })

        if (this.props.id == 'Cloudlets') {
            let location = { region: a.properties["REGION_UN"], name: a.properties["NAME"], lat: _lat, long: _long, State: 5 }

            let locationData = [
                {
                    "name": a.properties["NAME"],
                    "coordinates": [_long, _lat],
                    "population": 17843000,
                    "cost": 3
                }]
            if(this.props.onMapClick)
            {
                this.props.onMapClick(location)
            }
            _self.setState({ cities: locationData, detailMode: false })
            _self.forceUpdate();
        }
    }

    componentDidMount() {
        if (this.props.zoomControl) {
            this.setState({ center: this.props.zoomControl.center, zoom: this.props.zoomControl.zoom })
        }

        let _self = this;
        this.interval = setInterval(function () {
            if (_self.dir === 1) {
                _self.dir = -1
            } else {
                _self.dir = 1;
            }
            _self.blinkAnimationMarker('rsm-markers', _self.dir)
        }, 900)

        if (_self.props.tabIdx === 'pg=1') {
            _self.handleCityClick({ "name": this.state.selectedCity, "coordinates": [2.1734, 41.3851], "population": 37843000, "cost": 3 });
        }
        _self.setState({ oldCountry: this.state.selectedCity })
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        let initialData = (nextProps.dataList) ? nextProps.dataList : nextProps.locData;
        let data = nextProps.locData ? initialData : initialData.filter((item) => item[fields.state] == 5);

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
            locationData.push({ "name": cloundletName(key), "coordinates": [groupbyData[key][0]['LON'], groupbyData[key][0]['LAT']], "population": 17843000, "cost": groupbyData[key].length })
        })
        //
        let cloudlet = data.map((item) => (
            { LAT: item[fields.cloudletLocation].latitude, LON: item[fields.cloudletLocation].longitude, cloudlet: item[fields.cloudletName] }
        ))


        let cloudletData = [];

        let groupbyClData = aggregation.groupBy(cloudlet, 'cloudlet');

        Object.keys(groupbyClData).map((key) => {
            cloudletData.push({ "name": key, "coordinates": [groupbyClData[key][0]['LON'], groupbyClData[key][0]['LAT']], "population": 17843000, "cost": groupbyClData[key].length })
        })
        if (!_.isEqual(locationData, prevState.cities)) {
            return { cities: locationData, center: nextProps.locData ? prevState.center : zoomControls.center,zoom: nextProps.locData ? prevState.zoom : 3};
        }
        return null;
    }


    componentWillUnmount() {
        clearInterval(this.interval)
    }

    render() {
        return (
            <div>
                {this.state.detailMode ?
                    <div className="zoom-inout-reset-clusterMap" style={{ left: 8, bottom: 4, position: 'absolute', display: 'block' }}>
                        <Button id="mapZoomCtl" size='large' icon onClick={this.handleReset}>
                            <Icon name='compress' />
                        </Button>
                    </div>
                    :
                    <div className="zoom-inout-reset-clusterMap" style={{ left: 8, bottom: 4, position: 'absolute', display: 'block' }}>
                        <Button id="mapZoomCtl" size='large' icon onClick={this.handleReset}>
                            <Icon name='expand' />
                        </Button>

                        <Button id="mapZoomCtl" size='large' icon onClick={this.handleZoomIn}>
                            <Icon name="plus square outline" />
                        </Button>
                        <Button id="mapZoomCtl" size='large' icon onClick={this.handleZoomOut}>
                            <Icon name="minus square outline" />
                        </Button>
                    </div>
                }

                <RadialGradientSVG startColor={grdColors[0]} middleColor={grdColors[5]} endColor={grdColors[5]} idCSS="levelFive" rotation={0} />
                <RadialGradientSVG startColor={grdColors[0]} middleColor={grdColors[4]} endColor={grdColors[4]} idCSS="levelFour" rotation={0} />
                <RadialGradientSVG startColor={grdColors[0]} middleColor={grdColors[3]} endColor={grdColors[3]} idCSS="levelThree" rotation={0} />
                <RadialGradientSVG startColor={grdColors[0]} middleColor={grdColors[2]} endColor={grdColors[2]} idCSS="levelTwo" rotation={0} />
                {/*<RadialGradientSVG startColor={grdColors[0]} middleColor={grdColors[6]} endColor={grdColors[6]} idCSS="levelSkyblue" rotation={0}/>*/}
                {/*<RadialGradientSVG startColor={grdColors[0]} middleColor={grdColors[7]} endColor={grdColors[7]} idCSS="levelPuurple" rotation={0}/>*/}
                {/*<RadialGradientSVG startColor={grdColors[0]} middleColor={grdColors[8]} endColor={grdColors[8]} idCSS="levelGold" rotation={0}/>*/}
                <RadialGradientSVG startColor={'#394251'} middleColor={'#394251'} endColor={'#394251'} idCSS="levelBg" rotation={0} />
                <ReactTooltip id='happyFace' className='customToolTip' type='dark' effect='float' style={{ left: '-100px' }}>
                    <span>{this.state.tooltipMsg}</span>
                </ReactTooltip>
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
                                <ComposableMap
                                    projectionConfig={{ scale: 205 }}
                                    width={980}
                                    height={551}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: styles.geoBackground.color
                                    }}
                                >
                                    <ZoomableGroup center={[x, y]} zoom={zoom} disablePanning={false}>
                                        <Geographies geography="/topojson-maps/world-110m.json">
                                            {(geographies, projection) =>
                                                geographies.map((geography, i) => geography.id !== "010" && (
                                                    <Geography
                                                        key={i}
                                                        geography={geography}
                                                        projection={projection}
                                                        data-tip={geography.properties.NAME}
                                                        style={styles.geography}
                                                        onMouseDown={this.handleMouseDown}
                                                        onMouseMove={this.handleMove}
                                                        onMouseLeave={this.handleLeave}
                                                    />
                                                ))}
                                        </Geographies>
                                        <Markers>
                                            {(this.props.id === "Cloudlets" && !this.state.detailMode) ?
                                                this.state.cities.map((city, i) => (
                                                    MarkerComponent(this, city, i, { transform: "translate(-24,-18)", gColor: 6, cName: 'st1', path: 0 })
                                                ))
                                                : (this.props.id === "ClusterInst" && !this.state.detailMode) ?
                                                    this.state.cities.map((city, i) => (
                                                        (this.props.icon === 'cloudlet') ?
                                                            MarkerComponent(this, city, i, { transform: "translate(-24,-18)", gColor: 6, cName: 'st1', path: 0 })
                                                            : MarkerComponent(this, city, i, { transform: "translate(-25,-27)", gColor: 8, cName: 'st2', path: 1 })
                                                    ))
                                                    :
                                                    (this.props.id == "AppInsts" && !this.state.detailMode) ?
                                                        this.state.cities.map((city, i) => (
                                                            MarkerComponent(this, city, i, { transform: "translate(-17,-21)", gColor: 7, cName: 'st3', path: 2 })
                                                        ))
                                                        :
                                                        this.state.clickCities.map((city, i) => (
                                                            <Marker
                                                                key={i}
                                                                marker={city}
                                                                onClick={this.handleViewZone}
                                                            >
                                                                <circle
                                                                    className={"detailMarker_" + city.name}
                                                                    cx={0}
                                                                    cy={0}
                                                                    r={markerSize[0]}
                                                                    opacity={1}
                                                                    fill={styles.marker.second.fill}
                                                                    stroke={styles.marker.second.stroke}
                                                                    strokeWidth={styles.marker.second.strokeWidth}
                                                                />
                                                            </Marker>
                                                        ))
                                            }
                                        </Markers>
                                        <Annotations>
                                            {
                                                this.state.detailMode ?

                                                    this.state.clickCities.map((city, i) => (
                                                        <Annotation
                                                            key={i}
                                                            dx={-30} dy={30 + (i * 45)}
                                                            curve={0.5}
                                                            zoom={1}
                                                            subject={city['coordinates']}
                                                            strokeWidth={0.1}
                                                            stroke={'#AFAFAF'}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            <text className='annoteText'
                                                                fill='#AFAFAF' style={{ fontSize: 7 }}
                                                                onClick={(a, b) => this.handleAnnoteClick(city)}
                                                            >
                                                                {city.name}

                                                            </text>
                                                        </Annotation>
                                                    ))
                                                    : null
                                            }
                                        </Annotations>
                                    </ZoomableGroup>
                                </ComposableMap>
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
        tabIdx: state.siteChanger.site.subPath,
        itemLabel: state.computeItem.item,
        deleteReset,
    };
};
const mapDispatchProps = (dispatch) => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchProps)(ClustersMap);


const paths = [
    'M 38.875 12.960938 C 37.613281 6.019531 31.59375 0.75 24.351562 0.75 C 18.582031 0.75 13.59375 4.089844 11.160156 8.949219 C 5.210938 9.640625 0.59375 14.738281 0.59375 20.929688 C 0.59375 27.554688 5.875 32.921875 12.414062 32.992188 L 38.183594 32.992188 C 43.664062 32.992188 48.113281 28.496094 48.113281 22.957031 C 48.113281 17.667969 44.035156 13.328125 38.875 12.960938 Z M 38.875 12.960938',
    'M 20.832031 8.332031 L 8.332031 8.332031 C 6.042969 8.332031 4.1875 10.207031 4.1875 12.5 L 4.167969 37.5 C 4.167969 39.792969 6.042969 41.667969 8.332031 41.667969 L 41.667969 41.667969 C 43.957031 41.667969 45.832031 39.792969 45.832031 37.5 L 45.832031 16.667969 C 45.832031 14.375 43.957031 12.5 41.667969 12.5 L 25 12.5 Z M 20.832031 8.332031',
    'M 34.945312 17.558594 C 34.945312 27.097656 17.539062 49.683594 17.539062 49.683594 C 17.539062 49.683594 0.132812 27.097656 0.132812 17.558594 C 0.132812 8.019531 7.921875 0.289062 17.539062 0.289062 C 27.152344 0.289062 34.945312 8.019531 34.945312 17.558594 Z M 34.945312 17.558594'
]
const MarkerComponent = (self, city, i, config) => (
    (!isNaN(city.coordinates[0])) ?
        <Marker className="markerTwo" key={i} marker={city}
            onClick={self.handleCityClick}
            onMouseOver={self.handleMoveMk}
            onMouseMove={self.handleMoveMk}
            onMouseLeave={self.handleLeaveMk}
            style={{}}

        >

            <g

                version="1.1" id="Layer_1" x="0px" y="0px"
                viewBox="0 0 50 50" style={{ enableBackground: "new 0 0 50 50" }}
                //blink
                className={[('blinkMark' + i == self.state.keyName) ? self.state.keyName : null, (city.population > 35000000) ? 'levelFive' : 'levelOther'].join(' ')}
                //-blink
                cx={0}
                cy={0}
                r={cityScale(city.population - 200300)}
                fill={
                    'url(#levelBg)'
                    // '#394251'
                }
                stroke={styles.marker.stroke}
                strokeWidth={styles.marker.strokeWidth}
                transform={config.transform} mix-blend-mode="lighten"

            >
                {/* 필터 InnerGlow */}
                <defs>
                    <filter id="InnerGlow" colorInterpolationFilters="sRGB">
                        <feGaussianBlur id="GaussianBlur" result="GaussianBlurResult" stdDeviation="8">
                        </feGaussianBlur>
                        <feComposite id="Composite1" in2="GaussianBlurResult" result="CompositeResult1" in="SourceGraphic" operator="in" />

                        <feFlood id="Flood" result="FloodResult" in="CompositeResult3" floodOpacity="1" floodColor={
                            (city.population > 35000000) ? grdColors[5] :
                                (city.population <= 35000000 && city.population > 30000000) ? grdColors[4] :
                                    (city.population <= 30000000 && city.population > 25000000) ? grdColors[3] :
                                        (city.population <= 25000000 && city.population > 20000000) ? grdColors[2] :
                                            grdColors[6]} />
                        <feBlend id="Blend" in2="FloodResult" mode="normal" in="CompositeResult1" result="BlendResult1" />
                        <feComposite id="GaussianBlur" in2="SourceGraphic" result="CompositeResult3" operator="in" in="BlendResult1" />
                    </filter>
                </defs>
                {/* 필터 innershadow */}
                <defs>
                    <filter id="innershadow" x0="-50%" y0="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"></feGaussianBlur>
                        <feOffset dy="2" dx="3"></feOffset>
                        <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff"></feComposite>

                        <feFlood floodColor={
                            (city.population > 35000000) ? grdColors[5] :
                                (city.population <= 35000000 && city.population > 30000000) ? grdColors[4] :
                                    (city.population <= 30000000 && city.population > 25000000) ? grdColors[3] :
                                        (city.population <= 25000000 && city.population > 20000000) ? grdColors[2] :
                                            grdColors[config.gColor]}
                            floodOpacity="1"></feFlood>
                        <feComposite in2="shadowDiff" operator="in"></feComposite>
                        <feComposite in2="SourceGraphic" operator="over" result="firstfilter"></feComposite>


                        <feGaussianBlur in="firstfilter" stdDeviation="3" result="blur2"></feGaussianBlur>
                        <feOffset dy="-2" dx="-3"></feOffset>
                        <feComposite in2="firstfilter" operator="arithmetic" k2="-1" k3="1" result="shadowDiff"></feComposite>

                        <feFlood floodColor={
                            (city.population > 35000000) ? grdColors[5] :
                                (city.population <= 35000000 && city.population > 30000000) ? grdColors[4] :
                                    (city.population <= 30000000 && city.population > 25000000) ? grdColors[3] :
                                        (city.population <= 25000000 && city.population > 20000000) ? grdColors[2] :
                                            grdColors[config.gColor]}
                            floodOpacity="1"></feFlood>
                        <feComposite in2="shadowDiff" operator="in"></feComposite>
                        <feComposite in2="firstfilter" operator="over"></feComposite>
                    </filter>
                </defs>
                <path filter="url(#innershadow)" className={config.cName} d={paths[config.path]} ref={ref => self.circle = ref}>
                </path>
            </g>
            <g data-tip='tooltip' data-for='happyFace'>
                <text textAnchor="middle" y={8} className="marker_value"
                    style={{ fontSize: 24 }}>
                    {city.cost}
                </text>
            </g>
        </Marker> : null
)
