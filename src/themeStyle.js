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
                    backgroundColor: '#0c0a0a'
                }
            },
        }
    })
}

export const getLightTheme = () => {
    return createMuiTheme({
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
