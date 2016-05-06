/* =======================================================================
 * slider-demo.js
 * Version: 1.0
 * Date: 2016/04/29
 * By: Rich DeBourke
 * License: MIT
 * GitHub: https://github.com/RichDeBourke/mouse-touch-range-slider
 * RGB to HSV based on: http://www.javascripter.net/faq/rgb2hsv.htm
 * HSV to RGB based on: http://snipplr.com/view/14590
 * ======================================================================= */

(function ($, document) {
    "use strict";
    var arrayHexDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"],
        fcVal,
        fcRVal,
        fcGVal,
        fcBVal,
        fcHValHolder = "0",
        fcSValHolder = "0",
        fcVValHolder = "0",
        frSliderHandle,
        fgSliderHandle,
        fbSliderHandle,
        fhSliderHandle,
        frSliderElement,
        fgSliderElement,
        fbSliderElement,
        fhSliderElement,
        $fcolorResult;

    function hexValid(strHexValue) {
        var result = false;

        strHexValue = strHexValue.toUpperCase();
        if (/^[0-9A-F]{3}$|^[0-9A-F]{6}$/.test(strHexValue)) {
            result = strHexValue;
            if (strHexValue.length === 3) {
                result = strHexValue.charAt(0) + strHexValue.charAt(0) + strHexValue.charAt(1) + strHexValue.charAt(1) + strHexValue.charAt(2) + strHexValue.charAt(2);
            }
        }
        return result;
    }

    function decimalValid(valueDecimalValue) {
        var result = false;

        if (/^\d+$/.test(valueDecimalValue)) {
            result = true;
        }
        return result;
    }

    function hex(x) {
        // arrayHexDigits defined at the top
        return isNaN(x) ? "00" : arrayHexDigits[(x - x % 16) / 16] + arrayHexDigits[x % 16];
    }

    function updateRGBfromHex() {
        var frontHex;

        frontHex = fcVal.value;
        if (fcRVal.value !== parseInt(frontHex.substring(0, 2), 16).toString()) {
            fcRVal.value = parseInt(frontHex.substring(0, 2), 16);
        }
        if (fcGVal.value !== parseInt(frontHex.substring(2, 4), 16).toString()) {
            fcGVal.value = parseInt(frontHex.substring(2, 4), 16);
        }
        if (fcBVal.value !== parseInt(frontHex.substring(4, 6), 16).toString()) {
            fcBVal.value = parseInt(frontHex.substring(4, 6), 16);
        }
    }

    function updateHexFromRGB() {
        fcVal.value = hex(fcRVal.value) + hex(fcGVal.value) + hex(fcBVal.value);
    }

    function updateHSVfromRGB() {
        var d, h,
            fh, fs, fv,
            minForeRGB, maxForeRGB,
            fcR,
            fcG,
            fcB;

        fcR = fcRVal.value / 255;
        fcG = fcGVal.value / 255;
        fcB = fcBVal.value / 255;
        minForeRGB = Math.min(fcR, Math.min(fcG, fcB));
        maxForeRGB = Math.max(fcR, Math.max(fcG, fcB));
        if (maxForeRGB === minForeRGB) {
            fh = 0;
            fs = 0;
            fv = maxForeRGB;
        } else {
            d = (fcR === minForeRGB) ? fcG - fcB : ((fcB === minForeRGB) ? fcR - fcG : fcB - fcR);
            h = (fcR === minForeRGB) ? 3 : ((fcB === minForeRGB) ? 1 : 5);
            fh = 60 * (h - d / (maxForeRGB - minForeRGB));
            fs = (maxForeRGB - minForeRGB) / maxForeRGB;
            fv = maxForeRGB;
        }
        if (fcHValHolder !== Math.round(fh).toString()) {
            fcHValHolder = Math.round(fh).toString();
        }
        if (fcSValHolder !== Math.round(fs * 100).toString()) {
            fcSValHolder = Math.round(fs * 100).toString();
        }
        if (fcVValHolder !== Math.round(fv * 100).toString()) {
            fcVValHolder = Math.round(fv * 100).toString();
        }
    }

    function updateRGBfromHSV() {
        var tmp, factorial, p, q, t,
            foreH,
            foreS,
            foreV;

        foreH = parseInt(fcHValHolder, 10);
        foreS = parseInt(fcSValHolder, 10) / 100;
        foreV = parseInt(fcVValHolder, 10) / 100;

        if (foreS === 0) {
            tmp = Math.round(foreV * 255);
            fcRVal.value = tmp.toString();
            fcGVal.value = tmp.toString();
            fcBVal.value = tmp.toString();
        } else {
            if (foreH === 360) {
                foreH = 0;
            }
            foreH = foreH / 60;
            tmp = Math.floor(foreH);
            factorial = foreH - tmp; // factorial part of h
            p = foreV * (1 - foreS);
            q = foreV * (1 - foreS * factorial);
            t = foreV * (1 - foreS * (1 - factorial));
            switch (tmp) {
            case 0:
                fcRVal.value = Math.round(foreV * 255).toString();
                fcGVal.value = Math.round(t * 255).toString();
                fcBVal.value = Math.round(p * 255).toString();
                break;
            case 1:
                fcRVal.value = Math.round(q * 255).toString();
                fcGVal.value = Math.round(foreV * 255).toString();
                fcBVal.value = Math.round(p * 255).toString();
                break;
            case 2:
                fcRVal.value = Math.round(p * 255).toString();
                fcGVal.value = Math.round(foreV * 255).toString();
                fcBVal.value = Math.round(t * 255).toString();
                break;
            case 3:
                fcRVal.value = Math.round(p * 255).toString();
                fcGVal.value = Math.round(q * 255).toString();
                fcBVal.value = Math.round(foreV * 255).toString();
                break;
            case 4:
                fcRVal.value = Math.round(t * 255).toString();
                fcGVal.value = Math.round(p * 255).toString();
                fcBVal.value = Math.round(foreV * 255).toString();
                break;
            default: // case 5:
                fcRVal.value = Math.round(foreV * 255).toString();
                fcGVal.value = Math.round(p * 255).toString();
                fcBVal.value = Math.round(q * 255).toString();
            }
        }
    }


    function updateSliderPositions() {
        // Values in the text boxes are calculated
        // Sliders are updated only if the value has changed

        if (frSliderElement.value !== fcRVal.value) {
            frSliderHandle.update(fcRVal.value);
        }
        if (fgSliderElement.value !== fcGVal.value) {
            fgSliderHandle.update(fcGVal.value);
        }
        if (fbSliderElement.value !== fcBVal.value) {
            fbSliderHandle.update(fcBVal.value);
        }
        if (fhSliderElement.value !== fcHValHolder) {
            fhSliderHandle.update(fcHValHolder);
        }

    }

    function updateRGBfromSliders(sliderId) {
        switch (sliderId) {
        case frSliderElement.id:
            fcRVal.value = frSliderElement.value;
            break;
        case fgSliderElement.id:
            fcGVal.value = fgSliderElement.value;
            break;
        default:
            fcBVal.value = fbSliderElement.value;
        }
    }

    function updateHSVfromSliders() {
        if (fcHValHolder !== fhSliderElement.value) {
            fcHValHolder = fhSliderElement.value;
        }
    }

    function getLuminance(rgb) {
        var i, lum;

        for (i = 0; i < rgb.length; i++) {
            if (rgb[i] <= 0.03928) {
                rgb[i] = rgb[i] / 12.92;
            } else {
                rgb[i] = Math.pow(((rgb[i] + 0.055) / 1.055), 2.4);
            }
        }
        lum = (0.2126 * rgb[0]) + (0.7152 * rgb[1]) + (0.0722 * rgb[2]);
        return lum;
    }

    function updateColorsDisplay() {
        var fcRi = parseInt(fcRVal.value, 10),
            fcGi = parseInt(fcGVal.value, 10),
            fcBi = parseInt(fcBVal.value, 10),
            lumForInitial;

        $fcolorResult.css("background-color", "#" + fcVal.value);

        lumForInitial = getLuminance([fcRi / 255, fcGi / 255, fcBi / 255]);

        if ((lumForInitial > 0.215) && ($fcolorResult.css("color") === "rgb(255, 255, 255)")) {
            $fcolorResult.css("color", "#000000");
        } else if ((lumForInitial <= 0.215) && ($fcolorResult.css("color") === "rgb(0, 0, 0)")) {
            $fcolorResult.css("color", "#FFFFFF");
        }

    }

    function hexInputBoxChanged(event) {
        var validHexInput = hexValid(event.currentTarget.value);

        if (validHexInput) {
            event.currentTarget.value = validHexInput;
            updateRGBfromHex();
            updateHSVfromRGB();
            updateColorsDisplay();
            updateSliderPositions();
        } else {
            updateHexFromRGB();
        }
    }

    function rgbInputBoxChanged(event) {
        var value = parseInt(event.currentTarget.value, 10);

        if (decimalValid(event.currentTarget.value) && (value >= 0 && value <= 255)) {
            event.currentTarget.value = value.toString();
            updateHexFromRGB();
            updateHSVfromRGB();
            updateColorsDisplay();
            updateSliderPositions();
        } else {
            updateRGBfromHex();
        }
    }

    function rgbSliderMoved(sliderDataObject) {
        updateRGBfromSliders(sliderDataObject.id);
        updateHexFromRGB();
        updateHSVfromRGB();
        updateColorsDisplay();
        updateSliderPositions();
    }

    function hsvSliderMoved() {
        updateHSVfromSliders();
        updateRGBfromHSV();
        updateHexFromRGB();
        updateColorsDisplay();
        updateSliderPositions();
    }


    /* Setup the document objects:
        Set the hex field and the three decimal fields to their initial values
            and bind a function to handle changes to the values
        Create the sliders and set them to an initial value. */
    $(document).ready(function () {
        $(".color-slider").mtRangeSlider({
            min: 0,
            max: 255,
            onChange: rgbSliderMoved
        });
        $(".hue-slider").mtRangeSlider({
            min: 0,
            max: 360,
            onChange: hsvSliderMoved
        });
        // Handles for positioning Sliders
        frSliderHandle = $("#fc-red").data("mtRangeSlider");
        fgSliderHandle = $("#fc-green").data("mtRangeSlider");
        fbSliderHandle = $("#fc-blue").data("mtRangeSlider");
        fhSliderHandle = $("#fc-hue").data("mtRangeSlider");
        // Handles for getting SliderHandle values
        frSliderElement = document.getElementById("fc-red");
        fgSliderElement = document.getElementById("fc-green");
        fbSliderElement = document.getElementById("fc-blue");
        fhSliderElement = document.getElementById("fc-hue");
        // Set the initial values to the input boxes and bind the change handlers
        $("#fc").val("0024A7").on("focus", function () {this.select();}).change(hexInputBoxChanged);
        $("#fc-r").val("0").on("focus", function () {this.select();}).change(rgbInputBoxChanged);
        $("#fc-g").val("36").on("focus", function () {this.select();}).change(rgbInputBoxChanged);
        $("#fc-b").val("167").on("focus", function () {this.select();}).change(rgbInputBoxChanged);
        fcHValHolder = "227";
        fcSValHolder = "100";
        fcVValHolder = "65";
        // Handles for getting & setting the values for the color the input boxes
        fcVal = document.getElementById("fc");
        fcRVal = document.getElementById("fc-r");
        fcGVal = document.getElementById("fc-g");
        fcBVal = document.getElementById("fc-b");
        // jQuery handles for setting the background and text colors for the two color table divs
        $fcolorResult = $("#color-result");
        // Get the stored color data for the color samples
        updateColorsDisplay();
        updateSliderPositions();

    });
}(jQuery, document));
