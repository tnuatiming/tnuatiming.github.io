
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
                command: ['printf "$(tput setaf 1)\nplease provide description for git:\n\n$(tput sgr0)"','./gitup_descr.sh'
                ].join('&&')
            },
            csvUpdate: {
        //        command: './convert_html_to_csv.sh'
                command: 'python convert_html_to_csv.py'
            },
            htmlproof: {
                command: 'htmlproofer ./_site --disable-external --check-html --alt-ignore --trace'
            },
        //     googleClosureCompiler: {
        //       command: 'npx google-closure-compiler --compilation_level SIMPLE --js=live1/elite.js --js_output_file=live1/elite.min.js && npx google-closure-compiler --compilation_level SIMPLE --js=live/elite.js --js_output_file=live/elite.min.js'
        //     },
            lftp: {
        //        command: 'lftp -u raz tnuatiming.com/ -e "set ssl:verify-certificate no ; set ssl:check-hostname false ; set ftp:ssl-allow no ; set mirror:set-permissions off ; mirror --reverse --parallel=5 --ignore-time --exclude .well-known/ -vvv ./_site/ ./public_html/ ; cache flush ; rm ./public_html/live/p1.html ; rm ./public_html/live1/p1.html ; exit" | tee "log/lftp_$(date +%Y%m%d_%H%M).log"'
                command: 'lftp -u raz tnuatiming.com/ -e "set ssl:verify-certificate no ; set ssl:check-hostname no ; set ftp:ssl-allow no ; set mirror:set-permissions off ; mirror --reverse --parallel=5 --ignore-time --exclude .well-known/  -vvv ./_site/ ./public_html/ ; cache flush ; exit" | tee "log/lftp.log"'
            },
            clean: {
                command: 'rm -r ./_site && rm -r ./jekyll_backup '
            }
        },
    
        'closure-compiler': {
            my_target: {
                files: {
                    'liveepic/elite.min.js': ['liveepic/elite_epic.js'],
                    'live1/elite.min.js': ['live1/elite.js'],
                    'live/elite.min.js': ['live/elite.js'],
                    '_includes/alignTable.min.js': ['_includes/alignTable.js'],
                    '_includes/raceProgress.min.js': ['_includes/raceProgress.js']
                },
                options: {
                //   js: '/node_modules/google-closure-library/**.js',
                //  manage_closure_dependencies: true,
                //   warning_level: 'VERBOSE',
                    compilation_level: 'SIMPLE' // ADVANCED
                }
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
                    minifyJS: true,
                    minifyCSS: true,
                    collapseWhitespace: true
                    
                },
                files: [{                                   // Dictionary of files 
                    cwd: '_site',
                    src: ['**/*.html', '!csv/index.html', '!liveepic/index.html', '!liveepic/p11.html', '!liveepic/p12.html' ],
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
                files: ['index.html', 'terms.html', '_layouts/*.html', '_posts/*', 'results/*.html', 'style/*', '_includes/*.html', 'live/*.html', 'live1/*.html', 'assets/*', 'english/*.html'],
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
                    src: ['*','!jekyll_backup','!software','!images','!node_modules','!assets', '!_site', '!manual', '!log']
                }]
            }
        },

        zip: {
            './jekyll_backup/main.zip': ['*', '!id_rsa', '!id_rsa.pub', '.htaccess', '_config.yml', '!password_protect.php']
        },
  
        ftp_push: {
            your_target: {
                options: {
                    authKey: "key1",
                    host: "tnuatiming.com",
                    dest: "public_html",
                    port: 21,
                    incrementalUpdates: "false"
                },
                files: [
                {
                expand: true,
                cwd: '_site/',
                src: [
                    "**",
                    "!software/"
                ]
                }
                ]
            }
        },


        // old
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
    require('google-closure-compiler').grunt(grunt);

    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    //grunt.loadNpmTasks('grunt-ftpush');
    //grunt.loadNpmTasks('grunt-ftp-push');
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
    grunt.registerTask('csv', ['shell:csvUpdate']);
    grunt.registerTask('htmlproof', ['shell:htmlproof']);
    grunt.registerTask('upload', ['shell:jekyllBuild', 'html', 'css', 'shell:lftp', 'shell:gitUpdate']);
    grunt.registerTask('backup', ['zip_directories', 'zip']);
    grunt.registerTask('ftp', ['shell:csvUpdate', 'closure-compiler', 'zip_directories', 'zip', 'shell:jekyllBuild', 'shell:htmlproof', 'html', 'css', 'shell:lftp', 'shell:clean']);
    grunt.registerTask('lftp', ['shell:lftp']);
    //  grunt.registerTask('ftp', ['shell:jekyllBuild', 'replace', 'ftp_push']);
    //  grunt.registerTask('upload', ['shell:jekyllBuild', 'replace', 'ftp_push', 'shell:gitUpdate']);
    // grunt.registerTask('ftp', ['shell:jekyllBuild', 'html', 'css', 'ftp_push']);

};
