var prompt = require('prompt');
var fs = require('fs');
var nestedProperty = require("nested-property");

exports.configurator = function(configFiles, questions, additionalPatterns) {

  /**
   * Often used input patterns
   */
  var patterns = {
    "email": {
      pattern: /.{2,20}@.{2,20}\..{2,5}/,
      message: 'Email must be valid'
    },
    "default": {},
    "number": {
      type: 'number'
    },
    "password": {
      hidden: true
    },
    "boolean": {
      type: 'boolean'
    },
    "array": {
      type: 'array'
    }
  };

  if (additionalPatterns !== undefined) {
    for (var key in additionalPatterns) {
      patterns[key] = additionalPatterns[key];
    }
  }

  /**
   * Welcome the user and initalize the prompt
   */
  var init = function() {
    isInit = true;

    console.log(" ");
    console.log("==============================================================================");
    console.log("Welcome to the configuration assistant, please provide us some informations");
    console.log("==============================================================================");

    prompt.start();
  };

  /**
   * Ask the user all questions you have provided
   */
  var processQuestions = function(questions, callback) {

    if (questions.length > 0) {
      var q = questions.shift();
      var schema = {
        properties: {}
      };

      schema.properties.input = patterns[q.type];
      schema.properties.input.required = q.required !== undefined ? q.required : true;
      if (q.default !== undefined) {
        schema.properties.input.default = q.default;
      }

      console.log(" ");
      console.log(q.title);
      console.log("---------------------------------------------------------------------------");
      prompt.get(schema, function(err, response) {
        if (err) return callback(err);

        var data = configFiles[q.target.file].data;

        nestedProperty.set(data, q.target.position, response.input);

        //next question
        processQuestions(questions, callback);
      });
    } else {
      console.log("Thats it!");
      callback();
    }
  };

  /**
   * Write the current data to disc
   */
  var saveConfigurations = function(files, callback) {

    var keys = Object.keys(files);

    if (keys.length > 0) {
      var key = keys.shift();
      var file = files[key];

      var data = JSON.stringify(file.data, null, 2);

      fs.writeFile(file.targetFile, data, function(err) {
        if (err) return callback(err);

        console.log(file.targetFile + " was saved");
        delete files[key];
        saveConfigurations(files, callback);
      });
    } else {
      console.log("We have finished, thank you!");
      callback();
    }
  };


  /**
   * Start the configurator, ask the user and save all data which the user has given
   */
  this.run = function(callback) {
		init();

    processQuestions(questions, function(err) {
      if (err) callback(err);

      console.log("Lets save the files!");
      saveConfigurations(configFiles, callback);
    });

  };

};
