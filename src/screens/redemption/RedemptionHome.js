import React, { Fragment } from "react";
import {
  Text,
  Image,
  View,
  Alert,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Footer, FooterTab, Button, Icon } from "native-base";
import {
  Button as RNEButton,
  Avatar,
  Divider,
  Badge,
} from "react-native-elements";
import { NavigationEvents } from "react-navigation";
import { Col, Row, Grid } from "react-native-easy-grid";
import AsyncStorage from "@react-native-community/async-storage";

import MenuImage from "../../components/MenuImage/MenuImage";
import MenuImageRight from "../../components/MenuImage/MenuImageRight";
import * as Konstants from "../../constants/constants";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

var catWidth = screenWidth / 3;
var itemWidth = screenWidth / 1.1;
var imgWh = catWidth * 0.55;
var _this = this;
var _token = "";

export default class RedemptionHome extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "REDEEM AWARD",
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
      categoryList: [],
      itemsObject: {},
      itemsList: [],
      pointsTotal: 0,
      pointsUsed: 0,
      pointsAvailable: 0,
      prodCount: 0,
      cartItems: [],
      sessionExists: false,
      catProdCount: 1,
      selCatId: 0,
    };
    _this = this;
  }

  onViewWillFocus() {
    _this.updatePoints();
  }

  componentDidMount() {
    AsyncStorage.getItem("AS_TOKEN")
      .then((value) => {
        _token = value.toString();
        _this.apiGetRewardsCatalog();

        AsyncStorage.setItem("AS_INSTA_VOUCHER", "0");
      })
      .done();
  }

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

  compare = (a,b) => {
    const catA = a.CatagoryName.toUpperCase();
    const catB = b.CatagoryName.toUpperCase();
  
    let comparison = 0;
    if (catA > catB) {
      comparison = 1;
    } else if (catA < catB) {
      comparison = -1;
    }
    return comparison;
  }

  compareProd = (a,b) => {
    const catA = a.ProductName.toUpperCase();
    const catB = b.ProductName.toUpperCase();
  
    let comparison = 0;
    if (catA > catB) {
      comparison = 1;
    } else if (catA < catB) {
      comparison = -1;
    }
    return comparison;
  }


  


  apiGetRewardsCatalog = () => {
    this.setState({ pageLoading: true });

    var query =
      "?" + "token=" + _token + "&term=&nocache=" + new Date().getTime();

    var url = Konstants.API_ROOT_URL + "/Order/GetCatalog" + query;
    // console.log(url);

    var oldProductsArray = [];
    var oldProductItemObject = {};
    var oldProductIdArray = [];
    var oldPoints = 0;

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
          return false;
        } 

        var tempArr = responseJson.ListCatalogDetailsView;
        var tempObj = tempArr[0];
        var tempCatArr = tempObj.ListCategories;
        tempCatArr.sort(this.compare);

        this.setState({
          categoryList: tempCatArr,
        });

        var isVcr = responseJson.IsInstaVoucher;
        AsyncStorage.setItem("AS_INSTA_VOUCHER", isVcr.toString());

        var firstCatObj = tempCatArr[0];

        setTimeout(() => {
          this.loadCategoryItems(firstCatObj.CatagoryId);
        }, 10);

        oldProductsArray = responseJson.ListOrderDetail;
        oldProductsArray.forEach((elementObj) => {
          var prod_pts =
            parseInt(elementObj.ProductPoints) *
            parseInt(elementObj.TotalQuantity);
          oldPoints = oldPoints + prod_pts;

          var product_id = elementObj.ProductDetailId;

          if (oldProductIdArray.includes(product_id)) {
            var excount = oldProductItemObject[product_id];
            var newcount =
              parseInt(excount) + parseInt(elementObj.TotalQuantity);
            oldProductItemObject[product_id] = newcount;
          } else {
            oldProductItemObject[product_id] = elementObj.TotalQuantity;
            oldProductIdArray.push(product_id);
          }
        });

        var tot_points = responseJson.TotalPoints;
        var av_points = tot_points - oldPoints;

        var catalogArray = responseJson.ListRewardCatalogView;

        var aObj = {};
        var categoryArr = [];

        catalogArray.forEach(function(arrayItem) {
          var catId = arrayItem.CategoryId;
          if (categoryArr.indexOf(catId) == -1) {
            categoryArr.push(catId);
          }
        });

        var oldProductsRefinedObject = {};
        var dupArr = [];

        categoryArr.forEach(function(cid) {
          catalogArray.forEach(function(arrayItem) {
            var catId = arrayItem.CategoryId;
            var pid = arrayItem.ProductDetailId;

            if (oldProductIdArray.includes(pid) && !dupArr.includes(pid)) {
              dupArr.push(pid);
              var nwobj = {};
              nwobj["data"] = arrayItem;
              nwobj["qty"] = oldProductItemObject[pid];
              oldProductsRefinedObject[pid] = nwobj;
            }

            if (cid == catId) {
              if (cid in aObj) {
                var k_a = aObj[cid];
                k_a.push(arrayItem);
                aObj[cid] = k_a;
              } else {
                var ta = [];
                ta.push(arrayItem);
                aObj[cid] = ta;
              }
            }
          });
        });

        this.setState({ itemsObject: aObj });

        AsyncStorage.setItem(
          "AS_CART",
          JSON.stringify(oldProductsRefinedObject)
        );

        AsyncStorage.setItem(
          "AS_PRODUCT_IDS",
          JSON.stringify(oldProductIdArray)
        );

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
            } else {
              var pointsObj = {};
              pointsObj["pointsTotal"] = tot_points;
              pointsObj["pointsUsed"] = oldPoints;
              pointsObj["pointsAvailable"] = av_points;

              var keyz = Object.keys(oldProductsRefinedObject);
              pointsObj["prodCount"] = keyz.length;

              AsyncStorage.setItem(
                "AS_POINTS",
                JSON.stringify(pointsObj),
                () => {
                  this.updatePoints();
                }
              );
            }
          })
          .done();
      })
      .catch((error) => {
        console.error(error);
        this.setState({ pageLoading: false });
      });
  };

  loadCategoryItems = (catId) => {
    if (catId in this.state.itemsObject) {
      let k = this.state.itemsObject[catId].sort(this.compareProd);
      this.setState(
        {
          itemsList: k,
        },
        () => {
          this.setState({
            catProdCount: this.state.itemsList.length,
            selCatId: catId,
          });
        }
      );
    } else {
      this.setState(
        {
          itemsList: [],
        },
        () => {
          this.setState({
            catProdCount: this.state.itemsList.length,
            selCatId: catId,
          });
        }
      );
    }
  };

  redeemPress = (prodObj) => {
    var pid = prodObj.ProductDetailId;
    var pts = prodObj.RewardCatalogPoints;
    var catalogId = prodObj.CatalogId;

    if (parseInt(pts) > parseInt(this.state.pointsAvailable)) {
      Alert.alert(Konstants.MSG_REDEEM_NO_POINTS);
    } else {
      AsyncStorage.getItem("AS_PRODUCT_IDS")
        .then((value) => {
          if (value != null) {
            var ids = JSON.parse(value);

            if (ids.includes(pid)) {
            } else {
              this.insertProduct(prodObj);
            }
          } else {
            this.insertProduct(prodObj);
          }
        })
        .done();
    }
  };

  insertProduct = (prodObj) => {
    var pid = prodObj.ProductDetailId;
    var pts = prodObj.RewardCatalogPoints;
    var catalogId = prodObj.CatalogId;

    //Insert prod in database - call api

    var query =
      "?" +
      "token=" +
      _token +
      "&Type=INSERT" +
      "&ProductDetailId=" +
      pid +
      "&Points=" +
      pts +
      "&CatalogId=" +
      catalogId +
      "&Quantity=1";

    var url = Konstants.API_ROOT_URL + "/Order/InsertupdateOrder" + query;

    // console.log(url);

    this.setState({ pageLoading: true });

    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ pageLoading: false });

        var isVcr = responseJson.IsInstaVoucher;
        AsyncStorage.setItem("AS_INSTA_VOUCHER", isVcr.toString());

        var ptsObject = {};
        ptsObject["pointsTotal"] = this.state.pointsTotal;
        ptsObject["pointsUsed"] =
          parseInt(this.state.pointsUsed) + parseInt(pts);
        ptsObject["pointsAvailable"] =
          parseInt(this.state.pointsAvailable) - parseInt(pts);
        ptsObject["prodCount"] = parseInt(this.state.prodCount) + 1;

        AsyncStorage.setItem("AS_POINTS", JSON.stringify(ptsObject), () => {
          this.updatePoints();
        });

        //update productids session
        AsyncStorage.getItem("AS_PRODUCT_IDS")
          .then((value) => {
            if (value != null) {
              var ids = JSON.parse(value);
              ids.push(pid);
              AsyncStorage.setItem("AS_PRODUCT_IDS", JSON.stringify(ids));
            } else {
              var arr = [];
              arr.push(pid);
              AsyncStorage.setItem("AS_PRODUCT_IDS", JSON.stringify(arr));
            }
          })
          .done();

        //Save to cart
        AsyncStorage.getItem("AS_CART")
          .then((value) => {
            if (value != null) {
              var kart = JSON.parse(value);

              if (pid in kart) {
                var c = kart[pid]["qty"];
                kart[pid]["qty"] = c + 1;
                AsyncStorage.setItem("AS_CART", JSON.stringify(kart));
              } else {
                var tobj = {};
                tobj["data"] = prodObj;
                tobj["qty"] = 1;
                kart[pid.toString()] = tobj;

                AsyncStorage.setItem("AS_CART", JSON.stringify(kart));
              }
            } else {
              var tmpObj = {};
              var tobj = {};
              tobj["data"] = prodObj;
              tobj["qty"] = 1;

              tmpObj[pid] = tobj;

              AsyncStorage.setItem("AS_CART", JSON.stringify(tmpObj));
            }
          })
          .done();
      })
      .catch((error) => {
        this.setState({ pageLoading: false });
        console.error(error);
      });
  };

  showCart() {
    if (parseInt(this.state.pointsUsed) > 0) {
      var pointsObj = {};
      pointsObj["pointsTotal"] = parseInt(this.state.pointsTotal);
      pointsObj["pointsUsed"] = this.state.pointsUsed;
      pointsObj["pointsAvailable"] = this.state.pointsAvailable;
      pointsObj["prodCount"] = this.state.prodCount;

      AsyncStorage.setItem("AS_POINTS", JSON.stringify(pointsObj), () => {
        this.props.navigation.navigate("RedemptionCart");
      });
    } else {
      Alert.alert(Konstants.MSG_REDEEM_EMPTY_CART);
    }
  }

  render() {
    console.disableYellowBox = true;

    const {
      categoryList,
      itemsList,
      pointsTotal,
      pointsUsed,
      pointsAvailable,
      prodCount,
    } = this.state;

    const tabTextStyle =
      this.state.pointsUsed > 0 ? styles.tabTextHL : styles.tabText;
    const tabIcStyle =
      this.state.pointsUsed > 0 ? styles.tabIcHL : styles.tabIc;
    const tabPointsStyle =
      this.state.pointsUsed > 0 ? styles.tabPointsHL : styles.tabPoints;

    if (this.state.pageLoading) {
      return (
        <View style={[styles.loadingContainer, styles.horizontal]}>
          <ActivityIndicator size="large" color="#19537e" />
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents onWillFocus={this.onViewWillFocus} />

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

          <Text style={styles.cathead}>Browse Category</Text>

          <View>
            <ScrollView
              ref={(scrollView) => {
                this.scrollView = scrollView;
              }}
              style={styles.container}
              horizontal={true}
              decelerationRate={0}
              snapToAlignment={"center"}
            >
              {categoryList.map((u, i) => {
                const catStyle =
                  this.state.selCatId == u.CatagoryId
                    ? styles.catviewHL
                    : styles.catview;
                let imgPath =
                  u.CatagoryImagePath ==
                  "https://ercontent.blob.core.windows.net/scontent/images/productimages/prod_no_img.jpg"
                    ? "https://picsum.photos/200?" + new Date().getTime()
                    : u.CatagoryImagePath;
                return (
                  <TouchableOpacity
                    key={i}
                    style={catStyle}
                    onPress={() => {
                      this.setState({ selCatId: u.CatagoryId });
                      this.loadCategoryItems(u.CatagoryId);
                    }}
                  >
                    <View style={styles.hvcenter}>
                      <Image source={{ uri: imgPath }} style={styles.catImg} />
                      <Text style={styles.catext}>{u.CatagoryName}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <Divider style={{ backgroundColor: "#d9d9d9", marginTop: 10 }} />

          {this.state.catProdCount == 0 && (
            <Text style={styles.noprod}>
              {Konstants.MSG_REDEEM_NO_PRODUCTS}
            </Text>
          )}

          <Grid>
            {itemsList.map((u, i) => {
              return (
                <Row key={i}>
                  <Col>
                    <View style={styles.itemview}>
                      <Avatar
                        resizeMode="center"
                        source={{
                          uri: u.ProductImagePath,
                        }}
                        size="large"
                        avatarStyle={{ margin: 100 }}
                      />
                      <Text style={styles.itemTitle}>{u.ProductName}</Text>
                      <Text style={styles.itemCatTitle}>
                        {u.ProductDescription}
                      </Text>
                      <Text style={styles.itemPoints}>
                        {u.RewardCatalogPoints + " Points"}
                      </Text>
                      <RNEButton
                        title="Add to Cart"
                        type="outline"
                        onPress={() => {
                          this.redeemPress(u);
                        }}
                        buttonStyle={{
                          marginTop: 15,
                          padding: 10,
                          borderRadius: 12,
                          borderColor: "#999",
                        }}
                      />
                    </View>
                  </Col>
                </Row>
              );
            })}
          </Grid>
        </ScrollView>

        <Footer style={{ height: screenHeight / 10 }}>
          <FooterTab style={styles.footerTb}>
            <Button vertical style={styles.tabBtn}>
              <Text style={tabPointsStyle}>{pointsUsed}</Text>
              <Text style={tabTextStyle}>Points Used</Text>
            </Button>

            <Button
              vertical
              style={styles.tabBtn}
              onPress={() => {
                this.showCart();
              }}
            >
              <Icon style={tabIcStyle} name="cart" />
              {parseInt(prodCount) > 0 && (
                <Badge
                  value={prodCount}
                  status="error"
                  containerStyle={{ position: "absolute", top: 5, right: 68 }}
                />
              )}
              <Text style={tabTextStyle}>Proceed to Cart</Text>
            </Button>
          </FooterTab>
        </Footer>
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
  catview: {
    flex: 1,
    width: catWidth,
    margin: 10,
    height: catWidth + 20,
    borderRadius: 10,
    alignSelf: "center",
    backgroundColor: "#ffffff",
    elevation: 3,
    shadowColor: "#d9d9d9",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 3,
    shadowOpacity: 1,
  },

  hvcenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  catviewHL: {
    flex: 1,
    width: catWidth,
    margin: 10,
    height: catWidth + 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderColor: "#BE3F32",
    borderWidth: 1,
    elevation: 3,
    shadowColor: "#d9d9d9",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 3,
    shadowOpacity: 1,
  },

  catImg: {
    width: imgWh,
    height: imgWh,
    alignSelf: "center",
  },

  itemview: {
    marginTop: 20,
    padding: 20,
    width: itemWidth,
    margin: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    elevation: 3,
    shadowColor: "#c9c9c9",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 5,
    shadowOpacity: 0.6,
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
    fontSize: 16,
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
    fontSize: 17,
  },

  catext: {
    color: "#19537E",
    fontFamily: "HelveticaNeue",
    fontSize: 16,
    fontWeight: "600",
    fontStyle: "normal",
    letterSpacing: 0,
    paddingTop: 10,
    textAlign: "center",
  },
  cathead: {
    color: "#19537E",
    fontFamily: "HelveticaNeue",
    fontSize: 18,
    fontWeight: "600",
    fontStyle: "normal",
    letterSpacing: 0,
    padding: 10,
    // marginTop:-60,
  },
  itemTitle: {
    color: "#404852",
    fontFamily: "HelveticaNeue",
    fontSize: 17,
    fontWeight: "600",
    fontStyle: "normal",
    paddingTop: 10,
  },

  itemCatTitle: {
    color: "#8E8E8E",
    fontFamily: "HelveticaNeue",
    fontSize: 15,
    fontWeight: "normal",
    fontStyle: "normal",
    padding: 10,
  },

  itemPoints: {
    color: "#235A83",
    fontFamily: "HelveticaNeue",
    fontSize: 17,
    fontWeight: "600",
    fontStyle: "normal",
  },

  noprod: {
    color: "#BE3F32",
    fontFamily: "HelveticaNeue",
    fontSize: 18,
    fontWeight: "normal",
    fontStyle: "normal",
    alignSelf: "center",
    marginTop: 30,
  },

  footerTb: {
    backgroundColor: "#ffffff",
    height: screenHeight / 7,
    elevation: 3,
    shadowColor: "#c9c9c9",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 15,
    shadowOpacity: 0.6,
  },
  tabIc: {
    fontSize: 24,
    color: "#A7A7A7",
  },
  tabIcHL: {
    fontSize: 24,
    color: "#333333",
  },

  tabText: {
    fontSize: 16,
    color: "#A7A7A7",
  },

  tabTextHL: {
    fontSize: 16,
    color: "#1F2124",
  },
  tabPoints: {
    padding: 5,
    fontSize: 18,
    fontWeight: "600",
    color: "#A7A7A7",
  },

  tabPointsHL: {
    padding: 5,
    fontSize: 18,
    fontWeight: "600",
    color: "#FF190D",
  },

  tabBtn: {
    marginTop: -screenHeight / 18,
  },
});
