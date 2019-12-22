import React from 'react'
import Lottie from 'react-lottie';
import animationData from '../../lotties/material-loading.json'

export default class LottieExampleScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {isStopped: false, isPaused: false};
    }

    render() {


        return <div>
            <div>sldkflsdkflksdflksdf</div>


            <Lottie
                options={{
                    loop: true,
                    autoplay: true,
                    animationData: animationData,
                    rendererSettings: {
                        preserveAspectRatio: 'xMidYMid slice'
                    }
                }}
                height={100}
                width={100}
                isStopped={false}
                isPaused={false}/>

        </div>
    }
}
