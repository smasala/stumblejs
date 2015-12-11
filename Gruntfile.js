/* globals module */
module.exports = function(grunt){
    'use strict';
    
    grunt.loadNpmTasks("grunt-babel");
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("grunt-version");
    grunt.loadNpmTasks("grunt-jscs");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-concurrent");
    grunt.loadNpmTasks("grunt-sass");
    grunt.loadNpmTasks("grunt-http-server");

    grunt.initConfig({
        concurrent: {
            options: {
              logConcurrentOutput: true
            },
            dev: {
              tasks: ["http-server", "watch:allJS", "watch:css"]
            }
        },
        watch: {
            codestyle: {
                files: [ "./src/**/*.js"  ],
                tasks: [ "jscs", "jshint" ]
            },
            css: {
                files: [ "./src/scss/**/*.scss" ],
                tasks: [ "sass" ]
            },
            browserify: {
                files: [ "./src/**/*.js"  ],
                tasks: [ "browserify" ]
            },
            allJS: {
                files: [ "./src/**/*.js"  ],
                tasks: [ "browserify", "jscs", "jshint" ]
            }
        },
        version: {
            readme: {
                options: {
                    prefix: "#version:\\s*"
                },
                src: [ "readme.md" ]
            },
            comments: {
                options: {
                    prefix: "\\* @version\\s*"
                },
                src: [ "src/*.js" ]
            },
            defaults: {
                src: [ "src/*.js", "bower.json", "yuidoc.json" ]
            }
        },
        sass: {
            options: {
                sourceMap: true
            },
            src: {
                files: {
                    "./src/css/styles.css": "./src/scss/styles.scss"
                }
            }
        },
        jscs: {
            src: "./src/**/*.js",
            options: {
                config: ".jscsrc",
                force: true
            }
        },
        jshint: {
            options: {
                jshintrc: ".jshintrc",
                reporter: require( "jshint-stylish" ),
                force: true
            },
            all: {
                src: [ "Gruntfile.js", "./src/**/*.js" ]
            }
        },
        browserify: {
            options: {
                transform: [["babelify", {presets: ["es2015"]}]]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.js'],
                    dest: 'dist/'
                }]
            }
        },
        "http-server": {
            dev: {
                // the server root directory 
                root: "./",
                // the server port 
                // can also be written as a function, e.g. 
                // port: function() { return 8282; } 
                port: 8080,
                // the host ip address 
                // If specified to, for example, "127.0.0.1" the server will 
                // only be available on that ip. 
                // Specify "0.0.0.0" to be available everywhere 
                host: "localhost",
                showDir : true,
                autoIndex: true,
                // server default file extension 
                ext: "html",
                // run in parallel with other tasks 
                runInBackground: false,
                // Tell grunt task to open the browser 
                openBrowser : true
            }
        }
    });
    
    
    grunt.registerTask("dev", ["browserify", "sass", "jscs", "jshint", "concurrent:dev"]);
    grunt.registerTask("prod", ["version", "browserify", "sass", "jscs", "jshint"]);
    //grunt.registerTask("default", []);
};

