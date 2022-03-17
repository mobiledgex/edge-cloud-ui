import React from 'react'
import { PARENT_APP_INST, PARENT_CLUSTER_INST } from '../../../../helper/constant/perpetual'
import { fields } from '../../../../services'

const GroupView = (props) => {
    const { id, data } = props
    return (
        <b>
            {
                id === PARENT_APP_INST ? `App: ${data[fields.appName]} [${data[fields.version]}] - ${data[fields.region]}` :
                id === PARENT_CLUSTER_INST ? `Cloudlet: ${data[fields.cloudletName]} [${data[fields.operatorName]}]` : 
                null
            }
        </b>
    )
}

export default GroupView