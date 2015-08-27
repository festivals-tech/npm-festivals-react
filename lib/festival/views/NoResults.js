'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  } = React;

var NoResults = React.createClass({
  render: function() {
    var text = '';
    if (!this.props.isLoading) {
      text = 'No festivals found';
    }

    return (
      <View style={[styles.container, styles.centerText]}>
        <Text style={styles.noResultsText}>{text}</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centerText: {
    alignItems: 'center',
  },
  noResultsText: {
    marginTop: 80,
    color: '#888888',
  }
});

module.exports = {
  NoResults: NoResults
};
