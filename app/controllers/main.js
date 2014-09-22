/** 
 * main.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 17 sept. 2014
 */

(function() {
    'use strict';
    
    define(['app-settings'], function(appSettings) { 
       
       var MainCtrl = function($rootScope, $scope, UserService, WebSocket) {
            console.log("Main Controller Definition");
            $scope.user = UserService.getUser();
            
            $rootScope.$on(appSettings.authentication.AUTH_SUCCESS_EVENT_NAME, function(e, user) {
                console.log("Auth:Success received in MainCtrl");
                console.log(user);
                $scope.user = user || {};
            });
           
            $rootScope.$on('$stateChangeStart', 
                function(event, toState, toParams, fromState, fromParams){
                     $scope.page  = toState.data.page;
            });
            
            
            
       };
       
       return ["$rootScope", "$scope", "UserService", "WebSocket", MainCtrl];
    
    });
})();