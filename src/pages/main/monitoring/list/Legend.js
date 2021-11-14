import React from 'react'
import BulletChart from '../charts/bullet/BulletChart';
import BulletLegend from '../charts/bullet/Legend';
import DataTable from './DataTable'
import { onlyNumeric } from '../../../../utils/string_utils';
import { legendKeys } from '../services/service';
class Legend extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            newList: undefined
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.data) {
            const { data, search } = props
            let newList = []
            data && Object.keys(data).forEach(key => {
                if (search.length === 0 || key.includes(search)) {
                    newList.push({ ...data[key], key })
                }
            })
            return { newList }
        }
        return null
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.refresh !== nextProps.refresh
    }

    onFormat = (column, data) => {
        if (data && data.infraAllotted) {
            let value = { title: "", subtitle: "", ranges: [data.infraAllotted ? onlyNumeric(data.infraAllotted) : 0], measures: [data.used ? onlyNumeric(data.used) : 0, data.allotted ? onlyNumeric(data.allotted) : 0], markers: [data.infraUsed ? onlyNumeric(data.infraUsed) : 0] }
            return <BulletChart data={[value]} />
        }
    }

    render() {
        const { newList } = this.state
        const { moduleId, handleSelectionStateChange } = this.props
        return (
            <React.Fragment>
                {
                    newList && newList.length > 0 ?
                        <DataTable dataList={newList} keys={legendKeys(moduleId)} onRowClick={handleSelectionStateChange} formatter={this.onFormat}>
                            {/* <BulletLegend /> */}
                        </DataTable> : null
                }
            </React.Fragment>
        )
    }
}

export default Legend