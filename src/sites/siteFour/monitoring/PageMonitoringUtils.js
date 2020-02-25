import {HARDWARE_TYPE} from "../../../shared/Constants";

export const barChartOption = (hwType) => {

    return (
        {
            annotations: {
                style: 'line',
                textStyle: {
                    //fontName: 'Righteous',
                    fontSize: 12,
                    //bold: true,
                    //italic: true,
                    // The color of the text.
                    color: '#fff',
                    // The color of the text outline.
                    //auraColor: 'black',
                    // The transparency of the text.
                    opacity: 1.0
                },
                boxStyle: {
                    // Color of the box outline.
                    stroke: '#ffffff',
                    // Thickness of the box outline.
                    strokeWidth: 1,
                    // x-radius of the corner curvature.
                    rx: 10,
                    // y-radius of the corner curvature.
                    ry: 10,
                }
            },

            is3D: true,
            title: '',
            titleTextStyle: {
                color: '#fff',
                fontSize: 12,
                /*fontName: <string>, // i.e. 'Times New Roman'
                fontSize: <number>, // 12, 18 whatever you want (don't specify px)
                 bold: <boolean>,    // true or false
                  // true of false*/
            },
            //titlePosition: 'out',
            chartArea: {
                // left: 20, right: 150, top: 50, bottom: 25,
                width: "60%", height: "80%",
            },
            legend: {position: 'none'},//우측 Data[0]번째 텍스트를 hide..
            //xAxis
            hAxis: {
                textPosition: 'none',//HIDE xAxis
                title: '',
                titleTextStyle: {
                    //fontName: "Times",
                    fontSize: 12,
                    fontStyle: "italic",
                    color: 'white'
                },
                minValue: 0,
                textStyle: {
                    color: "white"
                },
                gridlines: {
                    color: "grey"
                },
                format: hwType === HARDWARE_TYPE.CPU ? '#\'%\'' : '0.##\' byte\'',
                baselineColor: "grey",
                //out', 'in', 'none'.
            },
            //Y축
            vAxis: {
                title: '',
                titleTextStyle: {
                    fontSize: 20,
                    fontStyle: "normal",
                    color: 'white'
                },
                textStyle: {
                    color: "white",
                    fontSize: 12,
                },
                stacked: true,
            },
            //colors: ['#FB7A21'],
            fontColor: 'white',
            backgroundColor: {
                fill: '#1e2124'
            },
        }

    )
}


export const columnChartOption = (hardwareType) => {
    return (
        {
            annotations: {
                startup: true,
                //alwaysOutside: true,
                style: 'point',
                textStyle: {
                    fontName: 'Roboto Condensed',
                    fontSize: 15,
                    //bold: true,
                    italic: true,
                    // The color of the text.
                    color: '#fff',
                    auraColor: 'black',
                    // The color of the text outline.
                    //auraColor: 'black',
                    // The transparency of the text.
                    opacity: 1.0
                },
                boxStyle: {
                    // Color of the box outline.
                    stroke: '#ffffff',
                    // Thickness of the box outline.
                    strokeWidth: 1,
                    // x-radius of the corner curvature.
                    rx: 30,
                    // y-radius of the corner curvature.
                    ry: 30,
                }
            },

            is3D: true,
            title: '',
            titleTextStyle: {
                color: '#fff',
                fontSize: 12,
                /*fontName: <string>, // i.e. 'Times New Roman'
                fontSize: <number>, // 12, 18 whatever you want (don't specify px)
                 bold: <boolean>,    // true or false
                  // true of false*/
            },
            //titlePosition: 'out',
            chartArea: {
                // left: 20, right: 150, top: 50, bottom: 25,
                width: "90%", height: "80%",
            },
            legend: {position: 'none'},//우측 Data[0]번째 텍스트를 hide..
            //xAxis
            hAxis: {
                //textPosition: 'none',//HIDE xAxis
                title: '',
                titleTextStyle: {
                    //fontName: "Times",
                    fontSize: 12,
                    fontStyle: "italic",
                    color: 'white'
                },
                minValue: 0,
                textStyle: {
                    color: "white"
                },
                gridlines: {
                    color: "grey"
                },
                format: hardwareType === HARDWARE_TYPE.CPU ? '#\'%\'' : '0.##\' byte\'',
                baselineColor: "grey",
                //out', 'in', 'none'.
            },
            //Y축
            vAxis: {
                title: '',
                titleTextStyle: {
                    fontSize: 20,
                    fontStyle: "normal",
                    color: 'white'
                },
                textStyle: {
                    color: "white",
                    fontSize: 12,
                },
                stacked: true,
            },
            //colors: ['#FB7A21'],
            fontColor: 'white',
            backgroundColor: {
                fill: '#1e2124'
            },
            /*  animation: {
                  duration: 300,
                  easing: 'out',
                  startup: true
              }*/
            //colors: ['green']
        }
    )
}
