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

export const NoData = (props) => (
    <div className="event-list-main" align="center" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
        <div align="left" className="event-list-header">
            <h3 className='chart-header'>{props.header}</h3>
        </div>
        <h3 style={{ padding: '90px 0px' }} className='chart-header'><b>No Data</b></h3>
    </div>
)