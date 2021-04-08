import React from 'react'
import { showYesNo } from './constant'
import { Icon } from 'semantic-ui-react';
import { fields } from './services/model/format';

export const customizedTrusted = (data, isDetailView) => {
    let trusted = data[fields.trusted] 
    if (isDetailView) {
        return showYesNo(trusted, isDetailView)
    }
    else {
        let color = trusted ? 'green' : 'red'
        let icon = trusted ? 'check' : 'close'
        return <Icon className={'progressIndicator'} color={color} name={icon} />
    }
}