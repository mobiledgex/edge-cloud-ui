import React from 'react';
import cytoscape from 'cytoscape';
import { style } from './style';
import { defaultFlow } from './clusterElements'

export const FLOW_ADD = 'add'
export const FLOW_REMOVE = 'remove'
export const FLOW_UPDATE = 'update'

const cyStyle = {
  height: '50vh',
  width: '45vw',
  transition: 'width 0.5s',
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

  renderCytoscapeElement() {
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
    if (props.flowData && (props.flowData.id !== state.flowData.id)) {
      return { flowData: props.flowData }
    }
    return null
  }

  render() {
    return (
      <div style={cyStyle} id="cy" />
    )
  }

  addFlowdata = (flowData) => {
    flowData.dataList.map(element => {
      this.cy.add({
        group: element.type,
        data: element.data,
        position: element.position
      })
    })
  }

  updateCyFlow = (flowData) => {
    if (this.flowIdList.includes(flowData.id)) {
      var index = this.flowIdList.indexOf(flowData.id);
      if (index !== -1) this.flowIdList.splice(index, 1);
    }

    flowData.removeId.map(id => {
      this.cy.remove(this.cy.$(`#${id}`));
    })

    this.flowIdList.push(flowData.id)
    if (flowData && flowData.dataList) {
      this.addFlowdata(flowData)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let flowData = this.props.flowData
    if (flowData && flowData.id !== 0) {
      this.updateCyFlow(flowData)
    }
  }

  componentDidMount() {
    this.renderCytoscapeElement();
    if (this.props.flowInstance) {
      this.props.flowInstance.map(element => {
        this.cy.add({
          group: element.type,
          data: element.data,
          position: element.position,
          classes: element.classes
        })
      })
    }
    else {
      this.addFlowdata(defaultFlow())
      if (this.props.flowData && this.props.flowData.id !== 0) {
        this.addFlowdata(this.props.flowData)
      }
    }
  }

  componentWillUnmount() {
    let elementList = []
    this.cy.nodes().map(ele => {
      elementList.push({ type: 'nodes', data: ele.data(), position: ele.position() })
    })

    this.cy.edges().map(ele => {
      elementList.push({ type: 'edges', data: ele.data() })
    })
    this.props.saveFlowInstance(elementList)
    this.cy.destroy()
  }
}
export default MexFlow;