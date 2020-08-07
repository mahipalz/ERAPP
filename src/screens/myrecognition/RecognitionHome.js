import React, { Fragment } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
  Image,
  Dimensions,
} from "react-native";

import AsyncStorage from "@react-native-community/async-storage";
import { NavigationEvents } from "react-navigation";
import { Button, Overlay, Input } from "react-native-elements";
import RGCard from "../../components/RGCard/RGCard";
import MenuImage from "../../components/MenuImage/MenuImage";
import * as Konstants from "../../constants/constants";
import Textarea from "react-native-textarea";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

var _this;
var _token = "";
var teamNames = "";

export default class RecognitionHome extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "MY RECOGNITION",
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
      recognitionList: [],
      overlayVisible: false,
      commentsText: "",
      commentForId: "",
      dlOverlayVisible: false,
      certImage: "",
      senderEmail: "",
      editableEmail: true,
      submitEmail: false,
      awardNominationId: 0,
    };

    this.setValueForEmail();
    _this = this;
  }

  setValueForEmail() {
    AsyncStorage.getItem("AS_EMP")
      .then((value) => {
        var empObj = JSON.parse(value);
        let empEmail = empObj.Emailid;
        if (empEmail == null || empEmail.length == 0) {
          this.setState({ editableEmail: true });
        } else {
          this.setState({
            senderEmail: empEmail,
            editableEmail: false,
            submitEmail: true,
          });
        }
      })
      .done();
  }

  onViewWillFocus() {
    AsyncStorage.getItem("AS_TOKEN")
      .then((value) => {
        _token = value.toString();
        _this.apiRecognitionList();
      })
      .done();
  }

  apiRecognitionList = () => {
    this.setState({ pageLoading: true });
    var query = "?" + "token=" + _token + "&awardType=";
    var url = Konstants.API_ROOT_URL + "/Nomination/My_Recognition" + query;
    console.log(url);

    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ pageLoading: false });
        if (responseJson == "Invalid Token") {
          Alert.alert(
            "Alert",
            Konstants.MSG_SESSION_OUT,
            [{ text: "OK", onPress: () => _this.logOutUser() }],
            { cancelable: false }
          );
        } else {
          var tempObj = responseJson[0];
          if (tempObj !== undefined) {
            this.setState({
              recognitionList: tempObj.ListCommonRewardRecognitionView,
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
        // console.log("problem: " + error.message);
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

  updateTextArea = (text) => {
    this.setState({ commentsText: text });
  };

  _submitComments() {
    if (this.state.commentsText != "") {
      this.setState({ pageLoading: true });

      var query =
        "?" +
        "token=" +
        _token +
        "&AwardNominationId=" +
        this.state.commentForId +
        "&CommentTxt=" +
        this.state.commentsText +
        "&AwardCategory=&CommonSettingStatusId=";
      var url = Konstants.API_ROOT_URL + "/Nomination/InsertComments" + query;

      // console.log(url);

      fetch(url)
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({ pageLoading: false });
          if (Array.isArray(responseJson) && responseJson.length) {
            this.setState({ overlayVisible: false });
            Alert.alert("Success", Konstants.MSG_COMMENT_SUCCESS);
          } else {
            Alert.alert("Failed", Konstants.MSG_COMMENT_ERROR);
          }
        })
        .catch((error) => {
          this.setState({ pageLoading: false });
          console.error(error);
        });
    } else {
      Alert.alert("Alert", Konstants.MSG_COMMENT_EMPTY);
    }
  }

  _closeComments() {
    this.setState({ overlayVisible: false });
  }

  _closePop() {
    this.setState(
      {
        dlOverlayVisible: false,
      },
      () => {
        _this.setValueForEmail();
      }
    );
  }

  _sendCertificate() {
    //call api
    this.setState({ pageLoading: true });
    var query =
      "?" +
      "token=" +
      _token +
      "&AwardNominationId=" +
      this.state.awardNominationId +
      "&emailId=" +
      this.state.senderEmail;
    var url = Konstants.API_ROOT_URL + "/Nomination/SendCertificate" + query;

    console.log(url);

    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState(
          { pageLoading: false, dlOverlayVisible: false, certImage: "" },
          () => {
            Alert.alert(Konstants.MSG_CERTIFICATE_SENT);
            this.setValueForEmail();
          }
        );
      })
      .catch((error) => {
        this.setState({ pageLoading: false });
        console.error(error);
      });
  }

  _DownloadPress = (obj) => {
    //call api to get cer image
    this.setState({ pageLoading: true });
    this.setState({ awardNominationId: obj.AwardNominationId });

    var query =
      "?" + "token=" + _token + "&AwardNominationId=" + obj.AwardNominationId;
    var url =
      Konstants.API_ROOT_URL + "/Nomination/GetCertificateImage" + query;

    console.log(url);

    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ pageLoading: false });
        if (responseJson == "Invalid Token") {
          Alert.alert(
            "Alert",
            Konstants.MSG_SESSION_OUT,
            [{ text: "OK", onPress: () => _this.logOutUser() }],
            { cancelable: false }
          );
        } else {
          if (Array.isArray(responseJson) && responseJson.length) {
            this.setState({ overlayVisible: false });
            this.setState({
              editableEmail:
                responseJson[0].IsNonEmployee == "1" ? true : false,
            });
            // debugger;
            let src = responseJson[0].URL;
            if (src == null || !src.length) {
              this.setState({ certImage: "" });
              Alert.alert("Alert", Konstants.MSG_NO_CERTIFICATE);
            } else {
              if (src.startsWith("http")) {
                this.setState({ certImage: src }, () => {
                  this.setState({ dlOverlayVisible: true });
                });
              } else {
                this.setState({ certImage: "" });
                Alert.alert("Alert", Konstants.MSG_NO_CERTIFICATE);
              }
            }
          } else {
            this.setState({ certImage: "" });
            Alert.alert("Alert", Konstants.MSG_NO_CERTIFICATE);
          }
        }
      })
      .catch((error) => {
        this.setState({ pageLoading: false });
        console.error(error);
      });
  };

  _likePress = (obj) => {
    this.props.navigation.navigate("RecognitionDetails", {
      paramAwardInfo: obj,
      paramToken: _token,
      paramTabIndex: 0,
    });
  };

  _commentPress = (obj) => {
    this.props.navigation.navigate("RecognitionDetails", {
      paramAwardInfo: obj,
      paramToken: _token,
      paramTabIndex: 1,
    });
  };

  updateEmail = (text) => {
    this.setState({ senderEmail: text });
    if (this.state.editableEmail) {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(text) === false) {
        this.setState({ submitEmail: false });
      } else {
        this.setState({ submitEmail: true });
      }
    } else {
      this.setState({ submitEmail: true });
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

        <ScrollView style={{ marginBottom: 20 }}>
          {this.state.recognitionList.length == 0 && (
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
                {Konstants.MSG_NO_RECOGNITIONS}
              </Text>
            </View>
          )}

          <View>
            {this.state.recognitionList.map((u, i) => {
              return (
                <View key={i} style={styles.listStyle}>
                  <RGCard
                    listId={i}
                    image={{ uri: u.AwardIndividualIconFileName }}
                    title={u.AwardName}
                    recipient={u.Recipient}
                    nominator={u.Nominator}
                    AwardName={u.AwardName}
                    CriteriaDescription={u.CriteriaDescription}
                    citation={u.NominationCitation}
                    nm_date={u.NominatorDate}
                    teamNames={teamNames}
                    likes={u.NominationLikes}
                    comments={u.CommentsCount}
                    detailPage={false}
                    liked={false}
                    isClose={true}
                    onCommentPress={() => {
                      this._commentPress(u);
                    }}
                    onLikePress={() => {
                      this._likePress(u);
                    }}
                    onDownloadPress={() => {
                      this._DownloadPress(u);
                    }}
                  />
                </View>
              );
            })}
          </View>
        </ScrollView>

        <Overlay
          isVisible={this.state.overlayVisible}
          windowBackgroundColor="#555"
          overlayBackgroundColor="#fff"
          borderRadius={15}
          fullScreen={true}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <View style={styles.container}>
                <Textarea
                  containerStyle={styles.textareaContainer}
                  style={styles.textarea}
                  onChangeText={this.updateTextArea}
                  defaultValue={this.state.commentsText}
                  maxLength={160}
                  placeholder={"Enter comments here"}
                  placeholderTextColor={"#c7c7c7"}
                  underlineColorAndroid={"transparent"}
                />
              </View>

              <View style={styles.butContainer}>
                <View style={styles.butItem}>
                  <Button
                    title="Close"
                    onPress={() => {
                      this._closeComments();
                    }}
                    buttonStyle={{
                      height: 50,
                      borderRadius: 6,
                      marginTop: 20,
                      marginBottom: 20,
                      paddingHorizontal: 20,
                      width: "82%",
                      alignSelf: "center",
                      backgroundColor: "#999",
                    }}
                  />
                </View>
                <View style={styles.butItem}>
                  <Button
                    title="Submit"
                    onPress={() => {
                      this._submitComments();
                    }}
                    buttonStyle={{
                      height: 50,
                      borderRadius: 6,
                      marginTop: 20,
                      marginBottom: 20,
                      paddingHorizontal: 20,
                      width: "82%",
                      alignSelf: "center",
                      backgroundColor: "#19537e",
                    }}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Overlay>

        <Overlay
          isVisible={this.state.dlOverlayVisible}
          windowBackgroundColor="#555"
          overlayBackgroundColor="#fff"
          borderRadius={15}
          fullScreen={true}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <View style={styles.prvhead}>
                <View>
                  <Text style={styles.txtfont}>
                    Certificate will be sent to this email:
                  </Text>
                  <Input
                    placeholder="your email address"
                    autoCorrect={false}
                    value={this.state.senderEmail}
                    editable={this.state.editableEmail}
                    keyboardType="email-address"
                    underlineColorAndroid="transparent"
                    onChangeText={this.updateEmail}
                  />
                </View>

                <View style={styles.butContainer}>
                  <View style={styles.butItem}>
                    <Button
                      title="Cancel"
                      onPress={() => {
                        this._closePop();
                      }}
                      buttonStyle={{
                        height: 50,
                        borderRadius: 6,
                        marginTop: 20,
                        paddingHorizontal: 20,
                        width: "82%",
                        alignSelf: "center",
                        backgroundColor: "#999",
                      }}
                    />
                  </View>
                  <View style={styles.butItem}>
                    {this.state.submitEmail && (
                      <Button
                        title="Send"
                        onPress={() => {
                          this._sendCertificate();
                        }}
                        buttonStyle={{
                          height: 50,
                          borderRadius: 6,
                          marginTop: 20,
                          paddingHorizontal: 20,
                          width: "82%",
                          alignSelf: "center",
                          backgroundColor: "#19537e",
                        }}
                      />
                    )}
                    {!this.state.submitEmail && (
                      <Button
                        title="Send"
                        buttonStyle={{
                          height: 50,
                          borderRadius: 6,
                          marginTop: 20,
                          paddingHorizontal: 20,
                          width: "82%",
                          alignSelf: "center",
                          backgroundColor: "#ccc",
                        }}
                      />
                    )}
                  </View>
                </View>
              </View>

              <View style={{ marginTop: 50 }}>
                <Text style={styles.txtfont}>Preview:</Text>
                <View style={styles.prvStyle}>
                  {this.state.certImage == "" && (
                    <Text style={{ marginTop: 50 }}>
                      Certificate preview not available
                    </Text>
                  )}
                  <Image
                    style={styles.prvImg}
                    source={{ uri: this.state.certImage }}
                    resizeMethod="resize"
                    resizeMode="contain"
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
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

  ctText: {
    fontFamily: "HelveticaNeue",
    fontSize: 20,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    color: "#3e4a59",
  },
  container: {
    marginTop: 80,
  },

  textareaContainer: {
    padding: 3,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
  },

  textarea: {
    textAlignVertical: "top", // hack android
    fontSize: 16,
    color: "#333",
    height: 150,
  },
  butContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 10,
  },
  butItem: {
    width: "50%",
    padding: 6,
  },
  prvStyle: {
    alignItems: "center",
    shadowColor: "#111",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 17,
  },
  prvImg: {
    width: screenWidth * 0.95,
    height: screenHeight * 0.45,
    // marginTop: -20,
  },
  prvhead: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 20,
    marginTop: 50,
  },
  txtfont: {
    fontSize: 16,
    color: "#333",
  },
});
