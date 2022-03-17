import { ImageList, ImageListItem } from '@material-ui/core'
import React from 'react'
import Map from '../../common/map/Map'
import Module from '../../common/Module'
import Legend from '../../common/legend/Legend'
import VerticalSliderBtn from '../../../../../hoc/verticalSlider/VerticalSliderButton'
import { fields } from '../../../../../services/model/format';
import BulletChart from '../../charts/bullet/BulletChart'
import Tooltip from '../../common/legend/Tooltip'
import { Icon } from '../../../../../hoc/mexui'
import { perpetual } from '../../../../../helper/constant'

class ClusterMonitoring extends React.Component {
    constructor(props) {
        super()
        this.state = {
            anchorEl: undefined
        }
    }

    renderTootip = () => {
        const { hoverData } = this.state
        if (hoverData) {
            const { type, column, data } = hoverData
            if (type === perpetual.CHART_BULLET) {
                const { measures } = data
                const used = measures[1]
                return (
                    <div>
                        <p className='bullet-hover'><Icon size={10} color={'#FFF'}>circle</Icon>&nbsp;&nbsp;{`${column.label}: ${used}%`}</p>
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
        this.setState({ anchorEl: e?.target, hoverData })
    }

    dataFormatter = (column, data, tools) => {
        if (column.field === fields.cpu || column.field === fields.disk || column.field === fields.memory) {
            let value = { title: '', subtitle: '', unit: column.unit, ranges: [100], measures: [0, parseInt(data[tools.stats])], markers: [0] }
            return <BulletChart data={[value]} column={column} onHover={this.onHover}/>
        }
        else {
            return data[tools.stats]
        }
    }

    render() {
        const { anchorEl } = this.state
        const { tools, legends, selection, refresh, handleDataStateChange, loading, handleSelectionStateChange, metricRequestData } = this.props
        const { moduleId, search, regions, organization, visibility, range } = tools
        return (
            <React.Fragment>
                <Legend id={moduleId} tools={tools} data={legends} loading={loading} handleSelectionStateChange={handleSelectionStateChange} refresh={refresh} sortBy={[fields.clusterName]} groupBy={[fields.cloudletName, fields.operatorName]} formatter={this.dataFormatter} />
                <div className='legend-drag-btn'>
                    <VerticalSliderBtn height={400} selector='block-1'/>
                </div>
                <div id='resource-block' className='block-2'>
                    <ImageList cols={4} rowHeight={300} >
                        {
                            visibility.includes(fields.map) ? <ImageListItem cols={4}>
                                <Map moduleId={moduleId} search={search} regions={regions} data={legends} selection={selection} zoom={2} />
                            </ImageListItem> : null
                        }
                        {tools.regions.map(region => (
                            legends && legends[region] ? <Module key={region} region={region} legends={legends[region]} metricRequestData={metricRequestData[region]} moduleId={moduleId} visibility={visibility} search={search} range={range} organization={organization} selection={selection} handleDataStateChange={handleDataStateChange} /> : null
                        ))}
                    </ImageList>
                </div>
                <Tooltip anchorEl={anchorEl}>{this.renderTootip()}</Tooltip>
            </React.Fragment>
        )
    }
}
export default ClusterMonitoring