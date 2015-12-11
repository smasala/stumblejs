/**
* Stumble JS - JavaScript Event Logger and Monitor
* @Author Steven Masala <me@smasala.com>
* @version 0.5.2
*/

(function( window ) {
    
    "use strict";
    
    class Stumble {
        
        constructor() {
            var me = this;
            //properties
            me.manifest = null;
            me.errors = [];
            me.startTimer = 0;
            
            //Init
            me.initLogger();
        }
        
        /**
         * until the manifest is widely support, load the manifest json file with synchronous ajax!
         * @method _loadManifest
         * @private
         * @return {Boolean}
         */
        _loadManifest() {
            var me = this,
                manifest = document.querySelector( "[rel='manifest']" ),
                content;
            if ( !manifest ) {
                console.error( "Manifest <link rel='manifest' href='...'> not found" );
                return false;
            }
            manifest = manifest.getAttribute( "href" );
            if ( !manifest ) {
                console.error( "Invalid manifest url" );
                return false;
            }
            var xhrObj = new window.XMLHttpRequest();
            xhrObj.open( "GET", manifest, false ); //false = synchronous
            xhrObj.send( null );
            content = xhrObj.responseText;
            if ( !content ) {
                console.error( "Unable to load manifest:", manifest, " (Status:", xhrObj.status, "), returned content:", content );
                return false;
            }
            content = window.JSON.parse( content );
            if ( !content.stumblejs ) {
                console.error( "Invalid manifest JSON:", content, ", missing 'stumblejs' property!" );
                return false;
            }
            me.manifest = content.stumblejs;
            return true;
        }
        
        /**
         * set any manifest defaults or load particular properties
         * @method initManifestConfig
         */
        initManifestConfig() {
            var me = this;
            if ( !me.manifest.hasOwnProperty( "batchTimer" ) ) {
                me.manifest.batchTimer = 200;
            }
        }
        
        /**
         * called by the constructor, sets all the cogs in motion
         * @method initLogger
         */
        initLogger() {
            var me = this;
            if ( me._loadManifest() ) {
                me.initManifestConfig();
                window.onerror = me.getErrorFunc();
                console.info( "Stumble JS Intialised!" );
            }
        }
        
        /**
         * Send the error array batch via ajax to the server
         * @method sendError
         * @param errors {Array of Objects}
         */
        sendError( errors ) {
            var me = this;
            if ( !me.manifest.url ) {
                console.warn( "Unable to POST error, no url set", me.manifest  );
                return;
            }
            var xhrObj = new window.XMLHttpRequest();
            xhrObj.open( "POST", me.manifest.url, true );
            xhrObj.setRequestHeader( "Content-type", "application/json" );
            xhrObj.onreadystatechange = function() {//Call a function when the state changes.
                if ( xhrObj.readyState !== 4 && xhrObj.status !== 200 ) {
                    console.error( "Unable to post error to the url: '", me.manifest.url, "', in other words... there was an error with this error :)" );
                }
            };
            xhrObj.send( window.JSON.stringify( {
                stumblejs: errors
            } ) );
        }
        
        /**
         * check whether more time has passed than the batchTime requires
         * @method isTimeToSend
         * @param currentTime {Integer}
         * @return {Boolean}
         */
        isTimeToSend( currentTime ) {
            var me = this;
            return ( currentTime - me.startTimer ) >= me.manifest.batchTimer;
        }
        
        /**
         * return the function used by the window.onerror listener
         * @method getErrorFunc
         * @return {Function}
         */
        getErrorFunc() {
            var me = this;
            return function() {
                var currentTime = new Date().getTime();
                if ( !me.manifest.silent ) {
                    console.error( "StumbleJS", arguments );
                }
                //populate error array
                me.errors.push( {
                    type: "error",
                    error: arguments[ 0 ],
                    where: arguments[ 1 ],
                    row: arguments[ 2 ],
                    time: currentTime,
                    all: arguments
                } );
                if ( !me.startTimer ) {
                    me.startTimer = currentTime;
                    //send the error batch only when needed and not for each error
                    window.setTimeout( function() {
                        var time;
                        if ( me.isTimeToSend( new Date().getTime() ) ) {
                            time = me.startTimer;
                            me.startTimer = 0;
                            me.sendError( me.errors, time );
                            me.errors = [];
                        }
                    }, me.manifest.batchTimer );
                }
                return true;
            };
        }
    }

    //Here she goes!
    new Stumble();
    
})( window );
