
import React, { Component } from "react";
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
    Markers,
    Marker,Annotations, Annotation
} from "react-simple-maps";
import { Button, Icon, List } from 'semantic-ui-react';
import MaterialIcon from 'material-icons-react';
import ContainerDimensions from 'react-container-dimensions';

import { Motion, spring } from "react-motion";
import * as d3 from 'd3';
import { scaleLinear } from "d3-scale";
import request from "axios";
import ReactTooltip from 'react-tooltip';
import uuid from "uuid";
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';

import Legend from './legend';
import RadialGradientSVG from '../../../../src/chartGauge/radialGradientSVG';
import Tooltip from '../../../components/tooltip';
import {ReactSVGPanZoom} from 'react-svg-pan-zoom';

//style
import styles from '../../../css/worldMapStyles';
import './styles.css';

const wrapperStyles = {
    width: "100%",
    height:"100%",
    minWidth: 1600,
    margin: "0 auto",
    overflow:'hidden'
}
//reference : /public/assets/data-maps/world-most-populous-cities.json

const cityScale = scaleLinear()
    .domain([0,37843000])
    .range([1,25])


let _self = null;
const makeList = (obj) => (
    <List>
        {obj.map((key) => (
            <List.Item>
                <List.Icon name='marker' />
                <List.Content>
                    <List.Header as='a'>{'- '+key}</List.Header>
                </List.Content>
            </List.Item>
        ))
        }
    </List>

)
function annoteClick () {
    console.log('on click annnnnnn')
}
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
            citiesFake:[
                <Annotation
                    dx={ 40 }
                    dy={ -30 }
                    subject={ [ -61.5, 16.3 ] }
                    strokeWidth={ 1 }
                    stroke="#607D8B"
                >
                    <text>{ "Guadaloupe" }</text>
                </Annotation>
            ],
            detailMode:false,
            selectedCity:'barcelona',
            oldCountry:'',
            unselectCity:'',
            ReactTooltip:'No Message'
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
        this.moveMouse = false;
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
            center: [0,20],
            zoom: 1,
            detailMode:false
        })
        this.props.parentProps.resetMap(false, 'fromDetail')
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
            zoom: this.state.zoom * 4,
            center: city.coordinates,
            detailMode:true
        })

        // if(d3.selectAll('.rsm-markers').selectAll(".levelFive")) {
        //     d3.selectAll('.rsm-markers').selectAll(".levelFive")
        //         .transition()
        //         .ease(d3.easeBack)
        //         .attr("r", 5)
        // }
        //

        console.log('marker on click...')

        city['customId'] = uuid.v4();

        _self.props.handleChangeCity(city)


    }
    handleAnnoteClick(value, evt) {
        console.log('handleAnnoteClick..', value, evt)
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
                .attr("r", 5)
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
    fetchCities(data) {

        //display custom setting data in json file to local server.
        // request
        //     .get("/data-maps/world-most-populous-cities.json")
        //     .then(res => {
        //         this.setState({
        //             cities: res.data,
        //         })
        //     })

        /*****************
         * 실데이터 입력
         * ***************/
        //console.log('fetch cities...+++++------++++++ ', data)
        this.setState({
            cities : data
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
        // let _countries = [
        //     { "name": "barcelona", "coordinates": [2.1734, 41.3851], "population": 1, "cost":1, "offsets": [0,15]},
        //     { "name": "bonn", "coordinates": [7.098, 50.737], "population": 1, "cost":1, "offsets": [0,15] },
        //     { "name": "frankfurt", "coordinates": [8.6821, 50.1109], "population": 1, "cost":1, "offsets": [0,15] },
        //     { "name": "berlin", "coordinates": [13.405,52.52], "population": 1, "cost":1, "offsets": [0,15] },
        //     ]
        let _countries = [
            { "name": "barcelona-mexdemo", "coordinates": [2.1734, 41.3851], "population": 1, "cost":1, "offsets": [0,15]},
            { "name": "skt-mwc", "coordinates": [2.1734, 42.0851], "population": 1, "cost":1, "offsets": [0,-10] },
            { "name": "tip-mexdemo", "coordinates": [1.4, 41.5851], "population": 1, "cost":1, "offsets": [-30,0] },
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
                .attr("r", (dir === 1)?5:7)
                .style("opacity",alpha)
        }

    }

    //tooltip
    handleMove = (geography, evt) => {
        const x = evt.clientX
        const y = evt.clientY + window.pageYOffset

        // this.setState({tooltipMsg:geography.properties.NAME})

    }
    handleLeave = () => {
        //this.props.dispatch(hide())
        ReactTooltip.hide(this.tooltipref)
    }
    handleMoveMk = (marker, evt) => {
        const x = evt.clientX
        const y = evt.clientY + window.pageYOffset
        let names = [];
        if(marker.name.length){
            names = makeList(marker.name)
        }

        this.setState({tooltipMsg:(names.length>0) ? names : marker.name})
        if(!this.moveMouse){
            ReactTooltip.rebuild()
            ReactTooltip.show(this.circle)
        }

        this.moveMouse = true;
    }
    handleLeaveMk = () => {
        //this.props.dispatch(hide())
        ReactTooltip.hide(this.tooltipref)
        this.moveMouse = false;
    }

    handleMouseOverMarker(value) {
        this.setState({tooltipMsg:value})
        ReactTooltip.rebuild()
        ReactTooltip.show(this.tooltipref)
    }


    drawZoomRect(target, self) {
        var refresh = () => {

        }
        var margin = {top: 0, right: 12, bottom: 20, left: 60},
            width = 960 - margin.left - margin.right,
            height = 430 - margin.top - margin.bottom;


        var xmin = 0,
            xmax = 500,
            ymin = 0,
            ymax = 1000;

        var x = d3.scaleLinear()
            .domain([xmin+.5, xmax+.5])
            .range([0.5, width+.5]);

        var y = d3.scaleLinear()
            .domain([ymin+.5, ymax+.5])
            .range([height+.5, 0.5]);


        var zoom = d3.zoom()
            .scaleExtent([.001, Infinity]).on("zoom", refresh);

        var zoomRect = false;
        var e = self,
            origin = d3.mouse(e),
            rect = target.append("rect").attr("class", "zoom");
        d3.select("body").classed("noselect", true);
        origin[0] = Math.max(0, Math.min(width, origin[0]));
        origin[1] = Math.max(0, Math.min(height, origin[1]));
        d3.select(window)
            .on("mousemove.zoomRect", function() {
                var m = d3.mouse(e);
                m[0] = Math.max(0, Math.min(width, m[0]));
                m[1] = Math.max(0, Math.min(height, m[1]));
                rect.attr("x", Math.min(origin[0], m[0]))
                    .attr("y", Math.min(origin[1], m[1]))
                    .attr("width", Math.abs(m[0] - origin[0]))
                    .attr("height", Math.abs(m[1] - origin[1]));
            })
            .on("mouseup.zoomRect", function() {
                d3.select(window).on("mousemove.zoomRect", null).on("mouseup.zoomRect", null);
                d3.select("body").classed("noselect", false);
                var m = d3.mouse(e);
                m[0] = Math.max(0, Math.min(width, m[0]));
                m[1] = Math.max(0, Math.min(height, m[1]));
                if (m[0] !== origin[0] && m[1] !== origin[1]) {
                    //zoom.x(x.domain([origin[0], m[0]].map(x.invert).sort(function(a,b) { return a - b;})))
                    //.y(y.domain([origin[1], m[1]].map(y.invert).sort(function(a,b) { return a - b;})));



                    //x.domain([origin[0], m[0]].map(x.invert, x));
                    //y.domain([origin[1], m[1]].map(y.invert, y));


                    var dx = m[0] - origin[0];
                    var dy = m[1] - origin[1];
                    var x = (origin[0] + m[0]) / 2;
                    var y = (origin[1] + m[1]) / 2;

                    var scale = Math.max(width / dx, height / dy);
                    var translate = [width / 2 - scale * x, height / 2 - scale * y];

                    var zt = d3.zoomIdentity
                    		.scale(scale)
                    		.translate(-origin[0], translate[1]);

                    console.log('scale  ', scale)

                    //zoom.transform(d3.select("#main"), zt)

                }
                rect.remove();
                refresh();
            }, true);

    }
    removeZoomer() {

    }
    makeAnnotation() {
        return (
            <Annotations>
                {
                    !this.state.detailMode ?

                            this.state.cities.map((city, i) => (
                                <Annotation
                                    dx={ 40 }
                                    dy={ -30 }
                                    subject={ [ -61.5, 16.3 ] }
                                    strokeWidth={ 1 }
                                    stroke="#607D8B"
                                    onClick={this.handleAnnoteClick}
                                >
                                    <text>{ city }</text>
                                </Annotation>
                            ))
                    :null
                }
            </Annotations>

        )
    }

    makeMarkers() {
        return (
        <Markers>
            {(!this.state.detailMode) ?
                (this.state.cities) ?
                    this.state.cities.map((city, i) => (
                        <Marker key={i} marker={city}
                                onClick={this.handleCityClick}
                                onMouseMove={this.handleMoveMk}
                                onMouseLeave={this.handleLeaveMk}
                        >
                            <text textAnchor="middle" y={3.5} className="marker_value">
                                {city.cost}
                            </text>
                            <circle
                                ref={ref => this.circle = ref} data-tip='tooltip' data-for='happyFace'
                                class={(city.population > 35000000) ? 'levelFive' : 'levelOther'}
                                cx={0}
                                cy={0}
                                r={cityScale(city.population)}
                                fill={
                                    (city.population > 35000000) ? 'url(#levelFive)' :
                                        (city.population <= 35000000 && city.population > 30000000) ? 'url(#levelFour)' :
                                            (city.population <= 30000000 && city.population > 25000000) ? 'url(#levelThree)' :
                                                (city.population <= 25000000 && city.population > 20000000) ? 'url(#levelTwo)' :
                                                    'url(#levelOne)'
                                }
                                stroke={styles.marker.stroke}
                                strokeWidth={styles.marker.strokeWidth}
                            />

                            {/*<text textAnchor="middle" class="marker_label" x={(city.markerOffsetX)?(city.markerOffsetX):0} y={(city.markerOffset)?(city.markerOffset):24}>*/}
                            {/*{city.name}*/}
                            {/*</text>*/}
                        </Marker>
                    )) : null
                :
                this.state.cities.map((city, i) => (
                    <Marker
                        key={i}
                        marker={city}
                        onClick={this.handleViewZone}
                    >
                        <circle
                            class={"detailMarker_" + city.name}
                            cx={0}
                            cy={0}
                            r={5}
                            opacity={1}
                            fill={styles.marker.second.fill}
                            stroke={styles.marker.second.stroke}
                            strokeWidth={styles.marker.second.strokeWidth}
                        />
                        {/*<text*/}
                            {/*class="marker_label"*/}
                            {/*textAnchor="middle"*/}
                            {/*x={city.offsets[0]}*/}
                            {/*y={city.offsets[1]}*/}
                        {/*>*/}
                            {/*{city.name}*/}
                        {/*</text>*/}
                    </Marker>

                ))
            }

        </Markers>)
    }
    componentDidMount() {

        this.fetchCountry();

        let _self = this;
        this.interval = setInterval(function() {
            if(_self.dir === 1) {
                _self.dir = -1
            } else {
                _self.dir = 1;
            }
            _self.blinkAnimationMarker('rsm-markers', _self.dir)
        }, 900)

        if(_self.props.parentProps.tabIdx === 'pg=1'){
            _self.handleCityClick({ "name": this.state.selectedCity, "coordinates": [2.1734, 41.3851], "population": 37843000, "cost":3 });
        }

        _self.setState({oldCountry:this.state.selectedCity})


        setTimeout(() => {

            // var rsm = d3.select('.rsm-zoomable-group').on("mousedown", function() {
            //     var self = this;
            //     console.log('mouse down rsm-zoomable-group', this)
            //     _self.drawZoomRect(d3.select('.rsm-zoomable-group'), self);
            // }).on("mouseout", function() {
            //     _self.removeZoomer();
            // })


            document.querySelector("text").addEventListener("click", function(event) {
                // If the user clicked right on the SVG,
                // this will never fire
                console.log('on mouse down  annotation ..', event)
            });
        }, 1000)

        //test



    }
    componentWillUnmount() {
        clearInterval(this.interval)
    }
    componentWillReceiveProps(nextProps, nextContext) {
        console.log('++++++++++++++', nextProps)
        if(!nextProps.parentProps.open){
            // this.setState({
            //     center: [0,20],
            //     zoom: 1,
            //     detailMode:false
            // })
        }
        this.fetchCities(nextProps.parentProps.data)
    }

    render() {
        const grdColors = ['#000000', '#00CC44', '#88ff00', '#FFEE00', '#FF7700', '#FF0022']
        return (
            <div style={wrapperStyles}>
                <div className="zoom-inout-reset">
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

                <Legend />

                <ReactTooltip id='happyFace' className='customToolTip' type='dark' effect='float'>
                    <span>{this.state.tooltipMsg}</span>
                </ReactTooltip>
                <ContainerDimensions>
                    { ({ width, height }) =>
                        <Motion
                            defaultStyle={{
                                zoom: 1,
                                x: 0,
                                y: 20,
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
                                        {this.makeMarkers()}
                                        <Annotations>
                                            {
                                                this.state.detailMode ?

                                                    this.state.cities.map((city, i) => (
                                                        <Annotation
                                                            key={i}
                                                            dx={ -30 } dy={ 30+(i*30) }
                                                            curve={0.5}
                                                            zoom = {1}
                                                            subject={ city['coordinates'] }
                                                            strokeWidth={ 0.1 }
                                                            stroke={'#AFAFAF'}
                                                            style={{cursor:'pointer'}}
                                                        >
                                                            <text className='annoteText'
                                                                fill='#AFAFAF'
                                                                  onClick={this.handleAnnoteClick.bind(this,city['name'][0])}
                                                            >
                                                                { city['name'][0] }
                                                            </text>
                                                        </Annotation>
                                                    ))
                                                    :null
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

const mapDispatchProps = (dispatch) => {
    return {
        handleInjectData: (data) => { dispatch(actions.setUser(data)) },
        handleChangeTab: (data) => { dispatch(actions.changeTab(data)) },
        handleChangeCity: (data) => { dispatch(actions.changeCity(data)) }
    };
};

export default connect(null, mapDispatchProps)(AnimatedMap);
