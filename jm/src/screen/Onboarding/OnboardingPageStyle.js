import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const slideStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 10,
    maxWidth: '70%',
    textAlign: 'center',
    lineHeight: 23,
  },
  image: {
    height: '55%', // Adjust the image height to give more space for text
    width,
    resizeMode: 'contain',
  },
  textContainer: {
    width: width * 0.8, // Constrain the width to avoid text overflow
    alignItems: 'center',
    paddingVertical: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
  selectedButton: {
    backgroundColor: '#FF6F61',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#FF6F61',
  },
});

const footerStyles = StyleSheet.create({
  container: {
    height: height * 0.25,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  indicator: {
    height: 2.5,
    width: 10,
    backgroundColor: 'grey',
    marginHorizontal: 3,
    borderRadius: 2,
  },
  btn: {
    flex: 1,
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  singleButtonContainer: {
    height: 50,
  },
  multiButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  singleButtonRight: {
    justifyContent: 'flex-end',
  },
  transparentButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  buttonSpacing: {
    width: 15,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  
});

export { slideStyles, footerStyles };
