import React, { Component } from "react";
import { createSwitchNavigator } from "@react-navigation/core";
import { createBrowserApp } from "@react-navigation/web";

import LoginScreen from "./screens/Login";
import WhiteboardScreen from "./screens/Whiteboard";


const RootNavigator = createSwitchNavigator(
  {
    Login: LoginScreen,
    Whiteboard: WhiteboardScreen
  },
  {
    initialRouteName: "Login"
  }
);

const App = createBrowserApp(RootNavigator);



class Router extends Component {
  render() {
    return <App />
  }
}

export default Router;