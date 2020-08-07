import React, { Fragment } from "react";

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Alert,
  Platform,
  TouchableOpacity,
  Keyboard,
} from "react-native";

import AsyncStorage from "@react-native-community/async-storage";

import { Button, Input } from "react-native-elements";
import Loader from "../../components/util/Loader";
import * as Konstants from "../../constants/constants";
import CountDown from "react-native-countdown-component";
import DeviceInfo from "react-native-device-info";

var API_URL = Konstants.API_ROOT_URL + "/Login/ValidateMobileUser";

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

export default class LoginOtpScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      otp: "",
      pageLoading: false,
      isOtpExpired: false,
    };

    this.state.userName = this.props.navigation.state.params.paramUserName;
  }

  updateOtp = (text) => {
    this.setState({ otp: text });
    if (text.length == 6) {
      Keyboard.dismiss();
    }
  };

  _submitOtp = () => {
    if (this.state.otp.trim() == "") {
      Alert.alert("Alert", Konstants.MSG_OTP_EMPTY);
    } else if (this.state.isOtpExpired) {
      Alert.alert("Alert", Konstants.MSG_OTP_EXPIRED);
    } else {
      this.apiAuthUsingMobile();
    }
  };

  apiAuthUsingMobile() {
    this.setState({ pageLoading: true });

    var deviceOS = Platform.OS.toString();
    var deviceId = DeviceInfo.getUniqueId().toString();
    var orgId = this.props.navigation.state.params.paramOrgId;

    var qry_str =
      "?mobileNumber=" +
      this.state.userName +
      "&otpPassword=" +
      this.state.otp +
      "&deviceId=" +
      deviceId +
      "&organizationId=" +
      orgId +
      "&deviceOS=" +
      deviceOS +
      "&userName=&userPin=&employeeId=&devicePushId=";

    var url = API_URL + qry_str;

    // console.log(url);

    fetch(url, {})
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        //debugger;
        this.setState({ pageLoading: false });

        // console.log(JSON.stringify(json));

        if (json.length) {
          let empObj = json[0];

          if (empObj.LogginedData == null) {
            this.setState({ passwd: "" });
            setTimeout(() => {
              Alert.alert("Alert", Konstants.MSG_OTP_INVALID);
            }, 100);
          } else {
            //save token from response

            AsyncStorage.setItem("AS_EMP", JSON.stringify(empObj));

            AsyncStorage.setItem("AS_TOKEN", empObj.LogginedData.toString());

            AsyncStorage.setItem("AS_LOGGED_IN", "yes");

            this.props.navigation.navigate("DBApp");
          }
        } else {
          this.setState({ passwd: "" });
          setTimeout(() => {
            Alert.alert("Alert", Konstants.MSG_OTP_INVALID);
          }, 100);
        }
      })
      .catch((error) => {
        this.setState({ pageLoading: false });
        this.setState({ passwd: "" });
        setTimeout(() => {
          Alert.alert("Alert", Konstants.MSG_OTP_INVALID);
        }, 100);
      })
      .done();
  }

  timerFinished() {
    this.setState({ isOtpExpired: true });
  }

  resendOTP = () => {
    var API_URL = Konstants.API_ROOT_URL + "/Login/Request_OTP";

    this.setState({ pageLoading: true });

    var deviceId = DeviceInfo.getUniqueId().toString();
    var query =
      "mobileNumber=" +
      this.state.userName.trim() +
      "&userName=&deviceId=" +
      deviceId;

    var url = API_URL + "?" + query;

    // console.log(url);

    fetch(url, {})
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        this.setState({ pageLoading: false });

        // console.log(JSON.stringify(json));

        if (Array.isArray(json)) {
          this.setState({ isOtpExpired: false });
          setTimeout(() => {
            Alert.alert("Alert", Konstants.MSG_OTP_RESEND);
          }, 100);
        } else {
          Alert.alert("A server error occured. Please try again.");
        }
      })
      .catch((error) => {
        this.setState({ pageLoading: false });
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
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}
          >
            {/*  <Header /> */}

            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                <Text style={styles.welcomeMsg}>Welcome User,</Text>
              </View>

              <View style={styles.centerView}>
                <Text style={styles.otpMsg}>We just sent to you a code.</Text>
                <Text style={styles.otpMsg}>Usually arrives fast…</Text>
              </View>

              <View style={styles.sectionContainer}>
                <View style={styles.centerView}>
                  <Text style={[styles.otpMsg, styles.grayClr]}>
                    It ends in 04:00 minutes
                  </Text>

                  {!this.state.isOtpExpired && (
                    <CountDown
                      until={240}
                      onFinish={() => this.timerFinished()}
                      size={18}
                      digitStyle={{
                        backgroundColor: "#fff",
                        borderWidth: 1,
                        borderColor: "#dbdbdb",
                      }}
                      digitTxtStyle={{ color: "#19537e", fontWeight: "normal" }}
                      timeToShow={["M", "S"]}
                      timeLabels={{ m: null, s: null }}
                      showSeparator={true}
                      separatorStyle={{ padding: 8 }}
                    />
                  )}

                  {this.state.isOtpExpired && (
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        width: 200,
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 20,
                      }}
                      onPress={() => this.resendOTP()}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          color: "#19537e",
                          textDecorationLine: "underline",
                          fontSize: 18,
                          fontFamily: "HelveticaNeue",
                        }}
                      >
                        Resend OTP
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.inputStyle}>
                  <Input
                    inputStyle={{ fontSize: 20, fontWeight: "500" }}
                    keyboardType="number-pad"
                    placeholder="Insert the 6-digit code"
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    onChangeText={this.updateOtp}
                    maxLength={6}
                  />
                </View>
              </View>

              <View style={styles.topContainer}>
                <View style={styles.buttonContainer}>
                  <LoginButton
                    title="BACK"
                    customStyles={{ backgroundColor: "#b1b1b1" }}
                    onPress={() =>
                      this.props.navigation.navigate("LoginUserName")
                    }
                  />
                </View>
                <View style={styles.buttonContainer}>
                  <LoginButton
                    title="NEXT"
                    customStyles={{ backgroundColor: "#19537e" }}
                    onPress={this._submitOtp}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
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

  highlight: {
    fontWeight: "700",
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
    fontSize: 20,
    fontWeight: "300",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0,
    color: "#3e4a59",
    marginTop: 10,
  },

  inputStyle: {
    marginTop: 30,
  },
  buttonView: {
    marginTop: 10,
    paddingHorizontal: 24,
  },

  otpMsg: {
    height: 40,
    fontFamily: "HelveticaNeue",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0,
    color: "#3e4a59",
    marginTop: 0,
    marginBottom: 5,
  },
  centerView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  grayClr: {
    color: "#b1b1b1",
    paddingBottom: 25,
  },

  topContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 200,
  },
  buttonContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
});
