import React, { Fragment } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

import AsyncStorage from "@react-native-community/async-storage";

import { NavigationEvents } from "react-navigation";
import { Text, Button, Overlay } from "react-native-elements";
import AwallCard from "../../components/AwallCard/AwallCard";
import MenuBack from "../../components/MenuImage/MenuBack";
import MenuImageRight from "../../components/MenuImage/MenuImageRight";
import * as Konstants from "../../constants/constants";
import Textarea from "react-native-textarea";
import {
  Spinner,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Tab,
  Tabs,
} from "native-base";

var _this;
var _token = "";
var awardInfo;
var _tabIndex = 0;
var teamNames = "";

export default class RecognitionDetails extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "MY RECOGNITION",
    headerLeft: (
      <MenuBack
        onPress={() => {
          //navigation.openDrawer();
          navigation.navigate("RecognitionHome");
        }}
      />
    ),
    swipeEnabled: false,

  });

  constructor(props) {
    super(props);
    this.state = {
      pageLoading: false,
      resetSearchKey: false,
      awardWallList: [],
      overlayVisible: false,
      commentForId: "",
      commentsText: "",
      loadingSpinner: false,
      likesList: [],
      commentsList: [],
      exFlag: false,
    };

    _this = this;

    _tabIndex = this.props.navigation.state.params.paramTabIndex;
    awardInfo = this.props.navigation.state.params.paramAwardInfo;
    _token = this.props.navigation.state.params.paramToken;

    const regex = /(<([^>]+)>)/gi;
    teamNames =
      awardInfo.NamesListInTeam == null
        ? ""
        : awardInfo.NamesListInTeam.replace(regex, ", ");
  }

  componentDidMount() {
    this.apiGetLikesNComments();
  }

  updateTextArea = (text) => {
    this.setState({ commentsText: text });
  };

  _submitComments() {
    if (this.state.commentsText != "") {
      this.setState({ pageLoading: true });

      let comments = encodeURIComponent(this.state.commentsText);

      var query =
        "?" +
        "token=" +
        _token +
        "&AwardNominationId=" +
        this.state.commentForId +
        "&CommentTxt=" +
        comments +
        "&AwardCategory=&CommonSettingStatusId=";
      var url = Konstants.API_ROOT_URL + "/Nomination/InsertComments" + query;

      // console.log(url);

      fetch(url)
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({ pageLoading: false });
          if (Array.isArray(responseJson) && responseJson.length) {
            this.setState({ overlayVisible: false }, () => {
              this.apiGetLikesNComments();
            });
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

  _likePress = (nid) => {
    this.setState({ pageLoading: true });

    var query =
      "?" +
      "token=" +
      _token +
      "&awardType=" +
      "&NominationId=" +
      nid +
      "&tabid=1";
    var url =
      Konstants.API_ROOT_URL + "/Nomination/Award_Wall_Likes_Popup" + query;

    // console.log(url);

    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ pageLoading: false });
        if (Array.isArray(responseJson) && responseJson.length) {
          this.setState({ overlayVisible: false }, () => {
            this.apiGetLikesNComments();
          });
        } else {
          Alert.alert("Failed", Konstants.MSG_LIKE_ERROR);
        }
      })
      .catch((error) => {
        this.setState({ pageLoading: false });
        console.error(error);
      });
  };

  tabChanged = (obj) => {
    this.apiGetLikesNComments();
  };

  apiGetLikesNComments() {
    this.setState({ loadingSpinner: true });

    var query =
      "?" +
      "token=" +
      _token +
      "&awardType=" +
      "&NominationId=" +
      awardInfo.AwardNominationId +
      "&tabid=2";
    var url =
      Konstants.API_ROOT_URL + "/Nomination/Award_Wall_Likes_Popup" + query;

    // console.log(url);

    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ loadingSpinner: false });
        var tempObj = responseJson[0];
        var tmpLikesArr = tempObj.LikeTabDetail;
        this.setState({
          likesList: tempObj.LikeTabDetail,
          commentsList: tempObj.CommentsContentDetail,
        });

        AsyncStorage.getItem("AS_EMP")
          .then((value) => {
            var empObj = JSON.parse(value);
            var name = empObj.EmployeeName.trim();

            tmpLikesArr.forEach(function(obj) {
              if (obj.LikesEmployeeName.trim() == name) {
                _this.setState({ exFlag: true });
              }
            });
          })
          .done();
      })
      .catch((error) => {
        this.setState({ pageLoading: false });
        console.error(error);
      });
  }

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
        <View style={styles.listStyle}>
          <AwallCard
            listId="1"
            leftImage={{ uri: awardInfo.ReciepientImagePath }}
            rightImage={{ uri: awardInfo.AwardIndividualIconFileName }}
            title={awardInfo.AwardName}
            recipient={awardInfo.Recipient}
            nominator={awardInfo.Nominator}
            award={awardInfo.AwardName}
            CriteriaDescription={awardInfo.CriteriaDescription}
            citation={awardInfo.NominationCitation}
            nm_date={awardInfo.NominatorDate}
            teamNames={teamNames}
            likes="none"
            comments="Comment"
            detailPage={true}
            liked={this.state.exFlag}
            onCommentPress={() => {
              this.setState({
                overlayVisible: true,
                commentForId: awardInfo.AwardNominationId,
              });
            }}
            onLikePress={() => {
              // if(!this.state.exFlag) {
              //  this._likePress(awardInfo.AwardNominationId);
              // }
            }}
          />
        </View>

        <Tabs
          locked={true}
          tabContainerStyle={{ height: 50 }}
          tabBarUnderlineStyle={{
            backgroundColor: "#f4f4f4",
            height: Platform.OS === "ios" ? 1 : 3,
          }}
          initialPage={_tabIndex}
          onChangeTab={this.tabChanged}
        >
          <Tab heading={this.state.likesList.length + " Likes"}>
            <Content>
              {this.state.loadingSpinner && <Spinner color="#19537e" />}

              {this.state.likesList.length == 0 && (
                <View style={{ alignSelf: "center", padding: 20 }}>
                  <Text>No likes yet</Text>
                </View>
              )}

              <List>
                {this.state.likesList.map((u, i) => {
                  return (
                    <ListItem key={i} avatar>
                      <Left>
                        <Thumbnail source={{ uri: u.LikesEmployeeImagePath }} />
                      </Left>
                      <Body>
                        <Text>{u.LikesEmployeeName}</Text>
                      </Body>
                    </ListItem>
                  );
                })}
              </List>
            </Content>
          </Tab>

          <Tab heading={this.state.commentsList.length + " Comments"}>
            <Content>
              {this.state.loadingSpinner && <Spinner color="#19537e" />}

              {this.state.commentsList.length == 0 && (
                <View style={{ alignSelf: "center", padding: 20 }}>
                  <Text>No comments yet</Text>
                </View>
              )}

              <List>
                {this.state.commentsList.map((u, i) => {
                  var cmdt = u.CommentDate.slice(0, -9);
                  return (
                    <ListItem
                      key={i}
                      avatar
                      noBorder
                      style={{
                        borderBottomColor: "#f4f4f4",
                        borderBottomWidth: 1,
                      }}
                    >
                      <Left>
                        <Thumbnail
                          source={{ uri: u.CommentEmployeeImagePath }}
                        />
                      </Left>
                      <Body>
                        <Text>{u.CommentEmployeeName}</Text>
                        <Text note style={{ color: "#8a8a84" }}>
                          {u.Comment}
                        </Text>
                      </Body>
                      <Right>
                        <Text note style={{ color: "#8a8a84", paddingTop: 5 }}>
                          {cmdt}
                        </Text>
                      </Right>
                    </ListItem>
                  );
                })}
              </List>
            </Content>
          </Tab>
        </Tabs>

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
    height:150,
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
  
});
