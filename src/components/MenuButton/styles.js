import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

const styles = StyleSheet.create({
  btnClickContain: {
    flexDirection: "row",
    padding: 15,
    marginTop: screenHeight / 170,
    marginBottom: screenHeight / 170,
  },
  btnContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  btnIcon: {
    // height: 26,
    // width: 26
  },
  btnText: {
    fontFamily: "HelveticaNeue",
    fontSize: 16,
    marginLeft: 12,
    marginTop: 0,
    fontStyle: "normal",
    lineHeight: 20,
    // letterSpacing: -0.05,
    color: "#66788a",
  },
});

export default styles;
