module.exports = function (grunt) {

    var tasks = [
        'jshint',
        'ngmin',
        'uglify',
//        'copy'
    ];
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*\n' +
            '* <%= pkg.name %> v.<%= pkg.version %>\n' +
            '* Rob Taylor. MIT ' + new Date().getFullYear() + '\n' +
            '*/\n',
        wrapStart: '(function(){\n',
        wrapEnd: '\n}());\n',
        jshint: {
            // define the files to lint
            files: ['js/**/*.js'],
            // configure JSHint (documented at http://www.jshint.com/docs/)
            options: {
                // more options here if you want to override JSHint defaults
                globals: {
                    loopfunc: false
                }
            }
        },
        watch: {
            scripts: {
                files: ['src/**/*'],
                tasks: tasks,
                options: {
                    spawn: false,
                    debounceDelay: 1000,
                    atBegin: true
                }
            }
        },
        ngmin: {
            client: {
                src: [
                    'src/util/*.js',
                    'src/**/sly.js',
                    'src/**/schema.js',
                    'src/**/model.js',
                    'src/**/*.js'
                ],
                dest: './build/schema.js'
            }
        },
        uglify: {
            build: {
                options: {
                    mangle: false,
                    compress: false,
                    preserveComments: 'some',
                    beautify: true,
                    exportAll: true,
                    banner: '<%= banner %><%= wrapStart %>',
                    footer: '<%= wrapEnd %>'
                },
                files: {
                    './build/schema.js': ['./build/schema.js']
                }
            },
            build_min: {
                options: {
                    wrap: '<%= pkg.packageName %>',
                    banner: '<%= banner %>'
                },
                files: {
                    './build/schema.min.js': ['./build/schema.js']
                }
            }
        },
        copy: {
            main: {
                files: [
//                    {src: ['images/**'], dest: './../public/'},
//                    {src: ['css/**.css'], dest: './../public/'},
//                    {src: ['vendor/**'], dest: './../public/'},
                    {src: ['partials/**'], dest: './../../public/website/'}
                ]
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
//    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-wrap');
    grunt.loadNpmTasks('grunt-ngmin');
//    grunt.loadNpmTasks('grunt-angular-templates');

    grunt.registerTask('default', tasks);

};