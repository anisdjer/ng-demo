/**
 * General Settings of the App
 */

(function(define) {
    'use strict';
    define(function() {
        var 
            _appName = "ng-demo"
        ,   _wsUrl  =   "ws://localhost:8800"
        ;
        return {
            authentication : {
                LOGIN_URL   : '/login',
                AUTH_URL    : '/api/auth',
                SUCCESS_URL : '/home',
                
                
                AUTH_SUCCESS_EVENT_NAME : "auth:success"
            },
            getAppName : function() {
                return _appName;
            },
            getWebsocketURL : function() {
                return _wsUrl;
            }
        };
    });
    
})(define);