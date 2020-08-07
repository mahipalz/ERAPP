import React, { Fragment } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
  Image,
  Alert,
  TouchableOpacity,
  Dimensions,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  FlatList,
} from "react-native";

import AsyncStorage from "@react-native-community/async-storage";
import { NavigationEvents } from "react-navigation";
import { Button, Icon, Overlay, Input } from "react-native-elements";
import MenuBack from "../../components/MenuImage/MenuBack";
import MenuImageRight from "../../components/MenuImage/MenuImageRight";
import {
  Container,
  Content,
  Tab,
  Tabs,
  TabHeading,
  Item,
  Text,
  Label,
  ListItem,
} from "native-base";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Moment from "moment";
import Autocomplete from "native-base-autocomplete";
import RadioForm from "react-native-simple-radio-button";
import * as Konstants from "../../constants/constants";
import Spinner from "react-native-loading-spinner-overlay";

const querystring = require("querystring");
const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

var _this;
var _token = "";
var orgId = "";
var selEmpId = "";
var empName = "";
var selEmpName = "";
var roleId = "";
var crId = "";
var awardId = "";
var awardName = "";
var citationText = "";
var points = "";
var teamName = "";
var recipientDate = "";
var recipientTime = "";
var othertDate = "";
var otherTime = "";
var hdIsSendMailToAllEmployees = "false";
var hdIsSendMailToNomineeRPTMGR = "false";
var hdIsSendMailToNominatorRPTMGR = "false";
var hdIsSendMailToRole = "false";
var hdIsSendMailToNominatorRPTMGR = "false";
var hdIsSendMailToNominatorRPTMGR = "false";
var hdIsSendMailToNominatorRPTMGR = "false";
var hdIsSendMailToNominatorRPTMGR = "false";
var hdCommunicationRecipientTypeId = "1030";
var hdCommunicationOtherTypeId = "1030";
var hdIsAdditionalEmailOptionOverride = "false";
var hdCommunicationEmailOptionTypeId = "";
var chkAdditionalEmalOptions = "";
var txtAdditionalEmailDate = "";
var txtAdditionalEmailTime = "";
var hdIsEmailDistributionList = "false";
var rdEmailDistribution = "";
var txtEmailDistribution_SelectedValue = "";
var txtEmailDistributionDate = "";
var txtEmailDistributionTime = "";
var hdSendMeACopyofRecipientEmail = "";
var hdSendDistributionEmailcc = "";
var hdSendOtherEmailcc = "";

var otherRecipientValue = "";
var hdDisplayCitationFlag = "true";
var employeeObject = {};

export default class CommunicationScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "NOMINATE AWARD",
    headerLeft: (
      <MenuBack
        onPress={() => {
          navigation.navigate("CitationScreen");
        }}
      />
    ),
  });

  constructor(props) {
    super(props);
    this.state = {
      pageLoading: false,
      loading: false,
      isDatePickerVisible: false,
      isTimePickerVisible: false,
      overlayVisible: false,
      overlayAprVisible: false,
      approveOverlayVisible: false,
      commentsOverlayVisible: false,
      schDate: "",
      schDateOther: "",
      schTime: "",
      schTimeOther: "",
      nominationId: "",
      ovMsg1: "",
      ovMsg2: "",
      ovMsg3: "",
      showDtView: false,
      showOtherDtView: false,
      serverData: [],
      query: "",
      hideres: false,
      showSelView: false,
      selOtherEmpNames: [],
      selOtherEmpNums: [],
      showOtherView: true,
      chkRecipient: false,
      rcTypes: [],
      otherTypes: [],
      approvalRetMsg: "",
      acOverlayVisible: false,
      selRadioVal: "",
      selOtherRadioVal: "",
      showResDropdown: false,
    };

    _this = this;

    this.initEmp();

    this.setCommRadioList();
  }

  initEmp() {
    employeeObject = this.props.navigation.state.params.paramEmp;
    var tmpObj = this.props.navigation.state.params.paramEmp;
    _token = tmpObj.LogginedData.toString();
    empName = tmpObj.EmployeeName.toString();
    orgId = tmpObj.OrganizationId.toString();
  }

  setCommRadioList() {
    var tObj = this.props.navigation.state.params.paramEmp;
    var arr = [];
    tObj.CommunicationReciepientMode.map((u, i) => {
      if (u.Mode.toLowerCase() == "immediate") {
        hdCommunicationRecipientTypeId = u.Value;
      }
      var obj = { label: u.Mode, value: u.Value };
      arr.push(obj);
    });

    this.state.rcTypes = arr;

    var arr1 = [];
    tObj.CommunicationOthersMode.map((u, i) => {
      if (u.Mode.toLowerCase() == "immediate") {
        hdCommunicationOtherTypeId = u.Value;
      }
      var obj = { label: u.Mode, value: u.Value };
      arr1.push(obj);
    });

    this.state.otherTypes = arr1;
  }

  onViewWillFocus() {
    AsyncStorage.getItem("AS_SELECTED_EMP_NUMS")
      .then((value) => {
        var empNums = JSON.parse(value);
        selEmpId = empNums.toString();
      })
      .done();

    AsyncStorage.getItem("AS_TEAM_NAME")
      .then((value) => {
        if (value != null) {
          teamName = value.toString();
        }
      })
      .done();

    AsyncStorage.getItem("AS_SELECTED_EMP_NAMES")
      .then((value) => {
        var empNames = [];
        if (value != null) {
          empNames = JSON.parse(value);
        }
        selEmpName = empNames.toString();
      })
      .done();

    AsyncStorage.getItem("AS_SELECTED_AWARD_ID")
      .then((value) => {
        if (value != null) {
          awardId = value;
        }
      })
      .done();

    AsyncStorage.getItem("AS_SELECTED_AWARD_NAME")
      .then((value) => {
        if (value != null) {
          awardName = value;
        }
      })
      .done();

    AsyncStorage.getItem("AS_SELECTED_AWARD_POINTS")
      .then((value) => {
        if (value != null) {
          points = value;
        }
      })
      .done();

    AsyncStorage.getItem("AS_SELECTED_CR_ID")
      .then((value) => {
        var criteria = [];
        if (value != null) {
          criteria = JSON.parse(value);
        }
        crId = criteria.toString();
        console.log("selected criteria: " + crId);
      })
      .done();

    AsyncStorage.getItem("AS_SELECTED_CITATION")
      .then((value) => {
        if (value != null) {
          citationText = value;
        }
      })
      .done();
  }

  showDatePicker = () => {
    this.setState({ isDatePickerVisible: true });
  };

  showTimePicker = () => {
    this.setState({ isTimePickerVisible: true });
  };

  hideDatePicker = () => {
    this.setState({ isDatePickerVisible: false });
  };

  hideTimePicker = () => {
    this.setState({ isTimePickerVisible: false });
  };

  handleConfirm = (dt, elm) => {
    this.hideDatePicker();
    Moment.locale("en");
    if (elm == "to_rc") {
      this.setState({ schDate: Moment(dt).format("MMM DD, YYYY") });
      recipientDate = Moment(dt).format("YYYY-MM-DD");
    } else {
      this.setState({ schDateOther: Moment(dt).format("MMM DD, YYYY") });
      othertDate = Moment(dt).format("YYYY-MM-DD");
    }
  };

  handleTimeConfirm = (tm, elm) => {
    this.hideTimePicker();
    if (elm == "to_rc") {
      this.setState({ schTime: Moment(tm).format("HH:mm") });
      recipientTime = Moment(tm).format("HH:mm");
    } else {
      this.setState({ schTimeOther: Moment(tm).format("HH:mm") });
      otherTime = Moment(tm).format("HH:mm");
    }
  };

  validateForm() {
    let selTab = this.state.currentTab.toString();

    if (selTab == "1") {
      let chk_label = this.state.selOtherRadioVal;
      let chk_dt = this.state.schDateOther;

      if (chk_label == "Do not send") {
        return true;
      }

      // check emp selected
      let chk_emp = this.state.selOtherEmpNames.length;
      if (!chk_emp) {
        Alert.alert("Alert", Konstants.MSG_RECIPIENT_EMPTY);
        return false;
      }

      if (chk_label == "Later") {
        if (!chk_dt.length) {
          Alert.alert("Alert", Konstants.MSG_DT_TIME_EMPTY);
          return false;
        }
      }

      return true;
    } else if (selTab == "0") {
      let chk_label = this.state.selRadioVal;
      let chk_dt = this.state.schDate;

      if (chk_label == "Later") {
        if (!chk_dt.length) {
          Alert.alert("Alert", Konstants.MSG_DT_TIME_EMPTY);
          return false;
        }
      }

      return true;
    }
  }
  _submitCommunication = () => {
    if (!this.validateForm()) {
      return false;
    }

    this.setState({ pageLoading: true });

    var bodyObj = {};

    bodyObj["hdToken"] = _token; //
    bodyObj["hdAwardId"] = awardId; //
    bodyObj["hdCriteriaId"] = crId; //
    bodyObj["txtAwardPoints"] = points; /// empty - non monetary
    bodyObj["hdRoleID"] = roleId; //null
    bodyObj["idSelectRecipient_Value"] = selEmpId; //first screen emp nos
    bodyObj["txtTeamName"] = teamName; //
    bodyObj["hdDisplayCitationFlag"] = hdDisplayCitationFlag; //IsCitationTextFlag
    bodyObj["CitationInp"] = citationText; //
    bodyObj["hdIsCommunicationAvailable"] = "true"; 
    bodyObj["hdCommunicationRecipientTypeId"] = hdCommunicationRecipientTypeId; //1030
    bodyObj["txtRecipientDate"] = recipientDate;
    bodyObj["txtRecipientTime"] = recipientTime;
    bodyObj["hdCommunicationOtherTypeId"] = hdCommunicationOtherTypeId; //1030
    bodyObj["idOtherRecipient_Value"] = otherRecipientValue; //communication screen emp nos
    bodyObj["txtOthertDate"] = othertDate; //
    bodyObj["txtOtherTime"] = otherTime; //

    var deviceOS = Platform.OS.toString();
    bodyObj["hdOS"] = deviceOS.toLowerCase().includes("ios")
      ? "USER_APPLICATION_SOURCE_IOS"
      : "USER_APPLICATION_SOURCE_ANDROID";

    bodyObj[
      "hdCommunicationEmailOptionTypeId"
    ] = hdCommunicationEmailOptionTypeId; //null

    bodyObj[
      "hdIsAdditionalEmailOptionOverride"
    ] = hdIsAdditionalEmailOptionOverride; //false

    bodyObj["txtAdditionalEmailDate"] = txtAdditionalEmailDate; //null
    bodyObj["txtAdditionalEmailTime"] = txtAdditionalEmailTime; //null
    bodyObj["chkAdditionalEmalOptions"] = chkAdditionalEmalOptions; //empty

    bodyObj["rdEmailDistribution"] = rdEmailDistribution; //0
    bodyObj[
      "txtEmailDistribution_SelectedValue"
    ] = txtEmailDistribution_SelectedValue; //empty
    bodyObj["txtEmailDistributionDate"] = txtEmailDistributionDate; //empty
    bodyObj["txtEmailDistributionTime"] = txtEmailDistributionTime; //empty

    bodyObj["hdIsSendMailToAllEmployees"] = hdIsSendMailToAllEmployees; //false
    bodyObj["hdIsSendMailToNomineeRPTMGR"] = hdIsSendMailToNomineeRPTMGR; //false
    bodyObj["hdIsSendMailToNominatorRPTMGR"] = hdIsSendMailToNominatorRPTMGR; //false
    bodyObj["hdIsSendMailToRole"] = hdIsSendMailToRole; //false

    bodyObj["hdIsEmailDistributionList"] = hdIsEmailDistributionList; //false
    bodyObj["hdSendMeACopyofRecipientEmail"] = hdSendMeACopyofRecipientEmail; //null or 0
    bodyObj["hdSendDistributionEmailcc"] = hdSendDistributionEmailcc; //null
    bodyObj["hdSendOtherEmailcc"] = hdSendOtherEmailcc; //null

    var obj = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: querystring.stringify(bodyObj),
    };

    // console.log("BODY: " + querystring.stringify(bodyObj));

    var url = Konstants.API_ROOT_URL + "/Nomination/InsertNomination";
    // console.log(url);

    fetch(url, obj)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        this.setState({ pageLoading: false });

        var resObj = json[0];

        if (
          resObj.hasOwnProperty("id") &&
          (resObj.id == "" || resObj.id == null)
        ) {
          const regex = /(<([^>]+)>)/gi;
          const result = resObj.Message.replace(regex, "");

          let str1 = result.split(" with ");
          let str2 = str1[1].split(" for approval");

          this.setState({
            ovMsg1: str1[0] + " with ",
            ovMsg2: str2[0],
            ovMsg3: " for approval" + str2[1],
          });

          this.setState({ overlayVisible: true });
        } else {
          this.setState({ nominationId: resObj.id });
          this.setState({ approveOverlayVisible: true });
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({ pageLoading: false });
        Alert.alert("Error", "Please Try Again");
      })
      .done();
  };

  removeSession = async () => {
    const keys = [
      "AS_SELECTED_EMP_NUMS",
      "AS_SELECTED_EMP_NAMES",
      "AS_SELECTED_EMP_LIST",
      "AS_TEAM_NAME",
      "AS_SELECTED_AWARD_POINTS",
      "AS_SELECTED_AWARD_ID",
      "AS_SELECTED_AWARD_NAME",
      "AS_SELECTED_AWARD",
      "AS_SELECTED_CR_ID",
      "AS_SELECTED_CITATION",
      "AS_SELECTED_OTHER_EMP_NUMS",
      "AS_SELECTED_OTHER_EMP_NAMES",
    ];
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (e) {}
  };

  navigateToDB() {
    this.removeSession()
      .then(function() {
        _this.props.navigation.navigate("DBHome");
      })
      .catch(function(error) {
        console.log("problem: " + error.message);
      });
  }

  _gotoHome = () => {
    this.setState({ overlayVisible: false });
    this.navigateToDB();
  };

  _gotoHomeOvApr = () => {
    this.setState({ overlayAprVisible: false });
    this.navigateToDB();
  };

  _cancelPress = () => {
    this.setState({ approveOverlayVisible: false });
    this.navigateToDB();
  };

  _submitApproval = () => {
    this.setState({ pageLoading: true });

    let nid = this.state.nominationId;
    let os = "ios";

    var url =
      Konstants.API_ROOT_URL +
      "/Nomination/UpdateSelfAwardNominationStatus?" +
      "token=" +
      _token +
      "&AwardNominationId=" +
      nid +
      "&tOperatingSystem=" +
      os;
    // console.log(url);

    fetch(url, {})
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        this.setState({ pageLoading: false });

        const regex = /(<([^>]+)>)/gi;
        const result = json.replace(regex, "");

        this.setState(
          {
            approvalRetMsg: result.toString(),
          },
          () => {
            this.setState({ approveOverlayVisible: false });
            this.setState({ overlayAprVisible: true });
          }
        );
      })
      .catch((error) => {
        console.log(error);
        this.setState({ pageLoading: false });
        Alert.alert("Error", "Please Try Again");
      })
      .done();
  };

  tabChanged = (i) => {
    this.setState({ currentTab: i });
  };

  //=========== auto complete methods ===========//

  searchRecipient() {
    this.setState(
      { serverData: [], showCard: false, showResDropdown: false },
      () => {
        let employees_list = _this.findEmployee(this.state.query);
        this.setState({
          serverData: employees_list,
          hideres: false,
          showOtherView: false,
        });
      }
    );
  }

  searchTextChanged(text) {
    this.setState({ showResDropdown: false });

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

    this.setState({ loading: true });

    //var token = Konstants.TOKEN;
    var query = "?" + "token=" + _token + "&" + "term=" + searchTerm;
    var url =
      Konstants.API_ROOT_URL +
      "/Nomination/GetAutosuggestByEmployeeName" +
      query;

    // console.log(url);

    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ loading: false });

        if (responseJson[0].label.length == 0) {
          let k = [{ label: "No results found", value: "none" }];

          this.setState({
            serverData: k,
            showCard: false,
            showResDropdown: true,
            showSelView: false,
          });
        } else {
          this.setState(
            {
              serverData: responseJson,
              showCard: false,
              showResDropdown: true,
              showSelView: false,
            },
            () => {
              Keyboard.dismiss();
            }
          );
        }
      })
      .catch((error) => {
        console.error(error);
        this.setState({ loading: false });
      });

    const { serverData } = this.state;
    return serverData;
  }

  _itemSelected(obj) {
    //console.log("selected: " + JSON.stringify(obj));
    Keyboard.dismiss();
    if (obj.value == "none") {
      this.setState({ showCard: true, query: "" });

      if (this.state.selOtherEmpNums.length) {
        this.setState({ showOtherView: true, showSelView: true });
      }
      return false;
    }

    this.setState({ serverData: [], query: "" });

    this.setState({ empName: obj.label, empId: obj.value });
    this.setState({ showOtherView: true, showSelView: true });
    var tmpArrEN = [...this.state.selOtherEmpNums];

    if (tmpArrEN.indexOf(obj.value) == -1) {
      //save employee numbers
      tmpArrEN.push(obj.value);
      this.setState({ selOtherEmpNums: tmpArrEN });
      AsyncStorage.setItem(
        "AS_SELECTED_OTHER_EMP_NUMS",
        JSON.stringify(tmpArrEN)
      );

      if (tmpArrEN.length) {
        otherRecipientValue = tmpArrEN.toString();
      }

      //save employee names
      var tmpArrNames = [...this.state.selOtherEmpNames];
      var tob = { emp_name: obj.label, emp_num: obj.value };
      tmpArrNames.push(tob);
      this.setState({ selOtherEmpNames: tmpArrNames });
      AsyncStorage.setItem(
        "AS_SELECTED_OTHER_EMP_NAMES",
        JSON.stringify(tmpArrNames)
      );
    }
  }

  deleteEmp(sel_num) {
    //reconstruct emp card
    var tmpArr = [...this.state.selOtherEmpNames];
    var arrIdx;
    tmpArr.forEach(function(obj, i) {
      for (var key in obj) {
        if (key == "emp_num" && obj[key] == sel_num) {
          arrIdx = i;
        }
      }
    });

    tmpArr.splice(arrIdx, 1);
    this.setState({ selOtherEmpNames: tmpArr });
    AsyncStorage.setItem("AS_SELECTED_OTHER_EMP_NAMES", JSON.stringify(tmpArr));

    if (tmpArr.length == 0) {
      this.setState({ showSelView: false });
    } else {
      otherRecipientValue = tmpArr.toString();
    }
  }

  checkDateView(val, idx) {
    var chkLabel = this.state.rcTypes[idx].label;
    var flg = chkLabel == "Later" ? true : false;
    hdCommunicationRecipientTypeId = val;

    this.setState({ selRadioVal: chkLabel, showDtView: flg });
  }

  checkOtherDateView(val, idx) {
    var chkLabel = this.state.otherTypes[idx].label;
    var flg = chkLabel == "Later" ? true : false;
    hdCommunicationOtherTypeId = val;

    this.setState({ selOtherRadioVal: chkLabel, showOtherDtView: flg });
  }

  openRecipientView() {
    this.setState({ acOverlayVisible: true });
  }

  addRecipient() {
    this.setState({ acOverlayVisible: false });
  }

  render() {
    console.disableYellowBox = true;

    const { query, serverData } = this.state;

    if (this.state.pageLoading) {
      return (
        <Spinner
          visible={this.state.pageLoading}
          textContent={"Loading..."}
          textStyle={styles.spinnerTextStyle}
        />
      );
    }

    return (
      <Fragment>
        <NavigationEvents onWillFocus={this.onViewWillFocus} />
        <StatusBar barStyle="dark-content" />

        <View style={styles.commContainer}>
          <Text style={styles.commTitle}>Communication</Text>
        </View>

        <View style={styles.tabView}>
          <Container>
            <Tabs
              locked={true}
              tabContainerStyle={{ height: 50 }}
              tabBarUnderlineStyle={{
                backgroundColor: "#444",
                height: 3,
              }}
              initialPage={0}
              onChangeTab={({ i }) => this.tabChanged(i)}
            >
              <Tab
                heading={
                  <TabHeading
                    style={
                      this.state.currentTab == 0
                        ? styles.tabActiveStyle
                        : styles.tabInactiveStyle
                    }
                  >
                    <Icon color="#fff" name="email" />
                    <Text style={styles.tabHeadText}>To Recipient</Text>
                  </TabHeading>
                }
              >
                <Content>
                  <View style={{ marginTop: 25, marginLeft: 15 }}>
                    <Text>Notify the recipient</Text>
                  </View>

                  <RadioForm
                    ref="radioForm"
                    radio_props={this.state.rcTypes}
                    initial={0}
                    formHorizontal={false}
                    labelHorizontal={true}
                    buttonColor={"#19537e"}
                    labelColor={"#000"}
                    borderWidth={0.5}
                    style={{ marginLeft: 10, marginTop: 10, padding: 10 }}
                    labelStyle={{ fontSize: 16 }}
                    buttonStyle={{ padding: 50 }}
                    buttonSize={14}
                    selectedButtonColor={"#19537e"}
                    animation={false}
                    onPress={(value, index) => {
                      this.checkDateView(value, index);
                    }}
                  />

                  {this.state.showDtView && (
                    <View style={styles.commContainer}>
                      <Text style={styles.dtTitle}>Date & Time</Text>
                    </View>
                  )}
                  {this.state.showDtView && (
                    <View style={styles.dtView}>
                      <Text style={{ height: 10 }} />

                      <Item inlineLabel style={{ width: "95%" }}>
                        <Label>Date:</Label>
                        <TouchableOpacity onPress={() => this.showDatePicker()}>
                          <Text style={styles.inputText}>
                            {" "}
                            {this.state.schDate
                              ? this.state.schDate
                              : "Enter date here"}{" "}
                          </Text>
                        </TouchableOpacity>
                        <DateTimePickerModal
                          isVisible={this.state.isDatePickerVisible}
                          mode="date"
                          onConfirm={(d) => this.handleConfirm(d, "to_rc")}
                          onCancel={this.hideDatePicker}
                        />
                      </Item>

                      <Text style={{ height: 30 }} />

                      <Item inlineLabel style={{ width: "95%" }}>
                        <Label>Time:</Label>
                        <TouchableOpacity onPress={() => this.showTimePicker()}>
                          <Text style={styles.inputText}>
                            {" "}
                            {this.state.schTime
                              ? this.state.schTime
                              : "Enter time here"}{" "}
                          </Text>
                        </TouchableOpacity>
                        <DateTimePickerModal
                          isVisible={this.state.isTimePickerVisible}
                          mode="time"
                          locale="en_GB"
                          date={new Date()}
                          headerTextIOS="Pick a Time"
                          onConfirm={(t) => this.handleTimeConfirm(t, "to_rc")}
                          onCancel={this.hideTimePicker}
                        />
                      </Item>
                    </View>
                  )}
                </Content>
              </Tab>
              <Tab
                heading={
                  <TabHeading
                    style={
                      this.state.currentTab == 1
                        ? styles.tabActiveStyle
                        : styles.tabInactiveStyle
                    }
                  >
                    <Icon color="#fff" name="email" />
                    <Text style={styles.tabHeadText}>To Others</Text>
                  </TabHeading>
                }
              >
                <Content>
                  <View style={{ backgroundColor: "#fff", marginTop: 10 }}>
                    <View style={styles.headerWrapper}>
                      <TouchableOpacity
                        onPress={() => this.openRecipientView()}
                      >
                        <Text style={styles.header}>Enter Recipient(s)</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View>
                    {this.state.showSelView && (
                      <View
                        style={{
                          marginLeft: 10,
                          marginRight: 10,
                          marginTop: 5,
                          paddingBottom: 10,
                          marginBottom: 10,
                          borderColor: "#ccc",
                          borderRadius: 6,
                          borderWidth: 0.5,
                        }}
                      >
                        {this.state.selOtherEmpNames.map((u, i) => {
                          return (
                            <ListItem
                              key={i}
                              noBorder
                              style={{ marginBottom: -15 }}
                            >
                              <Text
                                style={{ color: "#19537e", paddingRight: 10 }}
                              >
                                {u.emp_name}
                              </Text>
                              <TouchableOpacity
                                onPress={() => this.deleteEmp(u.emp_num)}
                              >
                                <Image
                                  style={styles.image}
                                  source={require("../../assets/images/cross.png")}
                                  resizeMode="contain"
                                  resizeMethod="resize"
                                />
                              </TouchableOpacity>
                            </ListItem>
                          );
                        })}
                      </View>
                    )}

                    <View style={styles.notifyText}>
                      <Text style={{ fontSize: 16 }}>Notify the recipient</Text>
                    </View>

                    <RadioForm
                      ref="radioForm"
                      radio_props={this.state.otherTypes}
                      initial={0}
                      formHorizontal={false}
                      labelHorizontal={true}
                      buttonColor={"#19537e"}
                      labelColor={"#000"}
                      borderWidth={0.5}
                      style={{ marginLeft: 10, marginTop: 10, padding: 10 }}
                      labelStyle={{ fontSize: 16 }}
                      buttonStyle={{ padding: 50 }}
                      buttonSize={14}
                      selectedButtonColor={"#19537e"}
                      animation={false}
                      onPress={(value, index) => {
                        this.checkOtherDateView(value, index);
                      }}
                    />

                    {this.state.showOtherDtView && (
                      <View style={styles.commContainer}>
                        <Text style={styles.dtTitle_o}>Date & Time</Text>
                      </View>
                    )}

                    {this.state.showOtherDtView && (
                      <View style={styles.dtView}>
                        <Text style={{ height: 10 }} />

                        <Item inlineLabel style={{ width: "95%" }}>
                          <Label>Date:</Label>
                          <TouchableOpacity
                            onPress={() => this.showDatePicker()}
                          >
                            <Text style={styles.inputText}>
                              {" "}
                              {this.state.schDateOther
                                ? this.state.schDateOther
                                : "Enter date here"}{" "}
                            </Text>
                          </TouchableOpacity>
                          <DateTimePickerModal
                            isVisible={this.state.isDatePickerVisible}
                            mode="date"
                            onConfirm={(d) => this.handleConfirm(d, "to_ot")}
                            onCancel={this.hideDatePicker}
                          />
                        </Item>

                        <Text style={{ height: 30 }} />

                        <Item inlineLabel style={{ width: "95%" }}>
                          <Label>Time:</Label>
                          <TouchableOpacity
                            onPress={() => this.showTimePicker()}
                          >
                            <Text style={styles.inputText}>
                              {" "}
                              {this.state.schTimeOther
                                ? this.state.schTimeOther
                                : "Enter time here"}{" "}
                            </Text>
                          </TouchableOpacity>
                          <DateTimePickerModal
                            isVisible={this.state.isTimePickerVisible}
                            mode="time"
                            locale="en_GB"
                            date={new Date()}
                            headerTextIOS="Pick a Time"
                            onConfirm={(t) =>
                              this.handleTimeConfirm(t, "to_ot")
                            }
                            onCancel={this.hideTimePicker}
                          />
                        </Item>
                      </View>
                    )}
                  </View>
                </Content>
              </Tab>
            </Tabs>
          </Container>
        </View>

        <Button
          title="Proceed"
          onPress={() => {
            this._submitCommunication();
          }}
          buttonStyle={{
            height: 50,
            borderRadius: 6,
            marginTop: 30,
            paddingHorizontal: 25,
            width: "80%",
            alignSelf: "center",
            backgroundColor: "#19537e",
          }}
        />

        <Overlay
          isVisible={this.state.overlayVisible}
          windowBackgroundColor="#555"
          overlayBackgroundColor="#fff"
          width="95%"
          height="auto"
          borderRadius={15}
        >
          <View>
            <Image
              style={styles.trophy}
              source={require("../../assets/images/signintrophy.png")}
              resizeMode="contain"
              resizeMethod="resize"
            />
            <Text style={styles.olText}>
              {this.state.ovMsg1}
              <Text style={[styles.olText, styles.boldText]}>
                {this.state.ovMsg2}
              </Text>
              {this.state.ovMsg3}
            </Text>
            <Button
              title="Close"
              onPress={() => {
                this._gotoHome();
              }}
              buttonStyle={{
                height: 50,
                borderRadius: 6,
                marginTop: 20,
                marginBottom: 20,
                paddingHorizontal: 25,
                width: "80%",
                alignSelf: "center",
                backgroundColor: "#19537e",
              }}
            />
          </View>
        </Overlay>

        <Overlay
          isVisible={this.state.overlayAprVisible}
          windowBackgroundColor="#555"
          overlayBackgroundColor="#fff"
          width="95%"
          height="auto"
          borderRadius={15}
        >
          <View>
            <Image
              style={styles.trophy}
              source={require("../../assets/images/signinmedal.png")}
              resizeMode="contain"
              resizeMethod="resize"
            />

            <Text style={styles.olText}>{this.state.approvalRetMsg}</Text>
            <Button
              title="Close"
              onPress={() => {
                this._gotoHomeOvApr();
              }}
              buttonStyle={{
                height: 50,
                borderRadius: 6,
                marginTop: 20,
                marginBottom: 20,
                paddingHorizontal: 25,
                width: "80%",
                alignSelf: "center",
                backgroundColor: "#19537e",
              }}
            />
          </View>
        </Overlay>

        <Overlay
          isVisible={this.state.approveOverlayVisible}
          windowBackgroundColor="#555"
          overlayBackgroundColor="#fff"
          width="95%"
          height="auto"
          borderRadius={15}
        >
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}
          >
            <Text style={styles.aolTitle}>AWARD APPROVAL</Text>

            <View style={styles.aolContainer}>
              <View style={styles.aolItem}>
                <Text style={[styles.aolLeftText, styles.aolText]}>
                  Award Name:
                </Text>
              </View>
              <View style={styles.aolItem}>
                <Text style={[styles.aolRightText, styles.aolText]}>
                  {awardName}
                </Text>
              </View>
              <View style={styles.aolItem}>
                <Text style={[styles.aolLeftText, styles.aolText]}>
                  Awardee:
                </Text>
              </View>
              <View style={styles.aolItem}>
                <Text style={[styles.aolRightText, styles.aolText]}>
                  {selEmpName}
                </Text>
              </View>
              <View style={styles.aolItem}>
                <Text style={[styles.aolLeftText, styles.aolText]}>
                  Nominator:
                </Text>
              </View>
              <View style={styles.aolItem}>
                <Text style={[styles.aolRightText, styles.aolText]}>
                  {empName}
                </Text>
              </View>
              <View style={styles.aolItem}>
                <Text style={[styles.aolLeftText, styles.aolText]}>
                  Citation:
                </Text>
              </View>
              <View style={styles.aolItem}>
                <Text style={[styles.aolRightText, styles.aolText]}>
                  {citationText}
                </Text>
              </View>
              <View style={styles.aolItem}>
                <Text style={[styles.aolLeftText, styles.aolText]}>
                  Award Points:
                </Text>
              </View>
              <View style={styles.aolItem}>
                <Text style={[styles.aolRightText, styles.aolText]}>
                  {points}
                </Text>
              </View>
            </View>

            <View style={styles.butContainer}>
              <View style={styles.butItem}>
                <Button
                  title="CANCEL"
                  onPress={() => {
                    this._cancelPress();
                  }}
                  buttonStyle={{
                    height: 50,
                    borderRadius: 6,
                    marginTop: 20,
                    marginBottom: 20,
                    paddingHorizontal: 5,
                    width: "80%",
                    alignSelf: "center",
                    backgroundColor: "#be3f32",
                  }}
                />
              </View>
              <View style={styles.butItem}>
                <Button
                  title="APPROVE"
                  onPress={() => {
                    this._submitApproval();
                  }}
                  buttonStyle={{
                    height: 50,
                    borderRadius: 6,
                    marginTop: 20,
                    marginBottom: 20,
                    paddingHorizontal: 5,
                    width: "80%",
                    alignSelf: "center",
                    backgroundColor: "#19537e",
                  }}
                />
              </View>
            </View>
          </ScrollView>
        </Overlay>

        <Overlay
          isVisible={this.state.acOverlayVisible}
          windowBackgroundColor="#555"
          overlayBackgroundColor="#fff"
          width="96%"
          height="75%"
          style={{ maxHeight: "90%" }}
          borderRadius={15}
        >
          <View style={{ flex: 1 }}>
            <ScrollView
              contentContainerStyle={{ flex: 1 }}
              keyboardShouldPersistTaps="always"
            >
              <View style={styles.sectionContainer}>
                <View style={styles.inputStyle}>
                  <TouchableOpacity
                    style={{
                      alignSelf: "flex-end",
                      marginTop: -15,
                      marginBottom: 10,
                    }}
                    onPress={() => this.setState({ acOverlayVisible: false })}
                  >
                    <Image
                      source={require("../../assets/images/cross.png")}
                      resizeMode="contain"
                      resizeMethod="resize"
                    />
                  </TouchableOpacity>
                  <View>
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
              {this.state.loading && (
                <View style={styles.spinner}>
                  <ActivityIndicator size="large" color="#19537e" />
                </View>
              )}

              {this.state.showSelView && (
                <View style={styles.empContainer}>
                  {this.state.selOtherEmpNames.map((u, i) => {
                    return (
                      <ListItem key={i} noBorder style={{ marginBottom: -15 }}>
                        <Text style={{ color: "#19537e", paddingRight: 10 }}>
                          {u.emp_name}
                        </Text>
                        <TouchableOpacity
                          onPress={() => this.deleteEmp(u.emp_num)}
                        >
                          <Image
                            style={styles.image}
                            source={require("../../assets/images/cross.png")}
                            resizeMode="contain"
                            resizeMethod="resize"
                          />
                        </TouchableOpacity>
                      </ListItem>
                    );
                  })}
                </View>
              )}
            </ScrollView>
            <View style={styles.olbutItem}>
              <Button
                title="Add Recipient"
                onPress={() => {
                  this.addRecipient();
                }}
                buttonStyle={{
                  height: 50,
                  borderRadius: 6,
                  marginTop: 2,
                  marginBottom: 1,
                  paddingHorizontal: 5,
                  width: "80%",
                  alignSelf: "center",
                  backgroundColor: "#19537e",
                }}
              />
            </View>
          </View>
        </Overlay>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },

  body: {
    backgroundColor: "#fff",
    height: "100%",
  },
  tabView: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#666",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 0,
    shadowOpacity: 1,
    height: "70%",
  },

  dtView: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#666",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 0,
    shadowOpacity: 1,
    padding: 15,
    paddingBottom: 30,
  },
  commContainer: {
    margin: 10,
    marginTop: 30,
    marginBottom: 20,
  },
  commTitle: {
    fontFamily: "HelveticaNeue",
    fontSize: 20,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: 25,
    letterSpacing: 0.02,
    color: "#19537e",
    paddingLeft: 10,
  },

  dtTitle: {
    fontSize: 18,
    color: "#333",
    marginLeft: 10,
    marginTop: 20,
  },

  dtTitle_o: {
    fontSize: 18,
    color: "#333",
    marginLeft: 10,
    marginTop: 10,
  },

  tabHeadText: {
    fontFamily: "HelveticaNeue",
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.02,
    color: "#fff",
    paddingLeft: 10,
  },
  inputText: {
    color: "#999",
  },

  trophy: {
    width: 40,
    height: 60,
    marginTop: 15,
    alignSelf: "center",
  },

  olText: {
    fontFamily: "HelveticaNeue",
    fontSize: 20,
    fontWeight: "300",
    fontStyle: "normal",
    lineHeight: 30,
    letterSpacing: 1,
    padding: 4,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  boldText: {
    fontWeight: "bold",
  },
  aolContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  aolItem: {
    width: "40%",
    padding: 8,
  },
  aolRightText: {
    alignSelf: "flex-start",
  },
  aolLeftText: {
    alignSelf: "flex-start",
  },
  aolText: {
    fontFamily: "HelveticaNeue",
    fontSize: 18,
    fontWeight: "300",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 1,
    padding: 4,
  },

  aolTitle: {
    fontFamily: "HelveticaNeue",
    fontSize: 20,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 1,
    padding: 30,
    alignSelf: "center",
  },
  butContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  butItem: {
    width: "50%",
    padding: 10,
  },

  olbutItem: {
    width: "60%",
    padding: 10,
    alignSelf: "center",
  },

  notifyText: {
    marginTop: 20,
    marginLeft: 15,
  },
  spinnerTextStyle: {
    color: "#fff",
  },
  headerWrapper: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
  header: {
    fontSize: 15,
    alignSelf: "auto",
    color: "#444",
    padding: 10,
    paddingLeft: 5,
  },

  empContainer: {
    ...Platform.select({
      ios: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 70,
        paddingBottom: 10,
        marginBottom: 10,
        borderColor: "#ccc",
        borderRadius: 6,
        borderWidth: 0.5,
      },
      android: {
        width: "95%",
        position: "absolute",
        marginLeft: 10,
        marginRight: 50,
        marginTop: 100,
        paddingBottom: 10,
        borderColor: "#ccc",
        borderRadius: 6,
        borderWidth: 0.5,
      },
    }),
  },
  tabActiveStyle: {
    backgroundColor: "#444",
  },

  tabInactiveStyle: {
    backgroundColor: "#888",
  },

  sectionContainer: {
    marginTop: 0,
    paddingHorizontal: 8,
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
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    marginLeft: -79,
    paddingHorizontal: 8,
    width: 80,
  },
  spinner: {
    marginTop: 100,
  },
});
