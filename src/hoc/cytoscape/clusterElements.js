import * as constant from '../../constant'
export const SHAPE_ROUND_RECTANGLE = 'round-rectangle'
export const SHAPE_ELLIPSE = 'ellipse'
export const ICON_LOCK = 'lock'
export const ICON_UNLOCK = 'unlock'

export const defaultFlow = (type) => (
    {
        id: 100, dataList: [
            { type: 'nodes', data: { id: 100, shape: SHAPE_ROUND_RECTANGLE, label: `External Network`, width: 10, height: 200, bg: '#ADADAD', tr: -1.5708, tmx: -15, zi: 1 }, position: { x: 100, y: 185 } },
            { type: 'nodes', data: { id: 101, shape: SHAPE_ROUND_RECTANGLE, label: `Internal Network`, width: 700, height: 10, bg: '#ADADAD', tmy: 15, zi: 1 }, position: { x: 600, y: 300 } },
            { type: 'nodes', data: { id: 102, shape: SHAPE_ROUND_RECTANGLE, width: 1, height: 1, bg: '#FFF' }, position: { x: 500, y: 300 } },
            { type: 'nodes', data: { id: 103, shape: SHAPE_ROUND_RECTANGLE, width: 1, height: 1, bg: '#FFF' }, position: { x: 700, y: 300 } },
            { type: 'nodes', data: { id: 104, shape: SHAPE_ROUND_RECTANGLE, width: 1, height: 1, bg: '#FFF' }, position: { x: 800, y: 300 } }
        ]
    }
)

export const ipAccessFlow = (id, type) => {
    let label = id
    return (
        {
            id: 1, dataList: [
                { type: 'nodes', data: { id: 1, shape: SHAPE_ROUND_RECTANGLE, label: label, width: 170, height: 100, bg: '#8893D0' }, position: { x: 300, y: 185 } },
                { type: 'edges', data: { id: 1001, source: 100, target: 1 } },
                { type: 'edges', data: { id: 1101, source: 1, target: 101, te: '-43% -43%', as: 'none' } }
            ],
            removeId: [1, 1001, 1101]
        }
    )
}

const getIcon = (type) => {
    switch (type) {
        case ICON_LOCK:
            return 'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z'
        case ICON_UNLOCK:
            return 'M10 13C11.1 13 12 13.89 12 15C12 16.11 11.11 17 10 17S8 16.11 8 15 8.9 13 10 13M18 1C15.24 1 13 3.24 13 6V8H4C2.9 8 2 8.9 2 10V20C2 21.1 2.9 22 4 22H16C17.1 22 18 21.1 18 20V10C18 8.9 17.1 8 16 8H15V6C15 4.34 16.34 3 18 3S21 4.34 21 6V8H23V6C23 3.24 20.76 1 18 1M16 10V20H4V10H16Z'
    }
}

function renderNode(type, padding) {
    // Icon path is assumed to be of 32x32 in this example. You may auto calculate this if you wish.
    const iconPath = getIcon(type);
    const iconColor = '#000';
    const size = 32; // may need to calculate this yourself
    const iconResize = padding ? padding : 1; // adjust this for more "padding" (bigger number = more smaller icon)

    const width = size;
    const height = size;
    const scale = (size - iconResize) / size;
    const iconTranslate = iconResize / 2 / scale;
    const backgroundColor = 'transparent';

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <rect x="0" y="0" width="${width}" height="${height}" fill="${backgroundColor}"></rect>
        <path d="${iconPath}" fill="${iconColor}" transform="scale(${scale}) translate(${iconTranslate}, ${iconTranslate}) "></path>
      </svg>`;
    return {
        svg: 'data:image/svg+xml;base64,' + btoa(svg),
        width,
        height,
    };
}

export const ipAccessFlowApp = (id, type) => {
    return (
        {
            id: 1, dataList: [
                { type: 'nodes', data: { id: 1, shape: SHAPE_ROUND_RECTANGLE, label: 'ROOT LB', width: 170, height: 100, bg: '#FFF', tva: 'top', tmy: -10, zi: 1, bw:2, bc:'#8893D0' }, position: { x: 300, y: 185 } },
                { type: 'nodes', data: { id: 10001, shape: SHAPE_ELLIPSE, label: 'LB', width: 100, height: 60, bg: '#8893D0', zi: 2 }, position: { x: 300, y: 185 } },
                { type: 'nodes', data: { id: 10002, shape: SHAPE_ELLIPSE, width: 1, height: 1, bg: '#8893D0' }, position: { x: 267, y: 200 } },
                { type: 'nodes', data: { id: 10003, shape: SHAPE_ELLIPSE, width: 1, height: 1, bg: '#8893D0' }, position: { x: 340, y: 200 } },
                { type: 'edges', data: { id: 1001, source: 100, target: 1 } },
                { type: 'edges', data: { id: 1101, source: 1, target: 101, te: '-43% -43%', as: 'none' } },
                { type: 'edges', data: { id: 10010002, source: 100, target: 10002, zi: 3, as: 'none', ls: 'dashed', lc: '#EF5350', se: '0% 8%' } },
                { type: 'edges', data: { id: 1000210003, source: 10002, target: 10003, zi: 3, as: 'none', ls: 'dashed', lc: '#EF5350' } },
                { type: 'edges', data: { id: 10003102, source: 10003, target: 102, zi: 3, as: 'none', ls: 'dashed', te: '-20% 10%', lc: '#EF5350' }, classes: 'taxi' }
            ],
            removeId: [1, 10001, 10002, 10003, 1001, 1101, 10010002, 1000210003, 1003102]
        }
    )
}

export const portFlow = (count, type) => {
    return (
        {
            id: 3, dataList: count === 0 ? [] : [
                { type: 'nodes', data: { id: 3, shape: SHAPE_ELLIPSE, label: 'TLS Termination', lfs: 10, width: 80, height: 40, bg: '#8893D0', bi: renderNode(ICON_LOCK, 10).svg, zi: 3, tmy: -18, tc: 'black' }, position: { x: 267, y: 165 } },
                { type: 'nodes', data: { id: 30001, shape: SHAPE_ELLIPSE, width: 80, height: 40, bg: '#8893D0', bi: renderNode(ICON_UNLOCK, 10).svg, zi: 3 }, position: { x: 340, y: 165 } },
                { type: 'edges', data: { id: 1003, source: 100, target: 3, zi: 3, as: 'none', ls: 'dashed', lc: '#EF5350', se: '0% -10%' } },
                { type: 'edges', data: { id: 330001, source: 3, target: 30001, zi: 3, as: 'none', ls: 'dashed', lc: '#EF5350' } },
                { type: 'edges', data: { id: 30000102, source: 30001, target: 102, zi: 3, as: 'none', ls: 'dashed', lc: '#EF5350' }, classes: 'taxi' },
            ],
            removeId: [3, 30001, 1003, 330001, 30000102]
        }
    )
}

export const deploymentTypeFlow = (id, type) => {

    let dataList = []

    if (id === constant.DEPLOYMENT_TYPE_KUBERNETES || id === constant.DEPLOYMENT_TYPE_DOCKER) {
        if (id === constant.DEPLOYMENT_TYPE_KUBERNETES) {
            dataList.push({ type: 'nodes', data: { id: 2, shape: SHAPE_ROUND_RECTANGLE, label: 'K8s Master', width: 170, height: 110, bg: '#3A589E', zi: 1, tmy: -10 }, position: { x: 600, y: 185 } })
            dataList.push({ type: 'edges', data: { id: 1022, source: 102, target: 2, as: 'none', ls: 'dashed', zi: 3, lc: '#EF5350', te: '60% 0%' }, classes: 'taxi' })
            dataList.push({ type: 'edges', data: { id: 2103, source: 2, target: 103, as: 'none', ls: 'dashed', zi: 3, se: '60% 0%', lc: '#EF5350' } })
            dataList.push({ type: 'nodes', data: { id: 20001, label: 'K8s Nodes', shape: SHAPE_ROUND_RECTANGLE, width: 170, height: 100, bg: '#FFF', bw: 2, tva: 'top', tmy: -10, bc: '#FFB97F' }, position: { x: 905, y: 185 } })
            dataList.push({ type: 'nodes', data: { id: 20002, shape: SHAPE_ROUND_RECTANGLE, width: 170, height: 100, bg: '#FFF', bw: 2, bc: '#FFB97F' }, position: { x: 910, y: 190 } })
            dataList.push({ type: 'nodes', data: { id: 20003, shape: SHAPE_ROUND_RECTANGLE, width: 170, height: 100, bg: '#FFF', bw: 2, zi: 1, bc: '#FFB97F' }, position: { x: 915, y: 195 } })
            dataList.push({ type: 'nodes', data: { id: 20004, shape: SHAPE_ELLIPSE, label: 'App', width: 100, height: 50, bg: '#FFB97F', bw: 1, zi: 4 }, position: { x: 915, y: 195 } })
            dataList.push({ type: 'edges', data: { id: 20003101, source: 20003, target: 101, te: '44% 44%', as: 'none' } })
            dataList.push({ type: 'edges', data: { id: 10420004, source: 104, target: 20004, ls: 'dashed', zi: 3, lc: '#EF5350', tdn: '50px' }, classes: 'taxi' })
            dataList.push({ type: 'edges', data: { id: 103104, source: 103, target: 104, ls: 'dashed', zi: 3, lc: '#EF5350', as: 'none' } })
        }
        else if (id === constant.DEPLOYMENT_TYPE_DOCKER) {
            dataList.push({ type: 'nodes', data: { id: 2, shape: SHAPE_ROUND_RECTANGLE, label: 'Docker VM', width: 170, height: 110, bg: '#FFF', zi: 1, tva: 'top', tmy: -10, bw:2, bc:'#00abed' }, position: { x: 600, y: 185 } })
            dataList.push({ type: 'nodes', data: { id: 20004, shape: SHAPE_ELLIPSE, label: 'App', width: 100, height: 50, bg: '#00abed', bw: 1, zi: 4 }, position: { x: 600, y: 185 } })
            dataList.push({ type: 'edges', data: { id: 1022, source: 102, target: 2, ls: 'dashed', zi: 3, lc: '#EF5350', tdn: '50px' }, classes: 'taxi' })
        }
        dataList.push({ type: 'edges', data: { id: 2101, source: 2, target: 101, as: 'none' } })
        return ({ id: 2, dataList: dataList, removeId: [2, 2101, 1022, 2103, 20001, 20002, 20003, 20004, 20003101, 10420004, 103104] })
    }

}