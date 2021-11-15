import React from 'react'
import MexMap from '../../../../../hoc/mexmap/MexMap'
import { fields } from '../../../../../services/model/format'

const DEFAULT_ZOOM = 3

class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            backswitch: false
        }
    }

    resetMap = () => {
    }

    renderMarker = () => {
        return (
            <div>

            </div>
        )
    }

    static getDerivedStateFromProps(props, state) {
        if (props.data) {
            const { data, tools } = props
            let mapData = {}
            let keys = Object.keys(data)
            keys.map(key=>{
                let item = data[key]
                const {latitude, longitude} = item[fields.cloudletLocation]
                let mapkey = `${latitude}_${longitude}`
                mapData[mapkey] = mapData[mapkey] ? mapData[mapkey] : {}
                mapData[mapkey] = item
            })
            console.log(mapData)
        }
        return null
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.refresh !== nextProps.refresh
    }

    render() {
        const { backswitch } = this.state
        const { regions } = this.props
        return (
            <MexMap renderMarker={this.renderMarker} back={this.resetMap} zoom={DEFAULT_ZOOM} backswitch={backswitch} region={regions} />
        )
    }

    componentDidMount(){
        console.log(this.props.legends)
    }
}

export default Map