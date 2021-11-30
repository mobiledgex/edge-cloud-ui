import React from 'react'
import { fields } from '../../../../../services/model/format'

const AppGroupView = (props) => {
    const { data } = props
    return (
        <b>
            {`App: ${data[fields.appName]} [${data[fields.version]}]`}
        </b>
    )
}

export default AppGroupView