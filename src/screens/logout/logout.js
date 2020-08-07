export const logOutUser = () => {
    this._clearAll()
      .then(function() {
        // console.log("Logout successful");
        _this.props.navigation.navigate("LoginHome");
      })
      .catch(function(error) {
        console.log("problem: " + error.message);
        //throw error;
      });
  }

  export const _clearAll = async () => {
    // console.log("clear all called...")
    try {
      await AsyncStorage.clear();
    } catch (e) {
      // clear error
    }
  };
