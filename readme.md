# LCD

[demo](http://thmsdnnr.com/lcd/) //  [tutorial](http://thmsdnnr.com/tutorials/javascript/projects/svg/2017/12/28/code-morsels-coding-an-LCD-display.html)

### How To Use
1. Include the default styling in your page CSS (or make your own):
2. Include `lcd.min.js` in your page header
3. Instantiate the display in your page script with `new LCD()`

Required parameters: 
* `numDigits`: integral number of digits
* `height`: digit height in px

Optional parameters:
* `color`: hex color representation for LCD grains, e.g., `#CCCCCC`
* `bgColor`: hex color representation for background, e.g., `#000000`

Then:

1. Pass a DOM container element for the display to your LCD instance's `init` function.
* (optional: pass a `CSSClassStylingString`. 
   Default is `.-lcd-container`).

2. Once instantiated, `INSTANCE.setCounter()` takes a number or string to display, rejecting strings with length greater than display size, or entities that do not exist in the `digitsOn` dictionary.

## Sample usage:

### HTML:
```html
<html>
<head>
<script type="text/javascript" src="./lcd.min.js"></script>
</head>
<body>
	<div id="lcd-container">
		<!--the counter will go here -->
	</div>
</body>
</html>
```

### CSS:
```css
.lcd-container {
    margin: 10px;
    border: 1px solid black;
    display: flex;
    flex-flow: row nowrap;
    border-style: groove;
    justify-content: center;
    align-items: center;
}
```

### JS:
```javascript
var display = new LCD({numDigits:4, height:40});
let C=document.querySelector('div#lcd-container');
display.init(C);
display.setCounter('1337'); //cool!
```