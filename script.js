var LCD = (function() {
    var id=0;
    function LCD(config={}) {
        const { numDigits, color, height, bgColor } = config;
        if (!Number.isInteger(numDigits)||numDigits<1) { throw new Error('Cannot have non-integral number of digits'); }
        // We are good, so configure
        this.backgroundColor = bgColor;
        this.instanceID = ++id;
        this.numDigits = numDigits || 3;
        this.GRAIN_COLOR = color || '#00FF00';
        this.height = height || '64'; //aspect ratio for the SVG is 2:1
        this.width=height/2;
        this.padding = 8;
        this.digitsOn = {
            '0': [0, 1, 2, 4, 5, 6],
            '1': [2, 5],
            '2': [0, 2, 3, 4, 6],
            '3': [0, 2, 3, 5, 6],
            '4': [1, 2, 3, 5],
            '5': [0, 1, 3, 5, 6],
            '6': [0, 1, 3, 4, 5, 6],
            '7': [0, 2, 5],
            '8': [0, 1, 2, 3, 4, 5, 6],
            '9': [0, 1, 2, 3, 5],
            'err': [0, 1, 3, 4, 6]
        };
        this.HIGH_OPACITY='1.0';
        this.LOW_OPACITY='0.2';
        this.value=null;
        this.operating=true;
    }

    LCD.prototype.getSize = function() { return this.numDigits; }
    LCD.prototype.getValue = function() { return this.value; }
    LCD.prototype.resetDigit = function(n) { //resets all of digit N's grains to low opacity
        for (var i=0;i<=6;i++) {
            let key='c_'+this.instanceID+'_d_'+n+'_'+i;
            let grain=document.querySelector(`path#${key}`);
            grain.style.fillOpacity=this.LOW_OPACITY;
        }  
    }

    LCD.prototype.resetDisplay = function() {
        for (var i=0;i<this.numDigits;i++) { this.resetDigit(i); }
    }

    LCD.prototype.displayError = function() {
        this.resetDisplay();
        this.setDigit(Math.max((this.numDigits-1),0),'err');
        this.operating=false;
    }

    LCD.prototype.setDigit = function(idx, n) { //sets digit idx to number n [0-9]
        for (var i=0;i<=6;i++) {
            let key='c_'+this.instanceID+'_d_'+idx+'_'+i;
            let grain=document.querySelector(`path#${key}`);
            this.digitsOn[n].includes(i) ? grain.style.fillOpacity=this.HIGH_OPACITY : grain.style.fillOpacity=this.LOW_OPACITY;
        }
    }

    LCD.prototype.setCounter = function(n) { //sets counter to n
        if (!this.operating) { return false; }
        this.value=n;
        let nString=String(n).split("");
        const counterSz=this.numDigits;
        if (nString.length>counterSz) { 
            return this.displayError();
            // throw new Error('The counter is not large enough to display this number!'); 
        }
        let difference=counterSz-nString.length;
        for (var i=counterSz;i>=0;i--) {
            if (nString[i]) { this.setDigit(i+difference, nString[i]); }
        }
    }

    LCD.prototype.init = function(domContainer) {
        if (!domContainer) { throw new Error('You must provide a DOM element container in which to mount the LCD.'); }
        this.domContainer=domContainer;
        const createDigit = (id, containerID) => {
            const path_d = [
                'M 2.102706,2.0144078 0.21966194,0.08855428 8.1139619,0.07386242 c 4.3418651,-0.0080805 11.4445871,-0.0080805 15.7838261,0 L 31.787315,0.08855428 29.918288,2.0150532 28.049261,3.9415521 16.017505,3.9409067 3.98575,3.9402615 Z',
                'M 0.0748124,16.036988 V 1.1900692 l 1.9120139,1.9113555 1.912014,1.9113556 V 16.991996 28.971212 l -1.912014,0.956348 -1.9120139,0.956347 z',
                'M 29.986243,29.91021 28.059744,28.943392 V 17.007061 5.0707299 L 30.000728,3.1303946 31.941711,1.1900594 V 16.036813 c 0,8.165715 -0.0065,14.845282 -0.01448,14.843484 -0.008,-0.0018 -0.88141,-0.438338 -1.940984,-0.970087 z',
                'M 15.950322,33.896437 3.8698704,33.867467 2.0217123,32.935967 0.17355421,32.004466 0.37042753,31.886274 C 0.47870785,31.821268 1.3136652,31.386431 2.2258884,30.919971 L 3.884476,30.07186 h 12.101868 12.101869 l 1.868809,0.960773 c 1.027846,0.528425 1.86881,0.971711 1.86881,0.985081 0,0.01337 -0.853888,0.44807 -1.897529,0.966001 l -1.897529,0.941692 z',
                'm 0.0748124,47.989968 c 0,-8.165712 0.01293156,-14.846748 0.02873682,-14.846748 0.0158052,0 0.8762115,0.423498 1.91201398,0.941107 l 1.8832771,0.941107 V 47.01972 59.014006 l -1.912014,1.911356 -1.9120139,1.911355 z',
                'M 29.986243,60.881912 28.059744,58.954769 V 47.005172 35.055574 l 1.918337,-0.95951 c 1.055086,-0.527731 1.928579,-0.94927 1.941096,-0.936753 0.01252,0.01252 0.01619,6.68883 0.0082,14.836252 l -0.0146,14.813493 z',
                'M 1.5122915,62.591131 C 2.21487,61.866159 3.0591393,61.005875 3.3884455,60.679389 l 0.5987386,-0.593612 12.0487309,-8.16e-4 12.048732,-8.16e-4 1.328002,1.376615 c 0.730401,0.757139 1.565135,1.61779 1.854963,1.912559 l 0.526961,0.535943 H 16.014725 0.23487602 Z'   
            ];
            this.container = document.createElement('div');
            this.container.id='container'+this.instanceID;
            var digit = document.createElement('div');
            var layerID = 'layer_'+id;
            digit.id='digit';
            var scale='scale('+this.scale+')';
            var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute('viewBox', '0 0 32 64');
            svg.setAttribute('width', this.width);
            svg.setAttribute('height', this.height);
            svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
            var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.setAttributeNS(null,"transform","translate(0,32)");
            g.setAttributeNS(null,"id",layerID);    
            for (var i=0;i<=6;i++) {
                var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttributeNS(null,"transform", "translate(0,-32)");
                path.setAttributeNS(null,"id",'c_'+containerID+'_d_'+id+'_'+i);
                path.setAttributeNS(null,"d",path_d[i]);
                path.setAttributeNS(null,"style", "fill:"+this.GRAIN_COLOR+";fill-opacity:0.3;stroke:none;stroke-width:0;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1");
                g.appendChild(path);
            }
            svg.appendChild(g);
            digit.appendChild(svg);
            return digit;
        }
        domContainer.style.backgroundColor=this.backgroundColor;
        domContainer.style.height=(this.padding+this.height)+"px";
        domContainer.style.width=(this.padding+this.width)*this.numDigits+"px";
        const containerID=this.instanceID;
        for (var i=0;i<this.numDigits;i++) { 
            domContainer.appendChild(createDigit(i, containerID)); 
        }
    }

    LCD.prototype.unmount = function() {
        if (!this.domContainer) { throw new Error('LCD has not been mounted!'); }
        let cID='#'+this.domContainer.id+' div';
        let children=document.querySelectorAll(cID)
        children.forEach(child=>this.domContainer.removeChild(child));
    }
    return LCD;
})();

const randContrastC = () => {
    const rand = () => Math.floor(Math.random()*255).toString(16);
    const twoHex = (h) => h.length===2 ? h : "0"+h;
    const nTimes = (n, fn) => {
    let a=[];
    for (var i=0;i<n;i++) { a.push(fn()); }
    return a.join("");
    };
    let rC="#"+nTimes(3,()=>twoHex(rand()));
    let text = tinycolor(rC);
    let bg = tinycolor(rC);
    bg = text.isLight() ? bg.darken(50) : bg.lighten(50);
    return {text:text.toString(), bg:bg.toString()};
};

window.onload = function() {
    let counters=[];
    const pContainer=document.querySelector('#pageContainer');
    let colors=['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#FF6F00', '#FF5722', '#795548'];
    for (var i=0;i<10;i++) {
        let randC=randContrastC();
        let rHeight=Math.random()*100+24;
        let rNumDigits=Math.floor(Math.random()*10)+1;
        let bgColor=colors[Math.floor(Math.random()*colors.length-1)];
        var display = new LCD({numDigits:rNumDigits, color:randC.text, height:rHeight, bgColor:randC.bg});
        let C=document.createElement('div');
        C.classList.add('lcd-container');
        C.id='container'+i;
        display.init(C);
        pContainer.appendChild(C);
        counters.push(display);
    }
    counters.forEach((d,idx)=>{
        let rDigits=Math.floor(Math.random()*(Math.pow(10,d.getSize())));
        d.setCounter(rDigits);
        setInterval(()=>{
            let value=d.getValue();
            d.setCounter(value+1);
        },1000);
    });
}