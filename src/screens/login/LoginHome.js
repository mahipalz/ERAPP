import React, { Fragment } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";

import AsyncStorage from "@react-native-community/async-storage";

import { Button } from "react-native-elements";

import { SliderBox } from "react-native-image-slider-box";

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

export default class LoginHomeScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      width: 200,
      images: [
        require("../../assets/images/signintrophy.png"),
        require("../../assets/images/signinmedal.png"),
        require("../../assets/images/trophy.png"),
      ],
    };
   
  }

  openTerms() {
    Linking.openURL(Konstants.TERMS_URL).catch((err) =>
      console.error("An error occurred opening pdf", err)
    );
  }

  render() {
    console.disableYellowBox = true;

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
                <Text style={styles.login}>Log in to your account</Text>
              </View>

              <View style={styles.imageView}>
                <Image
                  style={styles.image}
                  source={require("../../assets/images/easyrnrlogo.png")}
                  resizeMode="contain"
                  resizeMethod="resize"
                />
              </View>
              <View style={styles.centerView}>
                <SliderBox
                  images={this.state.images}
                  sliderBoxHeight={220}
                  dotColor="#999"
                  inactiveDotColor="#F2F2F2"
                  paginationBoxVerticalPadding={10}
                  autoplay
                  circleLoop
                  parentWidth={this.state.width}
                  resizeMethod={"resize"}
                  resizeMode={"center"}
                />
              </View>
              <View style={[styles.sectionContainer, styles.minusMargin]}>
                <LoginButton
                  title="LOGIN"
                  customStyles={{ backgroundColor: "#19537e" }}
                  onPress={() =>
                    this.props.navigation.navigate("LoginUserName")
                  }
                />
              </View>
              <TouchableOpacity onPress={() => this.openTerms()}>
                <View style={styles.tcView}>
                  <Text style={styles.login}>Terms & Conditions </Text>
                  <Text style={styles.bottomBar} />
                </View>
              </TouchableOpacity>
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
  login: {
    fontFamily: "HelveticaNeue",
    fontSize: 19,
    fontWeight: "300",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#3e4a59",
  },
  imageView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginTop: 120,
  },
  image: {
    width: 300,
    height: 51,
  },
  trophy: {
    width: 80,
    height: 120,
    marginTop: 100,
  },

  tcView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginTop: 50,
  },
  termsConditions: {
    opacity: 5,
    fontFamily: "Helvetica",
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
  },

  bottomBar: {
    width: 134,
    height: 3,
    borderRadius: 100,
    backgroundColor: "#3e4a5972",
    marginTop: 20,
  },

  centerView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  minusMargin: {
    marginTop: -50,
  },
});
