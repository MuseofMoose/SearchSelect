module.exports = function(config){
    config.set({
    //  root path location that will be used to resolve all relative paths in files and exclude sections, should be the root of your project
    basePath : '../',

    // files to include, ordered by dependencies
    files : [
      // include relevant Angular files and libs
      'SearchSelect/bower_components/angular/angular.js',
      'SearchSelect/bower_components/angular-mocks/angular-mocks.js',
      'SearchSelect/bower_components/angular-sanitize/angular-sanitize.js',

      // include js files
      'SearchSelect/src/*.js',

      // include unit test specs
      'SearchSelect/test/*.js',

      // html templates
      'SearchSelect/src/search-select.html'
    ],
    // files to exclude
    exclude : [
    ],

    loglevel: config.LOG_DEBUG,

    // karma has its own autoWatch feature but Grunt watch can also do this
    autoWatch : true,

    // testing framework, be sure to install the karma plugin
    frameworks: ['jasmine'],

    // browsers to test against, be sure to install the correct karma browser launcher plugin
    browsers : ['Chrome', 'PhantomJS'],

    // progress is the default reporter
    reporters: ['progress'],

    // map of preprocessors that is used mostly for plugins
    preprocessors: {
      '**/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      // strip this from the file path
      stripPrefix: 'SearchSelect/src/',
      // stripSuffix: '.ext',
      // prepend this to the
      //prependPrefix: 'served/',

      // or define a custom transform function
      // - cacheId returned is used to load template
      //   module(cacheId) will return template at filepath
      // cacheIdFromPath: function(filepath) {
      //   // example strips 'public/' from anywhere in the path
      //   // module(app/templates/template.html) => app/public/templates/template.html
      //   var cacheId = filepath.strip('SearchSelect/src/', '');
      //   return cacheId;
      // },

      // - setting this option will create only a single module that contains templates
      //   from all the files, so you can load them all with module('foo')
      // - you may provide a function(htmlPath, originalPath) instead of a string
      //   if you'd like to generate modules dynamically
      //   htmlPath is a originalPath stripped and/or prepended
      //   with all provided suffixes and prefixes
      moduleName: 'templates'
    },

    // list of karma plugins
    plugins : [
        'karma-junit-reporter',
        'karma-chrome-launcher',
        'karma-jasmine',
        'karma-phantomjs-launcher',
        'karma-ng-html2js-preprocessor'
    ]
})}
