import * as formatter from '../../model/format'
import { endpoint } from '../../../helper/constant'
let fields = formatter.fields;

export const showNetwork = (data) => {
    let requestData = {
        Network: {
            key: {
                cloudlet_key: { organization: data[fields.operatorName], name: data[fields.cloudletName] }
            }
        },
        region: data[fields.region]
    }
    return { method: endpoint.SHOW_NETWORKS, data: requestData }
}