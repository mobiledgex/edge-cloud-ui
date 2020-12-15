import { getUserRole } from "../services/model/format"

import * as constant from '../constant'

export const HELP_ORG_LIST = 'OrgList'
export const HELP_ORG_REG_1 = 'OrgREG_1'
export const HELP_ORG_REG_2 = 'OrgREG_1'
export const HELP_ORG_REG_3 = 'OrgREG_3'
export const HELP_CLOUDLET_LIST = 'clouldetList'
export const HELP_CLOUDLET_REG = 'clouldetListReg'
export const HELP_CLUSTER_INST_LIST = 'clusterInstList'
export const HELP_CLUSTER_INST_REG = 'clusterInstReg'
export const HELP_APP_LIST = 'AppList'
export const HELP_APP_REG = 'AppReg'
export const HELP_APP_INST_LIST = 'AppInstList'
export const HELP_APP_INST_REG = 'AppInstReg'
export const HELP_FLAVOR_LIST = 'FlavorList'
export const HELP_FLAVOR_REG = 'FlavorReg'
export const HELP_CLOUDLET_POOL_LIST = 'CloudletPoolList'
export const HELP_CLOUDLET_POOL_REG_1 = 'CloudletPoolReg_1'
export const HELP_CLOUDLET_POOL_REG_2 = 'CloudletPoolReg_2'
export const HELP_CLOUDLET_POOL_REG_3 = 'CloudletPoolReg_3'
export const HELP_POLICY_LIST = 'policyList'
export const HELP_SCALE_POLICY = 'autoscalepolicy'
export const HELP_AUTO_PROV_REG_1 = 'autoProvReg_1'
export const HELP_AUTO_PROV_REG_2 = 'autoProvReg_2'
export const HELP_PRIVACY_POLICY_REG = 'privacyPolicyReg'
export const HELP_MONITORING = 'monitoringAdmin'
export const HELP_USER_ROLES = 'userRoles'
export const HELP_ALERTS = 'alerts'

export const userRoles = (type, isDoc) => {
    if (isDoc) {
        return 'https://developers.mobiledgex.com/product-overview/console-guide-developer/org-users#view-users'
    }
}

export const monitoring = (type, isDoc) => {
    if (isDoc) {
        return 'https://developers.mobiledgex.com/product-overview/console-guide-developer/monitoring'
    }
    else {
        if (getUserRole().includes(constant.ADMIN)) {
            return [
                {
                    element: '.none',
                    intro: 'Use this page to review valuable metrics about your application deployment. The data can help you scale up your deployments based on user activity. This page also provides analytics to help you improve your application’s usage and performance. Data and metrics rendered are specific to organizations rather than by application or cluster-specific instances.'
                },
                {
                    element: '.page_monitoring_select_area',
                    intro: 'Filter by cluster only or select a cluster along with the application instance(s) running on that cluster. You can drill further down to each application instance associated to that cluster to view individual performances of each application instance.'
                }
            ]
        }
        else if (getUserRole().includes(constant.DEVELOPER)) {
            return [
                {
                    element: '.createAppInst0',
                    intro: 'Use this page to review valuable metrics about your application deployment. The data can help you scale up your deployments based on user activity. This page also provides analytics to help you improve your application’s usage and performance. Data and metrics rendered are specific to organizations rather than by application or cluster-specific instances.'
                },
                {
                    element: '.page_monitoring_select_area',
                    intro: 'Filter by cluster only or select a cluster along with the application instance(s) running on that cluster. You can drill further down to each application instance associated to that cluster to view individual performances of each application instance.'
                },
                {
                    element: '.ant-dropdown-trigger',
                    intro: 'Additional filters are available to customize your view.'
                },
                {
                    element: '.draggable',
                    intro: `Select the expansion icon to display a full view of each tile or click the trash icon to remove the tile from view. To re-add tiles, under the additional filter menu, click Add Item. `
                }
            ]
        }
        else if (getUserRole().includes(constant.OPERATOR)) {
            return [
                {
                    element: '.cloudletReg0',
                    intro: 'Use this page to review valuable metrics about your application deployment. The data can help you scale up your deployments based on user activity. This page also provides analytics to help you improve your application’s usage and performance. Data and metrics rendered are specific to organizations rather than by application or cluster-specific instances.'
                },
                {
                    element: '.page_monitoring_select_area',
                    intro: 'Filter by cluster only or select a cluster along with the application instance(s) running on that cluster. You can drill further down to each application instance associated to that cluster to view individual performances of each application instance.'
                }]
        }
        else {
            return null
        }
    }
}

const autoScalePolicy = (type, isDoc) =>{
    if (isDoc) {
        if (getUserRole().includes(constant.DEVELOPER)) {
            return 'https://developers.mobiledgex.com/product-overview/console-guide-developer/manage-app-policies#auto-scale-policy'
        }
    }
    else
    {
        return [
            {
                element: '.createAppInst0',
                intro: 'This is Auto Scale Policy page'
            },
            {
                element: '.buttonCreate',
                intro: 'Click “+” button to add new policy.'
            }
        ]
    }
}

const policy = (type, isDoc) => {
    if (isDoc) {
        if (getUserRole().includes(constant.DEVELOPER)) {
            return 'https://developers.mobiledgex.com/product-overview/console-guide-developer/manage-app-policies'
        }
    }
    switch (type) {
        case HELP_POLICY_LIST:
            return [
                {
                    element: '.createAppInst0',
                    intro: 'This is Policy page'
                },
                {
                    element: '.buttonCreate',
                    intro: 'Click “+” button to add new policy.'
                },
                {
                    element: '.buttonActions',
                    intro: 'Click this button to perform "Add Cloudlets", "Delete Cloudlets" and "Delete".'
                }
            ]
        case HELP_AUTO_PROV_REG_1:
            return [
                {
                    element: '.formRow-1',
                    intro: 'Select Region.'
                },
                {
                    element: '.formRow-2',
                    intro: 'Select Organization.'
                },
                {
                    element: '.formRow-3',
                    intro: 'Enter Auto Provisioning Policy Name.'
                },
                {
                    element: '.formRow-4',
                    intro: 'Enter Deploy Request Count.'
                },
                {
                    element: '.formRow-5',
                    intro: 'Enter Deploy Interval Count (s).'
                },
                {
                    element: '.formButton-6',
                    intro: 'Click this button to create Policy.'
                },
            ]
        case HELP_AUTO_PROV_REG_2:
            return [
                {
                    element: '.formRow-4',
                    intro: 'Select Cloudlets.'
                },
                {
                    element: '.formButton-5',
                    intro: 'Click this button to add Cloudlets.'
                },
            ]
        case HELP_PRIVACY_POLICY_REG: [
            {
                element: '.formRow-1',
                intro: 'Select Region.',
            },
            {
                element: '.formRow-2',
                intro: 'Select Organization.',
            },
            {
                element: '.formRow-3',
                intro: 'Enter Privacy Policy Name.',
            },
            {
                element: '.formRow-4',
                intro: 'Check for Full Isolation.',
            },
            {
                element: '.formHeader-5',
                intro: 'Enter Outbound Security Rules.',
            },
            {
                element: '.formButton-6',
                intro: 'Click this button to create Policy.'
            },
        ]
    }
}

const org = (type, isDoc) => {
    if (isDoc) {
        if (getUserRole() === undefined || getUserRole().includes(constant.DEVELOPER)) {
            return 'https://developers.mobiledgex.com/product-overview/console-guide-developer/org-users'
        }
    }
    else {
        switch (type) {
            case HELP_ORG_LIST:
                if (getUserRole() === constant.ADMIN_MANAGER) {
                    return [
                        {
                            element: '.none',
                            intro: '<span>Organization page is used to create new organizations and to manage and view organizations that you are part of.</span>',
                        },
                        {
                            element: '.buttonCreate',
                            intro: '<span>Click “Create Organization to Run Apps on Telco Edge (Developers) / Create Organization to Host Telco Edge (Operators)” button to create new organization.</span>',
                        },
                        {
                            element: '.buttonActions',
                            intro: 'If you are a manager of an organization, you have privilege to Add Users to this organization.',
                        },
                        {
                            element: '.buttonActions',
                            intro: 'If you are a manager of an organization, you also have privilege to delete it.',
                        },

                    ]
                }
                else {
                    return [
                        {
                            element: '.none',
                            intro: '<span>Organization page is used to create new organizations and to manage and view organizations that you are part of.</span>',
                        },
                        {
                            element: '.buttonCreate',
                            intro: '<span>Click “Create Organization to Run Apps on Telco Edge (Developers) / Create Organization to Host Telco Edge (Operators)” button to create new organization.</span>',
                        },
                        {
                            element: '.buttonManage',
                            intro: 'Click manage to select organization that you would like to manage or view.',
                        },
                        {
                            element: '.orgName',
                            intro: 'Confirm the selected organization and view the role you have for this organization.',
                        },
                        {
                            element: '.buttonActions',
                            intro: 'If you are a manager of an organization, you have privilege to Add Users to this organization.',
                        },
                        {
                            element: '.buttonActions',
                            intro: 'If you are a manager of an organization, you also have privilege to delete it.',
                        },

                    ]
                }
            case HELP_ORG_REG_1:
                return [
                    {
                        element: '.formRow-1',
                        intro: '<span>Select organization type.<br />You are a developer if you are a  consumer of edge computing resource.<br />You are an operator if you are a supplier of edge computing resource.</span>',
                    },
                    {
                        element: '.formRow-2',
                        intro: '<span>Enter name of your organization.</span>',
                    },
                    {
                        element: '.formRow-3',
                        intro: '<span>Enter your address.</span>',
                    },
                    {
                        element: '.formRow-4',
                        intro: '<span>Enter phone number of your organization in the following format.<br />ex) (123)456-7890, 123-456-7890, 1234567890, +121234567890</span>',
                    },
                    {
                        element: '.formRow-5',
                        intro: '<span>Public Image</span>',
                    },
                    {
                        element: '.formButton-6',
                        intro: '<span>Click the button to move to next step.</span>',
                    },
                ]
            case HELP_ORG_REG_2:
                return [
                    {
                        element: '.formRow-1',
                        intro: '<span>Enter Username that you would like to add to this organization.</span>',
                    },
                    {
                        element: '.formRow-4',
                        intro: '<span>Which role would you like to give this to this user?<br />Depending on the role, the user has different privilege.<br />See right for what each role can do.</span>',
                    },
                    {
                        element: '.formButton-5',
                        intro: '<span>Click “Add User” button to add this user.<br />You may continue to add users.</span>',
                    },
                    {
                        element: '.formButton-6',
                        intro: '<span>This button is used to move to Step 3: Review your Organization.</span>',
                    },
                ]
            case HELP_ORG_REG_3:
                return [
                    {
                        element: '.MuiTable-root',
                        intro: 'Please read this page carefully, as it provides instruction to upload your backend image to MobiledgeX registry.',
                    },
                    // {
                    //     element: '.newOrg3-2',
                    //     intro: 'Instruction to upload a docker image is provided here.',
                    // },
                    // {
                    //     element: '.newOrg3-3',
                    //     intro: 'Instruction to upload a VM image is provided here.',
                    // },
                    {
                        element: '.newOrg3-4',
                        intro: 'Click this button to view the organization you have created.',
                    },
                ]
            default: return null
        }
    }
}
const cloudletPool = (type, isDoc) => {
    if (isDoc) {
        if (getUserRole().includes(constant.OPERATOR)) {
            return 'https://operators.mobiledgex.com/edge-cloud-console-guide-for-operators#create-cloudlet-pool'
        }
    }
    else {
        switch (type) {
            case HELP_CLOUDLET_POOL_LIST:
                return [
                    {
                        element: '.createAppInst0',
                        intro: 'This is cloudlet pool page.'
                    },
                    {
                        element: '.buttonCreate',
                        intro: 'Click “+” button to add new cloudlet Pool.'
                    },
                    {
                        element: '.buttonActions',
                        intro: 'Click this button to perform "Add Cloudlet", "Link Organization" and "Delete".'
                    }
                ]
            case HELP_CLOUDLET_POOL_REG_1:
                return [
                    {
                        element: '.formRow-1',
                        intro: '<span>Select Region.</span>',
                    },
                    {
                        element: '.formRow-2',
                        intro: '<span>Select PoolName.</span>',
                    },
                    {
                        element: '.formButton-3',
                        intro: '<span>Click the button to move to next step.</span>',
                    },
                ]
            case HELP_CLOUDLET_POOL_REG_2:
                return [
                    {
                        element: '.formRow-3',
                        intro: '<span>Add Cloudlets.</span>',
                    },
                    {
                        element: '.formButton-4',
                        intro: '<span>Click this button to move to Add Cloudlets.</span>',
                    },
                ]
            case HELP_CLOUDLET_POOL_REG_3:
                return [
                    {
                        element: '.formRow-3',
                        intro: '<span>Add Cloudlets.</span>',
                    },
                    {
                        element: '.formButton-4',
                        intro: '<span>Click this button to move to Link Oragnization.</span>',
                    },
                ]
            default: return null
        }
    }
}

const flavor = (type, isDoc) => {
    if (isDoc) {
        if (getUserRole().includes(constant.DEVELOPER)) {
            return 'https://developers.mobiledgex.com/product-overview/console-guide-developer/flavors'
        }
    }
    else {
        switch (type) {
            case HELP_FLAVOR_LIST:
                if (getUserRole() === constant.ADMIN_MANAGER) {
                    return [
                        {
                            element: '.none',
                            intro: 'This is page for manage Flavors'
                        },
                        {
                            element: '.buttonCreate',
                            intro: '<span>Click “+” button to create new Flavors.</span>'
                        },
                        {
                            element: '.buttonActions',
                            intro: 'Click this button to perform "Delete".'
                        }
                    ]
                }
                else {
                    return null
                }
            case HELP_FLAVOR_REG:
                return [
                    {
                        element: '.formRow-1',
                        intro: 'Select region where you want to deploy.'
                    },
                    {
                        element: '.formRow-2',
                        intro: 'Name of the Flavor.'
                    },
                    {
                        element: '.formRow-3',
                        intro: 'Enter RAM Size.'
                    },
                    {
                        element: '.formRow-4',
                        intro: 'Enter number of vCPUs.'
                    },
                    {
                        element: '.formRow-5',
                        intro: 'Enter Disk Space.'
                    },
                    {
                        element: '.formRow-6',
                        intro: 'Check for GPU.'
                    },
                    {
                        element: '.formButton-7',
                        intro: 'Click this button to create'
                    }

                ]
            default:
                return null
        }
    }
}

const appInst = (type, isDoc) => {
    if (isDoc) {
        if (getUserRole().includes(constant.DEVELOPER)) {
            return 'https://developers.mobiledgex.com/product-overview/console-guide-developer/app-instances'
        }
    }
    else {
        switch (type) {
            case HELP_APP_INST_LIST:
                return [
                    {
                        element: '.none',
                        intro: 'Use App Instances page to deploy, manage and view app instances.'
                    },
                    {
                        element: '.buttonCreate',
                        intro: '<span>Click “+” button to start deploying new app instance.<br />Please note that user role of Developer Manager and Developer Contributor have permission to deploy app instances.</span>'
                    },
                    {
                        element: '.progressIndicator',
                        intro: 'Click to View Detail Progress'
                    },
                    {
                        element: '.buttonActions',
                        intro: 'Click this button to perform "Delete" or "Terminal".'
                    }
                ]
            case HELP_APP_INST_REG:
                return [
                    {
                        element: '.formRow-1',
                        intro: 'Select region where you want to deploy.'
                    },
                    {
                        element: '.formRow-2',
                        intro: 'The name of the organization you are currently managing.'
                    },
                    {
                        element: '.formRow-3',
                        intro: 'The name of the application to deploy.'
                    },
                    {
                        element: '.formRow-4',
                        intro: 'The version of the application to deploy.'
                    },
                    {
                        element: '.formRow-5',
                        intro: 'Which operator do you want to deploy this applicaton? Please select one.'
                    },
                    {
                        element: '.formRow-6',
                        intro: 'Which cloudlet(s) do you want to deploy this application?'
                    },
                    // {
                    //     element: '.formRow-7',
                    //     intro: 'If you have yet to create a cluster, you can select this to auto create cluster instance.'
                    // },
                    // {
                    //     element: '.formRow-8',
                    //     intro: 'Name of cluster instance to deploy this application.'
                    // },
                    // {
                    //     element: '.formRow-9',
                    //     intro: 'Please add instruction here'
                    // },
                    {
                        element: '.formButton-12',
                        intro: 'Click this button to create'
                    }
                ]
        }
    }
}

const app = (type, isDoc) => {
    if (isDoc) {
        if (getUserRole().includes(constant.DEVELOPER)) {
            return 'https://developers.mobiledgex.com/product-overview/console-guide-developer/app-definition'
        }
    }
    else {
        switch (type) {
            case HELP_APP_LIST:
                return [
                    {
                        element: '.none',
                        intro: '<span>App belongs to developers and it provides information about their app.<br />Use this page to define your app.</span>'
                    },
                    {
                        element: '.buttonCreate',
                        intro: '<span>Click “+” button to  start creating new app.<br />Please note that Developer Managers and Developer Contributors have permission to create apps.</span>'
                    },
                    {
                        element: '.buttonActions',
                        intro: '<span>Click this button and select “Create Instance” button to start deploying your app.</span>'
                    }
                ]
            case HELP_APP_REG:
                return [
                    {
                        element: '.formRow-1',
                        intro: 'Select region where you want to deploy.'
                    },
                    {
                        element: '.formRow-2',
                        intro: 'Name of the organization you are currently managing.'
                    },
                    {
                        element: '.formRow-3',
                        intro: 'App name.'
                    },
                    {
                        element: '.formRow-4',
                        intro: 'App version.'
                    },
                    {
                        element: '.formRow-5',
                        intro: 'Deployment type (kubernetes, docker, or vm)'
                    },
                    {
                        element: '.formRow-7',
                        intro: 'Skip this.. As it gets autofilled.'
                    },
                    {
                        element: '.formRow-8',
                        intro: '<div style="height: 200px; overflow-y: auto;"><span>URI of where image resides. If image has not be uploaded to MobiledgeX registry, please use following instructions.<br />If your image is docker, please upload your image with your MobiledgeX Account Credentials to our docker registry using the following docker commands.<br /><br />$ docker login -u <username> docker.mobiledgex.net<br />$ docker tag <your application> docker.mobiledgex.net/<organization name>/images/<application name>:<version><br />$ docker push docker.mobiledgex.net/<organization name>/images/<application name>:<version><br />$ docker logout docker.mobiledgex.net<br /><br />If you image is VM, please upload your image with your MobiledgeX Account Credentials to our VM registry using the following curl command.<br /><br />$ curl -u<username> -T <path_to_file> "https://artifactory.mobiledgex.net/artifactory/repo-<organization name>/<target_file_path>" --progress-bar -o <upload status filename></span></div>'
                    },
                    {
                        element: '.formRow-9',
                        intro: 'Public Key of this app used for client-side authentication.'
                    },
                    {
                        element: '.formRow-10',
                        intro: 'Hardware resource requirement to run this app.'
                    },
                    {
                        element: '.formRow-13',
                        intro: 'Official FQDN the app uses to connect by default'
                    },
                    {
                        element: '.formRow-14',
                        intro: 'Android package name of the app.'
                    },
                    {
                        element: '.formRow-16',
                        intro: 'Command that the container runs to start service.'
                    },
                    {
                        element: '.formRow-17',
                        intro: '<span>Deployment manifest is the deployment specific manifest file/config.<br />For docker deployment, this file can be a docker-compose or docker run. For kubernetes deployment, this file can be a kubernetes yaml or helm chart file.<br />For VM deployment, this file can be a cloud config.</span>'
                    },
                    {
                        element: '.formHeader-19',
                        intro: 'protocol:port pairs that the app listens on'
                    },
                    {
                        element: '.formButton-22',
                        intro: 'Click this button to create'
                    }
                ]
            default:
                return null
        }
    }
}

const clusterInst = (type, isDoc) => {
    if (isDoc) {
        if (getUserRole().includes(constant.DEVELOPER)) {
            return 'https://developers.mobiledgex.com/product-overview/console-guide-developer/clusters'
        }
    }
    else {
        switch (type) {
            case HELP_CLUSTER_INST_LIST:
                return [
                    {
                        element: '.none',
                        intro: 'Cluster Instances page is used to create new clusters and to manage and view clusters that are part of your organization.'
                    },
                    {
                        element: '.buttonCreate',
                        intro: '<span>Click “+” button to start creating new cluster.<br />Please note that user role of Developer Manager and Developer Contributor have permission to create clusters.</span>'
                    },
                    {
                        element: '.progressIndicator',
                        intro: 'Click to view progress details.'
                    },
                    {
                        element: '.buttonActions',
                        intro: 'Click this button to perform "Update" and "Delete".'
                    }
                ]
            case HELP_CLUSTER_INST_REG:
                return [
                    {
                        element: '.formRow-1',
                        intro: 'Select region where you want to deploy the cluster.'
                    },
                    {
                        element: '.formRow-2',
                        intro: 'Enter name of your cluster.'
                    },
                    {
                        element: '.formRow-3',
                        intro: 'This is the name of the organization you are currently managing.'
                    },
                    {
                        element: '.formRow-4',
                        intro: 'Which operator do you want to deploy this cluster? Please select one.'
                    },
                    {
                        element: '.formRow-5',
                        intro: 'Which cloudlet(s) do you want to deploy this cluster?'
                    },
                    {
                        element: '.formRow-6',
                        intro: '<span>Do you plan to deploy your application in kubernetes cluster?<br />Or do you plan to deploy it as a plain docker container?</span>'
                    },
                    {
                        element: '.formRow-7',
                        intro: '<span>Shared IP Access represents that you would be sharing a Root Load Balancer with other developers.<br />Dedicated IP Access represents that you would have a dedicated Root Load Balancer.</span>'
                    },
                    {
                        element: '.formRow-9',
                        intro: 'What flavor is needed to run your application?'
                    },
                    {
                        element: '.formRow-12',
                        intro: 'This represents Kubernetes Master where it is responsible for maintaining the desired state for your cluster.'
                    },
                    {
                        element: '.formRow-13',
                        intro: '<span>What is the number of workers you want in this cluster?<br />The workers in a cluster are the machines that run your applications.</span>'
                    },
                    {
                        element: '.formButton-14',
                        intro: 'Click this button to create'
                    }
                ]
            default:
                return null
        }
    }
}

const cloudlet = (type, isDoc) => {
    if (isDoc) {
        if (getUserRole().includes(constant.DEVELOPER)) {
            return 'https://developers.mobiledgex.com/product-overview/console-guide-developer/cloudlets'
        }
    }
    else {
        switch (type) {
            case HELP_CLOUDLET_LIST:
                if (getUserRole() !== constant.DEVELOPER) {
                    return [
                        {
                            element: '.createAppInst0',
                            intro: 'A Cloudlet is a set of compute resources at a particular location, provided by an Operator. Use this page to deploy, manage and view cloudlets.'
                        },
                        {
                            element: '.buttonCreate',
                            intro: 'Click “+” button to start deploying new cloudlet. Please note that Operator Managers and Operator Contributors have permission to deploy cloudlets.'
                        },
                        {
                            element: '.progressIndicator',
                            intro: 'Click to View Detail Progress'
                        },
                        {
                            element: '.buttonActions',
                            intro: 'Click this button to perform "Update" and "Delete".'
                        }
                    ]
                }
                else {
                    return null
                }
            case HELP_CLOUDLET_REG:
                return [
                    {
                        element: '.formRow-1',
                        intro: 'Select region where you want to deploy.'
                    },
                    {
                        element: '.formRow-2',
                        intro: 'Name of the cloudlet.'
                    },
                    {
                        element: '.formRow-3',
                        intro: 'Name of the organization you are currently managing.'
                    },
                    {
                        element: '.formRow-4',
                        intro: 'Cloudlet Location'
                    },
                    {
                        element: '.formRow-5',
                        intro: '<span>Ip Support indicates the type of public IP support provided by the Cloudlet.<br />Static IP support indicates a set of static public IPs are available for use, and managed by the Controller.<br />Dynamic indicates the Cloudlet uses a DHCP server to provide public IP addresses, and the controller has no control over which IPs are assigned.</span>'
                    },
                    {
                        element: '.formRow-6',
                        intro: 'Number of dynamic IPs available for dynamic IP support.'
                    },
                    {
                        element: '.formRow-7',
                        intro: 'Physical infrastructure cloudlet name.'
                    },
                    {
                        element: '.formRow-9',
                        intro: 'Supported list of cloudlet types.'
                    },
                    {
                        element: '.formButton-12',
                        intro: '<span>Click the button to create.</span>',
                    },
                ]
            default:
                return null
        }
    }
}

const alerts = (type, isDoc) => {
    if (isDoc) {
        if (getUserRole().includes(constant.DEVELOPER)) {
            return 'https://developers.mobiledgex.com/product-overview/console-guide-developer/monitoring#alerts'
        }
    }
}

export const tutor = (type, isDoc) => {
    switch (type) {
        case HELP_CLOUDLET_LIST:
        case HELP_CLOUDLET_REG:
            return cloudlet(type, isDoc)
        case HELP_CLUSTER_INST_LIST:
        case HELP_CLUSTER_INST_REG:
            return clusterInst(type, isDoc)
        case HELP_APP_LIST:
        case HELP_APP_REG:
            return app(type, isDoc)
        case HELP_APP_INST_LIST:
        case HELP_APP_INST_REG:
            return appInst(type, isDoc)
        case HELP_FLAVOR_LIST:
        case HELP_FLAVOR_REG:
            return flavor(type, isDoc)
        case HELP_CLOUDLET_POOL_LIST:
        case HELP_CLOUDLET_POOL_REG_1:
        case HELP_CLOUDLET_POOL_REG_2:
        case HELP_CLOUDLET_POOL_REG_3:
            return cloudletPool(type, isDoc)
        case HELP_ORG_LIST:
        case HELP_ORG_REG_1:
        case HELP_ORG_REG_2:
        case HELP_ORG_REG_3:
            return org(type, isDoc)
        case HELP_SCALE_POLICY:
            return autoScalePolicy(type, isDoc)
        case HELP_POLICY_LIST:
        case HELP_AUTO_PROV_REG_1:
        case HELP_AUTO_PROV_REG_2:
        case HELP_PRIVACY_POLICY_REG:
            return policy(type, isDoc)
        case HELP_MONITORING:
            return monitoring(type, isDoc)
        case HELP_USER_ROLES:
            return userRoles(type, isDoc)
        case HELP_ALERTS:
            return alerts(type, isDoc)
    }
}