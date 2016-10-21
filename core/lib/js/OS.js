window.onload=function() {
    //Initialization
    var args={};
    $.ajax({
        type: "GET",
        url: "/core/os/default/System.json",
        success: function (response) {
            args.system=response;
            program(args);
        }
    });
}
var System;
var Defaults;
var windows;
var start=new Date().getTime();
function program(args) {
    "use strict";
    var canvas=document.getElementById("desktop");
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    var context=canvas.getContext("2d");
    
    System=args.system;

    Defaults={
        windowGData: {
            bg: System.osWindowContentBackground,
            elements: [
                
            ]
        }
    }
    var DT={
        SQUARE: 0,
        ELLIPSE: 1,
        LINE: 2,
        TEXT: 3
    }
    
    setInterval(draw, 20);
    var c=context;
    
    var compileStartTime=new Date().getTime();
    windows=[];
    var app=new Application({
        commands: [
            {
                action: "compile",
                source: "/core/os/default/apps/test.js",
                dest: "/apps/test.ose",
                callback: function(code) {
                    console.log("Application compiled sucessfully in "+(new Date().getTime()-start).toString()+" milliseconds!");
                    console.log("Result:\n"+code);
                }
            },
            {
                action: "execute",
                source: "/apps/test.ose",
                start: function() {
                    console.log("Finished setup after "+(new Date().getTime()-start)+" milliseconds!");
                }
            }
        ]
    });
    new Window(10, 10, 200, 100, "Test");
    new Window(100, 100, 200, 100, "Test2");
    windows[windows.length-1].addEventListener("mousedown", function(e) {
        console.log("X: "+e.x+", Y: "+e.y);
    });

    var firstTime=true;
    function draw() {
        if(firstTime) {
            
        }

        c.clear();
        c.fillStyle=System.osDesktopBackground;
        c.fillRect(0, 0, canvas.width, canvas.height);
        for(var i=0; i<windows.length; i++) {
            //Window
            var window=windows[i];
            if(window.shown) {
                //Create cropping canvas
                var wcanvas=document.getElementById("wcanvas_"+window.id);
                if(wcanvas==null) {
                    wcanvas=document.createElement("canvas");
                    wcanvas.setAttribute("class", "dynamic-canvas");
                    wcanvas.setAttribute("id", "wcanvas_"+window.id);
                    document.body.appendChild(wcanvas);
                }
                wcanvas.width=window.width;
                wcanvas.height=window.height;
                var wc=wcanvas.getContext("2d");

                var gcanvas=document.getElementById("gcanvas_"+window.id);
                if(gcanvas==null) {
                    gcanvas=document.createElement("canvas");
                    gcanvas.setAttribute("class", "dynamic-canvas");
                    gcanvas.setAttribute("id", "gcanvas_"+window.id);
                    document.body.appendChild(gcanvas);
                }
                gcanvas.width=window.width;
                gcanvas.height=window.height-System.osWindowOptionsHeight;
                var gc=gcanvas.getContext("2d");

                //Fill window options
                wc.fillStyle=System.osWindowOptionsBackground;
                wc.fillRect(0, 0, window.width, System.osWindowOptionsHeight);
                //Fill window content
                wc.fillStyle=window.gdata.bg=="null"?window.gdata.bg:System.osWindowContentBackground;
                wc.fillRect(0, System.osWindowOptionsHeight, window.width, window.height-System.osWindowOptionsHeight);
                
                //Draw window icon
                try {
                    wc.drawImage(window.icon, System.osWindowOptionsPadding, System.osWindowOptionsHeight/2-System.osWindowIconHeight/2, System.osWindowIconWidth, System.osWindowIconHeight);
                }
                catch(e) {
                    window.icon=Image.getIcon(System.osApplicationIcon);
                }
            
                wc.font=System.osWindowContentFont;
                //Draw title text
                wc.textBaseline="middle";
                wc.fillStyle=System.osWindowOptionsColor;
                wc.fillText(window.title, System.osWindowOptionsPadding+System.osWindowIconWidth+System.osWindowOptionsTitleIconSeperation, System.osWindowOptionsHeight/2);
                //Draw content
                wc.textBaseline="top";
                
                //NEW CONTENT COMPILER HERE!!!
                var start=System.osWindowOptionsHeight;

                //##### 1 #####
                //Located at top
                
                //##### 2 #####
                for(var n=0; n<window.gdata.elements.length; n++) {
                    var element=window.gdata.elements[n];
                    var edata=element.data;

                    //Handle shape drawing
                    if(element.type==DT.TEXT) {
                        gc.textBaseline=edata.h.baseline;
                        gc.textAlign=edata.h.align;
                    }
                    if(defined(edata.fc)) {
                        gc.fillStyle=edata.fc;
                        switch(element.type) {
                            case DT.SQUARE:
                                gc.fillRect(edata.x, edata.y, edata.w, edata.h);
                                break;
                            
                            case DT.ELLIPSE:
                                gc.ellipse(edata.x+edata.w/2, edata.y+edata.h/2, edata.w/2, edata.h/2, 0, 0, Math.PI*2);
                                gc.fill();
                                break;

                            case DT.TEXT:
                                gc.font=edata.h.font;
                                gc.fillText(edata.w, edata.x, edata.y);
                                break;
                        }
                    }
                    if(defined(edata.sc)) {
                        gc.strokeStyle=edata.sc;
                        gc.lineWidth=edata.ss;
                        switch(element.type) {
                            case DT.SQUARE:
                                gc.strokeRect(edata.x, edata.y, edata.w, edata.h);
                                break;
                            
                            case DT.ELLIPSE:
                                gc.ellipse(edata.x, edata.y, edata.w, edata.h);
                                gc.stroke();
                                break;
                            
                            case DT.LINE:
                                gc.moveTo(edata.x, edata.y);
                                gc.lineTo(edata.w, edata.h);
                                gc.stroke();
                                break;

                            case DT.TEXT:
                                gc.font=edata.h.font;
                                gc.strokeText(edata.w, edata.x, edata.y);
                                break;
                        }
                    }
                }
                var zIndex="z-index: "+findWindowInArray(window.id, windows);
                gcanvas.setAttribute("style", "left: "+window.x+"px; top: "+(System.osWindowOptionsHeight+window.y)+"px; "+zIndex);
                wcanvas.setAttribute("style", "left: "+window.x+"px; top: "+window.y+"px; "+zIndex);
                
                //Stroke window border
                wc.strokeStyle=System.osWindowBorder;
                wc.lineWidth=System.osWindowBorderWidth;
                wc.strokeRect(0, 0, window.width, window.height);
                //Stroke window options border
                wc.strokeStyle=System.osWindowOptionsBorder;
                wc.lineWidth=System.osWindowOptionsBorderWidth;
                wc.beginPath();
                wc.moveTo(0, System.osWindowOptionsHeight);
                wc.lineTo(window.width, System.osWindowOptionsHeight);
                wc.stroke();
            }
        }
        firstTime=false;
    }
    var worker=new Worker("text.js");
    worker.postMessage({action: "data", value: System});
    worker.postMessage({action: "widthIndex", value: JSON.stringify(getWidthIndex(System.osWindowContentFont))});
    function wrapText(text, x, y, maxWidth, lineHeight, w) {
        w.isWorking=true;
        if (typeof(Worker) !== "undefined") {
            worker.postMessage({action: "get", value: "wrapText", input: {
                text: text,
                x: y,
                y: y,
                maxWidth: maxWidth,
                lineHeight: lineHeight,
                window: JSON.stringify(w),
                height: w.height
            }});
            worker.onmessage=function(e) {
                if(e.data=="STOP") {
                    worker.terminate();
                }
                else if(e.data=="COMPLETED") {
                    w.isWorking=false;
                }
                else if(e.data.request=="METRICS") {
                    var ctx=document.createElement("canvas").getContext("2d");
                    ctx.font=c.font;
                    var width=ctx.measureText(e.data.text).width;
                    worker.postMessage({width: width, action: "metrics"});
                }
                else if(e.data.action=="indexWidth") {
                    worker.postMessage({action: "indexWidth", width: c.measureText(e.data.text).width, text: e.data.text});
                }
                else {
                    w.lines.push([e.data.x, e.data.y, e.data.line]);
                }
            }
        }
        else {
                // Sorry! No Web Worker support..
        }
    }
    
    var dragOffX=0;
    var dragOffY=0;
    var dragWindow=null;
    var drag=false;
    var clickedOn="";
    var resizeOrient=8;
    var resizeWindow=null;
    var preWidth;
    var preHeight;
    var preX;
    var preY;
    var clickX=0;
    var clickY=0;
    window.onmousedown=function(e) {
        console.log(windows);
        clickX=e.x;
        clickY=e.y;
        var clickedOn="";
        //See if click was on window
        dragWindow=null;
        drag=true;
        var disabledList=[];
        for(var i=0; i<windows.length; i++) {
            if(e.x>windows[i].x&&e.x<windows[i].x+windows[i].width&&e.y>windows[i].y&&e.y<windows[i].y+windows[i].height) {
                disabledList.push(i);
            }
        }
        disabledList.pop();
        for(var i=windows.length-1; i>=0; i--) {
            //Check bounds
            var w=windows[i];
            var margin=System.osWindowResizeMargin;
            if ((e.x>=w.x&&e.y>=w.y)&&(e.x<=w.x+w.width&&e.y<=w.y+w.height)) {
                if(disabledList.indexOf(i)==-1) {
                    if((e.x>=w.x+margin&&e.y>=w.y+margin)&&(e.x<=w.x+w.width-margin&&e.y<=w.y+w.height-margin)) {  
                        clickedOn="window";
                        if (e.y<w.y+System.osWindowOptionsHeight) {
                            dragWindow=w;
                            dragOffX=e.x-w.x;
                            dragOffY=e.y-w.y;
                        }

                        windows=windows.remove(i);
                        windows.push(w);
                        
                        //cw stands for Current Window
                        var cw=windows[windows.length-1];
                        if(e.y>cw.y+System.osWindowOptionsHeight) {
                            cw.triggerEvent("mousedown", {
                                x: e.x-cw.x,
                                y: e.y-cw.y-System.osWindowOptionsHeight
                            });
                        }
                        break;
                    }
                    else {
                        break;
                    }
                }
                if (i==windows.length-1) {
                    break;
                }
            }
        }
        if (clickedOn=="") {
            for(var i=windows.length-1; i>=0; i--) {
                var w=windows[i];
                var margin=System.osWindowResizeMargin;
                //Condition LEFT
                if ((e.x>w.x&&e.x<w.x+margin)&&(e.y>w.y+margin&&e.y<w.y+w.height-margin)) {
                    resizeOrient=Resize.LEFT;
                }
                //Condition RIGHT
                else if ((e.x>w.x+w.width-margin&&e.x<w.x+w.width)&&(e.y>w.y+margin&&e.y<w.y+w.height-margin)) {
                    resizeOrient=Resize.RIGHT;
                }
                //Condition TOP
                else if ((e.x>w.x+margin&&e.x<w.x+w.width-margin)&&(e.y>w.y&&e.y<w.y+margin)) {
                    resizeOrient=Resize.TOP;
                }
                //Condition BOTTOM
                else if ((e.x>w.x+margin&&e.x<w.x+w.width-margin)&&(e.y>w.y+w.height-margin&&e.y<w.y+w.height)) {
                    resizeOrient=Resize.BOTTOM;
                }
                //Condition TOP_LEFT
                else if ((e.x>w.x&&e.x<w.x+margin)&&(e.y>w.y&&e.y<w.y+margin)) {
                    resizeOrient=Resize.TOP_LEFT;
                }
                //Condition TOP_RIGHT
                else if ((e.x>w.x+w.width-margin&&e.x<w.x+w.width)&&(e.y>w.y&&e.y<w.y+margin)) {
                    resizeOrient=Resize.TOP_RIGHT;
                }
                //Condition BOTTOM_LEFT
                else if ((e.x>w.x&&e.x<w.x+margin)&&(e.y>w.y+w.height-margin&&e.y<w.y+w.height)) {
                    resizeOrient=Resize.BOTTOM_LEFT;
                }
                //Condition BOTTOM_RIGHT
                else if ((e.x>w.x+w.width-margin&&e.x<w.x+w.width)&&(e.y>w.y+w.height-margin&&e.y<w.y+w.height)) {
                    resizeOrient=Resize.BOTTOM_RIGHT;
                }
                if((e.x>w.x&&e.x<w.x+w.width)&&(e.y>w.y&&e.y<w.y+w.height)) {
                    if(!((e.x>w.x+margin&&e.x<w.x+w.width-margin)&&(e.y>w.y+margin&&e.y<w.y+w.height-margin))) {
                        resizeWindow=w;
                        preX=w.x;
                        preY=w.y;
                        preWidth=w.width;
                        preHeight=w.height;
                        break;
                    }
                }
            }
        }
    }
    window.onmousemove=function(e) {
        if (drag) {
            if (dragWindow!=null) {
                if(dragWindow.shown) {
                    dragWindow.x=e.x-dragOffX;
                    dragWindow.y=e.y-dragOffY;
                }
                else {
                    drag=false;
                }
            }
            else if (resizeOrient!=Resize.NONE) {
                switch (resizeOrient) {
                    case Resize.LEFT:
                        if (e.x<preX+preWidth-System.osWindowMinimumWidth) {
                            resizeWindow.x=e.x;
                            resizeWindow.width=preX-e.x+preWidth;
                        }
                        break;
                    case Resize.RIGHT:
                        if (e.x>preX+System.osWindowMinimumWidth) {
                            resizeWindow.width=e.x-preX;
                        }
                        break;
                    case Resize.TOP:
                        if (e.y<preY+preHeight-System.osWindowMinimumHeight) {
                            resizeWindow.y=e.y;
                            resizeWindow.height=preY-e.y+preHeight;
                        }
                        break;
                    case Resize.BOTTOM:
                        if (e.y>preY+System.osWindowMinimumHeight) {
                            resizeWindow.height=e.y-preY;
                        }
                        break;
                    case Resize.TOP_LEFT:
                        if (e.x<preX+preWidth-System.osWindowMinimumWidth) {
                            resizeWindow.x=e.x;
                            resizeWindow.width=preX-e.x+preWidth;
                        }
                        if (e.y<preY+preHeight-System.osWindowMinimumHeight) {
                            resizeWindow.y=e.y;
                            resizeWindow.height=preY-e.y+preHeight;
                        }
                        break;
                    case Resize.TOP_RIGHT:
                        if (e.x>preX+System.osWindowMinimumWidth) {
                            resizeWindow.width=e.x-preX;
                        }
                        if (e.y<preY+preHeight-System.osWindowMinimumHeight) {
                            resizeWindow.y=e.y;
                            resizeWindow.height=preY-e.y+preHeight;
                        }
                        break;
                    case Resize.BOTTOM_LEFT:
                        if (e.x<preX+preWidth-System.osWindowMinimumWidth) {
                            resizeWindow.x=e.x;
                            resizeWindow.width=preX-e.x+preWidth;
                        }
                        if (e.y>preY+System.osWindowMinimumHeight) {
                            resizeWindow.height=e.y-preY;
                        }
                        break;
                    case Resize.BOTTOM_RIGHT:
                        if (e.x>preX+System.osWindowMinimumWidth) {
                            resizeWindow.width=e.x-preX;
                        }
                        if (e.y>preY+System.osWindowMinimumHeight) {
                            resizeWindow.height=e.y-preY;
                        }
                        break;
                }

            }
        }
        else {
            var changed=false;
            var disabledList=[];
            for(var i=0; i<windows.length; i++) {
                if(e.x>windows[i].x&&e.x<windows[i].x+windows[i].width&&e.y>windows[i].y&&e.y<windows[i].y+windows[i].height) {
                    disabledList.push(i);
                }
            }
            disabledList.pop();
            var body=document.body;
            for(var i=windows.length-1; i>=0; i--) {
                if(disabledList.indexOf(i)==-1) {
                    var w=windows[i];
                    var margin=System.osWindowResizeMargin;
                    //Condition LEFT
                    if ((e.x>w.x&&e.x<w.x+margin)&&(e.y>w.y+margin&&e.y<w.y+w.height-margin)) {
                        body.style.cursor="w-resize";
                        changed=true;
                    }
                    //Condition RIGHT
                    else if ((e.x>w.x+w.width-margin&&e.x<w.x+w.width)&&(e.y>w.y+margin&&e.y<w.y+w.height-margin)) {
                        body.style.cursor="e-resize";
                        changed=true;
                    }
                    //Condition TOP
                    else if ((e.x>w.x+margin&&e.x<w.x+w.width-margin)&&(e.y>w.y&&e.y<w.y+margin)) {
                        body.style.cursor="n-resize";
                        changed=true;
                    }
                    //Condition BOTTOM
                    else if ((e.x>w.x+margin&&e.x<w.x+w.width-margin)&&(e.y>w.y+w.height-margin&&e.y<w.y+w.height)) {
                        body.style.cursor="s-resize";
                        changed=true;
                    }
                    //Condition TOP_LEFT
                    else if ((e.x>w.x&&e.x<w.x+margin)&&(e.y>w.y&&e.y<w.y+margin)) {
                        body.style.cursor="nw-resize";
                        changed=true;
                    }
                    //Condition TOP_RIGHT
                    else if ((e.x>w.x+w.width-margin&&e.x<w.x+w.width)&&(e.y>w.y&&e.y<w.y+margin)) {
                        body.style.cursor="ne-resize";
                        changed=true;
                    }
                    //Condition BOTTOM_LEFT
                    else if ((e.x>w.x&&e.x<w.x+margin)&&(e.y>w.y+w.height-margin&&e.y<w.y+w.height)) {
                        body.style.cursor="sw-resize";
                        changed=true;
                    }
                    //Condition BOTTOM_RIGHT
                    else if ((e.x>w.x+w.width-margin&&e.x<w.x+w.width)&&(e.y>w.y+w.height-margin&&e.y<w.y+w.height)) {
                        body.style.cursor="se-resize";
                        changed=true;
                    }
                }
            }
            if(!changed) {
                body.style.cursor="default";
            }
        }

        var selWin=windows[windows.length-1];
        if((e.x>selWin.x&&e.x<selWin.x+selWin.width)&&(e.y>selWin.y+System.osWindowOptionsHeight&&e.y<selWin.y+selWin.height)) {
            selWin.triggerEvent("mousemove", {
                x: e.x-selWin.x,
                y: e.y-selWin.y-System.osWindowOptionsHeight
            });
        }
    }
    window.onmouseup=function(e) {
        if (dragWindow!=null&&drag) {
            dragWindow.x=e.x-dragOffX;
            dragWindow.y=e.y-dragOffY;
            dragWindow=null;
            dragOffX=0;
            dragOffY=0;
        }
        if (resizeOrient!=Resize.NONE) {
            resizeOrient=Resize.NONE;
        }
        
        var selWin=windows[windows.length-1];
        if((e.x>selWin.x&&e.x<selWin.x+selWin.width)&&(e.y>selWin.y+System.osWindowOptionsHeight&&e.y<selWin.y+selWin.height)) {
            selWin.triggerEvent("mouseup", {
                x: e.x-selWin.x,
                y: e.y-selWin.y-System.osWindowOptionsHeight
            });
        }
        drag=false;
    }
    window.onresize=function(e) {
        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;
        draw();
    }

    var Resize={
        LEFT: 0,
        RIGHT: 1,
        TOP: 2,
        BOTTOM: 3,
        TOP_LEFT: 4,
        TOP_RIGHT: 5,
        BOTTOM_LEFT: 6,
        BOTTOM_RIGHT: 7,
        NONE: 8
    }
}


var Application=function(runCommands) {
    Application.run(runCommands);
}
Application.run=function(runCommands) {
    runCommands=typeof runCommands=="undefined"?Application.DEFAULT_RUN_COMMANDS:runCommands;
    for(var commandIndex in runCommands.commands) {
        var command=runCommands.commands[commandIndex];
        if(command.action=="compile") {
            var appCompiler=new ApplicationCompiler(command.source, command.dest, function(code) {
                appCompiler.setCode(code);
                var compiled=appCompiler.compile();
                var appRun=this.run;
                $.ajax({
                    type: "POST",
                    url: "/user/set.php",
                    data: {
                        path: compiled.dest,
                        content: compiled.code
                    },
                    success: function (response) {
                        compiled.callback(compiled.code);
                        runCommands.commands=runCommands.commands.remove(0);
                        Application.run(runCommands);
                    }
                });
            }, command.callback);
            break;
        }
        else if(command.action=="execute") {
            var appExecutor=new ApplicationExecutor(command.source);
            appExecutor.start();
            command.start();
        }
    }
}
Application.DEFAULT_RUN_COMMANDS={
    commands: [
        {
            action: "execute"
        }
    ]
}

//application.js
//-----Application Compiler-----
var ApplicationCompiler=function(appSource, dest, callback, afterCompile) {
    this.appSource=appSource;
    this.isReady=false;
    this.flags=[];
    this.dest=dest;
    this.execAfter=afterCompile;
    $.ajax({
        type: "get",
        url: this.appSource,
        success: callback
    });
}
ApplicationCompiler.prototype.compile=function() {
    if(this.isReady) {
        var js=this.appCode;
        var completeJS="importScripts('"+System.scriptLangPath+"');\n"+js;
        this.compiledCode=completeJS/*.toHex()*/;
        return {code: this.compiledCode, callback: this.execAfter, dest: this.dest};
    }
    else {
        console.warn("Please wait to call compile() until source code has been loaded.");
    }
}
ApplicationCompiler.prototype.setCode=function(code) {
    this.isReady=true;
    this.appCode=code;
}
ApplicationCompiler.prototype.setDest=function(path) {
    this.dest=path;
}

var ApplicationExecutor=function(path) {
    this.path=path;
    this.windowIDs=[];
}
ApplicationExecutor.prototype.start=function() {
    this.internalWorker=new Worker("get.php?content_type=text/javascript&path="+this.path);
    this.internalWorker.thisEquiv=this;
    this.internalWorker.onmessage=ApplicationExecutor.handleRequest;
}
ApplicationExecutor.handleRequest=function(msg) {
    ApplicationExecutor.support.exe=this.thisEquiv;
    ApplicationExecutor.support[msg.data.action](msg.data.params);
}
ApplicationExecutor.support={
    "System.println": function(msg) {
        console.log(msg);
    },
    "System.Window.<init>": function(obj) {
        var created;
        windows.push(created=new Window(obj.x, obj.y, obj.width, obj.height, obj.title, undefined, obj.graphics.data));
        created.setExecutionEnvironment(this.exe);
        created.hide();
        created.addEventListener("any", function(e) {
            var executor=e.executor;
            e.windowID=ApplicationExecutor.support["System.Window.getLocalID"](e.window);
            delete e.window;
            delete e.executor;
            executor.internalWorker.postMessage(e);
        });
        this.exe.windowIDs.push({
            global: created.id,
            local: obj.id
        });
    },
    "System.Window.show": function(obj) {
        var currentWindow=this["System.Window.getGlobalWindow"](obj);
        this["System.Window.update"](obj);
        currentWindow.show();
    },
    "System.Window.hide": function(obj) {
        var currentWindow=this["System.Window.getGlobalWindow"](obj);
        this["System.Window.update"](obj);
        currentWindow.hide();
    },
    "System.Window.update": function(obj) {
        this["System.Window.getGlobalWindow"](obj).update(obj);
    },
    "System.Window.getGlobalID": function(obj) {
        for(var i=0; i<this.exe.windowIDs.length; i++) {
            var currentIDs=this.exe.windowIDs[i];
            if(currentIDs.local==obj.id) {
                return currentIDs.global;
            }
        }
    },
    "System.Window.getGlobalWindow": function(obj) {
        return windows.findID(this["System.Window.getGlobalID"](obj));
    },
    "System.Window.getLocalID": function(obj) {
        for(var i=0; i<this.exe.windowIDs.length; i++) {
            var currentIDs=this.exe.windowIDs[i];
            if(currentIDs.global==obj.id) {
                return currentIDs.local;
            }
        }
    },
    exe: null
}
// If the primary value is defined, it will return that value. If it is
// undefined, then it will return the second value. The special thing
// about this is that you can insert a function as the second parameter
// to serve as a callback.
function o(primary, secondary) {
    return (typeof primary=="undefined"?(typeof secondary=="function"?secondary():secondary):primary);
}



//util.js
Array.prototype.swap = function (x,y) {
    var b = this[x];
    this[x] = this[y];
    this[y] = b;
    return this;
}
Array.prototype.remove = function(index) {
    delete this[index];
    var newArray=[];
    for(var i=0; i<this.length; i++) {
        if(typeof this[i]!="undefined") newArray.push(this[i]);
    }
    return newArray;
};
Array.prototype.findID=function(id) {
    for(var i=0; i<this.length; i++) {
        if(this[i].id==id) {
        return this[i];
        }
    }
}
CanvasRenderingContext2D.prototype.clear = CanvasRenderingContext2D.prototype.clear || function (preserveTransform) {
    if (preserveTransform) {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
    }

    this.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (preserveTransform) {
        this.restore();
    }
};
function getWidthIndex(font) {
    var out=[];
    var vals="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()`~-=_+[]{}|\"\';:/?>.<, ".split("");
    var canvas=document.createElement("canvas");
    var ctx=canvas.getContext("2d");
    ctx.font=font;
    for (var i=0; i<vals.length; i++) {
        var val=vals[i];
        out.push([val, ctx.measureText(val).width]);
    }
  
    return out;
}
Image.getIcon=function(src) {
    var icon=new Image(System.osWindowIconWidth, System.osWindowIconHeight);
    icon.src=src;
    return icon;
}
String.prototype.toHex = function(){
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }

    return result
}
String.prototype.fromHex = function(){
    var j;
    var hexes = this.match(/.{1,4}/g) || [];
    var back = "";
    for(j = 0; j<hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
    }

    return back;
}
function defined(val) {
    return !(typeof val == "undefined"||val == null);
}
//NOTE: This window does not return the actual Window object, but the index of the window object inside of the array/list
function findWindowInArray(id, list) {
    for(var i=0; i<list.length; i++) {
        if(list[i].id==id) {
            return i;
        }
    }
}


function Window(x, y, width, height, title, icon, gdata) {
    this.update(x, y, width, height, title, icon, gdata);

    this.id=Window.nextID;
    this.preHide={};
    this.shown=true;
    this.event={
        "mousedown": [],
        "mouseup": [],
        "mousemove": [],
        "keyup": [],
        "keydown": [],
        "any": []
    };

    windows.push(this);
    Window.nextID++;
}
Window.prototype.show=function() {
    this.x=this.preHide.x;
    this.y=this.preHide.y;
    this.preHide={};
    this.shown=true;
}
Window.prototype.hide=function() {
    this.preHide={
        x: this.x,
        y: this.y 
    };
    this.x=-this.width-System.osWindowBorderWidth;
    this.y=-this.height-System.osWindowBorderWidth;
    this.shown=false;
}
Window.prototype.update=function(xOrObj, y, width, height, title, icon, gdata) {
    if(typeof xOrObj=="object") {
        // this.x=xOrObj.x;
        // this.y=xOrObj.y;
        // this.width=xOrObj.width;
        // this.height=xOrObj.height;
        this.title=xOrObj.title;
        if(typeof xOrObj.icon=="undefined") this.icon=Image.getIcon(System.osApplicationIcon);
        else this.icon=xOrObj.icon;
        if(typeof xOrObj.graphics.data=="undefined") this.gdata=Defaults.windowGData;
        else this.gdata=xOrObj.graphics.data;
    }
    else {
        this.x=xOrObj;
        this.y=y;
        this.width=width;
        this.height=height;
        this.title=title;
        if(typeof icon=="undefined") this.icon=Image.getIcon(System.osApplicationIcon);
        else this.icon=icon;
        if(typeof gdata=="undefined") this.gdata=Defaults.windowGData;
        else this.gdata=gdata;
    }
}
Window.prototype.addEventListener=function(name, callback) {
    this.event[name].push(callback);
}
Window.prototype.triggerEvent=function(name, data) {
    data.eventType=name;
    data.window=this;
    data.executor=this.exeEnvironment;
    for(var i=0; i<this.event[name].length; i++) {
        this.event[name][i](data);
    }
    for(var i=0; i<this.event["any"].length; i++) {
        this.event["any"][i](data);
    }
}
Window.prototype.setExecutionEnvironment=function(environment) {
    this.exeEnvironment=environment;
}
Window.nextID=0;