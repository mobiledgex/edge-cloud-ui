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
                    element: '.stepOrg1',
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
                }
            ],
            stepsClusterInstReg: [
                {
                    element: '.clusterInstReg0',
                    intro: 'Select region where you want to deploy the cluster.'
                },
                {
                    element: '.clusterInstReg1',
                    intro: 'Enter name of your cluster.'
                },
                {
                    element: '.clusterInstReg2',
                    intro: 'This is the name of the organization you are currently managing.'
                },
                {
                    element: '.clusterInstReg3',
                    intro: 'Which operator do you want to deploy this cluster? Please select one.'
                },
                {
                    element: '.clusterInstReg4',
                    intro: 'Which cloudlet(s) do you want to deploy this cluster?'
                },
                {
                    element: '.clusterInstReg5',
                    intro: '<span>Do you plan to deploy your application in kubernetes cluster?<br />Or do you plan to deploy it as a plain docker container?</span>'
                },
                {
                    element: '.clusterInstReg6',
                    intro: '<span>Shared IP Access represents that you would be sharing a Root Load Balancer with other developers.<br />Dedicated IP Access represents that you would have a dedicated Root Load Balancer.</span>'
                },
                {
                    element: '.clusterInstReg7',
                    intro: 'What flavor is needed to run your application?'
                },
                {
                    element: '.clusterInstReg8',
                    intro: 'This represents Kubernetes Master where it is responsible for maintaining the desired state for your cluster.'
                },
                {
                    element: '.clusterInstReg9',
                    intro: '<span>What is the number of nodes you want in this cluster?<br />The nodes in a cluster are the machines that run your applications.</span>'
                },
                {
                    element: '.clusterInstReg10',
                    intro: 'Click this button to start creating.'
                }
            ],
            stepsApp: [
                {
                    element: '.stepOrg1',
                    intro: 'Please add instruction here'
                },
                {
                    element: '.stepOrg2',
                    intro: 'Please add instruction here'
                }
            ],
            stepsAppInst: [
                {
                    element: '.stepOrg1',
                    intro: 'Please add instruction here'
                },
                {
                    element: '.stepOrg2',
                    intro: 'Please add instruction here'
                }
            ],
            stepsCreateAppInst: [
                {
                    element: '.createAppInst0',
                    intro: 'Please add instruction here'
                },
                {
                    element: '.createAppInst1',
                    intro: 'Please add instruction here'
                },
                {
                    element: '.createAppInst2',
                    intro: 'Please add instruction here'
                },
                {
                    element: '.createAppInst3',
                    intro: 'Please add instruction here'
                },
                {
                    element: '.createAppInst4',
                    intro: 'Please add instruction here'
                },
                {
                    element: '.createAppInst5',
                    intro: 'Please add instruction here'
                },

                {
                    element: '.createAppInst6',
                    intro: 'Please add instruction here'
                },
                {
                    element: '.createAppInst7',
                    intro: 'Please add instruction here'
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
                    // intro: "<span style='color: red; display: flex; height: 400px !important; width: 300px !important; background-color: #7a7a7a;'>create new</span>",
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
                    intro: 'Please add instruction here'
                },
                {
                    element: '.stepOrg2',
                    intro: 'Please add instruction here'
                }
            ],
            stepsCloudletReg: [
                {
                    element: '.cloudletReg0',
                    intro: 'Please add instruction here'
                },
                {
                    element: '.cloudletReg1',
                    intro: 'Please add instruction here'
                },
                {
                    element: '.cloudletReg2',
                    intro: 'Please add instruction here'
                },
                {
                    element: '.cloudletReg3',
                    intro: 'Please add instruction here'
                },
                {
                    element: '.cloudletReg4',
                    intro: 'Please add instruction here'
                }
            ],
        }
    )
}
