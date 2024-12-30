import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
    flex: 1,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  smallIcon: {
    marginRight: 10,
    fontSize: 24,
    // color: '#000000',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 260,
    width: 260,
    marginTop: 30,
  },
  action: {
    flexDirection: 'row',
    paddingTop: 14,
    paddingBottom: 3,
    marginTop: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#420475',
    borderRadius: 50,
  },
  textInput: {
    flex: 1,
    marginTop: -12,
    color: '#05375a',
  },
  inputContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  forgotpassword: {
    alignItems: 'flex-end',
    marginRight: 20,
  },
  text_footer: {
    color: 'tomato',
    fontSize: 14,
  },
  text_header: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 30,
    marginBottom: 10,
  },
  text_subheader: {
    color: 'gray',
  },
  text_subheader_highlight: {
    color: 'tomato',
  },
  text_error: {
    color: 'red',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 10,
  },
  bottom_section: {
    alignItems: 'center',
    margin: 20,
  },
  inBut: {
    width: '85%',
    backgroundColor: 'tomato',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 50,
  },
  radioView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioText: {
    color: 'black',
    fontSize: 15,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  termsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    textDecorationLine: 'underline',
    fontStyle: 'italic'
  },
});

export default styles;
