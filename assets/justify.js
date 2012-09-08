$(window).load (justify);
$(window).on("throttledresize", justify);

function getRelevantWidth (e) {
  e = $(e).find('img')[0] || e;
  if (e.originalWidth) {
    return e.originalWidth;
  } else {
    var width = $(e).width();
    e.originalWidth = width;
    return width;
  }
}

function centerImage (e, width) {
  var image = $(e).find('img')[0];
  $(image).css({left: ((width - $(image).width()) / 2)});  
}

function scaleRow (row, ratio) {
  var width;
  var rowScaledWidth = 0;
  $(row).each (function (i, e) {
    var width = (getRelevantWidth (e) * ratio);
    $(e).width (width);
    rowScaledWidth += width;
    centerImage (e, width);
  });
  return rowScaledWidth;
}

function replaceProductWithExhortation (product, products, exhortations) {
  var exhortation = exhortations.shift();
  $(exhortation).insertBefore (product);
  products.unshift (product);
  return exhortation;
}

function justify () {
  // http://www.wackylabs.net/2012/03/flickr-justified-layout-in-jquery/

  $products = $('#products');

  var maxHeight = 300;

  var containerWidth = $products.innerWidth();

  var products = jQuery.makeArray ($('.product'));
  var exhortations = jQuery.makeArray ($('.exhortation'));

  var zoomRatio = DetectZoom.ratios().zoom;
  if (zoomRatio >= 1) {
    var horizontalMargins = 10 * zoomRatio;
  } else {
    // for some reason this kind of works zooming out, not really at all zooming in;
    var horizontalMargins = $(products[0]).outerWidth(true) - $(products[0]).innerWidth();
  }

  var totalWidth = 0;
  var currentRow = [];
  var rowIndex = 0;
  var columnIndex = 0;

  var product;

  while (product = products.shift()) {
    var width = getRelevantWidth (product);

    // exhortations go at the beginning of even rows
    if (rowIndex % 2 == 0 && columnIndex == 0 && exhortations[0]) {
      product = replaceProductWithExhortation (product, products, exhortations);
      width = getRelevantWidth (product);
    } else if ((totalWidth + width + horizontalMargins) >= containerWidth && rowIndex % 2 == 1 && exhortations[0]) {
      product = replaceProductWithExhortation (product, products, exhortations);
      width = getRelevantWidth (product);
    }
    totalWidth += width;
    columnIndex++;
    currentRow.push(product);
  
    var totalMargins = horizontalMargins * currentRow.length;

    if (totalWidth + totalMargins >= containerWidth) {
      // at the end of a row
      var scaledWidth = scaleRow (currentRow, ((containerWidth - totalMargins) / totalWidth));
      currentRow = [];
      totalWidth = 0;
      columnIndex = 0;
      rowIndex++;
    } else if (!products[0]) {
      // when the last item doesn't correspond with the end of a row, fill in the rest of the row
      var scaledWidth = scaleRow (currentRow, 1);
      var spacer = $('#spacer');
      spacer.insertAfter (product);
      // don't ask about the three
      spacer.width(containerWidth - 3 - (scaledWidth + totalMargins + horizontalMargins));
    }
  }
}
