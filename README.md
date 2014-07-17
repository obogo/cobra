<div style="text-align:center;padding-bottom:30px"><img src="http://src.sencha.io/120/http://images.clipartof.com/small/100912-Royalty-Free-RF-Clipart-Illustration-Of-A-Glossy-Blue-Cobra-Icon-Logo.jpg" />
<h1>Cobra</h1>
<img src="https://travis-ci.org/webux/ux-schema.svg?branch=master" alt="Build Status">
</div>

Cobra is a tiny library used to create schemas similar to Mongoose in the browser.

If you want to know more about Mongoose, you can visit this page: [http://mongoosejs.com/](http://mongoosejs.com).

## Installation

### bower
```bower install ux-schema```

## Creating a Schema

example in node js wrapping the fs.readFile function to work with promise

```javascript
var Schema = cobra.Schema;

var TestSchema = new Schema({
	str: { type: String, default: 'hello', required: true, trim: true },
    bool: { type: Boolean, required: true},
    num: { type: Number },
    int: { type: Schema.Types.Int },
    currency: { type: Schema.Types.Currency },
    date: { type: Date, default: Date.now },
    email: { type: Schema.Types.Email },
    obj: { type: Schema.Types.Mixed },
    name: String
});

cobra.model('Test', TestSchema);
```

## Applying a Schema

The schema can be used against any object. When applied the schema will do the following...

* Check values against the predefined properties.
* Apply default values if a value does not exist. 
* Remove properties not contained in schema.
* Apply any formatters defined in schema.

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

## Creating a new Schema Type

```javascript
cobra.schemaType('Email', function (val, options) {
    var regExp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regExp.test(val);
});
```

## Using a new Schema Type

```javascript
var TestSchema = new Schema({
	myEmail: { type: Schema.Types.Email },
});
```

## Creating a new Schema Formatter

```javascript
cobra.schemaFormat('trim', function (val, isTrim) {
    if (isTrim) {
        val = String(val).trim();
    }
    return val;
});
```

## Using a Schema Formatter

```javascript
var MessageSchema = new Schema({
	content: { type: String, default: 'Hello, world!', trim: true }
});
```