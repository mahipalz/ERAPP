import React, { Fragment } from "react";
import { Input } from "react-native-elements";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Alert,
  TouchableOpacity,
} from "react-native";

import AsyncStorage from "@react-native-community/async-storage";
import { Button } from "react-native-elements";
import Loader from "../../components/util/Loader";
import * as Konstants from "../../constants/constants";
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

export default class LoginPasswordScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      passwd: Konstants.env == "local" ? "Employee@123" : "",
      pageLoading: false,
    };

    this.state.userName = this.props.navigation.state.params.paramUserName;
  }

  updatePasswd = (text) => {
    this.setState({ passwd: text });
  };

  _submitLogin = () => {
    if (this.state.passwd.trim() != "") {
      this.apiAuthUsingEmail(this.state.userName, this.state.passwd);
    } else {
      Alert.alert("Alert", Konstants.MSG_PWD_EMPTY);
    }
  };

  apiAuthUsingEmail(email, password) {
    this.setState({ pageLoading: true });

    var employeeId = "";
    var organizationId = this.props.navigation.state.params.paramOrgId;
    var deviceId = DeviceInfo.getUniqueId().toString();
    password = encodeURIComponent(password.trim());

    var url =
      API_URL +
      "?userName=" +
      email.trim() +
      "&otpPassword=" +
      password +
      "&deviceId=" +
      deviceId +
      "&employeeId=" +
      employeeId +
      "&organizationId=" +
      organizationId;

     console.log(url);

    fetch(url, {})
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        //debugger;
        this.setState({ pageLoading: false });

        if (json.length) {
          //save token from response
          let empObj = json[0];
          // debugger
          AsyncStorage.setItem("AS_EMP", JSON.stringify(empObj));

          AsyncStorage.setItem("AS_TOKEN", empObj.LogginedData.toString());

          AsyncStorage.setItem("AS_LOGGED_IN", "yes");

          this.props.navigation.navigate("DBApp");
        } else {
          this.setState({ passwd: "" });
          setTimeout(() => {
            Alert.alert("Alert", Konstants.MSG_INVALID_USER);
          }, 100);
        }
      })
      .catch((error) => {
        this.setState({ pageLoading: false });
        this.setState({ passwd: "" });
        setTimeout(() => {
          Alert.alert("Alert", Konstants.MSG_INVALID_USER);
        }, 100);
      })
      .done();
  }

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
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.welcomeMsg}>Welcome back!</Text>
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.inputStyle}>
                <Input
                  placeholder="Enter password"
                  clearButtonMode="while-editing"
                  underlineColorAndroid="transparent"
                  autoCapitalize="none"
                  onChangeText={this.updatePasswd}
                  secureTextEntry={true}
                  value={this.state.passwd}
                  autoFocus={true}
                  autoCorrect={false}
                  returnKeyType="done"
                />
              </View>
              <View>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("LoginUserName")
                  }
                >
                  <Text style={styles.backtologin}>Back to Login</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.buttonView}>
              <LoginButton
                title="SIGN IN"
                customStyles={{ backgroundColor: "#19537e" }}
                onPress={this._submitLogin}
              />
            </View>
          </View>
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
    height: 16,
    opacity: 0.7,
    fontFamily: "HelveticaNeue",
    fontSize: 14,
    fontWeight: "300",
    fontStyle: "normal",
    lineHeight: 16,
    letterSpacing: 0,
    color: "#3e4a59",
  },
  inputStyle: {
    marginTop: 20,
  },
  buttonView: {
    marginTop: 10,
    paddingHorizontal: 24,
  },

  fpwlink: {
    height: 18,
    fontFamily: "HelveticaNeue",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: "right",
    color: "#19537e",
    marginTop: 20,
  },

  backtologin: {
    height: 25,
    fontFamily: "HelveticaNeue",
    fontSize: 15,
    textDecorationLine: "underline",
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: "right",
    color: "#19537e",
    marginTop: 20,
    marginRight: 5,
  },
});
