'use strict';
var React = require('react-native');
var {
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Image,
  Text
  } = React;

function getStyleFromCategory(name:string):{color: string} {
  var colour = '';
  for (var i = 0, hash = 0; i < name.length; hash = name.charCodeAt(i++) + ((hash << 5) - hash));
  for (var i = 0, colour = "#"; i < 3; colour += ("00" + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2));


  console.log(colour);
  return {
    color:  colour
  };
}

var EventCell = React.createClass({
  render: function () {
    return (
      <View>
        <TouchableHighlight
          onPress={this.props.onSelect}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}>
          <View style={styles.row}>

            <Text
              style={[styles.categoryCell, getStyleFromCategory(this.props.event.category.name)]}>
              {this.props.event.category.name}
            </Text>
            <View style={styles.detailsCell}>
              <Text style={styles.eventName} numberOfLines={1}>
                {this.props.event.name}
              </Text>
              <View style={styles.mainCell}>
                <View style={styles.leftCell}>
                  <Text style={styles.authors} numberOfLines={1}>
                    {this.props.event.authors.length ? this.props.event.authors[0].name : ''}
                  </Text>
                  <Text style={styles.duration} numberOfLines={1}>
                    {this.props.event.duration.startAt} - {this.props.event.duration.finishAt}
                  </Text>
                  <Text style={styles.place} numberOfLines={1}>
                    {this.props.event.place.name}
                  </Text>
                </View>
                <View style={styles.rightCell}>
                  <TouchableOpacity onPress={this.props.onSelect}>
                    <Image style={{width: 20, height: 20}} source={require('image!fav')}/>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  row: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 5,
    height: 80,
  },
  categoryCell: {
    transform: [{rotate: '-90deg'}],
    height: 50,
    width: 70,
    fontSize: 7,
    letterSpacing: 1.5,
    marginBottom: 5
  },
  detailsCell: {
    justifyContent: 'space-between',
    flex: 1,
    flexDirection: 'column',
  },
  eventName: {
    fontSize: 12,
    fontWeight: '500',
  },
  authors: {
    marginTop: 5,
    fontSize: 8
  },
  duration: {
    marginTop: 5,
    fontSize: 8
  },
  place: {
    marginTop: 5,
    fontSize: 8
  },
  mainCell: {
    flexDirection: 'row',
  },
  leftCell: {
    width: 180,
    flexDirection: 'column',
  },
  rightCell: {
    padding: 20
  }
});

module.exports = {
  EventCell: EventCell
};
