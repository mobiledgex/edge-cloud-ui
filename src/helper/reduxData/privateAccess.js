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

import { localFields } from "../../services/fields"

const getObject = (self) => {
    if (self && self.props && self.props.privateAccess) {
        return self.props.privateAccess
    }
    else if(self && self[localFields.isPrivate])
    {
        return self
    }
}

export const isPrivate = (self)=>{
    let info = getObject(self)
    if (info) {
        return info.isPrivate
    }
    return false
}

export const regions = (self)=>{
    let info = getObject(self)
    if (info) {
        return info.regions
    }
    return false
}

export const isRegionValid = (self, region) => {
    let info = getObject(self)
    if (info) {
        return info.isPrivate && info.regions.includes(region)
    }
    return false
}