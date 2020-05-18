import React from 'react';

import styled from 'styled-components';


export const PageMonitoringStyles = {
    legendDiv: {
        flex: .97,
        marginLeft: 10,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignSelf: 'center',
        height: 50,
    },
    topRightMenu: {
        alignItems: 'center',
        display: 'flex',
        cursor: 'pointer',
        //backgroundColor: 'red',
        height: 30, width: 30,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    gridItemHeader: {
        position: 'absolute',
        right: 25, top: 10,
        display: 'inline-block',
        width: '100px',
        lineHeight: '1.2',
        fontSize: '18px',
        marginLeft: '15px',
        cursor: 'pointer',
        textAlign: 'right',
        marginRight: '-15px',
    },
    listItemTitle: {
        marginLeft: 10,
    },
    icon: {
        fontSize: 29,
        width: 37,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'red',
        position: "absolute",
        top: 7,
        fontWeight: 'bold',
        cursor: "pointer"
    },
    gridTitle2: {
        flex: .87,
        marginLeft: 0, alignItems: 'flex-start', marginTop: 8, alignSelf: 'center', justifyContent: 'flex-start'
    },
    selectBoxRow: {
        alignItems: 'flex-start', justifyContent: 'flex-start', width: '100%', alignSelf: 'center', marginRight: 300,
    },
    tabPaneDiv: {
        display: 'flex', flexDirection: 'row', height: 380,
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
    header00001: {
        fontSize: 21,
        marginLeft: 5,
        color: 'white',
    },
    div001: {
        fontSize: 25,
        color: 'white',
    },

    dropDown0: {
        //minWidth: 150,
        minWidth: '280px',
        //fontSize: '12px',
        minHeight: '40px',
        zIndex: 1,
        //height: '50px',
    },
    dropDownForClusterCloudlet: {
        minWidth: '420px',
        fontSize: '11px',
        minHeight: '30px',
        zIndex: 1,
        //height: '50px',
    },
    dropDownForCloudlet: {
        minWidth: '220px',
        fontSize: '11px',
        minHeight: '30px',
        zIndex: 1,
        //height: '50px',
    },
    dropDownForClusterCloudlet3: {
        minWidth: '180px',
        fontSize: '11px',
        minHeight: '30px',
        marginLeft: '-2px',
        zIndex: 1,
        //height: '50px',
    },
    dropDownForClusterCloudlet2: {
        minWidth: '320px',
        fontSize: '11px',
        minHeight: '30px',
        zIndex: 1,
        //height: '50px',
    },

    dropDownForAppInst: {
        minWidth: '180px',
        fontSize: '12px',
        minHeight: '37px',
        zIndex: 1,
        //height: '50px',
    },
    dropDown2: {
        //minWidth: 150,
        minWidth: '180px',
        //fontSize: '12px',
        minHeight: '40px',
        zIndex: 1,
        //height: '50px',
    },
    dropDown3: {
        //minWidth: 150,
        minWidth: '350px',
        //fontSize: '12px',
        minHeight: '40px',
        zIndex: 1,
        //height: '50px',
    },
    chartIcon: {
        width: 65,
        height: 65,
    },
    chartIconOuter: {
        width: 130,
        height: 85,
        //backgroundColor: 'red',
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
    },
    mapControlDiv: {
        display: 'flex',
        backgroundColor: 'rgba(128,128,128,.3)',
        borderRadius: 3,
        width: '30px',
        height: 'auto',
        paddingLeft: 4,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: 0,
        flexDirection: 'column',
    },
    expandIconDiv: {
        display: 'flex',
        flex: .03,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginLeft: 0,
        marginRight: 5,
        cursor: 'pointer',
        backgroundColor: 'transparent',
    },
    appInstLegendOuterDiv: {
        display: 'flex',
        flex: .975,
        justifyContent: 'center',
        marginLeft: 0,
        backgroundColor: 'transparent',
        marginTop: 3,
        width: '98.2%',
    },
    cell000: {
        marginLeft: 0,
        backgroundColor: '#a3a3a3',
        flex: .4,
        alignItems: 'center',
        fontSize: 13,
    },
    tableHeaderRow: {
        height: 22, alignSelf: 'center', display: 'flex', justifyContent: 'center', alignItem: 'center',
    },
    tableHeaderRow2: {
        height: 30, display: 'flex'
    },
    gridHeader: {
        height: 15,
        alignSelf: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItem: 'center',
        marginTop: 3,
        //backgroundColor: 'red',
        /*minWidth: 80,
        width: 80,*/
    },
    gridHeaderBig: {
        height: 15,
        alignSelf: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItem: 'center',
        marginTop: 3,
        backgroundColor: 'red',
        width: 250,
    },
    gridHeaderSmall2: {
        height: 15,
        alignSelf: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItem: 'center',
        marginTop: 3,
        fontSize: 10,
        marginRight: 10,
    },
    gridHeaderSmall: {
        height: 15,
        alignSelf: 'center',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItem: 'flex-start',
        marginTop: 3,
        fontSize: 12,
    },
    gridHeaderSmallCenter: {
        height: 15,
        alignSelf: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItem: 'center',
        marginTop: 3,
        fontSize: 12,
    },
    gridHeaderFirst: {
        height: 15,
        alignSelf: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItem: 'center',
        marginTop: 3,
        width: 500,
    },
    gridHeaderAlignLeft: {
        height: 15,
        alignSelf: 'center',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItem: 'flex-start',
        marginTop: 3
    },
    gridTableCell: {
        height: 50,
        alignSelf: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItem: 'center',
        marginTop: 3,
        fontFamily: "Roboto"
    },
    tableRow: {
        height: 50, alignSelf: 'center', display: 'flex', justifyContent: 'center', alignItem: 'center'
    },
    tableRowCompact: {
        height: 40, alignSelf: 'center', display: 'flex', justifyContent: 'center', alignItem: 'center'
    },
    tableRowFat: {
        height: 60, alignSelf: 'center', display: 'flex', justifyContent: 'center', alignItem: 'center'
    },
    gridTableCellAlignLeft: {
        height: 50,
        alignSelf: 'center',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItem: 'flex-start',
        marginTop: 3,
    },
    gridTableCell2: {
        height: 50,
        alignSelf: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItem: 'center',
        marginTop: 25,
        fontWeight: 'bold',
    },

    gridTableCell3Left: {
        height: 50,
        alignSelf: 'center',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItem: 'flex-start',
        fontWeight: 'bold',
        backgroundColor: '#1e2025',
    },
    gridTableCell3Dash: {
        height: 50,
        alignSelf: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItem: 'center',
        fontWeight: 'bold',
        backgroundColor: '#1e2025',
        flexDirection: 'column',
        fontSize: 12,
        verticalAlign: 'center'
    },
    gridTableCell3Dash1: {
        height: 50,
        alignSelf: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItem: 'center',
        fontWeight: 'bold',
        backgroundColor: '#1e2025',
        flexDirection: 'column',
        fontSize: 12,
        verticalAlign: 'center'
    },
    gridTableCell3Dash2: {
        height: 50,
        alignSelf: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItem: 'center',
        fontWeight: 'bold',
        backgroundColor: '#1e2025',
        flexDirection: 'column',
        fontSize: 12,
        verticalAlign: 'center',
        marginRight: -25,
    },

    gridTableCell3: {
        height: 50,
        alignSelf: 'center',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItem: 'flex-start',
        fontWeight: 'bold',
        backgroundColor: '#1e2025',
        fontSize: 12,
    },
    gridTableCell4: {

        height: 50,
        alignSelf: 'center',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItem: 'flex-start',
        fontWeight: 'bold',
        backgroundColor: '#23252c',
        fontSize: 12,
    },
    cellFirstRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

    },
    noData: {
        fontSize: 30,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        width: '100%'
    },
    cell001: {
        marginLeft: 0,
        backgroundColor: 'transparent',
        flex: .6,
        alignItems: 'center',
        fontSize: 13
    },
    cpuDiskCol001: {
        marginTop: 0, height: 33, width: '100%'
    },
    cell003: {
        color: 'white', textAlign: 'center', fontSize: 12, alignSelf: 'center'
        , justifyContent: 'center', alignItems: 'center', width: '100%', height: 35, marginTop: -9,
    },
    cell004: {
        color: 'white', textAlign: 'center', fontSize: 12, alignSelf: 'center', backgroundColor: 'transparent'
        , justifyContent: 'center', alignItems: 'center', width: '100%', height: 35
    },
    center: {
        display: 'flex',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        //backgroundColor:'red'
    },
    center2: {
        display: 'flex',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        minHeight: 350,
        //backgroundColor:'red'
    },
    center3: {
        display: 'flex',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        minHeight: 350,
        fontSize: 29,
        fontFamily: 'Karla'
        //backgroundColor:'red'
    },
    center4: {
        display: 'flex',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        minHeight: 350,
        fontSize: 29,
        fontFamily: 'Karla',
        marginTop: -100,
        //backgroundColor:'red'
    },
    noData2: {
        width: '100%',
        backgroundColor: 'blue',
        fontSize: 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        color: 'orange'

    },
    gridTableData: {flex: .15, backgroundColor: '#181A1F', height: 64, marginTop: 0, textAlign: 'center'},
    gridTableData2: {flex: .15, backgroundColor: '#1e2025', height: 64, marginTop: 0, textAlign: 'center'},


    appInstGridTableData: {flex: .083, backgroundColor: '#181A1F', height: 64, marginTop: 0, textAlign: 'center'},
    appInstGridTableData2: {flex: .083, backgroundColor: '#1e2025', height: 64, marginTop: 0, textAlign: 'center'},
}


export const Center = styled.div`
  justify-content: center;
  text-align: center;
  display : flex;
  align-items: center;
  align-self: center;
  font-family: Roboto;
`;
export const CenterFullWidth = styled.div`
  justify-content: center;
  text-align: center;
  display : flex;
  align-items: center;
  align-self: center;
  font-family: Roboto;
  width:100%;
`;

export const CenterMethodCount = styled.div`
  justify-content: center;
  text-align: center;
  display : flex;
  align-items: center;
  align-self: center;
  font-family: Roboto;
  //background-color: red;
`;

export const CountDivOne = styled.div`
  justify-content: center;
  text-align: center;
  display : flex;
  align-items: center;
  align-self: center;
  font-family: Roboto;
  //background-color: red;
`;

export const Center7 = styled.div`
  justify-content: center;
  text-align: center;
  display : flex;
  align-items: center;
  align-self: center;
`;

export const Right = styled.div`
  justify-content: flex-end;
  text-align: center;
  display : flex;
  align-items: flex-end;
  align-self: center;
  font-family: Roboto;
`;

export const Left = styled.div`
  justify-content: flex-start;
  text-align: center;
  display : flex;
  align-items: flex-start;
  align-self: center;
  font-family: Roboto;
`;


export const OuterHeader = styled.div`
    margin-left: 20px;
    font-size: 20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    //background-color: green;
    width: 100%;
    //margin-right: 50px;
`


export const Center0001 = styled.div`
    margin-left: 20px;
    font-size: 20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    //background-color: green;
    width: 195px;
    //margin-right: 50px;
`

export const LegendOuterDiv = styled.div`
  border-width: 0.1px;
  border-style: dotted;
  border-color: dimgrey;
  margin-left: 10px;
  display: flex;
  height: 25px;
  width: 98.925%;
  margin-right: 5px;
`

export const ChartIconOuterDiv = styled.div`
  display : flex;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  align-self: center;
  font-size: 13px;
  font-family: Roboto;
  border-width: 0.5px;
  border-style: solid;
  border-color: dimgrey;
  padding: 10px 5px;
  height: 110px;
  width: 150px;
`;

export const AppInstLegend = styled.div`
  justify-content: flex-start;
  text-align: center;
  flex-direction: row;
  display : flex;
  align-self: center;
  font-size: 13px;
  border-width: 0.1px;
  border-style: dotted;
  border-color: dimgrey;
  padding:5px;
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 20px;
  //marginLeft:50px;
`;

export const Center3 = styled.div`
  justify-content: center;
  text-align: center;
  flex-direction: row;
  display : flex;
  align-self: center;
  margin: 10px;
`;


export const Center2 = styled.div`
  justify-content: flex-start;
  text-align: center;
  flex-direction: row;
  display : flex;
  align-self: center;
  marginLeft:0px;
  align-items: flex-start;
  margin-top: -2px;

`


export const ClusterCluoudletLabel = styled.div`
  justify-content: center;
  text-align: center;
  flex-direction: row;
  display : flex;
  align-self: center;
  font-size: 13px;
  marginLeft:50px;
`
