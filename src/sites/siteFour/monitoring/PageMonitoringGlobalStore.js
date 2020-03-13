import {store} from "react-easy-state";
import * as React from 'react';


type TypeGlobalStore = {
    num: number,
    loading: boolean,
    count: number,
}


export default class GlobalStore extends React.Component {

    static state: TypeGlobalStore = store({
        num: 0,
        loading: false,
        count: 0,
    });

    static increment = () => {
        this.state.num++;
    }


    static decrement = () => {
        this.state.num--;
    }

    static toggleLoading = () => {
        this.state.loading = !this.state.loading;
    }

    static incrementCount = () => {
        this.state.count++;
    }


};
