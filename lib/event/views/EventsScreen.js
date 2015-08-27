'use strict';

var React = require('react-native');
var {
  Image,
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  View,
  } = React;

var EventsAdapter = require('../EventsAdapter').EventsAdapter;

var EventsScreen = React.createClass({
  adapter: new EventsAdapter(),

  componentDidMount: function () {
    this.loadFestivalEvents();
  },

  loadFestivalEvents: function () {
    //this.timeoutID = null;

    var self = this;
    //this.setState({isLoading: true});
    this.adapter.getEvents(this.props.festival, function (err, events) {

      console.log('getEvents: ', self.props.festival, err, events);
      //
      //if (err) {
      //  self.setState({
      //    isLoading: false,
      //    error: err,
      //  });
      //}
      //else {
      //  self.setState({
      //    isLoading: false,
      //    dataSource: self.getDataSource(events),
      //    error: null,
      //  });
      //}

    });
  },

  render: function () {
    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.mainSection}>
          {/* $FlowIssue #7363964 - There's a bug in Flow where you cannot
           * omit a property or set it to undefined if it's inside a shape,
           * even if it isn't required */}
          <Image
            source={{uri: this.props.festival.mainImage.large}}
            style={styles.detailsImage}
            />
          <View style={styles.rightPane}>
            <Text style={styles.movieTitle}>{this.props.festival.name}</Text>
          </View>
        </View>
        <View style={styles.separator}/>
      </ScrollView>
    );
  },
});

var styles = StyleSheet.create({
  contentContainer: {
    padding: 10,
  },
  rightPane: {
    justifyContent: 'space-between',
    flex: 1,
  },
  movieTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  mpaaWrapper: {
    alignSelf: 'flex-start',
    borderColor: 'black',
    borderWidth: 1,
    paddingHorizontal: 3,
    marginVertical: 5,
  },
  mpaaText: {
    fontFamily: 'Palatino',
    fontSize: 13,
    fontWeight: '500',
  },
  mainSection: {
    flexDirection: 'row',
  },
  detailsImage: {
    width: 134,
    height: 200,
    backgroundColor: '#eaeaea',
    marginRight: 10,
  },
  separator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1 / PixelRatio.get(),
    marginVertical: 10,
  },
  castTitle: {
    fontWeight: '500',
    marginBottom: 3,
  },
  castActor: {
    marginLeft: 2,
  },
});

module.exports = {
  EventsScreen: EventsScreen
};
