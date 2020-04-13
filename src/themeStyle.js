import {createMuiTheme} from "@material-ui/core";


export const THEME_TYPE = {
    LIGHT: 'light',
    DARK: 'dark'
}

export const getDarkTheme = () => {
    return createMuiTheme({
        palette: {
            type: 'dark',
            primary: {
                //main: '#77BD25',
                main: '#77BD25',
            },
            /*background: {
                default: '#000',
            },*/

        },
        overrides: {
            MuiSvgIcon: {
                root: {
                    color: '#fff',
                }
            },
            /* MuiIconButton: {
                 root: {
                     color: 'white !important'
                 },
             },
             MuiSwitch: {
                 thumb: {
                     color: '#a4aa0e',
                 },
             },
             MuiToolbar: {
                 regular: {
                     backgroundColor: "#aeb1cd",
                     color: "#fff",
                     height: "32px",
                     minHeight: "32px",
                     '@media (min-width: 600px)': {
                         minHeight: "48px"
                     }
                 },
             },*/
        }
    })
}

export const getLightTheme = () => {
    return createMuiTheme({
        palette: {
            type: 'light',
            primary: {
                //main: '#77BD25',
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
                    backgroundColor: "#e0b518",
                    color: "#fff",
                    height: "22px",
                    minHeight: "22px",
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
                    color: '#fccb2f',
                }
            },
            MuiCard: {
                root: {
                    marginTop: '-18px',
                    background: '#d4b205 !important',
                    backgroundColor: '#d4b205 !important'
                }
            }

        }
    })
}
