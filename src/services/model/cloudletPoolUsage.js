
import * as formatter from './format'
import { appUsageKeys } from './appInstUsage'
import { clusterUsageKeys } from './clusterInstUsage'
import { CLOUDLET_POOL_USAGE } from './endPointTypes'
const fields = formatter.fields

export const cloudletPoolUsage = (pool, range) => {
    let data = {
        region: pool[fields.region],
        starttime: range.starttime,
        endtime: range.endtime,
        cloudletpool: {
            name: pool[fields.poolName],
            organization: pool[fields.operatorName]
        }
    }
    return { method: CLOUDLET_POOL_USAGE, data: data, keys: [appUsageKeys, clusterUsageKeys] }
}

