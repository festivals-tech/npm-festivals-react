'use strict';
var async = require('async');
var festivalsModel = require('festivals-model').model;
var FestivalResponseBuilder = festivalsModel.festivalResponse.FestivalResponseBuilder;
var DurationResponseBuilder = festivalsModel.durationResponse.DurationResponseBuilder;
var LocationResponseBuilder = festivalsModel.locationResponse.LocationResponseBuilder;
var MainImageResponseBuilder = festivalsModel.mainImageResponse.MainImageResponseBuilder;
var SQLite = require('react-native-sqlite');
var DATABASE_FILENAME = 'festivals.sqlite';
var API_URL = 'http://localhost:3000/api';
var FESTIVALS_RESOURCE_NAME = '/festivals';
var FESTIVALS_QUERY = '?type=FANTASY&sort=-duration.startAt';

var FestivalsAdapter = function FestivalsAdapter() {

  var database = SQLite.open(DATABASE_FILENAME);

  var loadFestivals = function loadFestivals(callback) {
    var festivals = [];
    database.executeSQL(
      'SELECT * FROM "festivals" ' +
      'ORDER BY name ',
      [],
      (row) => {

        var duration = new DurationResponseBuilder()
          .withStartAt(row.startAt)
          .withFinishAt(row.finishAt)
          .withPeriodMs(row.periodMs)
          .build();

        var location = new LocationResponseBuilder()
          .withName(row.location_name)
          .withState(row.location_state)
          .withCountry(row.location_country)
          .withStreet(row.location_street)
          .withCity(row.location_city)
          .withZip(row.location_zip)
          .withOpeningTimes(null)
          .withCoordinates(null)
          .build();

        var mainImage = new MainImageResponseBuilder()
          .withSmall(row.image)
          .withMedium(row.image)
          .withLarge(row.image)
          .build();

        var festivalResponseModel = new FestivalResponseBuilder()
          .withId(row.id)
          .withName(row.name)
          .withDescription(row.description)
          .withType(row.type)
          .withStatus(row.status)
          .withMainImage(mainImage)
          .withDuration(duration)
          .withLocations([location])
          .withPublishedAt(row.published_at)
          .withCreatedAt(row.created_at)
          .withUpdatedAt(row.updated_at)
          .build();

        festivals.push(festivalResponseModel);
      },
      (error) => {
        //if (error) {
        //  throw error;
        //}
        return callback(error, festivals);
      });
  };

  var initTable = function initTable(callback) {

    var sql = 'create table "festivals" (' +
      '"id" char(36) not null primary key, ' +
      '"name" varchar(255), ' +
      '"description" text, ' +
      '"start_at" datetime, ' +
      '"end_at" datetime, ' +
      '"period_ms" integer, ' +
      '"image" varchar(255), ' +
      '"location_name" varchar(255), ' +
      '"location_city" varchar(255), ' +
      '"location_state" varchar(255), ' +
      '"location_country" varchar(255), ' +
      '"location_street" varchar(255), ' +
      '"location_zip" varchar(255), ' +
      '"status" varchar(255), ' +
      '"type" varchar(255), ' +
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

    var sql = 'drop table "festivals"';

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

  var saveFestival = function saveFestival(festival, callback) {
    var sql = 'insert into "festivals" ' +
      '(' +
      '"id",' +
      '"name",' +
      '"description",' +
      '"start_at",' +
      '"end_at",' +
      '"period_ms",' +
      '"image",' +
      '"location_name",' +
      '"location_city",' +
      '"location_state",' +
      '"location_country",' +
      '"location_street",' +
      '"location_zip",' +
      '"status",' +
      '"type",' +
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
      '?,' +
      '?,' +
      '?' +
      ')';

    database.executeSQL(sql,
      [
        festival.id,
        festival.name,
        festival.description,
        festival.duration.startAt,
        festival.duration.finishAt,
        festival.duration.periodMs,
        festival.mainImage.large,
        festival.locations[0].name,
        festival.locations[0].city,
        festival.locations[0].state,
        festival.locations[0].country,
        festival.locations[0].street,
        festival.locations[0].zip,
        festival.status,
        festival.type,
        festival.createdAt,
        festival.updatedAt,
        festival.publishedAt
      ],
      (row) => {
        console.log('on saveFestival row : ', row);
      },
      (error) => {
        console.log('on saveFestival completed ', error);
        return callback(error, null);
      });
  };

  var saveFestivals = function saveFestivals(festivals, callback) {
    async.map(festivals, saveFestival, callback);
  };

  var fetchFestivals = function fetchFestivals(callback) {
    fetch(API_URL + FESTIVALS_RESOURCE_NAME + FESTIVALS_QUERY)
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
        return callback(error, []);
      })
      .then((responseData) => {

        var festivals = responseData.festivals;
        //filter?

        saveFestivals(festivals, function (err) {
          return callback(err, festivals);
        });
      })
      .done();
  };

  var getFestivals = function getFestivals(callback) {
    loadFestivals(function (err, festivals) {
      if (err) {
        console.error(err);
        return callback(err, festivals);
      }

      if (festivals && festivals.length > 0) {
        console.log(festivals);
        return callback(null, festivals);
      }

      dropTable(function (/*err*/) {
        initTable(function (/*err*/) {
          fetchFestivals(function (err, festivals) {
            if (err) {
              console.error(err);
            }
            return callback(err, festivals);
          });
        });
      });
    });
  };

  return {
    getFestivals: getFestivals
  };
};

module.exports = {
  FestivalsAdapter: FestivalsAdapter
};
