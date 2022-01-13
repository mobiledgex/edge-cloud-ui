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

class Legend extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            dataList: undefined
        }
    }

    static getDerivedStateFromProps(props, state) {
        let dataList = []
        const { data, tools, groupBy, sortBy } = props
        if (data) {
            const { regions, search } = tools
            regions.map(region => {
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
        if (dataList.length > 0) {
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
        const { dataList } = this.state
        const { tools, handleSelectionStateChange, handleAction, loading, groupBy } = this.props
        return (
            <React.Fragment>
                <div id='legend-block' className="block block-1">
                    {
                        loading ? <Skeleton variant='rect' height={'inherit'} /> :
                            <React.Fragment>
                                {
                                    dataList && dataList.length > 0 ?
                                        <DataTable dataList={dataList} keys={legendKeys(tools.moduleId)} onRowClick={handleSelectionStateChange} formatter={this.onFormat} actionMenu={this.filterAction()} handleAction={handleAction} groupBy={groupBy} /> : <NoData />
                                }
                            </React.Fragment>
                    }
                </div>
            </React.Fragment>
        )
    }
}

export default Legend