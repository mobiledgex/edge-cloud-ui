import React from "react";
import NodeInformation from "../components/NodeInformation";

const BubbleChart = defaultProps => {
    const [data, setData] = React.useState([]);
    const [size, setSize] = React.useState({width:400, height:200});


    React.useEffect(() => {
        if (defaultProps.size) setSize({width: defaultProps.size.width*2/3-10, height:defaultProps.size.height});

    }, [defaultProps]);


    return (
        <div style={{ width: "100%", height: "100%", overflow: "auto", display:'flex', flexDirection:'row' }}>
            <div style={{width: size.width, height:'100%', backgroundColor:"#202329", marginRight:10}}>
                <NodeInformation size={size} />
            </div>
            <div style={{width: "33.33%", height:'100%'}}>
                <div className='page_monitoring_node_contain'>
                    <div className='page_monitoring_node_label'>Master</div>
                    <div className='page_monitoring_node_count'>1</div>
                </div>
                <div className='page_monitoring_node_contain'>
                    <div className='page_monitoring_node_label'>Node</div>
                    <div className='page_monitoring_node_count'>2</div>
                </div>
            </div>
        </div>
    );
};

export default BubbleChart;
