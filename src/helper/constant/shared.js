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

import { v1 as uuidv1 } from 'uuid';
import { PAGE_ORGANIZATIONS } from "./perpetual";

export const uniqueId = ()=>{
    return uuidv1()
}

export const isPathOrg = (self)=>{
    return self.props.history.location.pathname.includes(PAGE_ORGANIZATIONS.toLowerCase())
}

export const validateRemoteCIDR = (form) => {
    if (form.value && form.value.length > 0) {
        if (!/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/([0-9]|1[0-9]|2[0-9]|3[0-2]?)$/.test(form.value)) {
            form.error = 'Destination CIDR format is invalid (must be between 0.0.0.0/0 to 255.255.255.255/32)'
            return false;
        }
    }
    form.error = undefined;
    return true;
}

export const validateRemoteIP = (form) => {
    if (form.value && form.value.length > 0) {
        if (!/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(form.value)) {
            form.error = 'Route IP format is invalid (must be between 0.0.0.0 to 255.255.255.255)'
            return false;
        }
    }
    form.error = undefined;
    return true;
}