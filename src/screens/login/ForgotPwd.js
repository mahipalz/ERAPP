import React, { Fragment } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Alert,
} from "react-native";

import { Button, Input } from "react-native-elements";
import Loader from "../../components/util/Loader";
import * as Konstants from "../../constants/constants";
import DeviceInfo from "react-native-device-info";

var API_URL = Konstants.API_ROOT_URL + "/Login/ValidateUser";

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

export default class ForgotPwdScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      pageLoading: false,
    };
  }

  updateEmail = (text) => {
    this.setState({ email: text });
  };

  _submitEmail = () => {
    if (this.state.email.trim() != "") {
      Alert.alert("Success", "Password reset link sent successfully.");
    } else {
      Alert.alert("Alert", "Please enter your Email ID");
    }
  };

  apiAuthUsingEmail(email, password) {
    this.setState({ pageLoading: true });

    var devicePushId = "";
    var deviceOS = "";
    var deviceId = DeviceInfo.getUniqueId().toString();

    var url =
      API_URL +
      "?token=" +
      email +
      "&otp=" +
      password +
      "&deviceId=" +
      deviceId +
      "&devicePushId=" +
      devicePushId +
      "&deviceOS=" +
      deviceOS;

    fetch(url, {})
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        //debugger;
        this.setState({ pageLoading: false });

        if (json.length) {
          //save token from response
          var empObj = json[0];

          setTimeout(() => {
            Alert.alert("hi " + empObj.EmployeeName);
          }, 100);
        } else {
          this.setState({ passwd: "" });
          setTimeout(() => {
            Alert.alert("Authentication Fail", "Invalid login credentials.");
          }, 100);
        }
      })
      .catch((error) => {
        this.setState({ pageLoading: false });
        this.setState({ passwd: "" });
        setTimeout(() => {
          Alert.alert("Authentication Fail", "Invalid login credentials.");
        }, 100);
      })
      .done();
  }

  render() {
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
                <Text style={styles.resetPwdHead}>Reset Password</Text>
              </View>

              <View style={styles.centerView}>
                <Text style={styles.resetPwdText}>
                  No Problem! Just give in your Email ID and we will send you a
                  link to reset your password
                </Text>
              </View>

              <View style={styles.sectionContainer}>
                <View style={styles.inputStyle}>
                  <Input
                    placeholder="Enter Email ID"
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    onChangeText={this.updateEmail}
                  />
                </View>
              </View>

              <View style={styles.sectionContainer}>
                <LoginButton
                  title="Send Link"
                  customStyles={{ backgroundColor: "#19537e" }}
                  onPress={this._submitEmail}
                />
              </View>
              <View style={styles.tcView}>
                <Text style={styles.login}>Terms & Conditions </Text>
                <Text style={styles.bottomBar} />
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
    marginTop: 35,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#222",
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

  tcView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginTop: 200,
  },
  termsConditions: {
    width: 106,
    height: 14,
    opacity: 5,
    fontFamily: "Helvetica",
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 0,
  },

  bottomBar: {
    width: 134,
    height: 5,
    borderRadius: 100,
    backgroundColor: "#3e4a5972",
    marginTop: 30,
  },
  resetPwdHead: {
    height: 150,
    fontFamily: "Helvetica",
    fontSize: 20,
    fontWeight: "300",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    color: "#3e4a59",
    marginTop: 30,
  },

  resetPwdText: {
    letterSpacing: 0,
    color: "#404040",
    fontStyle: "normal",
    fontFamily: "Helvetica",
    fontSize: 16,
    paddingHorizontal: 30,
  },

  centerView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginTop: -70,
  },
});
