import React from 'react';
import HorizontalTimeline from 'react-horizontal-timeline';

const VALUES = [ 2, 5, 15, 4 ];
const LABELS = [ "Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4" ];

class TimelineAuditView extends React.Component {
    state = { value: 0, previous: 0 };

    render() {
        return (
            <div style={{width:'100%', height:80}}>
                {/* Bounding box for the Timeline */}
                <div style={{ width: '60%', height: '100px', margin: '0 auto' }}>
                    <HorizontalTimeline
                        index={this.state.value}
                        indexClick={(index) => {
                            this.setState({ value: index, previous: this.state.value });
                        }}
                        values={ VALUES }
                        labels={ LABELS } />
                </div>
                <div className='text-center'>
                    {/* any arbitrary component can go here */}
                    {this.state.value}
                </div>
            </div>
        )
    }
}


export default TimelineAuditView;
