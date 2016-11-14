module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
        //uglify 설정
        uglify: {
            options: {
                banner: '/* <%= grunt.template.today("yyyy-mm-dd") %>\nauthor: Jung-sun Park\nLicense: MIT\nE-mail:lordreign79@gmail.com\n*/\n'
            },
            build: {
                src: 'static/js/js-spy-scroll/js-spy-scroll.js', //uglify할 대상 설정
                dest: 'static/js/js-spy-scroll/js-spy-scroll.min.js' //uglify 결과 파일 설정
            }
        }
    });
 
    // Load the plugin that provides the "uglify" tasks.
    grunt.loadNpmTasks('grunt-contrib-uglify');
 
    // Default task(s).
    grunt.registerTask('default', ['uglify']);
};