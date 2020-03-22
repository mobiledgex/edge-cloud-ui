export const TYPE_JSON = 'JSON'
export const ADD_CLOUDLET = 'AddCloudlet'
export const DELETE_CLOUDLET = 'DeleteCloudlet'
export const ADD_ORGANIZATION = 'AddOrganization'
export const DELETE_ORGANIZATION = 'DeleteOrganization'
export const DEPLOYMENT_TYPE_DOCKER = 'docker';
export const DEPLOYMENT_TYPE_KUBERNETES = 'kubernetes';
export const DEPLOYMENT_TYPE_VM = 'VM';
export const IP_ACCESS_DEDICATED = 'Dedicated';
export const IP_ACCESS_SHARED = 'Shared';
export const DELETE = 'Delete'
export const SELECT = 'Select'
export const CLOUDLET = 'Cloudlet'
export const CLUSTER_INST = 'ClusterInst'
export const APP_INST = 'AppInst'
export const APP = 'App'
export const YES = 'YES'

export const getHeight = () => {
    return window.innerHeight - 85
}

export const IPAccessLabel = (id) => {
    switch (id) {
        case 1:
            return 'Dedicated'
        case 3:
            return 'Shared'
        case 'Dedicated':
            return 1
        case 'Shared':
            return 3
    }
}

/**
 * Filter Data
 * remove data which are in selectedDatas
*/
export const filterData = (selectedDatas, dataList, field) => {
    if (selectedDatas && selectedDatas.length > 0) {
        for (let i = 0; i < selectedDatas.length; i++) {
            let selectedData = selectedDatas[i];
            for (let j = 0; j < dataList.length; j++) {
                let filterData = dataList[j]
                if (selectedData[field] === filterData[field]) {
                    dataList.splice(j, 1)
                    break;
                }
            }
        }
    }
    return dataList
}