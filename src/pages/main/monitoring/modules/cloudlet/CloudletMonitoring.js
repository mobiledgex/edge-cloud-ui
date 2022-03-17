import React from 'react'
import { Card, ImageList, ImageListItem } from '@material-ui/core'
import Module from '../../common/Module'
import CloudletEvent from './CloudletEvent'
import Map from '../../common/map/Map'
import Legend from '../../common/legend/Legend'
import VerticalSliderBtn from '../../../../../hoc/verticalSlider/VerticalSliderButton'
import DMEMetrics from '../../dme/DMEMetrics'
import { ACTION_LATENCY_METRICS } from '../../../../../helper/constant/perpetual'
import { localFields } from '../../../../../services/fields';
import BulletChart from '../../charts/bullet/BulletChart'
import Tooltip from '../../common/legend/Tooltip'
import { convertUnit } from '../../helper/unitConvertor'
import { Icon } from '../../../../../hoc/mexui'
import { perpetual } from '../../../../../helper/constant'

const actionMenu = [
    { id: ACTION_LATENCY_METRICS, label: 'Show Latency Metrics' },
]
class CloudletMonitoring extends React.Component {
    constructor(props) {
        super()
        this.state = {
            actionView: undefined,
            anchorEl: undefined,
            hoverData: undefined
        }
    }

    handleAction = (action, data) => {
        let actionView = { id: action.id, data }
        this.setState({ actionView })
    }

    renderTootip = () => {
        const { hoverData } = this.state
        if (hoverData) {
            const { type, column, data } = hoverData
            if (type === perpetual.CHART_BULLET) {
                const { ranges, markers, measures } = data
                const cloudetAllocation = markers[0]
                const cloudetUsage = measures[1]
                const { unit } = column
                return (
                    <div>
                        <p className='bullet-hover'><Icon size={10} color={'rgba(67,167,111,.4)'}>circle</Icon>&nbsp;&nbsp;{`Total Available: ${unit ? convertUnit(unit, ranges[0]) : ranges}`}</p>
                        <p className='bullet-hover'><Icon size={10} color={'rgba(67,167,111,.9)'}>circle</Icon>&nbsp;&nbsp;{`Total Used: ${unit ? convertUnit(unit, measures[0]) : measures[0]}`}</p>
                        <p className='bullet-hover'><Icon size={10} color={'#1B432C'}>circle</Icon>&nbsp;&nbsp;{`Quota Limit: ${cloudetAllocation > 0 ? unit ? convertUnit(unit, cloudetAllocation) : cloudetAllocation : 'Not Set'}`}</p>
                        <p className='bullet-hover'><Icon size={10} color={'#FFF'}>circle</Icon>&nbsp;&nbsp;{`Resource Used: ${unit && cloudetUsage > 0 ? convertUnit(unit, cloudetUsage) : cloudetUsage}`}</p>
                    </div>
                )
            }
            else {
                return <p>{data}</p>
            }
        }
        return null
    }

    onHover = (e, hoverData) => {
        this.setState({ anchorEl: e ? e.target : undefined, hoverData })
    }

    dataFormatter = (column, data) => {
        if (data?.infraAllotted) {
            let value = { title: "", subtitle: "", unit: column.unit, ranges: [data.infraAllotted ? parseInt(data.infraAllotted) : 0], measures: [data.infraUsed ? parseInt(data.infraUsed) : 0, data.used ? parseInt(data.used) : 0], markers: [data.allotted ? onlyNumeric(data.allotted) : 0] }
            return <BulletChart data={[value]} column={column} onHover={this.onHover} />
        }
    }

    render() {
        const { actionView, anchorEl } = this.state
        const { tools, legends, selection, loading, handleDataStateChange, handleSelectionStateChange, metricRequestData } = this.props
        const { moduleId, regions, search, range, organization, visibility } = tools
        return (
            <React.Fragment>
                <Legend id={moduleId} tools={tools} data={legends} loading={loading} handleAction={this.handleAction} actionMenu={actionMenu} handleSelectionStateChange={handleSelectionStateChange} sortBy={[localFields.cloudletName]} formatter={this.dataFormatter} />
                <div className='legend-drag-btn'>
                    <VerticalSliderBtn height={400} selector='block-1'/>
                </div>
                <div id='resource-block' className="block-2">
                    <ImageList cols={4} rowHeight={300} >
                        {
                            visibility.includes(localFields.map) ? <ImageListItem cols={3}>
                                <Map moduleId={moduleId} search={search} regions={regions} data={legends} selection={selection} />
                            </ImageListItem> : null
                        }
                        {
                            visibility.includes(localFields.event) ?
                                <ImageListItem cols={1}>
                                    <Card className='window-height-300'>
                                        <CloudletEvent range={range} />
                                    </Card>
                                </ImageListItem> : null
                        }
                        {regions.map(region => (
                            legends && legends[region] ? <Module key={region} region={region} legends={legends[region]} metricRequestData={metricRequestData[region]} moduleId={moduleId} visibility={visibility} search={search} range={range} organization={organization} selection={selection} handleDataStateChange={handleDataStateChange} /> : null
                        ))}
                        {actionView && actionView.id === ACTION_LATENCY_METRICS ? <DMEMetrics id={moduleId} onClose={() => { this.setState({ actionView: undefined }) }} data={[actionView.data]} /> : null}
                    </ImageList>
                </div>

                <Tooltip anchorEl={anchorEl}>{this.renderTootip()}</Tooltip>
            </React.Fragment>
        )
    }

    componentDidMount() {
    }
}

export default CloudletMonitoring