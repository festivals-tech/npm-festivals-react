'use strict';

var React = require('react-native');
var {
  ListView,
  StyleSheet,
  Text,
  TextInput,
  View,
  } = React;

var EventsAdapter = require('../EventsAdapter').EventsAdapter;
var NoResults = require('../views/NoResults').NoResults;
var EventCell = require('../views/EventCell').EventCell;
var TimerMixin = require('react-timer-mixin');

var EventsScreen = React.createClass({
  adapter: new EventsAdapter(),
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

  getDataSource: function(events: Array<any>): ListView.DataSource {
    return this.state.dataSource.cloneWithRows(events);
  },

  componentDidMount: function () {
    this.loadFestivalEvents();
  },

  renderRow: function(
    event: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
  ) {
    return (
      <EventCell
        key={event.id}
        onSelect={() => this.selectEvent(festival)}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        event={event}
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
    )
  },

  selectEvent: function(event: Object) {
    this.props.navigator.push({
      title: event.name,
      component: EventsScreen,
      passProps: {event},
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

  loadFestivalEvents: function () {
    //this.timeoutID = null;

    var self = this;
    //this.setState({isLoading: true});
    this.adapter.getEvents(this.props.festival, function (err, events) {

      console.log('getEvents: ', self.props.festival, err, events);

      if (err) {
        self.setState({
          isLoading: false,
          error: err,
        });
      }
      else {
        self.setState({
          isLoading: false,
          dataSource: self.getDataSource(events),
          error: null,
        });
      }

    });
  }
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
  EventsScreen: EventsScreen
};
