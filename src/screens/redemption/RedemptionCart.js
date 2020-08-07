import React, { Fragment } from "react";
import {
  Text,
  View,
  Alert,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Button as RNEButton, Card, ListItem } from "react-native-elements";
import { NavigationEvents } from "react-navigation";
import AsyncStorage from "@react-native-community/async-storage";
import MenuImageRight from "../../components/MenuImage/MenuImageRight";
import MenuBack from "../../components/MenuImage/MenuBack";
import * as Konstants from "../../constants/constants";
import Counter from "react-native-counters";
import Feather from "react-native-vector-icons/Feather";

const minusIcon = (isDisabled) => {
  return <Feather name="minus" size={20} color={"#333"} />;
};

const plusIcon = (isPlusDisabled) => {
  return <Feather name="plus" size={20} color={"#333"} />;
};

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

var _this = this;
var _token = "";
var cartItems = {};
var empName = "";
var empMobile = "";
var empEmail = "";
var empCountry = "";

export default class RedemptionCart extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "ORDER SUMMARY",
    headerLeft: (
      <MenuBack
        onPress={() => {
          navigation.navigate("RedemptionHome");
        }}
      />
    ),
    swipeEnabled: false,
  });

  constructor(props) {
    super(props);
    this.state = {
      pageLoading: false,
      itemsObject: {},
      itemsList: [],
      pointsTotal: 0,
      pointsUsed: 0,
      pointsAvailable: 0,
      productList: [],
    };
    _this = this;
  }

  componentDidMount() {
    AsyncStorage.getItem("AS_EMP").then((value) => {
      var empObj = JSON.parse(value);

      empName = empObj.EmployeeName;
      empMobile = empObj.MobileNumber;
      empEmail = empObj.Emailid;
      empCountry = empObj.CountryId;
    });

    AsyncStorage.getItem("AS_TOKEN")
      .then((value) => {
        _token = value.toString();
      })
      .done();

    AsyncStorage.getItem("AS_CART")
      .then((value) => {
        if (value != null) {
          cartItems = JSON.parse(value);
          var idz = Object.keys(cartItems);

          var tarr = [];
          idz.map((u, i) => {
            var tmp = {};
            tmp["prod_id"] = u;
            tmp["prod_name"] = cartItems[u]["data"]["ProductName"];
            tmp["prod_image"] = cartItems[u]["data"]["ProductImagePath"];
            tmp["prod_points"] = cartItems[u]["data"]["RewardCatalogPoints"];
            tmp["prod_catalog_id"] = cartItems[u]["data"]["CatalogId"];
            tmp["prod_qty"] = cartItems[u]["qty"];
            tarr.push(tmp);
          });

          _this.setState({
            productList: tarr,
          });
        }
      })
      .done();

    AsyncStorage.getItem("AS_POINTS")
      .then((value) => {
        var pts = JSON.parse(value);

        _this.setState({
          pointsTotal: pts.pointsTotal,
          pointsUsed: pts.pointsUsed,
          pointsAvailable: pts.pointsAvailable,
          prodCount: pts.prodCount,
        });
      })
      .done();
  }

  checkOut() {
    this.setState({ pageLoading: true });

    var query = "?" + "token=" + _token + "&ver=" + new Date().getTime();

    var url = Konstants.API_ROOT_URL + "/Login/GetNomination_Points" + query;

    // console.log(url);

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
          let ptsAv = responseJson.PointsAvailableForRedeem;
          if (ptsAv >= this.state.pointsUsed) {
            this.props.navigation.navigate("RedemptionAddress", {
              paramEmpName: empName,
              paramEmpMobile: empMobile,
              paramEmpEmail: empEmail,
              paramEmpCountry: empCountry,
            });
          } else {
            Alert.alert("Alert", Konstants.MSG_REDEEM_NO_POINTS);
          }
        }
      })
      .catch((error) => {
        console.error(error);
        this.setState({ pageLoading: false });
      });
  }

  logOutUser() {
    this._clearAll()
      .then(function() {
        console.log("Logout successful");
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

  deleteFromCart = (obj) => {
    Alert.alert(
      "Delete",
      Konstants.MSG_REDEEM_DELETE_CART,
      [
        {
          text: "NO",
          onPress: () => console.log("NO Pressed"),
          style: "cancel",
        },
        { text: "YES", onPress: () => this._apiDeleteFromCart(obj) },
      ],
      { cancelable: false }
    );
  };

  _apiDeleteFromCart = (obj) => {
    var ptsObject = {};
    var total_points = parseInt(this.state.pointsTotal);
    var used_points =
      parseInt(this.state.pointsUsed) -
      parseInt(obj.prod_points) * parseInt(obj.prod_qty);
    ptsObject["pointsTotal"] = total_points;
    ptsObject["pointsUsed"] = used_points;
    ptsObject["pointsAvailable"] = total_points - used_points;
    ptsObject["prodCount"] = parseInt(this.state.prodCount) - 1;

    AsyncStorage.setItem("AS_POINTS", JSON.stringify(ptsObject), () => {
      this.updatePoints();
    });

    //delete product from list
    let newArray = [...this.state.productList];
    var removeIndex = newArray
      .map(function(item) {
        return item.prod_id;
      })
      .indexOf(obj.prod_id);
    newArray.splice(removeIndex, 1);

    this.setState({ productList: newArray });

    //delete prod in database - call api

    var query =
      "?" +
      "token=" +
      _token +
      "&Type=DELETE" +
      "&ProductDetailId=" +
      obj.prod_id +
      "&Points=" +
      obj.prod_points +
      "&CatalogId=" +
      obj.prod_catalog_id +
      "&Quantity=" +
      obj.prod_qty;

    var url = Konstants.API_ROOT_URL + "/Order/InsertupdateOrder" + query;

    // console.log(url);

    this.setState({ pageLoading: true });

    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        var isVcr = responseJson.IsInstaVoucher;
        AsyncStorage.setItem("AS_INSTA_VOUCHER", isVcr.toString());

        //update productids session
        AsyncStorage.getItem("AS_PRODUCT_IDS")
          .then((value) => {
            if (value != null) {
              var idsArr = JSON.parse(value);

              const index = idsArr.indexOf(parseInt(obj.prod_id));
              if (index > -1) {
                idsArr.splice(index, 1);
              }
              AsyncStorage.setItem("AS_PRODUCT_IDS", JSON.stringify(idsArr));
            }
          })
          .done();

        AsyncStorage.getItem("AS_CART")
          .then((value) => {
            this.setState({ pageLoading: false });

            if (value != null) {
              var sessCart = JSON.parse(value);
              delete sessCart[obj.prod_id];
              AsyncStorage.setItem("AS_CART", JSON.stringify(sessCart));
            }
          })
          .done();
      })
      .catch((error) => {
        this.setState({ pageLoading: false });
        console.error(error);
      });
  };

  updatePoints = () => {
    AsyncStorage.getItem("AS_POINTS")
      .then((value) => {
        if (value != null) {
          var pointsObj = JSON.parse(value);

          this.setState({
            pointsTotal: pointsObj.pointsTotal,
            pointsUsed: pointsObj.pointsUsed,
            pointsAvailable: pointsObj.pointsAvailable,
            prodCount: pointsObj.prodCount,
          });
        }
      })
      .done();
  };

  changeProductQuantity = (qty, ty, obj) => {
    if (
      parseInt(obj.prod_points) > parseInt(this.state.pointsAvailable) &&
      parseInt(qty) > parseInt(obj.prod_qty)
    ) {
      Alert.alert("Alert", Konstants.MSG_REDEEM_NO_POINTS);
    } else {
      //update points
      let p1 = 0;
      if (parseInt(qty) > parseInt(obj.prod_qty)) {
        p1 = parseInt(this.state.pointsUsed) + parseInt(obj.prod_points);
      } else {
        p1 = parseInt(this.state.pointsUsed) - parseInt(obj.prod_points);
      }

      let p2 = parseInt(this.state.pointsTotal);

      var ptsObject = {};
      ptsObject["pointsTotal"] = p2;
      ptsObject["pointsUsed"] = p1;
      ptsObject["pointsAvailable"] = p2 - p1;
      ptsObject["prodCount"] = this.state.prodCount;

      AsyncStorage.setItem("AS_POINTS", JSON.stringify(ptsObject), () => {
        this.updatePoints();
      });

      let newProdArray = [...this.state.productList];
      newProdArray.forEach(function(itemObj) {
        if (obj.prod_id == itemObj.prod_id) {
          obj.prod_qty = qty;
        }
      });

      this.setState({ productList: newProdArray });

      //UPDATE prod in database - call api

      var query =
        "?" +
        "token=" +
        _token +
        "&Type=UPDATE" +
        "&ProductDetailId=" +
        obj.prod_id +
        "&Points=" +
        obj.prod_points +
        "&CatalogId=" +
        obj.prod_catalog_id +
        "&Quantity=" +
        qty;

      var url = Konstants.API_ROOT_URL + "/Order/InsertupdateOrder" + query;

      // console.log(url);

      this.setState({ pageLoading: true });

      fetch(url)
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({ pageLoading: false });

          var isVcr = responseJson.IsInstaVoucher;
          AsyncStorage.setItem("AS_INSTA_VOUCHER", isVcr.toString());

          //Save to cart
          AsyncStorage.getItem("AS_CART")
            .then((value) => {
              if (value != null) {
                var cart = JSON.parse(value);
                var pid = obj.prod_id;
                if (pid in cart) {
                  //var c = k[pid]['qty'];
                  cart[pid]["qty"] = qty;
                  AsyncStorage.setItem("AS_CART", JSON.stringify(cart));
                }
              }
            })
            .done();
        })
        .catch((error) => {
          this.setState({ pageLoading: false });
          console.error(error);
        });
    }
  };

  render() {
    console.disableYellowBox = true;

    const {
      cartItems,
      productList,
      pointsTotal,
      pointsUsed,
      pointsAvailable,
    } = this.state;

    if (this.state.pageLoading) {
      return (
        <View style={[styles.loadingContainer, styles.horizontal]}>
          <ActivityIndicator size="large" color="#19537e" />
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              margin: 10,
              marginBottom: 10,
            }}
          >
            <View style={styles.pview}>
              <Text style={styles.ptext}>Total</Text>
              <Text style={[styles.ptext, styles.ptext_2]}>Points</Text>
              <Text style={[styles.ptext, styles.ptext_3]}>{pointsTotal}</Text>
            </View>
            <View style={styles.pview}>
              <Text style={styles.ptext}>Points</Text>
              <Text style={[styles.ptext, styles.ptext_2]}>Used</Text>
              <Text style={[styles.ptext, styles.ptext_3]}>{pointsUsed}</Text>
            </View>
            <View style={styles.pview}>
              <Text style={styles.ptext}>Points</Text>
              <Text style={[styles.ptext, styles.ptext_2]}>Remaining</Text>
              <Text style={[styles.ptext, styles.ptext_3]}>
                {pointsAvailable}
              </Text>
            </View>
          </View>

          <View>
            {this.state.productList.length == 0 && (
              <View style={{ alignSelf: "center", padding: 20 }}>
                <Text>Your cart is empty</Text>
              </View>
            )}

            {productList.map((u, i) => {
              return (
                <Card containerStyle={styles.cardContainer} key={i}>
                  <View
                    style={{
                      alignItems: "flex-end",
                      marginTop: -6,
                      marginRight: -10,
                      zIndex: 1,
                    }}
                  >
                    <Feather
                      name="trash"
                      size={25}
                      color={"#CC334A"}
                      onPress={() => {
                        this.deleteFromCart(u);
                      }}
                    />
                  </View>

                  <ListItem
                    key={i}
                    leftAvatar={{
                      size: "large",
                      source: { uri: u.prod_image },
                    }}
                    title={u.prod_name}
                    titleStyle={styles.cardTitleStyle}
                    subtitle={u.prod_points + " Points"}
                    subtitleStyle={styles.subTitleStyle}
                    containerStyle={styles.listContainer}
                  />

                  <View style={{ alignItems: "flex-end", marginTop: -20 }}>
                    <Counter
                      buttonStyle={styles.cnt_buttonStyle}
                      buttonTextStyle={styles.cnt_buttonTextStyle}
                      countTextStyle={styles.cnt_countTextStyle}
                      start={u.prod_qty}
                      min={1}
                      max={5}
                      onChange={(num, ty) => {
                        this.changeProductQuantity(num, ty, u);
                      }}
                    />
                  </View>
                </Card>
              );
            })}
          </View>
        </ScrollView>

        <View style={{ marginBottom: 30, paddingTop: 20 }}>
          <Text style={styles.tpuText}>Total Points Used: {pointsUsed}</Text>

          {productList.length > 0 ? (
            <RNEButton
              title={
                <Text style={{ fontSize: 22 }}>
                  Checkout{" "}
                  <Feather
                    style={{ paddingLeft: 25 }}
                    name="arrow-right-circle"
                    size={20}
                    color={"#FFF"}
                  />
                </Text>
              }
              onPress={() => {
                this.checkOut();
              }}
              buttonStyle={styles.chkoutBut}
            />
          ) : (
            <RNEButton
              title={
                <Text style={{ fontSize: 22 }}>
                  Checkout{" "}
                  <Feather
                    style={{ paddingLeft: 25 }}
                    name="arrow-right-circle"
                    size={20}
                    color={"#FFF"}
                  />
                </Text>
              }
              onPress={() => {}}
              buttonStyle={styles.chkoutBut_disabled}
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

  pview: {
    width: screenWidth / 3.2,
    // height: 110,
    backgroundColor: "#19537E",
    margin: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  ptext: {
    color: "#fff",
    fontFamily: "HelveticaNeue",
    fontSize: 15,
    fontWeight: "600",
    fontStyle: "normal",
    letterSpacing: 0,
    padding: 10,
  },

  ptext_2: {
    marginTop: -15,
    paddingBottom: 5,
  },

  ptext_3: {
    marginTop: -5,
    marginBottom: 3,
    fontSize: 16,
  },

  chkoutBut: {
    height: 50,
    borderRadius: 6,
    marginTop: 30,
    paddingHorizontal: 10,
    width: "60%",
    alignSelf: "center",
    backgroundColor: "#19537e",
  },

  chkoutBut_disabled: {
    height: 50,
    borderRadius: 6,
    marginTop: 30,
    paddingHorizontal: 10,
    width: "60%",
    alignSelf: "center",
    backgroundColor: "#999",
    opacity: 0.5,
  },

  cardTitleStyle: {
    color: "#1c1c1c",
    fontFamily: "HelveticaNeue",
    letterSpacing: 0,
    marginTop: -10,
    fontSize: 16,
  },
  subTitleStyle: {
    color: "#19537E",
    fontFamily: "HelveticaNeue",
    fontWeight: "800",
    letterSpacing: 0,
    marginTop: 8,
    fontSize: 16,
  },

  listContainer: {
    justifyContent: "flex-start",
    marginLeft: -15,
    marginTop: -10,
  },

  cardContainer: {
    borderRadius: 10,
    // backgroundColor: "#ffffff",
    elevation: 1,
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 20,
    shadowOpacity: 1,
    margin: 10,
  },

  cnt_buttonStyle: {
    borderColor: "#9B9B9B",
    borderWidth: 2,
    // borderRadius: 35 / 2,
    // width: 35,
    // height: 35,
  },
  cnt_buttonTextStyle: {
    color: "#1F2124",
    fontSize: 18,
    margin:2,
    paddingLeft:5,
    paddingRight:5
  },
  cnt_countTextStyle: {
    color: "#1F2124",
    fontSize: 18,
  },
  delView: {
    alignItems: "flex-end",
    marginTop: -6,
    marginRight: -10,
    zIndex: 1,
  },
  tpuText: {
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "700",
  },
});
