'use strict';

var Promise = require('bluebird');

module.exports = {
    updateUserTone: updateUserTone,
    invokeToneAsync: invokeToneAsync
};

function invokeToneAsync(conversationPayload, toneAnalyzer) {
    return new Promise(function(resolve, reject) {
        toneAnalyzer.tone({ text: conversationPayload.input.text }, function(error, data) {
            if (error) {
                reject(error);
            } else {
                console.log(JSON.stringify(data));
                resolve(data);
            }
        });
    });
}

function updateUserTone(conversationPayload, toneAnalyzerPayload, maintainHistory) {
    if (typeof conversationPayload.context === 'undefined') {
        conversationPayload.context = {};
    }

    if (typeof conversationPayload.context.user === 'undefined') {
        conversationPayload.context = initUser();
    }
 var user = conversationPayload.context.user;

    if (toneAnalyzerPayload && toneAnalyzerPayload.document_tone) {
        updateTone(user, toneAnalyzerPayload.document_tone.tones, maintainHistory);
    }

    conversationPayload.context.user = user;

    return conversationPayload;
}


function initUser() {
    return {
        user: {
            tone: {
                current: null
            }
        }
    };
}

function updateTone(user, tones, maintainHistory) {
    var maxScore = 0.0;
    var primaryTone = null;
    var primaryToneScore = null;

    tones.forEach(function(tone) {
        if (tone.score > maxScore) {
            maxScore = tone.score;
            primaryTone = tone.tone_name.toLowerCase();
            primaryToneScore = tone.score;
        }
    });

    user.tone.current = primaryTone;

    if (maintainHistory) {
        if (typeof user.tone.history === 'undefined') {
            user.tone.history = [];
        }
        user.tone.history.push({
            tone_name: primaryTone,
            score: primaryToneScore
        });
    }
}