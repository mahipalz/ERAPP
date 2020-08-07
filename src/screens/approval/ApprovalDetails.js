import React, { Fragment } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Keyboard,
  Dimensions,
} from "react-native";

import AsyncStorage from "@react-native-community/async-storage";
import { NavigationEvents } from "react-navigation";
import NominationCard from "../../components/NominationCard/NominationCard";
import MenuBack from "../../components/MenuImage/MenuBack";
import MenuImageRight from "../../components/MenuImage/MenuImageRight";
import * as Konstants from "../../constants/constants";
import {
  Picker,
  Icon as NBIcon,
  Tab,
  Tabs,
  TabHeading,
  Content,
  Form,
  Item,
  Input,
  Label,
  ListItem,
} from "native-base";
import { Icon, Button, Overlay } from "react-native-elements";
import RadioForm from "react-native-simple-radio-button";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Moment from "moment";
import Autocomplete from "native-base-autocomplete";
const querystring = require("querystring");

var _this;
var _token = "";
var nominationInfo;
// var defaultEmailOptionId = {};
var communicationTypeId = "";
var recipientDate = "";
var recipientTime = "";
var othertDate = "";
var otherTime = "";
var otherRecipientValue = "";
var employeeObject = {};
var hdCommunicationRecipientTypeId = "1030";
var hdCommunicationOtherTypeId = "1030";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

export default class ApprovalDetails extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "APPROVE AWARD",
    headerLeft: (
      <MenuBack
        onPress={() => {
          navigation.navigate("ApprovalHome");
        }}
      />
    ),
    swipeEnabled: false,
  });

  constructor(props) {
    super(props);
    this.scroll = null;
    this.state = {
      pageLoading: true,
      loading: false,
      reasonText: "",
      citationText: "",
      nominationDetails: {},
      crList: [],
      selPickerVal: "",

      isDatePickerVisible: false,
      isTimePickerVisible: false,
      overlayVisible: false,
      schDate: "",
      schDateOther: "",
      schTime: "",
      schTimeOther: "",
      ovMsg: "",
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
      acOverlayVisible: false,
      selRadioVal: "",
      selOtherRadioVal: "",
      _isMounted: false,
      showResDropdown: false,
    };
    _this = this;

    nominationInfo = this.props.navigation.state.params.paramNominationInfo;
    _token = this.props.navigation.state.params.paramToken;

    AsyncStorage.getItem("AS_EMP")
      .then((value) => {
        if (value != null) {
          employeeObject = JSON.parse(value);
        }
      })
      .done();
  }

  setCommRadioList(resObj) {
    var arr = [];
    resObj.CommunicationReciepientMode.map((u, i) => {
      if (u.Mode.toLowerCase() == "immediate") {
        // defaultEmailOptionId['RC'] = u.Value;
        hdCommunicationRecipientTypeId = u.Value;
      }
      var obj = { label: u.Mode, value: u.Value };
      arr.push(obj);
    });

    this.setState({ rcTypes: arr });

    var arr1 = [];
    resObj.CommunicationOthersMode.map((u, i) => {
      if (u.Mode.toLowerCase() == "immediate") {
        // defaultEmailOptionId['OTHER'] = u.Value;
        hdCommunicationOtherTypeId = u.Value;
      }
      var obj = { label: u.Mode, value: u.Value };
      arr1.push(obj);
    });

    this.setState({ otherTypes: arr1 });

    this.setState({
      citationText: resObj.ReasonforNomination,
    });
  }

  async componentDidMount() {
    this.setState({ _isMounted: true });

    try {
      var query =
        "?" +
        "token=" +
        _token +
        "&awardnominationid=" +
        nominationInfo.AwardNominationId;
      var url =
        Konstants.API_ROOT_URL +
        "/Nomination/PendingAwardNominationDetails" +
        query;
      // console.log(url);

      const response = await fetch(url);
      const responseJson = await response.json();
      this.setState(
        { nominationDetails: responseJson[0], pageLoading: false },
        () => this.setCommRadioList(responseJson[0])
      );
    } catch (err) {
      console.log("Error fetching data-----------", err);
    }
  }

  componentWillUnmount() {
    this.setState({ _isMounted: false });
  }

  updateCitation = (text) => {
    this.setState({ citationText: text });
  };

  updateReasonText = (text) => {
    this.setState({ reasonText: text });
  };

  onViewWillFocus() {}

  onPickerChange(value) {
    this.setState({
      selPickerVal: value,
    });
    AsyncStorage.setItem("AS_SELECTED_CRITERIA_ID", value.toString());
  }

  //=========== auto complete methods ===========//
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
        //debugger

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

    if (chkLabel == "Later") {
      _this.scroll.scrollToEnd();
    }
  }

  checkOtherDateView(val, idx) {
    var chkLabel = this.state.otherTypes[idx].label;
    var flg = chkLabel == "Later" ? true : false;
    hdCommunicationOtherTypeId = val;

    this.setState({ selOtherRadioVal: chkLabel, showOtherDtView: flg });

    if (chkLabel == "Later") {
      _this.scroll.scrollToEnd();
    }
  }

  //date time functions

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
          _this.scroll.scrollToEnd();
          Alert.alert("Alert", Konstants.MSG_DT_TIME_EMPTY);
          return false;
        }
      }

      return true;
    } else if (selTab == "0") {
      let chk_label = this.state.selRadioVal;
      let chk_dt = this.state.schDate;
      //let chk_tm = this.state.schTime;

      if (chk_label == "Later") {
        if (!chk_dt.length) {
          _this.scroll.scrollToEnd();
          Alert.alert("Alert", Konstants.MSG_DT_TIME_EMPTY);
          return false;
        }
      }

      return true;
    }
  }

  _submitApproval = () => {
    if (!this.validateForm()) {
      return false;
    }

    this.setState({ pageLoading: true });

    var bodyObj = {};

    bodyObj["hdApproverToken"] = _token;
    bodyObj[
      "hdAwardNominationId"
    ] = this.state.nominationDetails.AwardNominationID;
    bodyObj[
      "txtApproverAwardPoints"
    ] = this.state.nominationDetails.AwardPoints;
    bodyObj["hdApproverCriteriaId"] = this.state.selPickerVal
      ? this.state.selPickerVal
      : this.state.nominationDetails.AwardCriteriaId;
    bodyObj["txtApproveReasonInp"] = this.state.reasonText;
    bodyObj["txtCitationInp"] = this.state.citationText;

    bodyObj["rdApproverRecipient"] = hdCommunicationRecipientTypeId; //rdApproverRecipient;
    bodyObj["txtApproverRecipientDate"] = recipientDate;
    bodyObj["txtApproverRecipientTime"] = recipientTime;

    bodyObj["rdApproverOther"] = hdCommunicationOtherTypeId; //rdApproverOther
    bodyObj["idApproverOtherRecipient_Value"] = otherRecipientValue;
    bodyObj["txtApproverOthertDate"] = othertDate;
    bodyObj["txtApproverOtherTime"] = otherTime;

    bodyObj["hdApproverIsAdditionalEmailOptionOverride"] = false;
    bodyObj["hdApproverIsEmailDistributionList"] = false;
    bodyObj["hdSendMeACopyofRecipientEmail"] = "";
    bodyObj["hdSendToOtherEmailToCC"] = "";
    var deviceOS = Platform.OS.toString();
    bodyObj["hdApproverOS"] = deviceOS.toLowerCase().includes("ios")
      ? "USER_APPLICATION_SOURCE_IOS"
      : "USER_APPLICATION_SOURCE_ANDROID";

    var obj = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: querystring.stringify(bodyObj),
    };

    var url = Konstants.API_ROOT_URL + "/Nomination/updateapproveraward";
    // console.log(url);

    fetch(url, obj)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        this.setState({ pageLoading: false });
        this.setState({ ovMsg: json });
        this.setState({ overlayVisible: true });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          pageLoading: false,
          ovMsg: "A server error occured. Please try again",
          overlayVisible: true,
        });
      })
      .done();
  };

  _submitRejection = () => {
    //RejectAward

    //validate
    if (this.state.reasonText == "" || this.state.reasonText == null) {
      Alert.alert("Alert", Konstants.MSG_REJECTION_REASON);
    } else {
      this.setState({ pageLoading: true });

      var bodyObj = {};

      bodyObj["hdApproverToken"] = _token;
      bodyObj[
        "hdAwardNominationId"
      ] = this.state.nominationDetails.AwardNominationID;
      bodyObj["txtApproveReasonInp"] = this.state.reasonText;
      var deviceOS = Platform.OS.toString();
      bodyObj["hdApproverOS"] = deviceOS.toLowerCase().includes("ios")
        ? "USER_APPLICATION_SOURCE_IOS"
        : "USER_APPLICATION_SOURCE_ANDROID";

      //  console.log("BODY: " + querystring.stringify(bodyObj));

      var obj = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: querystring.stringify(bodyObj),
      };

      var url = Konstants.API_ROOT_URL + "/Nomination/RejectAward";
      // console.log(url);

      fetch(url, obj)
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          this.setState({ pageLoading: false });
          this.setState({ ovMsg: json });
          this.setState({ overlayVisible: true });
        })
        .catch((error) => {
          console.log(error);
          this.setState({
            pageLoading: false,
            ovMsg: "Award Rejection failed. Please try again",
            overlayVisible: true,
          });
        })
        .done();
    }
  };

  _gotoHome = () => {
    this.setState({ overlayVisible: false });
    this.props.navigation.navigate("ApprovalHome");
  };

  openRecipientView() {
    this.setState({ acOverlayVisible: true });
  }

  addRecipient() {
    this.setState({ acOverlayVisible: false });
  }

  tabChanged = (i) => {
    this.setState({ currentTab: i });
    if (i == 1) {
      _this.scroll.scrollToEnd();
    }
  };

  render() {
    console.disableYellowBox = true;

    const {
      pageLoading,
      nominationDetails,
      citationText,
      selPickerVal,
      serverData,
      query,
    } = this.state;

    if (pageLoading) {
      return (
        <View style={[styles.loadingContainer, styles.horizontal]}>
          <ActivityIndicator size="large" color="#19537e" />
        </View>
      );
    }

    return (
      <View style={styles.body}>
        <NavigationEvents onWillFocus={this.onViewWillFocus} />
        <ScrollView
          ref={(scroll) => {
            this.scroll = scroll;
          }}
        >
          <View style={styles.listStyle}>
            <NominationCard
              image={{ uri: nominationInfo.AwardIcon }}
              title={nominationInfo.AwardName}
              recipient={nominationInfo.RecipientName}
              nominator={nominationInfo.NominatorName}
              nm_date={nominationInfo.NominationDate}
              isClose={false}
            />
          </View>

          <View>
            <Form style={{ padding: 15, paddingRight: 20 }}>
              <Item stackedLabel>
                <Label>Citation</Label>
                <Input
                  multiline={true}
                  value={citationText}
                  underlineColorAndroid="transparent"
                  onChangeText={this.updateCitation}
                />
              </Item>

              <Item picker style={{ marginTop: 20, marginLeft: 15 }}>
                <Label>Award Criteria</Label>
                <Picker
                  CriteriaddlList
                  mode="dropdown"
                  iosIcon={<NBIcon name="arrow-down" />}
                  style={{ width: undefined, marginLeft: 25 }}
                  placeholder="Select Criteria"
                  placeholderStyle={{ color: "#ccc" }}
                  placeholderIconColor="#ccc"
                  selectedValue={
                    selPickerVal
                      ? selPickerVal
                      : nominationDetails.AwardCriteriaId
                  }
                  onValueChange={this.onPickerChange.bind(this)}
                >
                  {nominationDetails.CriteriaddlList.map((o, j) => {
                    return (
                      <Picker.Item key={j} label={o.Text} value={o.Value} />
                    );
                  })}
                </Picker>
              </Item>

              <Item stackedLabel style={{ marginTop: 15 }}>
                <Label>Reason for Approval/Rejection</Label>
                <Input
                  multiline={true}
                  value={this.state.reasonText}
                  underlineColorAndroid="transparent"
                  onChangeText={this.updateReasonText}
                />
              </Item>
            </Form>
          </View>

          <View style={{ paddingLeft: 10, paddingBottom: 10, paddingTop: 20 }}>
            <Text style={styles.cmtext}>Communication</Text>
          </View>

          <View style={styles.tabView}>
            <Tabs
              locked={true}
              tabContainerStyle={{ height: 45 }}
              tabBarUnderlineStyle={{
                backgroundColor: "#333",
                height: Platform.OS === "ios" ? 1 : 3,
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
                activeTabStyle={{ backgroundColor: "red" }}
              >
                <Content>
                  <View style={{ marginTop: 25, marginLeft: 15 }}>
                    <Text style={{ fontSize: 16 }}>Notify the recipient</Text>
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

                        <Text style={{ height: 20 }} />

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
                    <View style={{ height: 200 }} />
                  </View>
                </Content>
              </Tab>
            </Tabs>
          </View>
        </ScrollView>

        <View
          style={{
            height: 110,
            paddingTop: 10,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={styles.butItem}>
            <Button
              title="REJECT"
              onPress={() => {
                this._submitRejection();
              }}
              buttonStyle={{
                height: 40,
                borderRadius: 6,
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
                height: 40,
                borderRadius: 6,
                paddingHorizontal: 5,
                width: "80%",
                alignSelf: "center",
                backgroundColor: "#19537e",
              }}
            />
          </View>
        </View>

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

            <Text style={styles.olText}>{this.state.ovMsg}</Text>
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

  loadingContainer_rc: {
    marginTop: -30,
    right: 5,
  },
  horizontal_rc: {
    alignSelf: "flex-end",
    padding: 0,
  },

  scrollView: {
    backgroundColor: "#fff",
  },

  body: {
    backgroundColor: "#fff",
    flex: 1,
  },

  container: {
    margin: 20,
  },

  listStyle: {
    marginTop: 20,
  },
  cmtext: {
    fontFamily: "Helvetica",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    color: "#6f6f6f",
  },

  tabView: {
    marginLeft: 10,
    marginRight: 10,
    height: 460,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    shadowColor: "#666",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowRadius: 0,
    shadowOpacity: 1,
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
    marginBottom: 0,
  },
  commContainer: {
    margin: 10,
    marginTop: 0,
    marginBottom: 20,
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

  activetab: {
    backgroundColor: "#555",
  },
  acInput: {
    paddingLeft: 10,
    fontSize: 16,
    marginTop: 20,
    borderColor: "#999",
    borderWidth: 0.5,
    borderRadius: 8,
  },
  ac_list_item: {
    backgroundColor: "#666",
    borderRadius: 6,
    margin: 2,
    marginRight: 15,
  },
  ac_list_item_text: {
    paddingLeft: 10,
    color: "#fff",
    fontSize: 16,
  },
  notifyText: {
    marginTop: 20,
    marginLeft: 15,
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
    fontSize: 16,
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
        marginTop: 80,
        paddingBottom: 10,
        marginBottom: 10,
        borderColor: "#ccc",
        borderRadius: 6,
        borderWidth: 0.5,
      },
      android: {
        width: "90%",
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

  spinner: {
    marginTop: 100,
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
});
