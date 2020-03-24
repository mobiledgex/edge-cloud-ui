import {
    SET_CLOUDLET_ICON_COLOR,
    SET_LINE_COLOR,
    SET_MAP_TYLE_LAYER
} from "../actions/ActionTypes";

const mapTileList = [
    {
        url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
        name: 'dark1',
    },
    {
        url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
        name: 'dark2',
    },

    {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        name: 'white1',
    },
    {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        name: 'white2',
    },

]

const initialState = {
    currentTyleLayer: mapTileList[0].url,
    lineColor: 'yellow',
    cloudletIconColor: 'green',
};

export default function MapTyleLayerReducer(state = initialState, action) {

    switch (action.type) {
        case SET_MAP_TYLE_LAYER :
            return Object.assign({}, state, {
                currentTyleLayer: action.currentTyleLayer
            })
            break;

        case SET_LINE_COLOR :
            return Object.assign({}, state, {
                lineColor: action.lineColor
            })
            break;

        case SET_CLOUDLET_ICON_COLOR :
            return Object.assign({}, state, {
                cloudletIconColor: action.cloudletIconColor
            })
            break;

        default:
            return state
    }
}

