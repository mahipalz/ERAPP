import React from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import MenuBack from "../../components/MenuImage/MenuBack";
import MenuImageRight from "../../components/MenuImage/MenuImageRight";
import * as Konstants from "../../constants/constants";
import { Form, Item, Input, Label } from "native-base";
import { Button } from "react-native-elements";

var _this;
var _token = "";

export default class RedemptionAddress extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "SHIPPING DETAILS",
    headerLeft: (
      <MenuBack
        onPress={() => {
          navigation.navigate("RedemptionCart");
        }}
      />
    ),
    swipeEnabled: false,

  });

  constructor(props) {
    super(props);
    this.state = {
      pageLoading: false,
      loading: false,
      nameText: "",
      mobileText: "",
      countryId: "",
      emailText: "",
      addressText: "",
      landmarkText: "",
      postalcodeText: "",
      enableSubmit: false,
      isInstaVoucher: "0",
    };
    _this = this;

    this.state.nameText = this.props.navigation.state.params.paramEmpName;
    this.state.mobileText = this.props.navigation.state.params.paramEmpMobile;
    this.state.emailText = this.props.navigation.state.params.paramEmpEmail;
    this.state.countryId = this.props.navigation.state.params.paramEmpCountry;
  }

  componentDidMount() {
    AsyncStorage.getItem("AS_TOKEN")
      .then((value) => {
        //console.log("TOKEN: " + value.toString());
        _token = value.toString();
      })
      .done();

    AsyncStorage.getItem("AS_INSTA_VOUCHER")
      .then((value) => {
        this.setState({ isInstaVoucher: value });
        if (value == "0") {
          this.setState({ enableSubmit: true });
        }
      })
      .done();
  }

  updateAddress = (text) => {
    this.setState({ addressText: text });

    this.validateForm();
  };

  updateLandmark = (text) => {
    this.setState({ landmarkText: text });
    this.validateForm();
  };

  updatePostalcode = (text) => {
    this.setState({ postalcodeText: text });
    this.validateForm();
  };

  updateMobile = (text) => {
    this.setState({ mobileText: text });
    this.validateForm();
  };

  validateForm() {
    var a = this.state.addressText;
    var p = this.state.postalcodeText;
    var m = this.state.mobileText;

    if (this.state.isInstaVoucher == 1) {
      if (a.length && p.length && m.length) {
        this.setState({ enableSubmit: true });
      } else {
        this.setState({ enableSubmit: false });
      }
    } else {
      if (m.length < 5) {
        this.setState({ enableSubmit: false });
      } else {
        this.setState({ enableSubmit: true });
      }
    }
  }

  _apiConfirmOrder() {
    //place order

    this.setState({ pageLoading: true });

    var name = this.state.nameText;
    var address = encodeURIComponent(this.state.addressText);
    var landmark = encodeURIComponent(this.state.landmarkText);
    var postalcode = this.state.postalcodeText;
    var mobile = this.state.mobileText;
    var email = this.state.emailText;
    var countryId = this.state.countryId;

    var query =
      "?" +
      "token=" +
      _token +
      "&EmployeeName=" +
      name +
      "&Address1=" +
      address +
      "&LandMark=" +
      landmark +
      "&PostalCode=" +
      postalcode +
      "&Mobile=" +
      mobile +
      "&Email=" +
      email +
      "&CountryId=" +
      countryId +
      "&StateId=1";

    var url = Konstants.API_ROOT_URL + "/Order/PlaceOrder" + query;

    // console.log(url);

    fetch(url, {})
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        this.setState({ pageLoading: false });

        var msg = Konstants.MSG_SERVER_ERROR;
        if (Object.keys(json).includes("strMessage")) {
          msg = json.strMessage;
        }

        this.props.navigation.navigate("RedemptionOrder", {
          paramEmpName: name,
          paramMsg: msg,
        });
      })
      .catch((error) => {
        this.setState({ pageLoading: false });
      })
      .done();
  }

  render() {
    console.disableYellowBox = true;

    const { pageLoading, isInstaVoucher } = this.state;

    if (pageLoading) {
      return (
        <View style={[styles.loadingContainer, styles.horizontal]}>
          <ActivityIndicator size="large" color="#19537e" />
        </View>
      );
    }

    return (
      <View style={styles.body}>
        <ScrollView>
          <View
            style={{
              margin: 10,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#f2f2f2",
            }}
          >
            <Form style={{ padding: 5, paddingRight: 5, paddingBottom: 25 }}>
              <Item floatingLabel>
                <Label>
                  Name <Text style={{ color: "red" }}>*</Text>
                </Label>
                <Input
                  value={this.state.nameText}
                  underlineColorAndroid="transparent"
                  editable={false}
                />
              </Item>

              {isInstaVoucher == "1" ? (
                <Item floatingLabel>
                  <Label>
                    Address <Text style={{ color: "red" }}>*</Text>
                  </Label>
                  <Input
                    multiline={true}
                    returnKeyType={"done"}
                    clearButtonMode="while-editing"
                    value={this.state.addressText}
                    underlineColorAndroid="transparent"
                    onChangeText={this.updateAddress}
                    onSubmitEditing={(event) => Keyboard.dismiss()}
                  />
                </Item>
              ) : (
                <View />
              )}

              {isInstaVoucher == "1" ? (
                <Item floatingLabel>
                  <Label>Landmark</Label>
                  <Input
                    returnKeyType="done"
                    clearButtonMode="while-editing"
                    value={this.state.landmarkText}
                    underlineColorAndroid="transparent"
                    onChangeText={this.updateLandmark}
                  />
                </Item>
              ) : (
                <View />
              )}

              {isInstaVoucher == "1" ? (
                <Item floatingLabel>
                  <Label>
                    Postal Code <Text style={{ color: "red" }}>*</Text>
                  </Label>
                  <Input
                    keyboardType="number-pad"
                    clearButtonMode="while-editing"
                    returnKeyType="done"
                    value={this.state.postalcodeText}
                    underlineColorAndroid="transparent"
                    onChangeText={this.updatePostalcode}
                  />
                </Item>
              ) : (
                <View />
              )}

              <Item floatingLabel>
                <Label>
                  Mobile Number <Text style={{ color: "red" }}>*</Text>
                </Label>
                <Input
                  value={this.state.mobileText}
                  //  clearButtonMode="while-editing"
                  returnKeyType="done"
                  keyboardType="number-pad"
                  underlineColorAndroid="transparent"
                  onChangeText={this.updateMobile}
                />
              </Item>

              <Item floatingLabel>
                <Label>Email Address</Label>
                <Input
                  value={this.state.emailText}
                  underlineColorAndroid="transparent"
                  editable={false}
                />
              </Item>
            </Form>
          </View>

          <View style={{ marginTop: 10, marginLeft: 10 }}>
            <Text>Note:</Text>
          </View>

          {isInstaVoucher == "0" && (
            <View
              style={{
                fontStyle: "italic",
                padding: 10,
                margin: 10,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#f2f2f2",
              }}
            >
              <View>
                <Text
                  style={{ color: "#DC143C", fontStyle: "italic", padding: 5 }}
                >
                  1. E-Vouchers will be delivered to the email address.
                </Text>
              </View>
              <View>
                <Text
                  style={{ color: "#DC143C", fontStyle: "italic", padding: 5 }}
                >
                  2. E-Vouchers cannot be cancelled.
                </Text>
              </View>
            </View>
          )}

          {isInstaVoucher == "1" && (
            <View
              style={{
                fontStyle: "italic",
                padding: 10,
                margin: 10,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#f2f2f2",
              }}
            >
              <View>
                <Text
                  style={{ color: "#DC143C", fontStyle: "italic", padding: 5 }}
                >
                  Physical products / Gift cards will be delivered within 15
                  business days.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={{ height: 100, paddingTop: 10, alignSelf: "center" }}>
          {this.state.enableSubmit == true || isInstaVoucher == "0" ? (
            <Button
              title="Confirm Order"
              fontSize="20"
              onPress={() => {
                this._apiConfirmOrder();
              }}
              buttonStyle={{
                borderRadius: 6,
                padding: 12,
                paddingLeft: 10,
                paddingRight: 10,
                width: "80%",
                alignSelf: "center",
                backgroundColor: "#19537e",
              }}
            />
          ) : (
            <Button
              title="Confirm Order"
              fontSize="20"
              buttonStyle={{
                borderRadius: 6,
                padding: 12,
                paddingLeft: 10,
                paddingRight: 10,
                width: "80%",
                alignSelf: "center",
                backgroundColor: "#555",
                opacity: 0.3,
              }}
            />
          )}
        </View>
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

  container: {
    margin: 20,
  },

  centerView: {
    marginLeft: 20,
    marginTop: 30,
  },

  ctText: {
    fontFamily: "HelveticaNeue",
    fontSize: 20,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    color: "#3e4a59",
  },

  textareaContainer: {
    padding: 3,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    borderRadius: 8,
    borderColor: "#999",
    borderWidth: 1,
  },

  textarea: {
    textAlignVertical: "top", // hack android
    fontSize: 16,
    color: "#333",
  },

  spinnerTextStyle: {
    color: "#fff",
  },
});
