import React, { Fragment } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { NavigationEvents } from "react-navigation";
import AsyncStorage from "@react-native-community/async-storage";
import MenuImage from "../../components/MenuImage/MenuImage";
import MenuImageRight from "../../components/MenuImage/MenuImageRight";
import LogoTitle from "./DBHeader";
import FlipCard from "react-native-flip-card-view";
import { Avatar } from "react-native-elements";
import * as Konstants from "../../constants/constants";

var _this;

export default class DBHomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: () => <LogoTitle />,
    headerStyle: {
      backgroundColor: "#fff",
    },
    headerTintColor: "#fff",
    headerLeft: (
      <MenuImage
        onPress={() => {
          navigation.openDrawer();
        }}
      />
    ),
    swipeEnabled: false,
  });

  constructor(props) {
    super(props);
    this.state = {
      EmployeeName: "",
      EmployeeNumber: "",
      EmployeePhoto: "",
      LogoFileName: "",
      MontageFileName: "",
      OrganizationName: "",
      OrganizationId: "",
      Token: "",
      count_nm_rcvd: 0,
      count_nm_gv: 0,
      count_points_av: 0,
      menuList: [],
    };

    _this = this;
  }

  componentDidMount() {
    //disable back button in phone
    BackHandler.addEventListener("hardwareBackPress", function() {
      return true;
    });

    AsyncStorage.getItem("AS_EMP")
      .then((value) => {
        var empObj = JSON.parse(value);
        this.setState({ EmployeeName: empObj.EmployeeName });
        this.setState({ EmployeePhoto: empObj.EmployeePhoto });
        this.setState({ Token: empObj.LogginedData });

        var tmpArr = [];
        empObj.MenuList.forEach(function(obj, i) {
          for (var key in obj) {
            if (key == "MenuCode") {
              var code = obj[key].trim();
              tmpArr.push(code);
            }
          }
        });
        this.setState({ menuList: tmpArr });
        AsyncStorage.setItem("AS_MENU_LIST", JSON.stringify(tmpArr));
      })
      .done();
  }

  _renderFront(block_no) {
    switch (block_no) {
      case 1:
        return (
          <View style={styles.flipBox}>
            <Image
              style={styles.imageView1}
              source={require("../../assets/images/email_r.png")}
            />

            <Text style={styles.flipBoxText}>Nominations Recieved</Text>
          </View>
        );

      case 2:
        return (
          <View style={styles.flipBox}>
            <Image
              style={styles.imageView1}
              source={require("../../assets/images/email_g.png")}
            />

            <Text style={styles.flipBoxText}>Nominations Given</Text>
          </View>
        );

      case 3:
        return (
          <View style={styles.flipBox}>
            <Image
              style={styles.imageView1}
              source={require("../../assets/images/coins.png")}
            />

            <Text style={styles.flipBoxText}>Points Available</Text>
          </View>
        );

      default:
        return (
          <View>
            <Text>Menu</Text>
          </View>
        );
    }
  }
  //Desired screen view method in back page
  _renderBack(counts) {
    if (counts.toString().length == 1 && counts != "0") {
      counts = "0" + counts;
    }
    return (
      <View style={styles.circle}>
        <Text style={styles.circleText}>{counts}</Text>
      </View>
    );
  }

  onViewWillFocus() {
    AsyncStorage.getItem("AS_TOKEN")
      .then((value) => {
        var token = value.toString();
        _this.apiGetDBCounts(token);
      })
      .done();
  }

  apiGetDBCounts = (_token) => {
    this.setState({ pageLoading: true });

    var query = "?" + "token=" + _token + "&ver=" + new Date().getTime();

    var url = Konstants.API_ROOT_URL + "/Login/GetNomination_Points" + query;

    // console.log(url);

    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ pageLoading: false });

        if (responseJson == "Invalid Token") {
          Alert.alert(
            "Alert",
            Konstants.MSG_SESSION_OUT,
            [{ text: "OK", onPress: () => _this.logOutUser() }],
            { cancelable: false }
          );
        } else {
          this.setState({
            count_nm_rcvd: responseJson.NominationReceived,
            count_nm_gv: responseJson.NominationGiven,
            count_points_av: responseJson.PointsAvailableForRedeem,
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

  navigateToMenu = (menuCode, menuItem) => {
    if (this.state.menuList.includes(menuCode)) {
      this.props.navigation.navigate(menuItem, { paramFrom: "dbhome" });
    } else {
      Alert.alert(Konstants.MSG_NO_ACCESS);
    }
  };

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress");
  }

  render() {
    console.disableYellowBox = true;

    return (
      <View style={styles.container}>
        <NavigationEvents onWillFocus={this.onViewWillFocus} />

        <View style={styles.section}>
          <Avatar
            size="large"
            rounded
            source={{
              uri: this.state.EmployeePhoto,
            }}
          />

          <Text style={[styles.wltext, styles.flex2]}>
            {this.state.EmployeeName}
          </Text>

          <Text style={[styles.wltext2, styles.flex2]}>
            What would you like to do today?
          </Text>

          <View style={{ flex: 35, backgroundColor: "#fff" }}>
            <View style={styles.flipContainer}>
              <View style={styles.flipView}>
                <FlipCard
                  flipVertical={true}
                  velocity={5} // Velocity makes it move
                  tension={25} // Slow
                  friction={50}
                  perspective={1000}
                  flip={false}
                  renderFront={this._renderFront(1)}
                  renderBack={this._renderBack(this.state.count_nm_rcvd)}
                />
              </View>
              <View style={styles.flipView}>
                <FlipCard
                  style={{ flex: 1 }}
                  flipVertical={true}
                  velocity={5} // Velocity makes it move
                  tension={25} // Slow
                  friction={50}
                  perspective={1000}
                  flip={false}
                  renderFront={this._renderFront(2)}
                  renderBack={this._renderBack(this.state.count_nm_gv)}
                />
              </View>
              <View style={styles.flipView}>
                <FlipCard
                  style={{ flex: 1 }}
                  flipVertical={true}
                  velocity={5} // Velocity makes it move
                  tension={25} // Slow
                  friction={50}
                  perspective={1000}
                  flip={false}
                  renderFront={this._renderFront(3)}
                  renderBack={this._renderBack(this.state.count_points_av)}
                />
              </View>
            </View>

            <View style={{ flex: 3, backgroundColor: "#fff", marginTop: 10 }}>
              <View style={styles.topView}>
                <View style={styles.buttonViewContainer}>
                  <TouchableOpacity
                    style={styles.centerView}
                    onPress={() => {
                      this.navigateToMenu(
                        "MOBILE_NOMINATE_AWARD",
                        "NominateAward"
                      );
                    }}
                  >
                    <View style={styles.txtimgPadding}>
                      <Image
                        style={styles.imageView21}
                        source={require("../../assets/images/nm_award.png")}
                      />
                    </View>
                    <View style={styles.txtimgPadding}>
                      <Text style={styles.textView}>Nominate Award</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.buttonViewContainer}>
                  <TouchableOpacity
                    style={styles.centerView}
                    onPress={() => {
                      this.navigateToMenu(
                        "MOBILE_AWARD_CATALOG",
                        "RedemptionHome"
                      );
                    }}
                  >
                    <View style={styles.txtimgPadding}>
                      <Image
                        style={styles.imageView21}
                        source={require("../../assets/images/shopping-cart.png")}
                      />
                    </View>
                    <View style={styles.txtimgPadding}>
                      <Text style={styles.textView}>Redeem Award</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonViewContainer}>
                  <TouchableOpacity
                    style={styles.centerView}
                    onPress={() => {
                      this.navigateToMenu(
                        "MOBILE_APPROVE_AWARD",
                        "ApprovalHome"
                      );
                    }}
                  >
                    <View style={styles.txtimgPadding}>
                      <Image
                        style={styles.imageView21}
                        source={require("../../assets/images/flag.png")}
                      />
                    </View>
                    <View style={styles.txtimgPadding}>
                      <Text style={styles.textView}>Approve Award</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.topView1}>
                <View style={styles.buttonViewContainer}>
                  <TouchableOpacity
                    style={styles.centerView}
                    onPress={() => {
                      this.navigateToMenu(
                        "MOBILE_MY_RECOGNITION",
                        "RecognitionHome"
                      );
                    }}
                  >
                    <View style={styles.txtimgPadding}>
                      <Image
                        style={styles.imageView21}
                        source={require("../../assets/images/diploma.png")}
                      />
                    </View>
                    <View style={styles.txtimgPadding}>
                      <Text style={styles.textView}>My Recognition</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonViewContainer}>
                  <TouchableOpacity
                    style={styles.centerView}
                    onPress={() => {
                      this.navigateToMenu("MOBILE_AWARD_WALL", "AwardWallHome");
                    }}
                  >
                    <View style={styles.txtimgPadding}>
                      <Image
                        style={styles.imageView21}
                        source={require("../../assets/images/awardwall.png")}
                      />
                    </View>
                    <View style={styles.txtimgPadding}>
                      <Text style={styles.textView}>Award Wall</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.bottomSpacer} />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  section: {
    flex: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  textView: {
    textAlign: "center",
    fontSize: 16.5,
    fontFamily: "HelveticaNeue",
    fontWeight: "normal",
    fontStyle: "normal",
  },

  imageView1: {
    alignSelf: "center",
    marginBottom: 10,
  },
  wltext: {
    fontFamily: "HelveticaNeue",
    fontSize: 18,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0,
    color: "#3e4a59",
    paddingTop: 20,
  },
  wltext2: {
    fontFamily: "HelveticaNeue",
    fontSize: 18,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0,
    color: "#3e4a59",
  },
  flex2: {
    flex: 3,
  },

  circle: {
    width: 90,
    height: 90,
    borderRadius: 100 / 2,
    backgroundColor: "transparent",
    borderColor: "#fff",
    borderWidth: 1,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
  },
  circleText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "500",
    fontSize: 18,
    fontFamily: "HelveticaNeue",
  },
  txtimgPadding: {
    padding: 8,
  },
  buttonViewContainer: {
    width: "32%",
    height: 110,
    borderWidth: 0.5,
    borderColor: "#d6d7da",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  bottomSpacer: {
    width: "32%",
    height: 110,
    alignItems: "center",
  },
  centerView: {
    justifyContent: "space-around",
    alignItems: "center",
    alignSelf: "center",
  },
  topView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  topView1: {
    flex: 1.8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flipView: {
    width: "30%",
    height: 110,
    backgroundColor: "#19537e",
    alignItems: "center",
    borderRadius: 5,
  },
  flipContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flipBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  flipBoxText: {
    color: "#fff",
    alignSelf: "center",
    textAlign: "center",
    padding: 2,
  },
});
