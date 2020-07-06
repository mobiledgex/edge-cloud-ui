export const style = [
    {
        selector: 'node',
        style: {
            'text-margin-x': function (ele) { return ele.data('tmx') ? ele.data('tmx') : 0 },
            'text-margin-y': function (ele) { return ele.data('tmy') ? ele.data('tmy') : 0 },
            'text-rotation': function (ele) { return ele.data('tr') ? ele.data('tr') : 0 },
            'background-color': function (ele) { return ele.data('bg') },
            'border-color': function (ele) { return ele.data('bc') ? ele.data('bc') : '#EEEEEE' },
            'border-width': function (ele) { return ele.data('bw') ? ele.data('bw') : 0 },
            'background-image': function (ele) { return ele.data('bi') ? ele.data('bi') : 'none' },
            'background-opacity': function (ele) { return ele.data('bi') ? 0 : 1 },
            'color': 'white',
            'content': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            "shape": "data(shape)",
            'height': "data(height)",
            'width': "data(width)",
        }
    },
    {
        selector: ':parent',
        css: {
            'text-valign': function (ele) { return ele.data('tva') ? ele.data('tva') : 'bottom' },
            'text-halign': 'center',
            'border-color': '#CCCCCC',
            'border-width': function (ele) { return ele.data('bw') ? ele.data('bw') : 1 },
        }
    },
    {
        selector: 'edge',
        css: {
            'line-style': function (ele) { return ele.data('ls') ? ele.data('ls') : 'solid' },
            'curve-style': function (ele) { return ele.data('cs') ? ele.data('cs') : 'straight' },
            'target-arrow-shape': function (ele) { return ele.data('as') ? ele.data('as') : 'triangle' },
            'source-endpoint': function (ele) { return ele.data('se') ? ele.data('se') : '0% 0%' },
            'target-endpoint': function (ele) { return ele.data('te') ? ele.data('te') : '0% 0%' },
            'source-distance-from-node': function (ele) { return ele.data('sdn') ? ele.data('sdn') : '0px' },
            'target-distance-from-node': function (ele) { return ele.data('tdn') ? ele.data('tdn') : '0px' }
        }
    },
    {
        "selector": "edge.unbundled-bezier",
        "style": {
            "curve-style": "unbundled-bezier",
            "control-point-distances": 120,
            "control-point-weights": 0.1
        }
    },
    {
        "selector": "edge.multi-unbundled-bezier",
        "style": {
            "curve-style": "unbundled-bezier",
            "control-point-distances": [40, -40],
            "control-point-weights": [0.250, 0.75]
        }
    }, {
        "selector": "edge.bezier",
        "style": {
            "curve-style": "bezier",
            "control-point-step-size": 15,
        }
    },
    {
        "selector": "edge.haystack",
        "style": {
            "curve-style": "haystack",
            "haystack-radius": 0.2
        }
    },
    {
        "selector": "edge.segments",
        "style": {
            "curve-style": "segments",
            "segment-distances": [40, -40],
            "segment-weights": [0.250, 0.75]
        }
    }, {
        "selector": "edge.taxi",
        "style": {
            "curve-style": "taxi",
            "taxi-direction": "downward",
            "taxi-turn": 20,
            "taxi-turn-min-distance": 5
        }
    }
]