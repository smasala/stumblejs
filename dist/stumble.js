(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* Stumble JS - JavaScript Event Logger and Monitor
* @Author Steven Masala <me@smasala.com>
* @version 0.5.2
*/

(function (window) {
    "use strict";

    var Stumble = (function () {
        function Stumble() {
            _classCallCheck(this, Stumble);

            var me = this;
            //properties
            me.manifest = null;
            me.errors = [];
            me.startTimer = 0;

            //Init
            me.initLogger();
        }

        _createClass(Stumble, [{
            key: "_loadManifest",
            value: function _loadManifest() {
                var me = this,
                    manifest = document.querySelector("[rel='manifest']"),
                    content;
                if (!manifest) {
                    console.error("Manifest <link rel='manifest' href='...'> not found");
                    return false;
                }
                manifest = manifest.getAttribute("href");
                if (!manifest) {
                    console.error("Invalid manifest url");
                    return false;
                }
                var xhrObj = new window.XMLHttpRequest();
                xhrObj.open("GET", manifest, false); //false = synchronous
                xhrObj.send(null);
                content = xhrObj.responseText;
                if (!content) {
                    console.error("Unable to load manifest:", manifest, " (Status:", xhrObj.status, "), returned content:", content);
                    return false;
                }
                content = window.JSON.parse(content);
                if (!content.stumblejs) {
                    console.error("Invalid manifest JSON:", content, ", missing 'stumblejs' property!");
                    return false;
                }
                me.manifest = content.stumblejs;
                return true;
            }
        }, {
            key: "initManifestConfig",
            value: function initManifestConfig() {
                var me = this;
                if (!me.manifest.hasOwnProperty("batchTimer")) {
                    me.manifest.batchTimer = 200;
                }
            }
        }, {
            key: "initLogger",
            value: function initLogger() {
                var me = this;
                if (me._loadManifest()) {
                    me.initManifestConfig();
                    window.onerror = me.getErrorFunc();
                    console.info("Stumble JS Intialised!");
                }
            }
        }, {
            key: "sendError",
            value: function sendError(errors) {
                var me = this;
                if (!me.manifest.url) {
                    console.warn("Unable to POST error, no url set", me.manifest);
                    return;
                }
                var xhrObj = new window.XMLHttpRequest();
                xhrObj.open("POST", me.manifest.url, true);
                xhrObj.setRequestHeader("Content-type", "application/json");
                xhrObj.onreadystatechange = function () {
                    //Call a function when the state changes.
                    if (xhrObj.readyState !== 4 && xhrObj.status !== 200) {
                        console.error("Unable to post error to the url: '", me.manifest.url, "', in other words... there was an error with this error :)");
                    }
                };
                xhrObj.send(window.JSON.stringify({
                    stumblejs: errors
                }));
            }
        }, {
            key: "isTimeToSend",
            value: function isTimeToSend(currentTime) {
                var me = this;
                return currentTime - me.startTimer >= me.manifest.batchTimer;
            }
        }, {
            key: "getErrorFunc",
            value: function getErrorFunc() {
                var me = this;
                return function () {
                    var currentTime = new Date().getTime();
                    if (!me.manifest.silent) {
                        console.error("StumbleJS", arguments);
                    }
                    me.errors.push({
                        type: "error",
                        error: arguments[0],
                        where: arguments[1],
                        row: arguments[2],
                        time: currentTime,
                        all: arguments
                    });
                    if (!me.startTimer) {
                        me.startTimer = currentTime;
                        window.setTimeout(function () {
                            var time;
                            if (me.isTimeToSend(new Date().getTime())) {
                                time = me.startTimer;
                                me.startTimer = 0;
                                me.sendError(me.errors, time);
                                me.errors = [];
                            }
                        }, me.manifest.batchTimer);
                    }
                    return true;
                };
            }
        }]);

        return Stumble;
    })();

    new Stumble();
})(window);

},{}]},{},[1]);
