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


/*
*desc: checks if domain is local, only for environment type development
*/
export const isLocal = () => {
    const localDomains = ['localhost', 'kubernetes.docker.internal', '192.168.0.100']
    return localDomains.includes(window.location.hostname)
}

/*
*desc: change default hostname with user defined value
*/
export const changeHostName = (changeWith, value) => {
    let hostName = window.location.hostname
    let host = window.location.origin
    if (hostName.startsWith(changeWith)) {
        return host.replace(changeWith, value)
    }
}

/*
*desc: url without port no
*/
export const urlWithoutPort = () => {
    return `${window.location.protocol}//${window.location.hostname}`
}
