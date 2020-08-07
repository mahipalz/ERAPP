import React, { Fragment } from "react";
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { Button } from "react-native-elements";
import Textarea from "react-native-textarea";
import MenuBack from "../../components/MenuImage/MenuBack";
import MenuImageRight from "../../components/MenuImage/MenuImageRight";
import * as Konstants from "../../constants/constants";

var _this;

export default class CitationScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "NOMINATE AWARD",
    headerLeft: (
      <MenuBack
        onPress={() => {
          navigation.navigate("AwardCriteria");
        }}
      />
    ),
   
  });

  constructor(props) {
    super(props);
    this.state = {
      pageLoading: false,
      crId: "",
      empId: "",
      awardId: "",
      citationText: "",
      commentText: "",
      ctObj: {},
    };
    _this = this;

    this.state.ctObj = this.props.navigation.state.params.data;
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
    //console.log('Keyboard Shown');
  }

  _keyboardDidHide() {
    // _this.setState({showCard: true})
    //console.log('Keyboard Hidden');
  }

  updateTextArea = (text) => {
    this.setState({ citationText: text });
  };

  _submitCitation() {
    let ctFlag = this.state.ctObj.IsCitationTextFlag;
    AsyncStorage.setItem("CITATION_FLAG", ctFlag.toString());

    if (ctFlag && this.state.citationText.trim() == "") {
      Alert.alert("Alert", Konstants.MSG_CITATION_EMPTY);
    } else {
      AsyncStorage.setItem("AS_SELECTED_CITATION", this.state.citationText);

      AsyncStorage.getItem("AS_EMP")
        .then((value) => {
          var empObject = JSON.parse(value);
          this.props.navigation.navigate("CommunicationScreen", {
            paramEmp: empObject,
          });
        })
        .done();
    }
  }

  render() {
    console.disableYellowBox = true;

    const { ctObj } = this.state;
    let ctLength =
      ctObj.CitationSize.toString() == "0" || ctObj.CitationSize == ""
        ? 200
        : ctObj.CitationSize;

    if (this.state.pageLoading) {
      return (
        <View style={[styles.loadingContainer, styles.horizontal]}>
          <ActivityIndicator size="large" color="#19537e" />
        </View>
      );
    }

    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.body}>
            <View style={styles.centerView}>
              <Text style={styles.ctText}>Citation</Text>
            </View>
            <View style={styles.container}>
              <Textarea
                containerStyle={styles.textareaContainer}
                style={styles.textarea}
                onChangeText={this.updateTextArea}
                defaultValue={this.state.citationText}
                maxLength={ctLength}
                placeholder={"Enter text here"}
                placeholderTextColor={"#c7c7c7"}
                underlineColorAndroid={"transparent"}
                autoFocus={true}
              />
            </View>

            <View style={{ marginTop: 50 }}>
              <Button
                title="Proceed"
                onPress={() => {
                  this._submitCitation();
                }}
                buttonStyle={{
                  height: 50,
                  borderRadius: 6,
                  paddingHorizontal: 25,
                  width: "80%",
                  alignSelf: "center",
                  backgroundColor: "#19537e",
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Fragment>
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
    height: "100%",
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
    height: 150,
  },
});
