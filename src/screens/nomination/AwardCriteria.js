import React, { Fragment } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
  Platform,
  Text,
} from "react-native";

import AsyncStorage from "@react-native-community/async-storage";

import { NavigationEvents } from "react-navigation";
import { Card, ListItem, Button } from "react-native-elements";
import MenuBack from "../../components/MenuImage/MenuBack";
import MenuImageRight from "../../components/MenuImage/MenuImageRight";
import * as Konstants from "../../constants/constants";

var _this;
var _token = "";
var _empId = "";

export default class AwardCriteria extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "NOMINATE AWARD",
    headerLeft: (
      <MenuBack
        onPress={() => {
          navigation.navigate("ChooseAward");
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
      crList: [],
      awardId: "",
      crId: [],
      citationObj: {},
      isMultipleCriteria: false,
      multipleCriteriaLimit: 1,
    };
    _this = this;
  }

  componentDidMount() {
    AsyncStorage.getItem("AS_TOKEN")
      .then((value) => {
        _token = value.toString();
      })
      .done();

    AsyncStorage.getItem("AS_SELECTED_EMP_NUMS")
      .then((value) => {
        if (value != null) {
          var arr = JSON.parse(value);
          _empId = arr.toString();
        }
      })
      .done();

    AsyncStorage.getItem("AS_SELECTED_AWARD_ID")
      .then((value) => {
        _this.state.awardId = value;
        _this.apiAwardCriteria(value);
      })
      .done();

    AsyncStorage.getItem("AS_SELECTED_CR_ID")
      .then((value) => {
        console.log("AS_SELECTED_CR_ID: " + value);
        if (value != null) {
         // this.setState({ crId: JSON.parse(value) });
        }
      })
      .done();
  }

  apiAwardCriteria = (id) => {
    this.setState({ pageLoading: true });

    var recipientList = _empId;

    var query =
      "?" +
      "token=" +
      _token +
      "&" +
      "sRecipientsvalue=" +
      recipientList +
      "&" +
      "AwardID=" +
      id;

    var url = Konstants.API_ROOT_URL + "/Nomination/GetRewardPoints" + query;

    console.log(url);

    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ pageLoading: false });
        let tmObj = {
          IsCitationTextFlag: responseJson[0].IsCitationTextFlag,
          CitationSize: responseJson[0].CitationSize,
        };
        this.setState({
          crList: responseJson[0].Criteria,
          citationObj: tmObj,
          isMultipleCriteria: responseJson[0].IsMultipleCriteria,
          multipleCriteriaLimit: responseJson[0].MultipleCriteriaLimit,
        });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ pageLoading: false });
      });
  };

  _chooseCriteria = (cid) => {
    if (this.state.isMultipleCriteria) {
      var crIdArr = [];
      AsyncStorage.getItem("AS_SELECTED_CR_ID")
        .then((value) => {
          if (value != null) {
            crIdArr = JSON.parse(value);
            if (crIdArr.includes(cid)) {
              crIdArr = crIdArr.filter(function(item) {
                return item !== cid;
              });
            } else {
              crIdArr.push(cid);
            }
          } else {
            crIdArr.push(cid);
          }
          if (crIdArr.length <= this.state.multipleCriteriaLimit) {
            this.setState({ crId: crIdArr });
            AsyncStorage.setItem("AS_SELECTED_CR_ID", JSON.stringify(crIdArr));
          }
        })
        .done();
    } else {
      var crIdArr = [];
      crIdArr.push(cid);
      this.setState({ crId: crIdArr });
      AsyncStorage.setItem("AS_SELECTED_CR_ID", JSON.stringify(crIdArr));
    }
  };

  _gotoCitation = () => {
    if (this.state.crId.length) {
      this.props.navigation.navigate("CitationScreen", {
        data: this.state.citationObj,
      });
    }
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

        <ScrollView>
          {this.state.crList.length == 0 && (
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
                No Award Criteria available for the chosen award
              </Text>
            </View>
          )}

          {this.state.crList.map((u, i) => {
            const conStyle = this.state.crId.includes(u.RewardCriteriaID)
              ? styles.cardContainerHL
              : styles.cardContainer;

            return (
              <View key={i} style={styles.listStyle}>
                <Card containerStyle={conStyle}>
                  <ListItem
                    title={u.CriteriaTitle}
                    titleStyle={styles.itemTitleStyle}
                    containerStyle={styles.listContainer}
                    onPress={() => {
                      this._chooseCriteria(u.RewardCriteriaID);
                    }}
                  />
                </Card>
              </View>
            );
          })}

          <View style={{ height: 50 }} />
        </ScrollView>

        <View style={{ marginBottom: Platform.OS === "ios" ? 50 : 15 }}>
          {this.state.crList.length > 0 && (
            <View>
              {this.state.crId.length > 0 ? (
                <Button
                  title="Proceed"
                  onPress={() => {
                    this._gotoCitation();
                  }}
                  buttonStyle={{
                    height: 50,
                    borderRadius: 6,
                    marginTop: Platform.OS === "ios" ? 25 : 10,
                    paddingHorizontal: 25,
                    width: "80%",
                    alignSelf: "center",
                    backgroundColor: "#19537e",
                  }}
                />
              ) : (
                <Button
                  title="Proceed"
                  onPress={() => {
                    this._gotoCitation();
                  }}
                  buttonStyle={{
                    height: 50,
                    borderRadius: 6,
                    marginTop: Platform.OS === "ios" ? 25 : 10,
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

          {this.state.crList.length == 0 && (
            <Button
              title="Back"
              onPress={() => {
                this.props.navigation.navigate("ChooseAward");
              }}
              buttonStyle={{
                height: 50,
                borderRadius: 6,
                marginTop: 70,
                paddingHorizontal: 25,
                width: "60%",
                alignSelf: "center",
                backgroundColor: "#222",
                opacity: 0.8,
              }}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    padding: 1,
    borderRadius: 9,
    borderWidth: 0,
    marginBottom: -15,
    backgroundColor: "#f2f2f2",
  },

  cardContainerHL: {
    padding: 1,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#FFA07A",
    marginBottom: -15,
    backgroundColor: "#f2f2f2",
  },
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
  engine: {
    position: "absolute",
    right: 0,
  },
  body: {
    backgroundColor: "#fff",
    flex: 1,
  },

  listStyle: {
    marginTop: 20,
  },

  listContainer: {
    padding: 15,
    backgroundColor: "#f2f2f2",
    borderRadius: 9,
    elevation: 2,
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowRadius: 25,
    shadowOpacity: 1,
  },

  itemTitleStyle: {
    color: "#000",
    alignSelf: "center",
    fontWeight: "600",
    padding: 5,
  },
});
