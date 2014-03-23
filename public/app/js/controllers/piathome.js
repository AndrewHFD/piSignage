'use strict;'

angular.module('piathome.controllers', [])
    .factory('Navbar', function() {
        return({showPrimaryButton:false,primaryButtonText:null})
    })
    .controller('NavbarCtrl', ['$scope','$rootScope', '$location','$window','cordovaReady' ,'screenlog','$route','Navbar',
        function($scope,$rootScope, $location,$window,cordovaReady,screenlog, $route,Navbar) {

            $scope.navbar = Navbar;

            cordovaReady.then(function() {
                screenlog.debug("Cordova Service is Ready");
            });
            
            $scope.goBack = function() {
                $window.history.back();
            };
            $scope.goHome = function() {
                $location.path('/');
            };
            $scope.doSearch = function() {
                $scope.showSearchField=!$scope.showSearchField;
                if (!$scope.showSearchField)
                    $scope.search = null;
            };
            
            $rootScope.$on('$locationChangeStart', function(scope, next, current){ 

                $scope.navbar.showPrimaryButton = false;
                $scope.showSearchButton = false;

                var subpath = next.slice(next.indexOf('#')+2);
                $scope.showBackButton = subpath.indexOf('/') >= 0;

                if (subpath.length == 0) {
                    $scope.showSearchField = false;
                    $scope.search = null;
                }               
            })

            $scope.$on('onlineStatusChange',function(event,status){
                $scope.onlineStatus = status?"green":"red";
            })            

            $scope.primaryButtonClick = function() {
                $route.current.scope.pbHandler($scope.navbar.primaryButtonText);
            }
    }]).
    controller('HomeCtrl', ['$scope','$http','piUrls',function($scope,$http,piUrls) {

        function getStatus () {
            $http.get(piUrls.getStatus,{}).success(function(data,status){

                $scope.diskSpaceUsed = data.data.diskSpaceUsed;
                $scope.diskSpaceAvailable = data.data.diskSpaceAvailable;
                $scope.playlistOn = data.data.playlistOn;
                $scope.duration = data.data.duration + (new Date().getTimezoneOffset() * 60000);

            })
        }

        getStatus();
        $scope.interval= setInterval(function(){
            getStatus();
        }, 10000);

        $scope.play = function() {
            $http
                .post('/play/playlists/'+'default', { play: true})
                .success(function(data,success){
                    getStatus();

                })
        }
        $scope.stop = function() {
            $http
                .post('/play/playlists/'+'default', { stop: true})
                .success(function(data,success){
                    getStatus();

                })
        }

    }]).
    controller('ReportsCtrl',['$scope',function($scope){

    }]).
    controller('SettingsCtrl',['$scope',function($scope){

    }])
