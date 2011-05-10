(function() {
  var collection_url = 'http://localhost:3000/data';
  var performance = window.performance || window.msPerformance;
  if(performance == null) {
    return;
  }
  if(performance.navigation == null) {
    return;
  }
  if(performance.timing == null) {
    return;
  }

  window.onload =
  function () {
    setTimeout(
      function () {
	var nav_summary = window.navtime_summary || {};

        nav_summary.type = 'unknown';
        var nav = performance.navigation;
        var time = performance.timing;

        nav_summary.redirectCount = nav.redirectCount;
        if(nav.TYPE_NAVIGATE == nav.type) {
          nav_summary.type = 'navigate';
        }
        else if(nav.TYPE_RELOAD == nav.type) {
          nav_summary.type = 'reload';
        }
        else if(nav.TYPE_BACK_FORWARD == nav.type) {
          nav_summary.type = 'back/forward';
        }
        else if(nav.TYPE_RESERVED == nav.type) {
          nav_summary.type = 'reserved';
        }

        function timeDiff(name) {
          nav_summary[name] = time[name + 'Start'] - time[name + 'End'];
        }

        var attribs = [
          'unloadEvent',
          'redirect',
          'domainLookup',
          'connect',
          'response',
          'domContentLoadedEvent',
          'loadEvent'
        ];
        for(var i=0 ; i<attribs.length ; i++) {
          var name = attribs[i];
	  if(time[name + 'End'] == null || time[name + 'Start'] == null) {
	    continue;
	  }
          nav_summary[name] = time[name + 'End'] - time[name + 'Start'];
        }

	function navToTime(name, attr) {
	  if(time[attr] == null) {
	    return;
	  }
	  nav_summary[name] = time[attr] - time.navigationStart;
	}

	navToTime('fetch', 'fetchStart');
	navToTime('loading', 'domLoading');
	navToTime('interactive', 'domInteractive');
	navToTime('complete', 'domComplete');

	var url = collection_url + params(nav_summary);
	var i = document.createElement('img');
	i.src = url;
	function params(obj) {
	  var send = [];
	  for(var name in obj) {
	    send.push(name+'='+obj[name]);
	  }
	  return '?'+send.join('&');
	}
      },
    100);
  };
})();
