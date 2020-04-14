// @flow
import React, {useState, useEffect} from 'react';
import {renderPlaceHolderCircular} from "../PageMonitoringCommonService";
import {
    convertToClassification, makeLineChartDataForAppInst,
    makeLineChartDataForCluster,
    renderLineChartCoreForDev
} from "../dev/PageDevMonitoringService";
import PageDevMonitoring from "../dev/PageDevMonitoring";
import {CLASSIFICATION} from "../../../../shared/Constants";

type Props = {
    parent: PageDevMonitoring,
    pHardwareType: string,
    graphType: string,
    chartDataSet: any,
    isResizeComplete: boolean,
};
type State = {
    currentClassification: any,
    themeTitle: string,
    chartDataSet: any,
    pHardwareType: string,
    isResizeComplete: boolean,
};

export default function LineChartHook(props) {
    useEffect(() => {

    }, [props]);

    return (
        <div className='page_monitoring_dual_column' style={{display: 'flex'}}>
            <div className='page_monitoring_dual_container' style={{flex: 1}}>
                <div className='page_monitoring_title_area draggable' style={{backgroundColor: 'transparent'}}>
                    <div className='page_monitoring_title' style={{fontFamily: 'Ubuntu'}}>
                        {convertToClassification(props.currentClassification)} {props.pHardwareType !== undefined && props.pHardwareType.replace("_", "")} Usage
                    </div>
                </div>
                <div className='page_monitoring_container'>
                    {renderLineChartCoreForDev(props.parent, props.chartDataSet, props.isResizeComplete)}
                </div>
            </div>
        </div>
    );
};
