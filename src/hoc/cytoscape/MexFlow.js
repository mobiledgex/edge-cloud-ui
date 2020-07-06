import React from 'react';
import cytoscape from 'cytoscape';
import { style } from './style';
import { defaultFlow } from './clusterElements'
import { element } from 'prop-types';

export const FLOW_ADD = 'add'
export const FLOW_REMOVE = 'remove'
export const FLOW_UPDATE = 'update'

const cyStyle = {
  height: '50vh',
  width: '45vw',
  backgroundColor: '#1A1C21'
};

class MexFlow extends React.Component {
  constructor(props) {
    super(props);
    this.renderCytoscapeElement = this.renderCytoscapeElement.bind(this);
    this.state = {
      flowData: { id: 0 }
    }
    this.flowIdList = []
  }



  renderCytoscapeElement(elements) {
    this.cy = cytoscape(
      {
        container: document.getElementById('cy'),
        elements: {
          nodes: [],
          edges: []
        },
        style: style,
        layout: {
          name: 'preset',
          padding: 5
        }
      });
    this.cy.userZoomingEnabled(false)
    this.cy.zoom({
      level: 1.0,
      renderedPosition: { x: 150, y: 100 }
    });
  }

  static getDerivedStateFromProps(props, state) {
    if (props.flowData.id !== state.flowData.id) {
      return { flowData: props.flowData }
    }
    return null
  }

  onClickB = () => {
    this.cy.$('#1').data('label', 'Direct')
  }

  render() {
    return (
      <div style={cyStyle} id="cy" />
    )
  }

  addFlowdata = (flowData) =>
  {
    flowData.dataList.map(element => {
      this.cy.add({
        group: 'nodes',
        data: element.data,
        position: element.position
      })
    })
    if (flowData.edgeList) {
      flowData.edgeList.map(element => {
        this.cy.add({
          group: 'edges',
          data: element.data
        })
      })
    }
  }

  updateCyFlow = (flowData,) => {
    if (this.flowIdList.includes(flowData.id)) {
      flowData.removeId.map(id => {
        this.cy.remove(this.cy.$(`#${id}`));
      })
      var index = this.flowIdList.indexOf(flowData.id);
      if (index !== -1) this.flowIdList.splice(index, 1);
    }

    this.flowIdList.push(flowData.id)
    if (flowData && flowData.dataList) {
      this.addFlowdata(flowData)
    }

  }

  componentDidUpdate(prevProps, prevState) {
    let flowData = this.props.flowData
    if (flowData.id !== 0) {
      this.updateCyFlow(flowData)
    }
  }

  componentDidMount() {
    this.renderCytoscapeElement();
    this.addFlowdata(defaultFlow())
  }

  componentWillUnmount() {
    this.cy.destroy()
  }
}
export default MexFlow;