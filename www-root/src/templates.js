(function(){var a=Handlebars.template,b=Handlebars.templates=Handlebars.templates||{};b.tweet_view=a(function(a,b,c,d,e){c=c||a.helpers;var f="",g,h,i=this,j="function",k=c.helperMissing,l=void 0,m=this.escapeExpression;return f+='<span class="js-test-tweet-id-',h=c.id,g=h||b.id,typeof g===j?g=g.call(b,{hash:{}}):g===l&&(g=k.call(b,"id",{hash:{}})),f+=m(g)+'"></span>\n',h=c.id,g=h||b.id,typeof g===j?g=g.call(b,{hash:{}}):g===l&&(g=k.call(b,"id",{hash:{}})),f+=m(g)+'\n<img src="',h=c.profile_image_url,g=h||b.profile_image_url,typeof g===j?g=g.call(b,{hash:{}}):g===l&&(g=k.call(b,"profile_image_url",{hash:{}})),f+=m(g)+'">\n',h=c.text,g=h||b.text,typeof g===j?g=g.call(b,{hash:{}}):g===l&&(g=k.call(b,"text",{hash:{}})),f+=m(g)+"\n",f}),b.twitter_view=a(function(a,b,c,d,e){c=c||a.helpers;var f,g=this;return'<div class="js-tweets"></div>\n'})})()