import React from "react";
import { View, Image, Text, Platform, Alert, Dimensions } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import PropTypes from "prop-types";
import styles from "./styles";
import MenuButton from "../../components/MenuButton/MenuButton";
import * as Konstants from "../../constants/constants";
import { ScrollView } from "react-native-gesture-handler";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

var _this;

export default class DrawerContainer extends React.Component {
  constructor(props) {
    super(props);

    _this = this;

    this.state = {
      sb_emp_name: "",
      sb_logo: "",
      sb_montage: "",
      menuList: [],
    };

    AsyncStorage.getItem("AS_EMP")
      .then((value) => {
        var empObj = JSON.parse(value);

        var name = empObj.EmployeeName;

        var arr = name.split(" ");
        if (arr.length > 1) {
          name = arr[0];
        }

        var logo = empObj.LogoFileName;

        this.setState({ sb_emp_name: name, sb_logo: logo });

        var tmpArr = [];
        empObj.MenuList.forEach(function(obj, i) {
          for (var key in obj) {
            if (key == "MenuCode") {
              var code = obj[key].trim();
              tmpArr.push(code);
            }
          }
        });
        //console.log(tmpArr);
        this.setState({ menuList: tmpArr });
        AsyncStorage.setItem("AS_MENU_LIST", JSON.stringify(tmpArr));
      })
      .done();
  }

  navigateToMenu = (menuCode, menuItem, navigation) => {
    if (this.state.menuList.includes(menuCode)) {
      navigation.navigate(menuItem, { paramFrom: "drawer" });
      navigation.closeDrawer();
    } else {
      Alert.alert(Konstants.MSG_NO_ACCESS);
    }
  };

  logOut() {
    this.clearAll()
      .then(function() {
        // console.log("Logout successful");
        _this.props.navigation.navigate("LoginHome");
      })
      .catch(function(error) {
        console.log("problem: " + error.message);
        //throw error;
      });
  }

  clearAll = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      // clear error
    }
  };

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1, marginTop: screenHeight * 0.06 }}>
        <ScrollView>
          <View style={{ alignSelf: "center" }}>
            <Image
              style={styles.image}
              source={{ uri: this.state.sb_logo }}
              resizeMode="contain"
              resizeMethod="resize"
            />
            <Text style={styles.welcomeText}>
              {" "}
              Welcome {this.state.sb_emp_name}
            </Text>
          </View>

          <View style={styles.container1}>
            <View style={styles.lineStyle} />

            <MenuButton
              style={styles.smText}
              title="Dashboard"
              source={require("../../assets/images/sm_menu.png")}
              onPress={() => {
                navigation.navigate("DBHome");
                navigation.closeDrawer();
              }}
            />
            <MenuButton
              title="Nominate Award"
              source={require("../../assets/images/sm_medal.png")}
              onPress={() => {
                this.navigateToMenu(
                  "MOBILE_NOMINATE_AWARD",
                  "NominateAward",
                  navigation
                );
              }}
            />
            <MenuButton
              title="Redeem Award"
              source={require("../../assets/images/sm_shopping-cart.png")}
              onPress={() => {
                this.navigateToMenu(
                  "MOBILE_AWARD_CATALOG",
                  "RedemptionHome",
                  navigation
                );
              }}
            />

            <MenuButton
              title="Approve Award"
              source={require("../../assets/images/sm_flag.png")}
              onPress={() => {
                this.navigateToMenu(
                  "MOBILE_APPROVE_AWARD",
                  "ApprovalHome",
                  navigation
                );
              }}
            />

            <MenuButton
              title="My Recognition"
              source={require("../../assets/images/sm_diploma.png")}
              onPress={() => {
                this.navigateToMenu(
                  "MOBILE_MY_RECOGNITION",
                  "RecognitionHome",
                  navigation
                );
              }}
            />

            <MenuButton
              title="Award Wall"
              source={require("../../assets/images/sm_banner.png")}
              onPress={() => {
                this.navigateToMenu(
                  "MOBILE_AWARD_WALL",
                  "AwardWallHome",
                  navigation
                );
              }}
            />

            <View style={styles.lineStyle} />

            <MenuButton
              title="Log Out"
              source={require("../../assets/images/logout-icon.png")}
              onPress={() => {
                this.logOut();
              }}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Image
            style={styles.trophy}
            source={require("../../assets/images/footer-logo.png")}
            resizeMode="contain"
            resizeMethod="resize"
          />

          <View style={styles.bottom}>
            <Text>
              {Platform.OS === "ios"
                ? Konstants.K_IOS_APP_VERSION
                : Konstants.K_ANDROID_APP_VERSION}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

DrawerContainer.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),
};
