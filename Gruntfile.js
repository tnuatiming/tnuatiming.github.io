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
      gitUpdate: {
        command: "./gitup.sh"
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
        files: ["index.html", "terms.html", "_layouts/*.html", "_posts/*", "results/*.html", "style/*", "_includes/*.html", "live/*.html", "assets/*", "english/*.html"],
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
    },
   
replace: {
  minify: {
    src: ['_site/results/**/*.html', '_site/style/*.css'],
    overwrite: true,                 // overwrite matched source files
    replacements: [{
      from: /\n/g,
      to: " "
    }]
  }
},

ftpush: {
  build: {
    auth: {
      host: 'tnuatiming.com',
      port: 21,
      authKey: 'key1'
    },
    src: '_site',
    dest: 'public_html',
    simple: true
 //   exclusions: ['_site/images', '_site/software/**/*', '_site/manual/**/*', '_site/live', '_site/*.ico', '_site/*.png'],
 //   keep: ['/public_html/images/**/*', '/public_html/manual/**/*', '/public_html/software/**/*',]
  }
}
  
});

require('load-grunt-tasks')(grunt);
// Load the plugin that provides the "uglify" task.
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-htmlmin');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-connect');
grunt.loadNpmTasks('grunt-contrib-ftpush');
grunt.loadNpmTasks('grunt-text-replace');


// Default task(s).
  grunt.registerTask('default', ["shell:jekyllBuild", "connect", "watch"]);
  grunt.registerTask('html', ['htmlmin']);
  grunt.registerTask('css', ['cssmin']);
  grunt.registerTask("serve", ["shell:jekyllServe"]);
  grunt.registerTask("build", ["shell:jekyllBuild"]);
  grunt.registerTask("ftp", ["shell:jekyllBuild", "replace", "ftpush"]);
  grunt.registerTask("git", ["shell:gitUpdate"]);
  grunt.registerTask("upload", ["shell:jekyllBuild", "replace", "ftpush", "shell:gitUpdate"]);

};
