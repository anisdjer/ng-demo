/** 
 * profile.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 18 sept. 2014
 */
(function () {
    'use strict';
    define(['app-settings'], function(appSettings) { 
       
       var HomeCtrl = function($rootScope, $scope, AuthService, UserService, PostService, WebSocket) {
           var USER_ROLES     = require('constants/userRoles');
           
           $scope.posts = PostService.getPosts();
           
           $rootScope.user = UserService.getUser();
           $rootScope.user.isAdmin = AuthService.canAccess([USER_ROLES.ADMIN]);
           console.log("User is Admin ?");
           console.log(AuthService.canAccess([USER_ROLES.ADMIN]));
           $scope.addPost = function() {
               var post = {
                    user : {
                       id       : UserService.getId(),
                       username : UserService.getUsername()                      
                   },
                   body : $scope.newPost.body,
                   timestamp : (new Date()).getTime()
                };
//                PostService.addPost(post);
//                $scope.posts = PostService.getPosts();
                $scope.newPost.body = "";
                
                
                
                WebSocket.send(JSON.stringify({ type : 2, post : post}));
           };
           
           
            WebSocket.new(appSettings.getWebsocketURL());
            WebSocket.onopen(function() {
                console.log('WebSocket connection'); 
                WebSocket.send( JSON.stringify({ type : 1, user : UserService.getUser()}) );
            });

            WebSocket.onmessage(function(event) {
                console.log(event.data);
                var data = {
                    type : 0
                };
                try {
                    data = JSON.parse(event.data);
                } catch (e) {
                };
                
                if(data.type === 2){
                  
                    $scope.$apply(function () {
                            PostService.addPost(data.post);
                            $scope.posts = PostService.getPosts();
                    });
                }
            });

           
           console.log($rootScope.user);
       };
       
       return ["$rootScope", "$scope", "AuthService", "UserService", "PostService", "WebSocket", HomeCtrl];
    
    });
})();