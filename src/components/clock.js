import React, {Component} from 'react';
import Clock from 'react-live-clock';

class ClockComp extends Component{
    constructor() {
        super()
        this.state = {
            time: '',
            one: true,
            two: false,
            three: false,
            four: false,
            background: {
                backgroundColor: "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16)})
            },
            class: ''
        }

        //인터벌 발생시 component unmout 될때 오류 경고에 대한 대책
        this.mounted = false;
    }
    componentWillUnmount() {
        this.mounted = false;
    }
    componentDidMount() {


    }

    render() {
        return(
            <div style={{fontSize:26}} id='clock'>
                <Clock format={'YYYY/MM/DD HH:mm:ss'}
                       ticking={true}
                       timezone={'Asia/Tokyo'} />
            </div>
        )
    }
}



export default ClockComp;