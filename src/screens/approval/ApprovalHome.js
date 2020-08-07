import React, { Fragment } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
  Text,
  Alert,
} from "react-native";

import { Button } from "react-native-elements";

import AsyncStorage from "@react-native-community/async-storage";
import { NavigationEvents } from "react-navigation";
import NominationCard from "../../components/NominationCard/NominationCard";
import MenuImage from "../../components/MenuImage/MenuImage";
import MenuImageRight from "../../components/MenuImage/MenuImageRight";
import * as Konstants from "../../constants/constants";

var _this;
var _token = "";

export default class ApprovalHome extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "APPROVE AWARD",
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
      pageLoading: false,
      showCard: false,
      resetSearchKey: false,
      nominationsList: [],
      empId: "",
      awardId: "",
    };

    _this = this;
  }

  onViewWillFocus() {
    AsyncStorage.getItem("AS_TOKEN")
      .then((value) => {
        // console.log("TOKEN: " + value.toString());
        _token = value.toString();
        _this.apiNominationList();
      })
      .done();
  }

  apiNominationList = () => {
    this.setState({ pageLoading: true });

    var query = "?" + "token=" + _token;

    var url = Konstants.API_ROOT_URL + "/Nomination/ApproveAward" + query;

    // console.log(url);

    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ pageLoading: false });
        // debugger
        if (responseJson == "Invalid Token") {
          Alert.alert(
            "Alert",
            Konstants.MSG_SESSION_OUT,
            [{ text: "OK", onPress: () => _this.logOutUser() }],
            { cancelable: false }
          );
        } else {
          if (responseJson.length && responseJson[0].AwardNominationId != null) {
            this.setState({
              nominationsList: responseJson,
            });
          } else {
            this.setState({
              nominationsList: [],
            });
          }
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

  _chooseNomination = (obj) => {
    this.props.navigation.navigate("ApprovalDetails", {
      paramNominationInfo: obj,
      paramToken: _token,
    });
  };

  render() {
    console.disableYellowBox = true;

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

        <ScrollView style={{ marginBottom: 20 }}>
          {this.state.nominationsList.length == 0 && (
            <View
              style={{
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
                {Konstants.MSG_NO_PENDING_APPROVAL}
              </Text>
            </View>
          )}

          <View>
            {this.state.nominationsList.map((u, i) => {
              return (
                <View key={i} style={styles.listStyle}>
                  <NominationCard
                    image={{ uri: u.AwardIcon }}
                    title={u.AwardName}
                    recipient={u.RecipientName}
                    nominator={u.NominatorName}
                    nm_date={u.NominationDate}
                    isClose={true}
                    onPress={() => {
                      this._chooseNomination(u);
                    }}
                  />
                </View>
              );
            })}
          </View>
        </ScrollView>
        {this.state.nominationsList.length == 0 && (
            <Button
              title="Back"
              onPress={() => {
                this.props.navigation.navigate("DBHome");
              }}
              buttonStyle={{
                height: 50,
                borderRadius: 6,
                marginTop: 70,
                marginBottom: 50,
                paddingHorizontal: 25,
                width: "60%",
                alignSelf: "center",
                backgroundColor: "#222",
                opacity: 0.8,
              }}
            />
          )} 
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
    marginTop: 20,
  },
});
