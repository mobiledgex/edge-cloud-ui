//Organization
export const SHOW_ORG = "org/show";
export const CREATE_ORG = "org/create";
export const UPDATE_ORG = "org/update";
export const DELETE_ORG = "org/delete";
export const EDGEBOX_ONLY = 'restricted/org/update';
//Accounts
export const SHOW_ACCOUNTS = "user/show";
export const DELETE_ACCOUNT = "user/delete";
export const SETTING_LOCK = "restricted/user/update";
export const CURRENT_USER = "user/current";
export const SHOW_CONTROLLER = "controller/show"
//User
export const SHOW_USERS = "role/showuser";
export const DELETE_USER = "role/removeuser";
export const ADD_USER_ROLE = "role/adduser";
export const SHOW_ROLE = "role/assignment/show";
export const UPDATE_USER = "user/update"
export const NEW_PASSWORD = "user/newpass"
//Audit
export const SHOW_AUDIT_ORG = "audit/showorg";
export const EVENTS_FIND = 'events/find'
export const EVENTS_SHOW = 'events/show'
//Cloudlet
export const SHOW_CLOUDLET = "ctrl/ShowCloudlet";
export const DELETE_CLOUDLET = "ctrl/DeleteCloudlet";
export const UPDATE_CLOUDLET = "ctrl/UpdateCloudlet";
export const CREATE_CLOUDLET = "ctrl/CreateCloudlet";
export const SHOW_ORG_CLOUDLET = "orgcloudlet/show";
export const STREAM_CLOUDLET = "ctrl/StreamCloudlet";
export const GET_CLOUDLET_MANIFEST = "ctrl/GetCloudletManifest";
export const REVOKE_ACCESS_KEY = 'ctrl/RevokeAccessKey'
export const GET_CLOUDLET_RESOURCE_QUOTA_PROPS = 'ctrl/GetCloudletResourceQuotaProps'
//Cloudlet Info
export const SHOW_CLOUDLET_INFO = "ctrl/ShowCloudletInfo";
export const SHOW_ORG_CLOUDLET_INFO = "orgcloudletinfo/show";
//Cluster Instance
export const SHOW_CLUSTER_INST = "ctrl/ShowClusterInst";
export const CREATE_CLUSTER_INST = "ctrl/CreateClusterInst";
export const UPDATE_CLUSTER_INST = "ctrl/UpdateClusterInst";
export const DELETE_CLUSTER_INST = "ctrl/DeleteClusterInst";
export const STREAM_CLUSTER_INST = "ctrl/StreamClusterInst";
//App
export const SHOW_APP = "ctrl/ShowApp";
export const CREATE_APP = "ctrl/CreateApp";
export const UPDATE_APP = "ctrl/UpdateApp";
export const DELETE_APP = "ctrl/DeleteApp";
//App Instance
export const SHOW_APP_INST = "ctrl/ShowAppInst";
export const CREATE_APP_INST = "ctrl/CreateAppInst";
export const UPDATE_APP_INST = "ctrl/UpdateAppInst";
export const DELETE_APP_INST = "ctrl/DeleteAppInst";
export const STREAM_APP_INST = "ctrl/StreamAppInst";
export const REFRESH_APP_INST = 'ctrl/RefreshAppInst';
//Flavor
export const SHOW_FLAVOR = "ctrl/ShowFlavor";
export const CREATE_FLAVOR = "ctrl/CreateFlavor";
export const DELETE_FLAVOR = "ctrl/DeleteFlavor"
//CloudletPool
export const SHOW_CLOUDLET_POOL = "ctrl/ShowCloudletPool";
export const CREATE_CLOUDLET_POOL = "ctrl/CreateCloudletPool";
export const UPDATE_CLOUDLET_POOL = "ctrl/UpdateCloudletPool";
export const DELETE_CLOUDLET_POOL = "ctrl/DeleteCloudletPool";
export const SHOW_POOL_ACCESS_INVITATION = 'cloudletpoolaccessinvitation/show'
export const CREATE_POOL_ACCESS_INVITATION = 'cloudletpoolaccessinvitation/create'
export const DELETE_POOL_ACCESS_INVITATION = 'cloudletpoolaccessinvitation/delete'
export const SHOW_POOL_ACCESS_CONFIRMATION = 'cloudletpoolaccessresponse/show'
export const CREATE_POOL_ACCESS_CONFIRMATION = 'cloudletpoolaccessresponse/create'
export const DELETE_POOL_ACCESS_CONFIRMATION = 'cloudletpoolaccessresponse/delete'
export const SHOW_POOL_ACCESS_GRANTED = 'cloudletpoolaccessgranted/show'
export const SHOW_POOL_ACCESS_PENDING = 'cloudletpoolaccesspending/show'
//Auto Provisioning Policy
export const SHOW_AUTO_PROV_POLICY = "ctrl/ShowAutoProvPolicy";
export const CREATE_AUTO_PROV_POLICY = "ctrl/CreateAutoProvPolicy";
export const UPDATE_AUTO_PROV_POLICY = "ctrl/UpdateAutoProvPolicy";
export const DELETE_AUTO_PROV_POLICY = "ctrl/DeleteAutoProvPolicy";
export const ADD_AUTO_PROV_POLICY_CLOUDLET = "ctrl/AddAutoProvPolicyCloudlet";
export const REMOVE_AUTO_PROV_POLICY_CLOUDLET = "ctrl/RemoveAutoProvPolicyCloudlet";
//Auto Scale Policy
export const SHOW_AUTO_SCALE_POLICY = "ctrl/ShowAutoScalePolicy";
export const CREATE_AUTO_SCALE_POLICY = "ctrl/CreateAutoScalePolicy";
export const UPDATE_AUTO_SCALE_POLICY = "ctrl/UpdateAutoScalePolicy";
export const DELETE_AUTO_SCALE_POLICY = "ctrl/DeleteAutoScalePolicy";
//Trust Policy
export const SHOW_TRUST_POLICY = "ctrl/ShowTrustPolicy";
export const UPDATE_TRUST_POLICY = "ctrl/UpdateTrustPolicy";
export const CREATE_TRUST_POLICY = "ctrl/CreateTrustPolicy";
export const DELETE_TRUST_POLICY = "ctrl/DeleteTrustPolicy";
//Billing Org
export const SHOW_BILLING_ORG = 'billingorg/show'
export const CREATE_BILLING_ORG = 'billingorg/create'
export const UPDATE_BILLING_ORG = 'billingorg/update'
export const BILLING_ORG_ADD_CHILD = 'billingorg/addchild'
export const BILLING_ORG_REMOVE_CHILD = 'billingorg/removechild'
export const DELETE_BILLING_ORG = 'billingorg/delete'
export const INVOICE_BILLING = 'billingorg/invoice'
//Terminal
export const RUN_COMMAND = "ctrl/RunCommand";
export const SHOW_LOGS = "ctrl/ShowLogs";
export const SHOW_CONSOLE = "ctrl/RunConsole";
//Reports
export const SHOW_REPORTER = 'reporter/show'
export const CREATE_REPORTER = 'reporter/create'
export const UPDATE_REPORTER = 'reporter/update'
export const DELETE_REPORTER = 'reporter/delete'
export const SHOW_REPORTS = 'report/show'
export const DOWNLOAD_REPORT = 'report/download'
export const GENERATE_REPORT = 'report/generate'
//Monitoring
export const SHOW_APP_INST_CLIENT = 'ctrl/ShowAppInstClient'
export const CLOUDLET_EVENT_LOG_ENDPOINT = 'events/cloudlet';
export const CLOUDLET_METRICS_ENDPOINT = 'metrics/cloudlet';
export const CLOUDLET_METRICS_USAGE_ENDPOINT = 'metrics/cloudlet/usage'
export const CLUSTER_METRICS_ENDPOINT = 'metrics/cluster';
export const APP_INST_METRICS_ENDPOINT = 'metrics/app';
export const CLIENT_METRICS_ENDPOINT = 'metrics/clientapiusage'
export const CLUSTER_EVENT_LOG_ENDPOINT = 'events/cluster';
export const APP_INST_EVENT_LOG_ENDPOINT = 'events/app';
export const APP_INST_USAGE_ENDPOINT = 'usage/app'
export const CLUSTER_INST_USAGE_ENDPOINT = 'usage/cluster'
//Alerts
export const SHOW_ALERT = 'ctrl/ShowAlert'
export const ALERT_SHOW_RECEIVER = 'alertreceiver/show'
export const ALERT_CREATE_RECEIVER = 'alertreceiver/create'
export const ALERT_DELETE_RECEIVER = 'alertreceiver/delete'




