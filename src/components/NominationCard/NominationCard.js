import React from "react";
import { TouchableOpacity, Image, Text, View } from "react-native";
import { Card, ListItem } from "react-native-elements";
import PropTypes from "prop-types";
import styles from "./styles";
import helpers from "../../components/util/helper";

export default class NominationCard extends React.Component {
  render() {
    return (
      <Card containerStyle={styles.cardContainer}>
        {this.props.isClose && (
          <TouchableOpacity
            onPress={this.props.onPress}
            style={styles.closeButtonStyle}
          >
            <Image
              source={require("../../assets/images/visibility_button.png")}
            />
          </TouchableOpacity>
        )}
        <ListItem
          leftAvatar={{ size: "large", source: this.props.image }}
          title={this.props.title}
          titleStyle={styles.cardTitleStyle}
          subtitle={this.props.recipient}
          subtitleStyle={styles.subTitleStyle}
          containerStyle={styles.listContainer}
        />

        <View style={styles.bottomView}>
          <Text style={styles.nmby_txt}>
            Nominated by{" "}
            <Text style={styles.nmby_title}>{this.props.nominator}</Text>
          </Text>
          <Text style={styles.nmby_dt}>{this.props.nm_date}</Text>
        </View>
      </Card>
    );
  }
}

NominationCard.propTypes = {
  onPress: PropTypes.func,
  title: PropTypes.string,
};
