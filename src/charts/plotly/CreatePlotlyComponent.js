/**
* https://github.com/benjeffery/react-plotlyjs
import createPlotlyComponent from 'react-plotlyjs';
//See the list of possible plotly bundles at https://github.com/plotly/plotly.js/blob/master/dist/README.md#partial-bundles or roll your own
import Plotly from 'plotly.js/dist/plotly-cartesian';
const PlotlyComponent = createPlotlyComponent(Plotly);
*/
import PropTypes from "prop-types";
import React from "react";
import cloneDeep from "lodash/cloneDeep";

const createPlotlyComponent = plotlyInstance => class Plotly extends React.Component {
    static propTypes = {
        data: PropTypes.array,
        layout: PropTypes.object,
        config: PropTypes.object,
        onClick: PropTypes.func,
        onBeforeHover: PropTypes.func,
        onHover: PropTypes.func,
        onUnHover: PropTypes.func,
        onSelected: PropTypes.func,
        onRelayout: PropTypes.func,
    };

    attachListeners() {
        if (this.props.onClick) this.container.on("plotly_click", this.props.onClick);
        if (this.props.onBeforeHover) this.container.on("plotly_beforehover", this.props.onBeforeHover);
        if (this.props.onHover) this.container.on("plotly_hover", this.props.onHover);
        if (this.props.onUnHover) this.container.on("plotly_unhover", this.props.onUnHover);
        if (this.props.onSelected) this.container.on("plotly_selected", this.props.onSelected);
        if (this.props.onRelayout) {
            this.container.on("plotly_relayout", this.props.onRelayout);
        }
    }

    shouldComponentUpdate(nextProps) {
        // TODO logic for detecting change in props
        return true;
    }

    componentDidMount() {
        const { data, layout, config } = this.props;
        plotlyInstance.newPlot(this.container, data, cloneDeep(layout), config); // We clone the layout as plotly mutates it.
        this.attachListeners();
    }

    componentDidUpdate(prevProps) {
        // TODO use minimal update for given changes
        if (prevProps.data !== this.props.data || prevProps.layout !== this.props.layout || prevProps.config !== this.props.config) {
            const { data, layout, config } = this.props;
            plotlyInstance.newPlot(this.container, data, cloneDeep(layout), config); // We clone the layout as plotly mutates it.
            this.attachListeners();
        }
    }

    componentWillUnmount() {
        plotlyInstance.purge(this.container);
    }

    resize() {
        plotlyInstance.Plots.resize(this.container);
    }

    render() {
        const {
            data, layout, config, ...other
        } = this.props;
        // Remove props that would cause React to warn for unknown props.
        delete other.onClick;
        delete other.onBeforeHover;
        delete other.onHover;
        delete other.onUnHover;
        delete other.onSelected;
        delete other.onRelayout;

        return <div {...other} ref={node => this.container = node} />;
    }
};

export default createPlotlyComponent;

/*
render() {
    let data = [
      {
        type: 'scatter',  // all "scatter" attributes: https://plot.ly/javascript/reference/#scatter
        x: [1, 2, 3],     // more about "x": #scatter-x
        y: [6, 2, 3],     // #scatter-y
        marker: {         // marker is an object, valid marker keys: #scatter-marker
          color: 'rgb(16, 32, 77)' // more about "marker.color": #scatter-marker-color
        }
      },
      {
        type: 'bar',      // all "bar" chart attributes: #bar
        x: [1, 2, 3],     // more about "x": #bar-x
        y: [6, 2, 3],     // #bar-y
        name: 'bar chart example' // #bar-name
      }
    ];
    let layout = {                     // all "layout" attributes: #layout
      title: 'simple example',  // more about "layout.title": #layout-title
      xaxis: {                  // all "layout.xaxis" attributes: #layout-xaxis
        title: 'time'         // more about "layout.xaxis.title": #layout-xaxis-title
      },
      annotations: [            // all "annotation" attributes: #layout-annotations
        {
          text: 'simple annotation',    // #layout-annotations-text
          x: 0,                         // #layout-annotations-x
          xref: 'paper',                // #layout-annotations-xref
          y: 0,                         // #layout-annotations-y
          yref: 'paper'                 // #layout-annotations-yref
        }
      ]
    };
    let config = {
      showLink: false,
      displayModeBar: true
    };
    return (
      <PlotlyComponent className="whatever" data={data} layout={layout} config={config}/>
    );
  }
  */