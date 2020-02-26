// @flow
import React, {Component} from 'react'

export interface MonitoringContextInterface {
    loading: boolean,
    clickedCount: string,

    setClickedCount(value: number): any,

    toggleLoading(): any,

    addClickedCount(): any,

    decrementClickedCount(): any,
}

export const MonitoringContext = React.createContext<MonitoringContextInterface>();
export const MonitoringConsumer = MonitoringContext.Consumer;

interface Props {
}

interface State {
    loading: boolean,
    clickedCount: any,

}

export class AppProvider extends Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            loading: false,
            clickedCount: 0,
        }

    }

    setClickedCount = (value: number) => {
        this.setState({
            clickedCount: value,
        })
    }

    decrementClickedCount = () => {
        this.setState({
            clickedCount: this.state.clickedCount - 1,
        })
    }

    addClickedCount = () => {
        this.setState({
            clickedCount: this.state.clickedCount + 1,
        })
    }

    toggleLoading = () => {
        this.setState({
            loading: !this.state.loading,
        })
    }


    render() {

        return (
            <MonitoringContext.Provider value={{
                clickedCount: this.state.clickedCount,
                loading: this.state.loading,
                setClickedCount: this.setClickedCount,
                toggleLoading: this.toggleLoading,
                addClickedCount: this.addClickedCount,
                decrementClickedCount: this.decrementClickedCount,
            }}>
                {this.props.children}
            </MonitoringContext.Provider>

        )
    }
}

