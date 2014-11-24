
module.exports = function(grunt) {
  var config = {
    pkg: grunt.file.readJSON('package.json'),
    stylus: {
      compile: {
        options: {
          urlfunc: 'embedurl',
          import: ['_settings'],
          use: [ require('axis-css') ]
        },
        files: [{
          expand: true,
          cwd: 'assets/stylus',
          src: ['*.styl', '!_*.styl'],
          dest: 'public/css',
          ext: '.css'
        }]
      }
    },
    watch: {
      stylus: {
        files: ['assets/**/*.styl'],
        tasks: ['css'],
        options: {
          spawn: false,
          livereload: true
        }
      }
    }
  };

  grunt.initConfig(config);

  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('css', [ 'stylus' ]);

  grunt.registerTask('default', ['css']);
  grunt.registerTask('dev', ['css', 'watch']);


  grunt.event.on('watch', function(action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });
}