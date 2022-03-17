import React from 'react'
import BulletChart from '../../charts/bullet/BulletChart';
import DataTable from '../../list/DataTable'
import { onlyNumeric } from '../../../../../utils/string_utils';
import { _orderBy } from '../../../../../helper/constant/operators';
import { legendKeys } from '../../helper/constant';
import { Skeleton } from '@material-ui/lab';
import { validateRole } from '../../../../../helper/constant/role';
import { fields } from '../../../../../services/model/format';
import { healthCheck, NoData } from '../../../../../helper/formatter/ui';
import Tooltip from './Tooltip';
import { convertUnit } from '../../helper/unitConvertor';
import { Icon } from '../../../../../hoc/mexui';

class Legend extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            dataList: undefined,
            anchorEl: undefined,
            hoverData: undefined
        }
    }

    static getDerivedStateFromProps(props, state) {
        let dataList = []
        const { data, tools, groupBy, sortBy } = props
        if (data) {
            const { regions, search } = tools
            regions.forEach(region => {
                if (data[region]) {
                    let keys = Object.keys(data[region])
                    if (keys.length > 0) {
                        keys.forEach(key => {
                            if (search.length === 0 || key.includes(search)) {
                                dataList.push({ ...data[region][key], key })
                            }
                        })
                    }
                }
            })
        }
        if (dataList?.length > 0) {
            if (groupBy) {
                dataList = _orderBy(dataList, groupBy);
                let group = {}
                let groupList = []
                dataList.forEach((item, i) => {
                    let valid = groupBy.map(field => {
                        if (group[field] !== item[field]) {
                            group[field] = item[field]
                            return true
                        }
                        return false
                    })
                    if (valid.includes(true)) {
                        groupList.push({ ...item, group: true })
                    }
                    groupList.push(item)
                })
                dataList = groupList
            }
            else {
                dataList = _orderBy(dataList, sortBy);
            }
        }
        return { dataList }
    }

    onHover = (e, hoverData) => {
        this.setState({ anchorEl: e ? e.target : undefined, hoverData })
    }

    onFormat = (column, data) => {
        const { tools } = this.props
        if (data) {
            if (column.field === fields.healthCheck) {
                return healthCheck(undefined, data)
            }
            else if (data.infraAllotted) {
                let value = { title: "", subtitle: "", unit: column.unit, ranges: [data.infraAllotted ? onlyNumeric(data.infraAllotted) : 0], measures: [data.infraUsed ? onlyNumeric(data.infraUsed) : 0, data.used ? onlyNumeric(data.used) : 0], markers: [data.allotted ? onlyNumeric(data.allotted) : 0] }
                return <BulletChart data={[value]} column={column} onHover={this.onHover} />
            }
            else {
                return data[tools.stats]
            }
        }
    }

    filterAction = () => {
        const { tools, actionMenu } = this.props
        return actionMenu?.filter(item => item.roles ? validateRole(item.roles, tools.organization) : true)
    }

    renderTootip = () => {
        const { hoverData } = this.state
        if (hoverData) {
            const { type, column, data } = hoverData
            if (type === 'Bullet') {
                const { ranges, markers, measures } = data
                const cloudetAllocation = markers[0]
                const cloudetUsage = measures[1]
                const { unit } = column
                return (
                    <div>
                        <p style={{display:'flex', alignItems:'center', color:'#CECECE', fontWeight:900}}><Icon size={10} color={'rgba(67,167,111,.4)'}>circle</Icon>&nbsp;&nbsp;{`Total Available: ${unit ? convertUnit(unit, ranges[0]) : ranges}`}</p>
                        <p style={{display:'flex', alignItems:'center', color:'#CECECE', fontWeight:900}}><Icon size={10} color={'rgba(67,167,111,.9)'}>circle</Icon>&nbsp;&nbsp;{`Total Used: ${unit ? convertUnit(unit, measures[0]) : measures[0]}`}</p>
                        <p style={{display:'flex', alignItems:'center', color:'#CECECE', fontWeight:900}}><Icon size={10} color={'#1B432C'}>circle</Icon>&nbsp;&nbsp;{`Quota Limit: ${cloudetAllocation > 0  ? unit ? convertUnit(unit, cloudetAllocation) : cloudetAllocation : 'Not Set'}`}</p>
                        <p style={{display:'flex', alignItems:'center', color:'#CECECE', fontWeight:900}}><Icon size={10} color={'#FFF'}>circle</Icon>&nbsp;&nbsp;{`Resource Used: ${unit && cloudetUsage > 0 ? convertUnit(unit, cloudetUsage) : cloudetUsage}`}</p>
                    </div>
                )
            }
            else {
                return <p>{data}</p>
            }
        }
        return null
    }

    render() {
        const { dataList, anchorEl } = this.state
        const { id, tools, handleSelectionStateChange, handleAction, loading, groupBy } = this.props
        return (
            <React.Fragment>
                <div id='mex-monitoring-legend-block' className="block block-1">
                    {
                        loading ? <Skeleton id='mex-monitoring-legend-skeleton' variant='rect' height={'inherit'} /> :
                            <React.Fragment>
                                {
                                    dataList && dataList.length > 0 ?
                                        <DataTable id={id} dataList={dataList} keys={legendKeys(tools.moduleId)} onRowClick={handleSelectionStateChange} formatter={this.onFormat} actionMenu={this.filterAction()} handleAction={handleAction} groupBy={groupBy} onHover={this.onHover}/> : <NoData />
                                }
                            </React.Fragment>
                    }
                </div>
                <Tooltip anchorEl={anchorEl}>{this.renderTootip()}</Tooltip>
            </React.Fragment>
        )
    }
}

export default Legend