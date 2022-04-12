/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
