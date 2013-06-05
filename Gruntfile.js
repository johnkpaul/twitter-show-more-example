/*global module:false, require:false*/
module.exports = function(grunt) {

  grunt.initConfig({
    qunit: {
      files: ['www-root/test/**/*.html']
    },
    watch: {
      files: ['./**/*.js', './**/*.handlebars'],
      tasks: 'lint handlebars qunit'
    },
    jshint: {
      files: ['grunt.js', './www-root/src/show-more-view.js', 'www-root/test/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          'ok': false,
          'jQuery': false
        }
      }
    },
    uglify: {},
    handlebars: {
        all: {
          src: 'www-root/src',
          dest: 'www-root/src/templates.js'
        }
      }
  });

  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');


  grunt.registerTask('default', ['jshint', 'qunit']);
  grunt.registerTask('server', 'Start a connect server for twitter API', function() {
    var connect = require('connect');
    var http = require('http');
    var url = require('url');
    var Ntwitter = require('ntwitter');
    var config = require('./config');
    var CORS = require('connect-xcors');

    grunt.log.writeln('starting connect server on port 3000');


    var twitter = new Ntwitter(config);
    var done = this.async();
    var app = connect()
      .use(CORS({}))
      .use(connect.logger('dev'))
      .use(function(req, res){
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        var data_to_send = {};
        var since_id = query['last_fetched_id'];
        if(since_id){ data_to_send['since_id'] = since_id; }
        twitter.search('NYC OR #nyc OR new york city', data_to_send, function(err, data) {
          try{
            res.end(JSON.stringify(data.results));
          }
          catch(e){
            res.end(JSON.stringify([]));
          }
        });
      });
     http.createServer(app).listen(3000).on('close', done);
     connect(connect['static']('www-root')).listen(1234);
  });


};
