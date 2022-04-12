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

import { createTheme } from '@material-ui/core/styles'

export const THEME_TYPE = {
    LIGHT: 'light',
    DARK: 'dark'
}


export const getDarkTheme = () => {
    return createTheme({
        palette: {
            type: 'dark',
            primary: {
                main: '#77BD25',
            },
        },
        overrides: {
            MuiSvgIcon: {
                root: {
                    color: '#fff',
                }
            },
            MuiPaper: {
                root: {
                    backgroundColor: '#292C33',
                    /*marginBottom: -8,*/
                }
            },
        }
    })
}

export const getLightTheme = () => {
    return createTheme({
        palette: {
            type: 'light',
            primary: {
                main: '#2f46ff',
            },
            background: {
                default: '#fff',
            },
        },
        overrides: {
            MuiIconButton: {
                root: {
                    color: 'red !important'
                },
            },
            MuiToolbar: {
                regular: {
                    backgroundColor: "#2f46ff",
                    color: "#fff",
                    /*height: "22px",
                    minHeight: "22px",*/
                    '@media (min-width: 600px)': {
                        minHeight: "48px"
                    }
                },
            },
            MuiList: {
                root: {
                    backgroundColor: "#fff",
                    background: "#fff !important",
                    color: '#1c1b19 !important'
                },
            },
            MuiSvgIcon: {
                root: {
                    color: '#1026bb',
                }
            },
            MuiCard: {
                root: {
                    //marginTop: '-18px',
                    background: '#2f46ff !important',
                    backgroundColor: '#2f46ff !important'
                }
            }

        }
    })
}
