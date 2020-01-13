import React from 'react';
import './PageMonitoring.css';
import {toast} from "react-semantic-toasts";


export const showToast = (title: string) => {
    toast({
        type: 'success',
        //icon: 'smile',
        title: title,
        //animation: 'swing left',
        time: 3 * 1000,
        color: 'black',
    });
}
