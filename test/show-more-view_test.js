/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
/*global sinon:false, Backbone:false*/
(function($) {

  /*
    ======== A Handy Little QUnit Reference ========
    http://docs.jquery.com/QUnit

    Test methods:
      expect(numAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      raises(block, [expected], [message])
  */

  module('TwitterCollection Tests', {
    setup: function() {
        this.server = sinon.fakeServer.create();
        this.collection = new window.TwitterCollection();
    },
    teardown: function() {
        this.server.restore();
    }
  });

  test('After fetching for the first time, last_fetched_id is stored', 1, function() {
    this.collection.fetch();

    this.server.requests[0].respond(
            200,
            {"Content-Type": "application/json"},
            JSON.stringify([{id:1}, {id:2}, {id:3}]));

    equal(this.collection.last_fetched_id, 3, "collection stores last_fetched_id as property");
  });

  test('last_fetched_id is sent back as since_id to twitter api', 1, function() {
    this.collection.last_fetched_id = 2;
    this.collection.fetch();

    var url = this.server.requests[0].url;

    ok(url.indexOf("last_fetched_id=2") !== -1, "last_fetched_id is included as get parameter");
  });

  test('TwitterCollection\'s fetch defaults to add:true', 1, function() {
    var spy = sinon.spy(Backbone.Collection.prototype,"fetch");
    this.collection.fetch();

    ok(spy.args[0][0].add, "collection add option set to true when fetched");
    Backbone.Collection.prototype.fetch.restore();
  });


}(jQuery));
