import React from 'react';
import TagCloud from 'react-tag-cloud';
import type {TypeClusterUsageList} from "../../../../shared/Types";
import {CHART_COLOR_MONOKAI} from "../../../../shared/Constants";

type Props = {
    allClusterUsageList: any,

};
type State = {
    allClusterUsageList: any,
};

export default class TagCloudContainer extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            allClusterUsageList: [],
        }
    }

    componentDidMount(): void {
        /* setInterval(() => {
             this.forceUpdate();
         }, 3000);*/
    }


    async componentWillReceiveProps(nextProps: Props, nextContext: any): void {

        if (this.props.allClusterUsageList !== nextProps.allClusterUsageList) {

            this.setState({
                allClusterUsageList: nextProps.allClusterUsageList,
            })
        }
    }

    makeRandNo(min, max) {
        let random = Math.floor(Math.random() * (max - min + 1) + min);

        return random;
    }

    render() {
        return (


            <div className='page_monitoring_dual_column' style={{display: 'flex'}}>

                <div className='page_monitoring_dual_container' style={{flex: 1}}>
                    <div className='page_monitoring_title_area draggable'>
                        <div className='page_monitoring_title'>
                            Cluster TAG CLOUD

                        </div>
                    </div>
                    <div className='page_monitoring_container'>
                        <TagCloud
                            style={{
                                fontFamily: 'sans-serif',
                                fontSize: 30,
                                fontWeight: 'bold',
                                fontStyle: 'italic',
                                //color: () => randomColor(),
                                width: window.innerWidth / 3.5,
                                height: 370,
                                padding: 5,
                                backgroundColor: '#0a0a0a',

                            }}>
                            {this.state.allClusterUsageList.map((item: TypeClusterUsageList, index) => {

                                let randNo = this.makeRandNo(15, 25);
                                let randNo2 = this.makeRandNo(100, 1200);

                                return (
                                    <div onClick={() => {
                                        alert('slkdfldkf')
                                    }} style={{fontSize: randNo, fontWeight: randNo2, fontFamily: 'Black Ops One', color: CHART_COLOR_MONOKAI[index]}}>{item.cluster}[{item.cloudlet}] </div>
                                )
                            })}

                        </TagCloud>
                    </div>
                </div>
            </div>


        );
    }
}
