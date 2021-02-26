import React from 'react'
import { showYesNo } from './constant'
import { Icon } from 'semantic-ui-react';
import { fields } from './services/model/format';

export const customizedTrusted = (data, isDetailView) => {
    if (isDetailView) {
        return showYesNo(data, isDetailView)
    }
    else {
        let color = data[fields.trusted] ? 'green' : 'red'
        let icon = data[fields.trusted] ? 'check' : 'close'
        return <Icon className={'progressIndicator'} color={color} name={icon} />
    }
}