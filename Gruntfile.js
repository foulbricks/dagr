module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

		project: {
			app: ["app"],
			assets: ["<%= project.app %>/assets"],
			sass: ["<%= project.assets %>/sass/styles.scss"]
		},

        clean: {
			js: ["public/dist/modules", "public/dist/views", "public/dist/assets/js", ".tmp/"],
			css: ["public/dist/assets/css", "public/dist/assets/fonts", ".tmp"]
		},

        copy: {
            main: {
                expand: true,
                cwd: 'app/angular',
                src:['views/*.html', '**/**/views/*.html'],
                dest: 'public/dist/'
            },
			fonts: {
				files: [{
					expand: true,
					cwd: "app/assets/lib/bootstrap-sass-official/assets/fonts",
					src: ["bootstrap/*.*"],
					dest: "public/dist/assets/fonts"
				}, {
					expand: true,
					cwd: "app/assets/lib/fontawesome/fonts",
					src: ["*.*"],
					dest: "public/dist/assets/fonts"
				}]
			}
        },

		sass: {
			dev: {
				options: {
					style: "expanded",
					compass: false
				},
				files: {
					'<%= project.assets %>/stylesheets/style.css':'<%= project.sass %>'
				}
			}
		},

        useminPrepare: {
            html: 'app/angular/views/index.html',
			options: {
		    	dest: 'public',
				root: "app"
		    }
        },

        usemin: {
            html: ['public/dist/views/index.html']
        },

		concat: {
			options: {
				separator: ';',
	    	}
		},

        uglify: {
            options: {
                report: 'min',
                mangle: true,
				sourceMap: true
            }
        },

		watch: {
			scripts: {
				files: ["app/angular/**.js", "app/angular/modules/**/*.js", 'app/angular/views/*.html', 'app/angular/**/**/views/*.html'],
				tasks: ["buildjs"]
			},
			// html: {
			// 	files: ['app/angular/views/*.html', 'app/angular/**/**/views/*.html'],
			// 	tasks: ["copy:main"]
			// },
			sass: {
				files: '<%= project.assets %>/sass/{,*/}*.{scss,sass}',
				tasks: ["buildcss"]
			}
		},
		
		nodemon: {
			dev: {
				script: "scripts/www",
				options: {
					nodeArgs: ["--debug"],
					watchedExtensions: ["js"],
					ignore: ["node_modules/**", "public/**"],
					env: {
						PORT: "3000"
					}
				}
			}
		},
		
		concurrent: {
			tasks: ["nodemon", "watch"],
			options: {
				logConcurrentOutput: true
			}
		}
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks("grunt-concurrent");

	grunt.registerTask("buildjs", [
		"clean:js",
		"copy:main",
		"useminPrepare",
		"concat",
		"uglify",
		"usemin"
	]);
	
	grunt.registerTask("buildcss", [
		"clean:css",
		"copy:fonts",
		"sass:dev",
		"useminPrepare",
		"concat",
		"cssmin",
		"usemin"
	]);

    // Tell Grunt what to do when we type "grunt" into the terminal
    grunt.registerTask('default', ["concurrent"]);

};