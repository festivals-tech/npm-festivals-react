module.exports = {

  festival: {
    adapter: require('./lib/festival/FestivalsAdapter'),
    views: {
      FestivalsScreen: require('./lib/festival/views/FestivalsScreen').FestivalsScreen,
      FestivalCell: require('./lib/festival/views/FestivalCell').FestivalCell,
      FestivalBackgroundView: require('./lib/festival/views/FestivalBackgroundView').FestivalBackgroundView,
      NoResults: require('./lib/festival/views/NoResults').NoResults,
    },
  },
  event: {
    //adapter: require('./lib/festival/FestivalsAdapter'),
    views: {
      EventsScreen: require('./lib/event/views/EventsScreen').EventsScreen,
      EventCell: require('./lib/event/views/EventCell').EventCell,
      NoResults: require('./lib/event/views/NoResults').NoResults,
    },
  }
};


