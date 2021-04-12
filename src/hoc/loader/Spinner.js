import React from 'react';
import { useSelector } from "react-redux";
import { GridLoader } from "react-spinners";

const Loader = (props) => {
    const loading = props.loading ? props.loading : useSelector(state => state.loadingSpinner.loading);
    return (
        loading ?
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} >
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