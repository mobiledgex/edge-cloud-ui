const React = require("react");

const { StyleSheet } = React;

export default {
    container: {
        backgroundColor: "#F0F",
        color: "#0FF"
    },
    text: {
        alignSelf: "center",
        marginBottom: 7
    },
    mb: {
        marginBottom: 15
    },
    tiny: {
        margin: 2,
        fontSize: 9
    },
    gridBack: {
      backgroundColor: "#00FFFF"
    },

    topHeader: {
        padding: "5px",
        textAlign: "center",
        color: "#ffffff",
        background: `linear-gradient(to bottom, #2f5a94, #4d7094, #2f5a94)`
    },
    topHeaderPlat: {
        padding: "5px",
        textAlign: "center",
        fontSize:{ value: '11px', important: 'true'},
        color: {
            value: '#ffffff',
            important: 'true'
        },
        background: `linear-gradient(to bottom, #0061b6, #0061b6, #0061b6)`
    },
    headerRowDark: {
        padding: "5px",
        backgroundColor: "#7F8595",
        color:'white',
        textAlign:'center',
    },

    leftColumnGrey: {
        backgroundColor: "#e4e7f0",
        textAlign:'center'
    },
    leftColumnBorder: {
        borderRight: 'solid 1px #01529a'
    },
    headerRowDarkPoint: {
        borderRight: 'solid 1px #01529a',
        padding: "5px",
        backgroundColor: "#7F8595",
        color:'white',
        textAlign:'center'
    },
    reducePadding: {
        paddingRight:'0px',
        paddingLeft:{ value: '5px', important: 'true'}
    },
    borderRightBold: {
        borderRight:{ value: 'solid 2px #01529a', important: true}
    },


};
