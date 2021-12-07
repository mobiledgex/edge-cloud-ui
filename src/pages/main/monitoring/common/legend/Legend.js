import React from 'react'
import BulletChart from '../../charts/bullet/BulletChart';
import BulletLegend from '../../charts/bullet/Legend';
import DataTable from '../../list/DataTable'
import { onlyNumeric } from '../../../../../utils/string_utils';
import { _orderBy } from '../../../../../helper/constant/operators';
import { legendKeys } from '../../helper/constant';
import { Skeleton } from '@material-ui/lab';
import { validateRole } from '../../../../../helper/constant/role';
import { fields } from '../../../../../services/model/format';
import { healthCheck } from '../../../../../helper/formatter/ui';
class Legend extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            newList: undefined
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.data) {
            const { data, tools, groupBy, sortBy } = props
            let keys = Object.keys(data)
            if (keys.length > 0) {
                const { search } = tools
                let newList = []
                keys.forEach(key => {
                    if (search.length === 0 || key.includes(search)) {
                        newList.push({ ...data[key], key })
                    }
                })

                if (groupBy) {
                    newList = _orderBy(newList, groupBy);
                    let group = { version: 'v1' }
                    let groupList = []
                    newList.forEach((item, i) => {
                        let valid = groupBy.some(field => {
                            if (group[field] !== item[field]) {
                                group[field] = item[field]
                                return true
                            }
                        })
                        if (valid) {
                            groupList.push({ ...item, group: true })
                        }

                        groupList.push(item)
                    })
                    newList = groupList
                }
                else {
                    newList = _orderBy(newList, sortBy);
                }
                return { newList }
            }
        }
        return null
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.refresh !== nextProps.refresh
    }

    onFormat = (column, data) => {
        const { tools } = this.props
        if (data) {
            if (column.field === fields.healthCheck) {
                return healthCheck(undefined, data)
            }
            else if (data.infraAllotted) {
                let value = { title: "", subtitle: "", ranges: [data.infraAllotted ? onlyNumeric(data.infraAllotted) : 0], measures: [data.allotted ? onlyNumeric(data.allotted) : 0, data.used ? onlyNumeric(data.used) : 0], markers: [data.infraUsed ? onlyNumeric(data.infraUsed) : 0] }
                return <BulletChart data={[value]} />
            }
            else {
                return data[tools.stats]
            }
        }
    }

    filterAction = () => {
        const { tools, actionMenu } = this.props
        return actionMenu && actionMenu.filter(item => item.roles ? validateRole(item.roles, tools.organization) : true)
    }

    render() {
        const { newList } = this.state
        const { tools, handleSelectionStateChange, handleAction, actionMenu, groupBy } = this.props
        return (
            <React.Fragment>
                <div id='legend-block' className="block block-1">
                    {
                        newList && newList.length > 0 ?
                            <DataTable dataList={newList} keys={legendKeys(tools.moduleId)} onRowClick={handleSelectionStateChange} formatter={this.onFormat} actionMenu={this.filterAction()} handleAction={handleAction} groupBy={groupBy} /> : <Skeleton variant='rect' height={'inherit'} />
                    }
                </div>
            </React.Fragment>
        )
    }
}

export default Legend