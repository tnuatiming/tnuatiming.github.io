 module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
 shell: {
      jekyllServe: {
        command: 'jekyll serve'
      },
      jekyllBuild: {
        command: 'jekyll build'
      },
      gitUpdate: {
        command: ['echo -e "\n\e[91mPlease provide description for git:\n\e[0m"','./gitup_descr.sh'
        ].join('&&')
      },
      csvUpdate: {
        command: './convert_html_to_csv.sh'
      },
      htmlproof: {
        command: 'htmlproofer ./_site --disable-external --check-html'
      },
      clean: {
        command: 'rm -r ./_site && rm -r ./jekyll_backup'
      }
},
                 
 cssmin: {
  target: {
    files: [{
      expand: true,
      cwd: '_site/style',
      src: ['*.css', '!*.min.css'],
      dest: '_site/style',
 //     ext: '.min.css'
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
        cwd: '_site',
        src: ['**/*.html', '!csv/index.html' ],
        dest: '_site',
       expand: true    // 'destination': 'source' 
      }]
    }
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
        files: ['index.html', 'terms.html', '_layouts/*.html', '_posts/*', 'results/*.html', 'style/*', '_includes/*.html', 'live/*.html', 'assets/*', 'english/*.html'],
        tasks: ['shell:jekyllBuild']
      },
//      js: {
//        files: ['js/*.js'],
//        tasks: ['uglify', 'shell:jekyllBuild']
//      },
//      css: {
 //       files: ['scss/*.scss'],
//        tasks: ['sass', 'autoprefixer', 'shell:jekyllBuild']
//      },
//      svgIcons: {
//        files: ['svg/*.svg'],
//        tasks: ['svgstore', 'shell:jekyllBuild']
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

zip_directories: {
    backup: {
        files: [{
            filter: 'isDirectory',
            expand: true,
            cwd: './',
            dest: './jekyll_backup',
            src: ['*','!jekyll_backup','!software','!images','!node_modules','!assets', '!_site', '!manual']
        }]
    }
},

zip: {
      './jekyll_backup/main.zip': ['*', '!id_rsa', '!id_rsa.pub', '.htaccess', '_config.yml', '!password_protect.php']
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

grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-htmlmin');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-connect');
grunt.loadNpmTasks('grunt-ftpush');
grunt.loadNpmTasks('grunt-text-replace');
grunt.loadNpmTasks('grunt-zip-directories');
grunt.loadNpmTasks('grunt-zip');

// Default task(s).
grunt.registerTask('default', ['shell:jekyllBuild', 'shell:htmlproof', 'connect', 'watch']);
grunt.registerTask('html', ['htmlmin']);
grunt.registerTask('css', ['cssmin']);
grunt.registerTask('serve', ['shell:jekyllServe']);
grunt.registerTask('build', ['shell:jekyllBuild']);
grunt.registerTask('git', ['shell:gitUpdate']);
grunt.registerTask('csv', ['shell:jekyllBuild', 'shell:htmlproof', 'shell:csvUpdate']);
grunt.registerTask('htmlproof', ['shell:htmlproof']);
grunt.registerTask('upload', ['shell:jekyllBuild', 'html', 'css', 'ftpush', 'shell:gitUpdate']);
grunt.registerTask('backup', ['zip_directories', 'zip']);
grunt.registerTask('ftp', ['shell:csvUpdate', 'zip_directories', 'zip', 'shell:jekyllBuild', 'shell:htmlproof', 'html', 'css', 'ftpush', 'shell:clean']);
//  grunt.registerTask('ftp', ['shell:jekyllBuild', 'replace', 'ftpush']);
//  grunt.registerTask('upload', ['shell:jekyllBuild', 'replace', 'ftpush', 'shell:gitUpdate']);
// grunt.registerTask('ftp', ['shell:jekyllBuild', 'html', 'css', 'ftpush']);

};
