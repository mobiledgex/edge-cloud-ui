
const window = self;
importScripts("https://www.chartjs.org/dist/next/chart.min.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/chartjs-adapter-moment/0.1.2/chartjs-adapter-moment.min.js")
importScripts("https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@1.0.0/dist/chartjs-adapter-date-fns.bundle.min.js")
importScripts("https://cdnjs.cloudflare.com/ajax/libs/luxon/1.25.0/luxon.min.js")
importScripts("https://cdn.jsdelivr.net/npm/chartjs-adapter-luxon@0.2.1")

const convertByteToMegaGigaByte = (bytes) => {
    let marker = 1024; // Change to 1000 if required
    let decimal = 0; // Change as required
    let kiloBytes = marker; // One Kilobyte is 1024 bytes
    let megaBytes = Math.pow(marker, 2); // One MB is 1024 KB
    let gigaBytes = Math.pow(marker, 3); // One GB is 1024 MB
    if (bytes < kiloBytes) return bytes + " Bytes";
    else if (bytes < megaBytes) return (bytes / kiloBytes).toFixed(decimal) + " KB";
    else if (bytes < gigaBytes) return (bytes / megaBytes).toFixed(decimal) + " MB";
    else return (bytes / gigaBytes).toFixed(decimal) + " GB";
}

const convertMBToGB = (mb) => {
    let marker = 1024; // Change to 1000 if required
    let decimal = 0; // Change as required
    let gigaBytes = marker; // One GB is 1024 MB
    let teraBytes = Math.pow(marker, 2); // One TB is 1024 GB
    if (mb < gigaBytes) return mb + ' MB'
    else if (mb < teraBytes) return (mb / gigaBytes).toFixed(decimal) + ' GB'
    else return (mb / teraBytes).toFixed(decimal) + ' TB'
}

const convertGBtoTB = (data) => {
    let marker = 1024
    let decimal = 1;
    let tb = marker
    return data < tb ? data + ' GB' : (data / tb).toFixed(decimal) + ' TB'
}

const unit = (type, value) => {
    if (value >= 0) {
        switch (type) {
            case 1:
                return convertByteToMegaGigaByte(value > 0 ? value.toFixed(1) : value)
            case 2:
                return (value > 0 ? value.toFixed(3) : value) + " %"
            case 3:
                return Math.floor(value)
            case 4:
                return convertMBToGB(value)
            case 5:
                return convertGBtoTB(value)
            default:
                return value
        }
    }
}

const optionsGenerator = (unitId, header) => {
    return {
        stacked: true,
        bezierCurve: true,
        animation: {
            duration: 1
        },
        datasetStrokeWidth: 1,
        pointDotStrokeWidth: 2,
        responsive: true,
        maintainAspectRatio: false,
        elements: {
            line: {
                tension: 0 // disables bezier curves
            }
        },
        scales: {
            x: {
                type: "time",
                time: {
                    format: 'HH:mm:ss',
                    tooltipFormat: 'MM/DD/YYYY HH:mm:ss',
                    displayFormats: {
                        millisecond: 'HH:mm:ss.SSS',
                        second: 'HH:mm:ss',
                        minute: 'HH:mm',
                        hour: 'HH'
                    }
                },
                scaleLabel: {
                    display: false,
                    labelString: 'Date'
                },
                ticks: {
                    maxTicksLimit: 5
                }
            },
            y: {
                scaleLabel: {
                    display: false,
                    labelString: header
                },
                ticks: {
                    callback: (label, index, labels) => {
                        return unit ? unit(unitId, label) : label
                    },
                    maxTicksLimit: 5
                }
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: false,
                mode: 'index',
                intersect: false,
                position: 'nearest',
            }
        },
        tooltip: {
            mode: 'single',
            callbacks: {
                label: function (tooltipItem, data) {
                    var label = data.datasets[tooltipItem.datasetIndex].label
                    let value = unit ? unit(unitId, tooltipItem.yLabel) : tooltipItem.yLabel
                    return `${label} : ${value ? value : 0}`
                }
            }
        }
    }
}

onmessage = function (event) {
    const { canvas, config, unitId, header } = event.data;
    config.options = optionsGenerator(unitId, header)
    const chart = new Chart(canvas, config); // Error for Chart 
    canvas.height = 200;
    chart.resize();
};