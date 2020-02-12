import React from 'react';
import { GridLoader } from "react-spinners";

export const showLoader = (flag)=>
{
    return (
        <div className="loadingBox" style={{ zIndex: 9999 }}>
            <GridLoader
                size={20}
                sizeUnit={'px'}
                color={'#70b2bc'}
                loading={flag} />
        </div>
    )
}