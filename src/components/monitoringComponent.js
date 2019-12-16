import React, {Component} from 'react'


const withRequest = (props) => (MonitoringComponent) => {
    return class extends Component {

        state = {
            data: null,
            width:800,
            height:400
        }

        componentDidMount() {
            this.setState({
                width:props ? props.width : this.state.width,
                height:props ? props.height : this.state.height})
        }

        /**
         * param : imageSize={{ x: 378, y: 308 }} - 이미지의 원본 사이즈
         * @returns {*}
         */

        render() {
            const { data, width, height } = this.state;
            return (


                <div
                     style={{width: width, height: height, paddingLeft:20,paddingRight:20, paddingBottom:10, overflow:false, backgroundColor:'rgba(0,0,0,.3)'}}
                >
                    <MonitoringComponent {...this.props} data={data}/>
                </div>

            )
        }
    }
}

export default withRequest;