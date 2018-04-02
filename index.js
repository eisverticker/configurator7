const prompt = require("prompt");
const fs = require("fs");
const nestedProperty = require("nested-property");

class ConsolePrinter {
  static printHr() {
    console.log("----------------------------------------");
  }

  static printWelcome() {
    console.log(" ");
    console.log("==============================================================================");
    console.log("Welcome to the configuration assistant, please provide us some informations");
    console.log("==============================================================================");
  }
}

class Configurator7 {
  static getStandardPatterns() {
    return {
      "email": {
        pattern: /.{2,20}@.{2,20}\..{2,5}/,
        message: "Email must be valid"
      },
      "default": {},
      "number": {
        type: "number"
      },
      "password": {
        hidden: true
      },
      "boolean": {
        type: "boolean"
      },
      "array": {
        type: "array"
      }
    };
  }

  constructor(configFiles, questions, additionalPatterns) {
    this.configFiles = configFiles;
    this.questions = questions;
    this.patterns = Configurator7.getStandardPatterns();

    /* optional parameter additionalPatterns */
    if (typeof additionalPatterns !== undefined) {
      for (let key in additionalPatterns) {
        this.patterns[key] = additionalPatterns[key];
      }
    }
  }

  run(callback){
    this._init();

    this._processQuestions(this.questions, function(err) {
      if (err) callback(err);

      console.log("Lets save the files!");
      this._saveConfigurations(this._configFiles, callback);
    });
  }

  /**
   * Welcome the user and initalize the prompt
   */
  _init() {
    ConsolePrinter.printWelcome();
    prompt.start();
  }

  /**
   * Ask the user all questions you have provided
   */
  _processQuestions(questions, callback) {

    if (questions.length > 0) {
      const q = questions.shift();
      const schema = {
        properties: {}
      };

      schema.properties.input = this._patterns[q.type];
      schema.properties.input.required = q.required !== undefined ? q.required : true;
      if (q.default !== undefined) {
        schema.properties.input.default = q.default;
      }

      console.log(" ");
      console.log(q.title);
      ConsolePrinter.printHr();

      prompt.get(schema, function(err, response) {
        if (err) return callback(err);

        const data = this.configFiles[q.target.file].data;

        nestedProperty.set(data, q.target.position, response.input);

        //next question
        this._processQuestions(questions, callback);
      });
    } else {
      console.log("Thats it!");
      callback();
    }
  }

  /**
   * Write the current data to disc
   */
  _saveConfigurations(files, callback) {

    const keys = Object.keys(files);

    if (keys.length > 0) {
      const key = keys.shift();
      const file = files[key];

      const data = JSON.stringify(file.data, null, 2);

      fs.writeFile(file.targetFile, data, function(err) {
        if (err) return callback(err);

        console.log(file.targetFile + " was saved");
        delete files[key];
        this._saveConfigurations(files, callback);
      });
    } else {
      console.log("Configuration was finished.");
      callback();
    }
  }

}

module.exports = Configurator7;
