var data;
var widthIndex;
self.onmessage=function(e) {
    var json=e.data;
    if(json.action=="data") {
        data=json.value;
    }
    else if(json.action=="widthIndex") {
        widthIndex=JSON.parse(json.value);
    }
    else if(json.action=="get") {
        if(json.value=="wrapText") {
            var input=json.input;
            var out=wrapText(input);
        }
    }
}
function wrapText(input) {
    var text=input.text;
    var x=input.x;
    var y=input.y;
    var maxWidth=input.maxWidth;
    var lineHeight=input.lineHeight;
    var height=input.height;
    
    var words = text.split(" ");
    var line = '';
    var error=false;
    var lineCount=1;
    for(var n = 0; n < words.length; n++) {
        var testLine = line + words[n]+' ';
        var metrics = measureText(testLine);
        var testWidth = metrics;
        var word=measureText(words[n]);
        var chop=words[n].length;
        while (word>maxWidth) {
            var possible=words[n].substring(0, chop);
            var after=words[n].substring(chop, words[n].length);
            if(measureText(possible)<maxWidth) {
                words[n]=possible
                words.splice(n+1, 0, after);
                break;
            }
            if(chop>1) {
                chop--;
            }
            else {
                return;
            }
        }
        if(!error) {
            if (testWidth > maxWidth && n > 0) {
                postMessage({line: line, x: x, y: y});
                line = words[n] + ' ';
                y += lineHeight;
                lineCount++;
            }
            else {
                line = testLine;
            }
        }
        else {
            break;
        }
        if(lineCount*lineHeight>height) {
            break;
        }
    }
    postMessage({line: line, x: x, y: y});
    postMessage("COMPLETED");
}
function measureText(text) {
    var chars=text.split("");
    var total=0;
    for (var i=0; i<chars.length; i++) {
        var charIndex=widthIndex.indexOf(chars[i]);
        if(charIndex!=-1) {
            total+=widthIndex[charIndex][1];
        }
        else {
            total+=7;
        }
    }
    postMessage({action: "compare", total: total, text: text});
    return total;
}