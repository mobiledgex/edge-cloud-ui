import React from 'react'

const Legend = (props) => {
    return (
        <React.Fragment>
            {([{ label: 'Total Allotted', color: '#3C815D' }, { label: 'Total Used', color: '#1B432C' }, { label: 'Allotted', color: '#FFF' }, { label: 'Used', color: '#42A46E' }]).map((value, i) => {
                return (
                    <div key={i} style={{ display: 'inline-block', marginRight: 10 }}>
                        <div style={{ height: 10, width: 10, backgroundColor: value.color, display: 'inline-block', marginRight: 5 }}></div>
                        {value.label}
                    </div>
                )
            })}
        </React.Fragment>
    )
}

export default Legend