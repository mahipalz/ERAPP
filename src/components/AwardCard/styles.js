import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  cardContainer: {
    padding: 0,
    backgroundColor: "#d6d6d6",
    borderRadius: 9,
    borderBottomColor: "#d6d6d6",
    borderWidth: 0,
    marginBottom: 0,
  },
  closeButtonStyle: {
    alignSelf: "flex-end",
    zIndex: 1,
  },
  cardTitleStyle: {
    color: "#1c1c1c",
    fontFamily: "HelveticaNeue",
    letterSpacing: 0,
    marginTop: 0,
    fontSize: 16,
    textTransform: "uppercase",
  },
  subTitleStyle: {
    color: "#1c1c1c",
    fontFamily: "HelveticaNeue",
    letterSpacing: 0,
    marginTop: 8,
    fontSize: 12,
  },
  listContainer: {
    backgroundColor: "#f2f2f2",
    borderRadius: 9,
    borderBottomColor: "#fff",
    borderWidth: 0,
    elevation: 2,
    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 1,
    shadowOpacity: 1,
  },
});

export default styles;
