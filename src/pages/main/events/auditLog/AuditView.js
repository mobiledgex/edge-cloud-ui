/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useEffect } from 'react';
import { Card } from "@material-ui/core";
import cloneDeep from 'lodash/cloneDeep'
import { withStyles } from '@material-ui/styles';
import { syntaxHighLighter } from '../../../../hoc/highLighter/highLighter';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const jsonParse = (data) => {
    try {
        return JSON.parse(data)
    }
    catch (err) {
        return data
    }
}

const parseMultiJsonObject = (response) => {
    let resList = response.split('\n')
    let formattedList = []
    resList.map(res => {
        try {
            formattedList.push(JSON.parse(res))
        }
        catch (e) {

        }
    })
    return formattedList
}

const jsonView = (data, position) => {
    let jsonObj = cloneDeep(data)
    if (jsonObj.request) {
        jsonObj.request = jsonParse(jsonObj.request)
    }

    if (jsonObj.response) {
        let response = jsonObj.response
        if (response.includes('\"') && response.includes('\n')) {
            jsonObj.response = parseMultiJsonObject(response)
        }
        else {
            jsonObj.response = jsonParse(jsonObj.response)
        }
    }

    if (position === 1) {
        jsonObj = jsonObj.request
    }
    else if (position === 2) {
        jsonObj = jsonObj.response
    }
    return (
        <div style={{ width: '100%', flexDirection: 'column' }}>
            {syntaxHighLighter('json', JSON.stringify(jsonObj !== undefined ? jsonObj : {}, null, 1))}
        </div>
    )
}

const StyledTabs = withStyles((theme) => ({
    flexContainer: {
        borderBottom: '1px solid rgba(255,255,255,.7)'
    },
}))(Tabs);

const setAllView = (data) => {
    const mtags = data.mtags
    if (mtags && mtags['traceid']) {
        return mtags
    }
    return {}
}

const Preview = (props) => {
    const { data } = props
    const [viewIndex, setViewIndex] = React.useState(0)
    const [viewData, setData] = React.useState(setAllView(data))

    useEffect(() => {
        setData(setAllView(data))
    }, [data]);

    const handleChangeTab = (e, newValue) => {
        setViewIndex(newValue);
    };

    return (
        <React.Fragment>
            <StyledTabs
                value={viewIndex}
                onChange={handleChangeTab}
                indicatorColor="primary"
                textColor="primary"
            >
                <Tab label="Raw Viewer" />
                <Tab label="Request" />
                <Tab label="Response" />
            </StyledTabs>
            <Card style={{ height: 'calc(100vh - 100px)', overflow: 'auto' }}>
                {viewData ? jsonView(viewData, viewIndex) : null}
            </Card>
        </React.Fragment>
    )
}

export default Preview