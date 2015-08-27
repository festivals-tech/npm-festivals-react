'use strict';
var FestivalBackgroundView = require('./FestivalBackgroundView').FestivalBackgroundView;

var React = require('react-native');
var {
  StyleSheet,
  TouchableHighlight,
  View
  } = React;

var FestivalCell = React.createClass({
  render: function () {
    return (
      <View>
        <TouchableHighlight
          onPress={this.props.onSelect}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}>
          <View style={styles.row}>
            {/* $FlowIssue #7363964 - There's a bug in Flow where you cannot
             * omit a property or set it to undefined if it's inside a shape,
             * even if it isn't required */}
            <FestivalBackgroundView
              source={{uri: this.props.festival.mainImage.large}}
              style={styles.backdrop}
              festival={this.props.festival}
              //resizeMode="cover"
              >

            </FestivalBackgroundView>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 5,
  },
  backdrop: {
    flex: 1,
    paddingTop: 60,
    width: 300,
    height: 120
  }
});

module.exports = {
  FestivalCell: FestivalCell
};
