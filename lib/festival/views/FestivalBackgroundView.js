'use strict';

var React = require('react-native');
var {
  Image,
  StyleSheet,
  Text,
  ActivityIndicatorIOS,
  View
  } = React;


var FestivalBackgroundView = React.createClass({
  watchID: (null :? number),

  getInitialState: function () {
    return {
      error: false,
      loading: false,
      progress: 0
    };
  } ,
  render: function () {
    var loader = this.state.loading ?
      <View style={styles.progress}>
        <Text>{this.state.progress}%</Text>
        <ActivityIndicatorIOS style={{marginLeft:5}}/>
      </View> : null;
    return this.state.error ?
      <Text>{this.state.error}</Text> :
      <Image
        source={this.props.source}
        style={[this.props.style, {overflow: 'visible'}]}
        onLoadStart={(e) => this.setState({loading: true})}
        onError={(e) => this.setState({error: e.nativeEvent.error, loading: false})}
        onProgress={(e) => this.setState({progress: Math.round(100 * e.nativeEvent.loaded / e.nativeEvent.total)})}
        onLoad={() => this.setState({loading: false, error: false})}
        >
        {loader}
        <View style={styles.backdropView}>
          <Text style={styles.headline} numberOfLines={1}>
            {this.props.festival.name}
          </Text>
          <Text style={styles.festivalDescription} numberOfLines={3}>
            {this.props.festival.description}
          </Text>
        </View>
      </Image>;
  }
});


var styles = StyleSheet.create({
  backdropView: {
    backgroundColor: 'rgba(0,0,0,0)',
  },
  headline: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white'
  },
  festivalDescription: {
    fontSize: 10,
    marginBottom: 2,
    color: 'white'
  },
});

module.exports = {
  FestivalBackgroundView: FestivalBackgroundView
};
