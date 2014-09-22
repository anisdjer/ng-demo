/** 
 * post.js
 * 
 * 
 * 
 * @author Anis Bouhachem <anis.bouhachem@tritux.com>
 * @since 18 sept. 2014
 */
(function () {
    'use strict';
    define([], function() { 
        
        var POST_RESOURCE_URL = "/api/posts";
   
        var defer = null;
        
        var Post = function($q, $resource){
            var postResource = $resource(POST_RESOURCE_URL );
            
            return {
                addPost : function(post) {
                    postResource.save(post);
                },
                getPosts : function () {
                    return  this.postResolver();
                },
                postResolver : function() {
                    
                    defer = $q.defer();
                    return postResource.query(function(posts) {
                        if(defer !== null)
                            defer.resolve(posts);
                        defer = null;
                    });
                     
                    return defer.promise;
                }
            };
        };
        
        
        return ["$q", "$resource", Post];
    });
})();