#Cobra
####Object modeling for JavaScript
---
[![Build Status](https://travis-ci.org/obogo/cobra.svg?branch=master)](https://travis-ci.org/obogo/cobra) [![Dependency Status](https://david-dm.org/obogo/cobra.svg)](https://david-dm.org/obogo/cobra) [![devDependency Status](https://david-dm.org/obogo/cobra/dev-status.svg)](https://david-dm.org/obogo/cobra#info=devDependencies)

Cobra provides a straight-forward, schema-based solution to modeling your application data and includes built-in type casting, validation, and more, out of the box. If you are familiar with Node.js's [http://mongoosejs.com/](http://Mongoose), then you will feel right at home.

###Why create schema-based data on the client?

Data passed between the client and server often fulfills some form of contract in order for the data to be saved. A schema will help ensure your data matches this contract. Or perhaps you are using a service like [Firebase](https://www.firebase.com/) or [PubNub](http://www.pubnub.com/) where there are no data contract. A schema will help ensure your data consitency in these volatile enviroments.

###Why use Cobra?

#####Cobra can do the following out of the box:

*  Auto-populate a schema with default values
*  Format data using helpers such as trim()
*  Ensure required fields
*  Validate the integrety of the data is matched against data types
*  Automatically strip properties that are not defined in the schema

#####Cobra is highly customizable

Cobra simple API allows you to add your own types and formatters to the ones already provided.

#####Cobra is lightweight at 2kb gzipped
Cobra is ~9kb minified.

### Installation

#### bower
```bower install ux-schema```

### Quick start

TODO: Add quickstart guide


### Defining your schema

Everything in Cobra starts with a Schema. Each schema maps to the data a web service expects to receive. If you are working with a NoSQL database like MongoDB, or a realtime webservice such as [Firebase](https://www.firebase.com/) where there is no structure, this is especially useful. Each schema maps to a collection and defines the shape of the documents within that collection.

```javascript
var Schema = cobra.Schema;

var blogSchema = new Schema({
	title:  String,
  	author: String,
  	body:   String,
  	comments: [{ body: String, date: Date }],
  	date: { type: Date, default: Date.now },
  	hidden: Boolean,
  	meta: {
    	votes: Number,
    	favs:  Number
  	}
});

Each key in our testSchema defines a property in our documents which will be cast to its associated SchemaType. For example, we've defined a title which will be cast to the String SchemaType and date which will be cast to a Date SchemaType. Keys may also be assigned nested objects containing further key/type definitions (e.g. the `meta` property above).

The default SchemaTypes are

* String
* Number
* Date
* Boolean
* Mixed
* Array
* Int
* Currency
* Email
* Url

```

### Applying a schema

The schema can be used against any object. The schema will be applied in the following order:

1. Apply default values if a value does not exist. 
2. Remove properties not contained in schema
3. Apply schema helpers
4. Check values against the predefined properties.


```javascript

var data = {
    bogus: true,
    email: 'roboncode@gmail.com',
    str: '   goodbye   ',
    bool: true,
    num: 123,
    int: '123',
    currency: 123.12,
    date: Date.now(),
    obj: {
        anything: true
    }
};

var Test = cobra.model('Test');

var test = new Test(data);
test.name = 'Rob Taylor';

test.applySchema().then(function (resolvedData) {
    console.log('success', resolvedData);
}, function (err) {
    console.log('error', err.message);
});
```

### Creating a custom schema type

```javascript
cobra.schemaType('Email', function(){
	this.exec = function (val, options) {
    	var regExp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    	return regExp.test(val);
	}
});
```

### Using a schema type

```javascript
var TestSchema = new Schema({
	myEmail: { type: Schema.Types.Email },
});
```

### Creating a custom schema helper

```javascript
cobra.schemaFormat('trim', function (value, isTrue) {
    if (isTrue) {
        value = String(value).trim();
    }
    return value;
});
```

### Using a schema helper

```javascript
var MessageSchema = new Schema({
	content: { type: String, default: 'Hello, world!', trim: true }
});
```

### Schema options

Cobra comes with a few options:

...