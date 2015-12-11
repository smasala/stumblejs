/**
* Stumble JS - JavaScript Event Logger and Monitor
* @Author Steven Masala <me@smasala.com>
* @version 0.5.0
*/

(function( window ) {
    
    "use strict";
    
    class Stumble {
        
        constructor() {
            var me = this;
            //properties
            me.manifest = null;
            me.errors = [];
            me.batchTimer = 200;
            me.startTimer = 0;
            
            //Init
            me.initLogger();
        }
        
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
        
        initManifestConfig() {
            var me = this;
            if ( me.manifest.hasOwnProperty( "batchTimer" ) ) {
                me.batchTimer = me.manifest.batchTimer;
            }
        }
        
        initLogger() {
            var me = this;
            if ( me._loadManifest() ) {
                me.initManifestConfig();
                window.onerror = me.getErrorFunc();
                console.info( "Stumble JS Intialised!" );
            }
        }
        
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
        
        isTimeToSend( currentTime ) {
            var me = this;
            return ( currentTime - me.startTimer ) >= me.batchTimer;
        }
        
        getErrorFunc() {
            var me = this;
            return function() {
                var currentTime = new Date().getTime();
                console.error( "Error", arguments );
                me.errors.push( {
                    type: "error",
                    error: arguments[ 0 ],
                    where: arguments[ 1 ],
                    row: arguments[ 2 ],
                    all: arguments
                } );
                if ( !me.startTimer ) {
                    me.startTimer = currentTime;
                    window.setTimeout( function() {
                        if ( me.isTimeToSend( new Date().getTime() ) ) {
                            me.startTimer = 0;
                            me.sendError( me.errors );
                            me.errors = [];
                        }
                    }, me.batchTimer );
                }
                return true;
            };
        }
    }

    new Stumble();
    
})( window );
