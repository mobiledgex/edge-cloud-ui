
import React, { Component } from "react"
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
    Markers,
    Marker,
} from "react-simple-maps"
import { Button, Icon } from 'semantic-ui-react';
import ContainerDimensions from 'react-container-dimensions'

import { Motion, spring } from "react-motion"
import * as d3 from 'd3';
import { scaleLinear } from "d3-scale"
import request from "axios"
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';

import RadialGradientSVG from '../../../../src/chartGauge/radialGradientSVG';

import * as aggregation from '../../../utils';

//style
import styles from '../../../css/worldMapStyles';
import './styles.css'

const wrapperStyles = {
    width: "100%",
    height:"100%",
    minWidth: 1600,
    margin: "0 auto",
    overflow:'hidden'
}
const zoomControls = {center:[30, 40], zoom:3}
//reference : /public/assets/data-maps/world-most-populous-cities.json

const cityScale = scaleLinear()
    .domain([0,37843000])
    .range([1,48])
const markerSize = [20, 24]

let _self = null;
class ClustersMap extends Component {
    constructor() {
        super()
        _self = this;
        this.state = {
            center: zoomControls.center,
            zoom: zoomControls.zoom,
            cities:[],
            countries:[],
            citiesSecond:[],
            detailMode:false,
            selectedCity:'Barcelona',
            oldCountry:'',
            unselectCity:''
        }
        this.handleZoomIn = this.handleZoomIn.bind(this)
        this.handleZoomOut = this.handleZoomOut.bind(this)
        this.handleCityClick = this.handleCityClick.bind(this)
        this.handleGotoAnalysis = this.handleGotoAnalysis.bind(this)
        this.handleReset = this.handleReset.bind(this)
        this.fetchCities = this.fetchCities.bind(this)
        this.handleMove = this.handleMove.bind(this)
        this.handleLeave = this.handleLeave.bind(this)
        this.dir = 1;
        this.interval = null;
    }
    handleZoomIn() {
        this.setState({
            zoom: this.state.zoom * 2
        })
        this.props.parentProps.zoomIn(this.state.detailMode)
    }
    handleZoomOut() {
        this.setState({
            zoom: this.state.zoom / 2
        })
        this.props.parentProps.zoomOut(this.state.detailMode)
    }
    handleReset() {
        this.setState({
            center: zoomControls.center,
            zoom: zoomControls.zoom,
            detailMode:false
        })
        this.props.parentProps.resetMap(false)
    }
    /* example:
    {
        "CountryName":"Djibouti",
        "CapitalName":"Djibouti",
        "CapitalLatitude":"11.583333333333334",
        "CapitalLongitude":"43.150000",
        "CountryCode":"DJ",
        "ContinentName":"Africa"
    }
     */

    // 펼쳐진 지도( full screen map)
    handleCityClick(city) {
        this.setState({
            zoom: 4,
            center: city.coordinates,
            detailMode:true
        })
        this.props.parentProps.zoomIn(true)

        if(d3.selectAll('.rsm-markers').selectAll(".levelFive")) {
            d3.selectAll('.rsm-markers').selectAll(".levelFive")
                .transition()
                .ease(d3.easeBack)
                .attr("r", markerSize[0])
        }

        this.props.handleChangeCity(city)


    }
    handleGotoAnalysis(country) {
        if(this.props.parentProps) this.props.parentProps.gotoNext(country);
    }

    /**************
     * 지도 줌인 상태에서 지역을 마커를 클릭하면,  우측 패널의 지표값 변경
     * @param country
     */
    handleViewZone(country) {
        //change the data of detail Info
        console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++', country)
        _self.setState({selectedCity: country.name})
        if(d3.selectAll('.detailMarker_'+_self.state.oldCountry)) {
            d3.selectAll('.detailMarker_'+_self.state.oldCountry)
                .transition()
                .attr("r", markerSize[0])
                .style("opacity",1)
        }
        _self.setState({oldCountry:country.name})

        _self.props.handleChangeCity(country)
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
        let _countries = [{name:'Berlin'},{name:'Paris'},{name:'Kyiv'},{name:'Vienna'},{name:'Budapest'}]
        let _Country = []
        _countries.map((data, i) => {
            _self.state.countries.map((cnt) => {
                if(data.name === cnt.CapitalName) {
                    console.log('_Country --- ' + i, "anem ---- " + data.name, "cnt.CountryName -- " + cnt.CapitalLatitude, cnt.CapitalLongitude)
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
            { "name": "Barcelona", "coordinates": [2.1734, 41.3851], "population": 1, "cost":1, "offsets": [10,15]},
            // { "name": "Sant Montjuic", "coordinates": [0.170459, 41.018247], "population": 1, "cost":1, "offsets": [-10,15] },
            // { "name": "Sant Gervasi", "coordinates": [1.005055, 42.493365], "population": 1, "cost":1, "offsets": [10,-15] },
            { "name": "frankfurt", "coordinates": [8.6821, 50.1109], "population": 1, "cost":1, "offsets": [0,15] },
            { "name": "hamburg", "coordinates": [9.9937, 53.5511], "population": 1, "cost":1, "offsets": [0,15] },
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
        if(dir === 1){
            radius = 32;
            alpha = 0;
            durate = 900;
        } else {
            radius = 16;
            alpha = 1;
            durate = 300;
        }
        if(d3.selectAll('.'+id).selectAll(".levelFive")) {
            d3.selectAll('.'+id).selectAll(".levelFive")
                .transition()
                .duration(durate)
                .ease(d3.easeBack)
                .attr("r", radius)
                .style("opacity",alpha)
        }


        if(d3.selectAll('.detailMarker_'+_self.state.selectedCity)) {
            d3.selectAll('.detailMarker_'+_self.state.selectedCity)
                .transition()
                .duration(durate)
                .ease(d3.easeBack)
                .attr("r", (dir === 1)?markerSize[0]:markerSize[1])
                .style("opacity",alpha)
        }

    }

    //tooltip
    handleMove(geography, evt) {
        const x = evt.clientX
        const y = evt.clientY + window.pageYOffset
        //console.log('tooltip move -- ', x, y, geography.properties.NAME)
        //let tooltipComp = document.getElementsByClassName('tooltipSH')[0];
        // tooltipComp.style.backgroundColor = 'red';
        // tooltipComp.style.position = 'absolute';
        // tooltipComp.style.left = x;
        // tooltipComp.style.top = y;

        // this.props.dispatch(
        //     show({
        //         origin: { x, y },
        //         content: geography.properties.name,
        //     })
        // )
    }
    handleLeave() {
        console.log('tooltip hide -- ')
        //this.props.dispatch(hide())
    }

    componentDidMount() {
        //this.fetchCities();
        //this.fetchCountry();

        let _self = this;
        this.interval = setInterval(function() {
            if(_self.dir === 1) {
                _self.dir = -1
            } else {
                _self.dir = 1;
            }
            _self.blinkAnimationMarker('rsm-markers', _self.dir)
        }, 900)


        if(_self.props.tabIdx === 'pg=1'){
            _self.handleCityClick({ "name": this.state.selectedCity, "coordinates": [2.1734, 41.3851], "population": 37843000, "cost":3 });
        }

        _self.setState({oldCountry:this.state.selectedCity})

    }

    componentWillReceiveProps(nextProps) {
        let data = nextProps.parentProps.devData;
        function reduceUp(value) {
            return Math.round(value)
        }
        let locations = data.map((item) => (
            {LAT:reduceUp(item.CloudletLocation.latitude), LON:reduceUp(item.CloudletLocation.longitude), cloudlet:item.DeveloperName}
        ))


        let locationData = [];

        let groupbyData = aggregation.groupByCompare(locations, ['LAT','LON']);

        console.log('data locations -- ', Object.keys(groupbyData))
        Object.keys(groupbyData).map((key) => {
            locationData.push({ "name": "barcelona",    "coordinates": [groupbyData[key][0]['LON'], groupbyData[key][0]['LAT']], "population": 17843000, "cost":groupbyData[key].length })
        })
        //
        let cloudlet = data.map((item) => (
            {LAT:item.CloudletLocation.latitude, LON:item.CloudletLocation.longitude, cloudlet:item.CloudletName}
        ))


        let cloudletData = [];

        let groupbyClData = aggregation.groupBy(cloudlet, 'cloudlet');

        console.log('data groupbyClData -- ', Object.keys(groupbyClData))
        Object.keys(groupbyClData).map((key) => {
            cloudletData.push({ "name": key,    "coordinates": [groupbyClData[key][0]['LON'], groupbyClData[key][0]['LAT']], "population": 17843000, "cost":groupbyClData[key].length })
        })
        //


        console.log('cloudletData  -- ', cloudletData)
        this.setState({
            cities: locationData
        })
    }
    componentWillUnmount() {
        clearInterval(this.interval)
    }

    render() {
        const grdColors = ['#000000', '#00CC44', '#88ff00', '#FFEE00', '#FF7700', '#FF0022']
        return (
            <div style={wrapperStyles}>
                <div className="zoom-inout-reset-clusterMap" style={{left:8, bottom:4, position:'absolute', display:'block'}}>
                    <Button id="mapZoomCtl" size='20' icon onClick={this.handleReset}>
                        <Icon name="expand" />
                    </Button>
                    <Button id="mapZoomCtl" size='20' icon onClick={this.handleZoomIn}>
                        <Icon name="plus square outline" />
                    </Button>
                    <Button id="mapZoomCtl" size='20' icon onClick={this.handleZoomOut}>
                        <Icon name="minus square outline" />
                    </Button>
                </div>

                <RadialGradientSVG startColor={grdColors[0]} middleColor={grdColors[5]} endColor={grdColors[5]} idCSS="levelFive" rotation={0}/>
                <RadialGradientSVG startColor={grdColors[0]} middleColor={grdColors[4]} endColor={grdColors[4]} idCSS="levelFour" rotation={0}/>
                <RadialGradientSVG startColor={grdColors[0]} middleColor={grdColors[3]} endColor={grdColors[3]} idCSS="levelThree" rotation={0}/>
                <RadialGradientSVG startColor={grdColors[0]} middleColor={grdColors[2]} endColor={grdColors[2]} idCSS="levelTwo" rotation={0}/>
                <RadialGradientSVG startColor={grdColors[0]} middleColor={grdColors[1]} endColor={grdColors[1]} idCSS="levelOne" rotation={0}/>

                <ContainerDimensions>
                    { ({ width, height }) =>
                        <Motion
                            defaultStyle={{
                                zoom: 1,
                                x: 30,
                                y: 40,
                            }}
                            style={{
                                zoom: spring(this.state.zoom, {stiffness: 210, damping: 30}),
                                x: spring(this.state.center[0], {stiffness: 210, damping: 30}),
                                y: spring(this.state.center[1], {stiffness: 210, damping: 30}),
                            }}
                        >
                            {({zoom,x,y}) => (
                                <ComposableMap
                                    projectionConfig={{ scale: 205 }}
                                    width={980}
                                    height={551}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor:styles.geoBackground.color
                                    }}
                                >
                                    <ZoomableGroup center={[x,y]} zoom={zoom} disablePanning={false}>
                                        <Geographies geography="/topojson-maps/world-110m.json">
                                            {(geographies, projection) =>
                                                geographies.map((geography, i) => geography.id !== "010" && (
                                                    <Geography
                                                        key={i}
                                                        geography={geography}
                                                        projection={projection}
                                                        data-tip={geography.properties.NAME}
                                                        style={styles.geography}
                                                        onMouseMove={this.handleMove}
                                                        onMouseLeave={this.handleLeave}
                                                    />
                                                ))}
                                        </Geographies>
                                        <Markers>
                                            {(!this.state.detailMode) ?
                                                this.state.cities.map((city, i) => (
                                                    <Marker key={i} marker={city} onClick={ this.handleCityClick }>
                                                        <circle
                                                            class={(city.population > 35000000)?'levelFive':'levelOther'}
                                                            cx={0}
                                                            cy={0}
                                                            r={cityScale(city.population)}
                                                            fill={
                                                                (city.population > 35000000)?'url(#levelFive)':
                                                                    (city.population <= 35000000 &&  city.population > 30000000)?'url(#levelFour)':
                                                                        (city.population <= 30000000 &&  city.population > 25000000)?'url(#levelThree)':
                                                                            (city.population <= 25000000 &&  city.population > 20000000)?'url(#levelTwo)':
                                                                                'url(#levelOne)'
                                                            }
                                                            stroke={styles.marker.stroke}
                                                            strokeWidth={styles.marker.strokeWidth}
                                                        />
                                                        <text textAnchor="middle" y={8} class="marker_value" style={{fontSize:24}}>
                                                            {city.cost}
                                                        </text>
                                                        {/*<text textAnchor="middle" class="marker_label" x={(city.markerOffsetX)?(city.markerOffsetX):0} y={(city.markerOffset)?(city.markerOffset):24}>*/}
                                                            {/*{city.name}*/}
                                                        {/*</text>*/}
                                                    </Marker>
                                                ))
                                                :
                                                this.state.citiesSecond.map((city, i) => (
                                                    <Marker
                                                        key={i}
                                                        marker={city}
                                                        onClick={this.handleViewZone}
                                                    >
                                                        <circle
                                                            class={"detailMarker_"+city.name}
                                                            cx={0}
                                                            cy={0}
                                                            r={markerSize[0]}
                                                            opacity={1}
                                                            fill={styles.marker.second.fill}
                                                            stroke={styles.marker.second.stroke}
                                                            strokeWidth={styles.marker.second.strokeWidth}
                                                        />

                                                        <text
                                                            class="marker_label"
                                                            textAnchor="middle"
                                                            x={city.offsets[0]}
                                                            y={city.offsets[1]}
                                                        >
                                                            {city.name}
                                                        </text>
                                                    </Marker>
                                                ))
                                            }
                                        </Markers>

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
    return {
        data: state.receiveDataReduce.data,
        tabIdx: state.siteChanger.site.subPath
    };
};
const mapDispatchProps = (dispatch) => {
    return {
        handleInjectData: (data) => { dispatch(actions.setUser(data)) },
        handleChangeTab: (data) => { dispatch(actions.changeTab(data)) },
        handleChangeCity: (data) => { dispatch(actions.changeCity(data)) }
    };
};

export default connect(mapStateToProps, mapDispatchProps)(ClustersMap);
