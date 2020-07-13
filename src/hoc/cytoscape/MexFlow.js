import React from 'react';
import cytoscape from 'cytoscape';
import { style } from './style';
import { defaultFlow } from './clusterElements'

export const FLOW_ADD = 'add'
export const FLOW_REMOVE = 'remove'
export const FLOW_UPDATE = 'update'

const cyStyle = {
  height: '70vh',
  width: '100%',
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
    this.edgeFlowList = [
      { id: [1, 3], active: true },
      { id: [2, 4], active: false },
      { id: [5], active: false },
      { id: [6], active: false },
      { id: [7], active: false },
      { id: [8], active: false }]
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
      level: (window.screen.width)/2400,
      renderedPosition: { x: 50, y: 50 }
    });
  }

  static getDerivedStateFromProps(props, state) {
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
        if (element.type === 'update') {
          this.cy.$(`#${element.data.id}`).data('label', element.data.label)
        }
        else {
          this.cy.add({
            group: element.type,
            data: element.data,
            position: element.position,
            classes: element.classes
          })
        }
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

  highlightNextEle = () => {
    if (!this.cy.destroyed()) {
      if (this.cy.$('#99901').length > 0) {
        for (let i = 0; i < this.edgeFlowList.length; i++) {
          let flow = this.edgeFlowList[i]
          if (flow.active) {
            let count = 0
            flow.active = false;
            flow.id.map(id => {
              if (this.cy.$(`#9990${id}`).length > 0) {
                count++
                this.cy.$(`#9990${id}`).animate({
                  style: { 'line-color': '#66bb6a', 'target-arrow-color': '#66bb6a' }
                }, {
                  duration: 500
                }
                ).delay(1000).animate({
                  style: { 'line-color': 'white', 'target-arrow-color': 'white' }
                })
              }
            })
            this.edgeFlowList[this.edgeFlowList.length === i + 1 ? 0 : i + 1].active = true
            if (count > 0) {
              break;
            }
          }
        }
      }
      setTimeout(this.highlightNextEle, 1000);
    }
  };

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
      this.highlightNextEle()
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
    if (this.props.saveFlowInstance) {
      this.props.saveFlowInstance(elementList)
    }
    this.cy.destroy()
  }
}
export default MexFlow;