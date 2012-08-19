$(function(){

    var twitterCollection = new window.TwitterCollection();
    var twitterView = new window.TwitterView({collection:twitterCollection});
    twitterView.render().appendTo(document.body);
});
