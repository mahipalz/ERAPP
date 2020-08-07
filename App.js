import React from "react";
import { View, Text } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import AppNavigator from "./src/navigations/AppNavigator";
const AppContainer = createAppContainer(AppNavigator);

export default createAppContainer(AppNavigator);
