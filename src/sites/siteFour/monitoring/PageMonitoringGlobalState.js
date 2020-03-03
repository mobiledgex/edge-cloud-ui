// @flow
import React, {Component} from 'react'

export interface MonitoringContextInterface {
    loading: boolean,
    stacked: boolean,
    toggleLoading: any,
    toggleStacked: any,

}

export const MonitoringContext = React.createContext<MonitoringContextInterface>();
export const MonitoringConsumer = MonitoringContext.Consumer;

interface Props {
}

interface State {
    loading: boolean,
    clickedCount: any,
    stacked: boolean,

}

export class PageMonitoringProvider extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            loading: false,
            clickedCount: 0,
            stacked: false,
        }

    }

    toggleLoading = () => {
        this.setState({
            loading: !this.state.loading,
        })
    }
    toggleStacked = () => {
        this.setState({
            stacked: !this.state.stacked,
        },()=>{
            alert(this.state.stacked)
        })
    }


    render() {

        return (
            <MonitoringContext.Provider value={{
                loading: this.state.loading,
                stacked: this.state.stacked,
                toggleLoading: this.toggleLoading,
                toggleStacked: this.toggleStacked,
            }}>
                {this.props.children}
            </MonitoringContext.Provider>

        )
    }
}

