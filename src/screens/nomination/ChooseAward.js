import React, { Fragment } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { NavigationEvents } from "react-navigation";
import { Button, Overlay, Input } from "react-native-elements";
import AwardCard from "../../components/AwardCard/AwardCard";
import MenuBack from "../../components/MenuImage/MenuBack";
import MenuImageRight from "../../components/MenuImage/MenuImageRight";
import * as Konstants from "../../constants/constants";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

var _this;
var _token = "";

export default class ChooseAward extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "NOMINATE AWARD",
    headerLeft: (
      <MenuBack
        onPress={() => {
          navigation.navigate("NominateAward", { paramFrom: "chooseaward" });
        }}
      />
    ),
  });

  constructor(props) {
    super(props);
    this.state = {
      pageLoading: false,
      showCard: false,
      resetSearchKey: false,
      awardsList: [],
      empId: "",
      awardId: "",
      selAward: {},
      showSelectedAward: false,
      showPoints: false,
      showSinglePoints: false,
      showNonMtry: false,
      pickerPoints: "",
      ovIncrement: "",
      ovRange: "",
      ovPoints: "",
      apOverlayVisible: false,
    };

    _this = this;
  }

  onViewWillFocus() {
    AsyncStorage.getItem("AS_TOKEN")
      .then((value) => {
        _token = value.toString();
      })
      .done();

    AsyncStorage.getItem("AS_SELECTED_EMP_NUMS")
      .then((value) => {
        var empNums = JSON.parse(value);
        _this.state.empId = empNums.toString();
        _this.apiAwardList(empNums.toString());
      })
      .done();
  }

  apiAwardList = (idz) => {
    this.setState({ pageLoading: true });
    var recipientList = idz;
    var teamName = "";

    var query =
      "?" +
      "token=" +
      _token +
      "&" +
      "RecipientList=" +
      recipientList +
      "&" +
      "sTeamName=" +
      teamName;
    var url =
      Konstants.API_ROOT_URL + "/Nomination/GetRecipientEligebleAwards" + query;

    // console.log(url);

    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ pageLoading: false });
        //debugger
        if (responseJson == "Invalid Token") {
          Alert.alert(
            "Alert",
            Konstants.MSG_SESSION_OUT,
            [{ text: "OK", onPress: () => _this.logOutUser() }],
            { cancelable: false }
          );
        } else {
          this.setState({
            awardsList: responseJson,
          });
        }
      })
      .catch((error) => {
        console.error(error);
        this.setState({ pageLoading: false });
      });
  };

  logOutUser() {
    this._clearAll()
      .then(function() {
        // console.log("Logout successful");
        _this.props.navigation.navigate("LoginHome");
      })
      .catch(function(error) {
        console.log("problem: " + error.message);
        //throw error;
      });
  }

  _clearAll = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      // clear error
    }
  };

  _gotoAwardsCriteria = () => {
    if (this.state.awardId.trim() == "") {
      //Alert.alert("Alert","Please choose Award");
    } else {
      this.props.navigation.navigate("AwardCriteria");
    }
  };

  _chooseAward = (obj) => {
    //check if range exists
    if (obj.ranPoints.length > 0) {
      this.setState({
        ovRange: obj.Range,
        ovIncrement: obj.incrementFactor,
        ovRanPointsArr: obj.ranPoints,
        ovPoints: "",
        apOverlayVisible: true,
      });
    }

    this.setState({
      showPoints: false,
      showSinglePoints: false,
      showNonMtry: false,
      showSelectedAward: false,
    });

    AsyncStorage.setItem("AS_SELECTED_AWARD_POINTS", "0");

    this.setState({ awardId: obj.RewardID.toString() });
    this.setState({ selAward: obj });

    AsyncStorage.getItem("AS_SELECTED_AWARD_ID")
      .then((value) => {
        if (value != null) {
          if (obj.RewardID.toString() != value) {
            //debugger
            AsyncStorage.removeItem("AS_SELECTED_CR_ID");
            let keys = ["AS_SELECTED_CR_ID", "AS_SELECTED_AWARD_NAME", "AS_SELECTED_AWARD"];
            AsyncStorage.multiRemove(keys, (err) => {
            });
            this.setAsyncForAward(obj);
          } 
        } else {
          //debugger
          this.setAsyncForAward(obj);
        }
      })
      .done();

    if (obj.Points != null) {
      AsyncStorage.setItem("AS_SELECTED_AWARD_POINTS", obj.Points.toString());
    }

    if (obj.Range.toString() == "Non-Monetary") {
      this.setState({ showNonMtry: true });
    } else {
      if (obj.ranPoints.length == 0) {
        this.setState({ showSinglePoints: true });
      } else {
        this.setState({ showPoints: true });
      }
    }

    this.setState({ showSelectedAward: true });
  };

  setAsyncForAward = (obj) => {
    AsyncStorage.setItem("AS_SELECTED_AWARD_ID", obj.RewardID.toString());
    AsyncStorage.setItem(
      "AS_SELECTED_AWARD_NAME",
      obj.RewardName.toString()
    );
    AsyncStorage.setItem("AS_SELECTED_AWARD", JSON.stringify(obj));


  };

  updateOVPoints = (txt) => {
    this.setState({ ovPoints: txt });
  };

  addOVPoints() {
    const { ovRanPointsArr, ovPoints } = this.state;

    if (ovPoints.length == 0) {
      Alert.alert("Alert", Konstants.MSG_POINTS_EMPTY);
    } else {
      if (ovRanPointsArr.includes(parseInt(ovPoints))) {
        this.setState(
          {
            apOverlayVisible: false,
          },
          () => {
            AsyncStorage.setItem(
              "AS_SELECTED_AWARD_POINTS",
              ovPoints.toString()
            );
          }
        );
      } else {
        Alert.alert("Alert", Konstants.MSG_POINTS_INVALID);
      }
    }
  }

  closeOveray() {
    this.setState({
      awardId: "",
      showSelectedAward: false,
      apOverlayVisible: false,
    });
  }

  render() {
    console.disableYellowBox = true;

    const {
      showSelectedAward,
      selAward,
      showPoints,
      showSinglePoints,
      showNonMtry,
    } = this.state;

    if (this.state.pageLoading) {
      return (
        <View style={[styles.loadingContainer, styles.horizontal]}>
          <ActivityIndicator size="large" color="#19537e" />
        </View>
      );
    }

    return (
      <View style={styles.body}>
        <NavigationEvents onWillFocus={this.onViewWillFocus} />

        <ScrollView>
          {this.state.awardsList.length == 0 && (
            <View
              style={{
                width: "90%",
                marginTop: 50,
                alignSelf: "center",
                borderColor: "#f2f2f2",
                borderWidth: 1,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  padding: 10,
                  color: "#DC143C",
                  lineHeight: 28,
                }}
              >
                You do not have any awards for chosen recipients
              </Text>
            </View>
          )}

          {this.state.awardsList.length > 0 && (
            <View style={{ borderColor: "red" }}>
              {this.state.awardsList.map((u, i) => {
                return (
                  <View key={i} style={styles.listStyle}>
                    <AwardCard
                      image={{ uri: u.RewardIcon }}
                      title={u.RewardName}
                      subTitle={u.Range}
                      onPress={() => {
                        this._chooseAward(u);
                      }}
                    />
                  </View>
                );
              })}

              <View style={{ height: 50 }} />
            </View>
          )}
        </ScrollView>

        <View style={{ marginBottom: 30 }}>
          {showSelectedAward && (
            <View style={styles.selItemContainer}>
              <Image
                style={styles.selItemImg}
                source={{ uri: selAward.RewardIcon }}
              />
              <Text style={styles.selItemText}>{selAward.RewardName}</Text>

              {showPoints && (
                <Text style={styles.selItemText}>{this.state.ovPoints}</Text>
              )}

              {showNonMtry && (
                <Text style={styles.selItemText}>{selAward.Range}</Text>
              )}

              {showSinglePoints && (
                <Text style={styles.selItemText}>{selAward.Points} Points</Text>
              )}
            </View>
          )}

          {this.state.awardsList.length > 0 && (
            <View style={{ height: 55 }}>
              {this.state.awardId.length > 0 ? (
                <Button
                  title="Proceed"
                  onPress={() => {
                    this._gotoAwardsCriteria();
                  }}
                  buttonStyle={{
                    height: 50,
                    borderRadius: 6,
                    marginTop: 0,
                    paddingHorizontal: 25,
                    width: "80%",
                    alignSelf: "center",
                    backgroundColor: "#19537e",
                  }}
                />
              ) : (
                <Button
                  title="Proceed"
                  onPress={() => {}}
                  buttonStyle={{
                    height: 50,
                    borderRadius: 6,
                    marginTop: 0,
                    paddingHorizontal: 25,
                    width: "80%",
                    alignSelf: "center",
                    backgroundColor: "#ccc",
                    opacity: 0.8,
                  }}
                />
              )}
            </View>
          )}

          {this.state.awardsList.length == 0 && (
            <Button
              title="Back"
              onPress={() => {
                this.props.navigation.navigate("NominateAward", {
                  paramFrom: "chooseaward",
                });
              }}
              buttonStyle={{
                height: 50,
                borderRadius: 6,
                marginTop: 20,
                paddingHorizontal: 25,
                width: "60%",
                alignSelf: "center",
                backgroundColor: "#222",
                opacity: 0.8,
              }}
            />
          )}
        </View>

        <Overlay
          isVisible={this.state.apOverlayVisible}
          windowBackgroundColor="#555"
          overlayBackgroundColor="#fff"
          borderRadius={15}
          fullScreen={true}
        >
          <View
            style={{
              marginTop: screenHeight / 20,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#f2f2f2",
              paddingTop: 10,
              paddingBottom: 30,
            }}
          >
            <TouchableOpacity
              style={{ alignSelf: "flex-end", paddingRight: 5 }}
              onPress={() => this.closeOveray()}
            >
              <Image
                style={styles.image}
                source={require("../../assets/images/cross.png")}
                resizeMode="contain"
                resizeMethod="resize"
              />
            </TouchableOpacity>

            <Text style={{ paddingLeft: 10, marginBottom: 10, fontSize: 20 }}>
              Award Points ({this.state.ovRange})
            </Text>

            <Input
              placeholder="Enter here"
              keyboardType="number-pad"
              autoFocus={true}
              clearButtonMode="while-editing"
              returnKeyType="done"
              underlineColorAndroid="transparent"
              onChangeText={this.updateOVPoints}
              value={this.state.ovPoints}
            />

            <Text
              style={{
                paddingLeft: 10,
                paddingTop: 10,
                fontSize: 16,
                color: "#666600",
                fontStyle: "italic",
              }}
            >
              Note: Enter points in multiples of 100
            </Text>

            <Button
              title="Proceed"
              onPress={() => {
                this.addOVPoints();
              }}
              buttonStyle={{
                height: 50,
                borderRadius: 6,
                marginTop: 70,
                paddingHorizontal: 25,
                width: "60%",
                alignSelf: "center",
                backgroundColor: "#19537e",
                opacity: 0.8,
              }}
            />
          </View>
        </Overlay>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  scrollView: {
    backgroundColor: "#fff",
  },

  body: {
    backgroundColor: "#fff",
    flex: 1,
  },

  listStyle: {
    //  marginTop:0,
    width: "95%",
    alignSelf: "center",
  },
  selItemContainer: {
    margin: 20,
    // marginTop:30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f2f7",
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 10,
  },
  selItemImg: {
    width: 60,
    height: 60,
  },
  selItemText: {
    padding: 5,
    color: "#1c1c1c",
    fontFamily: "HelveticaNeue",
    letterSpacing: 0,
    fontSize: 16,
  },
});
