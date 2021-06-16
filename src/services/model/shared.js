import { lightGreen } from '@material-ui/core/colors';
import React from 'react'
import {Icon, Popup} from 'semantic-ui-react';
import { perpetual } from '../../helper/constant';
import {fields} from './format';

const TRACKED_STATE_UNKNOWN = 0
const NOT_PRESENT = 1
const CREATE_REQUESTED = 2
const CREATING = 3
const CREATE_ERROR= 4
const READY = 5
const UPDATE_REQUESTED = 6
const UPDATING = 7
const UPDATE_ERROR = 8
const DELETE_REQUESTED = 9
const DELETING = 10
const DELETE_ERROR = 11
const DELETE_PREPARE = 12
const CRM_INITOK = 13
const CREATING_DEPENDENCIES = 14 
const DELETE_DONE = 15

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
        case TRACKED_STATE_UNKNOWN:
            return "Tracked State Unknown"
        case NOT_PRESENT:
            return "Not Present"
        case CREATE_REQUESTED:
            return "Create Requested"
        case CREATING:
            return "Creating"
        case CREATE_ERROR:
            return "Create Error"
        case READY:
            return "Ready"
        case UPDATE_REQUESTED:
            return "Update Requested"
        case UPDATING:
            return "Updating"
        case UPDATE_ERROR:
            return "Update Error"
        case DELETE_REQUESTED:
            return "Delete Requested"
        case DELETING:
            return "Deleting"
        case DELETE_ERROR:
            return "Delete Error"
        case DELETE_PREPARE:
            return "Delete Prepare"
        case CRM_INITOK:
            return "CRM Init"
        case CREATING_DEPENDENCIES:
            return "Creating"
        case DELETE_DONE:
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
            case READY:
                icon = <Popup content={getStateStatus(state)} trigger={<Icon className='progressIndicator' name='check' color='green' />} />
                break;
            case CREATING:
            case UPDATING:
            case CREATING_DEPENDENCIES:
            case CRM_INITOK:
                icon = <Popup content='View Progress' trigger={<Icon className='progressIndicator' loading color='green' name='circle notch' />} />
                break;
            case DELETING:
            case DELETE_PREPARE:
                icon = <Popup content='View Progress' trigger={<Icon className='progressIndicator' loading color='red' name='circle notch' />} />
                break;
            default:
                icon = <Popup content={getStateStatus(state)} trigger={<Icon className='progressIndicator' name='close' color='red' />} />
        }
        return icon
    }
}
