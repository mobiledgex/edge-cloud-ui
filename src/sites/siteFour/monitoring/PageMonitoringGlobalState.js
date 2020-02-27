// @flow
import React, {Component} from 'react'

export interface MonitoringContextInterface {
    loading: boolean,

    toggleLoading(): any,

}

export const MonitoringContext = React.createContext<MonitoringContextInterface>();
export const MonitoringConsumer = MonitoringContext.Consumer;

interface Props {
}

interface State {
    loading: boolean,
    clickedCount: any,

}

export class PageMonitoringProvider extends Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            loading: false,
            clickedCount: 0,
        }

    }

    toggleLoading = () => {
        this.setState({
            loading: !this.state.loading,
        })
    }


    render() {

        return (
            <MonitoringContext.Provider value={{
                loading: this.state.loading,
                toggleLoading: this.toggleLoading,
            }}>
                {this.props.children}
            </MonitoringContext.Provider>

        )
    }
}

