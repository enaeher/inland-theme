// since my page has some issues with browser zoom, I want to track users' zoom levels with
// Google Analytics to see how many people are affected

$(document).ready (reportZoom);
$(window).on("throttledresize", reportZoom);

function reportZoom () {
  var zoom = DetectZoom.ratios().zoom;
  if (typeof pageTracker != 'undefined') {
    pageTracker._trackEvent ('Browser Zoom Ratio', 'load', zoom, zoom)
    }
}
