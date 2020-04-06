import { fields } from "./services/model/format"

export const TYPE_JSON = 'JSON'
export const TYPE_JSON_NEW_LINE = 'JSON_NEW_LINE'
export const ADD_CLOUDLET = 'AddCloudlet'
export const DELETE_CLOUDLET = 'DeleteCloudlet'
export const ADD_ORGANIZATION = 'AddOrganization'
export const DELETE_ORGANIZATION = 'DeleteOrganization'
export const DEPLOYMENT_TYPE_DOCKER = 'docker';
export const DEPLOYMENT_TYPE_KUBERNETES = 'kubernetes';
export const DEPLOYMENT_TYPE_VM = 'vm';
export const DEPLOYMENT_TYPE_HELM = 'helm';
export const ACCESS_TYPE_DEFAULT_FOR_DEPLOYMENT = 'Default For Deployment';
export const ACCESS_TYPE_DIRECT = 'Direct';
export const ACCESS_TYPE_LOAD_BALANCER = 'Load Balancer';
export const IMAGE_TYPE_DOCKER = 'Docker';
export const IMAGE_TYPE_QCOW = 'Qcow';
export const IMAGE_TYPE_HELM = 'Helm';
export const IP_ACCESS_DEDICATED = 'Dedicated';
export const IP_ACCESS_SHARED = 'Shared';
export const DELETE = 'Delete'
export const SELECT = 'Select'
export const CLOUDLET = 'Cloudlet'
export const CLUSTER_INST = 'ClusterInst'
export const APP_INST = 'AppInst'
export const PLATFORM_TYPE_FAKE = 'Fake'
export const PLATFORM_TYPE_DIND = 'DIND'
export const PLATFORM_TYPE_OPEN_STACK = 'Openstack'
export const PLATFORM_TYPE_AZURE = 'Azure'
export const PLATFORM_TYPE_OPEN_GCP= 'GCP'
export const PLATFORM_TYPE_EDGEBOX = 'Edgebox'
export const PLATFORM_TYPE_FAKEINFRA = 'Fakeinfra'
export const IP_SUPPORT_DYNAMIC = 'Dynamic'
export const LIVENESS_STATIC = 'Static'
export const APP = 'App'
export const YES = 'YES'

export const ADMIN_MANAGER = 'AdminManager'
export const OPERATOR_MANAGER = 'OperatorManager'
export const OPERATOR_CONTRIBUTOR = 'OperatorContributor'

export const getHeight = (height) => {
    return window.innerHeight - (height ? height : 85)
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
        default:
            return id
    }
}

export const accessType = (id) => {
    switch (id) {
        case 0:
            return ACCESS_TYPE_DEFAULT_FOR_DEPLOYMENT
        case 1:
            return ACCESS_TYPE_DIRECT
        case 2:
            return ACCESS_TYPE_LOAD_BALANCER
        case ACCESS_TYPE_DEFAULT_FOR_DEPLOYMENT:
            return 0
        case ACCESS_TYPE_DIRECT:
            return 1
        case ACCESS_TYPE_LOAD_BALANCER:
            return 2
        default:
            return id
    }
}

export const imageType = (id) => {
    switch (id) {
        case 1:
            return IMAGE_TYPE_DOCKER
        case IMAGE_TYPE_DOCKER:
            return 1
        case 2:
            return IMAGE_TYPE_QCOW
        case IMAGE_TYPE_QCOW:
            return 2
        case 3:
            return IMAGE_TYPE_HELM
        case IMAGE_TYPE_HELM:
            return 3
        default:
            return id
    }
}

export const configType = (id) => {
    switch (id) {
        case 'Helm Customization':
            return 'hemlCustomizationYaml'
        case 'Environment Variables':
            return 'envVarsYaml'
        case 'hemlCustomizationYaml':
            return 'Helm Customization'
        case 'envVarsYaml':
            return 'Environment Variables'
        default:
            return id
    }
}


export const IPSupport = (id) => {
    switch (id) {
        case 2:
            return IP_SUPPORT_DYNAMIC
        case IP_SUPPORT_DYNAMIC:
            return 2
        default:
            return id
    }
}


export const PlatformType = (id) => {
    switch (id) {
        case 0:
            return PLATFORM_TYPE_FAKE
        case 1:
            return PLATFORM_TYPE_DIND
        case 2:
            return PLATFORM_TYPE_OPEN_STACK
        case 3:
            return PLATFORM_TYPE_AZURE
        case 4:
            return PLATFORM_TYPE_OPEN_GCP
        case 5:
            return PLATFORM_TYPE_EDGEBOX
        case 6:
            return PLATFORM_TYPE_FAKEINFRA
        case PLATFORM_TYPE_FAKE:
            return 0
        case PLATFORM_TYPE_DIND:
            return 1
        case PLATFORM_TYPE_OPEN_STACK:
            return 2
        case PLATFORM_TYPE_AZURE:
            return 3
        case PLATFORM_TYPE_OPEN_GCP:
            return 4
        case PLATFORM_TYPE_EDGEBOX:
            return 5
        case PLATFORM_TYPE_FAKEINFRA:
            return 6
        default:
            return id
    }
}

export const liveness = (id) => {
    switch (id) {
        case 1:
            return LIVENESS_STATIC
        case LIVENESS_STATIC:
            return 1
        default:
            return id
    }
}


export const getTip = (field) => {
    switch (field) {
        case fields.region:
            return 'Select region where you want to deploy.'
        case fields.organizationName:
            return 'The name of the organization you are currently managing.'
        case fields.appName:
            return 'The name of the application to deploy.'
        case fields.version:
            return 'The version of the application to deploy.'
        case fields.operatorName:
            return 'Which operator do you want to deploy this applicaton? Please select one.'
        case fields.cloudletName:
            return 'Which cloudlet(s) do you want to deploy this application ?'
        case fields.autoClusterInstance:
            return 'If you have yet to create a cluster, you can select this to auto create cluster instance.'
        case fields.clusterName:
            return 'Name of cluster instance to deploy this application.'
        default:
            return null
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