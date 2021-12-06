import { lightGreen } from '@material-ui/core/colors';
import React from 'react'
import {Icon, Popup} from 'semantic-ui-react';
import { perpetual } from '../../helper/constant';
import { serverFields } from '../../helper/formatter';
import {fields} from './format';

export const additionalDetail = (data) => {
    return (
        data[fields.type] && data[fields.type] === perpetual.DEVELOPER ?
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
                        {'$ curl -u<username> -T <path_to_file>'} <code style={{ color: lightGreen['A700'] }}>{`"https://artifactory.mobiledgex.net/artifactory/repo-${data[fields.organizationName]}/<target_file_path>"`}</code> {'--progress-bar -o <upload status filename>'}
                    </div>
                </div>
            </div> : null)
}

const getStateStatus = (id) => {
    switch (id) {
        case serverFields.SERVER_TRACKED_STATE_UNKNOWN:
            return "Tracked State Unknown"
        case serverFields.SERVER_NOT_PRESENT:
            return "Not Present"
        case serverFields.SERVER_CREATE_REQUESTED:
            return "Create Requested"
        case serverFields.SERVER_CREATING:
            return "Creating"
        case serverFields.SERVER_CREATE_ERROR:
            return "Create Error"
        case serverFields.SERVER_READY:
            return "Ready"
        case serverFields.SERVER_UPDATE_REQUESTED:
            return "Update Requested"
        case serverFields.SERVER_UPDATING:
            return "Updating"
        case serverFields.SERVER_UPDATE_ERROR:
            return "Update Error"
        case serverFields.SERVER_DELETE_REQUESTED:
            return "Delete Requested"
        case serverFields.SERVER_DELETING:
            return "Deleting"
        case serverFields.SERVER_DELETE_ERROR:
            return "Delete Error"
        case serverFields.SERVER_DELETE_PREPARE:
            return "Delete Prepare"
        case serverFields.SERVER_CRM_INITOK:
            return "CRM Init"
        case serverFields.SERVER_CREATING_DEPENDENCIES:
            return "Creating"
        case serverFields.SERVER_DELETE_DONE:
            return "Deleted"
        default:
            return id
    }
}

export const showProgress = (data, isDetailView) => {
    let state = data[fields.state]
    if (isDetailView) {
        return getStateStatus(state)
    }
    else {
        let icon = null;
        switch (state) {
            case serverFields.SERVER_READY:
                icon = <Popup content={getStateStatus(state)} trigger={<Icon className='progressIndicator' name='check' color='green' />} />
                break;
            case serverFields.SERVER_CREATING:
            case serverFields.SERVER_UPDATING:
            case serverFields.SERVER_CREATING_DEPENDENCIES:
            case serverFields.SERVER_CRM_INITOK:
                icon = <Popup content='View Progress' trigger={<Icon className='progressIndicator' loading color='green' name='circle notch' />} />
                break;
            case serverFields.SERVER_DELETING:
            case serverFields.SERVER_DELETE_PREPARE:
                icon = <Popup content='View Progress' trigger={<Icon className='progressIndicator' loading color='red' name='circle notch' />} />
                break;
            default:
                icon = <Popup content={getStateStatus(state)} trigger={<Icon className='progressIndicator' name='close' color='red' />} />
        }
        return icon
    }
}
