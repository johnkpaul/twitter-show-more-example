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
        },
        render:function(){
            _.bindAll(this, 'createTweetViews', 'addTweetViewFromModel');
            this.collection.fetch().then(this.createTweetViews);
            var template = window.Handlebars.templates.twitter_view();
            return this.$el.html(template);
        },
        addTweetViewFromModel:function(model){
                var view = new global.TweetView({model:model});
                view.render().appendTo(this.$('.js-tweets'));
        },
        createTweetViews:function(){
            this.collection.each(this.addTweetViewFromModel);
            
        }
    });

    global.TweetView = Backbone.View.extend({
        render:function(){
            var data = this.model.toJSON();
            var template = window.Handlebars.templates.tweet_view(data);
            return this.$el.html(template);
        }
    });

    global.TwitterModel = Backbone.Model.extend({
        defaults:{}
    });

    global.TwitterCollection = Backbone.Collection.extend({
        url:'http://localhost:3000/',
        model:global.TwitterModel,
        comparator:function(tweet){
            var id = tweet.get('id').toString();
            var reversed = Array.prototype.slice.call(id).reverse().join("");
            return reversed;
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
            args[0].data.last_fetched_id = this.last_fetched_id;
            var def = Backbone.Collection.prototype.fetch.apply(this, args);
            def.then(_.bind(function(){
                this.last_fetched_id = this.last().get('id');
            }, this));
            return def;
        }
    });


}(jQuery, this));
