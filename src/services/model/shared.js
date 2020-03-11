import React from 'react'
import { Popup, Icon } from 'semantic-ui-react';
import { fields } from './format';

export const getIPAccess = (data) => {
    let id = data[fields.ipAccess]
    switch (id) {
        case 1:
            return 'Dedicated'
        case 3:
            return 'Shared'
    }
}

export const getIPSupport = (data) => {
    let id = data[fields.ipSupport]
    switch (id) {
        case 1:
            return 'Static'
        case 2:
            return 'Dynamic'
    }
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
        return getStateStatus(state)
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