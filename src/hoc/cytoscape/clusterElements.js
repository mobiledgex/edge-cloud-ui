
import * as constant from './constant'

export const defaultFlow = () => (
    { id: 100, dataList: [
        { data: { id: 100, shape: constant.SHAPE_ROUND_RECTANGLE, label: `External Network`, width: 1, height: 200, bg: '#FFF', tr:-1.5708, tmx:-15 }, position: { x: 100, y: 185 } },
        { data: { id: 101, shape: constant.SHAPE_ROUND_RECTANGLE, label: `Internal Network`, width: 700, height: 1, bg: '#FFF', tmy:15 }, position: { x: 600, y: 300 } }
    ]}
)

export const shared = () => (
    {
        id: 1, dataList: [
            { data: { id: 1, shape: constant.SHAPE_ROUND_RECTANGLE, label: `Shared`, width: 170, height: 100, bg: '#8893D0' }, position: { x: 300, y: 185 } }
        ],
        edgeList: [
            { data: { id: '100_1', source: '100', target: '1' } },
            { data: { id: '1_101', source: '1', target: '101', te: '-43% -43%', as:'none' } }
        ],
        removeId: [1]
    }
)

export const dedicated = () => (
    {
        id: 1, dataList: [
            {
                data: { id: 1, shape: constant.SHAPE_ROUND_RECTANGLE, label: `Dedicated`, width: 170, height: 110, bg: '#8893D0' }, position: { x: 300, y: 185 }
            }],
        edgeList: [
            { data: { id: '100_1', source: '100', target: '1' } },
            { data: { id: '1_101', source: '1', target: '101', te: '-43% -43%', as:'none' } }
        ],
        removeId: [1, 101_1]
    }
)

export const k8Master = () => (
    {
        id: 2, dataList: [
            { data: { id: 2, shape: constant.SHAPE_ROUND_RECTANGLE, label: 'K8s Master', width: 170, height: 110, bg: '#3A589E' }, position: { x: 600, y: 185 } },
            { data: { id: 3_1, shape: constant.SHAPE_ROUND_RECTANGLE, width: 170, height: 100, bg: '#FFB97F', bw:1 }, position: { x: 900, y: 185 } },
            { data: { id: 3_2, shape: constant.SHAPE_ROUND_RECTANGLE, width: 170, height: 100, bg: '#FFB97F', bw:1 }, position: { x: 905, y: 190 } },
            { data: { id: 3, shape: constant.SHAPE_ROUND_RECTANGLE, label: 'K8s Nodes', width: 170, height: 100, bg: '#FFB97F', bw:1 }, position: { x: 910, y: 195 } },
        ],
        edgeList: [
            { data: { id: '2_101', source: '2', target: '101', te: '0% 0%', as:'none' } },
            { data: { id: '3_101', source: '3', target: '101', te: '44% 44%', as:'none' } }
        ], 
        removeId: [2, 2_101]
    }
)

export const docker = () => (
    {
        id: 2, dataList: [
            { data: { id: 2, shape: constant.SHAPE_ROUND_RECTANGLE, label: 'Docker VM', width: 170, height: 110, bg: '#00ABED' }, position: { x: 600, y: 185 } }
        ], 
        edgeList: [
            { data: { id: '2_101', source: '2', target: '101', te: '0% 0%', as:'none' } }
        ], 
        removeId: [2, 3, 3_1, 3_2, 2_101, 3_101]
    }
)