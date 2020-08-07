import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
  cardContainer: {
    padding: 0,
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
    borderBottomColor: "#f4f4f4",
    borderWidth: 0,
  },
  closeButtonStyle: {
    alignSelf: "flex-end",
    zIndex: 1,
    paddingRight: 5,
    paddingTop: 5,
  },
  cardTitleStyle: {
    color: "#1c1c1c",
    fontFamily: "HelveticaNeue",
    letterSpacing: 0,
    marginTop: 15,
    fontSize: 16,
  },
  subTitleStyle: {
    color: "#1c1c1c",
    fontFamily: "HelveticaNeue",
    letterSpacing: 0,
    marginTop: 8,
    fontSize: 14,
  },
  listContainer: {
    backgroundColor: "#f4f4f4",
    marginTop: -25,
  },
});

export default styles;
