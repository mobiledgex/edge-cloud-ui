import React, { useEffect } from 'react'
import DragButton from './DragButton'
import BulletChart from '../charts/bullet/BulletChart';

class Legend extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            maxHeight: 0,
            dataList: [],
            bulletChartList: undefined
        }
        this.tableRef = React.createRef()
    }

    static getDerivedStateFromProps(props, state) {
        if (props.data) {
            const { regions, data } = props
            let bulletChartList = [{}]
            regions.forEach(region => {
                // //{ "title": "", "subtitle": "", "ranges": [300], "measures": [10, 50], "markers": [200] },
                let dataObject = data[region]
                dataObject && Object.keys(dataObject).forEach(key => {
                    let data = dataObject[key]
                    if (data.cpu) {
                        let quota = data.cpu
                        bulletChartList.push({ title: "", subtitle: "", ranges: [quota.infraAllotted ? quota.infraAllotted : 0], measures: [quota.used ? quota.used : 0, quota.allotted ? quota.allotted : 0], markers: [quota.infraUsed ? quota.infraUsed : 0] })
                    }

                })
            })
            return { bulletChartList }
        }
        return null
    }

    render() {
        const { maxHeight, bulletChartList } = this.state
         console.log(bulletChartList)
        return (
            <React.Fragment>
                <div className="block block-1" ref={this.tableRef}>
                    <div style={{width:200}}>
                        {bulletChartList ? <BulletChart data={bulletChartList}/> : null}
                    </div>
                </div>
                <div style={{ position: 'relative', height: 4 }}>
                    <DragButton height={maxHeight} />
                </div>
            </React.Fragment>
        )
    }

    componentDidUpdate(preProps, preState) {
        if (this.tableRef.current && this.state.maxHeight !== this.tableRef.current.scrollHeight) {
            this.setState({ maxHeight: this.tableRef.current.scrollHeight })
        }
    }
}

export default Legend