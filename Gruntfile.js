module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*\n' +
            '* <%= pkg.name %> <%= pkg.version %>\n' +
            '* Obogo. MIT ' + new Date().getFullYear() + '\n' +
            '*/\n',
        jasmine: {
            cobra: {
                src: 'build/cobra.js',
                options: {
                    specs: 'test/spec/*-spec.js',
                    helpers: 'test/spec/*-helper.js'
                }
            }
        },
        jshint: {
            files: ['src/**/*.js'],
            options: {
                globals: {
                    loopfunc: false
                },
                ignores: [ "src/vendor/D.js" ]
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
                        'src/**/_package_.js',
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
                        'src/**/_package_.js',
                        'src/utils/*.js',
                        'src/validators/*.js',
                        'src/core/*.js',
                        'src/**/*.js'
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.registerTask('default', ['jshint', 'uglify']);
    grunt.registerTask('integrate', ['jasmine']);
};