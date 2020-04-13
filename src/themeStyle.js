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
            MuiIconButton: {
                root: {
                    color: 'white !important'
                },
            },
            MuiSvgIcon: {
                root: {
                    color: '#c06520',
                }
            }
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
                    backgroundColor: "#1f30c0",
                    color: "#fff",
                    height: "32px",
                    minHeight: "32px",
                    '@media (min-width: 600px)': {
                        minHeight: "48px"
                    }
                },
            },
            MuiList: {
                root: {
                    backgroundColor: "#fff",
                    background: "#fff !important",
                    color:'#1c1b19 !important'
                },
            },
            MuiSvgIcon: {
                root: {
                    color: '#c00709',
                }
            }

        }
    })
}
