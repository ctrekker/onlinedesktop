var System={
    config: {
        appname: "Default"
    },
    println: function(txt) {
        postMessage({
            action: "System.println",
            params: txt
        });
    },
    sendRaw: function(data) {
        postMessage(data);
    },
    setVal: function(key, val) {
        var result;
        System.ajax.post("/user/app/private.php", {
            appname: System.config.appname,
            key: key,
            value: val,
            action: "SET"
        }, function(e) {
            result=e;
        }, false);
        return result;
    },
    getVal: function(key) {
        var result;
        System.ajax.post("/user/app/private.php", {
            appname: System.config.appname,
            key: key,
            action: "GET"
        }, function(e) {
            result=e;
        }, false);
        return result;
    },
    favor: function (primary, secondary) {
        return (typeof primary=="undefined"?(typeof secondary=="function"?secondary():secondary):primary);
    },
    Global: function() {
        this.event={

        };
    },
    windowID: 0,
    Window: function(x, y, width, height, title) {
        var o=System.favor;
        this.x=o(x, null);
        this.y=o(y, null);
        this.width=o(width, null);
        this.height=o(height, null);
        this.title=o(title, "");
        this.graphics=new Graphics();
        this.id=System.windowID;
        System.windowID++;

        this.event={
            mousedown: [],
            mouseup: [],
            mousemove: [],
            keydown: [],
            keyup: [],
            any: []
        };

        this.addEventListener("any", function(e) {
            var graphics=e.window.graphics;
            for(var i in graphics.components) {
                var component=graphics.components[i];
                if(e.eventType.search("mouse")!=-1) {
                    if((e.x>component.x&&e.y>component.y)&&(e.x<component.x+component.w&&e.y<component.y+component.h)) {
                        e.component=component;
                        component.triggerEvent(e.eventType, e);
                    }
                }
            }
        });
        System.allWindows.push(this);

        System.sendRaw({
            action: "System.Window.<init>",
            params: this.getSend()
        });
    },
    allWindows: [],
    defined: function(var0) {
        if(typeof var0!="undefined") return true;
        return false;
    },
    defaultAddEventListener: function(name, callback) {
        if(typeof this.event[name]=="undefined") this.event[name]=[];
        this.event[name].push(callback);
    },
    defaultTriggerEvent: function(name, data) {
        data.eventType=name;
        
        var eventCalls=[data.eventType, "any"];
        for(var x=0; x<eventCalls.length; x++) {
            if(typeof this.event[eventCalls[x]]=="undefined") this.event[eventCalls[x]]=[];
            for(var i=0; i<this.event[eventCalls[x]].length; i++) {
                this.event[eventCalls[x]][i](data);
            }
        }
    }
};
System.globalEventHandler=new System.Global();
addEventListener("message", function(e) {
    var data=e.data;
    var window=System.allWindows[data.windowID];
    data.window=window;

    var objCalls=[window, System.globalEventHandler];
    var eventCalls=[data.eventType, "any"];
    for(var x=0; x<objCalls.length; x++) {
        for(var y=0; y<eventCalls.length; y++) {
            if(typeof objCalls[x].event[eventCalls[y]]=="undefined") objCalls[x].event[eventCalls[y]]=[];
            for(var z=0; z<objCalls[x].event[eventCalls[y]].length; z++) {
                data.passed=objCalls[x].event[eventCalls[y]][z].passed;
                objCalls[x].event[eventCalls[y]][z].callback(data);
            }
        }
    }
});
System.Global.prototype.addEventListener=function(name, callback, passed) {
    if(typeof this.event[name]=="undefined") this.event[name]=[];
    this.event[name].push({
        callback: callback,
        passed: System.favor(passed, null)
    });
};
System.Window.prototype={
    show: function() {
        System.sendRaw({
            action: "System.Window.show",
            params: this.getSend()
        });
    },
    hide: function() {
        System.sendRaw({
            action: "System.Window.hide",
            params: this.getSend()
        });
    },
    update: function() {
        this.graphics.update();
        System.sendRaw({
            action: "System.Window.update",
            params: this.getSend()
        });
    },
    setGraphics: function(graphics) {
        this.graphics=graphics;
    },

    //INTERNAL VARIABLE SETTERS
    setX: function(x) {this.x=x},
    setY: function(y) {this.y=y},
    setWidth: function(width) {this.width=width},
    setheight: function(height) {this.height=height},
    setTitle: function(title) {this.title=title},

    //GETTERS
    getGlobalID: function() {
        System.sendRaw({
            action: "System.Window.getGlobalID",
            params: this
        });
    },
    getSend: function() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            title: this.title,
            graphics: this.graphics.getSend(),
            id: this.id
        };
    },

    //ADDS
    addEventListener: function(name, callback, component) {
        if(typeof this.event[name]=='undefined') this.event[name]=[];
        this.event[name].push({component: component, callback: callback});
    },
    triggerEvent: System.defaultTriggerEvent
};
function Graphics() {
    this.data={
        bg: null,
        elements: [

        ]
    };
    this.components=[];
}
Graphics.prototype={
    setBackground: function(color) {
        this.data.bg=color;
    },
    add: function(shape) {
        this.data.elements.push(shape);
    },
    addComponent: function(component) {
        this.components.push(component);
        for(var i=0; i<component.shapes.length; i++) {
            component.shapes[i].componentID=this.components.length-1;
            component.shapes[i].componentIndex=i;
            this.data.elements.push(component.shapes[i]);
        }
    },
    update: function() {
        for(var i=0; i<this.data.elements.length; i++) {
            if(typeof this.data.elements[i].componentID!="undefined") {
                var newShape=this.components[this.data.elements[i].componentID].shapes[this.data.elements[i].componentIndex];
                newShape.componentID=this.data.elements[i].componentID;
                newShape.componentIndex=this.data.elements[i].componentIndex;
                this.data.elements[i]=newShape;
            }
        }
    },
    getSend: function() {
        return {
            data: this.data
        }
    }
};
function Shape(type, x, y, w, h, fc, sc, ss, e) {
    var o=System.favor;
    this.type=o(type, ShapeType.RECTANGLE);
    //Data preset
    this.data={};
    //X Position (x)
    this.data.x=o(x, null);
    //Y Position (y)
    this.data.y=o(y, null);
    //Width (w)
    this.data.w=o(w, null);
    //Height (h)
    this.data.h=o(h, null);
    //Fill Color (fc)
    this.data.fc=o(fc, null);
    //Stroke Color (sc)
    this.data.sc=o(sc, null);
    //Stroke Size (ss);
    this.data.ss=o(ss+0.01, 1.01);
    //Additional data (extra=e) 
    this.data.e=o(e, {});
}
Shape.prototype={
    setX: function(x) {this.x=x},
    setY: function(y) {this.y=y},
    setWidth: function(w) {this.w=w},
    setHeight: function(h) {this.h=h},
    setFill: function(c) {this.fc=c},
    setStroke: function(c) {this.sc=c},
    setStrokeSize: function(ss) {this.ss=ss}
};
var ShapeType={
    RECTANGLE: 0,
    ELLIPSE: 1,
    LINE: 2,
    TEXT: 3
};
function Line(x1, y1, x2, y2, sc, ss) {
    var shape=new Shape(ShapeType.LINE, x1, y1, x2, y2, undefined, sc, ss);
    this.type=shape.type;
    this.data=shape.data;
}
function Text(text, x, y, data, fc, sc, ss) {
    var o=System.favor;
    var font=o(data.font, Text.FONT);
    var baseline=o(data.baseline, Text.BASELINE);
    var align=o(data.align, Text.ALIGN);
    var shape=new Shape(ShapeType.TEXT, x, y, text, {font: font, baseline: baseline, align: align}, fc, sc, ss);
    this.type=shape.type;
    this.data=shape.data;
}
Text.prototype.getText=function() {
    return this.data.w;
}
Text.prototype.setText=function(text) {
    this.data.w=text;
}
var TextAlign={
    START: "start",
    END: "end",
    LEFT: "left",
    CENTER: "center",
    RIGHT: "right"
};
var TextBaseline={
    TOP: "top",
    BOTTOM: "bottom",
    MIDDLE: "middle",
    ALPHABETIC: "alphabetic",
    HANGING: "hanging"
};
Text.FONT="12px Arial";
Text.BASELINE=TextBaseline.TOP;
Text.ALIGN=TextAlign.LEFT;
function Color(params) {
    if(typeof params=="string") {
        this.data=params;
        this.hex=params;
    }
    else if(typeof params=="object") {
        if(System.defined(params.r)&&System.defined(params.g)&&System.defined(params.b)) {
            //Convert rgb to hex

            function componentToHex(c) {
                var hex = c.toString(16);
                return hex.length == 1 ? "0" + hex : hex;
            }

            this.hex="#" + componentToHex(params.r) + componentToHex(params.g) + componentToHex(params.b);
            this.data=this.hex;
            this.rgb=params;
        }
    }
}
Color.BLACK=new Color("#000");
Color.WHITE=new Color("#FFF");
Color.RED=new Color("#F00");
Color.ORANGE=new Color("#F90");
Color.YELLOW=new Color("#FF0");
Color.GREEN=new Color("#0F0");
Color.BLUE=new Color("#00F");
Color.CYAN=new Color("#0FF");
Color.PURPLE=new Color("#800080");
Color.MAGNETA=new Color("#F0F");
function Component(sdata) {
    this.shapes=System.favor(sdata, []);
    this.id=Component.ID++;

    this.event={
        downOn: false
    };
}
Component.prototype={
    add: function(shape) {
        this.shapes.push(shape);
    }
};
Component.prototype.addEventListener=System.defaultAddEventListener;
Component.prototype.triggerEvent=System.defaultTriggerEvent;
Component.ID=0;
function Button(text, x, y, w, h) {
    w=w||Button.WIDTH;
    h=h||Button.HEIGHT;

    this.text=text;
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;

    this.component=new Component();
    this.event=this.component.event;
    this.component.x=x;
    this.component.y=y;
    this.component.w=w;
    this.component.h=h;
    var addData={
        round: 5
    };
    var box1=new Shape(ShapeType.RECTANGLE, x, y, w, h, Button.FILL, Button.STROKE, Button.OUTLINE, addData);
    var text=new Text(text, x+Button.WIDTH/2, y+Button.HEIGHT/2, {
        font: Button.FONT,
        baseline: TextBaseline.MIDDLE,
        align: TextAlign.CENTER
    }, Button.TEXT_FILL);
    this.component.add(box1);
    this.component.add(text);
    this.shapes=this.component.shapes;


    this.addEventListener("mousedown", function(e) {
        e.component.event.downOn=true;
    });
    this.addEventListener("mouseup", function(e) {
        if(e.component.event.downOn) {
            e.component.triggerEvent("click", e);
        }
        e.component.event.downOn=false;
    });
    System.globalEventHandler.addEventListener("mousemove", function(e) {
        var passed=e.passed;
        if((e.x>passed.x&&e.y>passed.y)&&(e.x<passed.x+passed.w&&e.y<passed.y+passed.h)) {
            passed.component.shapes[0]=new Shape(ShapeType.RECTANGLE, x, y, w, h, Button.FILL, Button.HOVER_STROKE, Button.OUTLINE, addData);
            e.window.update();
        }
        else {
            passed.component.shapes[0]=new Shape(ShapeType.RECTANGLE, x, y, w, h, Button.FILL, Button.STROKE, Button.OUTLINE, addData);
            e.window.update();
        }
    }, this);
    System.globalEventHandler.addEventListener("mouseup", function(e) {
        e.passed.event.downOn=false;
    }, this);
}
Button.prototype.addEventListener=Component.prototype.addEventListener;
Button.prototype.triggerEvent=Component.prototype.triggerEvent;

Button.WIDTH=60;
Button.HEIGHT=20;
Button.FILL=new Color("#EEE");
Button.STROKE=new Color("#888");
Button.HOVER_STROKE=new Color("#06F");
Button.OUTLINE=1;
Button.FONT=Text.FONT;
Button.TEXT_FILL=Color.BLACK;


//AJAX
var ajax = {};
ajax.x = function () {
    if (typeof XMLHttpRequest !== 'undefined') {
        return new XMLHttpRequest();
    }
    var versions = [
        "MSXML2.XmlHttp.6.0",
        "MSXML2.XmlHttp.5.0",
        "MSXML2.XmlHttp.4.0",
        "MSXML2.XmlHttp.3.0",
        "MSXML2.XmlHttp.2.0",
        "Microsoft.XmlHttp"
    ];

    var xhr;
    for (var i = 0; i < versions.length; i++) {
        try {
            xhr = new ActiveXObject(versions[i]);
            break;
        } catch (e) {
        }
    }
    return xhr;
};

ajax.send = function (url, callback, method, data, async) {
    if (async === undefined) {
        async = true;
    }
    var x = ajax.x();
    x.open(method, url, async);
    x.onreadystatechange = function () {
        if (x.readyState == 4) {
            callback(x.responseText)
        }
    };
    if (method == 'POST') {
        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
    x.send(data)
};

ajax.get = function (url, data, callback, async) {
    var query = [];
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async)
};

ajax.post = function (url, data, callback, async) {
    var query = [];
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    ajax.send(url, callback, 'POST', query.join('&'), async)
};
System.ajax=ajax;


(function(){
    //delete console;
    main();
}());