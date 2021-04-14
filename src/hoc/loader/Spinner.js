import React from 'react';
import { useSelector } from "react-redux";
import { GridLoader } from "react-spinners";

const Loader = (props) => {
    const loading = props.loading ? props.loading : useSelector(state => state.loadingSpinner.loading);
    return (
        loading ?
            <div style={{ position:'fixed', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width:'100vw', zIndex:9999 }} >
                <GridLoader
                    sizeUnit={"px"}
                    size={25}
                    color={'#70b2bc'}
                    loading={loading}
                />
            </div > : null
    )
}

export default Loader;