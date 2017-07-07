var app = angular.module('app', []);

app.controller('HomeController', function($scope) {
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    chrome.tabs.executeScript(null, {file: "content/jquery.js"}, function() {
      chrome.tabs.executeScript(null, {file: "content/spider.js"});
    });

    $scope.host = getOrigin(tabs[0].url);
    $scope.$apply()
  });

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    $scope.urls = prioritizeUrls(request.results, $scope.host);
    $scope.$apply()
  });

  $scope.gotoUrl = function(url) {
    chrome.tabs.update(null, {url: url})
  }
});

app.filter('shrink', function() {
  var maxLength = 80;
  return function(input) {
    if (input != undefined && input.length > maxLength) {
      return input.substring(0, maxLength) + "..."
    } else {
      return input
    }
  }
});

function getOrigin(url) {
  var u = new URL(url)
  return buildOrigin(u)
}

function buildOrigin(parsedUrl) {
  return parsedUrl.protocol + "//" + parsedUrl.host
}

function prioritizeUrls(urls, host) {
  var inDomain = [];
  var outDomain = [];

  urls.sort()
  urls = _.uniq(urls);

  for (var i = 0; i < urls.length; i++) {
    var url = urls[i];

    if (getOrigin(url) === host) {
      inDomain.push(url)
    } else {
      outDomain.push(url);
    }
  }

  return inDomain.concat(outDomain)
}