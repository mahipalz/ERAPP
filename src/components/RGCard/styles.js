import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  cardContainer: {
    padding: 0,
    borderRadius: 10,
    marginBottom: 0,
    elevation: 2,
    shadowColor: "rgba(0, 0, 0, 0.08)",
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowRadius: 25,
    shadowOpacity: 1,
  },

  cardTitleStyle: {
    color: "#1c1c1c",
    fontFamily: "HelveticaNeue",
    fontWeight: "600",
    fontStyle: "normal",
    letterSpacing: 0,
    marginTop: -10,
    fontSize: 18,
  },
  subTitleStyle: {
    color: "#9c9c9c",
    fontFamily: "HelveticaNeue",
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    marginTop: 8,
    fontSize: 16,
  },
  listContainer: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    borderBottomColor: "#ffffff",
    borderWidth: 0,
    shadowColor: "rgba(0, 0, 0, 0.08)",
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowRadius: 25,
    shadowOpacity: 1,
    marginTop: -20,
  },

  bottomView: {
    backgroundColor: "#ffffff",
    padding: 0,
    // paddingLeft:20,
    paddingRight: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },

  hcbut: {
    marginTop: -10,
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#ffffff",
    elevation: 2,
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowRadius: 25,
    shadowOpacity: 1,
  },

  nmby_txt: {
    color: "#9b9b9b",
    fontFamily: "HelveticaNeue",
    fontSize: 15,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.75,
    flexWrap: "wrap",
    flex: 2.5,
  },
  nmby_title: {
    color: "#19537e",
    fontFamily: "HelveticaNeue",
    fontSize: 15,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.75,
  },
  nmby_dt: {
    color: "#9c9c9c",
    fontFamily: "HelveticaNeue",
    fontSize: 13,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.75,
  },
  nmtr_text: {
    color: "#be4020",
    fontFamily: "HelveticaNeue",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.75,
  },
  closeButtonStyle: {
    alignSelf: "flex-end",
    zIndex: 1,
    top: 20,
    right: 20,
  },

  cr_txt: {
    color: "#be4020",
    fontFamily: "HelveticaNeue",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    marginTop: -20,
  },

  cr_txt_1: {
    color: "#444",
    fontFamily: "HelveticaNeue",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    marginTop: -20,
    fontStyle: "italic",
  },

  cbut: {
    margin: 20,
    padding: 20,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowRadius: 25,
    shadowOpacity: 1,
  },
  btnText: {
    paddingLeft: 10,
    fontFamily: "HelveticaNeue",
    fontSize: 15,
    fontWeight: "normal",
    fontStyle: "normal",
  },

  team_txt: {
    color: "#888",
    fontFamily: "HelveticaNeue",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.75,
    marginLeft: 80,
    padding: 1,
    marginBottom: 10,
  },
});

export default styles;
