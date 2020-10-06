import React from 'react'
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import MexMap from './mexmap/MexMap'
import { fields } from '../../../services/model/format'
import { LinearProgress, Card, Fab} from '@material-ui/core'
import MexChart from './charts/MexChart'
import './style.css'
import { withRouter } from 'react-router-dom';
import KeyboardArrowDownOutlinedIcon from '@material-ui/icons/KeyboardArrowDownOutlined';
export default class Monitoring extends React.Component {
    constructor(props) {
        super(props)
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
        this.state = {
            chartData: {},
            mapData: {},
        }
    }

   
    render() {
        const { mapData } = this.state
        return (
            <div className="monitoring-main" mex-test="component-monitoring">
                    {/* <Card style={{ width: '100%' }}>
                        <MexMap data={mapData} />
                    </Card> */}
                    <MexChart/>
                <div className='montoring-manual-scroll'>
                    <KeyboardArrowDownOutlinedIcon />
                </div>
            </div>
        )
    }

    formatMapData = (dataList) => {
        let data = dataList.reduce((accumulator, x) => {
            let location = x[fields.cloudletLocation]
            let key = location.latitude + '_' + location.longitude
            if (!accumulator[key]) {
                accumulator[key] = [];
            }
            accumulator[key].push(x);
            return accumulator;
        }, {})

        let mapData = this.state.mapData

        Object.keys(data).map(item => {
            if (mapData[item]) {
                mapData[item] = [...mapData[item], ...data[item]]
            }
            else {
                mapData[item] = data[item]
            }
        })
        return mapData
    }
}

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
    };
};

withRouter(connect(null, mapDispatchProps)(Monitoring));