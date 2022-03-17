import React from 'react'
import { PARENT_APP_INST, PARENT_CLUSTER_INST } from '../../../../helper/constant/perpetual'
import { localFields } from "../../../../services/fields";

const GroupView = (props) => {
    const { id, data } = props
    return (
        <b>
            {
                id === PARENT_APP_INST ? `App: ${data[localFields.appName]} [${data[localFields.version]}] - ${data[localFields.region]}` :
                id === PARENT_CLUSTER_INST ? `Cloudlet: ${data[localFields.cloudletName]} [${data[localFields.operatorName]}]` : 
                null
            }
        </b>
    )
}

export default GroupView