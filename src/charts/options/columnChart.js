
export default {

    colors: ['#7dd083', '#50a4e5', '#ED561B', '#DDDF00', '#24CBE5', '#64E572',
            '#FF9655', '#FFF263', '#6AF9C4'],
    chart: {
       renderTo: 'chart-container',
       height:590,
       type: 'column'
   },

    credits: {
        enabled: false
    },
    title: {
        text: null
    },
    subtitle: {
        text: null
    },
    legend: {
        align: 'right',
        verticalAlign: 'top',
        layout: 'vertial',
        x: 0,
        y: 50,
        itemStyle: {
            fontWeight:'bold',
            fontSize:'20px'
        }

    },
    xAxis: {
        categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ],
        labels: {
            style: {
                color: 'black',
                fontSize:'18px'
            }
        }

    },
    yAxis: {
        min: 0,
        title: {
            text: ''
        },
        labels: {
            style: {
                color: 'black',
                fontSize:'18px'
            }
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:,.0f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0,
            dataLabels: {
                enabled: true,
                format: '{point.y:,.0f}',
                y: -6,
                style:{ fontSize:'17px'}

            }
        }
    },

    series: [{
        name: '',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    }, {
        name: '',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    }, {
        name: '',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    }, {
        name: '',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    }]

};
