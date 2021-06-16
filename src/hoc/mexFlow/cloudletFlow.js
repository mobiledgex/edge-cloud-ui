import { SHAPE_ROUND_RECTANGLE, SHAPE_ELLIPSE } from './flowConstant'
import * as svgIcons from './svgicons'
import { fields } from '../../services/model/format'
import { perpetual } from '../../helper/constant'

export const edgeFlowList = [
    { id: [1], active: true }
]

export const defaultFlow = () => (
    {
        id: 100, dataList: [
            { type: 'nodes', data: { id: 100, shape: SHAPE_ROUND_RECTANGLE, label: `Platform VM`, width: 200, height: 400, bg: '#8893D0', tmy: 220, zi: 1 }, position: { x: 800, y: 285 } },
            { type: 'nodes', data: { id: 101, shape: SHAPE_ELLIPSE, label: '', width: 130, height: 60, bg: '#FFF', zi: 2 }, position: { x: 800, y: 135 } },
            { type: 'nodes', data: { id: 102, shape: SHAPE_ELLIPSE, label: '', width: 130, height: 60, bg: '#FFF', zi: 2 }, position: { x: 800, y: 225 } },
            { type: 'nodes', data: { id: 103, shape: SHAPE_ELLIPSE, label: `Cloudlet Services`, width: 130, height: 60, bg: '#FFF', zi: 2, tmy: 60, lfs: 15 }, position: { x: 800, y: 315 } },
            { type: 'nodes', data: { id: 104, shape: SHAPE_ROUND_RECTANGLE, label: `Infra API Endpoint Network`, width: 1, height: 400, bg: '#363F53', tmy: 220, zi: 1 }, position: { x: 500, y: 285 } },
            { type: 'edges', data: { id: 100104, source: 100, target: 104, as: 'none' } },
            { type: 'nodes', data: { id: 105, shape: SHAPE_ELLIPSE, label: '', width: 210, height: 200, bg: '#FFF', bi: svgIcons.renderNode(svgIcons.ICON_CLOUD, 1, '#5AB1EF', 200, 6, 4.5).svg, zi: 1 }, position: { x: 200, y: 275 } },
            { type: 'nodes', data: { id: 106, shape: SHAPE_ELLIPSE, label: `Internet`, width: 50, height: 50, bg: '#5AB1EF', zi: 2 }, position: { x: 200, y: 285 } },
            { type: 'edges', data: { id: 99901, source: 104, target: 106, as: 'none', ls: 'dashed', lc: '#FFF' } }
        ]
    }
)

export const privateFlow = (data) => {
    let dataList = []
    if (data[fields.infraApiAccess] === perpetual.INFRA_API_ACCESS_RESTRICTED) {
        dataList.push({ type: 'nodes', data: { id: 1, shape: SHAPE_ELLIPSE, width: 100, height: 100, bg: '#FFF', bi: svgIcons.renderNode(svgIcons.ICON_CLOSE, 1, '#D4272D', 100, 3, 2.25).svg }, position: { x: 400, y: 292 } })
    }
    return (
        {
            id: 1, 
            dataList: dataList,
            removeId: [1]
        }
    )
}