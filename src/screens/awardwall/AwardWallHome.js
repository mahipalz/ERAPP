import React, { Fragment } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
  FlatList,
  TextInput,
} from "react-native";

import {
  Container,
  Header,
  Tab,
  Tabs,
  ScrollableTab,
  Input,
  Icon,
} from "native-base";

import AsyncStorage from "@react-native-community/async-storage";

import { NavigationEvents } from "react-navigation";
import { Button, Overlay, SearchBar } from "react-native-elements";
import AwallCard from "../../components/AwallCard/AwallCard";
import MenuImage from "../../components/MenuImage/MenuImage";
import * as Konstants from "../../constants/constants";
import Textarea from "react-native-textarea";

var _this;
var _token = "";
var teamNames = "";

export default class AwardWallHome extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "AWARD WALL",
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
      tabLoading: false,
      moreLoading: false,
      commentsLoading: false,
      resetSearchKey: false,
      awardWallList: [],
      awardTabList: [],
      overlayVisible: false,
      commentsText: "",
      commentForId: "",
      awardNominationId: "",
      awardWallConfigId: "",
      pageNumber: 0,
      isRefreshing: false,
      hasScrolled: false,
      searchKeyword: "",
      emptyResult: true,
    };

    _this = this;
  }

  // componentDidMount() {
  //   AsyncStorage.getItem("AS_TOKEN")
  //     .then((value) => {
  //       _token = value.toString();
  //       _this.apiGetAwardWall();
  //     })
  //     .done();
  // }

  componentDidMount() {
    AsyncStorage.getItem("AS_TOKEN")
      .then((value) => {
        _token = value.toString();
        _this.apiGetAwardWall();
      })
      .done();
  }

  apiGetAwardWall = () => {
    if (
      !this.state.tabLoading &&
      !this.state.isRefreshing &&
      !this.state.moreLoading
    ) {
      _this.setState({ pageLoading: true, emptyResult: false });
    }

    var query =
      "?" +
      "token=" +
      _token +
      "&awardType=" +
      "&AwardWallConfigId=" +
      this.state.awardWallConfigId +
      "&AwardNominationId=" +
      this.state.awardNominationId +
      "&pageNumber=" +
      this.state.pageNumber +
      "&PageSize=" +
      "&RecipientName=" +
      this.state.searchKeyword;

    var url = Konstants.API_ROOT_URL + "/Nomination/Award_Wall_Mobile" + query;

    console.log(url);

    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          pageLoading: false,
          tabLoading: false,
          moreLoading: false,
        });
        if (responseJson == "Invalid Token") {
          Alert.alert(
            "Alert",
            Konstants.MSG_SESSION_OUT,
            [{ text: "OK", onPress: () => _this.logOutUser() }],
            { cancelable: false }
          );
        } else {
          var tempObj = responseJson[0];
          var resArr = tempObj.ListCommonRewardRecognitionView;
          if (!resArr.length) {
            _this.setState({ emptyResult: true });
          } else {
            _this.setState({ emptyResult: false });
          }

          if (tempObj !== undefined) {
            _this.setState({
              awardNominationId: tempObj.AwardNominationId,
              awardWallList:
                this.state.pageNumber === 0
                  ? resArr
                  : [...this.state.awardWallList, ...resArr],
              awardTabList: tempObj.awardWallTab,
              awardWallConfigId: tempObj.AwardWallConfigId,
              isRefreshing: false,
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

      console.log(url);

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
      Alert.alert("Alert", MSG_COMMENT_EMPTY);
    }
  }

  _closeComments() {
    this.setState({ overlayVisible: false });
  }

  _likePress = (obj) => {
    this.props.navigation.navigate("AwardDetails", {
      paramAwardInfo: obj,
      paramToken: _token,
      paramTabIndex: 0,
    });
  };

  _commentPress = (obj) => {
    this.props.navigation.navigate("AwardDetails", {
      paramAwardInfo: obj,
      paramToken: _token,
      paramTabIndex: 1,
    });
  };

  _likePressOLD = (nid) => {
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
          this.setState({ overlayVisible: false });
          Alert.alert("Success", Konstants.MSG_LIKE_SUCCESS);
        } else {
          Alert.alert("Failed", Konstants.MSG_LIKE_ERROR);
        }
      })
      .catch((error) => {
        this.setState({ pageLoading: false });
        console.error(error);
      });
  };

  _cardPress = (obj) => {
    this.props.navigation.navigate("AwardDetails", {
      paramAwardInfo: obj,
      paramToken: _token,
    });
  };

  awardTabChanged(ind) {
    let tmpObj = this.state.awardTabList[ind];
    this.setState(
      {
        awardWallList: [],
        emptyResult:false,
        awardWallConfigId: tmpObj.AwardWallConfigId,
        awardNominationId: "",
        pageNumber: 0,
        tabLoading: true,
        searchKeyword: "",
      },
      () => {
        _this.apiGetAwardWall();
      }
    );
  }

  handleRefresh = () => { 
    this.setState(
      {
        pageNumber: 0,
        awardNominationId: "",
        isRefreshing: true,
        emptyResult:false,

      },
      () => {
        this.apiGetAwardWall();
      }
    );
  };

  handleLoadMore = () => {
    if (this.state.emptyResult) {
      return false;
    }
    this.setState(
      {
        tabLoading: false,
        moreLoading: true,
        pageNumber: this.state.pageNumber + 1,
      },
      () => {
        this.apiGetAwardWall();
      }
    );
  };

  searchAwards() {
    Keyboard.dismiss();
    this.setState(
      {
        awardWallList: [],
        emptyResult:false,
        pageNumber: 0,
        awardNominationId: "",
        tabLoading: true,
      },
      () => {
        this.apiGetAwardWall();
      }
    );
  }

  updateSearch = (search) => {
    this.setState({ searchKeyword: search });
  };

  clearSearch(){
    this.setState({ searchKeyword: '' }, () => {
       this.searchAwards();
    });

  }

  renderRow = (dataObj) => {
    return (
      <AwallCard
        listId={dataObj.AwardNominationId}
        leftImage={{ uri: dataObj.ReciepientImagePath }}
        rightImage={{ uri: dataObj.AwardIndividualIconFileName }}
        title={dataObj.AwardName}
        recipient={dataObj.Recipient}
        nominator={dataObj.Nominator}
        award={dataObj.AwardName}
        CriteriaDescription={
          dataObj.CriteriaDescription == null ? "" : dataObj.CriteriaDescription
        }
        citation={
          dataObj.NominationCitation == null ? "" : dataObj.NominationCitation
        }
        nm_date={dataObj.NominatorDate}
        teamNames=""
        likes={dataObj.NominationLikes}
        comments={dataObj.CommentsCount}
        detailPage={false}
        liked={false}
        onPress={() => {
          this._cardPress(dataObj);
        }}
        onCommentPress={() => {
          this._commentPress(dataObj);
        }}
        onLikePress={() => {
          this._likePress(dataObj);
        }}
      />
    );
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

        <Container style={{ marginTop: -50, flex: 1 }}>
          <Header hasTabs />
          <Tabs
            renderTabBar={() => <ScrollableTab />}
            locked={true}
            tabBarUnderlineStyle={{
              height: 3,
            }}
            onChangeTab={({ i }) => this.awardTabChanged(i)}
          >
            {this.state.awardTabList.map((u, i) => {
              return (
                <Tab key={i} heading={u.AwardWallDisplayName}>
                  {u.AwardWallConfigId == this.state.awardWallConfigId && (
                    <View>
                      <View>
                        <View style={styles.searchView}>
                          <Input
                            style={styles.searchInput}
                            placeholder="Enter recipient name"
                            placeholderTextColor="#ccc"
                            autoCapitalize="none"
                            onChangeText={this.updateSearch}
                            value={this.state.searchKeyword}
                          />
                          <View>
                            <Button
                              disabled={this.state.searchKeyword.length < 3 ? true : false}
                              title="Filter"
                              buttonStyle={styles.searchButton}
                              onPress={() => {
                                this.searchAwards();
                              }}
                            />
                          </View>
                          {(this.state.searchKeyword.length >0) && (
                          <View>
                          <Button
                              title="Clear"
                              buttonStyle={styles.clearButton}
                              onPress={() => {
                                this.clearSearch();
                              }}
                            />
                          </View>
                          )}
                        </View>

                        {this.state.tabLoading && (
                          <View style={styles.tabSpinner}>
                            <ActivityIndicator size="large" color="#19537e" />
                          </View>
                        )}

                        <FlatList
                          style={styles.listStyle}
                          data={this.state.awardWallList}
                          renderItem={({ item }) => this.renderRow(item)}
                          keyExtractor={(item) =>
                            item.AwardNominationId.toString()
                          }
                          onRefresh={() => this.handleRefresh()}
                          refreshing={this.state.isRefreshing}
                          onEndReached={() => this.handleLoadMore()}
                          onEndReachedThreshold={0.5}
                        />
                      </View>
                    </View>
                  )}

                  {u.AwardWallConfigId != this.state.awardWallConfigId && (
                    <View>
                      <Text />
                    </View>
                  )}

                  {this.state.emptyResult && (
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
                        {Konstants.MSG_NO_AWARD_WALL}
                      </Text>
                    </View>
                  )}
                </Tab>
              );
            })}
          </Tabs>
        </Container>

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
        {this.state.moreLoading && (
          <View style={styles.spinner}>
            <ActivityIndicator size="large" color="#6000EC" />
          </View>
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
  noawView: {
    marginTop: 0,
    alignSelf: "center",
    borderColor: "#f2f2f2",
    borderWidth: 1,
    borderRadius: 10,
  },
  noawText: {
    fontSize: 18,
    padding: 10,
    color: "#DC143C",
    lineHeight: 28,
  },
  tabSpinner: {
    marginTop: 50,
  },
  spinner: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    textAlign: "center",
    marginBottom: 25,
  },

  listStyle: {
    ...Platform.select({
      ios: {
        marginBottom: 180,
      },
      android: {
        marginBottom: 160,
      },
    }),
  },

  searchView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 20,
  },
  searchInput: {
    borderColor: "#ccc", 
    borderWidth: 1,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    paddingLeft: 10,
    width: "100%",
    height: 45,
  },
  searchButton: {
    height: 44,
    borderTopRightRadius: 9,
    borderBottomRightRadius: 9,
    marginLeft: -70,
    paddingHorizontal: 8,
    width: 75,
  },
  clearButton: {
    height: 44,
    borderRadius: 9,
    marginLeft: 15,
    paddingHorizontal: 6,
    width: 60,
    backgroundColor:'#ED5B5B'
  },
});
