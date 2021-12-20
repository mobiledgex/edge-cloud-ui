import React from "react";
import Terms from './Terms';
import AcceptablePolicy from "./AcceptablePolicy";
import './style.css'


export default function Policy(props) {
    return (
        <div className="terms">
            <div className="top-header" align="center">
                <img className='logo' src='/assets/brand/MobiledgeX_Logo_tm_white.svg' alt="MobiledgeX" />
            </div>
            <div className="main">
                {props.location.pathname === '/terms-of-use' ? <Terms /> : <AcceptablePolicy />}
            </div>
        </div>
    );
}