'use strict';
var async = require('async');
var SQLite = require('react-native-sqlite');
var eventsModel = require('festivals-model').model;
var EventResponseBuilder = eventsModel.eventResponse.EventResponseBuilder;
var EventPlaceResponseBuilder = eventsModel.eventPlaceResponse.EventPlaceResponseBuilder;
var EventCategoryResponseBuilder = eventsModel.eventCategoryResponse.EventCategoryResponseBuilder;
var DurationResponseBuilder = eventsModel.durationResponse.DurationResponseBuilder;
var LocationResponseBuilder = eventsModel.locationResponse.LocationResponseBuilder;
var MainImageResponseBuilder = eventsModel.mainImageResponse.MainImageResponseBuilder;
var AuthorResponseBuilder = eventsModel.authorResponse.AuthorResponseBuilder;

var DATABASE_FILENAME = 'events.sqlite';
var API_URL = 'http://localhost:3000/api';
var EVENTS_RESOURCE_NAME = '/festivals/{id}/events';
var EVENTS_QUERY = '?sort=duration.startAt';

var EventsAdapter = function EventsAdapter() {
  var database = SQLite.open(DATABASE_FILENAME);

  var loadEvents = function loadEvents(festival, callback) {
    var events = [];
    database.executeSQL(
      'SELECT * FROM "events" ' +
      'WHERE festival = ? ' +
      'ORDER BY start_at ASC ',
      //'LIMIT 5',  //TODO,
      [
        festival.id
      ],
      (row) => {

        var duration = new DurationResponseBuilder()
          .withStartAt(row.start_at)
          .withFinishAt(row.end_at)
          .withPeriodMs(null)
          .build();

        var mainImage = null;

        if (row.image) {
          mainImage = new MainImageResponseBuilder()
            .withSmall(row.image)
            .withMedium(row.image)
            .withLarge(row.image)
            .build();
        }

        var place = null;
        if (row.place_name) {
          place = new EventPlaceResponseBuilder()
            .withId(row.place_id)
            .withName(row.place_name)
            .withBreadcrumbs(null)
            .withOpeningTimes(null)
            .withCoordinates(null)
            .build();
        }

        var category = null;
        if (row.category_name) {
          category = new EventCategoryResponseBuilder()
            .withId(row.category_id)
            .withName(row.category_name)
            .withBreadcrumbs(null)
            .build();
        }

        var authors = [];
        if (row.authors) {

          var splited = row.authors.split(',');

          if (splited.length) {
            authors = splited.map(function (author) {
              var authorSplit = author.split('|');
              var organization = authorSplit[1];

              if (organization === 'null') {
                organization = null;
              }

              return new AuthorResponseBuilder()
                .withName(authorSplit[0])
                .withOrganization(organization)
                .build();
            });
          }
          //console.log(row.authors, authors);
        }

        var eventResponseModel = new EventResponseBuilder()
          .withId(row.id)
          .withName(row.name)
          .withDescription(row.description)
          .withStatus(row.status)
          .withMainImage(mainImage)
          .withDuration(duration)
          .withPlace(place)
          .withCategory(category)
          .withAuthors(authors)
          .withPublishedAt(row.published_at)
          .withCreatedAt(row.created_at)
          .withUpdatedAt(row.updated_at)
          .build();

        events.push(eventResponseModel);
      },
      (error) => {
        //if (error) {
        //  throw error;
        //}

        return callback(error, events);
      });
  };

  var initTable = function initTable(callback) {

    var sql = 'create table "events" (' +
      '"id" char(36) not null primary key, ' +
      '"festival" char(36), ' +
      '"name" varchar(255), ' +
      '"description" text, ' +
      '"start_at" datetime, ' +
      '"end_at" datetime, ' +
      '"image" varchar(255), ' +
      '"authors" text, ' +
      '"place_id" char(36), ' +
      '"place_name" varchar(255), ' +
      '"category_id" char(36), ' +
      '"category_name" varchar(255), ' +
      '"status" varchar(255), ' +
      '"created_at" datetime, ' +
      '"updated_at" datetime,' +
      '"published_at" datetime' +
      ')';

    database.executeSQL(sql,
      [],
      (row) => {
        console.log('on initTable row : ', row);
      },
      (error) => {
        //if (error) {
        //  throw error;
        //}

        console.log('on initTable completed ', error);
        return callback(error, null);
      });
  };

  var dropTable = function dropTable(callback) {

    var sql = 'drop table "events"';

    database.executeSQL(sql,
      [],
      (row) => {
        console.log('on dropTable row : ', row);
      },
      (error) => {
        //if (error) {
        //  throw error;
        //}

        console.log('on dropTable completed ', error);
        return callback(error, null);
      });
  };

  var saveEvent = function saveEvent(event, callback) {

    var sql = 'insert into "events" ' +
      '(' +
      '"id",' +
      '"festival",' +
      '"name",' +
      '"description",' +
      '"start_at",' +
      '"end_at",' +
      '"image",' +
      '"authors",' +
      '"place_id",' +
      '"place_name",' +
      '"category_id",' +
      '"category_name",' +
      '"status",' +
      '"created_at",' +
      '"updated_at",' +
      '"published_at"' +
      ') values (' +
      '?,' +
      '?,' +
      '?,' +
      '?,' +
      '?,' +
      '?,' +
      '?,' +
      '?,' +
      '?,' +
      '?,' +
      '?,' +
      '?,' +
      '?,' +
      '?,' +
      '?,' +
      '?' +
      ')';

    var authors = '';

    if (event.authors && event.authors.length) {

      var joins = event.authors.map(function (author) {
        return author.name + '|' + author.organization;
      });

      authors = joins.join(',');
    }

    //console.log('save event', event);

    database.executeSQL(sql,
      [
        event.id,
        event.festival,
        event.name,
        event.description,
        event.duration.startAt,
        event.duration.finishAt,
        event.mainImage ? event.mainImage.large : null,
        authors,
        event.place ? event.place.id : null,
        event.place ? event.place.name : null,
        event.category ? event.category.id : null,
        event.category ? event.category.name : null,
        event.status,
        event.createdAt,
        event.updatedAt,
        event.publishedAt
      ],
      (row) => {
        console.log('on saveEvent row : ', row);
      },
      (error) => {
        console.log('on saveEvent completed ', error);
        return callback(error, null);
      });
  };

  var saveEvents = function saveEvents(events, callback) {
    async.map(events, saveEvent, callback);
  };

  var fetchEvents = function fetchEvents(festival, callback) {
    var url = API_URL;
    url += EVENTS_RESOURCE_NAME.replace('{id}', festival.id);
    url += EVENTS_QUERY;

    //console.log('get events from ' + url);

    fetch(url)
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
        return callback(error, []);
      })
      .then((responseData) => {

        var events = responseData.events.map(function (event) {
          event.festival = festival.id;
          return event;
        });
        //filter?

        saveEvents(events, function (err) {
          return callback(err, events);
        });
      })
      .done();
  };

  var getEvents = function getEvents(festival, callback) {
    loadEvents(festival, function (err, events) {
      //console.log(err, events);

      if (err) {
        console.error(err);
        return callback(err, events);
      }

      if (events && events.length > 0) {
        console.log(events);
        return callback(null, events);
      }

      return forceRefreshData(festival, callback);
    });
  };

  var forceRefreshData = function forceRefreshData(festival, callback) {
    dropTable(function (/*err*/) {
      initTable(function (/*err*/) {
        fetchEvents(festival, function (err, events) {
          if (err) {
            console.error(err);
          }
          return callback(err, events);
        });
      });
    });
  };

  console.log('CREATE EventsAdapter!');
  initTable(function (err) {

  });

  return {
    getEvents: getEvents,
    forceRefreshData: forceRefreshData
  };
};

module.exports = {
  EventsAdapter: EventsAdapter
};
