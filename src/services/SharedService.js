import React from 'react';
import '../css/introjs.css';
import '../css/introjs-dark.css';
import '../css/index.css';
import axios from "axios-jsonp-pro";

/**
 * last top5  extractor in ArrayList
 * @param length
 * @param paramArrayList
 * @returns {Array}
 */
export const cutArrayList = (length: number = 5, paramArrayList: any) => {

    let newArrayList = [];
    for (let index in paramArrayList) {
        if (index < 5) {
            newArrayList.push(paramArrayList[index])
        }
    }
    return newArrayList;
}


/**
 *
 * @param serviceBodyForAppInstanceOneInfo
 * @returns {Promise<AxiosResponse<any>>}
 */
export const requestAppLevelMetrics = async (serviceBodyForAppInstanceOneInfo: any) => {
    let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
    let result = await axios({
        url: '/api/v1/auth/metrics/app',
        method: 'post',
        data: serviceBodyForAppInstanceOneInfo['params'],
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + store.userToken

        },
        timeout: 15 * 1000
    }).then(async response => {
        return response.data;
    }).catch(e => {
        throw new Error(e)
    })
    return result;
}

export const getMetricByRegion = async (serviceBodyForAppInstanceOneInfo: any) => {
    let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
    let result = await axios({
        url: '/api/v1/auth/metrics/app',
        method: 'post',
        data: serviceBodyForAppInstanceOneInfo['params'],
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + store.userToken

        },
        timeout: 15 * 1000
    }).then(async response => {
        return response.data;
    }).catch(e => {
        throw new Error(e)
    })
    return result;
}


/**
 * @todo: 비교 가능하도록 minus를 스플릿된 date를 리턴한다..
 * @param paramDate
 * @returns {string}
 */
export const covertToComparableDate = (paramDate) => {
    let arrayDate = paramDate.toString().split("-");
    let compareableFullDate = arrayDate[0] + arrayDate[1] + arrayDate[2]
    return compareableFullDate

}

export const numberWithCommas = (x) => {

    try{
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }catch (e) {
        alert(e)
    }


}


export const makeFormForAppInstance = (instanceDataOne, valid = "*", token, fetchingDataNo = 20) => {
    return (
        {
            "token": token,
            "params": {
                "region": instanceDataOne.Region,
                "appinst": {
                    "app_key": {
                        "developer_key": {"name": instanceDataOne.OrganizationName},
                        "name": instanceDataOne.AppName.toLowerCase().replace(/\s+/g, ''),
                        "version": instanceDataOne.Version
                    },
                    "cluster_inst_key": {
                        "cluster_key": {"name": instanceDataOne.ClusterInst},
                        "cloudlet_key": {
                            "name": instanceDataOne.Cloudlet,
                            "operator_key": {"name": instanceDataOne.Operator}
                        }
                    }
                },
                "selector": valid,
                //"last": 25
                "last": fetchingDataNo,
            }
        }
    )
}

export const isEmpty = (value) => {
    if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)) {
        return true
    } else {
        return false
    }
};

export const Styles = {
    selectBoxRow: {
        alignItems: 'flex-start', justifyContent: 'flex-start', width: '100%', alignSelf: 'center', marginRight: 300,
    },
    selectHeader: {
        color: 'white',
        backgroundColor: '#565656',
        height: 35,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: -10,
        width: 100,
        display: 'flex'
    },

    div001: {
        fontSize: 25,
        color: 'white',
    },
    dropDown: {
        //minWidth: 150,
        width: 190,
    }
}
