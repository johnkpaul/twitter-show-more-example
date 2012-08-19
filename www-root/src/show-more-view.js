/*global Backbone:false, _:false*/
/*
 * show-more-view
 * https://github.com/jpaul/show-more-view
 *
 * Copyright (c) 2012 John K. Paul
 * Licensed under the MIT license.
 */

(function($, global) {

    global.TwitterView = Backbone.View.extend({
        initialize:function(options){
            _.bindAll(this, 'createTweetViews',
                            'addTweetViewFromModel',
                            'onRender');
            this.on('rendered', this.onRender);
        },
        onRender:function(){
            var collection = this.collection;
            this.collection.bind('add', this.addTweetViewFromModel);
            this.interval = global.setInterval(function(){
                collection.fetch(); 
            }, 10000);
        },
        render:function(){
            this.collection.fetch().then(this.createTweetViews);
            var template = global.Handlebars.templates.twitter_view();
            this.trigger('rendered');
            return this.$el.html(template);
        },
        addTweetViewFromModel:function(model){
                var view = new global.TweetView({model:model});
                view.render().prependTo(this.$('.js-tweets'));
        },
        createTweetViews:function(){
            this.collection.each(this.addTweetViewFromModel);
        }
    });

    global.TweetView = Backbone.View.extend({
        render:function(){
            var data = this.model.toJSON();
            var template = global.Handlebars.templates.tweet_view(data);
            return this.$el.html(template);
        }
    });

    global.TweetModel = Backbone.Model.extend({
        defaults:{
            metadata:{result_type:'test'}
        }
    });

    global.TwitterCollection = Backbone.Collection.extend({
        url:'http://localhost:3000/',
        model:global.TweetModel,
        comparator:function(tweet){
            var id = tweet.get('id').toString();
            return id;
        },
        fetch:function(){
            var args = Array.prototype.slice.call(arguments);
            if (typeof args[0] !== "object"){
                args[0] = {};
            }
            if (typeof args[0].data !== "object"){
                args[0].data = {};
            }
            if ("last_fetched_id" in this){
                args[0].data.last_fetched_id = this.last_fetched_id;
            }
            args[0].add = true;
            var def = Backbone.Collection.prototype.fetch.apply(this, args);
            def.then(_.bind(function(){
                this.last_fetched_id = this.last().get('id');
            }, this));
            return def;
        }
    });


}(jQuery, this));
