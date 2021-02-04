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