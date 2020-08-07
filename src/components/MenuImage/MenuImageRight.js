import React from "react";
import { TouchableOpacity, Image } from "react-native";
import PropTypes from "prop-types";
import styles from "./styles";

export default class MenuImageRight extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={styles.headerButtonContainer}
        onPress={this.props.onPress}
      >
        <Image
          style={styles.headerButtonImage}
          source={require("../../assets/images/gear.png")}
        />
      </TouchableOpacity>
    );
  }
}

MenuImageRight.propTypes = {
  onPress: PropTypes.func,
};
