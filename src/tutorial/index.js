export const organizationTutor = () => {
    return(
        {
            stepsOrg: [
                {
                    element: '.none', /* no className, center */
                    // intro: "<span style='color: red; display: flex; height: 400px !important; width: 300px !important; background-color: #7a7a7a;'>create new</span>",
                    intro: '<span>Organization page is used to create new organizations and to manage and view organizations that you are part of.</span>',
                },
                {
                    element: '.buttonCreate',
                    intro: '<span>Click “+” button to create new organization.</span>',
                },

            ],
            stepsOrgDataAdmin: [
                {
                    element: '.none',
                    intro: '<span>Organization page is used to create new organizations and to manage and view organizations that you are part of.</span>',
                },
                {
                    element: '.buttonCreate',
                    intro: '<span>Click “+” button to create new organization.</span>',
                },
                {
                    element: '.buttonActions',
                    intro: 'If you are a manager of an organization, you have privilege to Add Users to this organization.',
                },
                {
                    element: '.buttonActions',
                    intro: 'If you are a manager of an organization, you also have privilege to delete it.',
                },

            ],
            stepsOrgDataDeveloper: [
                {
                    element: '.none',
                    intro: '<span>Organization page is used to create new organizations and to manage and view organizations that you are part of.</span>',
                },
                {
                    element: '.buttonCreate',
                    intro: '<span>Click “+” button to create new organization.</span>',
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

            ],
            stepsNewOrg: [
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
            ],
            stepsNewOrg2: [
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
            ],
            stepsNewOrg3: [
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
            ],
        }
    )

}


export const flavorTutor = () => {
    return(
        {
            stepsFlavors: [
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
            ],
            stepsCreateFlavor: [
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
        }
    )

}

export const clusterInstTutor = () => {
    return(
        {
            stepsClusterInst: [
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
            ],
            stepsClusterInstReg: [
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
                    intro: 'This represents Kubernetes Master where it is responsible for maintaining the desired state for your cluster.'
                },
                {
                    element: '.formRow-13',
                    intro: '<span>What is the number of nodes you want in this cluster?<br />The nodes in a cluster are the machines that run your applications.</span>'
                },
                {
                    element: '.formButton-14',
                    intro: 'Click this button to create'
                }
            ],
            stepsApp: [
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
            ],
            stepsCreateApp: [
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
                // {
                //     element: '.formRow-13',
                //     intro: 'Option to run App on all nodes of the cluster.'
                // },
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
            ],
            stepsAppInst: [
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
            ],
            stepsCreateAppInst: [
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
            ],

            stepsFlavors: [
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
            ],
            stepsCreateFlavor: [
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
        }
    )

}

export const appTutor = () => {
    return(
        {
            stepsApp: [
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
            ],
            stepsCreateApp: [
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
                // {
                //     element: '.formRow-13',
                //     intro: 'Option to run App on all nodes of the cluster.'
                // },
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
            ],
            stepsAppInst: [
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
            ],
            stepsCreateAppInst: [
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
            ],

            stepsFlavors: [
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
            ],
            stepsCreateFlavor: [
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
        }
    )

}


export const appInstTutor = () => {
    return(
        {
            stepsAppInst: [
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
            ],
            stepsCreateAppInst: [
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
            ],

            stepsFlavors: [
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
            ],
            stepsCreateFlavor: [
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
        }
    )

}

export const UserRolesTutor = () => {
    return (
        {
            stepsZero: [
                {
                    element: '.selector1',
                    intro: 'This is a tooltip! This is a tooltip! This is a tooltip! This is a tooltip! This is a tooltip!</span>',
                },
                {
                    element: '.selector2',
                    intro: 'select organization',
                }

            ]
        }
    )
}

export const CloudletTutor = () => {
    return (
        {
            stepsCloudlet: [
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
            ],
            stepsCloudletDev: [
                {
                    element: '.createAppInst0',
                    intro: 'A Cloudlet is a set of compute resources at a particular location, provided by an Operator. Use this page to deploy, manage and view cloudlets.'
                },
                {
                    element: '.progressIndicator',
                    intro: 'Click to View Detail Progress'
                }
            ],
            stepsCloudletReg: [
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
            ],
        }
    )
}


export const CloudletPoolTutor = () => {
    return(
        {
            stepsCloudletPool: [
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
            ],
            stepsNewPool: [
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
            ],
            stepsNewPool2: [
                {
                    element: '.formRow-3',
                    intro: '<span>Add Cloudlets.</span>',
                },
                {
                    element: '.formButton-4',
                    intro: '<span>Click this button to move to Add Cloudlets.</span>',
                },
            ],
            stepsNewPool3: [
                {
                    element: '.formRow-3',
                    intro: '<span>Add Cloudlets.</span>',
                },
                {
                    element: '.formButton-4',
                    intro: '<span>Click this button to move to Link Oragnization.</span>',
                },
            ],
        }
    )

}

export const PolicyTutor = () => {
    return(
        {
            stepsPolicy: [
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
            ],
            stepsNewPolicy: [
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
                    intro: 'Enter Deploy Client Count.'
                },
                {
                    element: '.formRow-5',
                    intro: 'Enter Deploy Interval Count (s).'
                },
                {
                    element: '.formButton-6',
                    intro: 'Click this button to create Policy.'
                },
            ],
            stepsNewPolicy2: [
                {
                    element: '.formRow-4',
                    intro: 'Select Cloudlets.'
                },
                {
                    element: '.formButton-5',
                    intro: 'Click this button to add Cloudlets.'
                },
            ],
            stepsNewPolicyPrivacy: [
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
            ],
        }
    )

}

export const MonitoringTutor = () => {
    return (
        {
            stepsMonitoring: [
                {
                    element: '.none',
                    intro: 'This is monitoring page'
                },
                {
                    element: '.page_monitoring_select_area',
                    intro: 'Use these option to filter data.'
                }
            ],
            stepsMonitoringDev: [
                {
                    element: '.createAppInst0',
                    intro: 'This is monitoring page'
                },
                {
                    element: '.page_monitoring_select_area',
                    intro: 'Use these option to filter data.'
                },
                {
                    element: '.ant-dropdown-trigger',
                    intro: 'Click this button to use more function.'
                },
                {
                    element: '.draggable',
                    intro: 'You can looked the widget full Screen, edit widget, or delete widget.'
                }
            ],
            stepsMonitoringOper: [
                {
                    element: '.cloudletReg0',
                    intro: 'This is monitoring page'
                },
                {
                    element: '.page_monitoring_select_area',
                    intro: 'Use these option to filter data.'
                },
            ],
        }
    )
}

export const AuditTutor = () => {
    return (
        {
            stepsAudit: [
                {
                    element: '.none',
                    intro: 'This is audit log page.'
                },
                {
                    element: '.option_name',
                    intro: 'Use this to filter logs by type name.'
                },
                {
                    element: '.option_error_check',
                    intro: 'Click button to filter logs by normal or error.'
                },
                {
                    element: '.option_unchecked',
                    intro: 'Click icon to see unchecked error only.'
                },
                {
                    element: '.option_current',
                    intro: 'This is the current UTC time. Click "Go" button to see current logs.'
                },
                {
                    element: '.page_audit_timeline_area',
                    intro: 'This is timeline for logs. Error log marked red. Click log to view detail.'
                },
                {
                    element: '.page_audit_code',
                    intro: 'Detail View for log.'
                }
            ],
        }
    )
}

