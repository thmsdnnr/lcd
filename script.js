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
        let rNumDigits=Math.floor(Math.random()*5)+5;
        let bgColor=colors[Math.floor(Math.random()*colors.length-1)];
        var display = new LCD({numDigits:rNumDigits, color:randC.text, height:rHeight, bgColor:randC.bg});
        let C=document.createElement('div');
        display.init(C);
        pContainer.appendChild(C);
        counters.push(display);
    }
    counters.forEach((d,idx)=>{
        d.setCounter('hell0');
        setTimeout(()=>{
          let rDigits=Math.floor(Math.random()*(Math.pow(10,d.getSize())));
          d.setCounter(rDigits);
          setInterval(()=>{
            let value=d.getValue();
            d.setCounter(value+1);
          },1000);        
        },1000)  
    });
}