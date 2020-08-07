import React, { Component } from "react";
import { ActivityIndicator, StatusBar, StyleSheet, View } from "react-native";

import AsyncStorage from "@react-native-community/async-storage";
import SplashScreen from "react-native-splash-screen";

import * as Konstants from "../constants/constants";

export default class LoadingScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this._checkUserSession();
    SplashScreen.hide();
  }

  _checkUserSession = async () => {
    const response = await fetch(Konstants.API_CONNECT_URL);
    const isLoogedIn = await AsyncStorage.getItem("AS_LOGGED_IN");
    this.props.navigation.navigate(isLoogedIn == "yes" ? "DBApp" : "Auth");

    // var request = new XMLHttpRequest();
    // request.onreadystatechange = (e) => {
    //   if (request.readyState !== 4) {
    //     return;
    //   }

    //   if (request.status === 200) {

    //     console.log('success', request.responseText);

    //     AsyncStorage.setItem("AS_MSG", JSON.stringify(request.responseText));

    //     AsyncStorage.getItem("AS_LOGGED_IN").then((value) => {
    //       this.props.navigation.navigate(value=="yes" ? 'DBApp' : 'Auth');
    //     }).done();

    //      // const isLoogedIn = await AsyncStorage.getItem("AS_LOGGED_IN");

    //   } else {
    //     console.warn('error');
    //   }
    // };

    // request.open('GET', Konstants.API_CONNECT_URL);
    // request.send();
  };

  render() {
    console.disableYellowBox = true;
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3e4a59" />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
