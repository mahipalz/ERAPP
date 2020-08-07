import React from "react";
import { TouchableOpacity } from "react-native";
import { Card, ListItem } from "react-native-elements";

import PropTypes from "prop-types";
import styles from "./styles";

export default class AwardCard extends React.Component {
  render() {
    return (
      <Card containerStyle={styles.cardContainer}>
        <TouchableOpacity onPress={this.props.onPress}>
          <ListItem
            leftAvatar={{ size: "medium", source: this.props.image }}
            title={this.props.title}
            titleStyle={styles.cardTitleStyle}
            subtitle={this.props.subTitle}
            subtitleStyle={styles.subTitleStyle}
            containerStyle={styles.listContainer}
          />
        </TouchableOpacity>
      </Card>
    );
  }
}

AwardCard.propTypes = {
  onPress: PropTypes.func,
  title: PropTypes.string,
};
