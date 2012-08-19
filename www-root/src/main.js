$(function(){

    var twitterCollection = window.tc = new window.TwitterCollection();
    var twitterView = new window.TwitterView({collection:twitterCollection});
    twitterView.render().appendTo(document.body);
});
