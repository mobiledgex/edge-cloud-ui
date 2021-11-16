import React from 'react'
import BulletChart from '../../charts/bullet/BulletChart';
import BulletLegend from '../../charts/bullet/Legend';
import DataTable from '../../list/DataTable'
import { onlyNumeric } from '../../../../../utils/string_utils';
import { legendKeys } from '../../services/service';
import { _orderBy } from '../../../../../helper/constant/operators';
class Legend extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            newList: undefined
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.data) {
            const { data, tools } = props
            const { search } = tools
            let newList = []
            data && Object.keys(data).forEach(key => {
                if (search.length === 0 || key.includes(search)) {
                    newList.push({ ...data[key], key })
                }
            })
            newList = _orderBy(newList, ['cloudletName']);
            return { newList }
        }
        return null
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.refresh !== nextProps.refresh
    }

    onFormat = (column, data) => {
        const { tools } = this.props
        if (data) {
            if (data.infraAllotted) {
                let value = { title: "", subtitle: "", ranges: [data.infraAllotted ? onlyNumeric(data.infraAllotted) : 0], measures: [data.allotted ? onlyNumeric(data.allotted) : 0, data.used ? onlyNumeric(data.used) : 0], markers: [data.infraUsed ? onlyNumeric(data.infraUsed) : 0] }
                return <BulletChart data={[value]} />
            }
            else {
                return data[tools.stats]
            }
        }
    }

    render() {
        const { newList } = this.state
        const { tools, handleSelectionStateChange, handleAction, actionMenu } = this.props
        return (
            <React.Fragment>
                <div style={{height:40, backgroundColor:'#292C33', margin:'0px 0 0px 0px', borderRadius:'5px 5px 0px 0px'}}>

                </div>
                <div id='legend-block' className="block block-1">
                    {
                        newList && newList.length > 0 ?
                            <DataTable dataList={newList} keys={legendKeys(tools.moduleId)} onRowClick={handleSelectionStateChange} formatter={this.onFormat} actionMenu={actionMenu} handleAction={handleAction}/> : null
                    }
                </div>
            </React.Fragment>
        )
    }
}

export default Legend