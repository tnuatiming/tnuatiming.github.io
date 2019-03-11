
module.exports = function(grunt) {

  // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
    
        shell: {
            importPosts: {
                command: 'python import_posts.py && cp this_is_index_dot_html.md content/results/'
            },
            hugo: {
                command: 'hugo --debug' //  --minify
            },
            hugoServe: {
                command: 'hugo server -D --debug'
            },
            hugoBuild: {
                command: 'hugo --debug'
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
                command: 'htmlproofer ./_site --disable-external --check-html  --alt-ignore "/.*/" --trace --file-ignore /liveepic/'
            },
        //     googleClosureCompiler: {
        //       command: 'npx google-closure-compiler --compilation_level SIMPLE --js=live1/elite.js --js_output_file=live1/elite.min.js && npx google-closure-compiler --compilation_level SIMPLE --js=live/elite.js --js_output_file=live/elite.min.js'
        //     },
            lftp: {
        //        command: 'lftp -u raz tnuatiming.com/ -e "set ssl:verify-certificate no ; set ssl:check-hostname false ; set ftp:ssl-allow no ; set mirror:set-permissions off ; mirror --reverse --parallel=5 --ignore-time --exclude .well-known/ -vvv ./_site/ ./public_html/ ; cache flush ; rm ./public_html/live/p1.html ; rm ./public_html/live1/p1.html ; exit" | tee "log/lftp_$(date +%Y%m%d_%H%M).log"'
                command: 'lftp -u raz tnuatiming.com/ -e "set ssl:verify-certificate no ; set ssl:check-hostname no ; set ftp:ssl-allow no ; set mirror:set-permissions off ; mirror --reverse --parallel=5 --ignore-time --exclude .well-known/ --exclude-glob .directory --exclude-glob */2013/* --exclude-glob */2014/* --exclude-glob */2015/* --exclude-glob */2016/* --exclude-glob */2017/* -vvv ./_site/ ./public_html/ ; cache flush ; exit" | tee "lftp.log"'
            },
            clean: {
                command: 'if [ -d "_site" ]; then rm -Rf _site; fi && if [ -d "hugo_backup" ]; then rm -Rf hugo_backup; fi '
            },
            cleanAfterHugo: {
                command: 'if [ -f "_site/live.html" ]; then rm "_site/live.html"; fi && if [ -f "_site/live1.html" ]; then rm "_site/live1.html"; fi && if [ -f "_site/liveepic.html" ]; then rm "_site/liveepic.html"; fi && if [ -f "_site/.html" ]; then rm "_site/.html"; fi && if [ -f "_site/.directory" ]; then rm "_site/.directory"; fi  '
            }
        },
    
        'closure-compiler': {
            my_target: {
                files: {
                    './_site/liveepic/elite_epic_total.js': ['./_site/liveepic/elite_epic_total.js'],
                    './_site/liveepic/elite_epic.js': ['./_site/liveepic/elite_epic.js'],
                    './_site/live1/elite.js': ['./_site/live1/elite.js'],
                    './_site/live/elite.js': ['./_site/live/elite.js']
//                    '_includes/alignTable.min.js': ['_includes/alignTable.js'],
//                    '_includes/raceProgress.min.js': ['_includes/raceProgress.js']
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
                    src: ['**/*.html', '!csv/index.html', '!live/p1.html', '!live1/p1.html', '!liveepic/index.html', '!liveepic/p1.html', '!liveepic/stage1/p1.html', '!liveepic/stage2/p1.html', '!liveepic/stage3/p1.html', '!liveepic/stage4/p1.html', '!liveepic/p11.html', '!liveepic/p12.html', '!**/2013/*.html', '!**/2014/*.html', '!**/2015/*.html', '!**/2016/*.html', '!**/2017/*.html' ],
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
                tasks: ['shell:hugoBuild']
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
                    dest: './_site/hugo_backup',
                    src: ['_posts', 'content', 'layouts', '!hugo_backup', 'static/software', 'static/manual', 'static/images', 'static/live', 'static/live1', 'static/liveepic', 'static/livex', 'static/style', 'static/english', '!node_modules','!assets', '!_site', '!log', '!archetypes', '!data', '!themes', '!.git']
                }]
            }
        },

        zip: {
            './_site/hugo_backup/main.zip': ['*', '!.tt', '!id_rsa', '!id_rsa.pub', '.htaccess', '_config.yml', '!password_protect.php', '!.directory'],
            './_site/hugo_backup/mains.zip': ['static/*', '!static/.directory']
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
//    require('google-closure-compiler').grunt(grunt);
    require('google-closure-compiler').grunt(grunt, {platform: ['native', 'javascript', 'java']});

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
    grunt.registerTask('default', ['shell:hugoBuild', 'shell:htmlproof', 'connect', 'watch']);
    grunt.registerTask('html', ['htmlmin']);
    grunt.registerTask('css', ['cssmin']);
    grunt.registerTask('serve', ['shell:hugoServe']);
    grunt.registerTask('build', ['shell:hugoBuild']);
    grunt.registerTask('git', ['shell:gitUpdate']);
    grunt.registerTask('csv', ['shell:csvUpdate']);
    grunt.registerTask('htmlproof', ['shell:htmlproof']);
    grunt.registerTask('upload', ['shell:hugoBuild', 'html', 'css', 'shell:lftp', 'shell:gitUpdate']);
    grunt.registerTask('backup', ['zip_directories', 'zip']);
    grunt.registerTask('ftp', ['shell:clean', 'shell:importPosts', 'shell:csvUpdate', 'zip_directories', 'zip', 'shell:hugo', 'shell:cleanAfterHugo', 'closure-compiler', 'cssmin', 'htmlmin', 'shell:htmlproof', 'shell:lftp', 'shell:clean']);
    grunt.registerTask('lftp', ['shell:lftp']);
    //  grunt.registerTask('ftp', ['shell:hugoBuild', 'replace', 'ftp_push']);
    //  grunt.registerTask('upload', ['shell:hugoBuild', 'replace', 'ftp_push', 'shell:gitUpdate']);
    // grunt.registerTask('ftp', ['shell:hugoBuild', 'html', 'css', 'ftp_push']);

};
