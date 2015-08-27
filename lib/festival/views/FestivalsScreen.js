'use strict';

var React = require('react-native');
var {
  ListView,
  StyleSheet,
  Text,
  TextInput,
  View,
} = React;

var TimerMixin = require('react-timer-mixin');
var FestivalsAdapter = require('../FestivalsAdapter').FestivalsAdapter;
var FestivalBackgroundView = require('./FestivalBackgroundView').FestivalBackgroundView;
var NoResults = require('./NoResults').NoResults;
var FestivalCell = require('./FestivalCell').FestivalCell;
var EventsScreen = require('../../event/views/EventsScreen').EventsScreen;

var FestivalsScreen = React.createClass({
  adapter: new FestivalsAdapter(),
  mixins: [TimerMixin],
  timeoutID: (null: any),

  getInitialState: function() {
    return {
      isLoading: false,
      error: null,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    };
  },

  componentDidMount: function() {
    this.loadFestivals();
  },

  getDataSource: function(festivals: Array<any>): ListView.DataSource {
    return this.state.dataSource.cloneWithRows(festivals);
  },

  loadFestivals: function() {
    this.timeoutID = null;

    var self = this;
    this.setState({isLoading: true});
    this.adapter.getFestivals(function (err, festivals){

      console.log('getFestivals: ', err, festivals);

      if (err) {
        self.setState({
          isLoading: false,
          error: err,
        });
      }
      else {
        self.setState({
          isLoading: false,
          dataSource: self.getDataSource(festivals),
          error: null,
        });
      }

    });
  },

  selectFestival: function(festival: Object) {
    this.props.navigator.push({
      title: festival.name,
      component: EventsScreen,
      passProps: {festival},
    });
  },

  renderSeparator: function(
    sectionID: number | string,
    rowID: number | string,
    adjacentRowHighlighted: boolean
  ) {
    var style = styles.rowSeparator;
    if (adjacentRowHighlighted) {
        style = [style, styles.rowSeparatorHide];
    }
    return (
      <View key={"SEP_" + sectionID + "_" + rowID}  style={style}/>
    );
  },

  renderRow: function(
    festival: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
  ) {
    return (
      <FestivalCell
        key={festival.id}
        onSelect={() => this.selectFestival(festival)}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        festival={festival}
      />
    );
  },

  render: function() {
    var content = this.state.dataSource.getRowCount() === 0 ?
      <NoResults
        isLoading={this.state.isLoading}
      /> :
      <ListView
        ref="listview"
        renderSeparator={this.renderSeparator}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        automaticallyAdjustContentInsets={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps={true}
        showsVerticalScrollIndicator={false}
      />;

    return (
      <View style={styles.container}>
        {content}
      </View>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  spinner: {
    width: 30,
  },
  scrollSpinner: {
    marginVertical: 20,
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
});

module.exports = {
  FestivalsScreen: FestivalsScreen
};