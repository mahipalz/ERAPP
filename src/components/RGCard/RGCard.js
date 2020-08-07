import React from "react";
import { TouchableOpacity, Image, Text, View } from "react-native";
import { Card, ListItem } from "react-native-elements";
import { Button } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";

import PropTypes from "prop-types";
import styles from "./styles";
import helpers from "../../components/util/helper";

var likes = false;
var comments = false;
var likesText = "";
var commentsText = "";
var teamNames = "";

export default class RGCard extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    likes = false;
    comments = false;
    likesText = "";
    commentsText = "";
    teamNames = "";
 }

  render() {
    likes = /\d/.test(this.props.likes.trim());
    comments = /\d/.test(this.props.comments.trim());

    if (this.props.detailPage == true) {
      likesText = this.props.liked == true ? "Liked" : "Like";
      commentsText = "Comment";
    } else {
      likesText = likes ? this.props.likes.replace(/[()]/g, "") : "0 Likes";
      likesText = likesText == "1 Likes" ? "1 Like" : likesText;
      commentsText = comments
        ? this.props.comments.replace(/[()]/g, "")
        : "0 Comments";
      commentsText = commentsText == "1 Comments" ? "1 Comment" : commentsText;
    }

    if (this.props.teamNames.length) {
      teamNames = this.props.teamNames;
    }

    return (
      <Card containerStyle={styles.cardContainer}>
        <View>
        <ListItem
          key={this.props.listId}
          rightAvatar={{ size: "large", source: this.props.image }}
          title={this.props.recipient}
          titleStyle={styles.cardTitleStyle}
          subtitle={"Nominated by" + this.props.nominator}
          subtitleStyle={styles.subTitleStyle}
          containerStyle={styles.listContainer}
        />

        {teamNames.length > 0 && (
          <View style={{ alignSelf: "stretch", backgroundColor: "#fff" }}>
            <Text style={styles.team_txt}>{"Team: " + teamNames}</Text>
          </View>
        )}

        <View
          style={{
            alignSelf: "stretch",
            backgroundColor: "#ffffff",
            padding: 20,
          }}
        >
          <Text style={styles.cr_txt}>
            {this.props.citation.length
              ? this.props.citation
              : this.props.CriteriaDescription}
          </Text>
        </View>
        <View
          style={{
            alignSelf: "stretch",
            backgroundColor: "#ffffff",
            padding: 20,
            paddingTop: 10,
          }}
        >
          <Text style={styles.cr_txt_1}>{this.props.AwardName}</Text>
        </View>
        <View
          style={{
            alignSelf: "stretch",
            backgroundColor: "#ffffff",
            padding: 20,
            paddingTop: 10,
          }}
        >
          <Text style={styles.cr_txt_1}>{this.props.nm_date}</Text>
        </View>

        <View style={styles.bottomView}>
          <Button
            iconLeft
            transparent
            style={styles.hcbut}
            onPress={this.props.onLikePress}
          >
            {likes == true && <Icon name="heart" color="red" size={20} />}
            {likes == false && likesText == "Liked" && (
              <Icon name="heart" color="red" size={20} />
            )}
            {likes == false && likesText != "Liked" && (
              <Icon name="heart-o" size={20} />
            )}

            <Text style={styles.btnText}>{likesText}</Text>
          </Button>

          <Button
            iconLeft
            transparent
            style={styles.hcbut}
            onPress={this.props.onCommentPress}
          >
            {comments == true && <Icon name="comment" color="red" size={20} />}
            {comments == false && <Icon name="comment-o" size={20} />}

            <Text style={styles.btnText}>{commentsText}</Text>
          </Button>
          <TouchableOpacity style={{marginTop:-6,}} onPress={this.props.onDownloadPress}>
            <Image
              style={styles.image}
              source={require("../../assets/images/bar.png")}
              resizeMode="contain"
              resizeMethod="resize"
            />
          </TouchableOpacity>
        </View>
        </View>
      </Card>
    );
  }
}

RGCard.propTypes = {
  onPress: PropTypes.func,
  title: PropTypes.string,
};
