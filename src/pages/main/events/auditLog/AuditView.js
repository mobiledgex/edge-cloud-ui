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