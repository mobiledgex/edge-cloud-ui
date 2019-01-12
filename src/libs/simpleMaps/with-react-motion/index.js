
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
import MaterialIcon from 'material-icons-react';
import ContainerDimensions from 'react-container-dimensions'

import { Motion, spring } from "react-motion"
import * as d3 from 'd3';
import { scaleLinear } from "d3-scale"
import request from "axios"
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';

import Legend from './legend';
import RadialGradientSVG from '../../../../src/chartGauge/radialGradientSVG';
import Tooltip from '../../../components/tooltip';
import {ReactSVGPanZoom} from 'react-svg-pan-zoom';

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
//reference : /public/assets/data-maps/world-most-populous-cities.json
const _citiesSecond = [
    { name: "Zurich", coordinates: [8.5417,47.3769] },
    { name: "Singapore", coordinates: [103.8198,1.3521] },
    { name: "San Francisco", coordinates: [-122.4194,37.7749] },
    { name: "Sydney", coordinates: [151.2093,-33.8688] },
    { name: "Lagos", coordinates: [3.3792,6.5244] },
    { name: "Buenos Aires", coordinates: [-58.3816,-34.6037] },
    { name: "Shanghai", coordinates: [121.4737,31.2304] },
]
const cityScale = scaleLinear()
    .domain([0,37843000])
    .range([1,25])


let _self = null;
class AnimatedMap extends Component {
    constructor() {
        super()
        _self = this;
        this.state = {
            center: [0,20],
            zoom: 1,
            cities:[],
            countries:[],
            citiesSecond:[],
            detailMode:false
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
            center: [0,20],
            zoom: 1,
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
    handleCityClick(city) {
        this.setState({
            zoom: 4,
            center: city.coordinates,
            detailMode:true
        })
        this.props.parentProps.zoomIn(true)
        //
        if(d3.selectAll('.rsm-markers').selectAll(".levelFive")) {
            d3.selectAll('.rsm-markers').selectAll(".levelFive")
                .transition()
                .ease(d3.easeBack)
                .attr("r", 6)
        }
    }
    handleGotoAnalysis(country) {
        if(this.props.parentProps) this.props.parentProps.gotoNext(country);
    }
    handleViewZone(country) {
        //change the data of detail Info

    }

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
            { "name": "Sant Montjuic", "coordinates": [0.170459, 41.018247], "population": 1, "cost":1, "offsets": [-10,15] },
            { "name": "Sant Gervasi", "coordinates": [1.005055, 42.493365], "population": 1, "cost":1, "offsets": [10,-15] },
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
            alpha = 0.1;
            durate = 900;
        } else {
            radius = 16;
            alpha = 1;
            durate = 0;
        }
        if(d3.selectAll('.'+id).selectAll(".levelFive")) {
            d3.selectAll('.'+id).selectAll(".levelFive")
                .transition()
                .duration(durate)
                .ease(d3.easeBack)
                .attr("r", radius)
                .style("opacity",alpha)
        }
    }

    //tooltip
    handleMove(geography, evt) {
        const x = evt.clientX
        const y = evt.clientY + window.pageYOffset
        console.log('tooltip move -- ', x, y, geography.properties.NAME)
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
        this.fetchCities();
        this.fetchCountry();

        let _self = this;
        var interval = setInterval(function() {
            if(_self.dir === 1) {
                _self.dir = -1
            } else {
                _self.dir = 1;
            }
            _self.blinkAnimationMarker('rsm-markers', _self.dir)
        }, 900)

    }
    render() {
        const grdColors = ['#000000', '#00ff00', '#99BB00', '#ffff00', '#FF8600', '#ff0000']
        return (
            <div style={wrapperStyles}>
                <div className="zoom-inout-reset">
                    <Button id="mapZoomCtl" size='20' icon onClick={this.handleZoomIn}>
                        <Icon name="plus square outline" />
                    </Button>
                    <Button id="mapZoomCtl" size='20' icon onClick={this.handleZoomOut}>
                        <Icon name="minus square outline" />
                    </Button>
                    <Button id="mapZoomCtl" size='20' icon onClick={this.handleReset}>
                        <Icon name="expand" />
                    </Button>
                </div>

                <RadialGradientSVG startColor={grdColors[0]} middleColor={grdColors[5]} endColor={grdColors[5]} idCSS="levelFive" rotation={0}/>
                <RadialGradientSVG startColor={grdColors[0]} middleColor={grdColors[4]} endColor={grdColors[4]} idCSS="levelFour" rotation={0}/>
                <RadialGradientSVG startColor={grdColors[0]} middleColor={grdColors[3]} endColor={grdColors[3]} idCSS="levelThree" rotation={0}/>
                <RadialGradientSVG startColor={grdColors[0]} middleColor={grdColors[2]} endColor={grdColors[2]} idCSS="levelTwo" rotation={0}/>
                <RadialGradientSVG startColor={grdColors[0]} middleColor={grdColors[1]} endColor={grdColors[1]} idCSS="levelOne" rotation={0}/>



                <Legend />

                <ContainerDimensions>
                    { ({ width, height }) =>
                        <Motion
                            defaultStyle={{
                                zoom: 1,
                                x: 0,
                                y: 20,
                            }}
                            style={{
                                zoom: spring(this.state.zoom, {stiffness: 210, damping: 20}),
                                x: spring(this.state.center[0], {stiffness: 210, damping: 20}),
                                y: spring(this.state.center[1], {stiffness: 210, damping: 20}),
                            }}
                        >
                            {({zoom,x,y}) => (
                                <ComposableMap
                                    projectionConfig={{ scale: 205 }}
                                    width={980}
                                    height={551}
                                    style={{
                                        width: "100%",
                                        height: "auto",
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
                                                        <text
                                                            textAnchor="middle"
                                                            y={4}
                                                            style={{
                                                                fontFamily: "sans-serif",
                                                                fill: "#fff",
                                                                fontSize: '12px',
                                                            }}
                                                        >
                                                            {city.cost}
                                                        </text>
                                                        <text
                                                            textAnchor="middle"
                                                            y={24}
                                                            style={{
                                                                fontFamily: "sans-serif",
                                                                fill: "#999",
                                                                fontSize: '9px',
                                                            }}
                                                        >
                                                            {city.name}
                                                        </text>
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
                                                            class="detailMarker"
                                                            cx={0}
                                                            cy={0}
                                                            r={6}
                                                            fill={styles.marker.second.fill}
                                                            stroke={styles.marker.second.stroke}
                                                        />

                                                        <text
                                                            textAnchor="middle"
                                                            x={city.offsets[0]}
                                                            y={city.offsets[1]}
                                                            style={{
                                                                fontFamily: "sans-serif",
                                                                fill: "#999",
                                                                fontSize: '9px',
                                                            }}
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


// const mapStateToProps = (state, ownProps) => {
//     return {
//         data: state.receiveDataReduce.data,
//         tabIdx: state.tabChanger
//     };
// };
const mapDispatchProps = (dispatch) => {
    return {
        handleInjectData: (data) => { dispatch(actions.setUser(data)) },
        handleChangeTab: (data) => { dispatch(actions.changeTab(data)) }
    };
};

export default connect(null, mapDispatchProps)(AnimatedMap);