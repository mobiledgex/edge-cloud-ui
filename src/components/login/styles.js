
const React = require('react-native');

const { StyleSheet, Dimensions } = React;

const deviceHeight = Dimensions.get('window').height;

export default {
  imageContainer: {
    flex: 1,
    width: null,
    height: null
  },
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FBFAFA',
  },
  shadow: {
    flex: 1,
    width: null,
    height: null,
  },

  input: {
    marginBottom: 20
  },

  loginBtn: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor:'#001a36',
    height:50,
    //lineHeight:50,
    width: '100%'
  },

  textInput:{
    backgroundColor:'#ffffff',
    marginLeft: 30,
    marginRight:30,
    height:50,
    borderRadius:1,
    borderBottomWidth:0
  },

  logoContainer:{
    flex: 1,
    width: null,
    height: null
  },

  imageContainer:{
    flex: 1,
    width: null,
    height: null
  },
  userName:{
    width:130,
    height:15
  },

  loginAccount:{
    paddingLeft:30,
    color:'#ffffff',
    fontWeight:'bold',
    marginTop:5,
    borderBottomWidth: 0
  },

  loginWrapper:{
    paddingTop:70
    //backgroundColor:'yellow'
  }

};
