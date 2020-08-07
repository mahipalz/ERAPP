import React, { Fragment } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  Platform,
  Keyboard,
  Alert,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";

import { Input, Overlay } from "react-native-elements";

import AsyncStorage from "@react-native-community/async-storage";

import { NavigationEvents } from "react-navigation";
import { Button } from "react-native-elements";
import { ListItem } from "native-base";
import CustomCard from "../../components/Card/CustomCard";
import MenuImage from "../../components/MenuImage/MenuImage";
import MenuImageRight from "../../components/MenuImage/MenuImageRight";
import Autocomplete from "native-base-autocomplete";
import * as Konstants from "../../constants/constants";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

var _this;
var _token = "";

export default class NominateAwardScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "NOMINATE AWARD",
    headerLeft: (
      <MenuImage
        onPress={() => {
          navigation.openDrawer();
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
      serverData: [],
      empName: "",
      empDesc: "",
      empPhoto: "",
      empId: "",
      query: "",
      hideres: false,
      cardList: [],
      empNumList: [],
      empNamesList: [],
      overlayVisible: false,
      teamName: "",
      showResDropdown: true,
      alertOverlayVisible: false,
    };
    _this = this;
  }
  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow() {
    //
  }

  _keyboardDidHide() {
    // if(_this.state.showResDropdown) {
    // _this.setState({showCard:true})
    // }
  }

  onViewWillFocus() {
    AsyncStorage.getItem("AS_TOKEN")
      .then((value) => {
        _token = value.toString();
      })
      .done();

    var from_pg = _this.props.navigation.state.params.paramFrom;
    //debugger
    if (from_pg == "chooseaward") {
      AsyncStorage.getItem("AS_SELECTED_EMP_LIST")
        .then((value) => {
          var emplist = JSON.parse(value);
          _this.setState({ showCard: true, cardList: emplist });
        })
        .done();
    }
  }

  async searchRecipient() {
    this.setState({ showCard: false, showResDropdown: false });
    let employees_list = await this.findEmployee(this.state.query);
    this.setState({
      serverData: employees_list,
      hideres: false,
    });
  }

  searchTextChanged(text) {
    this.setState({ query: text });
  }

  findEmployee(searchTerm) {
    if (searchTerm === "" || searchTerm.length < 3) {
      var arr = this.state.cardList;
      if (arr.length > 0) {
        this.setState({ showCard: true });
      }
      return [];
    }

    this.setState({ pageLoading: true });

    var queryString = "?" + "token=" + _token + "&" + "term=" + searchTerm;
    var url =
      Konstants.API_ROOT_URL +
      "/Nomination/GetAutosuggestByEmployeeName" +
      queryString;
    // console.log(url);

    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ pageLoading: false });
        //debugger
        if (responseJson[0].label.length == 0) {
          let k = [{ label: "No results found", value: "none" }];

          this.setState({
            serverData: k,
            showCard: false,
            showResDropdown: true,
          });
        } else {
          this.setState(
            {
              serverData: responseJson,
              showCard: false,
              showResDropdown: true,
            },
            () => {
              Keyboard.dismiss();
            }
          );
        }
      })
      .catch((error) => {
        // console.log(error);
        //debugger
        console.error(error);
      });

    const { serverData } = this.state;
    return serverData;
  }

  _itemSelected(obj) {
    Keyboard.dismiss();
    if (obj.value == "none") {
      this.setState({ showCard: true, query: "" });
      return false;
    }

    this.setState({ serverData: [], query: "" });
    this.setState({
      empName: obj.label,
      empId: obj.value,
      empPhoto: obj.EmployeePhotoPath,
    });
    this.setState({ showCard: true });
    var tmpArrEN = [...this.state.empNumList];

    if (tmpArrEN.indexOf(obj.value) == -1) {
      //save employee numbers
      tmpArrEN.push(obj.value);
      this.setState({ empNumList: tmpArrEN });
      AsyncStorage.setItem("AS_SELECTED_EMP_NUMS", JSON.stringify(tmpArrEN));

      //save employee names
      var tmpArrNames = [...this.state.empNamesList];
      tmpArrNames.push(obj.label);
      this.setState({ empNamesList: tmpArrNames });
      AsyncStorage.setItem(
        "AS_SELECTED_EMP_NAMES",
        JSON.stringify(tmpArrNames)
      );

      //save  employee object
      var tmpObj = {
        empName: obj.label,
        empId: obj.value,
        empPhoto: obj.EmployeePhotoPath,
      };
      var tmpArr = [...this.state.cardList];
      tmpArr.push(tmpObj);
      this.setState({ cardList: tmpArr });

      AsyncStorage.setItem("AS_SELECTED_EMP_LIST", JSON.stringify(tmpArr));
    }
  }

  _closeCard = (empObj) => {
    //debugger
    //reconstruct emp nos
    var tmpEmpNumList = [...this.state.empNumList];
    tmpEmpNumList.splice(tmpEmpNumList.indexOf(empObj.empId), 1);
    this.setState({ empNumList: tmpEmpNumList });
    AsyncStorage.setItem("AS_SELECTED_EMP_NUMS", JSON.stringify(tmpEmpNumList));

    //reconstruct names
    var tmpEmpNameList = [...this.state.empNamesList];
    tmpEmpNameList.splice(tmpEmpNameList.indexOf(empObj.empName), 1);
    this.setState({ empNamesList: tmpEmpNameList });
    AsyncStorage.setItem(
      "AS_SELECTED_EMP_NAMES",
      JSON.stringify(tmpEmpNameList)
    );

    //reconstruct card items
    var tmpArr = [...this.state.cardList];
    var arrIdx;
    tmpArr.forEach(function(obj, i) {
      for (var key in obj) {
        if (key == "empId" && obj[key] == empObj.empId) {
          arrIdx = i;
        }
      }
    });

    tmpArr.splice(arrIdx, 1);

    AsyncStorage.setItem("AS_SELECTED_EMP_LIST", JSON.stringify(tmpArr));

    this.setState({ cardList: tmpArr }, () => {
      AsyncStorage.setItem("AS_TEAM_NAME", "");
    });

    //hide card view
    if (tmpArr.length == 0) {
      this.setState({ showCard: false });
    }
  };

  _gotoAwards = () => {
    AsyncStorage.getItem("AS_SELECTED_EMP_LIST")
      .then((value) => {
        if (value != null) {
          var arr = JSON.parse(value);
          if (arr.length > 1) {
            this.setState({ showCard: false, alertOverlayVisible: true });
          } else {
            this.setState({ showCard: false });
            this.props.navigation.navigate("ChooseAward");
          }
        }
      })
      .done();
  };

  updateTeamName = (text) => {
    this.setState({ teamName: text });
  };

  _saveTeamName = () => {
    this.setState({ overlayVisible: false });
    let nm = this.state.teamName.trim();
    if (nm != "") {
      AsyncStorage.setItem("AS_TEAM_NAME", nm);
    } else {
      AsyncStorage.setItem("AS_TEAM_NAME", "");
    }

    this.setState({ showCard: false });
    this.props.navigation.navigate("ChooseAward");
  };

  closeTeamName() {
    this.setState(
      {
        overlayVisible: false,
      },
      () => {
        AsyncStorage.setItem("AS_TEAM_NAME", "").then((val) => {
          this.props.navigation.navigate("ChooseAward");
        });
      }
    );
  }

  render() {
    console.disableYellowBox = true;

    const { query, serverData } = this.state;

    return (
      <View style={styles.body}>
        <NavigationEvents onWillFocus={this.onViewWillFocus} />
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="always"
        >
          <View style={styles.sectionContainer}>
            <Text style={styles.regemailHead}> Select Recipients </Text>
            <View style={styles.inputStyle}>
              <View>
                {this.state.pageLoading && (
                  <View style={{ marginTop: 100, alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#19537e" />
                  </View>
                )}
                <View style={styles.autocompleteContainer}>
                  <View style={{ width: "100%" }}>
                    <Autocomplete
                      listStyle={
                        this.state.showResDropdown == true
                          ? styles.autoResView
                          : styles.autoResViewH
                      }
                      style={styles.acInput}
                      clearButtonMode="while-editing"
                      autoCapitalize="none"
                      onSubmitEditing={() => this.searchRecipient()}
                      returnKeyType="done"
                      autoCorrect={false}
                      data={serverData}
                      defaultValue={query}
                      hideResults={this.state.hideres}
                      onChangeText={(text) => this.searchTextChanged(text)}
                      placeholder="Enter Recipient(s)"
                      renderItem={(emp) => (
                        <ListItem
                          style={styles.ac_list_item}
                          onPress={() =>
                            this.setState(
                              { query: emp.label, hideres: true },
                              () => {
                                this._itemSelected(emp);
                              }
                            )
                          }
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                              width: "100%",
                            
                            }}
                          >
                            <Text style={styles.ac_list_item_text}>
                              {emp.label}
                            </Text>
                            {emp.value == "none" && (
                              <Image
                                style={{ alignSelf: "flex-end" }}
                                source={require("../../assets/images/cancel.png")}
                              />
                            )}
                          </View>
                        </ListItem>
                      )}
                    />
                  </View>
                  <View>
                    <Button
                      disabled={this.state.query.length > 2 ? false : true}
                      title="Search"
                      buttonStyle={styles.searchButton}
                      onPress={() => {
                        this.searchRecipient();
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {this.state.showCard && (
            <View style={styles.listStyle}>
              <FlatList
                style={{ marginBottom: 80 }}
                data={this.state.cardList}
                renderItem={({ item }) => (
                  <CustomCard
                    image={item.empPhoto}
                    title={item.empName}
                    subTitle=""
                    onPress={() => {
                      this._closeCard(item);
                    }}
                  />
                )}
                keyExtractor={(item) => item.empId}
              />
            </View>
          )}
        </ScrollView>

        <View style={styles.btncontainer}>
          <View>
            <Button
              title="Back"
              onPress={() => {
                this.props.navigation.navigate("DBHome");
              }}
              buttonStyle={{
                height: 50,
                borderRadius: 6,
                marginTop: 20,
                paddingHorizontal: 25,
                width: "80%",
                alignSelf: "center",
                backgroundColor: "#444",
              }}
            />
          </View>
          <View>
            {this.state.cardList.length > 0 ? (
              <Button
                title="Proceed"
                onPress={() => {
                  this._gotoAwards();
                }}
                buttonStyle={{
                  height: 50,
                  borderRadius: 6,
                  marginTop: 20,
                  paddingHorizontal: 25,
                  width: "80%",
                  alignSelf: "center",
                  backgroundColor: "#19537e",
                }}
              />
            ) : (
              <Button
                title="Proceed"
                onPress={() => {}}
                buttonStyle={{
                  height: 50,
                  borderRadius: 6,
                  marginTop: 20,
                  paddingHorizontal: 25,
                  width: "80%",
                  alignSelf: "center",
                  backgroundColor: "#ccc",
                }}
              />
            )}
          </View>
        </View>

        <Overlay
          isVisible={this.state.alertOverlayVisible}
          windowBackgroundColor="#555"
          overlayBackgroundColor="#fff"
          width="95%"
          height="auto"
          borderRadius={15}
          overlayStyle={{ maxHeight: "90%" }}
        >
          <View>
            <Text style={styles.alertText}>
              Do you want to proceed with the following recipients?
            </Text>
            <ScrollView
              style={{
                maxHeight: "80%",
                borderColor: "#ccc",
                borderWidth: 0.5,
                padding: 10,
                borderRadius: 10,
              }}
            >
              {this.state.empNamesList.map((item, i) => (
                <ListItem key={i} style={styles.al_list_item}>
                  <Text style={styles.al_list_item_text}>{item} </Text>
                </ListItem>
              ))}
            </ScrollView>
            <View style={styles.ovBtnContainer}>
              <View>
                <Button
                  title="NO"
                  onPress={() => {
                    this.setState({ alertOverlayVisible: false });
                  }}
                  buttonStyle={{
                    height: 50,
                    borderRadius: 6,
                    marginTop: 20,
                    paddingHorizontal: 25,
                    width: "80%",
                    alignSelf: "center",
                    backgroundColor: "#999",
                  }}
                />
              </View>
              <View>
                <Button
                  title="YES"
                  onPress={() => {
                    this.setState({ alertOverlayVisible: false }, () => {
                      this.setState({ overlayVisible: true });
                    });
                  }}
                  buttonStyle={{
                    height: 50,
                    borderRadius: 6,
                    marginTop: 20,
                    paddingHorizontal: 25,
                    width: "80%",
                    alignSelf: "center",
                    backgroundColor: "#19537e",
                  }}
                />
              </View>
            </View>
          </View>
        </Overlay>

        <Overlay
          isVisible={this.state.overlayVisible}
          windowBackgroundColor="#555"
          overlayBackgroundColor="#fff"
          width="95%"
          height="auto"
          borderRadius={15}
        >
          <View>
            <View>
              <TouchableOpacity
                style={{ alignSelf: "flex-end" }}
                onPress={() => this.closeTeamName()}
              >
                <Image source={require("../../assets/images/cross.png")} />
              </TouchableOpacity>
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: 20,
                  marginTop: 10,
                  padding: 2,
                }}
              >
                Team Name:
              </Text>
              <View style={{ marginTop: 20 }}>
                <Input
                  placeholder="Enter team name here"
                  underlineColorAndroid="transparent"
                  autoCapitalize="words"
                  onChangeText={this.updateTeamName}
                  value={this.state.teamName}
                />
              </View>
            </View>

            {this.state.teamName.length > 0 ? (
              <Button
                title="Proceed"
                onPress={() => {
                  this._saveTeamName();
                }}
                buttonStyle={{
                  height: 50,
                  borderRadius: 6,
                  marginTop: 50,
                  marginBottom: 15,
                  paddingHorizontal: 40,
                  alignSelf: "center",
                  backgroundColor: "#19537e",
                }}
              />
            ) : (
              <Button
                title="Proceed"
                buttonStyle={{
                  height: 50,
                  borderRadius: 6,
                  marginTop: 50,
                  marginBottom: 15,
                  paddingHorizontal: 40,
                  alignSelf: "center",
                  backgroundColor: "#ccc",
                }}
              />
            )}
          </View>
        </Overlay>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    paddingTop: 14,
    right: 18,
  },
  horizontal: {
    alignSelf: "flex-end",
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
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 12,
  },
  regemailHead: {
    fontFamily: "HelveticaNeue",
    fontSize: 20,
    fontWeight: "400",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: "#444",
  },
  inputStyle: {
    marginTop: 15,
  },

  listStyle: {
    marginTop: 50,
    // zIndex: 25,
  },

  acInput: {
    borderColor: "#999",
    borderWidth: 0.5,
    borderRadius: 8,
    marginLeft: -2,
    marginRight: -2,
    paddingLeft: 15,
    fontSize: 18,
  },
  ac_list_item: {
    backgroundColor: "#666",
    borderRadius: 6,
    margin: 2,
    marginRight: 15,
    zIndex: 50,
  },
  ac_list_item_text: {
    paddingLeft: 10,
    color: "#fff",
    fontSize: 16,
  },
  alertText: {
    fontSize: 18,
    padding: 15,
    fontFamily: "HelveticaNeue",
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
  },
  al_list_item: {
    borderColor: "#19537E",
    borderWidth: 0.5,
    borderRadius: 6,
    margin: 2,
    marginRight: 15,
  },
  al_list_item_text: {
    paddingLeft: 10,
    color: "#333",
    fontSize: 16,
  },

  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btncontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Platform.OS === "ios" ? 50 : 10,
  },
  ovBtnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  autoResView: {
    borderColor: "#ccc",
    borderRadius: 5,
    borderWidth: 1,
    height: "auto",
    maxHeight: screenHeight * 0.45,
    paddingTop: 5,
    paddingBottom: 10,
  },
  autoResViewH: {
    borderColor: "#ccc",
    borderRadius: 5,
    borderWidth: 1,
    height: screenHeight * 0.45,
    display: "none",
  },

  searchButton: {
    height: 49,
    borderTopRightRadius:8,
    borderBottomRightRadius:8,
    marginLeft: -79,
    paddingHorizontal: 8,
    width:80,
  },
});
