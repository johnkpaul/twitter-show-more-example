/*global module:false, require:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', '<file_strip_banner:src/<%= pkg.name %>.js>'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    lint: {
      files: ['grunt.js', './www-root/src/*', 'test/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    jshint: {
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
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {}
  });

  // Default task.
  var connect = require('connect');
  var http = require('http');
  var url = require('url');
  var Ntwitter = require('ntwitter');
  var config = require('./config');
  var CORS = require('connect-xcors');

  grunt.registerTask('default', 'lint qunit concat min');
  grunt.registerTask('server', 'Start a connect server for twitter API', function() {
    grunt.log.writeln('starting connect server on port 3000');


    var twitter = new Ntwitter(config);
    var done = this.async();
    var app = connect()
      .use(CORS({}))
      .use(connect.logger('dev'))
      .use(function(req, res){
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        var since_id = query['last_fetched_id'];
        if(!since_id){ since_id = 236905249166741500; }
        twitter.search('NYC OR #nyc OR new york city', {since_id:since_id}, function(err, data) {
          res.end(JSON.stringify(data.results));
        });
      });
     http.createServer(app).listen(3000).on('close', done);
     connect(connect['static']('www-root')).listen(1234);
  });


};
