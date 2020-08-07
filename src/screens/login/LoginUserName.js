import React, { Fragment } from "react";
import { Input, Button } from "react-native-elements";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Alert,
} from "react-native";

import DeviceInfo from "react-native-device-info";

import Loader from "../../components/util/Loader";
import * as Konstants from "../../constants/constants";

const LoginButton = ({ onPress, title, customStyles }) => {
  const defaultStyles = {
    height: 50,
    borderRadius: 6,
    marginTop: 100,
  };
  return (
    <Button
      title={title}
      onPress={onPress}
      buttonStyle={[defaultStyles, customStyles]}
    />
  );
};

export default class LoginUserScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      userName: Konstants.env == "local" ? "dinesh.ganta@quadmo.com" : "",
      pageLoading: false,
    };
  }
  updateUserName = (text) => {
    this.setState({ userName: text });
  };

  saveUserName = () => {
    if (this.state.userName.trim() != "") {
      this.setState({ pageLoading: true });
      this._apiCheckUser();
    } else {
      Alert.alert("Alert", Konstants.MSG_EMAIL_EMPTY);
    }
  };

  _apiCheckUser = () => {
    var API_URL = Konstants.API_ROOT_URL + "/Login/Request_OTP";

    this.setState({ pageLoading: true });

    var deviceId = DeviceInfo.getUniqueId().toString();
    var mobile = this.state.userName;
    var subQry = "";
    if (isNaN(this.state.userName)) {
      subQry = "userName=" + this.state.userName.trim() + "&mobileNumber=";
    } else {
      subQry = "mobileNumber=" + this.state.userName.trim() + "&userName=";
    }

    var url = API_URL + "?" + subQry + "&deviceId=" + deviceId;

    // console.log(url);

    fetch(url, {})
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        this.setState({ pageLoading: false });

        if (Array.isArray(json)) {
          //save token from response
          var resObj = json[0];

          //save org id
          var orgID = resObj.objOtpData[0].OrganizationId;

          // console.log("orgID: " + orgID);

          if (isNaN(this.state.userName)) {
            this.props.navigation.navigate("LoginPassword", {
              paramUserName: this.state.userName,
              paramType: "email",
              paramOrgId: orgID,
            });
          } else {
            this.props.navigation.navigate("LoginOtp", {
              paramUserName: this.state.userName,
              paramType: "mobile",
              paramOrgId: orgID,
            });
          }
        } else {
          if (isNaN(this.state.userName)) {
            setTimeout(() => {
              Alert.alert("Alert", Konstants.MSG_EMAIL_INVALID);
            }, 100);
          } else {
            setTimeout(() => {
              Alert.alert("Alert", Konstants.MSG_MOBILE_INVALID);
            }, 100);
          }
        }
      })
      .catch((error) => {
        this.setState({ pageLoading: false });
        if (isNaN(this.state.userName)) {
          setTimeout(() => {
            Alert.alert("Alert", Konstants.MSG_EMAIL_INVALID);
          }, 100);
        } else {
          setTimeout(() => {
            Alert.alert("Alert", Konstants.MSG_MOBILE_INVALID);
          }, 100);
        }
      })
      .done();
  };

  render() {
    console.disableYellowBox = true;

    if (this.state.pageLoading) {
      return (
        <View>
          <Loader loading={this.state.pageLoading} />
        </View>
      );
    }

    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          {/*
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
             */}

          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.welcomeMsg}>Welcome back!</Text>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.regemailHead}>
                {" "}
                Registered e-mail id or mobile number
              </Text>
              <View style={styles.inputStyle}>
                <Input
                  placeholder="Enter here"
                  autoFocus={true}
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  returnKeyType="done"
                  keyboardType="email-address"
                  underlineColorAndroid="transparent"
                  autoCapitalize="none"
                  onChangeText={this.updateUserName}
                  value={this.state.userName}
                />
              </View>
            </View>

            <View style={styles.buttonView}>
              <LoginButton
                title="PROCEED"
                customStyles={{ backgroundColor: "#19537e" }}
                onPress={() => this.saveUserName()}
              />
            </View>
          </View>
          {/* </ScrollView>*/}
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#fff",
  },
  engine: {
    position: "absolute",
    right: 0,
  },
  body: {
    backgroundColor: "#fff",
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#111",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
    color: "#000",
  },
  highlight: {
    fontWeight: "700",
  },
  footer: {
    color: "#000",
    fontSize: 12,
    fontWeight: "600",
    padding: 4,
    paddingRight: 12,
    textAlign: "right",
  },
  login: {
    width: 185,
    height: 18,
    fontFamily: "HelveticaNeue",
    fontSize: 19,
    fontWeight: "300",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0,
    color: "#3e4a59",
  },

  welcomeMsg: {
    height: 50,
    fontFamily: "HelveticaNeue",
    fontSize: 28,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 25,
    letterSpacing: 3,
    color: "#3e4a59",
    marginTop: 10,
  },
  regemailHead: {
    opacity: 0.8,
    fontFamily: "HelveticaNeue",
    fontSize: 16,
    fontWeight: "300",
    fontStyle: "normal",
    letterSpacing: 0.5,
    color: "#3e4a59",
  },
  inputStyle: {
    marginTop: 20,
  },
  buttonView: {
    marginTop: 10,
    paddingHorizontal: 24,
  },
});
