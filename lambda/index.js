/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';

const Alexa = require('alexa-sdk');
var http = require('http');
const APP_ID = "amzn1.ask.skill.007411e9-603b-4002-b3bc-62ed00eb711a";  // TODO replace with your app ID (OPTIONAL).
const PI_ENDPOINT = "http://dd6de2af.ngrok.io"
const languageStrings = {
    'en': {
        translation: {
            RESPONSES: [
                'okay, but just this one time',
                'you are so lazy.',
                'you have enough time to scrol facebook, but not do it yourself',
                'I think you could use the exercise',
                'Go turn your own blinds, just kidding, hehe',
                'Would you like a burger with a side of lazy?',
                'Sure, I would love to. <break time="1s"/> Not!',
                'Alright if you insist, <break time=".75s"/> <amazon:effect name="whispered">Are we going to go watch the neighbor again?</amazon:effect>.'
            ],
            SKILL_NAME: 'SmartBlinds',
            GET_FACT_MESSAGE: "Here is Alexa's Response: ",
            HELP_MESSAGE: 'You can say windowbot, close my blinds or windowbot, open my blinds',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
        },
    }
};

function getBlinds(param, callback){
    //GET request to Arduino

    console.log('start request to ' + PI_ENDPOINT)
     http.get(PI_ENDPOINT + "/servo?blinds=" + param, function(res) {
            console.log("Got response: " + res.statusCode);
            callback(null, 'success msg') // to return ok
        }).on('error', function(e) {
            callback(new Error('failure')) // to return error
        });
}

const handlers = {
    'LaunchRequest': function () {
        this.emit('CloseBlind');
    },
    'CloseBlind': function () {
        getBlinds("off", ()=>{
            const skillName = "SmartBlinds"
            const responses = languageStrings['en']['translation']['RESPONSES'];
            const responseIndex = Math.floor(Math.random() * responses.length);
            
            // const speechOutput = this.t('GET_FACT_MESSAGE') + randomFact;
            const speechOutput = responses[responseIndex]
            this.emit(':tellWithCard', speechOutput, skillName, speechOutput);
        })
    },
    'OpenBlind': function (event, context, callback) {
        // this.emit('GetFact');
        
        getBlinds("on", ()=>{
            const skillName = "SmartBlinds"
            const responses = languageStrings['en']['translation']['RESPONSES'];
            const responseIndex = Math.floor(Math.random() * responses.length);
            
            // const speechOutput = this.t('GET_FACT_MESSAGE') + randomFact;
            const speechOutput = responses[responseIndex]
            this.emit(':tellWithCard', speechOutput, skillName, speechOutput);
        })
    },
    
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    }
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
