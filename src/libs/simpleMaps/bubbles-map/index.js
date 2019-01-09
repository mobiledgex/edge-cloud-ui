
import React, { Component } from "react"
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Markers,
  Marker,
} from "react-simple-maps"
import { scaleLinear } from "d3-scale"
import request from "axios"

const wrapperStyles = {
  width: "100%",
  maxWidth: 980,
  margin: "0 auto",
}

const cityScale = scaleLinear()
  .domain([0,37843000])
  .range([1,25])

class BubblesMap extends Component {
  constructor() {
    super()
    this.state = {
      cities: [],
    }
    this.fetchCities = this.fetchCities.bind(this)
  }
  componentDidMount() {
    this.fetchCities()
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
  handleClickGeo(geography, evt) {
      console.log("Geography data: ", geography)
  }
  handleClickMarker(marker, evt) {
      console.log("marker data: ", marker)
  }

  render() {
    return (
      <div style={wrapperStyles}>
        <ComposableMap
          projectionConfig={{ scale: 205 }}
          width={980}
          height={551}
          style={{
            width: "100%",
            height: "auto",
          }}
          >
          <ZoomableGroup center={[0,20]} disablePanning>
            <Geographies geography="/topojson-maps/world-50m.json">
              {(geographies, projection) =>
                geographies.map((geography, i) =>
                  geography.id !== "ATA" && (
                    <Geography
                      key={i}
                      geography={geography}
                      projection={projection}
                      onClick={this.handleClickGeo}
                      style={{
                        default: {
                          fill: "#ECEFF1",
                          stroke: "#607D8B",
                          strokeWidth: 0.75,
                          outline: "none",
                        },
                        hover: {
                          fill: "#355675",
                          stroke: "#203975",
                          strokeWidth: 0.75,
                          outline: "none",
                        },
                        pressed: {
                          fill: "#92c3ff",
                          stroke: "#497793",
                          strokeWidth: 0.75,
                          outline: "none",
                        },
                      }}
                    />
              ))}
            </Geographies>
            <Markers>
              {
                this.state.cities.map((city, i) => (
                  <Marker key={i} marker={city} onClick={ this.handleClickMarker }>
                    <circle
                      cx={0}
                      cy={0}
                      r={cityScale(city.population)}
                      fill="rgba(255,87,34,0.8)"
                      stroke="#607D8B"
                      strokeWidth="2"
                    />
                  </Marker>
                ))
              }
            </Markers>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    )
  }
}

export default BubblesMap
