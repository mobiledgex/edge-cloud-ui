export const NoData = (props) => (
    <div className="event-list-main" align="center" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
        <div align="left" className="event-list-header">
            <h3 className='chart-header'>{props.header}</h3>
        </div>
        <h3 style={{ padding: '90px 0px' }} className='chart-header'><b>No Data</b></h3>
    </div>
)