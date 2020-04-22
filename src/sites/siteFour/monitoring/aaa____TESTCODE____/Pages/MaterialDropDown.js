import React from 'react';
import 'chartjs-plugin-streaming';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";


type Props = {};

export default function MaterialDropDown() {

    return (

        <div style={{flex: 1, display: 'flex'}}>
            <div>
                sdlfksdlkflsdkflk
            </div>
            <div>
                sdlfksdlkflsdkflk
            </div>

            <div>
                sdlfksdlkflsdkflk
            </div>

            <FormControl style={{width: 150}}>
                <InputLabel htmlFor="age-native-simple">Age</InputLabel>
                <Select
                    MenuProps={{
                        getContentAnchorEl: null,
                        anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "left"
                        }
                    }}
                    value={10}
                    onChange={(e) => {

                        alert(e.target.value)

                    }}
                    inputProps={{
                        height: 50,
                    }}
                >
                    <option value="">
                        RESET ALL
                    </option>
                    <option value={10}>Ten</option>
                    <option value={20}>Twenty</option>
                    <option value={30}>Thirty</option>
                </Select>
            </FormControl>

        </div>
    )
}



