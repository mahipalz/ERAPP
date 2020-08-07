import { StyleSheet, Dimensions, Alert } from "react-native";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: screenHeight / 5,
  },
  container: {
    flex: 1,
    alignItems: "flex-start",
    marginLeft: -240,
  },
  imageView: {
    justifyContent: "center",
    alignItems: "center",
    // flex:1,
    // marginBottom:200
  },
  image: {
    width: 161,
    height: 46,
    marginLeft: 0,
    // marginTop:-260
  },
  centerView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },

  lineStyle: {
    borderBottomColor: "#cacbcc",
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
    width: "100%",
    padding: 10,
    marginBottom: 1,
  },
  welcomeText: {
    opacity: 8,
    fontFamily: "Helvetica",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    color: "#3a3b3f",
    alignSelf: "center",
    marginTop: screenHeight / 66,
    marginBottom: 5,
  },

  bottom: {
    fontFamily: "Helvetica",
    fontSize: 10,
    opacity: 0.4,
    marginTop: 5,
    alignItems: "center",
  },
  footer: {
    //  alignSelf:'center',
    marginBottom: screenHeight / 33,
    marginTop: screenHeight / 66,
    alignItems: "center",
  },
});

export default styles;
