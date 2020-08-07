import React, { Fragment } from "react";
import { Image } from "react-native";

import AsyncStorage from "@react-native-community/async-storage";

export default class LogoTitle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sb_montage: "",
    };

    AsyncStorage.getItem("AS_EMP")
      .then((value) => {
        var empObj = JSON.parse(value);
        var mfile = empObj.MontageFileName;
        var logo_file = empObj.LogoFileName;

        this.setState({ sb_montage: mfile });
        this.setState({ sb_logo: logo_file });
      })
      .done();
  }
  render() {
    return (
      <Image
        style={{ width: 140, height: 36 }}
        source={{ uri: this.state.sb_logo }}
      />
    );
  }
}
