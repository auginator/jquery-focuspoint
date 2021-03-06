/*!
 * jQuery FocusPoint; version: 1.0.1
 * Author: http://jonathonmenz.com
 * Source: https://github.com/jonom/jquery-focuspoint
 * Copyright (c) 2014 J. Menz; MIT License
 */
;
(function($) {
	$.fn.focusPoint = function(options) {
		var settings = $.extend({
			// These are the defaults.
			reCalcOnWindowResize: true
		}, options);
		return this.each(function() {
			//Initial adjustments
			var container = $(this);
			//Replace basic css positioning with more accurate version
			container.removeClass('focus-left-top focus-left-center focus-left-bottom focus-center-top focus-center-center focus-center-bottom focus-right-top focus-right-center focus-right-bottom');
			//Focus image in container
			container.adjustFocus();
			if (settings.reCalcOnWindowResize) {
				//Recalculate each time the window is resized
				$(window).resize(function() {
					container.adjustFocus();
				});
			}
		});
	};
	$.fn.adjustFocus = function() {
		return this.each(function() {
			//Declare variables at top of scope
			var containerW,
				containerH,
				image,
				imageW,
				imageH,
				wR,
				hR,
				hShift,
				vShift,
				containerCenterX,
				focusFactorX,
				scaledImageWidth,
				focusX,
				focusOffsetX,
				xRemainder,
				containerXRemainder,
				containerCenterY,
				focusFactorY,
				scaledImageHeight,
				focusY,
				focusOffsetY,
				yRemainder,
				containerYRemainder;
			//Adjust the focus of frame
			containerW = $(this).width();
			containerH = $(this).height();
			image = $(this).find('img').first();
			imageW = $(this).data('imageW');
			imageH = $(this).data('imageH');
			if (!(containerW > 0 && containerH > 0 && imageW > 0 && imageH > 0)) {
				//Need dimensions to proceed
				return false;
			}
			//Which is over by more?
			wR = imageW / containerW;
			hR = imageH / containerH;
			//Minimise image while still filling space
			if (imageW > containerW && imageH > containerH) {
				if (wR > hR) {
					image.css('max-width', '');
					image.css('max-height', '100%');
				} else {
					image.css('max-width', '100%');
					image.css('max-height', '');
				}
			} else {
				image.css('max-width', '');
				image.css('max-height', '');
			}
			//Amount position will be shifted
			hShift = 0;
			vShift = 0;
			if (wR > hR) {
				//Container center in px
				containerCenterX = Math.floor(containerW / 2);
				//Focus point of resize image in px
				focusFactorX = (Number($(this).data('focus-x')) + 1) / 2;
				//Can't use width() as images may be display:none
				scaledImageWidth = Math.floor(imageW / hR);
				focusX = Math.floor(focusFactorX * scaledImageWidth);
				//console.log('x'+focusX);
				//Calculate difference beetween focus point and center
				focusOffsetX = focusX - containerCenterX;
				//Reduce offset if necessary so image remains filled
				xRemainder = scaledImageWidth - focusX;
				containerXRemainder = containerW - containerCenterX;
				if (xRemainder < containerXRemainder) focusOffsetX -= containerXRemainder - xRemainder;
				if (focusOffsetX < 0) focusOffsetX = 0;
				//console.log('x'+focusOffsetX);
				//Shift to left
				hShift = focusOffsetX * -1;
			} else if (wR < hR) {
				//Container center in px
				containerCenterY = Math.floor(containerH / 2);
				//Focus point of resize image in px
				focusFactorY = (Number($(this).data('focus-y')) + 1) / 2;
				//Can't use width() as images may be display:none
				scaledImageHeight = Math.floor(imageH / wR);
				focusY = scaledImageHeight - Math.floor(focusFactorY * scaledImageHeight);
				//Calculate difference beetween focus point and center
				focusOffsetY = focusY - containerCenterY;
				//Reduce offset if necessary so image remains filled
				yRemainder = scaledImageHeight - focusY;
				containerYRemainder = containerH - containerCenterY;
				if (yRemainder < containerYRemainder) focusOffsetY -= containerYRemainder - yRemainder;
				if (focusOffsetY < 0) focusOffsetY = 0;
				//Shift to top
				vShift = focusOffsetY * -1;
			}
			image.css('left', hShift + 'px');
			image.css('top', vShift + 'px');
		});
	};
})(jQuery);