import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  cardContainer: {
    padding: 0,
    backgroundColor: "#ffffff",
    borderRadius: 9,
    borderBottomColor: "#ffffff",
    borderWidth: 0.5,
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
    marginTop: 0,
    fontSize: 16,
  },
  subTitleStyle: {
    color: "#999",
    fontFamily: "HelveticaNeue",
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    paddingTop: 5,
    fontSize: 14,
  },
  listContainer: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    borderBottomColor: "#ffffff",
    borderWidth: 0,
    elevation: 2,
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
    paddingLeft: 20,
    paddingRight: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },

  bottomAView: {
    backgroundColor: "#ffffff",
    padding: 0,
    paddingLeft: 20,
    paddingRight: 10,
    marginBottom: 0,
    alignSelf: "center",
  },

  cr_txt: {
    color: "#be4020",
    fontFamily: "HelveticaNeue",
    fontSize: 16,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.75,
    marginLeft: 80,
    padding: 3,
  },

  aw_txt: {
    color: "#333",
    fontFamily: "HelveticaNeue",
    fontSize: 15,
    fontWeight: "normal",
    fontStyle: "italic",
    lineHeight: 20,
    letterSpacing: 0.75,
    marginLeft: 80,
    padding: 1,
  },

  dt_txt: {
    color: "#999",
    fontFamily: "HelveticaNeue",
    fontSize: 13,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.75,
    marginLeft: 80,
    padding: 1,
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
    flexWrap: "wrap",
    flex: 1,
    textAlign: "right",
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

  hcbut: {
    margin: 20,
    padding: 20,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 25,
    shadowOpacity: 1,
  },

  nopacity: {  
    opacity: .3,
  },
  pacity: {  
    opacity: 1,
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
    fontSize: 15,
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
