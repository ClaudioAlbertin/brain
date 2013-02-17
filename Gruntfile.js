module.exports = function (grunt) {

  // configure grunt
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    jshint: {
      options: {
        camelcase: true,
        eqeqeq: true,
        immed: true,
        indent: 2,
        latedef: true,
        newcap: true,
        noarg: true,
        noempty: true,
        nonew: true,
        quotmark: 'single',
        trailing: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        globals: {
          module: true,
          exports: true,
          process: false,
          require: false,
          describe: false,
          console: false,
          it: false
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      test: {
        src: '<%= pkg.directories.test %>/**/*.js'
      },
      library: {
        src: '<%= pkg.directories.lib %>/**/*.js'
      }
    },
    simplemocha: {
      options: {
        timeout: 3000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'spec'
      },
      all: {
        src: '<%= pkg.directories.test %>/**/*.js'
      }
    },
    browserify: {
      library: {
        src: '<%= pkg.directories.lib %>/**/*.js',
        dest: '<%= pkg.directories.build %>/<%= pkg.name %>.browser.js'
      }
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      browser: {
        src: '<%= browserify.library.dest %>.js',
        dest: '<%= pkg.directories.build %>/<%= pkg.name %>.bundle.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>',
        mangle: {
          except: ['module', 'exports', 'process', 'require', 'Brain']
        }
      },
      browser: {
        src: '<%= concat.browser.dest %>',
        dest: '<%= pkg.directories.build %>/<%= pkg.name %>.min.js'
      }
    }
  });

  // load plugins who provide necessary tasks
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-simple-mocha');

  // register tasks
  grunt.registerTask('test', ['jshint', 'simplemocha']);
  grunt.registerTask('browser', ['jshint:library', 'simplemocha', 'browserify', 'concat:browser', 'uglify:browser']);
  grunt.registerTask('default', ['jshint', 'simplemocha', 'browserify', 'concat:browser', 'uglify:browser']);

};
