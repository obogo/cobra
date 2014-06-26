#Schema.js
Schema.js is a tiny library used to create schemas similar to Mongoose for the browser.

If you want to know more about Mongoose, you can visit this page: [http://mongoosejs.com/](http://mongoosejs.com).

## installation

### bower
```bower install cobra-schema```

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

cobra.model('Test', TestSchema);```

## Applying a Schema

example in node js wrapping the fs.readFile function to work with promise
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

test.check().then(function (resolvedData) {
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