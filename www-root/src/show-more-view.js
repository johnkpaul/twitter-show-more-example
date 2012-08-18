/*global Backbone:false, _:false*/
/*
 * show-more-view
 * https://github.com/jpaul/show-more-view
 *
 * Copyright (c) 2012 John K. Paul
 * Licensed under the MIT license.
 */

(function($, global) {
    global.TwitterCollection = Backbone.Collection.extend({
        url:'/search',
        comparator:function(tweet){
            return tweet.get('id').toString();
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
