$(document).ready(function(){

	var url = location.href;
	
		
	var level =  "./";
	
	if ((url.endsWith("/projects/jquery.gspreadsheetdatasource"))
			||(url.endsWith("/projects/jquery.gspreadsheetdatasource/"))
			||(url.endsWith("/projects/jquery.gspreadsheetdatasource/index.html")))
	{
		var level =  "./../../";		
	}
	
	if ((url.endsWith("/bookmarklets"))
			||(url.endsWith("/bookmarklets/"))
			||(url.endsWith("/bookmarklets/index.html")))
	{
		var level =  "./../";		
	}
	
	
	
	print_bio(level);
	print_header();
	print_navigation(level);
	print_footer();


	// functions


	function print_navigation(level)
	{
		$("#wrapper").prepend("<nav><!-- top nav --><div class=\"menu\"><ul>"+
				"<li><a href=\""+level+"blog.html\">Blog</a></li>"+
				"<li><a href=\""+level+"tweets.html\">Tweets</a></li>"+
				"<li><a href=\""+level+"projects.html\">Projects</a></li>"+
				"<li><a href=\""+level+"cv.html\">CV</a></li>"+
				"<li><a href=\""+level+"contacts.html\">Contacts</a></li>"+
				"</ul></div></nav><!-- end of top nav -->");
	}

	function print_header()
	{
		$("#wrapper").prepend("<header><!-- header --><h1><a href=\"./\">Nicola Tesser</a></h1></header>");
	}

	function print_footer()
	{
		$("#wrapper").append("<footer><section id=\"footer-area\"><section id=\"footer-outer-block\"><!--<aside class=\"footer-segment\"><h4>section</h4><ul><li><a href=\"#\">one linkylink</a></li></ul></aside>--><!-- end of #first footer segment --></section><!-- end of footer-outer-block --></section><!-- end of footer-area --></footer>");
		 print_analytics();
	}
	
	function print_analytics()
	{
		
		$.trackPage('UA-21577651-1');
		$.fn.track.defaults.debug = true;

	}

	function print_bio(level)
	{
		
		$.ajax({
			type: "GET",
			url: level+"bio.html",
			success: function(biohtmlpage) {
				var biopage = $(biohtmlpage);
				var bio = biopage.find("#bio");			
				$("#bio").html(bio);
			}
		});
	}

});

String.prototype.endsWith = function(str)
{return (this.match(str+"$")==str)};






// ANALYTICS

/*
* jquery-google-analytics plugin
*
* A jQuery plugin that makes it easier to implement Google Analytics tracking,
* including event and link tracking.
*
* Adds the following methods to jQuery:
*   - $.trackPage() - Adds Google Analytics tracking on the page from which
*     it's called.
*   - $.trackPageview() - Tracks a pageview using the given uri. Can be used for tracking Ajax requests: http://www.google.com/support/analytics/bin/answer.py?hl=en&answer=55519
*   - $.trackEvent() - Tracks an event using the given parameters.
*   - $('a').track() - Adds event tracking to element(s).
*   - $.timePageLoad() - Measures the time it takes  an event using the given parameters.
*
* Features:
*   - Improves page load time by loading Google Analytics code without blocking.
*   - Easy and extensible event and link tracking plugin for jQuery and Google Analytics
*   - Automatic internal/external link detection. Default behavior is to skip
*     tracking of internal links.
*   - Enforces that tracking event handler is added to an element only once.
*   - Configurable: custom event tracking, skip internal links, metadata
*     extraction using callbacks.
*
* Copyright (c) 2008-09 Christian Hellsten
*
* Plugin homepage:
*   http://aktagon.com/projects/jquery/google-analytics/
*   http://github.com/christianhellsten/jquery-google-analytics/
*
* Examples:
*   http://aktagon.com/projects/jquery/google-analytics/examples/
*   http://code.google.com/apis/analytics/docs/eventTrackerGuide.html
*
* Repository:
*   git://github.com/christianhellsten/jquery-google-analytics.git
*
* Version 1.1.3
*
* Tested with:
*   - Mac: Firefox 3, Safari 3
*   - Linux: Firefox 3
*   - Windows: Firefox 3, Internet Explorer 6
*
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*
* Credits:
*   - http://google.com/analytics
*   - http://lyncd.com: 
*       Idea for trackPage method came from this blog post: http://lyncd.com/2009/03/better-google-analytics-javascript/
*/
(function($) {

  var pageTracker;

  /**
   * Enables Google Analytics tracking on the page from which it's called. 
   *
   * Usage:
   *  <script type="text/javascript">
   *    $.trackPage('UA-xxx-xxx', options);
   *  </script>
   *
   * Parameters:
   *   account_id - Your Google Analytics account ID.
   *   options - An object containing one or more optional parameters:
   *     - onload - boolean - If false, the Google Analytics code is loaded
   *       when this method is called instead of on window.onload.
   *     - status_code - The HTTP status code of the current server response.
   *       If this is set to something other than 200 then the page is tracked
   *       as an error page. For more details: http://www.google.com/support/analytics/bin/answer.py?hl=en&answer=86927
   *     - callback  - function to be executed after the Google Analytics code is laoded and initialized
   *
   */
  $.trackPage = function(account_id, options) {
    var host = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
    var script;

    // Use default options, if necessary
    var settings = $.extend({}, {onload: true, status_code: 200}, options);
    var src  = host + 'google-analytics.com/ga.js';

    function init_analytics() {
      if (typeof _gat != undefined) {
        debug('Google Analytics loaded');

        pageTracker = _gat._getTracker(account_id);

        if(settings.status_code == null || settings.status_code == 200) {
          pageTracker._trackPageview();
        } else {
          debug('Tracking error ' + settings.status_code);
          pageTracker._trackPageview("/" + settings.status_code + ".html?page=" + document.location.pathname + document.location.search + "&from=" + document.referrer);
        }
        if($.isFunction(settings.callback)){
          settings.callback();
        }
      }
      else { 
        throw "_gat is undefined"; // setInterval loading?
      }
    }

    load_script = function() {
      $.ajax({
        type: "GET",
        url: src,
        success: function() {          
          init_analytics(); 
        },
        dataType: "script",
        cache: true // We want the cached version
      });
    }
    
    // Enable tracking when called or on page load?
    if(settings.onload == true || settings.onload == null) {
      $(window).load(load_script);
    } else {
      load_script();
    }
  }

  /**
   * Tracks an event using the given parameters. 
   *
   * The trackEvent method takes four arguments:
   *
   *  category - required string used to group events
   *  action - required string used to define event type, eg. click, download
   *  label - optional label to attach to event, eg. buy
   *  value - optional numerical value to attach to event, eg. price
   *  skip_internal - optional boolean value. If true then internal links are not tracked.
   *
   */
  $.trackEvent = function(category, action, label, value) {
    if(typeof pageTracker == 'undefined') {
      debug('FATAL: pageTracker is not defined'); // blocked by whatever
    } else {
      pageTracker._trackEvent(category, action, label, value);
    }
  };

  /**
   * Tracks a pageview using the given uri.
   *
   */
  $.trackPageview = function(uri) {
    if(typeof pageTracker == 'undefined') {
      debug('FATAL: pageTracker is not defined');
    } else {
      pageTracker._trackPageview(uri);
    }
  }

  /**
   * Adds click tracking to elements. Usage:
   *
   *  $('a').track()
   *
   */
  $.fn.track = function(options) {
    // Add event handler to all matching elements
    return this.each(function() {
      var element = $(this);

      // Prevent an element from being tracked multiple times.
      if (element.hasClass('tracked')) {
        return false;
      } else {
        element.addClass('tracked');
      } 

      // Use default options, if necessary
      var settings = $.extend({}, $.fn.track.defaults, options);

      // Merge custom options with defaults.
      var category = evaluate(element, settings.category);
      var action   = evaluate(element, settings.action);
      var label    = evaluate(element, settings.label);
      var value    = evaluate(element, settings.value);
      var event_name = evaluate(element, settings.event_name);
      
      var message = "category:'" + category + "' action:'" + action + "' label:'" + label + "' value:'" + value + "'";
      
      debug('Tracking ' + event_name + ' ' + message);

      // Bind the event to this element. 
      // TODO Use .live since jQuery 1.4 now supports it better.
      element.bind(event_name + '.track', function() {       
        // Should we skip internal links? REFACTOR
        var skip = settings.skip_internal && (element[0].hostname == location.hostname);
      
        if(!skip) {
          $.trackEvent(category, action, label, value);
          debug('Tracked ' + message);
        } else {
          debug('Skipped ' + message);
        }

        return true;
      });
    });
    
    /**
     * Checks whether a setting value is a string or a function.
     * 
     * If second parameter is a string: returns the value of the second parameter.
     * If the second parameter is a function: passes the element to the function and returns function's return value.
     */
    function evaluate(element, text_or_function) {
      if(typeof text_or_function == 'function') {
        text_or_function = text_or_function(element);
      }
      return text_or_function;
    };
  };

  /**
   * Prints to Firebug console, if available. To enable:
   *   $.fn.track.defaults.debug = true;
   */
  function debug(message) {
    if (typeof console != 'undefined' && typeof console.debug != 'undefined' && $.fn.track.defaults.debug) {
      console.debug(message);
    }
  };

  /**
   * Default (overridable) settings.
   */
  $.fn.track.defaults = {
    category      : function(element) { return (element[0].hostname == location.hostname) ? 'internal':'external'; },
    action        : 'click',
    label         : function(element) { return element.attr('href'); },
    value         : null,
    skip_internal : true,
    event_name    : 'click',
    debug         : false
  };
})(jQuery);

