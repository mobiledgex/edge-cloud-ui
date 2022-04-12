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

import React from 'react'
import { Checkbox, Divider, FormControlLabel, Grid, Typography } from "@material-ui/core"

const CheckBoxArray = (props) => {
    let form = props.form
    let position = form.position
    return (
        <div style={{ width: '100%' }}>
            {
                form.label ?
                    <React.Fragment>
                        <Typography >{form.label}</Typography>
                        <Divider />
                        <br />
                    </React.Fragment> : null
            }
            {
                <Grid container>
                    {form.options.map(option => (
                        <FormControlLabel
                            key={option}
                            control={
                                <Checkbox
                                    onChange={(e) => props.onChange(position, form, option)}
                                    checked={form.value ? form.value.includes(option) : false}
                                    name={option}
                                />
                            }
                            label={option}
                        />
                    ))}
                </Grid>
            }
        </div>
    )
}

export default CheckBoxArray