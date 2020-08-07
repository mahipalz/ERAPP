import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";

import NominateAwardScreen from "../screens/dashboard/NominateAward";
import RedeemAwardScreen from "../screens/dashboard/RedeemAward";

import DrawerContainer from "../screens/DrawerContainer/DrawerContainer";

const MainNavigator = createStackNavigator(
  {
    NominateAward: NominateAwardScreen,
    RedeemAward: RedeemAwardScreen,
  },
  {
    initialRouteName: "NominateAward",
    headerMode: "none",
    navigationOptions: ({ navigation }) => ({
      headerVisible: false,
    }),
  }
);

const DrawerStack = createDrawerNavigator(
  {
    Main: MainNavigator,
  },
  {
    drawerPosition: "left",
    initialRouteName: "Main",
    drawerWidth: 250,
    contentComponent: DrawerContainer,
  }
);

export default (DbAppContainer = createAppContainer(DrawerStack));
