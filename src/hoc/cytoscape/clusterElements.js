import * as constant from '../../constant'
import { fields } from '../../services/model/format'
import * as svgIcons from './svgicons'
export const SHAPE_ROUND_RECTANGLE = 'round-rectangle'
export const SHAPE_ELLIPSE = 'ellipse'
const flowColor = 'white';

export const defaultFlow = (type) => (
    {
        id: 100, dataList: [
            { type: 'nodes', data: { id: 100, shape: SHAPE_ROUND_RECTANGLE, label: `External Network`, width: 10, height: 200, bg: '#363F53', tr: -1.5708, tmx: -15, zi: 1 }, position: { x: 100, y: 185 } },
            { type: 'nodes', data: { id: 101, shape: SHAPE_ROUND_RECTANGLE, label: `Internal Network`, width: 700, height: 10, bg: '#363F53', tmy: 15, zi: 1 }, position: { x: 600, y: 300 } },
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

export const ipAccessFlowApp = (data, type) => {
    let dataList = []
    if (data[fields.accessType] === constant.ACCESS_TYPE_LOAD_BALANCER) {
        dataList.push({ type: 'nodes', data: { id: 1, shape: SHAPE_ROUND_RECTANGLE, label: 'ROOT LB', width: 170, height: 100, bg: '#FFF', tva: 'top', tmy: -10, zi: 1, bw: 2, bc: '#8893D0' }, position: { x: 300, y: 185 } })
        dataList.push({ type: 'edges', data: { id: 1001, source: 100, target: 1 } })
        dataList.push({ type: 'nodes', data: { id: 10001, shape: SHAPE_ELLIPSE, label: 'LB', width: 100, height: 60, bg: '#8893D0', zi: 2 }, position: { x: 300, y: 185 } })
        dataList.push({ type: 'nodes', data: { id: 10002, shape: SHAPE_ELLIPSE, width: 1, height: 1, bg: '#8893D0' }, position: { x: 340, y: 200 } })
        dataList.push({ type: 'edges', data: { id: 99901, source: 100, target: 10002, zi: 3, as: 'none', ls: 'dashed', lc: flowColor, se: '0% 8%' } })
        dataList.push({ type: 'edges', data: { id: 99902, source: 10002, target: 102, zi: 3, as: 'none', ls: 'dashed', te: '-20% 10%', lc: flowColor }, classes: 'taxi' })
        dataList.push({ type: 'edges', data: { id: 1101, source: 1, target: 101, te: '-43% -43%', as: 'none' } })
    }
    else if (data[fields.accessType] === constant.ACCESS_TYPE_DIRECT) {
        if (data[fields.deployment] === constant.DEPLOYMENT_TYPE_VM) {
            dataList.push({ type: 'nodes', data: { id: 1, shape: SHAPE_ROUND_RECTANGLE, label: 'App VM', width: 170, height: 100, bg: '#8893D0', zi: 2 }, position: { x: 300, y: 185 } })
            dataList.push({ type: 'edges', data: { id: 99901, source: 100, target: 1, ls: 'dashed', zi: 3, lc: flowColor, tac: flowColor, tdn: '85px' } })
        }
        else {
            dataList.push({ type: 'nodes', data: { id: 1, shape: SHAPE_ROUND_RECTANGLE, label: 'ROOT LB', width: 170, height: 100, bg: '#FFF', tva: 'top', tmy: -10, zi: 1, bw: 2, bc: '#8893D0' }, position: { x: 300, y: 185 } })
            dataList.push({ type: 'edges', data: { id: 1001, source: 100, target: 1 } })
            dataList.push({ type: 'nodes', data: { id: 10001, shape: SHAPE_ELLIPSE, label: 'LB', width: 40, height: 20, bg: '#9B9FA8', zi: 2, lfs: 10 }, position: { x: 250, y: 150 } })
            dataList.push({ type: 'nodes', data: { id: 10002, shape: SHAPE_ELLIPSE, label: 'App', width: 100, height: 60, bg: '#8893D0', zi: 2 }, position: { x: 300, y: 185 } })
            dataList.push({ type: 'edges', data: { id: 99901, source: 100, target: 10002, ls: 'dashed', zi: 3, lc: flowColor, tdn: '50px', tac: flowColor } })
            dataList.push({ type: 'edges', data: { id: 1101, source: 1, target: 101, te: '-43% -43%', as: 'none' } })
        }
    }
    return (
        {
            id: 1, dataList: dataList, removeId: [1, 10001, 10002, 1001, 1101, 99901, 99902, 10010002]
        }
    )
}

export const portFlow = (count, type) => {
    return (
        {
            id: 3, dataList: count === 0 ? [] : [
                { type: 'nodes', data: { id: 3, shape: SHAPE_ELLIPSE, label: 'TLS Termination', lfs: 10, width: 80, height: 40, bg: '#8893D0', bi: svgIcons.renderNode(svgIcons.ICON_LOCK, 10).svg, zi: 3, tmy: -18, tc: 'black' }, position: { x: 267, y: 165 } },
                { type: 'nodes', data: { id: 30001, shape: SHAPE_ELLIPSE, width: 80, height: 40, bg: '#8893D0', bi: svgIcons.renderNode(svgIcons.ICON_UNLOCK, 10).svg, zi: 3 }, position: { x: 340, y: 165 } },
                { type: 'edges', data: { id: 99903, source: 100, target: 30001, zi: 3, as: 'none', ls: 'dashed', lc: flowColor, se: '0% -10%' } },
                { type: 'edges', data: { id: 99904, source: 30001, target: 102, zi: 3, as: 'none', ls: 'dashed', lc: flowColor }, classes: 'taxi' },
            ],
            removeId: [3, 30001, 99903, 99904]
        }
    )
}

export const deploymentTypeFlow = (data, type) => {
    let dataList = []
    if (data[fields.deployment] === constant.DEPLOYMENT_TYPE_KUBERNETES || data[fields.deployment] === constant.DEPLOYMENT_TYPE_HELM) {
        dataList.push({ type: 'nodes', data: { id: 2, shape: SHAPE_ROUND_RECTANGLE, label: 'K8s Master', width: 170, height: 110, bg: '#3A589E', zi: 1, tmy: -10 }, position: { x: 600, y: 185 } })
        dataList.push({ type: 'edges', data: { id: 99905, source: 102, target: 2, as: 'none', ls: 'dashed', zi: 3, lc: flowColor, te: '60% 0%' }, classes: 'taxi' })
        dataList.push({ type: 'edges', data: { id: 99906, source: 2, target: 103, as: 'none', ls: 'dashed', zi: 3, se: '60% 0%', lc: flowColor } })
        dataList.push({ type: 'nodes', data: { id: 20001, label: 'K8s Nodes', shape: SHAPE_ROUND_RECTANGLE, width: 170, height: 100, bg: '#FFF', bw: 2, tva: 'top', tmy: -10, bc: '#FFB97F' }, position: { x: 905, y: 185 } })
        dataList.push({ type: 'nodes', data: { id: 20002, shape: SHAPE_ROUND_RECTANGLE, width: 170, height: 100, bg: '#FFF', bw: 2, bc: '#FFB97F', zi: 1 }, position: { x: 910, y: 190 } })
        dataList.push({ type: 'nodes', data: { id: 20003, shape: SHAPE_ROUND_RECTANGLE, width: 170, height: 100, bg: '#FFF', bw: 2, zi: 2, bc: '#FFB97F' }, position: { x: 915, y: 195 } })
        dataList.push({ type: 'nodes', data: { id: 20004, shape: SHAPE_ELLIPSE, label: 'App', width: 100, height: 50, bg: '#FFB97F', bw: 1, zi: 4 }, position: { x: 915, y: 195 } })
        dataList.push({ type: 'edges', data: { id: 20003101, source: 20003, target: 101, te: '44% 44%', as: 'none' } })
        dataList.push({ type: 'edges', data: { id: 99907, source: 103, target: 104, ls: 'dashed', zi: 3, lc: flowColor, as: 'none' } })
        dataList.push({ type: 'edges', data: { id: 99908, source: 104, target: 20004, ls: 'dashed', zi: 3, lc: flowColor, tdn: '50px', tac: flowColor }, classes: 'taxi' })
        dataList.push({ type: 'edges', data: { id: 2101, source: 2, target: 101, as: 'none' } })
    }
    else if (data[fields.deployment] === constant.DEPLOYMENT_TYPE_DOCKER) {
        if (data[fields.accessType] === constant.ACCESS_TYPE_LOAD_BALANCER) {
            dataList.push({ type: 'nodes', data: { id: 2, shape: SHAPE_ROUND_RECTANGLE, label: 'Docker VM', width: 170, height: 110, bg: '#FFF', zi: 1, tva: 'top', tmy: -10, bw: 2, bc: '#2BC7C8' }, position: { x: 600, y: 185 } })
            dataList.push({ type: 'nodes', data: { id: 20004, shape: SHAPE_ELLIPSE, label: 'App', width: 100, height: 50, bg: '#2BC7C8', bw: 1, zi: 4 }, position: { x: 600, y: 185 } })
            dataList.push({ type: 'edges', data: { id: 99905, source: 102, target: 2, ls: 'dashed', zi: 3, lc: flowColor, tdn: '50px', tac: flowColor }, classes: 'taxi' })
        }
        else if (data[fields.accessType] === constant.ACCESS_TYPE_DIRECT) {
            dataList.push({ type: 'nodes', data: { id: 2, shape: SHAPE_ROUND_RECTANGLE, label: 'Docker VM', width: 170, height: 110, bg: '#9B9FA8', zi: 1 }, position: { x: 600, y: 185 } })
        }
        dataList.push({ type: 'edges', data: { id: 2101, source: 2, target: 101, as: 'none' } })
    }
    else if (data[fields.deployment] === constant.DEPLOYMENT_TYPE_VM) {
        if (data[fields.accessType] === constant.ACCESS_TYPE_LOAD_BALANCER) {
            dataList.push({ type: 'nodes', data: { id: 2, shape: SHAPE_ROUND_RECTANGLE, label: 'App', width: 170, height: 110, zi: 1, bg: '#2BC7C8' }, position: { x: 600, y: 185 } })
            dataList.push({ type: 'edges', data: { id: 99905, source: 102, target: 2, ls: 'dashed', zi: 3, lc: flowColor, tdn: '85px', tac: flowColor }, classes: 'taxi' })
            dataList.push({ type: 'edges', data: { id: 2101, source: 2, target: 101, as: 'none' } })
        }
    }
    return ({ 
        id: 2, dataList: dataList, removeId: [2, 2101, 99905, 99906, 20001, 20002, 20003, 20004, 20003101, 99907, 99908]
     })
}




