module.exports = function (grunt) {

    var tasks = [
        'jshint',
        'uglify'
    ];

    var integrate = [
        'jasmine'
    ];
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*\n' +
            '* <%= pkg.name %> v.<%= pkg.version %>\n' +
            '* Rob Taylor. MIT ' + new Date().getFullYear() + '\n' +
            '*/\n',
//        wrapStart: '(function(){\n',
//        wrapEnd: '\n}());\n',
        jasmine: {
            cobra: {
                src: 'build/schema.js',
                options: {
                    specs: 'test/spec/*-spec.js',
                    helpers: 'test/spec/*-helper.js'
                }
            }
        },
        jshint: {
            // define the files to lint
            files: ['src/**/*.js'],
            // configure JSHint (documented at http://www.jshint.com/docs/)
            options: {
                // more options here if you want to override JSHint defaults
                globals: {
                    loopfunc: false
                }
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
                    wrap: '<%= pkg.packageName %>',
                    banner: '<%= banner %>'
                },
                files: {
                    './build/<%= pkg.filename %>.js': [
                        'src/prototype/*.js',
                        'src/**/_namespace.js',
                        'src/utils/*.js',
                        'src/validators/*.js',
                        'src/core/*.js',
                        'src/**/*.js'
                    ]
                }
            },
            build_min: {
                options: {
                    wrap: '<%= pkg.packageName %>',
                    banner: '<%= banner %>',
                    report: 'gzip',
                    exportAll: true
                },
                files: {
                    './build/<%= pkg.filename %>.min.js': [
                        'src/prototype/*.js',
                        'src/**/_namespace.js',
                        'src/utils/*.js',
                        'src/validators/*.js',
                        'src/core/*.js',
                        'src/**/*.js'
                    ]
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.registerTask('default', tasks);
    grunt.registerTask('integrate', integrate);
};