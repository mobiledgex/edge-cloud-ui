import { Grid } from '@material-ui/core'
import React from 'react'

const Resources = (props) => {
    const {data} = props
    return (
        <div className='resources'>
            {
                Object.keys(data).map((key) => {
                    let item = data[key]
                    return (
                        item.label ? <div key={key} className='mex-card' style={{marginBottom:10, padding:10, display:'flex', alignItems:'center'}}>
                            <img src='/assets/icons/ip_icon.svg' width={30}/>
                            <h4 style={{ fontWeight: 900, fontSize:13 }}>{`${item.label} - ${item.value}`}</h4>
                        </div> :  null
                    )
                })
            }
        </div>
    )
}
export default Resources