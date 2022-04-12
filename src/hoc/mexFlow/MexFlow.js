/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import cytoscape from 'cytoscape';
import { style } from './style';

export const FLOW_ADD = 'add'
export const FLOW_REMOVE = 'remove'
export const FLOW_UPDATE = 'update'

const cyStyle = {
  height: '100%',
  width: '100%',
  // transition: 'width 3s',
  backgroundColor: '#1A1C21'
};

class MexFlow extends React.Component {
  constructor(props) {
    super(props);
    this.createFlowInstance = this.createFlowInstance.bind(this);
    this.state = {
      flowDataList: []
    }
    this.flowIdList = []
  }

  createFlowInstance() {
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
    this.cy.userZoomingEnabled(true)
    this.cy.zoom({
      level: (window.innerWidth) / 2600,
      renderedPosition: { x: 0, y: 50 }
    });
    this.cy.minZoom(0.3)
    this.cy.maxZoom((window.innerWidth) / 2600)
    this.cy.autolock(true)
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

  highlightNetworkFlow = () => {
    if (!this.cy.destroyed()) {
      if (this.cy.$('#99901').length > 0) {
        let edgeFlowList = this.props.flowObject.edgeFlowList
        for (let i = 0; i < edgeFlowList.length; i++) {
          let flow = edgeFlowList[i]
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
            edgeFlowList[edgeFlowList.length === i + 1 ? 0 : i + 1].active = true
            if (count > 0) {
              break;
            }
          }
        }
      }
      setTimeout(this.highlightNetworkFlow, 1000);
    }
  };

  componentDidMount() {
    this.createFlowInstance();
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
      this.addFlowdata(this.props.flowObject.defaultFlow())
      let flowDataList = this.props.flowDataList
      if (flowDataList && flowDataList.length > 0) {
        flowDataList.map(flowData => {
          this.addFlowdata(flowData)
        })
      }
      this.highlightNetworkFlow()
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