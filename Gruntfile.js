 module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
 shell: {
      jekyllServe: {
        command: "bundle exec jekyll serve"
      },
      jekyllBuild: {
        command: "bundle exec jekyll build"
      },
      guard: {
        command: " bundle exec guard"
      }
},
                 
 cssmin: {
  target: {
    files: [{
      expand: true,
      cwd: 'style',
      src: ['*.css', '!*.min.css'],
      dest: 'release/css',
      ext: '.min.css'
    }]
  }
},

 htmlmin: {                                     // Task 
    dist: {                                      // Target 
      options: {                                 // Target options 
        removeComments: true,
        collapseWhitespace: true
        
      },
      files: [{                                   // Dictionary of files 
        cwd: '_site/results',
        src: '**/*.html',
        dest: '_site/results/views',
       expand: true    // 'destination': 'source' 
      }]
    },
 //   dev: {                                       // Another target 
  //    options: {                                 // Target options 
 //       removeComments: true,
 //       collapseWhitespace: true
 //     },
  //    files: {
 //       'release/index.html': 'index.html',
 //       'release/contact.html': 'contact.html'
 //     }
  //  }
  },

 connect: {
    server: {
      options: {
        port: 4000,
        base: './_site'
      }
    }
  },

  watch: {
      options: {
        spawn: false,
        livereload: true
      },
      site: {
        files: ["index.html", "_layouts/*.html", "_posts/*.html", "results/*.html", "style/*.css", "_includes/*.html", "live/*.html", "english/*.html"],
        tasks: ["shell:jekyllBuild"]
      },
//      js: {
//        files: ["js/*.js"],
//        tasks: ["uglify", "shell:jekyllBuild"]
//      },
//      css: {
 //       files: ["scss/*.scss"],
//        tasks: ["sass", "autoprefixer", "shell:jekyllBuild"]
//      },
//      svgIcons: {
//        files: ["svg/*.svg"],
//        tasks: ["svgstore", "shell:jekyllBuild"]
//      }
    }

  
  });

  
  require('load-grunt-tasks')(grunt);
  // Load the plugin that provides the "uglify" task.
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-htmlmin');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-connect');
// Default task(s).
  grunt.registerTask('default', ["shell:jekyllBuild", "connect", "watch"]);
  grunt.registerTask('html', ['htmlmin']);
  grunt.registerTask('css', ['cssmin']);
  grunt.registerTask("serve", ["shell:jekyllServe"]);
  grunt.registerTask("build", ["shell:jekyllBuild"]);
  grunt.registerTask("guard", ["shell:guard"]);

};
