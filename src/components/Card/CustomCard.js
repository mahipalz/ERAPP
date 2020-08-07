import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { Card, List, ListItem } from "react-native-elements";

import PropTypes from "prop-types";
import styles from "./styles";

export default class CustomCard extends React.Component {
  render() {
    return (
      <Card containerStyle={styles.cardContainer}>
        <TouchableOpacity
          onPress={this.props.onPress}
          style={styles.closeButtonStyle}
        >
          <Image source={require("../../assets/images/cross.png")} />
        </TouchableOpacity>
        <ListItem
          leftAvatar={{ size: "small", source: { uri: this.props.image } }}
          title={this.props.title}
          titleStyle={styles.cardTitleStyle}
          subtitle={this.props.subTitle}
          subtitleStyle={styles.subTitleStyle}
          containerStyle={styles.listContainer}
        />
      </Card>
    );
  }
}

CustomCard.propTypes = {
  onPress: PropTypes.func,
  title: PropTypes.string,
};
