//Login
export const LOGIN = "login";
export const VERIFY_EMAIL = "verifyemail";
export const RESEND_VERIFY = "resendverify";
export const RESET_PASSWORD = "passwordreset";
export const RESET_PASSWORD_REQUEST = "passwordresetrequest";
export const CREATE_USER = "usercreate";
export const PUBLIC_CONFIG = 'publicconfig'
//ws token
export const WS_TOKEN = 'auth/wstoken';
//Organization
export const SHOW_ORG = 'auth/org/show';
export const CREATE_ORG = 'auth/org/create';
export const UPDATE_ORG = 'auth/org/update';
export const DELETE_ORG = 'auth/org/delete';
export const EDGEBOX_ONLY = 'auth/restricted/org/update';
//Accounts
export const SHOW_ACCOUNTS = 'auth/user/show';
export const DELETE_ACCOUNT = 'auth/user/delete';
export const SETTING_LOCK = 'auth/restricted/user/update';
export const CURRENT_USER = 'auth/user/current';
export const SHOW_CONTROLLER = 'auth/controller/show'
//User
export const SHOW_USERS = 'auth/role/showuser';
export const DELETE_USER = 'auth/role/removeuser';
export const ADD_USER_ROLE = 'auth/role/adduser';
export const SHOW_ROLE = 'auth/role/assignment/show';
export const UPDATE_USER = 'auth/user/update';
export const NEW_PASSWORD = 'auth/user/newpass';
//Audit
export const SHOW_AUDIT_ORG = 'auth/audit/showorg';
export const EVENTS_FIND = 'auth/events/find';
export const EVENTS_SHOW = 'auth/events/show';
//Cloudlet
export const SHOW_CLOUDLET = 'auth/ctrl/ShowCloudlet';
export const DELETE_CLOUDLET = 'auth/ctrl/DeleteCloudlet';
export const UPDATE_CLOUDLET = 'auth/ctrl/UpdateCloudlet';
export const CREATE_CLOUDLET = 'auth/ctrl/CreateCloudlet';
export const SHOW_ORG_CLOUDLET = 'auth/orgcloudlet/show';
export const STREAM_CLOUDLET = 'auth/ctrl/StreamCloudlet';
export const GET_CLOUDLET_MANIFEST = 'auth/ctrl/GetCloudletManifest';
export const REVOKE_ACCESS_KEY = 'auth/ctrl/RevokeAccessKey';
export const GET_CLOUDLET_RESOURCE_QUOTA_PROPS = 'auth/ctrl/GetCloudletResourceQuotaProps';
export const GET_CLOUDLET_PROPS = 'auth/ctrl/GetCloudletProps';
export const SHOW_NODE = 'auth/ctrl/ShowNode'
export const ADD_CLOUDLET_ALLIANCE_ORG = 'auth/ctrl/AddCloudletAllianceOrg';
export const REMOVE_CLOUDLET_ALLIANCE_ORG = 'auth/ctrl/RemoveCloudletAllianceOrg';
//Cloudlet Info
export const SHOW_CLOUDLET_INFO = 'auth/ctrl/ShowCloudletInfo';
export const SHOW_ORG_CLOUDLET_INFO = 'auth/orgcloudletinfo/show';
//Cluster Instance
export const SHOW_CLUSTER_INST = 'auth/ctrl/ShowClusterInst';
export const CREATE_CLUSTER_INST = 'auth/ctrl/CreateClusterInst';
export const UPDATE_CLUSTER_INST = 'auth/ctrl/UpdateClusterInst';
export const DELETE_CLUSTER_INST = 'auth/ctrl/DeleteClusterInst';
export const STREAM_CLUSTER_INST = 'auth/ctrl/StreamClusterInst';

/************************************
 **************App API***************
 ************************************/
export const SHOW_APP = 'auth/ctrl/ShowApp';
export const CREATE_APP = 'auth/ctrl/CreateApp';
export const UPDATE_APP = 'auth/ctrl/UpdateApp';
export const DELETE_APP = 'auth/ctrl/DeleteApp';
// Discover cloudlets supporting deployments of App.DefaultFlavor
export const SHOW_CLOUDLETS_FOR_APP = 'auth/ctrl/ShowCloudletsForAppDeployment'
// Add an AlertPolicy to the App
export const ADD_APP_ALERT_POLICY = 'auth/ctrl/AddAppAlertPolicy'
//Remove an AlertPolicy from the App
export const REMOVE_APP_ALERT_POLICY = 'auth/ctrl/RemoveAppAlertPolicy'
//App Instance
export const SHOW_APP_INST = 'auth/ctrl/ShowAppInst';
export const CREATE_APP_INST = 'auth/ctrl/CreateAppInst';
export const UPDATE_APP_INST = 'auth/ctrl/UpdateAppInst';
export const DELETE_APP_INST = 'auth/ctrl/DeleteAppInst';
export const STREAM_APP_INST = 'auth/ctrl/StreamAppInst';
export const REFRESH_APP_INST = 'auth/ctrl/RefreshAppInst';
export const REQUEST_APP_INST_LATENCY = 'auth/ctrl/RequestAppInstLatency';
//Flavor
export const SHOW_FLAVOR = 'auth/ctrl/ShowFlavor';
export const CREATE_FLAVOR = 'auth/ctrl/CreateFlavor';
export const DELETE_FLAVOR = 'auth/ctrl/DeleteFlavor';
export const SHOW_FLAVORS_FOR_CLOUDLET = 'auth/ctrl/ShowFlavorsForCloudlet';
//GPU Driver
export const SHOW_GPU_DRIVER = 'auth/ctrl/ShowGPUDriver';
export const CREATE_GPU_DRIVER = 'auth/ctrl/CreateGPUDriver';
export const UPDATE_GPU_DRIVER = 'auth/ctrl/UpdateGPUDriver';
export const DELETE_GPU_DRIVER = 'auth/ctrl/DeleteGPUDriver'
export const GET_GPU_DRIVER_BUILD_URL = 'auth/ctrl/GetGPUDriverBuildURL';
export const ADD_GPU_DRIVER_BUILD = 'auth/ctrl/AddGPUDriverBuild';
export const REMOVE_GPU_DRIVER_BUILD = 'auth/ctrl/RemoveGPUDriverBuild';
//CloudletPool
export const SHOW_CLOUDLET_POOL = 'auth/ctrl/ShowCloudletPool';
export const CREATE_CLOUDLET_POOL = 'auth/ctrl/CreateCloudletPool';
export const UPDATE_CLOUDLET_POOL = 'auth/ctrl/UpdateCloudletPool';
export const DELETE_CLOUDLET_POOL = 'auth/ctrl/DeleteCloudletPool';
export const SHOW_POOL_ACCESS_INVITATION = 'auth/cloudletpoolaccessinvitation/show';
export const CREATE_POOL_ACCESS_INVITATION = 'auth/cloudletpoolaccessinvitation/create';
export const DELETE_POOL_ACCESS_INVITATION = 'auth/cloudletpoolaccessinvitation/delete';
export const SHOW_POOL_ACCESS_CONFIRMATION = 'auth/cloudletpoolaccessresponse/show';
export const CREATE_POOL_ACCESS_CONFIRMATION = 'auth/cloudletpoolaccessresponse/create';
export const DELETE_POOL_ACCESS_CONFIRMATION = 'auth/cloudletpoolaccessresponse/delete';
export const SHOW_POOL_ACCESS_GRANTED = 'auth/cloudletpoolaccessgranted/show';
export const SHOW_POOL_ACCESS_PENDING = 'auth/cloudletpoolaccesspending/show';
//Auto Provisioning Policy
export const SHOW_AUTO_PROV_POLICY = 'auth/ctrl/ShowAutoProvPolicy';
export const CREATE_AUTO_PROV_POLICY = 'auth/ctrl/CreateAutoProvPolicy';
export const UPDATE_AUTO_PROV_POLICY = 'auth/ctrl/UpdateAutoProvPolicy';
export const DELETE_AUTO_PROV_POLICY = 'auth/ctrl/DeleteAutoProvPolicy';
export const ADD_AUTO_PROV_POLICY_CLOUDLET = 'auth/ctrl/AddAutoProvPolicyCloudlet';
export const REMOVE_AUTO_PROV_POLICY_CLOUDLET = 'auth/ctrl/RemoveAutoProvPolicyCloudlet';
//Auto Scale Policy
export const SHOW_AUTO_SCALE_POLICY = 'auth/ctrl/ShowAutoScalePolicy';
export const CREATE_AUTO_SCALE_POLICY = 'auth/ctrl/CreateAutoScalePolicy';
export const UPDATE_AUTO_SCALE_POLICY = 'auth/ctrl/UpdateAutoScalePolicy';
export const DELETE_AUTO_SCALE_POLICY = 'auth/ctrl/DeleteAutoScalePolicy';
//Trust Policy
export const SHOW_TRUST_POLICY = 'auth/ctrl/ShowTrustPolicy';
export const UPDATE_TRUST_POLICY = 'auth/ctrl/UpdateTrustPolicy';
export const CREATE_TRUST_POLICY = 'auth/ctrl/CreateTrustPolicy';
export const DELETE_TRUST_POLICY = 'auth/ctrl/DeleteTrustPolicy';
//Billing Org
export const SHOW_BILLING_ORG = 'auth/billingorg/show';
export const CREATE_BILLING_ORG = 'auth/billingorg/create';
export const UPDATE_BILLING_ORG = 'auth/billingorg/update';
export const BILLING_ORG_ADD_CHILD = 'auth/billingorg/addchild';
export const BILLING_ORG_REMOVE_CHILD = 'auth/billingorg/removechild';
export const DELETE_BILLING_ORG = 'auth/billingorg/delete';
export const INVOICE_BILLING = 'auth/billingorg/invoice';
//Terminal
export const RUN_COMMAND = 'auth/ctrl/RunCommand';
export const SHOW_LOGS = 'auth/ctrl/ShowLogs';
export const SHOW_CONSOLE = 'auth/ctrl/RunConsole';
//Reports
export const SHOW_REPORTER = 'auth/reporter/show';
export const CREATE_REPORTER = 'auth/reporter/create';
export const UPDATE_REPORTER = 'auth/reporter/update';
export const DELETE_REPORTER = 'auth/reporter/delete';
export const SHOW_REPORTS = 'auth/report/show';
export const DOWNLOAD_REPORT = 'auth/report/download';
export const GENERATE_REPORT = 'auth/report/generate';
//Monitoring
export const SHOW_APP_INST_CLIENT = 'auth/ctrl/ShowAppInstClient';
export const CLOUDLET_EVENT_LOG_ENDPOINT = 'auth/events/cloudlet';
export const CLOUDLET_METRICS_ENDPOINT = 'auth/metrics/cloudlet';
export const CLOUDLET_METRICS_USAGE_ENDPOINT = 'auth/metrics/cloudlet/usage';
export const APP_INST_METRICS_ENDPOINT = 'auth/metrics/app';
export const APP_INST_EVENT_LOG_ENDPOINT = 'auth/events/app';
export const APP_INST_USAGE_ENDPOINT = 'auth/usage/app';
export const METRICS_CLIENT_APP_USAGE = 'auth/metrics/clientappusage'
export const METRICS_CLIENT_CLOUDLET_USAGE = 'auth/metrics/clientcloudletusage'
export const CLUSTER_METRICS_ENDPOINT = 'auth/metrics/cluster';
export const CLUSTER_EVENT_LOG_ENDPOINT = 'auth/events/cluster';
export const CLUSTER_INST_USAGE_ENDPOINT = 'auth/usage/cluster';
export const CLIENT_METRICS_ENDPOINT = 'auth/metrics/clientapiusage'
//Alerts
export const SHOW_ALERT = 'auth/ctrl/ShowAlert';
export const ALERT_SHOW_RECEIVER = 'auth/alertreceiver/show';
export const ALERT_CREATE_RECEIVER = 'auth/alertreceiver/create';
export const ALERT_DELETE_RECEIVER = 'auth/alertreceiver/delete';
export const SHOW_ALERT_POLICY = 'auth/ctrl/ShowAlertPolicy';
export const CREATE_ALERT_POLICY = 'auth/ctrl/CreateAlertPolicy';
export const DELETE_ALERT_POLICY = 'auth/ctrl/DeleteAlertPolicy';
export const UPDATE_ALERT_POLICY = 'auth/ctrl/UpdateAlertPolicy';

//Network
export const CREATE_NETWORKS = 'auth/ctrl/CreateNetwork'
export const SHOW_NETWORKS = 'auth/ctrl/ShowNetwork';
export const UPDATE_NETWORKS = 'auth/ctrl/UpdateNetwork'
export const DELETE_NETWORKS = 'auth/ctrl/DeleteNetwork'

//Federation
export const SHOW_FEDERATION = 'auth/federation/show';
export const SHOW_FEDERATION_PARTNER_ZONE = 'auth/federation/partner/zone/show';
export const CREATE_FEDERATION = 'auth/federation/create'
export const DELETE_FEDERATION = 'auth/federation/delete'
export const REGISTER_FEDERATION = 'auth/federation/register'
export const DEREGISTER_FEDERATION = 'auth/federation/deregister'
export const SET_API_KEY = 'auth/federation/partner/setapikey'


//Federator
export const SHOW_FEDERATOR = 'auth/federator/self/show'
export const CREATE_FEDERATOR = 'auth/federator/self/create'
export const UPDATE_FEDERATOR = 'auth/federator/self/update'
export const DELETE_FEDERATOR = 'auth/federator/self/delete'
export const GENERATE_API_KEY = 'auth/federator/self/generateapikey'

//Zones
export const SHOW_SELF_ZONES = 'auth/federator/self/zone/show'
export const SHOW_FEDERATOR_SELF_ZONE = '/auth/federation/self/zone/show'
export const CREATE_FEDERATOR_SELF_ZONE = 'auth/federator/self/zone/create'
export const DELETE_FEDERATOR_SELF_ZONE = 'auth/federator/self/zone/delete'
export const SELF_ZONES_SHARE = 'auth/federator/self/zone/share'
export const SELF_ZONES_UNSHARE = 'auth/federator/self/zone/unshare'
