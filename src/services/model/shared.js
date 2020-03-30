import React from 'react'
import { Popup, Icon } from 'semantic-ui-react';
import { fields } from './format';

export const additionalDetail = (data) => {
    return (
        data[fields.type] === 'developer' || 'Developer' ?
            <div style={{ margin: 20, color: 'white' }}>
                <div className="newOrg3-2">
                    <div>
                        If your image is docker, please upload your image with your MobiledgeX Account Credentials to our docker registry using the following docker commands.
                </div>
                    <br></br>
                    <div>
                        {`$ docker login -u <username> docker.mobiledgex.net`}
                    </div>
                    <div>
                        {`$ docker tag <your application> docker.mobiledgex.net/` + String(data[fields.organizationName]).toLowerCase() + `/images/<application name>:<version>`}
                    </div>
                    <div>
                        {`$ docker push docker.mobiledgex.net/` + String(data[fields.organizationName]).toLowerCase() + `/images/<application name>:<version>`}
                    </div>
                    <div>
                        $ docker logout docker.mobiledgex.net
                </div>
                </div>
                <br></br>
                <div className="newOrg3-3">
                    <div>
                        If you image is VM, please upload your image with your MobiledgeX Account Credentials to our VM registry using the following curl command.
                </div>
                    <br />
                    <div>
                        {'$ curl -u<username> -T <path_to_file>'} <code style={{ color: '#76ff03' }}>{`"https://artifactory.mobiledgex.net/artifactory/repo-${data[fields.organizationName]}/<target_file_path>"`}</code> {'--progress-bar -o <upload status filename>'}
                    </div>
                </div>
            </div> : null)
}

const getStateStatus = (id) => {
    switch (id) {
        case 0:
            return "Tracked State Unknown"
        case 1:
            return "Not Present"
        case 2:
            return "Create Requested"
        case 3:
            return "Creating"
        case 4:
            return "Create Error"
        case 5:
            return "Ready"
        case 6:
            return "Update Requested"
        case 7:
            return "Updating"
        case 8:
            return "Update Error"
        case 9:
            return "Delete Requested"
        case 10:
            return "Deleting"
        case 11:
            return "Delete Error"
        case 12:
            return "Delete Prepare"
        case 13:
            return "CRM Init"
        case 14:
            return "Creating"
        default:
            return id
    }
}

export const showProgress = (data, isDetailView) => {
    let state = data[fields.state]
    if (isDetailView) {
        return getStateStatus(data)
    }
    else {
        let icon = null;
        let color = 'red';
        switch (state) {
            case 5:
                icon = <Popup content={getStateStatus(state)} trigger={<Icon className="progressIndicator" name='check' color='green' />} />
                break;
            case 3:
            case 7:
            case 14:
                icon = <Popup content='View Progress' trigger={<Icon className={'progressIndicator'} loading size={12} color='green' name='circle notch' />} />
                break;
            case 10:
            case 12:
                icon = <Popup content='View Progress' trigger={<Icon className={'progressIndicator'} loading size={12} color='red' name='circle notch' />} />
                break;
            default:
                icon = <Popup content={getStateStatus(state)} trigger={<Icon className="progressIndicator" name='close' color='red' />} />
        }
        return (
            icon
        )
    }
}