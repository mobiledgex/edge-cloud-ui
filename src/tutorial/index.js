export const organizationTutor = () => {
    return(
        {
            stepsOrgAdmin: [
                {
                    element: '.stepOrg1',
                    // intro: "<span style='color: red; display: flex; height: 400px !important; width: 300px !important; background-color: #7a7a7a;'>create new</span>",
                    intro: '<span>Organization page is used to create new organizations and to manage and view organizations that you are part of.</span>',
                },
                {
                    element: '.stepOrg2',
                    intro: '<span>Click “New” button to create new organization.</span>',
                },


            ],
            stepsOrgDeveloper: [
                {
                    element: '.stepOrg1',
                    intro: '<span>Organization page is used to create new organizations and to manage and view organizations that you are part of.</span>',
                },
                {
                    element: '.stepOrg2',
                    intro: '<span>Click “New” button to create new organization.</span>',
                },



            ],
            stepsOrgDataAdmin: [
                {
                    element: '.stepOrgDeveloper2',
                    intro: 'Confirm the selected organization and view the role you have for this organization.',
                },
                {
                    element: '.stepOrgDeveloper3',
                    intro: 'If you are a manager of an organization, you have privilege to Add Users to this organization.',
                },
                {
                    element: '.stepOrgDeveloper4',
                    intro: 'If you are a manager of an organization, you also have privilege to delete it.',
                },

            ],
            stepsOrgDataDeveloper: [
                {
                    element: '.stepOrgDeveloper1',
                    intro: 'Click manage to select organization that you would like to manage or view.',
                },
                {
                    element: '.stepOrgDeveloper2',
                    intro: 'Confirm the selected organization and view the role you have for this organization.',
                },
                {
                    element: '.stepOrgDeveloper3',
                    intro: 'If you are a manager of an organization, you have privilege to Add Users to this organization.',
                },
                {
                    element: '.stepOrgDeveloper4',
                    intro: 'If you are a manager of an organization, you also have privilege to delete it.',
                },

            ],
            stepsNewOrg: [
                {
                    element: '.newOrg1-1',
                    intro: '<span>Select organization type.<br />You are a developer if you are a  consumer of edge computing resource.<br />You are an operator if you are a supplier of edge computing resource.</span>',
                },
                {
                    element: '.newOrg1-2',
                    intro: '<span>Enter name of your organization.</span>',
                },
                {
                    element: '.newOrg1-3',
                    intro: '<span>Enter your address.</span>',
                },
                {
                    element: '.newOrg1-4',
                    intro: '<span>Enter phone number of your organization in the following format.<br />ex) (123)456-7890, 123-456-7890, 1234567890, +121234567890</span>',
                },
                {
                    element: '.newOrg1-5',
                    intro: '<span>Enter to Create Organization.</span>',
                },
            ],
            stepsNewOrg2: [
                {
                    element: '.newOrg2-1',
                    intro: '<span>Enter Username that you would like to add to this organization.</span>',
                },
                {
                    element: '.newOrg2-2',
                    intro: '<span>Which role would you like to give this to this user?<br />Depending on the role, the user has different privilege.<br />See right for what each role can do.</span>',
                },
                {
                    element: '.newOrg2-3',
                    intro: '<span>Click “Add User” button to add this user.<br />You may continue to add users.</span>',
                },
                {
                    element: '.newOrg2-4',
                    intro: '<span>This button is used to move to Step 3: Review your Organization.</span>',
                },
            ],
            stepsNewOrg3: [
                {
                    element: '.newOrg3-1',
                    intro: 'Please read this page carefully, as it provides instruction to upload your backend image to MobiledgeX registry.',
                },
                {
                    element: '.newOrg3-2',
                    intro: 'Instruction to upload a docker image is provided here.',
                },
                {
                    element: '.newOrg3-3',
                    intro: 'Instruction to upload a VM image is provided here.',
                },
                {
                    element: '.newOrg3-4',
                    intro: 'Click this button to view the organization you have created.',
                },
            ],
            stepsClusterInst: [
                {
                    element: '.stepOrg1',
                    intro: 'Cluster Instances page is used to create new clusters and to manage and view clusters that are part of your organization.'
                },
                {
                    element: '.stepOrg2',
                    intro: '<span>Click “New” button to start creating new cluster.<br />Please note that user role of Developer Manager and Developer Contributor have permission to create clusters.</span>'
                },
                {
                    element: '.progressIndicator',
                    intro: 'Click to view progress details.'
                }
            ],
            stepsClusterInstReg: [
                {
                    element: '.cloudletReg0',
                    intro: 'Select region where you want to deploy the cluster.'
                },
                {
                    element: '.cloudletReg1',
                    intro: 'Enter name of your cluster.'
                },
                {
                    element: '.cloudletReg2',
                    intro: 'This is the name of the organization you are currently managing.'
                },
                {
                    element: '.cloudletReg3',
                    intro: 'Which operator do you want to deploy this cluster? Please select one.'
                },
                {
                    element: '.cloudletReg4',
                    intro: 'Which cloudlet(s) do you want to deploy this cluster?'
                },
                {
                    element: '.cloudletReg5',
                    intro: '<span>Do you plan to deploy your application in kubernetes cluster?<br />Or do you plan to deploy it as a plain docker container?</span>'
                },
                {
                    element: '.cloudletReg6',
                    intro: '<span>Shared IP Access represents that you would be sharing a Root Load Balancer with other developers.<br />Dedicated IP Access represents that you would have a dedicated Root Load Balancer.</span>'
                },
                {
                    element: '.cloudletReg7',
                    intro: 'What flavor is needed to run your application?'
                },
                {
                    element: '.cloudletReg8',
                    intro: 'This represents Kubernetes Master where it is responsible for maintaining the desired state for your cluster.'
                },
                {
                    element: '.cloudletReg9',
                    intro: '<span>What is the number of nodes you want in this cluster?<br />The nodes in a cluster are the machines that run your applications.</span>'
                }
            ],
            stepsApp: [
                {
                    element: '.stepOrg1',
                    intro: '<span>App belongs to developers and it provides information about their app.<br />Use this page to define your app.</span>'
                },
                {
                    element: '.stepOrg2',
                    intro: '<span>Click “New” button to  start creating new app.<br />Please note that Developer Managers and Developer Contributors have permission to create apps.</span>'
                },
                {
                    element: '.launchButton',
                    intro: '<span>Click “Launch” button to start deploying your app.</span>'
                }
            ],
            stepsCreateApp: [
                {
                    element: '.createApp0',
                    intro: 'Select region where you want to deploy.'
                },
                {
                    element: '.createApp1',
                    intro: 'Name of the organization you are currently managing.'
                },
                {
                    element: '.createApp2',
                    intro: 'App name.'
                },
                {
                    element: '.createApp3',
                    intro: 'App version.'
                },
                {
                    element: '.createApp4',
                    intro: 'Deployment type (kubernetes, docker, or vm)'
                },
                {
                    element: '.createApp5',
                    intro: 'Skip this.. As it gets autofilled.'
                },
                {
                    element: '.createApp6',
                    intro: '<div style="height: 200px; overflow-y: auto;"><span>URI of where image resides. If image has not be uploaded to MobiledgeX registry, please use following instructions.<br />If your image is docker, please upload your image with your MobiledgeX Account Credentials to our docker registry using the following docker commands.<br /><br />$ docker login -u <username> docker.mobiledgex.net<br />$ docker tag <your application> docker.mobiledgex.net/<organization name>/images/<application name>:<version><br />$ docker push docker.mobiledgex.net/<organization name>/images/<application name>:<version><br />$ docker logout docker.mobiledgex.net<br /><br />If you image is VM, please upload your image with your MobiledgeX Account Credentials to our VM registry using the following curl command.<br /><br />$ curl -u<username> -T <path_to_file> "https://artifactory.mobiledgex.net/artifactory/repo-<organization name>/<target_file_path>" --progress-bar -o <upload status filename></span></div>'
                },
                {
                    element: '.createApp7',
                    intro: 'Public Key of this app used for client-side authentication.'
                },
                {
                    element: '.createApp8',
                    intro: 'Hardware resource requirement to run this app.'
                },
                {
                    element: '.createApp9',
                    intro: 'protocol:port pairs that the app listens on'
                },
                {
                    element: '.createApp10',
                    intro: 'Official FQDN the app uses to connect by default'
                },
                {
                    element: '.createApp11',
                    intro: 'Android package name of the app.'
                },
                {
                    element: '.createApp12',
                    intro: 'Option to run App on all nodes of the cluster.'
                },
                {
                    element: '.createApp13',
                    intro: 'Command that the container runs to start service.'
                },
                {
                    element: '.createApp14',
                    intro: '<span>Deployment manifest is the deployment specific manifest file/config.<br />For docker deployment, this file can be a docker-compose or docker run. For kubernetes deployment, this file can be a kubernetes yaml or helm chart file.<br />For VM deployment, this file can be a cloud config.</span>'
                }
            ],
            stepsAppInst: [
                {
                    element: '.stepOrg1',
                    intro: 'Use App Instances page to deploy, manage and view app instances.'
                },
                {
                    element: '.stepOrg2',
                    intro: '<span>Click “New” button to start deploying new app instance.<br />Please note that user role of Developer Manager and Developer Contributor have permission to deploy app instances.</span>'
                },
                {
                    element: '.progressIndicator',
                    intro: 'Click to View Detail Progress'
                }
            ],
            stepsCreateAppInst: [
                {
                    element: '.createAppInst0',
                    intro: 'Select region where you want to deploy.'
                },
                {
                    element: '.createAppInst1',
                    intro: 'The name of the organization you are currently managing.'
                },
                {
                    element: '.createAppInst2',
                    intro: 'The name of the application to deploy.'
                },
                {
                    element: '.createAppInst3',
                    intro: 'The version of the application to deploy.'
                },
                {
                    element: '.createAppInst4',
                    intro: 'Which operator do you want to deploy this applicaton? Please select one.'
                },
                {
                    element: '.createAppInst5',
                    intro: 'Which cloudlet(s) do you want to deploy this application?'
                },
                {
                    element: '.createAppInst6',
                    intro: 'If you have yet to create a cluster, you can select this to auto create cluster instance.'
                },
                {
                    element: '.createAppInst7',
                    intro: 'Name of cluster instance to deploy this application.'
                },
                {
                    element: '.createAppInst8',
                    intro: 'Please add instruction here'
                },
            ],

            stepsFlavors: [
                {
                    element: '.createAppInst0',
                    intro: 'Please add instruction here'
                },
                {
                    element: '.stepOrg2',
                    intro: 'Please add instruction here'
                }
            ],
            stepsCreateFlavor: [
                {
                    element: '.createFlavorForm0',
                    intro: 'Please add instruction here'
                },
                {
                    element: '.createFlavorForm1',
                    intro: 'Please add instruction here'
                },
                {
                    element: '.createFlavorForm2',
                    intro: 'Please add instruction here'
                },
                {
                    element: '.createFlavorForm3',
                    intro: 'Please add instruction here'
                },
                {
                    element: '.createFlavorForm4',
                    intro: 'Please add instruction here'
                },
                {
                    element: '.saveButton',
                    intro: 'Please add instruction here'
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
                    element: '.stepOrg2',
                    intro: 'Click “New” button to start deploying new cloudlet. Please note that Operator Managers and Operator Contributors have permission to deploy cloudlets.'
                },
                {
                    element: '.progressIndicator',
                    intro: 'Click to View Detail Progress'
                }
            ],
            stepsCloudletReg: [
                {
                    element: '.cloudletReg0',
                    intro: 'Select region where you want to deploy.'
                },
                {
                    element: '.cloudletReg1',
                    intro: 'Name of the cloudlet.'
                },
                {
                    element: '.cloudletReg2',
                    intro: 'Name of the organization you are currently managing.'
                },
                {
                    element: '.cloudletReg3',
                    intro: 'Cloudlet Location'
                },
                {
                    element: '.cloudletReg4',
                    intro: '<span>Ip Support indicates the type of public IP support provided by the Cloudlet.<br />Static IP support indicates a set of static public IPs are available for use, and managed by the Controller.<br />Dynamic indicates the Cloudlet uses a DHCP server to provide public IP addresses, and the controller has no control over which IPs are assigned.</span>'
                },
                {
                    element: '.cloudletReg5',
                    intro: 'Number of dynamic IPs available for dynamic IP support.'
                },
                {
                    element: '.cloudletReg6',
                    intro: 'Physical infrastructure cloudlet name.'
                },
                {
                    element: '.cloudletReg7',
                    intro: 'Supported list of cloudlet types.'
                }
            ],
        }
    )
}
