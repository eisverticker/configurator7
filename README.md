# configurator7!
[configurator7 appearance](/look.png)

A simple tool which takes advantage of the cli to ask the user about whatever your app needs to know and then saves the information in a JSON file to a location you want.

## Usage
Install and save via npm:
```
npm install configurator7 --save
```

Then create a script file which you want to run the configurator e.g. _postinstall.js_.
Usually you want this script to run after npm install so you have to edit your package.json:
```javascript
  "scripts": {
    "postinstall": "node postinstall.js",
    ...
  },
```

Then you can load some local JSON files as templates for the files which configurator7 will save for you later.
```javascript
var configJson = require('./install_files/config.json');
var datasourcesJson = require('./install_files/datasources.json');
```

Or you are defining some data in your script file:
```javascript
var configJson = {
  name: "",
  email: "",
  password: "",
  hobbies: []
  properties: {
    isOld: false,
    mood: "bad",
    foo: 43
  }
};

var datasourcesJson = {
  apis: [
    {
      name: "",
      url: ""
    },
    {
      name: "",
      url: ""
    }
  ]
};
```

Next you have to configure where to store the objects:
```javascript
var configFiles = {

	"config": {
	  data: configJson,
	  targetFile: "./server/config.json",
	},

	"datasources": {
	  data: datasourcesJson,
	  targetFile: "./server/datasources.json",
	}

};
```

Then you can add questions which will be asked in the cli:
```javascript
var questions = [
	{
		title: "What is your name?",
		type: "default",
		required: true,
		target: {
			file: "config",
			position: "name"
		}
	},
	{
		title: "And your email?",
		type: "email",
		required: true,
		target: {
			file: "config",
			position: 'email'
		}
	},
	{
		title: "password:",
		type: "password",
		required: true,
		target: {
			file: "config",
			position: "password"
		}
	},
	{
		title: "What are your hobbies?",
		type: "array",
		target: {
			file: "config",
			position: "hobbies"
		}
	},	
	{
		title: "You are old (true/false)",
		type: "boolean",
		required: true,
		target: {
			file: "config",
			position: "properties.isOld"
		}
	},
	{
		title: "Add some number",
		type: "number",
		target: {
			file: "config",
			position: "properties.foo"
		}
	},
	{
		title: "How would you call the first api??",
		type: "default",
		required: true,
		target: {
			file: "datasources",
			position: "apis.0.name"
		}
	}

];
```

Lastly you have to run the configurator and then you are done.

```javascript
var configurator = new c7.configurator(configFiles, questions);

configurator.run(function(err){
	if(err) throw err;

	console.log("done!");
});
```

## Misc

| configurator                                                                                                                                                                                                     |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| -                                                                                                                                                                                                                |
| - processQuestions(questions: Array, callback: function): void   <br /> - saveConfigurations(files: { [fileId] : properties }, callback: function ): void <br /> + configurator(files: { [fileId] : properties }, questions: Array, additionalPatterns: Array)<br />+ run(callback: function): void  |
