import React from "react";

import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";

import LoginHomeScreen from "../screens/login/LoginHome";
import LoginUserScreen from "../screens/login/LoginUserName";
import LoginPasswordScreen from "../screens/login/LoginPassword";
import LoginOtpScreen from "../screens/login/LoginOtp";
import ForgotPwdScreen from "../screens/login/ForgotPwd";
import DBHomeScreen from "../screens/dashboard/DBHome";

import NominateAwardScreen from "../screens/nomination/NominateAward";
import ChooseAward from "../screens/nomination/ChooseAward";
import AwardCriteria from "../screens/nomination/AwardCriteria";
import CitationScreen from "../screens/nomination/Citation";
import CommunicationScreen from "../screens/nomination/Communication";
import DrawerContainer from "../screens/DrawerContainer/DrawerContainer";
import LoadingScreen from "./AuthCheck";

//approval
import ApprovalHome from "../screens/approval/ApprovalHome";
import ApprovalDetails from "../screens/approval/ApprovalDetails";

//my recognition
import RecognitionHome from "../screens/myrecognition/RecognitionHome";
import RecognitionDetails from "../screens/myrecognition/RecognitionDetails";

//Award wall
import AwardWallHome from "../screens/awardwall/AwardWallHome";
import AwardDetails from "../screens/awardwall/AwardDetails";

//redeem award
import RedemptionHome from "../screens/redemption/RedemptionHome";
import RedemptionCart from "../screens/redemption/RedemptionCart";
import RedemptionOrder from "../screens/redemption/RedemptionOrder";
import RedemptionAddress from "../screens/redemption/RedemptionAddress";

const AuthStack = createStackNavigator(
  {
    LoginHome: LoginHomeScreen,
    LoginUserName: LoginUserScreen,
    LoginPassword: LoginPasswordScreen,
    LoginOtp: LoginOtpScreen,
    ForgotPwd: ForgotPwdScreen,
  },
  {
    headerMode: "none",
    navigationOptions: ({ navigation }) => ({
      headerVisible: false,
    }),
  }
);

const MainNavigator = createStackNavigator(
  {
    DBHome: DBHomeScreen,

    NominateAward: NominateAwardScreen,
    ChooseAward: ChooseAward,
    AwardCriteria: AwardCriteria,
    CitationScreen: CitationScreen,
    CommunicationScreen: CommunicationScreen,

    ApprovalHome: ApprovalHome,
    ApprovalDetails: ApprovalDetails,

    RecognitionHome: RecognitionHome,
    RecognitionDetails: RecognitionDetails,

    AwardWallHome: AwardWallHome,
    AwardDetails: AwardDetails,

    RedemptionHome: RedemptionHome,
    RedemptionCart: RedemptionCart,
    RedemptionOrder: RedemptionOrder,
    RedemptionAddress: RedemptionAddress,
  },
  {
    initialRouteName: "DBHome",
    headerMode: "screen",
  }
);

const DrawerStack = createDrawerNavigator(
  {
    Main: MainNavigator,
  },
  {
    drawerPosition: "left",
    initialRouteName: "Main",
    drawerWidth: 270,
    contentComponent: DrawerContainer,
  }
);

const DbAppContainer = createAppContainer(DrawerStack);

const AppNavigator = createSwitchNavigator(
  {
    Loading: LoadingScreen,
    DBApp: DbAppContainer,
    Auth: AuthStack,
  },
  {
    initialRouteName: "Loading",
  }
);

export default AppNavigator;
