/* global cobra, console */
(function () {
    'use strict';

var Schema = cobra.Schema;

var ChatMessageSchema = new Schema({
    name: String,
    message: String
});

cobra.model('ChatMessage', ChatMessageSchema);

var ChatMessage = cobra.model('ChatMessage');
var chat = new ChatMessage({
    name: 'Simon',
    message: 'I am going to be late tonight'
});

chat.applySchema().then(function (resolvedData) {
    console.log('success', resolvedData);
}, function (err) {
    console.log('error', err.message);
});

}());