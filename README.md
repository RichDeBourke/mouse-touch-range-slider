Mouse / Touch Range Slider
============================

## jQuery plugin that provides:

* Operation with both mouse and touch events
* Single slider for selecting one value (the plugin does not support dual sliders)
* Just the minimum required operation (to minimize DOM touches)
    * No value grid or display of the current value (by the plugin)
        * *An onChange event is included that can be used to do something with the new value to indicate there has been a change*
    * No colored filler bar on the left side of the slider to indicate the amount the slider has moved
        * *Many range slider plugins provide a filler on the left of the slider (which looks nice), but for my application I wanted to minimize the number of elements that needed to be updated when the slider was moved*
* Works in responsive layouts (using the resize event)

## Dependencies
* jQuery 2.X or 3.X - The plugin only supports newer browsers including IE from version 9 - it does not support IE8 or lower
    * The plugin does work with the slim build version of jQuery 3.X

## Usage

Include the CSS file in the head section:

~~~~ html
<link href="mouse-touch-range-slider.css" rel="stylesheet" type="text/css">
~~~~

Include an input for each range slider (*more about the input below*):

~~~~ html
<input type="text" id="slider" class="slider" value="" name="slider" tabindex="2" />
~~~~

Add jQuery, the plugin, the JavaScript code to initiate the plugin, and code to do something when the slider is moved in the body section:

~~~~ javascript
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.0.0/jquery.slim.min.js"></script>
<script src="jquery.property-drag-drop.plugin.js"></script>
<script>
    function sliderMoved(sliderDataObject) {
        console.log("Position is: " + sliderDataObject.id);
    }
    
    $(document).ready(function () {
        $(".slider").mtRangeSlider({
            min: 0,
            max: 255,
            onChange: sliderMoved
        });
    });
</script>
~~~~

### Range Slider input
The plugin builds the slider around an HTML input. The slider is contained within a span tag, which is attached to the input's parent.

##### Source HTML

~~~~ html
<div class="ctrl red">
  <input type="text" id="slider" class="slider" value="" name="slider" tabindex="2" />
</div>
~~~~

##### Generated HTML

~~~~ html
<div class="ctrl red">
    <span class="rs rs-0">
        <span class="rs-track" tabindex="-1"></span>
        <span class="rs-slider single" tabindex="5" style="left: 0%;"></span>
    </span>
    <input type="text" id="slider" class="slider rs-hidden-input" value="" name="slider" tabindex="-1" readonly="">
</div>
~~~~

The class on the parent div (.red in this case) can be used for applying styling to the slider.

##### Styling the slider
The slider can be styled to adjust the position, size, and color of track as desired. *

~~~~ css
.rs {
    height: 50px;
}

.rs-track {
    height: 16px;
    top: 23px;
    border: none;
    border-radius: 16px;
}

.rs-slider {
    top: 15px;
    width: 30px;
    height: 30px;
}

.red .rs-track { /* Example of a solid track background */
    background-color: #ff0000;
}

.saturation .rs-track { /* Example of a gradient track background */
    background: #000000;
    background: -moz-linear-gradient(left, #fdfdfd 0%, #000000 100%);
    background: -webkit-linear-gradient(left, #fdfdfd 0%,#000000 100%);
    background: linear-gradient(to right, #fdfdfd 0%,#000000 100%);
}
~~~~

*Note: IE9 does not support gradients, so, for my application, I use a special CSS file for IE9 that substitutes a background image for the gradients.*

## Mobile friendly styling
To be considered [mobile friendly](https://developers.google.com/speed/pagespeed/insights/) by Google, touch targets, like the slider handle and the slider track, need to be at least 48 pixels wide by 48 pixels high. While a larger sized slider would work with a mouse, it would be (in my opinion) less attractive, so I use two styles, one for mouse / pointer devices and the other for touch capable devices.

![Desktop and mobile slider example](images/Slider_style.png)


##### Detecting touch devices
I use a version of [mhulse's no-x.js](https://gist.github.com/mhulse/4704893) method to control the touch/no touch styling.

The `html` tag starts with a `no-touch` class:

~~~~ html
    <html class="no-touch">
~~~~

The class on the `html` tag is changed from `no-touch` to `touch` by a JavaScript function if the device thinks it supports touch (in the unlikely event of a false-positive, the styling would result in touch styling on a non-touch device, which would still be operational):

~~~~ javascript
(function (window, document, navigator) {
    if (('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)) {
        document.documentElement.className = document.documentElement.className.replace(/\bno-touch\b/, 'touch');
    }
}(window, document, navigator));
~~~~

Apple Safari supports only [`'ontouchstart' in window`](https://developer.apple.com/library/mac/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/Attributes.html). The other major browsers support [`navigator.maxTouchPoints`](https://w3c.github.io/pointerevents/#extensions-to-the-navigator-interface).

##### Mobile CSS changes

~~~~ css
.no-touch .rs {
    height: 50px;
}

.touch .rs {
    height: 54px;
}

.rs-track {
    border: none;
    border-radius: 16px;
}

.no-touch .rs-track {
    height: 16px;
    top: 23px;
}

.touch .rs-track {
    height: 48px;
    top: 1px;
}

.no-touch .rs-slider {
    top: 15px;
    width: 30px;
    height: 30px;
}

.touch .rs-slider {
    top: 1px;
    width: 46px;
    height: 46px;
}
~~~~

## Demos

[Simple demo](http://richdebourke.github.io/mouse-touch-range-slider/simple.html) - demo of the plugin with a single slider

[Extended demo](http://richdebourke.github.io/mouse-touch-range-slider/index.html) - demo of the plugin with multiple sliders

[In operation](http://goo.gl/4Huz36) - plugin in use on a website

## Configuring the plugin

The plugin uses the following parameters when it is initialized:

* **min** - Slider minimum value - integer - default value is 0 
* **max** - Slider maximum value - integer - default value is 100
* **initialValue** - Slider starting value - integer - default value is 0
* **keyboard** - Lets the user adjust the value using the arrow keys - Boolean - default is true
* **onCreate** - Optional - callback function that's called after a slider is initiated.
* **onStart** - Optional - callback function that's called when a slider  handle is touched (by the mouse or by touch).
* **onChange** - Optional - callback function that's called when a slider has changed its position (by the mouse or by touch).
* **onFinish** - Optional - callback function that's called after a slider finishes moving (after the mouseup or touchend event)
  * All callback functions are provided with a sliderDataObject that contains:
        * **input** - the original input object
        * **id** - id for the original input object
        * **min** - slider's minimum value
        * **max** - slider's maximum value
        * **value** - slider's current value

## Positioning the slider
The slider can be positioned programmatically by creating a handle to the slider:

~~~~ html
var sliderHandle = $("#slider").data("mtRangeSlider");
~~~~

To position the slider, use the update function to pass the new position (the value can be either an integer or a string (e.g. 50 or "50")):

~~~~ html
sliderHandle.update(50);
~~~~

## How the plugin works
This plugin is loosely based on Denis Ineshin's [ion.rangeSlider](https://github.com/IonDen/ion.rangeSlider), using his plugin structure and control methods.

For each input that is submitted to the plugin, a new instance of the MouseTouchRangeSlider function is created and attached to the input.

The plugin creates the track and slider and attaches them to the original input's parent. Listeners for mousedown, touchstart, and keydown are attached to the track and slider.

Dragging a slider will change the range slider's value. Using the arrow keys (when a slider has focus) will move the slider one position. Clicking or tapping the track will also move the slider one position.

A listener for resize is attached to the window that will re-evaluate the slider settings if the window is resized.

## Revisions

#### 2020/07/05
Verified to work with jQuery 3.5.1.

#### 2019/05/10
Verified to work with jQuery 3.4.1.

#### 1.1.1 - 2016/08/30
#### Added CSS for touch devices
Added CSS styling for touch devices and updated the two demos to support both touch and non-touch displays. 

#### 1.1 - 2016/08/25
#### Revised the callback functions
Version 1.0 used three callback functions:
* onStart - Called when a slider was created
* onChange - Called when a slider position was changed
* onFinish - Called when a slider finished moving (on mouse or touch end)

Those callbacks were from the [plugin](https://github.com/IonDen/ion.rangeSlider) that was the basis for this plugin.

Now, I have a need for knowing when a slider is first selected to move (by either mouse or touch), so I've moved what was the onStart call to a new name, onCreate, and assigned the onStart call to a new point in the code. The now four callback functions are:
* onCreate - Called when a slider is created
* onStart - Called when a slider is touched
* onChange - Called when a slider position has changed
* onFinish - Called when a slider has finished moving (on mouse or touch end)

*Normally I wouldn't change the name of a callback as it would break the plugin if anyone was calling my code when building their application, but since it doesn't appear that anyone is using the plugin as yet, I felt it would be safe to make the change while using names that are clearer as to the functionality.*

## Why a new range slider plugin
There are a number of range slider plugins on GitHub, but they have capabilities I *don't* need for my application (e.g. filler bars that cover the left side of the slider, display of the current value as a tool-tip, and options for dual sliders (hi & low)).

My application is a [color contrast checker]() that supports both RGB and HLV, so there are six interconnected sliders. A change of one slider (e.g. red) can trigger a change in the values of three other sliders (hue, saturation, and brightness value). An additional complication is as a slider is moving, I am continually updating the display for a number of calculations, so it's important for me to minimize how much the plugin touches the DOM.

## Compatibility
The Mouse Touch Range Slider plugin has been confirmed to work as of April 2016 with the latest versions of:
* IE 9, 10, & 11
* Edge (desktop & Surface)
* Chrome (mobile & desktop)
* Firefox
* Android Internet
* Safari (mobile & desktop)

## License
This plugin is provided under the [MIT license](http://opensource.org/licenses/mit-license.php).

This plugin is loosely based on Denis Ineshin's [ion.rangeSlider](https://github.com/IonDen/ion.rangeSlider), which is also provided under the [MIT License](http://opensource.org/licenses/mit-license.php).

