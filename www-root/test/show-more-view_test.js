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

  module('TwitterView Tests', {
    setup: function() {
        this.server = sinon.fakeServer.create();
        this.clock = sinon.useFakeTimers();
        this.collection = new Backbone.Collection([], {model:window.TweetModel});
        this.collection.url = '\\';
        this.view = new window.TwitterView({el:$("#qunit-fixture"),
                                            collection:this.collection});
    },
    teardown: function() {
        this.server.restore();
        this.clock.restore();
    }
  });

  test('TwitterView fetches collection when first rendered', 1, function() {
    var stub = sinon.stub(this.collection, "fetch");
    stub.returns($.Deferred().resolve(true));
    this.view.render();
    ok(stub.calledOnce); 
  });

  test('TwitterView creates TweetView for each incoming tweet', 4, function() {
    var subViewSpy = sinon.spy(window,"TweetView");
    this.view.render();
    this.server.requests[0].respond(
            200,
            {"Content-Type": "application/json"},
            JSON.stringify([{id:1}, {id:2}]));
    ok(subViewSpy.calledWithNew());
    ok(subViewSpy.calledTwice);
    ok(this.view.$('.js-test-tweet-id-1').length);
    ok(this.view.$('.js-test-tweet-id-2').length);
    subViewSpy.restore();
  });

  test('TwitterView fetches collection every 10 seconds to get new results', 3, function() {
    var stub = sinon.stub(this.collection, "fetch");
    stub.returns($.Deferred().resolve(true));
    this.view.render();
    ok(stub.calledOnce); 
    this.clock.tick(10000);
    ok(stub.calledTwice); 
    this.clock.tick(10000);
    ok(stub.calledThrice); 
  });

  test('TwitterView adds new tweet view when new items are provided', 4, function() {
    this.view.render();
    this.server.requests[0].respond(
            200,
            {"Content-Type": "application/json"},
            JSON.stringify([{id:1}, {id:2}]));
    this.collection.fetch({add:true});

    var subViewSpy = sinon.spy(window,"TweetView");

    this.server.requests[1].respond(
            200,
            {"Content-Type": "application/json"},
            JSON.stringify([{id:3}, {id:4}]));

    ok(subViewSpy.calledWithNew());
    ok(subViewSpy.calledTwice);
    ok(this.view.$('.js-test-tweet-id-3').length);
    ok(this.view.$('.js-test-tweet-id-4').length);
    subViewSpy.restore(); 
  });

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

  test('last_fetched_id is calculated, not based on order of retrieval', 1, function() {
    this.collection.fetch();

    this.server.requests[0].respond(
            200,
            {"Content-Type": "application/json"},
            JSON.stringify([{id:"237173666385899520"}, {id:"237173604251484160"}]));

    equal(this.collection.last_fetched_id, "237173666385899520", "collection still stores latest number, even when strings");
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
