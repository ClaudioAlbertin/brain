module.exports = function (grunt) {

  // configure grunt
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
      ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= pkg.license %> \n */\n',
    jshint: {
      options: {
        camelcase: true,
        eqeqeq: true,
        forin: true,
        immed: true,
        indent: 2,
        latedef: true,
        newcap: true,
        noarg: true,
        noempty: true,
        nonew: true,
        quotmark: 'single',
        trailing: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        expr: true,
        node: true,
        browser: true,
        strict: false,
        laxcomma: true,
        globals: {
          before: false,
          after: false,
          beforeEach: false,
          afterEach: false,
          describe: false,
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
        ignore: ['lapack'],
        src: '<%= pkg.directories.lib %>/**/*.js',
        dest: '<%= pkg.directories.build %>/<%= pkg.name %>.client.js'
      }
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      client: {
        src: '<%= pkg.directories.build %>/**/*.client.js',
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
      client: {
        src: '<%= concat.client.dest %>',
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
  grunt.registerTask('build', ['jshint:library', 'simplemocha', 'browserify', 'concat:client', 'uglify:client']);
  grunt.registerTask('default', ['jshint', 'simplemocha', 'browserify', 'concat:client', 'uglify:client']);

};
