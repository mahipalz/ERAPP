import React, {Fragment} from 'react';
import {  Text, Image, View, StyleSheet, Dimensions } from 'react-native';
import {  Button, Overlay} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import MenuImage from '../../components/MenuImage/MenuImage';
import MenuImageRight from '../../components/MenuImage/MenuImageRight';

var _this;

export default class RedemptionOrder extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'REDEEM AWARD',
    headerLeft: (
      <MenuImage
        onPress={() => {
          navigation.openDrawer();
        }}
      />
    ),
    swipeEnabled: false
  });

  constructor(props) {
    super(props);
    _this = this;
		this.state = {
      pageLoading: false,
      empName:'',
      msg:'',
      
    };

    this.state.empName = this.props.navigation.state.params.paramEmpName;
    this.state.msg = this.props.navigation.state.params.paramMsg;

  }

  removeCart = async () => {
    const keys = ['AS_CART', 'AS_POINTS', 'AS_PRODUCT_IDS', 'AS_INSTA_VOUCHER']
    try {
      await AsyncStorage.multiRemove(keys)
    } catch(e) { }
  
  }

  _gotoHome() {

    this.removeCart().then(function(){

      _this.props.navigation.navigate("DBHome");
  
     }).catch(function(error) {
        // console.log('problem: ' + error.message);
        //throw error;
      });
    
  }

	
  render() {

    console.disableYellowBox = true;

    const { empName } = this.state


    return (

        <View style={{flex:1}}>

            <Overlay
              isVisible={true}
              windowBackgroundColor="#555"
              overlayBackgroundColor="#fff"
              width="95%"
              height="auto"
              borderRadius={15}
              >
              <View style={{padding:10}}>
              <Image
              style={{alignSelf:'center'}}
              source={require('../../assets/images/success.png')}
              resizeMode="contain"
              resizeMethod="resize"
              />
            
            <Text style={{ lineHeight: 30, fontSize:20, marginTop:10, marginBottom:10}}>Dear {this.state.empName},</Text>

            <Text style={{ lineHeight: 30,fontSize:20}}>{this.state.msg}</Text>

            <Button
                title="Close"
                onPress={() => {
                  this._gotoHome();
                }}
                buttonStyle={{
                  height: 50,
                  borderRadius: 6,
                  marginTop:25,
                  marginBottom:10,
                  paddingHorizontal: 25,
                  width:'80%',
                  alignSelf:'center',
                  backgroundColor: '#19537e',
                }}
              />

            </View>
                  
        </Overlay>

    </View>
    );
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
 

});
