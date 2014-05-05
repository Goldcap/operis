module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-ember-template-compiler');
  grunt.loadNpmTasks('grunt-es6-module-transpiler');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-testem');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-hashres');

  grunt.initConfig({
    uglify: {
        dist: {
            src: 'javascripts/dist/deps.min.js',
            dest: 'javascripts/dist/deps.min.js',
        },
    },
    hashres: {
      options: {
        renameFiles: true
      },
      prod: {
        src: ['javascripts/dist/deps.min.js'],
        dest: 'index.html'
      }
    },
    testem: {
      options: {
        launch_in_dev : ['PhantomJS']
      },
      main: {
        src: ['testem.json']
      }
    },
    watch: {
      options: {
        spawn: false,
        livereload: true
      },
      sources: {
        files: ['javascripts/templates/**/*.handlebars', 'javascripts/app/**/*.js'],
        tasks: ['dev']
      }
    },
    jshint: {
      all: ['javascripts/app/**/*.js'],
      options : {
        esnext : true
      }
    },
    transpile: {
      tests: {
        type: 'amd',
        moduleName: function(path) {
          return 'example/tests/' + path;
        },
        files: [{
          expand: true,
          cwd: 'javascripts/tests/',
          src: '**/*.js',
          dest: 'javascripts/dist/transpiled/tests/'
        }]
      },
      app: {
        type: 'amd',
        moduleName: function(path) {
          return 'example/' + path;
        },
        files: [{
          expand: true,
          cwd: 'javascripts/app/',
          src: '**/*.js',
          dest: 'javascripts/dist/transpiled/app/'
        }]
      }
    },
    concat: {
      dist: {
          src: [
            'javascripts/vendor/jquery/jquery.min.js',
            'javascripts/vendor/handlebars/handlebars.js',
            'javascripts/vendor/ember/ember.min.js',
            'javascripts/lib/loader.js',
            'javascripts/lib/ember-resolver.js',
            'javascripts/dist/transpiled/app/**/*.js',
            'javascripts/dist/tmpl.min.js'],
          dest: 'javascripts/dist/deps.min.js'
      },
      test: {
          src: [
            'javascripts/vendor/jquery/jquery.min.js',
            'javascripts/vendor/handlebars/handlebars.js',
            'javascripts/vendor/ember/ember.js',
            'javascripts/lib/loader.js',
            'javascripts/lib/ember-resolver.js',
            'javascripts/dist/transpiled/app/**/*.js',
            'javascripts/dist/tmpl.min.js',
            'javascripts/dist/transpiled/tests/**/*.js',
            'javascripts/lib/test-loader.js'],
          dest: 'javascripts/dist/deps.min.js'
      }
    },
    emberhandlebars: {
        compile: {
            options: {
                templateName: function(sourceFile) {
                    var newSource = sourceFile.replace('javascripts/templates/', '');
                    return newSource.replace('.handlebars', '');
                }
            },
            files: ['javascripts/templates/**/*.handlebars'],
            dest: 'javascripts/dist/tmpl.min.js'
        }
    }
  });

  grunt.task.registerTask('dev', ['jshint', 'emberhandlebars', 'transpile:app', 'concat:dist']);
  grunt.task.registerTask('local', ['dev', 'watch']);
  grunt.task.registerTask('test', ['jshint', 'emberhandlebars', 'transpile:app', 'transpile:tests', 'concat:test', 'testem:main']);
  grunt.task.registerTask('deploy', ['dev', 'uglify:dist', 'hashres']);
};
