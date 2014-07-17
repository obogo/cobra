module.exports = function (grunt) {

    var tasks = [
        'uglify'
    ];
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*\n' +
            '* <%= pkg.name %> v.<%= pkg.version %>\n' +
            '* Rob Taylor. MIT ' + new Date().getFullYear() + '\n' +
            '*/\n',
        uglify: {
            build: {
                options: {
                    mangle: false,
                    compress: false,
                    preserveComments: 'some',
                    beautify: true,
                    exportAll: true,
//                    wrap: '<%= pkg.packageName %>',
                    banner: '<%= banner %>'
                },
                files: {
                    './build/<%= pkg.filename %>.js': [
                        'src/**/*.js'
                    ]
                }
            },
            build_min: {
                options: {
//                    wrap: '<%= pkg.packageName %>',
                    banner: '<%= banner %>',
                    exportAll: true
                },
                files: {
                    './build/<%= pkg.filename %>.min.js': [
                        'src/**/*.js'
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', tasks);

};