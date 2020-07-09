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
  // transition: 'width 3s',
  backgroundColor: '#1A1C21'
};

class MexFlow extends React.Component {
  constructor(props) {
    super(props);
    this.renderCytoscapeElement = this.renderCytoscapeElement.bind(this);
    this.state = {
      flowDataList: []
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
    console.log('Rahul1234', props.data)
    if (props.flowDataList && props.flowDataList !== state.flowDataList) {
      return { flowDataList: props.flowDataList }
    }
    return null
  }

  render() {
    return (
      <div style={cyStyle} id="cy" />
    )
  }

  addFlowdata = (flowData) => {
    if (flowData) {
      flowData.dataList.map(element => {
        this.cy.add({
          group: element.type,
          data: element.data,
          position: element.position,
          classes: element.classes
        })
      })
    }
  }

  updateCyFlow = (flowDataList) => {
    flowDataList.map(flowData => {
      if (flowData) {
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
    })
  }

  componentDidUpdate(prevProps, prevState) {
    let flowDataList = this.props.flowDataList
    if (flowDataList && flowDataList.length > 0) {
      this.updateCyFlow(flowDataList)
    }
  }

  componentDidMount() {
    this.renderCytoscapeElement();
    if (this.props.flowInstance) {
      this.props.flowInstance.map(element => {
        this.cy.add({
          group: element.type,
          data: element.data,
          position: element.position
        })
      })
    }
    else {
      this.addFlowdata(defaultFlow())
      let flowDataList = this.props.flowDataList
      if (flowDataList && flowDataList.length > 0) {
        flowDataList.map(flowData => {
          this.addFlowdata(flowData)
        })
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