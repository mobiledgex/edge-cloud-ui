
import React, { Component } from "react"
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
    Markers,
    Marker, Annotations, Annotation
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
    minWidth: 500,
    margin: "0 auto",
    overflow:'hidden'
}
const zoomControls = {center:[0, 0], zoom:1}
//reference : /public/assets/data-maps/world-most-populous-cities.json

const cityScale = scaleLinear()
    .domain([0,37843000])
    .range([1,48])
const markerSize = [20, 24]

let _self = null;
class EditMap extends Component {
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
            unselectCity:'',
            clickCities:[]
        }
        this.handleZoomIn = this.handleZoomIn.bind(this)
        this.handleZoomOut = this.handleZoomOut.bind(this)
        this.handleCityClick = this.handleCityClick.bind(this)
        this.handleCityLocation = this.handleCityLocation.bind(this)
        //this.handleGotoAnalysis = this.handleGotoAnalysis.bind(this)
        this.handleReset = this.handleReset.bind(this)
        this.handleMove = this.handleMove.bind(this)
        this.handleLeave = this.handleLeave.bind(this)
        this.dir = 1;
        this.interval = null;
    }
    handleZoomIn() {
        this.setState({
            zoom: this.state.zoom * 2
        })
        this.props.zoomIn(this.state.detailMode)
    }
    handleZoomOut() {
        this.setState({
            zoom: this.state.zoom / 2
        })
        this.props.zoomOut(this.state.detailMode)
    }
    handleReset() {
        this.setState({
            center: zoomControls.center,
            zoom: zoomControls.zoom,
            detailMode:false
        })
        this.props.handleChangeClickCity([]);
        this.props.resetMap(false)
    }


    // 펼쳐진 지도( full screen map)
    handleCityClick(city) {
        this.setState({
            zoom: 4,
            center: city.coordinates,
            detailMode:true
        })
        this.props.zoomIn(true)

        if(d3.selectAll('.rsm-markers').selectAll(".levelFive")) {
            d3.selectAll('.rsm-markers').selectAll(".levelFive")
                .transition()
                .ease(d3.easeBack)
                .attr("r", markerSize[0])
        }
        let clickMarker = [];
        if(city) {
            city.name.map((item, i) => {
                clickMarker.push({ "name": item,    "coordinates": city.coordinates, "population": 17843000, "cost":1 })
            })
        }
        this.setState({
            clickCities:clickMarker
        })
        this.props.handleChangeClickCity(clickMarker);
        this.props.handleChangeCity(city)
    }

    handleCityLocation(value) {
        const city = {
            coordinates: value
        }
        this.setState({
            zoom: 3,
            center: city.coordinates,
            detailMode:true
        })
        this.props.zoomIn(true)

        if(d3.selectAll('.rsm-markers').selectAll(".levelFive")) {
            d3.selectAll('.rsm-markers').selectAll(".levelFive")
                .transition()
                .ease(d3.easeBack)
                .attr("r", markerSize[0])
        }
        let clickMarker = [city];

        this.setState({
            clickCities:clickMarker
        })
        //this.props.handleChangeClickCity(city);
        this.props.handleChangeCity(city)
    }


    // map marker text click
    handleAnnoteClick(city) {
        console.log("@@@&&",city)
    }

    // handleGotoAnalysis(country) {
    //     if(this.props.parentProps) this.props.parentProps.gotoNext(country);
    // }

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
    }
    handleLeave() {
        console.log('tooltip hide -- ')
        //this.props.dispatch(hide())
    }

    handleMapClick = (a,b,c,d) => {
        console.log(a)
        console.log(b)
    }

    componentDidMount() {

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
        console.log("location@@$$$",nextProps)
        if(nextProps.locationLongLat) {
            this.handleCityLocation(nextProps.locationLongLat)
        } else {
            this.handleReset()
            this.setState({clickCities:[]})
        }
        
        // let data = nextProps.devData;
        // function reduceUp(value) {
        //     return Math.round(value)
        // }
        // const mapName = (item) => {
        //     if (this.props.itemLabel == "Cloudlets") {
        //         return item.CloudletName
        //     } else if (this.props.itemLabel == "App Instances") {
        //         return item.AppName
        //     } else if (this.props.itemLabel == "Cluster Instances") {
        //         return item.ClusterName
        //     } else {
        //         return
        //     }
        // }
        // let locations = data.map((item) => (
        //     {LAT:reduceUp(item.CloudletLocation.latitude), LON:reduceUp(item.CloudletLocation.longitude), cloudlet:mapName(item)}
        // ))


        // let locationData = [];

        // let groupbyData = aggregation.groupByCompare(locations, ['LAT','LON']);

        // const cloundletName = (key) => {
        //     let nameArray = [];
        //     groupbyData[key].map((item, i) => {
        //         nameArray[i] = groupbyData[key][i]['cloudlet'];
        //     })

        //     return nameArray;
        // }

        // console.log('data locations -- ', Object.keys(groupbyData))
        // Object.keys(groupbyData).map((key) => {
        //     locationData.push({ "name": cloundletName(key),    "coordinates": [groupbyData[key][0]['LON'], groupbyData[key][0]['LAT']], "population": 17843000, "cost":groupbyData[key].length })
        // })
        // //
        // let cloudlet = data.map((item) => (
        //     {LAT:item.CloudletLocation.latitude, LON:item.CloudletLocation.longitude, cloudlet:item.CloudletName}
        // ))


        // let cloudletData = [];

        // let groupbyClData = aggregation.groupBy(cloudlet, 'cloudlet');

        // console.log('data groupbyClData -- ', Object.keys(groupbyClData))
        // Object.keys(groupbyClData).map((key) => {
        //     cloudletData.push({ "name": key,    "coordinates": [groupbyClData[key][0]['LON'], groupbyClData[key][0]['LAT']], "population": 17843000, "cost":groupbyClData[key].length })
        // })

        // console.log('cloudletData  -- ', locationData)
        // this.setState({
        //     cities: locationData
        // })
    }
    componentWillUnmount() {
        clearInterval(this.interval)
        this.props.resetLocation();
    }

    render() {
        const grdColors = ['#000000', '#00CC44', '#88ff00', '#FFEE00', '#FF7700', '#FF0022', '#66CCFF', '#6c50ff']
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
                <RadialGradientSVG startColor={grdColors[0]} middleColor={grdColors[6]} endColor={grdColors[6]} idCSS="levelOne" rotation={0}/>
                <RadialGradientSVG startColor={grdColors[0]} middleColor={grdColors[7]} endColor={grdColors[7]} idCSS="levelSeven" rotation={0}/>

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
                                                        onClick={this.handleMapClick}
                                                    />
                                                ))}
                                        </Geographies>
                                        <Markers>
                                            {
                                                this.state.clickCities.map((city, i) => (
                                                    <Marker
                                                        key={i}
                                                        marker={city}
                                                        //onClick={this.handleViewZone}
                                                    >
                                                        <circle
                                                            //class={"detailMarker_"+city.name}
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
        tabIdx: state.siteChanger.site.subPath,
        itemLabel: state.computeItem.item
    };
};
const mapDispatchProps = (dispatch) => {
    return {
        handleInjectData: (data) => { dispatch(actions.setUser(data)) },
        handleChangeTab: (data) => { dispatch(actions.changeTab(data)) },
        handleChangeCity: (data) => { dispatch(actions.changeCity(data)) },
        handleChangeClickCity: (data) => { dispatch(actions.clickCityList(data))}
    };
};

export default connect(mapStateToProps, mapDispatchProps)(EditMap);
