/*Copyright 2007 Adobe Systems Incorporated Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*/
(function () {
    var b;
    b = (function () {
        var L = "phone.plivo.com";
        var p = "s1.rtmp.plivo.com";
        var u = {
            rtmp_url: "rtmp://" + p + "/phone",
            bridgeName: "flex"
        };
        var H = {
            allowScriptAccess: "always"
        };
        var k;
        var r = null;
        var g;
        var w;
        var v;
        var o;
        var K = null;
        var x = false;
        var I;

        function h(M) {
            y("initializing plivo_flash");
            I = M;
            A(M)
        }
        var A = function (M) {
            l();
            swfobject.embedSWF("http://s3.amazonaws.com/plivowebtest-sdk/plivo.swf", "plivo_flash_placeholder", "215", "138", "10.0.0", "", u, H, []);
            FABridge.addInitializationCallback("flex", i)
        };
        var i = function () {
            Plivo.logDevel("plivo_flash initCallback");
            r = FABridge.flex.root();
            r.addEventListener("EvtInit", G);
            r.addEventListener("EvtConnected", j);
            r.addEventListener("EvtLogin", t);
            r.addEventListener("EvtLogout", m);
            r.addEventListener("EvtMakeCall", q);
            r.addEventListener("EvtCallState", f);
            r.addEventListener("EvtHangup", F);
            r.addEventListener("EvtIncomingCall", C);
            r.addEventListener("EvtDisconnected", E);
            r.addEventListener("EvtPrivPopUpClosed", D);
            if (r.isMuted()) {
                Plivo.logDevel("mic is muted, show privacy");
                r.showPrivacy()
            } else {
                Plivo.logDevel("mic permission is OK")
            }
            return
        };
        h.prototype.login = function (O, N) {
            g = O + "@" + L;
            Plivo.logDevel("account =" + g);
            o = O; /*© 2009–2013 by Jeff Mott. All rights reserved.  Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met: Redistributions of source code must retain the above copyright notice, this list of conditions, and the following disclaimer.  Redistributions in binary form must reproduce the above copyright notice, this list of conditions, and the following disclaimer in the documentation or other materials provided with the distribution.  Neither the name CryptoJS nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS," AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE, ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.*/
            var M = CryptoJS.MD5(O + ":" + L + ":" + N).toString();
            Plivo.logDevel("hashed_pass=" + M);
            return r.login(g, M)
        };
        h.prototype.logout = function () {
            Plivo.logDevel("logging out account = " + g);
            n();
            B();
            r.unregister(g, o);
            return r.logout(g)
        };
        h.prototype.call = function (M) {
            Plivo.logDevel("make call.account = " + g + ".number = " + M);
            if (M.indexOf("@") < 0) {
                M = M + "@" + L
            }
            console.log("full number = " + M);
            J();
            return r.makeCall(M, g, [])
        };
        h.prototype.hangup = function () {
            B();
            return r.hangup(w)
        };
        h.prototype.send_dtmf = function (N) {
            var M = r.sendDTMF(N, 2000);
            z(N);
            return M
        };
        h.prototype.answer = function () {
            Plivo.logDevel("answering=" + v);
            n();
            return r.answer(v)
        };
        h.prototype.reject = function () {
            n();
            return r.hangup(v)
        };
        h.prototype.mute = function () {
            Plivo.logDevel("mute the mic");
            return r.setMute()
        };
        h.prototype.unmute = function () {
            Plivo.logDevel("unmute");
            return r.setUnMute()
        };
        h.prototype.setTone = function (M) {
            r.toneSet("ring_tone", M, "")
        };
        h.prototype.setRingToneBack = function (M) {
            r.toneSet("ring_back_tone", M, "")
        };
        h.prototype.setDtmfTone = function (M, N) {
            r.toneSet("dtmf_tone", M, N)
        };
        var C = function (M) {
            K = "IN";
            v = M.getUuid();
            Plivo.logDebug("_____onIncomingCall.uuid=" + v);
            s();
            Plivo.onIncomingCall(M.getName())
        };
        var F = function (M) {
            uuid = M.getUuid();
            state = M.getState();
            Plivo.logDevel("_onHangup.state=" + state)
        };
        var f = function (M) {
            uuid = M.getUuid();
            state = M.getState();
            Plivo.logDevel("call state=" + state);
            if (state == "ACTIVE") {
                x = true;
                B();
                n();
                Plivo.onCallAnswered()
            } else {
                if (state == "RINGING") {
                    if (K == "OUT") {
                        Plivo.onCallRemoteRinging()
                    }
                } else {
                    if (state == "HANGUP") {
                        if (x === true) {
                            x = false;
                            n();
                            Plivo.onCallTerminated()
                        } else {
                            Plivo.logDevel("hangup.not in call");
                            if (K == "IN") {
                                Plivo.logDevel("hangup.not in call.IN");
                                n();
                                Plivo.onIncomingCallCanceled()
                            } else {
                                Plivo.logDevel("hangup.not in call.OUT");
                                B();
                                Plivo.onCallFailed()
                            }
                        }
                    } else {}
                }
            }
        };
        var q = function (M) {
            K = "OUT";
            number = M.getNumber();
            g = M.getAccount();
            w = M.getUuid();
            J();
            Plivo.onCalling()
        };
        var j = function (M) {
            Plivo.logDebug("___onConnected");
            k = M.getSid();
            Plivo.onReady()
        };
        var t = function (M) {
            Plivo.logDevel("onLogin...");
            result = M.getResult();
            user = M.getUser();
            if (result != "success") {
                Plivo.logDevel("login failed");
                Plivo.onLoginFailed()
            } else {
                Plivo.logDevel("login OK.");
                r.register(g, o);
                Plivo.onLogin()
            }
        };
        var m = function (M) {
            y("onLogout");
            Plivo.onLogout()
        };

        function G() {
            y("_onInit")
        }
        function E(M) {
            Plivo.logDebug("_onDisconnected");
            Plivo.onLogout()
        }
        function D(N) {
            Plivo.logDevel("_onPrivPopUpClosed");
            var M = document.getElementById("plivo_flash_placeholder");
            M.style.display = "none"
        }
        var y = function (M) {
            Plivo.logDevel(M)
        };
        var s = function () {
            if (Plivo.ringToneFlag !== false) {
                Plivo.logDevel("send play ringtone command to flash");
                r.toneCtrl("ring_tone", "play", "")
            }
        };
        var n = function () {
            if (Plivo.ringToneFlag !== false) {
                r.toneCtrl("ring_tone", "stop", "")
            }
        };
        var J = function () {
            if (Plivo.ringToneBackFlag !== false) {
                r.toneCtrl("ring_back_tone", "play", "")
            }
        };
        var B = function () {
            if (Plivo.ringToneBackFlag !== false) {
                r.toneCtrl("ring_back_tone", "stop", "")
            }
        };
        var z = function (M) {
            Plivo.logDevel("play dtmf tone:" + M);
            if (Plivo.getDtmfToneFlag(M) === false) {
                Plivo.logDevel("dtmfToneFlag == false");
                return
            }
            r.toneCtrl("dtmf_tone", "play", M)
        };

        function l() {
            var M = document.createElement("div");
            M.id = "plivo_flash_placeholder";
            document.body.insertBefore(M, document.body.firstChild)
        }
        return h
    })();

    function e(f) {
        Plivo.logDevel("onEvent=" + f)
    }
    function a(f) {
        Plivo.logDevel(f)
    }
    function d(g, f, h) {
        Plivo.logDevel("onDisplayUpdate")
    }
    function c(f) {
        Plivo.logDevel("showPrivEnd")
    }
    window.onDebug = a;
    window.plivo_flash = b
}).call(this);

function FABridge(b, a) {
    this.target = b;
    this.remoteTypeCache = {};
    this.remoteInstanceCache = {};
    this.remoteFunctionCache = {};
    this.localFunctionCache = {};
    this.bridgeID = FABridge.nextBridgeID++;
    this.name = a;
    this.nextLocalFuncID = 0;
    FABridge.instances[this.name] = this;
    FABridge.idMap[this.bridgeID] = this;
    return this
}
FABridge.TYPE_ASINSTANCE = 1;
FABridge.TYPE_ASFUNCTION = 2;
FABridge.TYPE_JSFUNCTION = 3;
FABridge.TYPE_ANONYMOUS = 4;
FABridge.initCallbacks = {};
FABridge.argsToArray = function (b) {
    var a = [];
    for (var c = 0; c < b.length; c++) {
        a[c] = b[c]
    }
    return a
};

function instanceFactory(a) {
    this.fb_instance_id = a;
    return this
}
function FABridge__invokeJSFunction(a) {
    var c = a[0];
    var b = a.concat();
    b.shift();
    var d = FABridge.extractBridgeFromID(c);
    return d.invokeLocalFunction(c, b)
}
FABridge.addInitializationCallback = function (b, d) {
    var c = FABridge.instances[b];
    if (c != undefined) {
        d.call(c);
        return
    }
    var a = FABridge.initCallbacks[b];
    if (a == null) {
        FABridge.initCallbacks[b] = a = []
    }
    a.push(d)
};

function FABridge__bridgeInitialized(g) {
    var a = document.getElementsByTagName("object");
    var f = a.length;
    var d = [];
    if (f > 0) {
        for (var u = 0; u < f; u++) {
            if (typeof a[u].SetVariable != "undefined") {
                d[d.length] = a[u]
            }
        }
    }
    var n = document.getElementsByTagName("embed");
    var b = n.length;
    var t = [];
    if (b > 0) {
        for (var r = 0; r < b; r++) {
            if (typeof n[r].SetVariable != "undefined") {
                t[t.length] = n[r]
            }
        }
    }
    var c = d.length;
    var s = t.length;
    var h = "bridgeName=" + g;
    if ((c == 1 && !s) || (c == 1 && s == 1)) {
        FABridge.attachBridge(d[0], g)
    } else {
        if (s == 1 && !c) {
            FABridge.attachBridge(t[0], g)
        } else {
            var v = false;
            if (c > 1) {
                for (var q = 0; q < c; q++) {
                    var x = d[q].childNodes;
                    for (var p = 0; p < x.length; p++) {
                        var e = x[p];
                        if (e.nodeType == 1 && e.tagName.toLowerCase() == "param" && e.name.toLowerCase() == "flashvars" && e.value.indexOf(h) >= 0) {
                            FABridge.attachBridge(d[q], g);
                            v = true;
                            break
                        }
                    }
                    if (v) {
                        break
                    }
                }
            }
            if (!v && s > 1) {
                for (var o = 0; o < s; o++) {
                    var w = t[o].attributes.getNamedItem("flashVars").nodeValue;
                    if (w.indexOf(h) >= 0) {
                        FABridge.attachBridge(t[o], g);
                        break
                    }
                }
            }
        }
    }
    return true
}
FABridge.nextBridgeID = 0;
FABridge.instances = {};
FABridge.idMap = {};
FABridge.refCount = 0;
FABridge.extractBridgeFromID = function (b) {
    var a = (b >> 16);
    return FABridge.idMap[a]
};
FABridge.attachBridge = function (a, c) {
    var b = new FABridge(a, c);
    FABridge[c] = b;
    var e = FABridge.initCallbacks[c];
    if (e == null) {
        return
    }
    for (var d = 0; d < e.length; d++) {
        e[d].call(b)
    }
    delete FABridge.initCallbacks[c]
};
FABridge.blockedMethods = {
    toString: true,
    get: true,
    set: true,
    call: true
};
FABridge.prototype = {
    root: function () {
        return this.deserialize(this.target.getRoot())
    },
    releaseASObjects: function () {
        return this.target.releaseASObjects()
    },
    releaseNamedASObject: function (b) {
        if (typeof (b) != "object") {
            return false
        } else {
            var a = this.target.releaseNamedASObject(b.fb_instance_id);
            return a
        }
    },
    create: function (a) {
        return this.deserialize(this.target.create(a))
    },
    makeID: function (a) {
        return (this.bridgeID << 16) + a
    },
    getPropertyFromAS: function (b, a) {
        if (FABridge.refCount > 0) {
            throw new Error("You are trying to call recursively into the Flash Player which is not allowed. In most cases the JavaScript setTimeout function, can be used as a workaround.")
        } else {
            FABridge.refCount++;
            retVal = this.target.getPropFromAS(b, a);
            retVal = this.handleError(retVal);
            FABridge.refCount--;
            return retVal
        }
    },
    setPropertyInAS: function (c, b, a) {
        if (FABridge.refCount > 0) {
            throw new Error("You are trying to call recursively into the Flash Player which is not allowed. In most cases the JavaScript setTimeout function, can be used as a workaround.")
        } else {
            FABridge.refCount++;
            retVal = this.target.setPropInAS(c, b, this.serialize(a));
            retVal = this.handleError(retVal);
            FABridge.refCount--;
            return retVal
        }
    },
    callASFunction: function (b, a) {
        if (FABridge.refCount > 0) {
            throw new Error("You are trying to call recursively into the Flash Player which is not allowed. In most cases the JavaScript setTimeout function, can be used as a workaround.")
        } else {
            FABridge.refCount++;
            retVal = this.target.invokeASFunction(b, this.serialize(a));
            retVal = this.handleError(retVal);
            FABridge.refCount--;
            return retVal
        }
    },
    callASMethod: function (b, c, a) {
        if (FABridge.refCount > 0) {
            throw new Error("You are trying to call recursively into the Flash Player which is not allowed. In most cases the JavaScript setTimeout function, can be used as a workaround.")
        } else {
            FABridge.refCount++;
            a = this.serialize(a);
            retVal = this.target.invokeASMethod(b, c, a);
            retVal = this.handleError(retVal);
            FABridge.refCount--;
            return retVal
        }
    },
    invokeLocalFunction: function (d, b) {
        var a;
        var c = this.localFunctionCache[d];
        if (c != undefined) {
            a = this.serialize(c.apply(null, this.deserialize(b)))
        }
        return a
    },
    getTypeFromName: function (a) {
        return this.remoteTypeCache[a]
    },
    createProxy: function (c, b) {
        var d = this.getTypeFromName(b);
        instanceFactory.prototype = d;
        var a = new instanceFactory(c);
        this.remoteInstanceCache[c] = a;
        return a
    },
    getProxy: function (a) {
        return this.remoteInstanceCache[a]
    },
    addTypeDataToCache: function (d) {
        newType = new ASProxy(this, d.name);
        var b = d.accessors;
        for (var c = 0; c < b.length; c++) {
            this.addPropertyToType(newType, b[c])
        }
        var a = d.methods;
        for (var c = 0; c < a.length; c++) {
            if (FABridge.blockedMethods[a[c]] == undefined) {
                this.addMethodToType(newType, a[c])
            }
        }
        this.remoteTypeCache[newType.typeName] = newType;
        return newType
    },
    addPropertyToType: function (a, e) {
        var f = e.charAt(0);
        var b;
        var d;
        if (f >= "a" && f <= "z") {
            d = "get" + f.toUpperCase() + e.substr(1);
            b = "set" + f.toUpperCase() + e.substr(1)
        } else {
            d = "get" + e;
            b = "set" + e
        }
        a[b] = function (c) {
            this.bridge.setPropertyInAS(this.fb_instance_id, e, c)
        };
        a[d] = function () {
            return this.bridge.deserialize(this.bridge.getPropertyFromAS(this.fb_instance_id, e))
        }
    },
    addMethodToType: function (a, b) {
        a[b] = function () {
            return this.bridge.deserialize(this.bridge.callASMethod(this.fb_instance_id, b, FABridge.argsToArray(arguments)))
        }
    },
    getFunctionProxy: function (a) {
        var b = this;
        if (this.remoteFunctionCache[a] == null) {
            this.remoteFunctionCache[a] = function () {
                b.callASFunction(a, FABridge.argsToArray(arguments))
            }
        }
        return this.remoteFunctionCache[a]
    },
    getFunctionID: function (a) {
        if (a.__bridge_id__ == undefined) {
            a.__bridge_id__ = this.makeID(this.nextLocalFuncID++);
            this.localFunctionCache[a.__bridge_id__] = a
        }
        return a.__bridge_id__
    },
    serialize: function (d) {
        var a = {};
        var c = typeof (d);
        if (c == "number" || c == "string" || c == "boolean" || c == null || c == undefined) {
            a = d
        } else {
            if (d instanceof Array) {
                a = [];
                for (var b = 0; b < d.length; b++) {
                    a[b] = this.serialize(d[b])
                }
            } else {
                if (c == "function") {
                    a.type = FABridge.TYPE_JSFUNCTION;
                    a.value = this.getFunctionID(d)
                } else {
                    if (d instanceof ASProxy) {
                        a.type = FABridge.TYPE_ASINSTANCE;
                        a.value = d.fb_instance_id
                    } else {
                        a.type = FABridge.TYPE_ANONYMOUS;
                        a.value = d
                    }
                }
            }
        }
        return a
    },
    deserialize: function (e) {
        var a;
        var c = typeof (e);
        if (c == "number" || c == "string" || c == "boolean" || e == null || e == undefined) {
            a = this.handleError(e)
        } else {
            if (e instanceof Array) {
                a = [];
                for (var b = 0; b < e.length; b++) {
                    a[b] = this.deserialize(e[b])
                }
            } else {
                if (c == "object") {
                    for (var b = 0; b < e.newTypes.length; b++) {
                        this.addTypeDataToCache(e.newTypes[b])
                    }
                    for (var d in e.newRefs) {
                        this.createProxy(d, e.newRefs[d])
                    }
                    if (e.type == FABridge.TYPE_PRIMITIVE) {
                        a = e.value
                    } else {
                        if (e.type == FABridge.TYPE_ASFUNCTION) {
                            a = this.getFunctionProxy(e.value)
                        } else {
                            if (e.type == FABridge.TYPE_ASINSTANCE) {
                                a = this.getProxy(e.value)
                            } else {
                                if (e.type == FABridge.TYPE_ANONYMOUS) {
                                    a = e.value
                                }
                            }
                        }
                    }
                }
            }
        }
        return a
    },
    addRef: function (a) {
        this.target.incRef(a.fb_instance_id)
    },
    release: function (a) {
        this.target.releaseRef(a.fb_instance_id)
    },
    handleError: function (b) {
        if (typeof (b) == "string" && b.indexOf("__FLASHERROR") == 0) {
            var a = b.split("||");
            if (FABridge.refCount > 0) {
                FABridge.refCount--
            }
            throw new Error(a[1]);
            return b
        } else {
            return b
        }
    }
};
ASProxy = function (b, a) {
    this.bridge = b;
    this.typeName = a;
    return this
};
ASProxy.prototype = {
    get: function (a) {
        return this.bridge.deserialize(this.bridge.getPropertyFromAS(this.fb_instance_id, a))
    },
    set: function (b, a) {
        this.bridge.setPropertyInAS(this.fb_instance_id, b, a)
    },
    call: function (b, a) {
        this.bridge.callASMethod(this.fb_instance_id, b, a)
    },
    addRef: function () {
        this.bridge.addRef(this)
    },
    release: function () {
        this.bridge.release(this)
    }
};
var swfobject = function () {
    var D = "undefined",
        r = "object",
        S = "Shockwave Flash",
        W = "ShockwaveFlash.ShockwaveFlash",
        q = "application/x-shockwave-flash",
        R = "SWFObjectExprInst",
        x = "onreadystatechange",
        O = window,
        j = document,
        t = navigator,
        T = false,
        U = [h],
        o = [],
        N = [],
        I = [],
        l, Q, E, B, J = false,
        a = false,
        n, G, m = true,
        M = function () {
            var aa = typeof j.getElementById != D && typeof j.getElementsByTagName != D && typeof j.createElement != D,
                ah = t.userAgent.toLowerCase(),
                Y = t.platform.toLowerCase(),
                ae = Y ? /win/.test(Y) : /win/.test(ah),
                ac = Y ? /mac/.test(Y) : /mac/.test(ah),
                af = /webkit/.test(ah) ? parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false,
                X = !+"\v1",
                ag = [0, 0, 0],
                ab = null;
            if (typeof t.plugins != D && typeof t.plugins[S] == r) {
                ab = t.plugins[S].description;
                if (ab && !(typeof t.mimeTypes != D && t.mimeTypes[q] && !t.mimeTypes[q].enabledPlugin)) {
                    T = true;
                    X = false;
                    ab = ab.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
                    ag[0] = parseInt(ab.replace(/^(.*)\..*$/, "$1"), 10);
                    ag[1] = parseInt(ab.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
                    ag[2] = /[a-zA-Z]/.test(ab) ? parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0
                }
            } else {
                if (typeof O.ActiveXObject != D) {
                    try {
                        var ad = new ActiveXObject(W);
                        if (ad) {
                            ab = ad.GetVariable("$version");
                            if (ab) {
                                X = true;
                                ab = ab.split(" ")[1].split(",");
                                ag = [parseInt(ab[0], 10), parseInt(ab[1], 10), parseInt(ab[2], 10)]
                            }
                        }
                    } catch (Z) {}
                }
            }
            return {
                w3: aa,
                pv: ag,
                wk: af,
                ie: X,
                win: ae,
                mac: ac
            }
        }(),
        k = function () {
            if (!M.w3) {
                return
            }
            if ((typeof j.readyState != D && j.readyState == "complete") || (typeof j.readyState == D && (j.getElementsByTagName("body")[0] || j.body))) {
                f()
            }
            if (!J) {
                if (typeof j.addEventListener != D) {
                    j.addEventListener("DOMContentLoaded", f, false)
                }
                if (M.ie && M.win) {
                    j.attachEvent(x, function () {
                        if (j.readyState == "complete") {
                            j.detachEvent(x, arguments.callee);
                            f()
                        }
                    });
                    if (O == top) {
                        (function () {
                            if (J) {
                                return
                            }
                            try {
                                j.documentElement.doScroll("left")
                            } catch (X) {
                                setTimeout(arguments.callee, 0);
                                return
                            }
                            f()
                        })()
                    }
                }
                if (M.wk) {
                    (function () {
                        if (J) {
                            return
                        }
                        if (!/loaded|complete/.test(j.readyState)) {
                            setTimeout(arguments.callee, 0);
                            return
                        }
                        f()
                    })()
                }
                s(f)
            }
        }();

    function f() {
        if (J) {
            return
        }
        try {
            var Z = j.getElementsByTagName("body")[0].appendChild(C("span"));
            Z.parentNode.removeChild(Z)
        } catch (aa) {
            return
        }
        J = true;
        var X = U.length;
        for (var Y = 0; Y < X; Y++) {
            U[Y]()
        }
    }
    function K(X) {
        if (J) {
            X()
        } else {
            U[U.length] = X
        }
    }
    function s(Y) {
        if (typeof O.addEventListener != D) {
            O.addEventListener("load", Y, false)
        } else {
            if (typeof j.addEventListener != D) {
                j.addEventListener("load", Y, false)
            } else {
                if (typeof O.attachEvent != D) {
                    i(O, "onload", Y)
                } else {
                    if (typeof O.onload == "function") {
                        var X = O.onload;
                        O.onload = function () {
                            X();
                            Y()
                        }
                    } else {
                        O.onload = Y
                    }
                }
            }
        }
    }
    function h() {
        if (T) {
            V()
        } else {
            H()
        }
    }
    function V() {
        var X = j.getElementsByTagName("body")[0];
        var aa = C(r);
        aa.setAttribute("type", q);
        var Z = X.appendChild(aa);
        if (Z) {
            var Y = 0;
            (function () {
                if (typeof Z.GetVariable != D) {
                    var ab = Z.GetVariable("$version");
                    if (ab) {
                        ab = ab.split(" ")[1].split(",");
                        M.pv = [parseInt(ab[0], 10), parseInt(ab[1], 10), parseInt(ab[2], 10)]
                    }
                } else {
                    if (Y < 10) {
                        Y++;
                        setTimeout(arguments.callee, 10);
                        return
                    }
                }
                X.removeChild(aa);
                Z = null;
                H()
            })()
        } else {
            H()
        }
    }
    function H() {
        var ag = o.length;
        if (ag > 0) {
            for (var af = 0; af < ag; af++) {
                var Y = o[af].id;
                var ab = o[af].callbackFn;
                var aa = {
                    success: false,
                    id: Y
                };
                if (M.pv[0] > 0) {
                    var ae = c(Y);
                    if (ae) {
                        if (F(o[af].swfVersion) && !(M.wk && M.wk < 312)) {
                            w(Y, true);
                            if (ab) {
                                aa.success = true;
                                aa.ref = z(Y);
                                ab(aa)
                            }
                        } else {
                            if (o[af].expressInstall && A()) {
                                var ai = {};
                                ai.data = o[af].expressInstall;
                                ai.width = ae.getAttribute("width") || "0";
                                ai.height = ae.getAttribute("height") || "0";
                                if (ae.getAttribute("class")) {
                                    ai.styleclass = ae.getAttribute("class")
                                }
                                if (ae.getAttribute("align")) {
                                    ai.align = ae.getAttribute("align")
                                }
                                var ah = {};
                                var X = ae.getElementsByTagName("param");
                                var ac = X.length;
                                for (var ad = 0; ad < ac; ad++) {
                                    if (X[ad].getAttribute("name").toLowerCase() != "movie") {
                                        ah[X[ad].getAttribute("name")] = X[ad].getAttribute("value")
                                    }
                                }
                                P(ai, ah, Y, ab)
                            } else {
                                p(ae);
                                if (ab) {
                                    ab(aa)
                                }
                            }
                        }
                    }
                } else {
                    w(Y, true);
                    if (ab) {
                        var Z = z(Y);
                        if (Z && typeof Z.SetVariable != D) {
                            aa.success = true;
                            aa.ref = Z
                        }
                        ab(aa)
                    }
                }
            }
        }
    }
    function z(aa) {
        var X = null;
        var Y = c(aa);
        if (Y && Y.nodeName == "OBJECT") {
            if (typeof Y.SetVariable != D) {
                X = Y
            } else {
                var Z = Y.getElementsByTagName(r)[0];
                if (Z) {
                    X = Z
                }
            }
        }
        return X
    }
    function A() {
        return !a && F("6.0.65") && (M.win || M.mac) && !(M.wk && M.wk < 312)
    }
    function P(aa, ab, X, Z) {
        a = true;
        E = Z || null;
        B = {
            success: false,
            id: X
        };
        var ae = c(X);
        if (ae) {
            if (ae.nodeName == "OBJECT") {
                l = g(ae);
                Q = null
            } else {
                l = ae;
                Q = X
            }
            aa.id = R;
            if (typeof aa.width == D || (!/%$/.test(aa.width) && parseInt(aa.width, 10) < 310)) {
                aa.width = "310"
            }
            if (typeof aa.height == D || (!/%$/.test(aa.height) && parseInt(aa.height, 10) < 137)) {
                aa.height = "137"
            }
            j.title = j.title.slice(0, 47) + " - Flash Player Installation";
            var ad = M.ie && M.win ? "ActiveX" : "PlugIn",
                ac = "MMredirectURL=" + encodeURI(window.location).toString().replace(/&/g, "%26") + "&MMplayerType=" + ad + "&MMdoctitle=" + j.title;
            if (typeof ab.flashvars != D) {
                ab.flashvars += "&" + ac
            } else {
                ab.flashvars = ac
            }
            if (M.ie && M.win && ae.readyState != 4) {
                var Y = C("div");
                X += "SWFObjectNew";
                Y.setAttribute("id", X);
                ae.parentNode.insertBefore(Y, ae);
                ae.style.display = "none";
                (function () {
                    if (ae.readyState == 4) {
                        ae.parentNode.removeChild(ae)
                    } else {
                        setTimeout(arguments.callee, 10)
                    }
                })()
            }
            u(aa, ab, X)
        }
    }
    function p(Y) {
        if (M.ie && M.win && Y.readyState != 4) {
            var X = C("div");
            Y.parentNode.insertBefore(X, Y);
            X.parentNode.replaceChild(g(Y), X);
            Y.style.display = "none";
            (function () {
                if (Y.readyState == 4) {
                    Y.parentNode.removeChild(Y)
                } else {
                    setTimeout(arguments.callee, 10)
                }
            })()
        } else {
            Y.parentNode.replaceChild(g(Y), Y)
        }
    }
    function g(ab) {
        var aa = C("div");
        if (M.win && M.ie) {
            aa.innerHTML = ab.innerHTML
        } else {
            var Y = ab.getElementsByTagName(r)[0];
            if (Y) {
                var ad = Y.childNodes;
                if (ad) {
                    var X = ad.length;
                    for (var Z = 0; Z < X; Z++) {
                        if (!(ad[Z].nodeType == 1 && ad[Z].nodeName == "PARAM") && !(ad[Z].nodeType == 8)) {
                            aa.appendChild(ad[Z].cloneNode(true))
                        }
                    }
                }
            }
        }
        return aa
    }
    function u(ai, ag, Y) {
        var X, aa = c(Y);
        if (M.wk && M.wk < 312) {
            return X
        }
        if (aa) {
            if (typeof ai.id == D) {
                ai.id = Y
            }
            if (M.ie && M.win) {
                var ah = "";
                for (var ae in ai) {
                    if (ai[ae] != Object.prototype[ae]) {
                        if (ae.toLowerCase() == "data") {
                            ag.movie = ai[ae]
                        } else {
                            if (ae.toLowerCase() == "styleclass") {
                                ah += ' class="' + ai[ae] + '"'
                            } else {
                                if (ae.toLowerCase() != "classid") {
                                    ah += " " + ae + '="' + ai[ae] + '"'
                                }
                            }
                        }
                    }
                }
                var af = "";
                for (var ad in ag) {
                    if (ag[ad] != Object.prototype[ad]) {
                        af += '<param name="' + ad + '" value="' + ag[ad] + '" />'
                    }
                }
                aa.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + ah + ">" + af + "</object>";
                N[N.length] = ai.id;
                X = c(ai.id)
            } else {
                var Z = C(r);
                Z.setAttribute("type", q);
                for (var ac in ai) {
                    if (ai[ac] != Object.prototype[ac]) {
                        if (ac.toLowerCase() == "styleclass") {
                            Z.setAttribute("class", ai[ac])
                        } else {
                            if (ac.toLowerCase() != "classid") {
                                Z.setAttribute(ac, ai[ac])
                            }
                        }
                    }
                }
                for (var ab in ag) {
                    if (ag[ab] != Object.prototype[ab] && ab.toLowerCase() != "movie") {
                        e(Z, ab, ag[ab])
                    }
                }
                aa.parentNode.replaceChild(Z, aa);
                X = Z
            }
        }
        return X
    }
    function e(Z, X, Y) {
        var aa = C("param");
        aa.setAttribute("name", X);
        aa.setAttribute("value", Y);
        Z.appendChild(aa)
    }
    function y(Y) {
        var X = c(Y);
        if (X && X.nodeName == "OBJECT") {
            if (M.ie && M.win) {
                X.style.display = "none";
                (function () {
                    if (X.readyState == 4) {
                        b(Y)
                    } else {
                        setTimeout(arguments.callee, 10)
                    }
                })()
            } else {
                X.parentNode.removeChild(X)
            }
        }
    }
    function b(Z) {
        var Y = c(Z);
        if (Y) {
            for (var X in Y) {
                if (typeof Y[X] == "function") {
                    Y[X] = null
                }
            }
            Y.parentNode.removeChild(Y)
        }
    }
    function c(Z) {
        var X = null;
        try {
            X = j.getElementById(Z)
        } catch (Y) {}
        return X
    }
    function C(X) {
        return j.createElement(X)
    }
    function i(Z, X, Y) {
        Z.attachEvent(X, Y);
        I[I.length] = [Z, X, Y]
    }
    function F(Z) {
        var Y = M.pv,
            X = Z.split(".");
        X[0] = parseInt(X[0], 10);
        X[1] = parseInt(X[1], 10) || 0;
        X[2] = parseInt(X[2], 10) || 0;
        return (Y[0] > X[0] || (Y[0] == X[0] && Y[1] > X[1]) || (Y[0] == X[0] && Y[1] == X[1] && Y[2] >= X[2])) ? true : false
    }
    function v(ac, Y, ad, ab) {
        if (M.ie && M.mac) {
            return
        }
        var aa = j.getElementsByTagName("head")[0];
        if (!aa) {
            return
        }
        var X = (ad && typeof ad == "string") ? ad : "screen";
        if (ab) {
            n = null;
            G = null
        }
        if (!n || G != X) {
            var Z = C("style");
            Z.setAttribute("type", "text/css");
            Z.setAttribute("media", X);
            n = aa.appendChild(Z);
            if (M.ie && M.win && typeof j.styleSheets != D && j.styleSheets.length > 0) {
                n = j.styleSheets[j.styleSheets.length - 1]
            }
            G = X
        }
        if (M.ie && M.win) {
            if (n && typeof n.addRule == r) {
                n.addRule(ac, Y)
            }
        } else {
            if (n && typeof j.createTextNode != D) {
                n.appendChild(j.createTextNode(ac + " {" + Y + "}"))
            }
        }
    }
    function w(aa, X) {
        if (!m) {
            return
        }
        var Y = X ? "visible" : "hidden";
        if (J && c(aa)) {
            var Z = document.getElementById(aa);
            Z.style.visibility = Y;
            Z.style.top = "40%";
            Z.style.position = "absolute";
            Z.style.left = "40%";
            Z.style.zIndex = "999"
        } else {
            console.log("create CSS");
            v("#" + aa, "visibility:" + Y)
        }
    }
    function L(Y) {
        var Z = /[\\\"<>\.;]/;
        var X = Z.exec(Y) != null;
        return X && typeof encodeURIComponent != D ? encodeURIComponent(Y) : Y
    }
    var d = function () {
        if (M.ie && M.win) {
            window.attachEvent("onunload", function () {
                var ac = I.length;
                for (var ab = 0; ab < ac; ab++) {
                    I[ab][0].detachEvent(I[ab][1], I[ab][2])
                }
                var Z = N.length;
                for (var aa = 0; aa < Z; aa++) {
                    y(N[aa])
                }
                for (var Y in M) {
                    M[Y] = null
                }
                M = null;
                for (var X in swfobject) {
                    swfobject[X] = null
                }
                swfobject = null
            })
        }
    }();
    return {
        registerObject: function (ab, X, aa, Z) {
            if (M.w3 && ab && X) {
                var Y = {};
                Y.id = ab;
                Y.swfVersion = X;
                Y.expressInstall = aa;
                Y.callbackFn = Z;
                o[o.length] = Y;
                w(ab, false)
            } else {
                if (Z) {
                    Z({
                        success: false,
                        id: ab
                    })
                }
            }
        },
        getObjectById: function (X) {
            if (M.w3) {
                return z(X)
            }
        },
        embedSWF: function (ab, ah, ae, ag, Y, aa, Z, ad, af, ac) {
            var X = {
                success: false,
                id: ah
            };
            if (M.w3 && !(M.wk && M.wk < 312) && ab && ah && ae && ag && Y) {
                w(ah, false);
                K(fun ction() {
                    ae += "";
                    ag += "";
                    var aj = {};
                    if (af && typeof af === r) {
                        for (var al in af) {
                            aj[al] = af[al]
                        }
                    }
                    aj.data = ab;
                    aj.width = ae;
                    aj.height = ag;
                    var am = {};
                    if (ad && typeof ad === r) {
                        for (var ak in ad) {
                            am[ak] = ad[ak]
                        }
                    }
                    if (Z && typeof Z === r) {
                        for (var ai in Z) {
                            if (typeof am.flashvars != D) {
                                am.flashvars += "&" + ai + "=" + Z[ai]
                            } else {
                                am.flashvars = ai + "=" + Z[ai]
                            }
                        }
                    }
                    if (F(Y)) {
                        var an = u(aj, am, ah);
                        if (aj.id == ah) {
                            w(ah, true)
                        }
                        X.success = true;
                        X.ref = an
                    } else {
                        if (aa && A()) {
                            aj.data = aa;
                            P(aj, am, ah, ac);
                            return
                        } else {
                            w(ah, true)
                        }
                    }
                    if (ac) {
                        ac(X)
                    }
                })
            } else {
                if (ac) {
                    ac(X)
                }
            }
        },
        switchOffAutoHideShow: function () {
            m = false
        },
        ua: M,
        getFlashPlayerVersion: function () {
            return {
                major: M.pv[0],
                minor: M.pv[1],
                release: M.pv[2]
            }
        },
        hasFlashPlayerVersion: F,
        createSWF: function (Z, Y, X) {
            if (M.w3) {
                return u(Z, Y, X)
            } else {
                return undefined
            }
        },
        showExpressInstall: function (Z, aa, X, Y) {
            if (M.w3 && A()) {
                P(Z, aa, X, Y)
            }
        },
        removeSWF: function (X) {
            if (M.w3) {
                y(X)
            }
        },
        createCSS: function (aa, Z, Y, X) {
            if (M.w3) {
                v(aa, Z, Y, X)
            }
        },
        addDomLoadEvent: K,
        addLoadEvent: s,
        getQueryParamValue: function (aa) {
            var Z = j.location.search || j.location.hash;
            if (Z) {
                if (/\?/.test(Z)) {
                    Z = Z.split("?")[1]
                }
                if (aa == null) {
                    return L(Z)
                }
                var Y = Z.split("&");
                for (var X = 0; X < Y.length; X++) {
                    if (Y[X].substring(0, Y[X].indexOf("=")) == aa) {
                        return L(Y[X].substring((Y[X].indexOf("=") + 1)))
                    }
                }
            }
            return ""
        },
        expressInstallCallback: function () {
            if (a) {
                var X = c(R);
                if (X && l) {
                    X.parentNode.replaceChild(l, X);
                    if (Q) {
                        w(Q, true);
                        if (M.ie && M.win) {
                            l.style.display = "block"
                        }
                    }
                    if (E) {
                        E(B)
                    }
                }
                a = false
            }
        }
    }
}();
(function () {
    var a;
    a = (function () {
        var l = "0.1b";
        var e = null;
        var m;
        var f = null;
        var k = 0;
        var n = "websdk";

        function p() {}
        var d = true;
        var c = true;
        var b = {
            "0": true,
            "1": true,
            "2": true,
            "3": true,
            "4": true,
            "5": true,
            "6": true,
            "7": true,
            "8": true,
            "9": true,
            "#": true,
            "*": true
        };
        p.prototype.onReady = function () {};
        p.prototype.onLogin = function () {};
        p.prototype.onLoginFailed = function () {};
        p.prototype.onLogout = function () {};
        p.prototype.onCalling = function () {};
        p.prototype.onCallRemoteRinging = function () {};
        p.prototype.onCallAnswered = function () {};
        p.prototype.onCallTerminated = function () {};
        p.prototype.onIncomingCall = function (q, r) {};
        p.prototype.onIncomingCallCanceled = function () {
            Plivo.logDevel("onIncomingCallCanceled stub")
        };
        p.prototype.onCallFailed = function (q) {
            Plivo.logDevel("onCallFailed stub")
        };
        p.prototype.onMediaPermission = function (q) {
            Plivo.logDevel("onMediaPermission")
        };
        p.prototype.onWebrtcNotSupported = function () {
            Plivo.logDevel("your browser doesn't support webrtc")
        };
        var o = function (q) {
            if (typeof (q) == "undefined") {
                q = {}
            }
            if (typeof (q.fallback_to_flash) == "undefined") {
                q.fallback_to_flash = false
            }
            if (typeof (q.debug) == "undefined") {
                q.debug = false
            }
            return q
        };
        p.prototype.init = function (s) {
            Plivo.logDevel("plivo_init");
            h();
            config = o(s);
            var r = window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection;
            var t = null;
            if (!r) {
                if (config.fallback_to_flash) {
                    Plivo.logDevel("Fallback to flash");
                    Plivo.conn = new plivo_flash(config);
                    m = "flash"
                } else {
                    Plivo.onWebrtcNotSupported()
                }
            } else {
                Plivo.logDevel("use webrtc");
                if (n == "websdk") {
                    Plivo.conn = new plivojs(config)
                } else {
                    Plivo.conn = new plivo_qoffeesip(config)
                }
                Plivo.onReady();
                m = "webrtc"
            }
            if (m == "webrtc") {
                i();
                var q = "https://s3.amazonaws.com/plivoweb-sdk/audio/us-ring.mp3";
                g(q);
                j(q)
            }
        };
        p.prototype.setRingTone = function (r) {
            if (r === false || r === null) {
                d = false
            } else {
                if (typeof r == "string") {
                    d = "user";
                    if (m == "flash") {
                        e.setRingtone(r)
                    } else {
                        var q = document.getElementById("plivo_ringtone");
                        q.src = r
                    }
                } else {
                    d = true
                }
            }
        };
        p.prototype.setRingToneBack = function (r) {
            if (r === false || r === null) {
                c = false
            } else {
                if (typeof r == "string") {
                    c = "user";
                    if (m == "flash") {
                        e.setRingToneBack(r)
                    } else {
                        var q = document.getElementById("plivo_ringbacktone");
                        q.src = r
                    }
                } else {
                    c = true
                }
            }
        };
        p.prototype.setDtmfTone = function (t, r) {
            if (r === false || r === null) {
                b[t] = false
            } else {
                if (typeof r == "string") {
                    b[t] = "user";
                    if (m == "flash") {
                        e.setDtmfTone(r, t)
                    } else {
                        var q = "dtmf" + t;
                        var s = document.getElementById(q);
                        s.src = r
                    }
                } else {
                    b[t] = true
                }
            }
        };
        p.prototype.logNull = function (q) {};
        p.prototype.logDevel = function (s) {
            var q = new Date();
            var r = q.getHours() + ":" + q.getMinutes() + ":" + q.getSeconds();
            console.log("PlivoWebSDK | " + r + " | " + s)
        };
        p.prototype.logDebug = function (q) {
            if (config.debug === true) {
                console.log("PlivoWebSDK:" + q)
            }
        };
        p.prototype.setDebug = function (q) {
            config.debug = q
        };
        p.prototype.ringTonePlay = function () {
            if (d !== false) {
                if (m == "flash") {} else {
                    var q = document.getElementById("plivo_ringtone");
                    q.play()
                }
            }
        };
        p.prototype.ringToneStop = function () {
            if (d !== false) {
                if (m == "flash") {} else {
                    var q = document.getElementById("plivo_ringtone");
                    q.pause()
                }
            }
        };
        p.prototype.rbTonePlay = function () {
            if (c !== false) {
                if (m == "flash") {} else {
                    var q = document.getElementById("plivo_ringbacktone");
                    q.play()
                }
            }
        };
        p.prototype.rbToneStop = function () {
            if (c !== false) {
                if (m == "flash") {} else {
                    var q = document.getElementById("plivo_ringbacktone");
                    q.pause()
                }
            }
        };
        p.prototype.dtmfTonePlay = function (r) {
            if (b[r] === false) {
                return
            }
            elem_name = null;
            if (r == "*") {
                elem_name = "dtmfstar"
            } else {
                if (r == "*") {
                    elem_name = "dtmfpound"
                } else {
                    elem_name = "dtmf" + r
                }
            }
            var q = document.getElementById(elem_name);
            q.play()
        };
        p.prototype.getDtmfToneFlag = function (q) {
            return b[q]
        };
        var g = function (q) {
            var r = document.createElement("audio");
            r.id = "plivo_ringbacktone";
            r.loop = "loop";
            r.src = q;
            document.body.appendChild(r)
        };
        var j = function (q) {
            var r = document.createElement("audio");
            r.id = "plivo_ringtone";
            r.loop = "loop";
            r.src = q;
            document.body.appendChild(r)
        };
        var i = function () {
            var q = function (v) {
                var u = "dtmf" + v;
                var t = "https://s3.amazonaws.com/plivoweb-sdk/audio/dtmf-" + v + ".mp3";
                var s = document.createElement("audio");
                s.id = u;
                s.src = t;
                document.body.appendChild(s)
            };
            for (var r = 0; r <= 9; r++) {
                q(r)
            }
            q("star");
            q("pound")
        };
        var h = function () {
            var q = document.createElement("meta");
            q.setAttribute("http-equiv", "X-UA-Compatible");
            q.content = "chrome1";
            document.getElementsByTagName("head")[0].appendChild(q)
        };
        return p
    })();
    window.plivo_stub = a
}).call(this);
window.Plivo = new plivo_stub();
(function (e) {
    var h = (function () {
        var j = "PlivoWebPhone",
            i = "0.2.2";
        return {
            name: function () {
                return j
            },
            version: function () {
                return i
            }
        }
    }());
    h.EventEmitter = function () {};
    h.EventEmitter.prototype = {
        initEvents: function (k) {
            var j = k.length;
            this.events = {};
            this.onceNotFired = [];
            this.maxListeners = 10;
            this.events.newListener = function (i) {
                Plivo.logNull(h.c.LOG_EVENT_EMITTER + "new Listener added to event: " + i)
            };
            while (j--) {
                Plivo.logNull(h.c.LOG_EVENT_EMITTER + "Adding event: " + k[j]);
                this.events[k[j]] = []
            }
        },
        checkEvent: function (i) {
            if (!this.events[i]) {
                Plivo.logNull(h.c.LOG_EVENT_EMITTER + "No event named: " + i);
                return false
            } else {
                return true
            }
        },
        addListener: function (i, j) {
            if (!this.checkEvent(i)) {
                return
            }
            if (this.events[i].length >= this.maxListeners) {
                Plivo.logNull(h.c.LOG_EVENT_EMITTER + "Max Listeners exceeded for event: " + i)
            }
            this.events[i].push(j);
            this.events.newListener.call(null, i)
        },
        on: function (i, j) {
            this.addListener(i, j)
        },
        once: function (i, j) {
            this.events[i].unshift(j);
            this.onceNotFired.push(i)
        },
        removeListener: function (l, m) {
            if (!this.checkEvent(l)) {
                return
            }
            var n = this.events[l],
                j = 0,
                k = n.length;
            while (j < k) {
                if (n[j] && n[j].toString() === m.toString()) {
                    n.splice(j, 1)
                } else {
                    j++
                }
            }
        },
        removeAllListener: function (i) {
            if (!this.checkEvent(i)) {
                return
            }
            this.events[i] = []
        },
        setMaxListeners: function (i) {
            if (Number(i)) {
                this.maxListeners = i
            }
        },
        listeners: function (i) {
            return this.events[i]
        },
        emit: function (m, j, n) {
            var k, l, i = 0;
            if (!this.checkEvent(m)) {
                return
            }
            Plivo.logNull(h.c.LOG_EVENT_EMITTER + "Emitting event: " + m);
            k = this.events[m];
            l = k.length;
            var o = new h.Event(m, j, n);
            if (o) {
                for (i; i < l; i++) {
                    k[i].apply(null, [o])
                }
            } else {
                for (i; i < l; i++) {
                    k[i].call()
                }
            }
            i = this.onceNotFired.indexOf(m);
            if (i !== -1) {
                this.onceNotFired.splice(i, 1);
                this.events[m].shift()
            }
        },
        newListener: function (i) {
            this.events.newListener = i
        }
    };
    h.Event = function (j, i, k) {
        this.type = j;
        this.sender = i;
        this.data = k
    };
    h.c = {
        USER_AGENT: h.name() + " " + h.version(),
        LOG_PARSER: h.name() + " | PARSER | ",
        LOG_DIGEST_AUTHENTICATION: h.name() + " | DIGEST AUTHENTICATION | ",
        LOG_SANITY_CHECK: h.name() + " | SANITY CHECK | ",
        LOG_UTILS: h.name() + " | UTILS | ",
        LOG_EXCEPTION: h.name() + " | EXCEPTION | ",
        LOG_TRANSPORT: h.name() + " | TRANSPORT | ",
        LOG_TRANSACTION: h.name() + " | TRANSACTION | ",
        LOG_DIALOG: h.name() + " | DIALOG | ",
        LOG_UA: h.name() + " | UA | ",
        LOG_INVITE_SESSION: h.name() + " | INVITE SESSION | ",
        LOG_CLIENT_INVITE_SESSION: h.name() + " | CLIENT INVITE SESSION | ",
        LOG_SERVER_INVITE_SESSION: h.name() + " | SERVER INVITE SESSION | ",
        LOG_EVENT_EMITTER: h.name() + " | EVENT EMITTER | ",
        LOG_MEDIA_SESSION: h.name() + " | MEDIA SESSION | ",
        LOG_MESSAGE: h.name() + " | MESSAGE | ",
        LOG_MESSAGE_RECEIVER: h.name() + " | MESSAGE_RECEIVER | ",
        LOG_MESSAGE_SENDER: h.name() + " | MESSAGE_SENDER | ",
        LOG_REGISTRATOR: h.name() + " | REGISTRATOR | ",
        LOG_REQUEST_SENDER: h.name() + " | REQUEST SENDER | ",
        LOG_SUBSCRIBER: h.name() + " | SUBSCRIBER | ",
        LOG_PRESENCE: h.name() + " | PRESENCE | ",
        LOG_MESSAGE_SUMMARY: h.name() + " | MESSAGE_SUMMARY | ",
        TRANSACTION_TRYING: 1,
        TRANSACTION_PROCEEDING: 2,
        TRANSACTION_CALLING: 3,
        TRANSACTION_ACCEPTED: 4,
        TRANSACTION_COMPLETED: 5,
        TRANSACTION_TERMINATED: 6,
        TRANSACTION_CONFIRMED: 7,
        DIALOG_EARLY: 1,
        DIALOG_CONFIRMED: 2,
        SESSION_NULL: 0,
        SESSION_INVITE_SENT: 1,
        SESSION_1XX_RECEIVED: 2,
        SESSION_INVITE_RECEIVED: 3,
        SESSION_WAITING_FOR_ANSWER: 4,
        SESSION_WAITING_FOR_ACK: 5,
        SESSION_CANCELED: 6,
        SESSION_TERMINATED: 7,
        SESSION_CONFIRMED: 8,
        CONNECTION_ERROR: 1,
        REQUEST_TIMEOUT: 2,
        causes: {
            BYE: "Terminated",
            CANCELED: "Canceled",
            NO_ANSWER: "No Answer",
            EXPIRES: "Expires",
            CONNECTION_ERROR: "Connection Error",
            REQUEST_TIMEOUT: "Request Timeout",
            NO_ACK: "No ACK",
            USER_DENIED_MEDIA_ACCESS: "User Denied Media Access",
            BAD_MEDIA_DESCRIPTION: "Bad Media Description",
            IN_DIALOG_408_OR_481: "In-dialog 408 or 481",
            SIP_FAILURE_CODE: "SIP Failure Code",
            BUSY: "Busy",
            REJECTED: "Rejected",
            REDIRECTED: "Redirected",
            UNAVAILABLE: "Unavailable",
            NOT_FOUND: "Not Found",
            ADDRESS_INCOMPLETE: "Address Incomplete",
            INCOMPATIBLE_SDP: "Incompatible SDP",
            AUTHENTICATION_ERROR: "Authentication Error"
        },
        SIP_ERROR_CAUSES: {
            REDIRECTED: [300, 301, 302, 305, 380],
            BUSY: [486, 600],
            REJECTED: [403, 603],
            NOT_FOUND: [404, 604],
            UNAVAILABLE: [480, 410, 408, 430],
            ADDRESS_INCOMPLETE: [484],
            INCOMPATIBLE_SDP: [488, 606],
            AUTHENTICATION_ERROR: [401, 407]
        },
        UA_STATUS_INIT: 0,
        UA_STATUS_READY: 1,
        UA_STATUS_USER_CLOSED: 2,
        UA_STATUS_NOT_READY: 3,
        UA_CONFIGURATION_ERROR: 1,
        UA_NETWORK_ERROR: 2,
        WS_SERVER_READY: 0,
        WS_SERVER_DISCONNECTED: 1,
        WS_SERVER_ERROR: 2,
        ACK: "ACK",
        BYE: "BYE",
        CANCEL: "CANCEL",
        INFO: "INFO",
        INVITE: "INVITE",
        MESSAGE: "MESSAGE",
        NOTIFY: "NOTIFY",
        OPTIONS: "OPTIONS",
        REGISTER: "REGISTER",
        UPDATE: "UPDATE",
        SUBSCRIBE: "SUBSCRIBE",
        REASON_PHRASE: {
            100: "Trying",
            180: "Ringing",
            181: "Call Is Being Forwarded",
            182: "Queued",
            183: "Session Progress",
            199: "Early Dialog Terminated",
            200: "OK",
            202: "Accepted",
            204: "No Notification",
            300: "Multiple Choices",
            301: "Moved Permanently",
            302: "Moved Temporarily",
            305: "Use Proxy",
            380: "Alternative Service",
            400: "Bad Request",
            401: "Unauthorized",
            402: "Payment Required",
            403: "Forbidden",
            404: "Not Found",
            405: "Method Not Allowed",
            406: "Not Acceptable",
            407: "Proxy Authentication Required",
            408: "Request Timeout",
            410: "Gone",
            412: "Conditional Request Failed",
            413: "Request Entity Too Large",
            414: "Request-URI Too Long",
            415: "Unsupported Media Type",
            416: "Unsupported URI Scheme",
            417: "Unknown Resource-Priority",
            420: "Bad Extension",
            421: "Extension Required",
            422: "Session Interval Too Small",
            423: "Interval Too Brief",
            428: "Use Identity Header",
            429: "Provide Referrer Identity",
            430: "Flow Failed",
            433: "Anonymity Disallowed",
            436: "Bad Identity-Info",
            437: "Unsupported Certificate",
            438: "Invalid Identity Header",
            439: "First Hop Lacks Outbound Support",
            440: "Max-Breadth Exceeded",
            469: "Bad Info Package",
            470: "Consent Needed",
            478: "Unresolvable Destination",
            480: "Temporarily Unavailable",
            481: "Call/Transaction Does Not Exist",
            482: "Loop Detected",
            483: "Too Many Hops",
            484: "Address Incomplete",
            485: "Ambiguous",
            486: "Busy Here",
            487: "Request Terminated",
            488: "Not Acceptable Here",
            489: "Bad Event",
            491: "Request Pending",
            493: "Undecipherable",
            494: "Security Agreement Required",
            500: "Server Internal Error",
            501: "Not Implemented",
            502: "Bad Gateway",
            503: "Service Unavailable",
            504: "Server Time-out",
            505: "Version Not Supported",
            513: "Message Too Large",
            580: "Precondition Failure",
            600: "Busy Everywhere",
            603: "Decline",
            604: "Does Not Exist Anywhere",
            606: "Not Acceptable"
        },
        MAX_FORWARDS: 69,
        ALLOWED_METHODS: "INVITE, ACK, CANCEL, BYE, OPTIONS, MESSAGE, SUBSCRIBE",
        SUPPORTED: "path, outbound, gruu",
        ACCEPTED_BODY_TYPES: "application/sdp",
        TAG_LENGTH: 10,
        UA_EVENT_METHODS: {
            newSession: "INVITE",
            newMessage: "MESSAGE"
        }
    };
    h.exceptions = {
        ConfigurationError: (function () {
            var i = function () {
                this.code = 1;
                this.name = "CONFIGURATION_ERROR";
                this.message = h.c.LOG_EXCEPTION + this.code
            };
            i.prototype = new Error();
            return i
        }()),
        NotReadyError: (function () {
            var i = function () {
                this.code = 2;
                this.name = "NOT_READY_ERROR";
                this.message = h.c.LOG_EXCEPTION + this.code
            };
            i.prototype = new Error();
            return i
        }()),
        InvalidTargetError: (function () {
            var i = function () {
                this.code = 3;
                this.name = "INVALID_TARGET_ERROR";
                this.message = h.c.LOG_EXCEPTION + this.code
            };
            i.prototype = new Error();
            return i
        }()),
        WebRtcNotSupportedError: (function () {
            var i = function () {
                this.code = 4;
                this.name = "WEBRTC_NO_SUPPORTED_ERROR";
                this.message = h.c.LOG_EXCEPTION + this.code
            };
            i.prototype = new Error();
            return i
        }()),
        InvalidStateError: (function () {
            var i = function () {
                this.code = 5;
                this.name = "INVALID_STATE_ERROR";
                this.message = h.c.LOG_EXCEPTION + this.code
            };
            i.prototype = new Error();
            return i
        }()),
        InvalidMethodError: (function () {
            var i = function () {
                this.code = 6;
                this.name = "INVALID_METHOD_ERROR";
                this.message = h.c.LOG_EXCEPTION + this.code
            };
            i.prototype = new Error();
            return i
        }()),
        InvalidValueError: (function () {
            var i = function () {
                this.code = 7;
                this.name = "INVALID_VALUE_ERROR";
                this.message = h.c.LOG_EXCEPTION + this.code
            };
            i.prototype = new Error();
            return i
        }())
    };
    h.Timers = (function () {
        var k = 500,
            j = 4000,
            i = 5000;
        return {
            T1: k,
            T2: j,
            T4: i,
            TIMER_B: 64 * k,
            TIMER_D: 0 * k,
            TIMER_F: 64 * k,
            TIMER_H: 64 * k,
            TIMER_I: 0 * k,
            TIMER_J: 0 * k,
            TIMER_K: 0 * i,
            TIMER_L: 64 * k,
            TIMER_M: 64 * k
        }
    }());
    h.Transport = function (i, j) {
        this.ua = i;
        this.ws = null;
        this.server = j;
        this.reconnection_attempts = 0;
        this.closed = false;
        this.connected = false;
        this.reconnectTimer = null;
        this.ua.transport = this;
        this.connect()
    };
    h.Transport.prototype = {
        send: function (j) {
            var i = j.toString();
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                if (this.ua.configuration.trace_sip === true) {
                    console.info(h.c.LOG_TRANSPORT + "Sending WebSocket message: \n\n" + i + "\n")
                }
                this.ws.send(i);
                return true
            } else {
                console.info(h.c.LOG_TRANSPORT + "Unable to send message. WebSocket is not open\n\n");
                return false
            }
        },
        disconnect: function () {
            if (this.ws) {
                this.closed = true;
                Plivo.logNull(h.c.LOG_TRANSPORT + "closing WebSocket connection " + this.server.ws_uri);
                this.ws.close()
            }
        },
        connect: function () {
            var j = this;
            if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
                Plivo.logNull(h.c.LOG_TRANSPORT + "WebSocket " + this.server.ws_uri + " is already connected");
                return false
            }
            if (this.ws) {
                this.ws.close()
            }
            Plivo.logNull(h.c.LOG_TRANSPORT + "Connecting to WebSocket URI " + this.server.ws_uri);
            try {
                this.ws = new WebSocket(this.server.ws_uri, "sip")
            } catch (i) {
                Plivo.logNull(h.c.LOG_TRANSPORT + "Error connecting to " + this.server.ws_uri + ": " + i)
            }
            this.ws.binaryType = "arraybuffer";
            this.ws.onopen = function (k) {
                j.onOpen(k)
            };
            this.ws.onclose = function (k) {
                j.onClose(k)
            };
            this.ws.onmessage = function (k) {
                j.onMessage(k)
            };
            this.ws.onerror = function (k) {
                j.onError(k)
            }
        },
        onOpen: function (i) {
            this.connected = true;
            Plivo.logNull(h.c.LOG_TRANSPORT + "WebSocket connected: " + this.server.ws_uri);
            e.clearTimeout(this.reconnectTimer);
            this.closed = false;
            this.ua.onTransportConnected(this)
        },
        onClose: function (j) {
            var i = this.connected;
            this.connected = false;
            console.warn(h.c.LOG_TRANSPORT + "WebSocket disconnected: code=" + j.code + (j.reason ? ", reason=" + j.reason : ""));
            if (j.wasClean === false) {
                Plivo.logNull(h.c.LOG_TRANSPORT + "ERROR: abrupt disconnection")
            }
            if (i === true) {
                this.ua.onTransportClosed(this);
                if (!this.closed) {
                    this.reconnection_attempts = 0;
                    this.reConnect()
                }
            } else {
                this.ua.onTransportError(this)
            }
        },
        onMessage: function (k) {
            var i, l, j = k.data;
            if (j === "\r\n") {
                if (this.ua.configuration.trace_sip === true) {
                    console.info(h.c.LOG_TRANSPORT + "Received WebSocket message with CRLF Keep Alive response")
                }
                return
            } else {
                if (typeof j !== "string") {
                    try {
                        j = String.fromCharCode.apply(null, new Uint8Array(k.data))
                    } catch (k) {
                        console.warn(h.c.LOG_TRANSPORT + "Received WebSocket binary message failed to be converted into String, message ignored");
                        return
                    }
                    if (this.ua.configuration.trace_sip === true) {
                        console.info(h.c.LOG_TRANSPORT + "Received WebSocket binary message: \n\n" + j + "\n")
                    }
                } else {
                    if (this.ua.configuration.trace_sip === true) {
                        console.info(h.c.LOG_TRANSPORT + "Received WebSocket text message: \n\n" + j + "\n")
                    }
                }
            }
            i = h.Parser.parseMessage(j);
            if (this.ua.status === h.c.UA_STATUS_USER_CLOSED && i instanceof h.IncomingRequest) {
                return
            }
            if (i && h.sanityCheck(i, this.ua, this)) {
                if (i instanceof h.IncomingRequest) {
                    i.transport = this;
                    this.ua.receiveRequest(i)
                } else {
                    if (i instanceof h.IncomingResponse) {
                        switch (i.method) {
                            case h.c.INVITE:
                                l = this.ua.transactions.ict[i.via_branch];
                                if (l) {
                                    l.receiveResponse(i)
                                }
                                break;
                            case h.c.ACK:
                                break;
                            default:
                                l = this.ua.transactions.nict[i.via_branch];
                                if (l) {
                                    l.receiveResponse(i)
                                }
                                break
                        }
                    }
                }
            }
        },
        onError: function (i) {
            Plivo.logNull(h.c.LOG_TRANSPORT + "WebSocket connection error")
        },
        reConnect: function () {
            var i = this;
            this.reconnection_attempts += 1;
            if (this.reconnection_attempts > this.ua.configuration.ws_server_max_reconnection) {
                Plivo.logNull(h.c.LOG_TRANSPORT + "Maximum reconnection attempts for: " + this.server.ws_uri);
                this.ua.onTransportError(this)
            } else {
                Plivo.logNull(h.c.LOG_TRANSPORT + "Trying to reconnect to: " + this.server.ws_uri + ". Reconnection attempt number " + this.reconnection_attempts);
                this.reconnectTimer = e.setTimeout(function () {
                    i.connect()
                }, this.ua.configuration.ws_server_reconnection_timeout * 1000)
            }
        }
    };
    h.Parser = {
        getHeader: function (k, l) {
            var m = l,
                j = 0,
                i = 0;
            if (k.substring(m, m + 2).match(/(^\r\n)/)) {
                return -2
            }
            while (j === 0) {
                i = k.indexOf("\r\n", m);
                if (i === -1) {
                    return i
                }
                if (!k.substring(i + 2, i + 4).match(/(^\r\n)/) && k.charAt(i + 2).match(/(^\s+)/)) {
                    m = i + 2
                } else {
                    j = i
                }
            }
            return j
        },
        parseHeader: function (t, k, s, r) {
            var l, i, q, p, m, j = k.indexOf(":", s),
                o = k.substring(s, j).trim(),
                n = k.substring(j + 1, r).trim();
            switch (o.toLowerCase()) {
                case "via":
                case "v":
                    t.addHeader("via", n);
                    if (t.countHeader("via") === 1) {
                        p = t.parseHeader("Via");
                        if (p) {
                            t.via = p;
                            t.via_branch = p.branch
                        }
                    } else {
                        p = 0
                    }
                    break;
                case "from":
                case "f":
                    t.setHeader("from", n);
                    p = t.parseHeader("from");
                    if (p) {
                        t.from = p;
                        t.from_tag = p.tag
                    }
                    break;
                case "to":
                case "t":
                    t.setHeader("to", n);
                    p = t.parseHeader("to");
                    if (p) {
                        t.to = p;
                        t.to_tag = p.tag
                    }
                    break;
                case "record-route":
                    l = n.match(/([^\"\',]*((\'[^\']*\')*||(\"[^\"]*\")*))+/gm);
                    i = l.length;
                    p = 0;
                    for (q = 0; q < i; q++) {
                        if (l[q].length > 0) {
                            t.addHeader("record-route", l[q])
                        }
                    }
                    break;
                case "call-id":
                case "i":
                    t.setHeader("call-id", n);
                    p = t.parseHeader("call-id");
                    if (p) {
                        t.call_id = n
                    }
                    break;
                case "contact":
                case "m":
                    l = n.match(/([^\"\',]*((\'[^\']*\')*||(\"[^\"]*\")*))+/gm);
                    i = l.length;
                    m = 0;
                    for (q = 0; q < i; q++) {
                        if (l[q].length > 0) {
                            t.addHeader("contact", l[q]);
                            p = t.parseHeader("contact", m);
                            m += 1;
                            if (p === undefined) {
                                break
                            }
                        }
                    }
                    break;
                case "content-length":
                case "l":
                    t.setHeader("content-length", n);
                    p = t.parseHeader("content-length");
                    break;
                case "content-type":
                case "c":
                    t.setHeader("content-type", n);
                    p = t.parseHeader("content-type");
                    break;
                case "cseq":
                    t.setHeader("cseq", n);
                    p = t.parseHeader("cseq");
                    if (p) {
                        t.cseq = p.value
                    }
                    if (t instanceof h.IncomingResponse) {
                        t.method = p.method
                    }
                    break;
                case "max-forwards":
                    t.setHeader("max-forwards", n);
                    p = t.parseHeader("max-forwards");
                    break;
                case "www-authenticate":
                    t.setHeader("www-authenticate", n);
                    p = t.parseHeader("www-authenticate");
                    break;
                case "proxy-authenticate":
                    t.setHeader("proxy-authenticate", n);
                    p = t.parseHeader("proxy-authenticate");
                    break;
                default:
                    t.setHeader(o, n);
                    p = 0
            }
            if (p === undefined) {
                return false
            } else {
                return true
            }
        },
        parseMessage: function (n) {
            var m, k, i, l, j, p = 0,
                o = n.indexOf("\r\n");
            if (o === -1) {
                Plivo.logNull(h.c.LOG_PARSER + "No CRLF found. Not a SIP message.");
                return
            }
            k = n.substring(0, o);
            j = h.grammar.parse(k, "Request_Response");
            if (j === -1) {
                Plivo.logNull(h.c.LOG_PARSER + 'Error parsing first line of SIP message: "' + k + '"');
                return
            } else {
                if (!j.status_code) {
                    m = new h.IncomingRequest();
                    m.method = j.method;
                    m.ruri = j
                } else {
                    m = new h.IncomingResponse();
                    m.status_code = j.status_code;
                    m.reason_phrase = j.reason_phrase
                }
            }
            m.data = n;
            p = o + 2;
            while (true) {
                o = h.Parser.getHeader(n, p);
                if (o === -2) {
                    l = p + 2;
                    break
                } else {
                    if (o === -1) {
                        return
                    }
                }
                j = h.Parser.parseHeader(m, n, p, o);
                if (!j) {
                    return
                }
                p = o + 2
            }
            if (m.hasHeader("content-length")) {
                i = m.getHeader("content-length");
                m.body = n.substr(l, i)
            } else {
                m.body = n.substring(l)
            }
            return m
        }
    };
    h.OutgoingRequest = function (i, r, j, o, m, s) {
        var u, p, l, x, q, t, n, w, v, k;
        o = o || {};
        if (!i || !r || !j) {
            return null
        }
        this.headers = {};
        this.method = i;
        this.ruri = r;
        this.body = s;
        this.extraHeaders = m || [];
        if (o.route_set) {
            this.setHeader("route", o.route_set)
        } else {
            if (j.configuration.use_preloaded_route) {
                this.setHeader("route", j.transport.server.sip_uri)
            }
        }
        this.setHeader("via", "");
        this.setHeader("max-forwards", h.c.MAX_FORWARDS);
        u = o.to_display_name ? '"' + o.to_display_name + '" ' : "";
        p = o.to_uri || r;
        l = o.to_tag ? ";tag=" + o.to_tag : "";
        x = u ? "<" + p + ">" : p;
        x += l;
        this.setHeader("to", x);
        q = o.from_display_name || j.configuration.display_name || "";
        t = o.from_uri || j.configuration.from_uri;
        n = o.from_tag || h.utils.newTag();
        w = q ? '"' + q + '" ' : "";
        w += q ? "<" + t + ">" : t;
        w += ";tag=" + n;
        this.setHeader("from", w);
        if (o.call_id) {
            v = o.call_id
        } else {
            v = j.configuration.websdk_id + Math.random().toString(36).substr(2, 15)
        }
        this.setHeader("call-id", v);
        k = o.cseq || Math.floor(Math.random() * 10000);
        k = k + " " + i;
        this.setHeader("cseq", k)
    };
    h.OutgoingRequest.prototype = {
        setHeader: function (i, j) {
            this.headers[h.utils.headerize(i)] = (j instanceof Array) ? j : [j]
        },
        toString: function () {
            var k = "",
                l, j, i;
            k += this.method + " " + this.ruri + " SIP/2.0\r\n";
            for (l in this.headers) {
                for (i in this.headers[l]) {
                    k += l + ": " + this.headers[l][i] + "\r\n"
                }
            }
            j = this.extraHeaders.length;
            for (i = 0; i < j; i++) {
                k += this.extraHeaders[i] + "\r\n"
            }
            k += "Supported: " + h.c.SUPPORTED + "\r\n";
            k += "User-Agent: " + h.c.USER_AGENT + "\r\n";
            if (this.body) {
                j = h.utils.str_utf8_length(this.body);
                k += "Content-Length: " + j + "\r\n\r\n";
                k += this.body
            } else {
                k += "Content-Length: " + 0 + "\r\n\r\n"
            }
            return k
        }
    };
    h.IncomingMessage = function () {
        this.data = null;
        this.headers = null;
        this.method = null;
        this.via = null;
        this.via_branch = null;
        this.call_id = null;
        this.cseq = null;
        this.from = null;
        this.from_tag = null;
        this.to = null;
        this.to_tag = null;
        this.body = null
    };
    h.IncomingMessage.prototype = {
        addHeader: function (i, j) {
            var k = {
                raw: j
            };
            i = h.utils.headerize(i);
            if (this.headers[i]) {
                this.headers[i].push(k)
            } else {
                this.headers[i] = [k]
            }
        },
        countHeader: function (i) {
            var j = this.headers[h.utils.headerize(i)];
            if (j) {
                return j.length
            } else {
                return 0
            }
        },
        getHeader: function (j, i) {
            var k = this.headers[h.utils.headerize(j)];
            i = i || 0;
            if (k) {
                if (k[i]) {
                    return k[i].raw
                }
            } else {
                return
            }
        },
        getHeaderAll: function (k) {
            var j, l = this.headers[h.utils.headerize(k)],
                i = [];
            if (!l) {
                return []
            }
            for (j in l) {
                i.push(l[j].raw)
            }
            return i
        },
        getHeaderUri: function (j, i) {
            var k = this.headers[h.utils.headerize(j)];
            i = i || 0;
            if (k) {
                if (k[i] && k[i].parsed && k[i].parsed.uri) {
                    return k[i].parsed.uri
                }
            } else {
                return
            }
        },
        hasHeader: function (i) {
            return (this.headers[h.utils.headerize(i)]) ? true : false
        },
        parseHeader: function (k, i) {
            var m, l, j;
            k = h.utils.headerize(k);
            i = i || 0;
            if (!this.headers[k]) {
                console.info(h.c.LOG_MESSAGE + 'Header "' + k + '" not present');
                return
            } else {
                if (i >= this.headers[k].length) {
                    console.info(h.c.LOG_MESSAGE + 'Not so many "' + k + '" headers present');
                    return
                }
            }
            m = this.headers[k][i];
            l = m.raw;
            if (m.parsed) {
                return m.parsed
            }
            j = h.grammar.parse(l, k.replace(/-/g, "_"));
            if (j === -1) {
                this.headers[k].splice(i, 1);
                console.error(h.c.LOG_MESSAGE + 'Error parsing "' + k + '" header field with value: "' + l + '"');
                return
            } else {
                m.parsed = j;
                return j
            }
        },
        s: function (j, i) {
            return this.parseHeader(j, i)
        },
        setHeader: function (i, j) {
            var k = {
                raw: j
            };
            this.headers[h.utils.headerize(i)] = [k]
        },
        toString: function () {
            return this.data
        }
    };
    h.IncomingRequest = function () {
        this.headers = {};
        this.ruri = null;
        this.transport = null;
        this.server_transaction = null
    };
    h.IncomingRequest.prototype = new h.IncomingMessage();
    h.IncomingRequest.prototype.reply = function (j, q, m, s, t, l) {
        var p, n, k, w, o, u = this.getHeader("To"),
            i = 0,
            x = 0;
        j = j || null;
        q = q || null;
        if (!j || (j < 100 || j > 699)) {
            throw new h.exceptions.InvalidValueError()
        } else {
            if (q && typeof q !== "string" && !(q instanceof String)) {
                throw new h.exceptions.InvalidValueError()
            }
        }
        q = q || h.c.REASON_PHRASE[j] || "";
        m = m || [];
        o = "SIP/2.0 " + j + " " + q + "\r\n";
        if (this.method === h.c.INVITE && j > 100 && j <= 200) {
            p = this.countHeader("record-route");
            for (i; i < p; i++) {
                o += "Record-Route: " + this.getHeader("record-route", i) + "\r\n"
            }
        }
        n = this.countHeader("via");
        for (x; x < n; x++) {
            o += "Via: " + this.getHeader("via", x) + "\r\n"
        }
        if (!this.to_tag) {
            u += ";tag=" + h.utils.newTag()
        } else {
            if (this.to_tag && !this.s("to").tag) {
                u += ";tag=" + this.to_tag
            }
        }
        o += "To: " + u + "\r\n";
        o += "From: " + this.getHeader("From") + "\r\n";
        o += "Call-ID: " + this.call_id + "\r\n";
        o += "CSeq: " + this.cseq + " " + this.method + "\r\n";
        k = m.length;
        for (w = 0; w < k; w++) {
            o += m[w] + "\r\n"
        }
        if (s) {
            k = h.utils.str_utf8_length(s);
            o += "Content-Type: application/sdp\r\n";
            o += "Content-Length: " + k + "\r\n\r\n";
            o += s
        } else {
            o += "\r\n"
        }
        this.server_transaction.receiveResponse(j, o, t, l)
    };
    h.IncomingRequest.prototype.reply_sl = function (k, m) {
        var n, j, l = this.countHeader("via");
        k = k || null;
        m = m || null;
        if (!k || (k < 100 || k > 699)) {
            throw new h.exceptions.InvalidValueError()
        } else {
            if (m && typeof m !== "string" && !(m instanceof String)) {
                throw new h.exceptions.InvalidValueError()
            }
        }
        m = m || h.c.REASON_PHRASE[k] || "";
        j = "SIP/2.0 " + k + " " + m + "\r\n";
        for (var i = 0; i < l; i++) {
            j += "Via: " + this.getHeader("via", i) + "\r\n"
        }
        n = this.getHeader("To");
        if (!this.to_tag) {
            n += ";tag=" + h.utils.newTag()
        } else {
            if (this.to_tag && !this.s("to").tag) {
                n += ";tag=" + this.to_tag
            }
        }
        j += "To: " + n + "\r\n";
        j += "From: " + this.getHeader("From") + "\r\n";
        j += "Call-ID: " + this.call_id + "\r\n";
        j += "CSeq: " + this.cseq + " " + this.method + "\r\n\r\n";
        this.transport.send(j)
    };
    h.IncomingResponse = function () {
        this.headers = {};
        this.response_code = null;
        this.reason_phrase = null
    };
    h.IncomingResponse.prototype = new h.IncomingMessage();
    var b = function () {
        this.init = function (k, j, l) {
            var i;
            this.transport = l;
            this.id = "z9hG4bK" + Math.floor(Math.random() * 10000000);
            this.request_sender = k;
            this.request = j;
            i = "SIP/2.0/" + (k.ua.configuration.hack_via_tcp ? "TCP" : l.server.scheme);
            i += " " + k.ua.configuration.via_host + ";branch=" + this.id;
            this.request.setHeader("via", i)
        }
    };
    var c = function () {
        this.send = function () {
            var i = this;
            this.state = h.c.TRANSACTION_TRYING;
            this.F = e.setTimeout(function () {
                i.timer_F()
            }, h.Timers.TIMER_F);
            if (!this.transport.send(this.request)) {
                this.onTransportError()
            }
        };
        this.onTransportError = function () {
            Plivo.logNull(h.c.LOG_TRANSACTION + "Transport Error occurred. Deleting non invite client transaction: " + this.id);
            e.clearTimeout(this.F);
            e.clearTimeout(this.K);
            delete this.request_sender.ua.transactions.nict[this.id];
            this.request_sender.onTransportError()
        };
        this.timer_F = function () {
            Plivo.logNull(h.c.LOG_TRANSACTION + "Timer F expired " + this.id);
            this.state = h.c.TRANSACTION_TERMINATED;
            this.request_sender.onRequestTimeout();
            delete this.request_sender.ua.transactions.nict[this.id]
        };
        this.timer_K = function () {
            this.state = h.c.TRANSACTION_TERMINATED;
            delete this.request_sender.ua.transactions.nict[this.id]
        };
        this.receiveResponse = function (i) {
            var k = this,
                j = i.status_code;
            if (j < 200) {
                switch (this.state) {
                    case h.c.TRANSACTION_TRYING:
                    case h.c.TRANSACTION_PROCEEDING:
                        this.state = h.c.TRANSACTION_PROCEEDING;
                        this.request_sender.receiveResponse(i);
                        break
                }
            } else {
                switch (this.state) {
                    case h.c.TRANSACTION_TRYING:
                    case h.c.TRANSACTION_PROCEEDING:
                        this.state = h.c.TRANSACTION_COMPLETED;
                        e.clearTimeout(this.F);
                        if (j === 408) {
                            this.request_sender.onRequestTimeout()
                        } else {
                            this.request_sender.receiveResponse(i)
                        }
                        this.K = e.setTimeout(function () {
                            k.timer_K()
                        }, h.Timers.TIMER_K);
                        break;
                    case h.c.TRANSACTION_COMPLETED:
                        break
                }
            }
        }
    };
    c.prototype = new b();
    var g = function () {
        this.send = function () {
            var i = this;
            this.state = h.c.TRANSACTION_CALLING;
            this.B = e.setTimeout(function () {
                i.timer_B()
            }, h.Timers.TIMER_B);
            if (!this.transport.send(this.request)) {
                this.onTransportError()
            }
        };
        this.onTransportError = function () {
            Plivo.logNull(h.c.LOG_TRANSACTION + "Transport Error occurred. Deleting invite client transaction: " + this.id);
            e.clearTimeout(this.B);
            e.clearTimeout(this.D);
            e.clearTimeout(this.M);
            delete this.request_sender.ua.transactions.ict[this.id];
            this.request_sender.onTransportError()
        };
        this.timer_M = function () {
            Plivo.logNull(h.c.LOG_TRANSACTION + "Timer M expired " + this.id);
            if (this.state === h.c.TRANSACTION_ACCEPTED) {
                this.state = h.c.TRANSACTION_TERMINATED;
                e.clearTimeout(this.B);
                delete this.request_sender.ua.transactions.ict[this.id]
            }
        };
        this.timer_B = function () {
            Plivo.logNull(h.c.LOG_TRANSACTION + "Timer B expired " + this.id);
            if (this.state === h.c.TRANSACTION_CALLING) {
                this.state = h.c.TRANSACTION_TERMINATED;
                this.request_sender.onRequestTimeout();
                delete this.request_sender.ua.transactions.ict[this.id]
            }
        };
        this.timer_D = function () {
            Plivo.logNull(h.c.LOG_TRANSACTION + "Timer D expired " + this.id);
            this.state = h.c.TRANSACTION_TERMINATED;
            e.clearTimeout(this.B);
            delete this.request_sender.ua.transactions.ict[this.id]
        };
        this.sendACK = function (i) {
            var j = this;
            this.ack = "ACK " + this.request.ruri + " SIP/2.0\r\n";
            this.ack += "Via: " + this.request.headers.Via.toString() + "\r\n";
            if (this.request.headers.Route) {
                this.ack += "Route: " + this.request.headers.Route.toString() + "\r\n"
            }
            this.ack += "To: " + i.getHeader("to") + "\r\n";
            this.ack += "From: " + this.request.headers.From.toString() + "\r\n";
            this.ack += "Call-ID: " + this.request.headers["Call-ID"].toString() + "\r\n";
            this.ack += "CSeq: " + this.request.headers.CSeq.toString().split(" ")[0];
            this.ack += " ACK\r\n\r\n";
            this.D = e.setTimeout(function () {
                j.timer_D()
            }, h.Timers.TIMER_D);
            this.transport.send(this.ack)
        };
        this.cancel_request = function (j, k) {
            var i = j.request;
            this.cancel = h.c.CANCEL + " " + i.ruri + " SIP/2.0\r\n";
            this.cancel += "Via: " + i.headers.Via.toString() + "\r\n";
            if (this.request.headers.Route) {
                this.cancel += "Route: " + i.headers.Route.toString() + "\r\n"
            }
            this.cancel += "To: " + i.headers.To.toString() + "\r\n";
            this.cancel += "From: " + i.headers.From.toString() + "\r\n";
            this.cancel += "Call-ID: " + i.headers["Call-ID"].toString() + "\r\n";
            this.cancel += "CSeq: " + i.headers.CSeq.toString().split(" ")[0] + " CANCEL\r\n";
            if (k) {
                this.cancel += "Reason:SIP ;cause=200 ;text=" + k + "\r\n"
            }
            this.cancel += "Content-Length: 0\r\n\r\n";
            if (this.state === h.c.TRANSACTION_PROCEEDING) {
                this.transport.send(this.cancel)
            }
        };
        this.receiveResponse = function (i) {
            var k = this,
                j = i.status_code;
            if (j >= 100 && j <= 199) {
                switch (this.state) {
                    case h.c.TRANSACTION_CALLING:
                        this.state = h.c.TRANSACTION_PROCEEDING;
                        this.request_sender.receiveResponse(i);
                        if (this.cancel) {
                            this.transport.send(this.cancel)
                        }
                        break;
                    case h.c.TRANSACTION_PROCEEDING:
                        this.request_sender.receiveResponse(i);
                        break
                }
            } else {
                if (j >= 200 && j <= 299) {
                    switch (this.state) {
                        case h.c.TRANSACTION_CALLING:
                        case h.c.TRANSACTION_PROCEEDING:
                            this.state = h.c.TRANSACTION_ACCEPTED;
                            this.M = e.setTimeout(function () {
                                k.timer_M()
                            }, h.Timers.TIMER_M);
                            this.request_sender.receiveResponse(i);
                            break;
                        case h.c.TRANSACTION_ACCEPTED:
                            this.request_sender.receiveResponse(i);
                            break
                    }
                } else {
                    if (j >= 300 && j <= 699) {
                        switch (this.state) {
                            case h.c.TRANSACTION_CALLING:
                            case h.c.TRANSACTION_PROCEEDING:
                                this.state = h.c.TRANSACTION_COMPLETED;
                                this.sendACK(i);
                                this.request_sender.receiveResponse(i);
                                break;
                            case h.c.TRANSACTION_COMPLETED:
                                this.sendACK(i);
                                break
                        }
                    }
                }
            }
        }
    };
    g.prototype = new b();
    var f = function () {
        this.init = function (j, i) {
            this.id = j.via_branch;
            this.request = j;
            this.transport = j.transport;
            this.ua = i;
            this.last_response = "";
            j.server_transaction = this
        }
    };
    var a = function () {
        this.timer_J = function () {
            Plivo.logNull(h.c.LOG_TRANSACTION + "Timer J expired " + this.id);
            this.state = h.c.TRANSACTION_TERMINATED;
            delete this.ua.transactions.nist[this.id]
        };
        this.onTransportError = function () {
            if (!this.transportError) {
                this.transportError = true;
                Plivo.logNull(h.c.LOG_TRANSACTION + "Transport Error occurred. Deleting non invite server transaction: " + this.id);
                e.clearTimeout(this.J);
                delete this.ua.transactions.nist[this.id]
            }
        };
        this.receiveResponse = function (k, i, m, j) {
            var l = this;
            if (k === 100) {
                switch (this.state) {
                    case h.c.TRANSACTION_TRYING:
                        this.state = h.c.TRANSACTION_PROCEEDING;
                        if (!this.transport.send(i)) {
                            this.onTransportError()
                        }
                        break;
                    case h.c.TRANSACTION_PROCEEDING:
                        this.last_response = i;
                        if (!this.transport.send(i)) {
                            this.onTransportError();
                            if (j) {
                                j()
                            }
                        } else {
                            if (m) {
                                m()
                            }
                        }
                        break
                }
            } else {
                if (k >= 200 && k <= 699) {
                    switch (this.state) {
                        case h.c.TRANSACTION_TRYING:
                        case h.c.TRANSACTION_PROCEEDING:
                            this.state = h.c.TRANSACTION_COMPLETED;
                            this.last_response = i;
                            this.J = e.setTimeout(function () {
                                l.timer_J()
                            }, h.Timers.TIMER_J);
                            if (!this.transport.send(i)) {
                                this.onTransportError();
                                if (j) {
                                    j()
                                }
                            } else {
                                if (m) {
                                    m()
                                }
                            }
                            break;
                        case h.c.TRANSACTION_COMPLETED:
                            break
                    }
                }
            }
        }
    };
    a.prototype = new f();
    var d = function () {
        this.timer_H = function () {
            Plivo.logNull(h.c.LOG_TRANSACTION + "Timer H expired " + this.id);
            if (this.state === h.c.TRANSACTION_COMPLETED) {
                Plivo.logNull(h.c.LOG_TRANSACTION + "transactions", "ACK for ist was never received. Call will be terminated");
                this.state = h.c.TRANSACTION_TERMINATED
            }
            delete this.ua.transactions.ist[this.id]
        };
        this.timer_I = function () {
            this.state = h.c.TRANSACTION_TERMINATED;
            delete this.ua.transactions.ist[this.id]
        };
        this.timer_L = function () {
            Plivo.logNull(h.c.LOG_TRANSACTION + "Timer L expired " + this.id);
            if (this.state === h.c.TRANSACTION_ACCEPTED) {
                this.state = h.c.TRANSACTION_TERMINATED;
                delete this.ua.transactions.ist[this.id]
            }
        };
        this.onTransportError = function () {
            if (!this.transportError) {
                this.transportError = true;
                Plivo.logNull(h.c.LOG_TRANSACTION + "Transport Error occurred. Deleting invite server transaction: " + this.id);
                e.clearTimeout(this.reliableProvisionalTimer);
                e.clearTimeout(this.L);
                e.clearTimeout(this.H);
                e.clearTimeout(this.I);
                delete this.ua.transactions.ist[this.id]
            }
        };
        this.timer_reliableProvisional = function (j) {
            var l = this,
                i = this.last_response,
                k = h.Timers.T1 * (Math.pow(2, j + 1));
            if (j > 8) {
                e.clearTimeout(this.reliableProvisionalTimer)
            } else {
                j += 1;
                if (!this.transport.send(i)) {
                    this.onTransportError()
                }
                this.reliableProvisionalTimer = e.setTimeout(function () {
                    l.timer_reliableProvisional(j)
                }, k)
            }
        };
        this.receiveResponse = function (k, i, m, j) {
            var l = this;
            if (k >= 100 && k <= 199) {
                switch (this.state) {
                    case h.c.TRANSACTION_PROCEEDING:
                        if (!this.transport.send(i)) {
                            this.onTransportError()
                        }
                        this.last_response = i;
                        break
                }
            }
            if (k > 100 && k <= 199) {
                if (!this.reliableProvisionalTimer) {
                    this.reliableProvisionalTimer = e.setTimeout(function () {
                        l.timer_reliableProvisional(1)
                    }, h.Timers.T1)
                }
            } else {
                if (k >= 200 && k <= 299) {
                    switch (this.state) {
                        case h.c.TRANSACTION_PROCEEDING:
                            this.state = h.c.TRANSACTION_ACCEPTED;
                            this.last_response = i;
                            this.L = e.setTimeout(function () {
                                l.timer_L()
                            }, h.Timers.TIMER_L);
                            e.clearTimeout(this.reliableProvisionalTimer);
                        case h.c.TRANSACTION_ACCEPTED:
                            if (!this.transport.send(i)) {
                                this.onTransportError();
                                if (j) {
                                    j()
                                }
                            } else {
                                if (m) {
                                    m()
                                }
                            }
                            break
                    }
                } else {
                    if (k >= 300 && k <= 699) {
                        switch (this.state) {
                            case h.c.TRANSACTION_PROCEEDING:
                                e.clearTimeout(this.reliableProvisionalTimer);
                                if (!this.transport.send(i)) {
                                    this.onTransportError();
                                    if (j) {
                                        j()
                                    }
                                } else {
                                    this.state = h.c.TRANSACTION_COMPLETED;
                                    this.H = e.setTimeout(function () {
                                        l.timer_H()
                                    }, h.Timers.TIMER_H);
                                    if (m) {
                                        m()
                                    }
                                }
                                break
                        }
                    }
                }
            }
        }
    };
    d.prototype = new f();
    h.Transactions = {};
    h.Transactions.NonInviteClientTransaction = function (j, i, k) {
        this.init(j, i, k);
        this.request_sender.ua.transactions.nict[this.id] = this
    };
    h.Transactions.NonInviteClientTransaction.prototype = new c();
    h.Transactions.InviteClientTransaction = function (k, i, l) {
        var j = this;
        this.init(k, i, l);
        this.request_sender.ua.transactions.ict[this.id] = this;
        this.request.cancel = function (m) {
            j.cancel_request(j, m)
        }
    };
    h.Transactions.InviteClientTransaction.prototype = new g();
    h.Transactions.AckClientTransaction = function (j, i, k) {
        this.init(j, i, k);
        this.send = function () {
            this.transport.send(i)
        }
    };
    h.Transactions.AckClientTransaction.prototype = new c();
    h.Transactions.NonInviteServerTransaction = function (j, i) {
        this.init(j, i);
        this.state = h.c.TRANSACTION_TRYING;
        i.transactions.nist[this.id] = this
    };
    h.Transactions.NonInviteServerTransaction.prototype = new a();
    h.Transactions.InviteServerTransaction = function (j, i) {
        this.init(j, i);
        this.state = h.c.TRANSACTION_PROCEEDING;
        i.transactions.ist[this.id] = this;
        this.reliableProvisionalTimer = null;
        j.reply(100)
    };
    h.Transactions.InviteServerTransaction.prototype = new d();
    h.Transactions.checkTransaction = function (i, j) {
        var k;
        switch (j.method) {
            case h.c.INVITE:
                k = i.transactions.ist[j.via_branch];
                if (k) {
                    switch (k.state) {
                        case h.c.TRANSACTION_PROCEEDING:
                            k.transport.send(k.last_response);
                            break;
                        case h.c.TRANSACTION_ACCEPTED:
                            break
                    }
                    return true
                }
                break;
            case h.c.ACK:
                k = i.transactions.ist[j.via_branch];
                if (k) {
                    if (k.state === h.c.TRANSACTION_ACCEPTED) {
                        return false
                    } else {
                        if (k.state === h.c.TRANSACTION_COMPLETED) {
                            k.state = h.c.TRANSACTION_CONFIRMED;
                            k.I = e.setTimeout(function () {
                                k.timer_I()
                            }, h.Timers.TIMER_I);
                            return true
                        }
                    }
                } else {
                    return false
                }
                break;
            case h.c.CANCEL:
                k = i.transactions.ist[j.via_branch];
                if (k) {
                    if (k.state === h.c.TRANSACTION_PROCEEDING) {
                        k.request.reply(487);
                        return false
                    } else {
                        return true
                    }
                } else {
                    j.reply_sl(481);
                    return true
                }
                break;
            default:
                k = i.transactions.nist[j.via_branch];
                if (k) {
                    switch (k.state) {
                        case h.c.TRANSACTION_TRYING:
                            break;
                        case h.c.TRANSACTION_PROCEEDING:
                        case h.c.TRANSACTION_COMPLETED:
                            k.transport.send(k.last_response);
                            break
                    }
                    return true
                }
                break
        }
    };
    h.Dialog = function (l, m, j, k) {
        var i;
        if (m.countHeader("contact") === 0) {
            Plivo.logNull(h.c.LOG_DIALOG + "No contact header field. Silently discarded");
            return false
        }
        if (m instanceof h.IncomingResponse) {
            k = (m.status_code < 200) ? h.c.DIALOG_EARLY : h.c.DIALOG_CONFIRMED
        } else {
            if (m instanceof h.IncomingRequest) {
                k = k || h.c.DIALOG_CONFIRMED
            } else {
                Plivo.logNull(h.c.LOG_DIALOG + "Received message is not a request neither a response");
                return false
            }
        }
        i = m.s("contact");
        if (j === "UAS") {
            this.id = {
                call_id: m.call_id,
                local_tag: m.to_tag,
                remote_tag: m.from_tag,
                toString: function () {
                    return this.call_id + this.local_tag + this.remote_tag
                }
            };
            this.state = k;
            this.remote_seqnum = m.cseq;
            this.local_uri = m.parseHeader("to").uri;
            this.remote_uri = m.parseHeader("from").uri;
            this.remote_target = i.uri;
            this.route_set = m.getHeaderAll("record-route")
        } else {
            if (j === "UAC") {
                this.id = {
                    call_id: m.call_id,
                    local_tag: m.from_tag,
                    remote_tag: m.to_tag,
                    toString: function () {
                        return this.call_id + this.local_tag + this.remote_tag
                    }
                };
                this.state = k;
                this.local_seqnum = m.cseq;
                this.local_uri = m.parseHeader("from").uri;
                this.remote_uri = m.parseHeader("to").uri;
                this.remote_target = i.uri;
                this.route_set = m.getHeaderAll("record-route").reverse()
            }
        }
        this.session = l;
        l.ua.dialogs[this.id.toString()] = this;
        Plivo.logNull(h.c.LOG_DIALOG + "New " + j + " dialog created: " + this.state)
    };
    h.Dialog.prototype = {
        update: function (j, i) {
            this.state = h.c.DIALOG_CONFIRMED;
            Plivo.logNull(h.c.LOG_DIALOG + "dialog state changed to 'CONFIRMED' state");
            if (i === "UAC") {
                this.route_set = j.getHeaderAll("record-route").reverse()
            }
        },
        terminate: function () {
            Plivo.logNull(h.c.LOG_DIALOG + "dialog state: " + this.id.toString() + " deleted");
            delete this.session.ua.dialogs[this.id.toString()]
        },
        createRequest: function (l, k) {
            var i, j;
            k = k || [];
            if (!this.local_seqnum) {
                this.local_seqnum = Math.floor(Math.random() * 10000)
            }
            i = (l === h.c.CANCEL || l === h.c.ACK) ? this.local_seqnum : this.local_seqnum += 1;
            j = new h.OutgoingRequest(l, this.remote_target, this.session.ua, {
                cseq: i,
                call_id: this.id.call_id,
                from_uri: this.local_uri,
                from_tag: this.id.local_tag,
                to_uri: this.remote_uri,
                to_tag: this.id.remote_tag,
                route_set: this.route_set
            }, k);
            j.dialog = this;
            return j
        },
        checkInDialogRequest: function (j) {
            if (!this.remote_seqnum) {
                this.remote_seqnum = j.cseq
            } else {
                if (j.method !== h.c.INVITE && j.cseq < this.remote_seqnum) {
                    if (j.method !== h.c.ACK) {
                        j.reply(500)
                    }
                    return false
                } else {
                    if (j.cseq > this.remote_seqnum) {
                        this.remote_seqnum = j.cseq
                    }
                }
            }
            switch (j.method) {
                case h.c.INVITE:
                    if (j.cseq < this.remote_seqnum) {
                        if (this.state === h.c.DIALOG_EARLY) {
                            var i = (Math.random() * 10 | 0) + 1;
                            j.reply(500, null, ["Retry-After:" + i])
                        } else {
                            j.reply(500)
                        }
                        return false
                    }
                    if (this.state === h.c.DIALOG_EARLY) {
                        j.reply(491);
                        return false
                    }
                    if (j.hasHeader("contact")) {
                        this.remote_target = j.parseHeader("contact").uri
                    }
                    break;
                case h.c.NOTIFY:
                    if (j.hasHeader("contact")) {
                        this.remote_target = j.parseHeader("contact").uri
                    }
                    break
            }
            return true
        },
        receiveRequest: function (i) {
            if (!this.checkInDialogRequest(i)) {
                return
            }
            this.session.receiveRequest(i)
        }
    };
    h.RequestSender = function (j, i) {
        this.ua = i;
        this.applicant = j;
        this.method = j.request.method;
        this.request = j.request;
        this.credentials = null;
        this.challenged = false;
        this.staled = false;
        if (i.status === h.c.UA_STATUS_USER_CLOSED && (this.method !== h.c.BYE || this.method !== h.c.ACK)) {
            this.onTransportError()
        }
        this.credentials = i.getCredentials(this.request)
    };
    h.RequestSender.prototype = {
        send: function () {
            if (this.credentials && !this.challenged) {
                if (this.request.method === h.c.REGISTER) {
                    this.request.setHeader("authorization", this.credentials.authenticate())
                } else {
                    if (this.request.method !== h.c.CANCEL) {
                        this.request.setHeader("proxy-authorization", this.credentials.authenticate())
                    }
                }
            }
            switch (this.method) {
                case "INVITE":
                    this.clientTransaction = new h.Transactions.InviteClientTransaction(this, this.request, this.ua.transport);
                    break;
                case "ACK":
                    this.clientTransaction = new h.Transactions.AckClientTransaction(this, this.request, this.ua.transport);
                    break;
                default:
                    this.clientTransaction = new h.Transactions.NonInviteClientTransaction(this, this.request, this.ua.transport)
            }
            this.clientTransaction.send()
        },
        onRequestTimeout: function () {
            this.applicant.onRequestTimeout()
        },
        onTransportError: function () {
            this.applicant.onTransportError()
        },
        receiveResponse: function (j) {
            var i, k, l = j.status_code;
            if ((l === 401 || l === 407) && this.ua.configuration.password !== null) {
                if (l === 401) {
                    k = j.s("WWW-Authenticate")
                } else {
                    k = j.s("Proxy-Authenticate")
                }
                if (!this.challenged || (this.challenged && !this.staled && k.stale === "true")) {
                    if (!this.credentials) {
                        this.credentials = new h.DigestAuthentication(this.ua, this.request, j)
                    } else {
                        this.credentials.update(j)
                    }
                    if (k.stale === "true") {
                        this.staled = true
                    }
                    if (j.method === h.c.REGISTER) {
                        i = this.applicant.cseq += 1
                    } else {
                        if (this.request.dialog) {
                            i = this.request.dialog.local_seqnum += 1
                        } else {
                            i = this.request.headers.CSeq.toString().split(" ")[0];
                            i = parseInt(i, 10) + 1
                        }
                    }
                    this.request.setHeader("cseq", i + " " + this.method);
                    this.challenged = true;
                    if (l === 401) {
                        this.request.setHeader("authorization", this.credentials.authenticate())
                    } else {
                        this.request.setHeader("proxy-authorization", this.credentials.authenticate())
                    }
                    this.send()
                } else {
                    this.applicant.receiveResponse(j)
                }
            } else {
                if (this.challenged && j.status_code >= 200) {
                    this.ua.saveCredentials(this.credentials)
                }
                this.applicant.receiveResponse(j)
            }
        }
    };
    h.InDialogRequestSender = function (i) {
        this.applicant = i;
        this.request = i.request
    };
    h.InDialogRequestSender.prototype = {
        send: function () {
            var i = new h.RequestSender(this, this.applicant.session.ua);
            i.send()
        },
        onRequestTimeout: function () {
            this.applicant.session.onRequestTimeout()
        },
        onTransportError: function () {
            this.applicant.session.onTransportError()
        },
        receiveResponse: function (i) {
            var j = i.status_code;
            if (j === 408 || j === 481) {
                this.applicant.ended("remote", i, h.c.causes.IN_DIALOG_408_OR_481)
            } else {
                this.applicant.receiveResponse(i)
            }
        }
    };
    h.Registrator = function (j, k) {
        var i = 1;
        this.ua = j;
        this.transport = k;
        this.expires = j.configuration.register_expires;
        this.min_expires = j.configuration.register_min_expires;
        this.call_id = Math.random().toString(36).substr(2, 22);
        this.cseq = 80;
        this.registrar = "sip:" + j.configuration.domain;
        this.from_uri = j.configuration.from_uri;
        this.registrationTimer = null;
        this.registered = this.registered_before = false;
        this.ua.registrator = this;
        if (i) {
            this.contact = "<" + this.ua.contact.uri + ">";
            this.contact += ";reg-id=" + i;
            this.contact += ';+sip.instance="<urn:uuid:' + this.ua.configuration.instance_id + '>"'
        } else {
            this.contact = "<" + this.ua.contact.uri + ">"
        }
        this.register()
    };
    h.Registrator.prototype = {
        register: function () {
            var k, j, i = this;
            this.request = new h.OutgoingRequest(h.c.REGISTER, this.registrar, this.ua, {
                to_uri: this.from_uri,
                call_id: this.call_id,
                cseq: (this.cseq += 1)
            }, ["Contact: " + this.contact + ";expires=" + this.expires, "Allow: " + h.utils.getAllowedMethods(this.ua)]);
            k = new h.RequestSender(this, this.ua);
            this.receiveResponse = function (n) {
                var l, m, p, o = n.countHeader("contact");
                if (n.cseq !== this.cseq) {
                    return
                }
                switch (true) {
                    case /^1[0-9]{2}$/.test(n.status_code):
                        break;
                    case /^2[0-9]{2}$/.test(n.status_code):
                        if (n.hasHeader("expires")) {
                            m = n.getHeader("expires")
                        }
                        if (!o) {
                            Plivo.logNull(h.c.LOG_REGISTRATOR + "No Contact header positive response to Register. Ignore response");
                            break
                        }
                        while (o--) {
                            l = n.parseHeader("contact", o);
                            if (l.uri === this.ua.contact.uri) {
                                m = l.params.expires;
                                break
                            }
                        }
                        if (!l) {
                            Plivo.logNull(h.c.LOG_REGISTRATOR + "No Contact header pointing to us. Ignore response");
                            break
                        }
                        if (!m) {
                            m = this.expires
                        } else {
                            if (m < this.min_expires) {
                                Plivo.logNull(h.c.LOG_REGISTRATOR + "Received expires value: " + m + " is smaller than the minimum expires time: " + this.min_expires);
                                m = this.min_expires
                            }
                        }
                        this.registrationTimer = e.setTimeout(function () {
                            i.register()
                        }, (m * 1000) - 3000);
                        if (l.params["temp-gruu"]) {
                            this.ua.contact.temp_gruu = l.params["temp-gruu"].replace(/"/g, "")
                        }
                        if (l.params["pub-gruu"]) {
                            this.ua.contact.pub_gruu = l.params["pub-gruu"].replace(/"/g, "")
                        }
                        this.registered = true;
                        this.ua.emit("registered", this.ua, {
                            response: n
                        });
                        break;
                    case /^423$/.test(n.status_code):
                        if (n.hasHeader("min-expires")) {
                            p = n.getHeader("min-expires");
                            m = (p - this.expires);
                            this.registrationTimer = e.setTimeout(function () {
                                i.register()
                            }, this.expires * 1000)
                        } else {
                            Plivo.logNull(h.c.LOG_REGISTRATOR + "423 response code received to a REGISTER without min-expires. Unregister");
                            this.registrationFailure(n, h.c.causes.SIP_FAILURE_CODE)
                        }
                        break;
                    default:
                        j = h.utils.sipErrorCause(n.status_code);
                        if (j) {
                            j = h.c.causes[j]
                        } else {
                            j = h.c.causes.SIP_FAILURE_CODE
                        }
                        this.registrationFailure(n, j)
                }
            };
            this.onRequestTimeout = function () {
                this.registrationFailure(null, h.c.causes.REQUEST_TIMEOUT)
            };
            this.onTransportError = function () {
                this.registrationFailure(null, h.c.causes.CONNECTION_ERROR)
            };
            k.send()
        },
        unregister: function (i) {
            if (!this.registered) {
                Plivo.logNull(h.c.LOG_REGISTRATOR + "Already unregistered");
                return
            }
            this.registered = false;
            this.ua.emit("unregistered");
            e.clearTimeout(this.registrationTimer);
            if (i) {
                this.request = new h.OutgoingRequest(h.c.REGISTER, this.registrar, this.ua, {
                    to_uri: this.from_uri,
                    call_id: this.call_id,
                    cseq: (this.cseq += 1)
                }, ["Contact: *", "Expires : 0"])
            } else {
                this.request = new h.OutgoingRequest(h.c.REGISTER, this.registrar, this.ua, {
                    to_uri: this.from_uri,
                    call_id: this.call_id,
                    cseq: (this.cseq += 1)
                }, ["Contact: " + this.contact + ";expires=0"])
            }
            var j = new h.RequestSender(this, this.ua);
            this.receiveResponse = function (k) {
                Plivo.logNull(h.c.LOG_REGISTRATOR + k.status_code + " " + k.reason_phrase + " received to unregister request")
            };
            this.onRequestTimeout = function () {
                Plivo.logNull(h.c.LOG_REGISTRATOR + "Request Timeout received for unregister request")
            };
            this.onTransportError = function () {
                Plivo.logNull(h.c.LOG_REGISTRATOR + "Transport Error received for unregister request")
            };
            j.send()
        },
        registrationFailure: function (i, j) {
            if (this.registered) {
                this.registered = false;
                this.ua.emit("unregistered", this.ua)
            }
            this.ua.emit("registrationFailed", this.ua, {
                response: i || null,
                cause: j
            })
        },
        onTransportClosed: function () {
            this.registered_before = this.registered;
            e.clearTimeout(this.registrationTimer);
            if (this.registered) {
                this.registered = false;
                this.ua.emit("unregistered", this.ua)
            }
        },
        onTransportConnected: function () {
            this.register()
        },
        close: function () {
            this.registered_before = this.registered;
            this.unregister()
        }
    };
    h.Session = function (j) {
        var i = ["connecting", "progress", "failed", "started", "ended"];
        this.ua = j;
        this.status = h.c.SESSION_NULL;
        this.dialog = null;
        this.earlyDialogs = [];
        this.mediaSession = null;
        this.ackTimer = null;
        this.expiresTimer = null;
        this.invite2xxTimer = null;
        this.userNoAnswerTimer = null;
        this.closeTimer = null;
        this.direction = null;
        this.local_identity = null;
        this.remote_identity = null;
        this.start_time = null;
        this.end_time = null;
        this.data = {};
        this.initEvents(i);
        if (j.contact.pub_gruu) {
            this.contact = j.contact.pub_gruu
        } else {
            this.contact = j.contact.uri
        }
    };
    h.Session.prototype = new h.EventEmitter();
    h.Session.prototype.init_incoming = function (i) {
        this.from_tag = i.from_tag;
        this.status = h.c.SESSION_INVITE_RECEIVED;
        this.id = i.call_id + this.from_tag;
        this.request = i;
        this.ua.sessions[this.id] = this;
        this.receiveInitialRequest(this.ua, i)
    };
    h.Session.prototype.connect = function (o, r) {
        var j, i, m, n, k, q, l, p;
        h.utils.checkUAStatus(this.ua);
        if (!h.utils.isWebRtcSupported()) {
            Plivo.logNull(h.c.LOG_UA + "rtcweb not supported.");
            throw new h.exceptions.WebRtcNotSupportedError()
        }
        if (this.status !== h.c.SESSION_NULL) {
            throw new h.exceptions.InvalidStateError()
        }
        r = r || {};
        n = r.views ? r.views.selfView : null;
        k = r.views ? r.views.remoteView : null;
        q = r.mediaType || {
            audio: true,
            video: true
        };
        l = r.extraHeaders || [];
        i = r.eventHandlers || {};
        for (j in i) {
            this.on(j, i[j])
        }
        o = h.utils.normalizeUri(o, this.ua.configuration.domain);
        if (!o) {
            throw new h.exceptions.InvalidTargetError()
        }
        this.from_tag = h.utils.newTag();
        this.status = h.c.SESSION_NULL;
        this.mediaSession = new h.MediaSession(this, n, k);
        this.anonymous = r.anonymous;
        this.isCanceled = false;
        this.received_100 = false;
        p = {
            from_tag: this.from_tag
        };
        if (r.anonymous) {
            if (this.ua.contact.temp_gruu) {
                this.contact = this.ua.contact.temp_gruu
            }
            p.from_display_name = "Anonymous";
            p.from_uri = "sip:anonymous@anonymous.invalid";
            l.push("P-Preferred-Identity: " + this.ua.configuration.from_uri);
            l.push("Privacy: id")
        }
        l.push("Contact: <" + this.contact + ";ob>");
        l.push("Allow: " + h.utils.getAllowedMethods(this.ua));
        l.push("Content-Type: application/sdp");
        m = new h.OutgoingRequest(h.c.INVITE, o, this.ua, p, l);
        this.id = m.headers["Call-ID"] + this.from_tag;
        this.request = m;
        this.ua.sessions[this.id] = this;
        this.newSession("local", m, o);
        this.connecting("local", m, o);
        this.sendInitialRequest(q)
    };
    h.Session.prototype.close = function (j, i, k) {
        if (this.status !== h.c.SESSION_TERMINATED) {
            var l = this;
            Plivo.logNull(h.c.LOG_INVITE_SESSION + "Closing Invite Session " + this.id);
            if (this.mediaSession) {
                this.mediaSession.close()
            }
            e.clearTimeout(this.ackTimer);
            e.clearTimeout(this.expiresTimer);
            e.clearTimeout(this.invite2xxTimer);
            e.clearTimeout(this.userNoAnswerTimer);
            this.terminateEarlyDialogs();
            this.terminateConfirmedDialog();
            this.status = h.c.SESSION_TERMINATED;
            this.closeTimer = e.setTimeout(function () {
                if (l && l.ua.sessions[l.id]) {
                    delete l.ua.sessions[l.id]
                }
            }, "5000")
        }
    };
    h.Session.prototype.createEarlyDialog = function (l, k) {
        var j, i = (k === "UAS") ? l.to_tag : l.from_tag,
            m = (k === "UAS") ? l.from_tag : l.to_tag,
            n = l.call_id + i + m;
        if (this.earlyDialogs[n]) {
            return true
        } else {
            j = new h.Dialog(this, l, k, h.c.DIALOG_EARLY);
            if (j.id) {
                this.earlyDialogs[n] = j;
                return true
            } else {
                return false
            }
        }
    };
    h.Session.prototype.createConfirmedDialog = function (l, k) {
        var j, i = (k === "UAS") ? l.to_tag : l.from_tag,
            m = (k === "UAS") ? l.from_tag : l.to_tag,
            n = l.call_id + i + m;
        j = this.earlyDialogs[n];
        if (j) {
            j.update(l, k);
            this.dialog = j;
            delete this.earlyDialogs[n];
            return true
        }
        j = new h.Dialog(this, l, k);
        if (j.id) {
            this.to_tag = l.to_tag;
            this.dialog = j;
            return true
        } else {
            return false
        }
    };
    h.Session.prototype.terminateConfirmedDialog = function () {
        if (this.dialog) {
            this.dialog.terminate();
            delete this.dialog
        }
    };
    h.Session.prototype.terminateEarlyDialogs = function () {
        var i;
        for (i in this.earlyDialogs) {
            this.earlyDialogs[i].terminate();
            delete this.earlyDialogs[i]
        }
    };
    h.Session.prototype.receiveRequest = function (i) {
        if (i.method === h.c.CANCEL) {
            i.reply(200);
            if (this.status === h.c.SESSION_WAITING_FOR_ANSWER) {
                this.status = h.c.SESSION_CANCELED;
                this.failed("remote", i, h.c.causes.CANCELED)
            }
        } else {
            switch (i.method) {
                case h.c.ACK:
                    if (this.status === h.c.SESSION_WAITING_FOR_ACK) {
                        e.clearTimeout(this.ackTimer);
                        e.clearTimeout(this.invite2xxTimer);
                        this.status = h.c.SESSION_CONFIRMED
                    }
                    break;
                case h.c.BYE:
                    if (this.status === h.c.SESSION_CONFIRMED) {
                        i.reply(200);
                        this.ended("remote", i, h.c.causes.BYE)
                    }
                    break;
                case h.c.INVITE:
                    if (this.status === h.c.SESSION_CONFIRMED) {
                        Plivo.logNull(h.c.LOG_INVITE_SESSION + "Re-INVITE received")
                    }
                    break
            }
        }
    };
    h.Session.prototype.receiveInitialRequest = function (k, l) {
        var i, n, j, m = this;
        if (l.hasHeader("expires")) {
            j = l.getHeader("expires") * 1000;
            this.expiresTimer = e.setTimeout(function () {
                m.expiresTimeout(l)
            }, j)
        }
        i = l.body;
        n = l.getHeader("Content-Type");
        if (i && (n === "application/sdp")) {
            l.to_tag = h.utils.newTag();
            if (!this.createEarlyDialog(l, "UAS")) {
                return
            }
            this.status = h.c.SESSION_WAITING_FOR_ANSWER;
            this.userNoAnswerTimer = e.setTimeout(function () {
                m.userNoAnswerTimeout(l)
            }, k.configuration.no_answer_timeout);
            this.answer = function (t, r) {
                var q, s, p, o;
                h.utils.checkUAStatus(this.ua);
                if (this.status !== h.c.SESSION_WAITING_FOR_ANSWER) {
                    throw new h.exceptions.InvalidStateError()
                }
                q = l.body;
                s = function () {
                    var u = m.mediaSession.peerConnection.localDescription.sdp;
                    if (!m.createConfirmedDialog(l, "UAS")) {
                        return
                    }
                    l.reply(200, null, ["Contact: <" + m.contact + ">"], u, function () {
                        m.status = h.c.SESSION_WAITING_FOR_ACK;
                        m.invite2xxTimer = e.setTimeout(function () {
                            m.invite2xxRetransmission(1, l, u)
                        }, h.Timers.T1);
                        e.clearTimeout(m.userNoAnswerTimer);
                        m.ackTimer = e.setTimeout(function () {
                            m.ackTimeout()
                        }, h.Timers.TIMER_H);
                        m.started("local")
                    }, function () {
                        m.failed("system", null, h.c.causes.CONNECTION_ERROR)
                    })
                };
                p = function (u) {
                    l.reply(486);
                    m.failed("local", null, h.c.causes.USER_DENIED_MEDIA_ACCESS)
                };
                o = function (u) {
                    Plivo.logNull(h.c.LOG_SERVER_INVITE_SESSION + "PeerConnection Creation Failed: --" + u + "--");
                    l.reply(488);
                    m.failed("remote", l, h.c.causes.BAD_MEDIA_DESCRIPTION)
                };
                m.mediaSession = new h.MediaSession(m, t, r);
                m.mediaSession.startCallee(s, p, o, q)
            };
            this.newSession("remote", l);
            if (this.status !== h.c.SESSION_TERMINATED) {
                this.progress("local");
                l.reply(180, null, ["Contact: <" + this.contact + ">"])
            }
        } else {
            l.reply(415)
        }
    };
    h.Session.prototype.receiveResponse = function (i) {
        var k, j, l = this;
        if (this.isCanceled) {
            if (i.status_code >= 100 && i.status_code < 200) {
                this.request.cancel(this.cancelReason)
            } else {
                if (i.status_code >= 200 && i.status_code < 299) {
                    this.acceptAndTerminate(i)
                }
            }
            return
        }
        switch (true) {
            case /^100$/.test(i.status_code):
                this.received_100 = true;
                break;
            case /^1[0-9]{2}$/.test(i.status_code):
                if (!i.to_tag) {
                    break
                }
                if (i.body) {
                    j = "1xx_answer"
                } else {
                    j = "1xx"
                }
                break;
            case /^2[0-9]{2}$/.test(i.status_code):
                if (i.body) {
                    j = "2xx_answer"
                } else {
                    j = "2xx"
                }
                break;
            default:
                j = "failure"
        }
        if (this.status === h.c.SESSION_INVITE_SENT || this.status === h.c.SESSION_1XX_RECEIVED) {
            switch (j) {
                case 100:
                    this.received_100 = true;
                    break;
                case "1xx":
                case "1xx_answer":
                    if (this.createEarlyDialog(i, "UAC")) {
                        this.status = h.c.SESSION_1XX_RECEIVED;
                        this.progress("remote", i)
                    }
                    break;
                case "2xx":
                    if (this.dialog) {
                        if (i.to_tag === this.to_tag) {
                            Plivo.logNull(h.c.LOG_CLIENT_INVITE_SESSION + "2xx retransmission received")
                        } else {
                            Plivo.logNull(h.c.LOG_CLIENT_INVITE_SESSION + "2xx received from an endpoint not establishing the dialog")
                        }
                        return
                    }
                    this.acceptAndTerminate(i, 'SIP ;cause=400 ;text= "Missing session description"');
                    this.failed("remote", i, h.c.causes.BAD_MEDIA_DESCRIPTION);
                    break;
                case "2xx_answer":
                    if (this.dialog) {
                        if (i.to_tag === this.to_tag) {
                            Plivo.logNull(h.c.LOG_CLIENT_INVITE_SESSION + "2xx_answer retransmission received")
                        } else {
                            Plivo.logNull(h.c.LOG_CLIENT_INVITE_SESSION + "2xx_answer received from an endpoint not establishing the dialog")
                        }
                        return
                    }
                    this.mediaSession.onMessage("answer", i.body, function () {
                        if (l.createConfirmedDialog(i, "UAC")) {
                            Plivo.logNull("SDP Answer fits with Offer. MediaSession will start.");
                            l.sendACK();
                            l.status = h.c.SESSION_CONFIRMED;
                            l.started("remote", i)
                        }
                    }, function (m) {
                        console.warn(m);
                        l.acceptAndTerminate(i, 'SIP ;cause=488 ;text="Not Acceptable Here"');
                        l.failed("remote", i, h.c.causes.BAD_MEDIA_DESCRIPTION)
                    });
                    break;
                case "failure":
                    k = h.utils.sipErrorCause(i.status_code);
                    if (k) {
                        k = h.c.causes[k]
                    } else {
                        k = h.c.causes.SIP_FAILURE_CODE
                    }
                    this.failed("remote", i, k);
                    break
            }
        }
    };
    h.Session.prototype.ackTimeout = function () {
        if (this.status === h.c.SESSION_WAITING_FOR_ACK) {
            Plivo.logNull(h.c.LOG_INVITE_SESSION + "No ACK received. Call will be terminated");
            e.clearTimeout(this.invite2xxTimer);
            this.sendBye();
            this.ended("remote", null, h.c.causes.NO_ACK)
        }
    };
    h.Session.prototype.expiresTimeout = function (i) {
        if (this.status === h.c.SESSION_WAITING_FOR_ANSWER) {
            i.reply(487);
            this.failed("system", null, h.c.causes.EXPIRES)
        }
    };
    h.Session.prototype.invite2xxRetransmission = function (k, j, i) {
        var l, m = this;
        l = h.Timers.T1 * (Math.pow(2, k));
        if ((k * h.Timers.T1) <= h.Timers.T2) {
            k += 1;
            j.reply(200, null, ["Contact: <" + this.contact + ">"], i);
            this.invite2xxTimer = e.setTimeout(function () {
                m.invite2xxRetransmission(k, j, i)
            }, l)
        } else {
            e.clearTimeout(this.invite2xxTimer)
        }
    };
    h.Session.prototype.userNoAnswerTimeout = function (i) {
        i.reply(408);
        this.failed("local", null, h.c.causes.NO_ANSWER)
    };
    h.Session.prototype.acceptAndTerminate = function (i, j) {
        if (this.dialog || this.createConfirmedDialog(i, "UAC")) {
            this.sendACK();
            this.sendBye(j)
        }
    };
    h.Session.prototype.sendACK = function () {
        var i = this.dialog.createRequest(h.c.ACK);
        this.sendRequest(i)
    };
    h.Session.prototype.sendBye = function (j) {
        var k = (j) ? ["Reason: " + j] : [],
            i = this.dialog.createRequest(h.c.BYE, k);
        this.sendRequest(i)
    };
    h.Session.prototype.sendRequest = function (j, i) {
        var k;
        i = i || function () {};
        k = new h.Session.RequestSender(this, j, i);
        k.send()
    };
    h.Session.prototype.onTransportError = function () {
        if (this.status !== h.c.SESSION_TERMINATED) {
            if (this.status === h.c.SESSION_CONFIRMED) {
                this.ended("system", null, h.c.causes.CONNECTION_ERROR)
            } else {
                this.failed("system", null, h.c.causes.CONNECTION_ERROR)
            }
        }
    };
    h.Session.prototype.onRequestTimeout = function () {
        if (this.status !== h.c.SESSION_TERMINATED) {
            if (this.status === h.c.SESSION_CONFIRMED) {
                this.ended("system", null, h.c.causes.REQUEST_TIMEOUT)
            } else {
                this.failed("system", null, h.c.causes.CONNECTION_ERROR)
            }
        }
    };
    h.Session.prototype.newSession = function (m, i, l) {
        var k = this,
            j = "newSession";
        k.direction = (m === "local") ? "outgoing" : "incoming";
        if (m === "remote") {
            k.local_identity = i.s("to").uri;
            k.remote_identity = i.s("from").uri
        } else {
            if (m === "local") {
                k.local_identity = k.ua.configuration.user;
                k.remote_identity = l
            }
        }
        k.ua.emit(j, k.ua, {
            originator: m,
            session: k,
            request: i
        })
    };
    h.Session.prototype.connecting = function (l, i) {
        var k = this,
            j = "connecting";
        k.emit(j, k, {
            originator: "local",
            request: i
        })
    };
    h.Session.prototype.progress = function (l, i) {
        var k = this,
            j = "progress";
        k.emit(j, k, {
            originator: l,
            response: i || null
        })
    };
    h.Session.prototype.started = function (l, i) {
        var k = this,
            j = "started";
        k.start_time = new Date();
        k.emit(j, k, {
            response: i || null
        })
    };
    h.Session.prototype.ended = function (m, i, j) {
        var l = this,
            k = "ended";
        l.end_time = new Date();
        l.close();
        l.emit(k, l, {
            originator: m,
            message: i || null,
            cause: j
        })
    };
    h.Session.prototype.failed = function (m, i, j) {
        var l = this,
            k = "failed";
        l.close();
        l.emit(k, l, {
            originator: m,
            response: i,
            cause: j
        })
    };
    h.Session.prototype.terminate = function () {
        h.utils.checkUAStatus(this.ua);
        if (this.status === h.c.SESSION_TERMINATED) {
            throw new h.exceptions.InvalidStateError()
        }
        switch (this.status) {
            case h.c.SESSION_NULL:
            case h.c.SESSION_INVITE_SENT:
            case h.c.SESSION_1XX_RECEIVED:
                this.cancel();
                break;
            case h.c.SESSION_WAITING_FOR_ANSWER:
                this.reject();
                break;
            case h.c.SESSION_WAITING_FOR_ACK:
            case h.c.SESSION_CONFIRMED:
                this.sendBye();
                this.ended("local", null, h.c.causes.BYE);
                break
        }
        this.close()
    };
    h.Session.prototype.reject = function (j, i) {
        if (this.direction !== "incoming") {
            throw new h.exceptions.InvalidMethodError()
        } else {
            if (this.status !== h.c.SESSION_WAITING_FOR_ANSWER) {
                throw new h.exceptions.InvalidStateError()
            }
        }
        if (j) {
            if ((j < 300 || j >= 700)) {
                throw new h.exceptions.InvalidValueError()
            } else {
                this.request.reply(j, i)
            }
        } else {
            this.request.reply(480)
        }
        this.failed("local", null, h.c.causes.REJECTED)
    };
    h.Session.prototype.cancel = function (i) {
        if (this.direction !== "outgoing") {
            throw new h.exceptions.InvalidMethodError()
        }
        if (this.status === h.c.SESSION_NULL) {
            this.isCanceled = true;
            this.cancelReason = i
        } else {
            if (this.status === h.c.SESSION_INVITE_SENT) {
                if (this.received_100) {
                    this.request.cancel(i)
                } else {
                    this.isCanceled = true;
                    this.cancelReason = i
                }
            } else {
                if (this.status === h.c.SESSION_1XX_RECEIVED) {
                    this.request.cancel(i)
                } else {
                    throw new h.exceptions.InvalidStateError()
                }
            }
        }
        this.failed("local", null, h.c.causes.CANCELED)
    };
    h.Session.prototype.sendInitialRequest = function (j) {
        var k = this,
            m = new h.RequestSender(k, this.ua);

        function i() {
            if (k.isCanceled || k.status === h.c.SESSION_TERMINATED) {
                k.mediaSession.close();
                return
            }
            k.request.body = k.mediaSession.peerConnection.localDescription.sdp;
            if (!j.video) {
                if (k.request.body.indexOf("m=video") !== -1) {
                    k.request.body = k.request.body.substring(0, k.request.body.indexOf("m=video"))
                }
            }
            if (1) {
                var p = /.*crypto:[0-9].*(\r\n|\n|\r)/g;
                var n = /.*AES_CM_128_HMAC_SHA1_80.*/g;
                var o = k.request.body.match(p);
                k.request.body = k.request.body.replace(p, "");
                o.forEach(function (r, q, s) {
                    if (n.test(r)) {
                        k.request.body += r
                    }
                })
            }
            k.status = h.c.SESSION_INVITE_SENT;
            m.send()
        }
        function l(n) {
            if (k.status !== h.c.SESSION_TERMINATED) {
                Plivo.logNull(h.c.LOG_CLIENT_INVITE_SESSION + "Media Access denied");
                k.failed("local", null, h.c.causes.USER_DENIED_MEDIA_ACCESS)
            }
        }
        k.mediaSession.startCaller(j, i, l)
    };
    h.Session.RequestSender = function (k, j, i) {
        this.session = k;
        this.request = j;
        this.onReceiveResponse = i;
        this.reattempt = false;
        this.reatemptTimer = null;
        this.request_sender = new h.InDialogRequestSender(this)
    };
    h.Session.RequestSender.prototype = {
        receiveResponse: function (j) {
            var i = this,
                k = j.status_code;
            if (this.session.status !== h.c.SESSION_TERMINATED) {
                if (j.method === h.c.INVITE && k === 491 && !this.reattempt) {
                    this.request.cseq.value = this.request.dialog.local_seqnum += 1;
                    this.reatemptTimer = e.setTimeout(function () {
                        i.reattempt = true;
                        i.request_sender.send()
                    }, this.getReattemptTimeout())
                } else {
                    this.onReceiveResponse.call(this.session, j)
                }
            }
        },
        send: function () {
            this.request_sender.send()
        },
        getReattemptTimeout: function () {
            if (this.session.direction === "outgoing") {
                return (Math.random() * (4 - 2.1) + 2.1).toFixed(2)
            } else {
                return (Math.random() * 2).toFixed(2)
            }
        }
    };
    h.Session.prototype.dtmf = function (k) {
        var j = [];
        var i;
        j.push("Content-Type: application/dtmf-relay");
        j.push("Contact: <" + this.contact + ";ob>");
        i = this.dialog.createRequest(h.c.INFO, j);
        i.body = "Signal=" + k + "\r\nDuration=120";
        this.sendRequest(i)
    };
    h.MediaSession = function (j, k, i) {
        this.session = j;
        this.selfView = k || null;
        this.remoteView = i || null;
        this.localMedia = null;
        this.peerConnection = null
    };
    h.MediaSession.prototype = {
        startCaller: function (i, n, l) {
            var k = this;

            function m(o) {
                k.start(n);
                k.peerConnection.addStream(o);
                k.peerConnection.createOffer(function (p) {
                    k.peerConnection.setLocalDescription(p)
                })
            }
            function j(o) {
                l(o)
            }
            this.getUserMedia(i, m, j)
        },
        startCallee: function (o, n, j, i) {
            var l = this;

            function m(p) {
                l.start(o);
                l.peerConnection.addStream(p);
                l.peerConnection.setRemoteDescription(new e.RTCSessionDescription({
                    type: "offer",
                    sdp: i
                }), function () {
                    l.peerConnection.createAnswer(function (q) {
                        l.peerConnection.setLocalDescription(q)
                    }, j)
                }, j)
            }
            function k(p) {
                n(p)
            }
            l.getUserMedia({
                audio: true,
                video: true
            }, m, k)
        },
        start: function (n) {
            var l = this,
                j = false,
                i = this.session.ua.configuration.stun_server,
                k = this.session.ua.configuration.turn_uri,
                m = this.session.ua.configuration.turn_password,
                o = [{
                    url: i
                }];
            if (k) {
                o.push({
                    url: k,
                    credential: m
                })
            }
            this.peerConnection = new webkitRTCPeerConnection({
                iceServers: o
            });
            this.peerConnection.onicecandidate = function (p) {
                if (p.candidate) {
                    Plivo.logNull(h.c.LOG_MEDIA_SESSION + "ICE candidate received: " + p.candidate.candidate)
                } else {
                    console.info(h.c.LOG_MEDIA_SESSION + "No more ICE candidate");
                    Plivo.logNull(h.c.LOG_MEDIA_SESSION + "Peerconnection status: " + this.readyState);
                    Plivo.logNull(h.c.LOG_MEDIA_SESSION + "Ice Status: " + this.iceState);
                    if (!j) {
                        j = true;
                        n()
                    }
                }
            };
            this.peerConnection.onopen = function () {
                Plivo.logNull(h.c.LOG_MEDIA_SESSION + "Media session opened")
            };
            this.peerConnection.onaddstream = function (p) {
                console.warn("stream added");
                if (l.remoteView && this.remoteStreams.length > 0) {
                    l.remoteView.src = webkitURL.createObjectURL(p.stream)
                }
            };
            this.peerConnection.onremovestream = function (p) {
                Plivo.logNull(h.c.LOG_MEDIA_SESSION + "Stream removed: " + p)
            };
            this.peerConnection.onstatechange = function () {
                console.warn("Status changed to: " + this.readyState);
                console.warn("ICE state is: " + this.iceState)
            }
        },
        close: function () {
            Plivo.logNull(h.c.LOG_MEDIA_SESSION + "Closing peerConnection");
            if (this.peerConnection) {
                this.peerConnection.close();
                if (this.localMedia) {}
            }
        },
        getUserMedia: function (i, m, l) {
            var j = this;

            function n(o) {
                Plivo.logNull(h.c.LOG_MEDIA_SESSION + "Got stream " + o);
                j.localMedia = o;
                e.storedStream = o;
                if (j.selfView) {
                    j.selfView.src = webkitURL.createObjectURL(o)
                }
                m(o)
            }
            function k(o) {
                l(o)
            }
            if (e.storedStream) {
                Plivo.logNull("use storedStream");
                n(e.storedStream)
            } else {
                Plivo.logNull(h.c.LOG_MEDIA_SESSION + "Requesting access to local media.");
                navigator.webkitGetUserMedia(i, n, k)
            }
        },
        onMessage: function (k, i, l, j) {
            if (k === "offer") {
                Plivo.logNull(h.c.LOG_MEDIA_SESSION + "re-Invite received")
            } else {
                if (k === "answer") {
                    this.peerConnection.setRemoteDescription(new e.RTCSessionDescription({
                        type: "answer",
                        sdp: i
                    }), l, j)
                }
            }
        }
    };
    h.Message = function (i) {
        this.ua = i;
        this.direction = null;
        this.local_identity = null;
        this.remote_identity = null
    };
    h.Message.prototype = new h.EventEmitter();
    h.Message.prototype.send = function (m, l, o, q) {
        var n, j, i, k, p = ["sending", "succeeded", "failed"];
        h.utils.checkUAStatus(this.ua);
        this.initEvents(p);
        q = q || {};
        k = q.extraHeaders || [];
        i = q.eventHandlers || {};
        for (j in i) {
            this.on(j, i[j])
        }
        m = h.utils.normalizeUri(m, this.ua.configuration.domain);
        if (!m) {
            throw new h.exceptions.InvalidTargetError()
        }
        this.direction = "outgoing";
        this.local_identity = this.ua.configuration.user;
        this.remote_identity = m;
        this.closed = false;
        this.ua.applicants[this] = this;
        k.push("Content-Type: " + (o ? o : "text/plain"));
        this.request = new h.OutgoingRequest(h.c.MESSAGE, m, this.ua, null, k);
        if (l) {
            this.request.body = l
        }
        n = new h.RequestSender(this, this.ua);
        this.ua.emit("newMessage", this.ua, {
            originator: "local",
            message: this,
            request: this.request
        });
        this.emit("sending", this, {
            originator: "local",
            request: this.request
        });
        n.send()
    };
    h.Message.prototype.receiveResponse = function (i) {
        var j;
        if (this.closed) {
            return
        }
        switch (true) {
            case /^1[0-9]{2}$/.test(i.status_code):
                break;
            case /^2[0-9]{2}$/.test(i.status_code):
                delete this.ua.applicants[this];
                this.emit("succeeded", this, {
                    originator: "remote",
                    response: i
                });
                break;
            default:
                delete this.ua.applicants[this];
                j = h.utils.sipErrorCause(i.status_code);
                if (j) {
                    j = h.c.causes[j]
                } else {
                    j = h.c.causes.SIP_FAILURE_CODE
                }
                this.emit("failed", this, {
                    originator: "remote",
                    response: i,
                    cause: j
                });
                break
        }
    };
    h.Message.prototype.onRequestTimeout = function () {
        if (this.closed) {
            return
        }
        this.emit("failed", this, {
            originator: "system",
            cause: h.c.causes.REQUEST_TIMEOUT
        })
    };
    h.Message.prototype.onTransportError = function () {
        if (this.closed) {
            return
        }
        this.emit("failed", this, {
            originator: "system",
            cause: h.c.causes.CONNECTION_ERROR
        })
    };
    h.Message.prototype.close = function () {
        this.closed = true;
        delete this.ua.applicants[this]
    };
    h.Message.prototype.init_incoming = function (i) {
        var j, k = i.getHeader("content-type");
        this.direction = "incoming";
        this.request = i;
        this.local_identity = i.s("to").uri;
        this.remote_identity = i.s("from").uri;
        if (k && (k.match(/^text\/plain(\s*;\s*.+)*$/i) || k.match(/^text\/html(\s*;\s*.+)*$/i))) {
            this.ua.emit("newMessage", this.ua, {
                originator: "remote",
                message: this,
                request: i
            });
            j = this.ua.transactions.nist[i.via_branch];
            if (j && (j.state === h.c.TRANSACTION_TRYING || j.state === h.c.TRANSACTION_PROCEEDING)) {
                i.reply(200)
            }
        } else {
            i.reply(415, null, ["Accept: text/plain, text/html"])
        }
    };
    h.Message.prototype.accept = function () {
        if (this.direction !== "incoming") {
            throw new h.exceptions.InvalidMethodError()
        }
        this.request.reply(200)
    };
    h.Message.prototype.reject = function (j, i) {
        if (this.direction !== "incoming") {
            throw new h.exceptions.InvalidMethodError()
        }
        if (j) {
            if ((j < 300 || j >= 700)) {
                throw new h.exceptions.InvalidValueError()
            } else {
                this.request.reply(j, i)
            }
        } else {
            this.request.reply(480)
        }
    };
    h.UA = function (j) {
        var i = ["connected", "disconnected", "registered", "unregistered", "registrationFailed", "newSession", "newMessage"];
        this.cache = {
            credentials: {}
        };
        this.configuration = {};
        this.dialogs = {};
        this.registrator = null;
        this.applicants = {};
        this.sessions = {};
        this.transport = null;
        this.contact = {};
        this.status = h.c.UA_STATUS_INIT;
        this.error = null;
        this.transactions = {
            nist: {},
            nict: {},
            ist: {},
            ict: {}
        };
        this.transportRecoverAttempts = 0;
        if (!j || !this.loadConfig(j)) {
            this.status = h.c.UA_STATUS_NOT_READY;
            this.error = h.c.UA_CONFIGURATION_ERROR;
            throw new h.exceptions.ConfigurationError()
        } else {
            this.initEvents(i)
        }
    };
    h.UA.prototype = new h.EventEmitter();
    h.UA.prototype.register = function () {
        if (this.status === h.c.UA_STATUS_READY) {
            this.configuration.register = true;
            this.registrator.register()
        } else {
            throw new h.exceptions.NotReadyError()
        }
    };
    h.UA.prototype.unregister = function (i) {
        if (this.status === h.c.UA_STATUS_READY) {
            this.configuration.register = false;
            this.registrator.unregister(i)
        } else {
            throw new h.exceptions.NotReadyError()
        }
    };
    h.UA.prototype.isRegistered = function () {
        if (this.registrator && this.registrator.registered) {
            return true
        } else {
            return false
        }
    };
    h.UA.prototype.isConnected = function () {
        if (this.transport) {
            return this.transport.connected
        } else {
            return false
        }
    };
    h.UA.prototype.call = function (o, l, k, n, j, p) {
        var m, i;
        i = {
            views: j,
            mediaType: {
                audio: l,
                video: k
            },
            extraHeaders: p,
            eventHandlers: n
        };
        m = new h.Session(this);
        m.connect(o, i)
    };
    h.UA.prototype.sendMessage = function (m, i, n, l) {
        var k, j;
        j = {
            eventHandlers: l
        };
        k = new h.Message(this);
        k.send(m, i, n, j)
    };
    h.UA.prototype.stop = function () {
        var k, j, i = this;
        if (this.status !== h.c.UA_STATUS_READY) {
            throw new h.exceptions.NotReadyError()
        }
        Plivo.logNull(h.c.LOG_UA + "User requested closure.");
        if (this.registrator) {
            Plivo.logNull(h.c.LOG_UA + "Closing registrator");
            this.registrator.close()
        }
        for (k in this.sessions) {
            Plivo.logNull(h.c.LOG_UA + "Closing session" + k);
            this.sessions[k].terminate()
        }
        for (j in this.applicants) {
            this.applicants[j].close()
        }
        this.status = h.c.UA_STATUS_USER_CLOSED;
        this.shutdownGraceTimer = e.setTimeout(function () {
            i.transport.disconnect()
        }, "5000")
    };
    h.UA.prototype.start = function () {
        var i;
        if (this.status === h.c.UA_STATUS_INIT) {
            i = this.getNextWsServer();
            new h.Transport(this, i)
        } else {
            if (this.status === h.c.UA_STATUS_USER_CLOSED) {
                Plivo.logNull(h.c.LOG_UA + "Resuming..");
                this.status = h.c.UA_STATUS_READY;
                this.transport.connect()
            } else {
                if (this.status === h.c.UA_STATUS_READY) {
                    Plivo.logNull(h.c.LOG_UA + "UA is in ready status. Not resuming")
                } else {
                    throw new h.exceptions.NotReadyError()
                }
            }
        }
    };
    h.UA.prototype.saveCredentials = function (i) {
        this.cache.credentials[i.realm] = this.cache.credentials[i.realm] || {};
        this.cache.credentials[i.realm][i.uri] = i
    };
    h.UA.prototype.getCredentials = function (k) {
        var i, j;
        i = h.grammar.parse(k.headers.To.toString(), "To").host;
        if (this.cache.credentials[i] && this.cache.credentials[i][k.ruri]) {
            j = this.cache.credentials[i][k.ruri];
            j.method = k.method
        }
        return j
    };
    h.UA.prototype.onTransportClosed = function (l) {
        var j, i, k = ["nict", "ict", "nist", "ist"];
        l.server.status = h.c.WS_SERVER_DISCONNECTED;
        Plivo.logNull(h.c.LOG_UA + "connection status set to: " + h.c.WS_SERVER_DISCONNECTED);
        for (j in k) {
            for (i in this.transactions[k[j]]) {
                this.transactions[k[j]][i].onTransportError()
            }
        }
        if (!this.contact.pub_gruu) {
            this.closeSessionsOnTransportError()
        }
    };
    h.UA.prototype.onTransportError = function (j) {
        var i;
        Plivo.logNull(h.c.LOG_UA + "Transport " + j.server.ws_uri + " failed");
        j.server.status = h.c.WS_SERVER_ERROR;
        Plivo.logNull(h.c.LOG_UA + "connection status set to: " + h.c.WS_SERVER_ERROR);
        i = this.getNextWsServer();
        if (i) {
            new h.Transport(this, i)
        } else {
            this.closeSessionsOnTransportError();
            if (!this.error || this.error !== h.c.UA_NETWORK_ERROR) {
                this.status = h.c.UA_STATUS_NOT_READY;
                this.error = h.c.UA_NETWORK_ERROR;
                this.emit("disconnected")
            }
            this.recoverTransport()
        }
    };
    h.UA.prototype.onTransportConnected = function (i) {
        this.transport = i;
        this.transportRecoverAttempts = 0;
        i.server.status = h.c.WS_SERVER_READY;
        Plivo.logNull(h.c.LOG_UA + "connection status set to: " + h.c.WS_SERVER_READY);
        if (this.status === h.c.UA_STATUS_USER_CLOSED) {
            return
        }
        this.status = h.c.UA_STATUS_READY;
        this.error = null;
        this.emit("connected", this);
        if (this.configuration.register) {
            if (this.registrator) {
                this.registrator.onTransportConnected()
            } else {
                this.registrator = new h.Registrator(this, i)
            }
        }
    };
    h.UA.prototype.receiveRequest = function (k) {
        var i, l, j, m = k.method;
        if (k.ruri.user !== this.configuration.user) {
            Plivo.logNull(h.c.LOG_UA + "Request URI does not point to us");
            k.reply_sl(404);
            return
        }
        if (h.Transactions.checkTransaction(this, k)) {
            return
        }
        if (m === h.c.INVITE) {
            new h.Transactions.InviteServerTransaction(k, this)
        } else {
            if (m !== h.c.ACK) {
                new h.Transactions.NonInviteServerTransaction(k, this)
            }
        }
        if (m === h.c.OPTIONS) {
            k.reply(200, null, ["Allow: " + h.utils.getAllowedMethods(this), "Accept: " + h.c.ACCEPTED_BODY_TYPES])
        } else {
            if (m === h.c.MESSAGE) {
                if (!this.checkEvent("newMessage") || this.listeners("newMessage").length === 0) {
                    k.reply(405, null, ["Allow: " + h.utils.getAllowedMethods(this)]);
                    return
                }
                j = new h.Message(this);
                j.init_incoming(k)
            }
        }
        if (!k.to_tag) {
            if (!this.isRegistered()) {
                k.reply(410);
                return
            }
            switch (m) {
                case h.c.INVITE:
                    if (!h.utils.isWebRtcSupported()) {
                        console.warn(h.c.LOG_UA + "Call invitation received but rtcweb is not supported")
                    } else {
                        l = new h.Session(this);
                        l.init_incoming(k)
                    }
                    break;
                case h.c.BYE:
                    k.reply(481);
                    break;
                case h.c.CANCEL:
                    l = this.findSession(k);
                    if (l) {
                        l.receiveRequest(k)
                    } else {
                        console.warn(h.c.LOG_UA + "Received CANCEL request for a non existent session")
                    }
                    break;
                case h.c.ACK:
                    break;
                default:
                    k.reply(405);
                    break
            }
        } else {
            i = this.findDialog(k);
            if (i) {
                i.receiveRequest(k)
            } else {
                if (m === h.c.NOTIFY) {
                    l = this.findSession(k);
                    if (l) {
                        l.receiveRequest(k)
                    } else {
                        console.warn(h.c.LOG_UA + "Received a NOTIFY request for a non existent session");
                        k.reply(481, "Subscription does not exist")
                    }
                } else {
                    if (m !== h.c.ACK) {
                        k.reply(481)
                    }
                }
            }
        }
    };
    h.UA.prototype.findSession = function (k) {
        var m = k.call_id + k.from_tag,
            j = this.sessions[m],
            l = k.call_id + k.to_tag,
            i = this.sessions[l];
        if (j) {
            return j
        } else {
            if (i) {
                return i
            } else {
                return null
            }
        }
    };
    h.UA.prototype.findDialog = function (j) {
        var k = j.call_id + j.from_tag + j.to_tag,
            i = this.dialogs[k];
        if (i) {
            Plivo.logNull(h.c.LOG_UA + "dialogs", "dialog found");
            return i
        } else {
            k = j.call_id + j.to_tag + j.from_tag;
            i = this.dialogs[k];
            if (i) {
                Plivo.logNull(h.c.LOG_UA + "dialogs", "dialog found");
                return i
            } else {
                Plivo.logNull(h.c.LOG_UA + "dialogs", "No dialog found");
                return null
            }
        }
    };
    h.UA.prototype.getNextWsServer = function () {
        var j, i, k = [];
        for (j in this.configuration.outbound_proxy_set) {
            i = this.configuration.outbound_proxy_set[j];
            if (i.status === 2) {
                continue
            } else {
                if (k.length === 0) {
                    k.push(i)
                } else {
                    if (i.weight > k[0].weight) {
                        k = [];
                        k.push(i)
                    } else {
                        if (i.weight === k[0].weight) {
                            k.push(i)
                        }
                    }
                }
            }
        }
        j = Math.floor((Math.random() * k.length));
        return k[j]
    };
    h.UA.prototype.closeSessionsOnTransportError = function () {
        var i;
        for (i in this.sessions) {
            this.sessions[i].onTransportError()
        }
        if (this.registrator) {
            this.registrator.onTransportClosed()
        }
    };
    h.UA.prototype.recoverTransport = function (l) {
        var i, j, o, m, n;
        l = l || this;
        m = l.transportRecoverAttempts;
        for (i in l.configuration.outbound_proxy_set) {
            l.configuration.outbound_proxy_set[i].status = 0
        }
        n = l.getNextWsServer();
        j = Math.floor((Math.random() * Math.pow(2, m)) + 1);
        o = j * l.configuration.connection_recovery_min_interval;
        if (o > l.configuration.connection_recovery_max_interval) {
            Plivo.logNull(h.c.LOG_UA + "Time for next connection attempt exceeds connection_recovery_max_interval. Resetting counter");
            o = l.configuration.connection_recovery_min_interval;
            m = 0
        }
        Plivo.logNull(h.c.LOG_UA + "Next connection attempt in: " + o + " seconds");
        e.setTimeout(function () {
            l.transportRecoverAttempts = m + 1;
            new h.Transport(l, n)
        }, o * 1000)
    };
    h.UA.prototype.loadConfig = function (p) {
        var o, m, j, l, n, i, k = {
            via_host: Math.random().toString(36).substr(2, 12) + ".invalid",
            password: null,
            register_expires: 600,
            register_min_expires: 120,
            register: true,
            ws_server_max_reconnection: 3,
            ws_server_reconnection_timeout: 4,
            connection_recovery_min_interval: 2,
            connection_recovery_max_interval: 30,
            use_preloaded_route: false,
            no_answer_timeout: 60,
            stun_server: "stun:stun.l.google.com:19302",
            trace_sip: false,
            hack_via_tcp: false,
            hack_ip_in_contact: false
        };
        if (typeof p.outbound_proxy_set === "string") {
            p.outbound_proxy_set = [{
                ws_uri: p.outbound_proxy_set
            }]
        } else {
            if (p.outbound_proxy_set instanceof Array) {
                for (j in p.outbound_proxy_set) {
                    if (typeof p.outbound_proxy_set[j] === "string") {
                        p.outbound_proxy_set[j] = {
                            ws_uri: p.outbound_proxy_set[j]
                        }
                    }
                }
            }
        }
        for (o in h.UA.configuration_check.mandatory) {
            if (!p.hasOwnProperty(o)) {
                console.error("Missing config parameter: " + o);
                return false
            } else {
                if (h.UA.configuration_check.mandatory[o](p[o])) {
                    k[o] = p[o]
                } else {
                    console.error("Bad configuration parameter: " + o);
                    return false
                }
            }
        }
        for (o in h.UA.configuration_check.optional) {
            if (p.hasOwnProperty(o)) {
                if (h.UA.configuration_check.optional[o](p[o])) {
                    k[o] = p[o]
                } else {
                    console.error("Bad configuration parameter: " + o);
                    return false
                }
            }
        }
        if (k.connection_recovery_max_interval < k.connection_recovery_min_interval) {
            console.error('"connection_recovery_max_interval" parameter is lower than "connection_recovery_min_interval"');
            return false
        }
        if (k.turn_server) {
            if (!k.turn_username || !k.turn_password) {
                console.error("TURN username and password must be specified");
                return false
            }
        }
        k.instance_id = h.utils.newUUID();
        k.websdk_id = Math.random().toString(36).substr(2, 5);
        l = h.grammar.parse(k.uri, "lazy_uri");
        k.user = l.user;
        k.domain = l.host;
        if (!k.authorization_user) {
            k.authorization_user = k.user
        }
        k.from_uri = (l.scheme ? "" : "sip:") + k.uri;
        k.no_answer_timeout = k.no_answer_timeout * 1000;
        if (k.hack_ip_in_contact) {
            k.via_host = h.utils.getRandomIP()
        }
        for (j in p.outbound_proxy_set) {
            n = h.grammar.parse(k.outbound_proxy_set[j].ws_uri, "absoluteURI");
            k.outbound_proxy_set[j].sip_uri = "<sip:" + n.host + (n.port ? ":" + n.port : "") + ";transport=ws;lr>";
            if (!k.outbound_proxy_set[j].weight) {
                k.outbound_proxy_set[j].weight = 0
            }
            k.outbound_proxy_set[j].status = 0;
            k.outbound_proxy_set[j].scheme = n.scheme.toUpperCase()
        }
        if (k.turn_server) {
            l = h.grammar.parse(k.turn_server, "turn_URI");
            k.turn_uri = l.scheme + ":";
            k.turn_uri += k.turn_username + "@";
            k.turn_uri += k.turn_server.substr(l.scheme.length + 1)
        }
        i = {
            uri: {
                value: "sip:" + l.user + "@" + k.via_host + ";transport=ws",
                writable: false,
                configurable: false
            }
        };
        Object.defineProperties(this.contact, i);
        for (m in k) {
            h.UA.configuration_skeleton[m].value = k[m]
        }
        Object.defineProperties(this.configuration, h.UA.configuration_skeleton);
        for (m in k) {
            h.UA.configuration_skeleton[m].value = ""
        }
        return true
    };
    h.UA.configuration_skeleton = (function () {
        var i, l, k = {}, j = ["instance_id", "websdk_id", "ws_server_max_reconnection", "ws_server_reconnection_timeout", "connection_recovery_min_interval", "connection_recovery_max_interval", "use_preloaded_route", "register_min_expires", "outbound_proxy_set", "uri", "authorization_user", "display_name", "hack_via_tcp", "hack_ip_in_contact", "password", "stun_server", "turn_server", "turn_username", "turn_password", "turn_uri", "no_answer_timeout", "register_expires", "trace_sip", "via_host", "domain", "from_uri", "via_core_value", "user"];
        for (i in j) {
            l = j[i];
            k[l] = {
                value: "",
                writable: false,
                configurable: false
            }
        }
        k.register = {
            value: "",
            writable: true,
            configurable: false
        };
        return k
    }());
    h.UA.configuration_check = {
        mandatory: {
            outbound_proxy_set: function (j) {
                var i, k;
                if (j.length === 0) {
                    return false
                }
                for (i in j) {
                    if (!j[i].ws_uri) {
                        Plivo.logNull(h.c.LOG_UA + 'Missing "ws_uri" attribute in outbound_proxy_set parameter');
                        return false
                    }
                    if (j[i].weight && !Number(j[i].weight)) {
                        Plivo.logNull(h.c.LOG_UA + '"weight" attribute in outbound_proxy_set parameter must be a Number');
                        return false
                    }
                    k = h.grammar.parse(j[i].ws_uri, "absoluteURI");
                    if (k === -1) {
                        Plivo.logNull(h.c.LOG_UA + 'Invalid "ws_uri" attribute in outbound_proxy_set parameter: ' + j[i].ws_uri);
                        return false
                    } else {
                        if (k.scheme !== "wss" && k.scheme !== "ws") {
                            Plivo.logNull(h.c.LOG_UA + "Invalid url scheme: " + k.scheme);
                            return false
                        }
                    }
                }
                return true
            },
            uri: function (j) {
                var i;
                i = h.grammar.parse(j, "lazy_uri");
                if (i === -1) {
                    Plivo.logNull(h.c.LOG_UA + "Invalid uri: " + j);
                    return false
                } else {
                    if (!i.host) {
                        Plivo.logNull(h.c.LOG_UA + "Invalid uri. Missing uri domain.");
                        return false
                    } else {
                        return true
                    }
                }
            }
        },
        optional: {
            authorization_user: function (i) {
                if (h.grammar.parse('"' + i + '"', "quoted_string") === -1) {
                    return false
                } else {
                    return true
                }
            },
            register: function (i) {
                return typeof i === "boolean"
            },
            display_name: function (i) {
                if (h.grammar.parse('"' + i + '"', "display_name") === -1) {
                    return false
                } else {
                    return true
                }
            },
            register_expires: function (i) {
                if (!Number(i)) {
                    return false
                } else {
                    return true
                }
            },
            trace_sip: function (i) {
                return typeof i === "boolean"
            },
            password: function (i) {
                if (h.grammar.parse(i, "password") === -1) {
                    return false
                } else {
                    return true
                }
            },
            stun_server: function (i) {
                if (h.grammar.parse(i, "stun_URI") === -1) {
                    return false
                } else {
                    return true
                }
            },
            turn_server: function (i) {
                if (h.grammar.parse(i, "turn_URI") === -1) {
                    return false
                } else {
                    return true
                }
            },
            turn_username: function (i) {
                if (h.grammar.parse(i, "user") === -1) {
                    return false
                } else {
                    return true
                }
            },
            turn_password: function (i) {
                if (h.grammar.parse(i, "password") === -1) {
                    return false
                } else {
                    return true
                }
            },
            no_answer_timeout: function (i) {
                if (!Number(i)) {
                    return false
                } else {
                    if (i < 0 || i > 600) {
                        return false
                    } else {
                        return true
                    }
                }
            },
            connection_recovery_min_interval: function (i) {
                if (!Number(i)) {
                    return false
                } else {
                    if (i < 0) {
                        return false
                    } else {
                        return true
                    }
                }
            },
            connection_recovery_max_interval: function (i) {
                if (!Number(i)) {
                    return false
                } else {
                    if (i < 0) {
                        return false
                    } else {
                        return true
                    }
                }
            },
            use_preloaded_route: function (i) {
                return typeof i === "boolean"
            },
            hack_via_tcp: function (i) {
                return typeof i === "boolean"
            },
            hack_ip_in_contact: function (i) {
                return typeof i === "boolean"
            }
        }
    };
    h.utils = {
        str_utf8_length: function (i) {
            return e.unescape(encodeURIComponent(i)).length
        },
        isFunction: function (i) {
            if (i !== undefined) {
                return (Object.prototype.toString.call(i) === "[object Function]") ? true : false
            } else {
                return false
            }
        },
        newTag: function () {
            return Math.random().toString(36).substr(2, h.c.TAG_LENGTH)
        },
        newUUID: function () {
            var i = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (l) {
                var k = Math.random() * 16 | 0,
                    j = l === "x" ? k : (k & 3 | 8);
                return j.toString(16)
            });
            return i
        },
        checkUri: function (i) {
            if (!i) {
                return false
            } else {
                if (h.grammar.parse(i, "lazy_uri") === -1) {
                    return false
                } else {
                    return true
                }
            }
        },
        normalizeUri: function (l, k) {
            var j, m, i;
            if (!h.utils.checkUri(l)) {
                Plivo.logNull("Invalid target: " + l);
                return
            }
            j = h.grammar.parse(l, "lazy_uri");
            if (!j.host && !k) {
                Plivo.logNull("No domain specified in target nor as function parameter");
                return
            }
            i = (j.scheme) ? j.scheme + ":" : "sip:";
            i += j.user;
            i += "@" + (j.host ? j.host : k);
            i += (j.port) ? ":" + j.port : "";
            for (m in j.params) {
                i += ";" + m;
                i += (j.params[m] === true) ? "" : "=" + j.params[m]
            }
            return i
        },
        headerize: function (l) {
            var m = {
                "Call-Id": "Call-ID",
                Cseq: "CSeq",
                "Www-Authenticate": "WWW-Authenticate"
            }, k = l.toLowerCase().replace(/_/g, "-").split("-"),
                i = "",
                j;
            for (j in k) {
                if (j !== "0") {
                    i += "-"
                }
                i += k[j].charAt(0).toUpperCase() + k[j].substring(1)
            }
            if (m[i]) {
                i = m[i]
            }
            return i
        },
        isWebRtcSupported: (function () {
            var i = false;
            try {
                if (navigator.webkitGetUserMedia && e.webkitRTCPeerConnection) {
                    i = true
                }
            } catch (j) {}
            return function () {
                return i
            }
        }()),
        sipErrorCause: function (i) {
            var j;
            for (j in h.c.SIP_ERROR_CAUSES) {
                if (h.c.SIP_ERROR_CAUSES[j].indexOf(i) !== -1) {
                    return j
                }
            }
            return
        },
        getRandomIP: function () {
            function i() {
                return (Math.random() * 255 | 0) + 1
            }
            return i() + "." + i() + "." + i() + "." + i()
        },
        checkUAStatus: function (i) {
            if (i.status !== h.c.UA_STATUS_READY) {
                throw new h.exceptions.NotReadyError()
            }
        },
        getAllowedMethods: function (i) {
            var j, k = h.c.ALLOWED_METHODS.split(", ");
            for (j in h.c.UA_EVENT_METHODS) {
                if (!i.checkEvent(j) || i.listeners(j).length === 0) {
                    k.splice(k.indexOf(h.c.UA_EVENT_METHODS[j]), 1)
                }
            }
            return k.join(", ")
        },
        MD5: function (w) {
            function P(x, k) {
                return (x << k) | (x >>> (32 - k))
            }
            function O(H, x) {
                var ad, k, G, I, F;
                G = (H & 2147483648);
                I = (x & 2147483648);
                ad = (H & 1073741824);
                k = (x & 1073741824);
                F = (H & 1073741823) + (x & 1073741823);
                if (ad & k) {
                    return (F ^ 2147483648 ^ G ^ I)
                }
                if (ad | k) {
                    if (F & 1073741824) {
                        return (F ^ 3221225472 ^ G ^ I)
                    } else {
                        return (F ^ 1073741824 ^ G ^ I)
                    }
                } else {
                    return (F ^ G ^ I)
                }
            }
            function v(k, G, F) {
                return (k & G) | ((~k) & F)
            }
            function u(k, G, F) {
                return (k & F) | (G & (~F))
            }
            function t(k, G, F) {
                return (k ^ G ^ F)
            }
            function r(k, G, F) {
                return (G ^ (k | (~F)))
            }
            function z(G, F, ae, ad, k, H, I) {
                G = O(G, O(O(v(F, ae, ad), k), I));
                return O(P(G, H), F)
            }
            function j(G, F, ae, ad, k, H, I) {
                G = O(G, O(O(u(F, ae, ad), k), I));
                return O(P(G, H), F)
            }
            function L(G, F, ae, ad, k, H, I) {
                G = O(G, O(O(t(F, ae, ad), k), I));
                return O(P(G, H), F)
            }
            function y(G, F, ae, ad, k, H, I) {
                G = O(G, O(O(r(F, ae, ad), k), I));
                return O(P(G, H), F)
            }
            function i(H) {
                var ae;
                var G = H.length;
                var F = G + 8;
                var x = (F - (F % 64)) / 64;
                var ad = (x + 1) * 16;
                var af = Array(ad - 1);
                var k = 0;
                var I = 0;
                while (I < G) {
                    ae = (I - (I % 4)) / 4;
                    k = (I % 4) * 8;
                    af[ae] = (af[ae] | (H.charCodeAt(I) << k));
                    I++
                }
                ae = (I - (I % 4)) / 4;
                k = (I % 4) * 8;
                af[ae] = af[ae] | (128 << k);
                af[ad - 2] = G << 3;
                af[ad - 1] = G >>> 29;
                return af
            }
            function J(F) {
                var x = "",
                    G = "",
                    H, k;
                for (k = 0; k <= 3; k++) {
                    H = (F >>> (k * 8)) & 255;
                    G = "0" + H.toString(16);
                    x = x + G.substr(G.length - 2, 2)
                }
                return x
            }
            function N(x) {
                x = x.replace(/\r\n/g, "\n");
                var k = "";
                for (var G = 0; G < x.length; G++) {
                    var F = x.charCodeAt(G);
                    if (F < 128) {
                        k += String.fromCharCode(F)
                    } else {
                        if ((F > 127) && (F < 2048)) {
                            k += String.fromCharCode((F >> 6) | 192);
                            k += String.fromCharCode((F & 63) | 128)
                        } else {
                            k += String.fromCharCode((F >> 12) | 224);
                            k += String.fromCharCode(((F >> 6) & 63) | 128);
                            k += String.fromCharCode((F & 63) | 128)
                        }
                    }
                }
                return k
            }
            var K = [];
            var T, m, M, A, l, ac, ab, aa, Z;
            var W = 7,
                U = 12,
                R = 17,
                Q = 22;
            var E = 5,
                D = 9,
                C = 14,
                B = 20;
            var s = 4,
                q = 11,
                p = 16,
                o = 23;
            var Y = 6,
                X = 10,
                V = 15,
                S = 21;
            w = N(w);
            K = i(w);
            ac = 1732584193;
            ab = 4023233417;
            aa = 2562383102;
            Z = 271733878;
            for (T = 0; T < K.length; T += 16) {
                m = ac;
                M = ab;
                A = aa;
                l = Z;
                ac = z(ac, ab, aa, Z, K[T + 0], W, 3614090360);
                Z = z(Z, ac, ab, aa, K[T + 1], U, 3905402710);
                aa = z(aa, Z, ac, ab, K[T + 2], R, 606105819);
                ab = z(ab, aa, Z, ac, K[T + 3], Q, 3250441966);
                ac = z(ac, ab, aa, Z, K[T + 4], W, 4118548399);
                Z = z(Z, ac, ab, aa, K[T + 5], U, 1200080426);
                aa = z(aa, Z, ac, ab, K[T + 6], R, 2821735955);
                ab = z(ab, aa, Z, ac, K[T + 7], Q, 4249261313);
                ac = z(ac, ab, aa, Z, K[T + 8], W, 1770035416);
                Z = z(Z, ac, ab, aa, K[T + 9], U, 2336552879);
                aa = z(aa, Z, ac, ab, K[T + 10], R, 4294925233);
                ab = z(ab, aa, Z, ac, K[T + 11], Q, 2304563134);
                ac = z(ac, ab, aa, Z, K[T + 12], W, 1804603682);
                Z = z(Z, ac, ab, aa, K[T + 13], U, 4254626195);
                aa = z(aa, Z, ac, ab, K[T + 14], R, 2792965006);
                ab = z(ab, aa, Z, ac, K[T + 15], Q, 1236535329);
                ac = j(ac, ab, aa, Z, K[T + 1], E, 4129170786);
                Z = j(Z, ac, ab, aa, K[T + 6], D, 3225465664);
                aa = j(aa, Z, ac, ab, K[T + 11], C, 643717713);
                ab = j(ab, aa, Z, ac, K[T + 0], B, 3921069994);
                ac = j(ac, ab, aa, Z, K[T + 5], E, 3593408605);
                Z = j(Z, ac, ab, aa, K[T + 10], D, 38016083);
                aa = j(aa, Z, ac, ab, K[T + 15], C, 3634488961);
                ab = j(ab, aa, Z, ac, K[T + 4], B, 3889429448);
                ac = j(ac, ab, aa, Z, K[T + 9], E, 568446438);
                Z = j(Z, ac, ab, aa, K[T + 14], D, 3275163606);
                aa = j(aa, Z, ac, ab, K[T + 3], C, 4107603335);
                ab = j(ab, aa, Z, ac, K[T + 8], B, 1163531501);
                ac = j(ac, ab, aa, Z, K[T + 13], E, 2850285829);
                Z = j(Z, ac, ab, aa, K[T + 2], D, 4243563512);
                aa = j(aa, Z, ac, ab, K[T + 7], C, 1735328473);
                ab = j(ab, aa, Z, ac, K[T + 12], B, 2368359562);
                ac = L(ac, ab, aa, Z, K[T + 5], s, 4294588738);
                Z = L(Z, ac, ab, aa, K[T + 8], q, 2272392833);
                aa = L(aa, Z, ac, ab, K[T + 11], p, 1839030562);
                ab = L(ab, aa, Z, ac, K[T + 14], o, 4259657740);
                ac = L(ac, ab, aa, Z, K[T + 1], s, 2763975236);
                Z = L(Z, ac, ab, aa, K[T + 4], q, 1272893353);
                aa = L(aa, Z, ac, ab, K[T + 7], p, 4139469664);
                ab = L(ab, aa, Z, ac, K[T + 10], o, 3200236656);
                ac = L(ac, ab, aa, Z, K[T + 13], s, 681279174);
                Z = L(Z, ac, ab, aa, K[T + 0], q, 3936430074);
                aa = L(aa, Z, ac, ab, K[T + 3], p, 3572445317);
                ab = L(ab, aa, Z, ac, K[T + 6], o, 76029189);
                ac = L(ac, ab, aa, Z, K[T + 9], s, 3654602809);
                Z = L(Z, ac, ab, aa, K[T + 12], q, 3873151461);
                aa = L(aa, Z, ac, ab, K[T + 15], p, 530742520);
                ab = L(ab, aa, Z, ac, K[T + 2], o, 3299628645);
                ac = y(ac, ab, aa, Z, K[T + 0], Y, 4096336452);
                Z = y(Z, ac, ab, aa, K[T + 7], X, 1126891415);
                aa = y(aa, Z, ac, ab, K[T + 14], V, 2878612391);
                ab = y(ab, aa, Z, ac, K[T + 5], S, 4237533241);
                ac = y(ac, ab, aa, Z, K[T + 12], Y, 1700485571);
                Z = y(Z, ac, ab, aa, K[T + 3], X, 2399980690);
                aa = y(aa, Z, ac, ab, K[T + 10], V, 4293915773);
                ab = y(ab, aa, Z, ac, K[T + 1], S, 2240044497);
                ac = y(ac, ab, aa, Z, K[T + 8], Y, 1873313359);
                Z = y(Z, ac, ab, aa, K[T + 15], X, 4264355552);
                aa = y(aa, Z, ac, ab, K[T + 6], V, 2734768916);
                ab = y(ab, aa, Z, ac, K[T + 13], S, 1309151649);
                ac = y(ac, ab, aa, Z, K[T + 4], Y, 4149444226);
                Z = y(Z, ac, ab, aa, K[T + 11], X, 3174756917);
                aa = y(aa, Z, ac, ab, K[T + 2], V, 718787259);
                ab = y(ab, aa, Z, ac, K[T + 9], S, 3951481745);
                ac = O(ac, m);
                ab = O(ab, M);
                aa = O(aa, A);
                Z = O(Z, l)
            }
            var n = J(ac) + J(ab) + J(aa) + J(Z);
            return n.toLowerCase()
        }
    };
    h.sanityCheck = (function () {
        var i = [],
            o = [],
            s = [],
            w, j, m;

        function q() {
            if (w.s("to").scheme !== "sip") {
                l(416);
                return false
            }
        }
        function r() {
            if (!w.to_tag) {
                if (w.call_id.substr(0, 5) === j.configuration.websdk_id) {
                    l(482);
                    return false
                }
            }
        }
        function v() {
            var x = h.utils.str_utf8_length(w.body),
                y = w.getHeader("content-length");
            if (x < y) {
                l(400);
                return false
            }
        }
        function p() {
            var B, x, z = w.from_tag,
                A = w.call_id,
                y = w.cseq;
            if (!w.to_tag) {
                if (w.method === h.c.INVITE) {
                    B = j.transactions.ist[w.via_branch];
                    if (!B) {
                        return
                    } else {
                        for (x in j.transactions.ist) {
                            B = j.transactions.ist[x];
                            if (B.request.from_tag === z && B.request.call_id === A && B.request.cseq === y) {
                                l(482);
                                return false
                            }
                        }
                    }
                } else {
                    B = j.transactions.nist[w.via_branch];
                    if (!B) {
                        return
                    } else {
                        for (x in j.transactions.nist) {
                            B = j.transactions.nist[x];
                            if (B.request.from_tag === z && B.request.call_id === A && B.request.cseq === y) {
                                l(482);
                                return false
                            }
                        }
                    }
                }
            }
        }
        function u() {
            if (w.countHeader("via") > 1) {
                console.warn(h.c.LOG_SANITY_CHECK + "More than one Via header field present in the response. Dropping the response");
                return false
            }
        }
        function k() {
            var x = j.configuration.via_host;
            if (w.via.host !== x) {
                console.warn(h.c.LOG_SANITY_CHECK + "Via host in the response does not match UA Via host value. Dropping the response");
                return false
            }
        }
        function t() {
            var x = h.utils.str_utf8_length(w.body),
                y = w.getHeader("content-length");
            if (x < y) {
                console.warn(h.c.LOG_SANITY_CHECK + "Message body length is lower than the value in Content-Length header field. Dropping the response");
                return false
            }
        }
        function n() {
            var y = ["from", "to", "call_id", "cseq", "via"],
                x = y.length;
            while (x--) {
                if (!w.hasHeader(y[x])) {
                    console.warn(h.c.LOG_SANITY_CHECK + "Missing mandatory header field : " + y[x] + ". Dropping the response");
                    return false
                }
            }
        }
        function l(z) {
            var B, y = "SIP/2.0 " + z + " " + h.c.REASON_PHRASE[z] + "\r\n",
                A = w.countHeader("via"),
                x = 0;
            for (x; x < A; x++) {
                y += "Via: " + w.getHeader("via", x) + "\r\n"
            }
            B = w.getHeader("To");
            if (!w.to_tag) {
                B += ";tag=" + h.utils.newTag()
            }
            y += "To: " + B + "\r\n";
            y += "From: " + w.getHeader("From") + "\r\n";
            y += "Call-ID: " + w.call_id + "\r\n";
            y += "CSeq: " + w.cseq + " " + w.method + "\r\n";
            y += "\r\n";
            m.send(y)
        }
        i.push(q);
        i.push(r);
        i.push(v);
        i.push(p);
        o.push(u);
        o.push(k);
        o.push(t);
        s.push(n);
        return function (y, z, A) {
            var x, B;
            w = y;
            j = z;
            m = A;
            x = s.length;
            while (x--) {
                B = s[x](w);
                if (B === false) {
                    return false
                }
            }
            if (w instanceof h.IncomingRequest) {
                x = i.length;
                while (x--) {
                    B = i[x](w);
                    if (B === false) {
                        return false
                    }
                }
            } else {
                if (w instanceof h.IncomingResponse) {
                    x = o.length;
                    while (x--) {
                        B = o[x](w);
                        if (B === false) {
                            return false
                        }
                    }
                }
            }
            return true
        }
    }());
    h.DigestAuthentication = function (j, m, k) {
        var l, p, i, q, o, n = j.configuration.authorization_user,
            r = j.configuration.password;
        if (k.status_code === 401) {
            l = k.parseHeader("www-authenticate")
        } else {
            l = k.parseHeader("proxy-authenticate")
        }
        p = l.realm.replace(/"/g, "");
        i = l.qop || null;
        q = l.nonce.replace(/"/g, "");
        o = l.opaque;
        this.password = r;
        this.method = m.method;
        this.username = n;
        this.realm = p;
        this.nonce = q;
        this.uri = m.ruri;
        this.qop = i;
        this.response = null;
        this.algorithm = "MD5";
        this.opaque = o;
        this.cnonce = null;
        this.nc = 0
    };
    h.DigestAuthentication.prototype.authenticate = function (k) {
        var j, i;
        k = k || this.password;
        this.cnonce = Math.random().toString(36).substr(2, 12);
        this.nc += 1;
        if (this.nc === 4294967296) {
            Plivo.logNull('Maximum "nc" value has been reached. Resetting "nc"');
            this.nc = 1
        }
        j = h.utils.MD5(this.username + ":" + this.realm + ":" + k);
        if (this.qop === "auth" || this.qop === null) {
            i = h.utils.MD5(this.method + ":" + this.uri)
        } else {
            if (this.qop === "auth-int") {
                i = h.utils.MD5(this.method + ":" + this.uri + ":" + h.utils.MD5(this.body ? this.body : ""))
            }
        }
        if (this.qop === "auth" || this.qop === "auth-int") {
            this.response = h.utils.MD5(j + ":" + this.nonce + ":" + this.decimalToHex(this.nc) + ":" + this.cnonce + ":" + this.qop + ":" + i)
        } else {
            this.response = h.utils.MD5(j + ":" + this.nonce + ":" + i)
        }
        return this.toString()
    };
    h.DigestAuthentication.prototype.update = function (j) {
        var i, k;
        if (j.status_code === 401) {
            i = j.parseHeader("www-authenticate")
        } else {
            i = j.parseHeader("proxy-authenticate")
        }
        k = i.nonce.replace(/"/g, "");
        if (k !== this.nonce) {
            this.nc = 0;
            this.nonce = k
        }
        this.realm = i.realm.replace(/"/g, "");
        this.qop = i.qop || null;
        this.opaque = i.opaque
    };
    h.DigestAuthentication.prototype.toString = function () {
        var i = "Digest ";
        i += 'username="' + this.username + '",';
        i += 'realm="' + this.realm + '",';
        i += 'nonce="' + this.nonce + '",';
        i += 'uri="' + this.uri + '",';
        i += 'response="' + this.response + '",';
        i += this.opaque ? 'opaque="' + this.opaque + '",' : "";
        i += this.qop ? "qop=" + this.qop + "," : "";
        i += this.qop ? 'cnonce="' + this.cnonce + '",' : "";
        i += this.qop ? "nc=" + this.decimalToHex(this.nc) + "," : "";
        i += "algorithm=MD5";
        return i
    };
    h.DigestAuthentication.prototype.decimalToHex = function (i) {
        var j = Number(i).toString(16);
        return "00000000".substr(0, 8 - j.length) + j
    };
    e.WebSDK = h
}(window));
WebSDK.grammar = (function () {
    function b(c) {
        return '"' + c.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\x08/g, "\\b").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g, escape) + '"'
    }
    var a = {
        parse: function (aU, c2) {
            var V = {
                CRLF: y,
                DIGIT: bA,
                ALPHA: bK,
                HEXDIG: aY,
                WSP: br,
                OCTET: cF,
                DQUOTE: cu,
                SP: n,
                HTAB: r,
                alphanum: aC,
                reserved: L,
                unreserved: b7,
                mark: aJ,
                escaped: Z,
                LWS: ck,
                SWS: ak,
                HCOLON: a9,
                TEXT_UTF8_TRIM: cv,
                TEXT_UTF8char: bi,
                UTF8_NONASCII: by,
                UTF8_CONT: b4,
                LHEX: bG,
                token: bI,
                token_nodot: F,
                separators: cM,
                word: aZ,
                STAR: aO,
                SLASH: au,
                EQUAL: bw,
                LPAREN: bp,
                RPAREN: A,
                RAQUOT: a4,
                LAQUOT: cD,
                COMMA: co,
                SEMI: w,
                COLON: N,
                LDQUOT: s,
                RDQUOT: bx,
                comment: cn,
                ctext: k,
                quoted_string: cO,
                qdtext: bn,
                quoted_pair: am,
                SIP_URI_simple: M,
                SIP_URI: z,
                uri_scheme: cY,
                userinfo: bf,
                user: c5,
                user_unreserved: B,
                password: aj,
                hostport: b3,
                host: u,
                hostname: cs,
                domainlabel: bL,
                toplabel: ad,
                IPv6reference: aQ,
                IPv6address: aS,
                h16: b1,
                ls32: ac,
                IPv4address: b6,
                dec_octet: ci,
                port: ct,
                uri_parameters: U,
                uri_parameter: ar,
                transport_param: cV,
                user_param: bB,
                method_param: cB,
                ttl_param: cP,
                maddr_param: cS,
                lr_param: be,
                other_param: bu,
                pname: j,
                pvalue: cg,
                paramchar: bU,
                param_unreserved: bH,
                headers: ap,
                header: cr,
                hname: ao,
                hvalue: b5,
                hnv_unreserved: bZ,
                Request_Response: b8,
                Request_Line: c6,
                Request_URI: bo,
                absoluteURI: cL,
                hier_part: C,
                net_path: cI,
                abs_path: cl,
                opaque_part: ae,
                uric: S,
                uric_no_slash: p,
                path_segments: aE,
                segment: bM,
                param: bg,
                pchar: g,
                scheme: bO,
                authority: O,
                srvr: bQ,
                reg_name: cJ,
                query: cb,
                SIP_Version: bj,
                INVITEm: bX,
                ACKm: ai,
                OPTIONSm: Q,
                BYEm: cc,
                CANCELm: a7,
                REGISTERm: aH,
                SUBSCRIBEm: aI,
                NOTIFYm: cm,
                Method: aq,
                Status_Line: bl,
                Status_Code: aA,
                extension_code: c3,
                Reason_Phrase: ax,
                Allow_Events: cC,
                Call_ID: al,
                Contact: ch,
                contact_param: cK,
                name_addr: a8,
                addr_spec: aV,
                addr_spec_simple: cw,
                display_name: az,
                contact_params: cp,
                c_p_q: cE,
                c_p_expires: a2,
                contact_extension: a3,
                delta_seconds: c4,
                qvalue: v,
                generic_param: aN,
                gen_value: cZ,
                Content_Disposition: aR,
                disp_type: ca,
                disp_param: c1,
                handling_param: bJ,
                Content_Encoding: aL,
                Content_Length: ah,
                Content_Type: bT,
                media_type: cj,
                m_type: aX,
                discrete_type: aT,
                composite_type: b2,
                extension_token: i,
                x_token: a6,
                m_subtype: K,
                m_parameter: bv,
                m_value: an,
                CSeq: a0,
                CSeq_value: h,
                Expires: aw,
                Event: b0,
                event_type: bW,
                event_param: bS,
                From: bh,
                from_param: cR,
                tag_param: aK,
                Max_Forwards: a1,
                Min_Expires: cf,
                Proxy_Authenticate: cW,
                challenge: c0,
                other_challenge: aG,
                auth_param: o,
                digest_cln: cN,
                realm: bs,
                realm_value: e,
                domain: cH,
                URI: bR,
                nonce: f,
                nonce_value: aF,
                opaque: bV,
                stale: bq,
                algorithm: E,
                qop_options: bt,
                qop_value: G,
                Proxy_Require: m,
                Record_Route: x,
                rec_route: aM,
                Require: l,
                Route: cU,
                route_param: aD,
                Subscription_State: bc,
                substate_value: bD,
                subexp_params: bC,
                event_reason_value: ag,
                Subject: I,
                Supported: a5,
                To: cq,
                to_param: cz,
                Via: af,
                via_parm: bd,
                via_params: bP,
                via_ttl: R,
                via_maddr: aa,
                via_received: ay,
                via_branch: ce,
                response_port: J,
                sent_protocol: bF,
                protocol_name: bb,
                transport: d,
                sent_by: W,
                via_host: bk,
                via_port: aB,
                ttl: t,
                WWW_Authenticate: cd,
                extension_header: aW,
                header_value: D,
                message_body: cy,
                stun_URI: aP,
                stun_scheme: Y,
                stun_host_port: bY,
                stun_host: bz,
                reg_name: cJ,
                stun_unreserved: H,
                sub_delims: c,
                turn_URI: cG,
                turn_scheme: ba,
                turn_transport: X,
                lazy_uri: cx
            };
            if (c2 !== undefined) {
                if (V[c2] === undefined) {
                    throw new Error("Invalid rule name: " + b(c2) + ".")
                }
            } else {
                c2 = "CRLF"
            }
            var bN = 0;
            var T = 0;
            var q = 0;
            var cT = [];

            function b9(c8, dc, da) {
                var c7 = c8;
                var db = da - c8.length;
                for (var c9 = 0; c9 < db; c9++) {
                    c7 = dc + c7
                }
                return c7
            }
            function av(c9) {
                var c8 = c9.charCodeAt(0);
                var c7;
                var da;
                if (c8 <= 255) {
                    c7 = "x";
                    da = 2
                } else {
                    c7 = "u";
                    da = 4
                }
                return "\\" + c7 + b9(c8.toString(16).toUpperCase(), "0", da)
            }
            function at(c7) {
                if (bN < q) {
                    return
                }
                if (bN > q) {
                    q = bN;
                    cT = []
                }
                cT.push(c7)
            }
            function y() {
                var c7;
                if (aU.substr(bN, 2) === "\r\n") {
                    c7 = "\r\n";
                    bN += 2
                } else {
                    c7 = null;
                    if (T === 0) {
                        at('"\\r\\n"')
                    }
                }
                return c7
            }
            function bA() {
                var c7;
                if (/^[0-9]/.test(aU.charAt(bN))) {
                    c7 = aU.charAt(bN);
                    bN++
                } else {
                    c7 = null;
                    if (T === 0) {
                        at("[0-9]")
                    }
                }
                return c7
            }
            function bK() {
                var c7;
                if (/^[a-zA-Z]/.test(aU.charAt(bN))) {
                    c7 = aU.charAt(bN);
                    bN++
                } else {
                    c7 = null;
                    if (T === 0) {
                        at("[a-zA-Z]")
                    }
                }
                return c7
            }
            function aY() {
                var c7;
                if (/^[0-9a-fA-F]/.test(aU.charAt(bN))) {
                    c7 = aU.charAt(bN);
                    bN++
                } else {
                    c7 = null;
                    if (T === 0) {
                        at("[0-9a-fA-F]")
                    }
                }
                return c7
            }
            function br() {
                var c7;
                c7 = n();
                if (c7 === null) {
                    c7 = r()
                }
                return c7
            }
            function cF() {
                var c7;
                if (/^[\0-\xFF]/.test(aU.charAt(bN))) {
                    c7 = aU.charAt(bN);
                    bN++
                } else {
                    c7 = null;
                    if (T === 0) {
                        at("[\\0-\\xFF]")
                    }
                }
                return c7
            }
            function cu() {
                var c7;
                if (/^["]/.test(aU.charAt(bN))) {
                    c7 = aU.charAt(bN);
                    bN++
                } else {
                    c7 = null;
                    if (T === 0) {
                        at('["]')
                    }
                }
                return c7
            }
            function n() {
                var c7;
                if (aU.charCodeAt(bN) === 32) {
                    c7 = " ";
                    bN++
                } else {
                    c7 = null;
                    if (T === 0) {
                        at('" "')
                    }
                }
                return c7
            }
            function r() {
                var c7;
                if (aU.charCodeAt(bN) === 9) {
                    c7 = "\t";
                    bN++
                } else {
                    c7 = null;
                    if (T === 0) {
                        at('"\\t"')
                    }
                }
                return c7
            }
            function aC() {
                var c7;
                if (/^[a-zA-Z0-9]/.test(aU.charAt(bN))) {
                    c7 = aU.charAt(bN);
                    bN++
                } else {
                    c7 = null;
                    if (T === 0) {
                        at("[a-zA-Z0-9]")
                    }
                }
                return c7
            }
            function L() {
                var c7;
                if (aU.charCodeAt(bN) === 59) {
                    c7 = ";";
                    bN++
                } else {
                    c7 = null;
                    if (T === 0) {
                        at('";"')
                    }
                }
                if (c7 === null) {
                    if (aU.charCodeAt(bN) === 47) {
                        c7 = "/";
                        bN++
                    } else {
                        c7 = null;
                        if (T === 0) {
                            at('"/"')
                        }
                    }
                    if (c7 === null) {
                        if (aU.charCodeAt(bN) === 63) {
                            c7 = "?";
                            bN++
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at('"?"')
                            }
                        }
                        if (c7 === null) {
                            if (aU.charCodeAt(bN) === 58) {
                                c7 = ":";
                                bN++
                            } else {
                                c7 = null;
                                if (T === 0) {
                                    at('":"')
                                }
                            }
                            if (c7 === null) {
                                if (aU.charCodeAt(bN) === 64) {
                                    c7 = "@";
                                    bN++
                                } else {
                                    c7 = null;
                                    if (T === 0) {
                                        at('"@"')
                                    }
                                }
                                if (c7 === null) {
                                    if (aU.charCodeAt(bN) === 38) {
                                        c7 = "&";
                                        bN++
                                    } else {
                                        c7 = null;
                                        if (T === 0) {
                                            at('"&"')
                                        }
                                    }
                                    if (c7 === null) {
                                        if (aU.charCodeAt(bN) === 61) {
                                            c7 = "=";
                                            bN++
                                        } else {
                                            c7 = null;
                                            if (T === 0) {
                                                at('"="')
                                            }
                                        }
                                        if (c7 === null) {
                                            if (aU.charCodeAt(bN) === 43) {
                                                c7 = "+";
                                                bN++
                                            } else {
                                                c7 = null;
                                                if (T === 0) {
                                                    at('"+"')
                                                }
                                            }
                                            if (c7 === null) {
                                                if (aU.charCodeAt(bN) === 36) {
                                                    c7 = "$";
                                                    bN++
                                                } else {
                                                    c7 = null;
                                                    if (T === 0) {
                                                        at('"$"')
                                                    }
                                                }
                                                if (c7 === null) {
                                                    if (aU.charCodeAt(bN) === 44) {
                                                        c7 = ",";
                                                        bN++
                                                    } else {
                                                        c7 = null;
                                                        if (T === 0) {
                                                            at('","')
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return c7
            }
            function b7() {
                var c7;
                c7 = aC();
                if (c7 === null) {
                    c7 = aJ()
                }
                return c7
            }
            function aJ() {
                var c7;
                if (aU.charCodeAt(bN) === 45) {
                    c7 = "-";
                    bN++
                } else {
                    c7 = null;
                    if (T === 0) {
                        at('"-"')
                    }
                }
                if (c7 === null) {
                    if (aU.charCodeAt(bN) === 95) {
                        c7 = "_";
                        bN++
                    } else {
                        c7 = null;
                        if (T === 0) {
                            at('"_"')
                        }
                    }
                    if (c7 === null) {
                        if (aU.charCodeAt(bN) === 46) {
                            c7 = ".";
                            bN++
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at('"."')
                            }
                        }
                        if (c7 === null) {
                            if (aU.charCodeAt(bN) === 33) {
                                c7 = "!";
                                bN++
                            } else {
                                c7 = null;
                                if (T === 0) {
                                    at('"!"')
                                }
                            }
                            if (c7 === null) {
                                if (aU.charCodeAt(bN) === 126) {
                                    c7 = "~";
                                    bN++
                                } else {
                                    c7 = null;
                                    if (T === 0) {
                                        at('"~"')
                                    }
                                }
                                if (c7 === null) {
                                    if (aU.charCodeAt(bN) === 42) {
                                        c7 = "*";
                                        bN++
                                    } else {
                                        c7 = null;
                                        if (T === 0) {
                                            at('"*"')
                                        }
                                    }
                                    if (c7 === null) {
                                        if (aU.charCodeAt(bN) === 39) {
                                            c7 = "'";
                                            bN++
                                        } else {
                                            c7 = null;
                                            if (T === 0) {
                                                at('"\'"')
                                            }
                                        }
                                        if (c7 === null) {
                                            if (aU.charCodeAt(bN) === 40) {
                                                c7 = "(";
                                                bN++
                                            } else {
                                                c7 = null;
                                                if (T === 0) {
                                                    at('"("')
                                                }
                                            }
                                            if (c7 === null) {
                                                if (aU.charCodeAt(bN) === 41) {
                                                    c7 = ")";
                                                    bN++
                                                } else {
                                                    c7 = null;
                                                    if (T === 0) {
                                                        at('")"')
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return c7
            }
            function Z() {
                var c9, c8, c7;
                var da;
                da = bN;
                if (aU.charCodeAt(bN) === 37) {
                    c9 = "%";
                    bN++
                } else {
                    c9 = null;
                    if (T === 0) {
                        at('"%"')
                    }
                }
                if (c9 !== null) {
                    c8 = aY();
                    if (c8 !== null) {
                        c7 = aY();
                        if (c7 !== null) {
                            c9 = [c9, c8, c7]
                        } else {
                            c9 = null;
                            bN = da
                        }
                    } else {
                        c9 = null;
                        bN = da
                    }
                } else {
                    c9 = null;
                    bN = da
                }
                return c9
            }
            function ck() {
                var db, c9, c7;
                var dc, da, c8;
                dc = bN;
                da = bN;
                c8 = bN;
                db = [];
                c9 = br();
                while (c9 !== null) {
                    db.push(c9);
                    c9 = br()
                }
                if (db !== null) {
                    c9 = y();
                    if (c9 !== null) {
                        db = [db, c9]
                    } else {
                        db = null;
                        bN = c8
                    }
                } else {
                    db = null;
                    bN = c8
                }
                db = db !== null ? db : "";
                if (db !== null) {
                    c7 = br();
                    if (c7 !== null) {
                        c9 = [];
                        while (c7 !== null) {
                            c9.push(c7);
                            c7 = br()
                        }
                    } else {
                        c9 = null
                    }
                    if (c9 !== null) {
                        db = [db, c9]
                    } else {
                        db = null;
                        bN = da
                    }
                } else {
                    db = null;
                    bN = da
                }
                if (db !== null) {
                    db = (function (dd) {
                        return " "
                    })(dc)
                }
                if (db === null) {
                    bN = dc
                }
                return db
            }
            function ak() {
                var c7;
                c7 = ck();
                c7 = c7 !== null ? c7 : "";
                return c7
            }
            function a9() {
                var da, c8, c7;
                var db, c9;
                db = bN;
                c9 = bN;
                da = [];
                c8 = n();
                if (c8 === null) {
                    c8 = r()
                }
                while (c8 !== null) {
                    da.push(c8);
                    c8 = n();
                    if (c8 === null) {
                        c8 = r()
                    }
                }
                if (da !== null) {
                    if (aU.charCodeAt(bN) === 58) {
                        c8 = ":";
                        bN++
                    } else {
                        c8 = null;
                        if (T === 0) {
                            at('":"')
                        }
                    }
                    if (c8 !== null) {
                        c7 = ak();
                        if (c7 !== null) {
                            da = [da, c8, c7]
                        } else {
                            da = null;
                            bN = c9
                        }
                    } else {
                        da = null;
                        bN = c9
                    }
                } else {
                    da = null;
                    bN = c9
                }
                if (da !== null) {
                    da = (function (dc) {
                        return ":"
                    })(db)
                }
                if (da === null) {
                    bN = db
                }
                return da
            }
            function cv() {
                var dc, da, c8, c7;
                var dd, db, c9;
                dd = bN;
                db = bN;
                da = bi();
                if (da !== null) {
                    dc = [];
                    while (da !== null) {
                        dc.push(da);
                        da = bi()
                    }
                } else {
                    dc = null
                }
                if (dc !== null) {
                    da = [];
                    c9 = bN;
                    c8 = [];
                    c7 = ck();
                    while (c7 !== null) {
                        c8.push(c7);
                        c7 = ck()
                    }
                    if (c8 !== null) {
                        c7 = bi();
                        if (c7 !== null) {
                            c8 = [c8, c7]
                        } else {
                            c8 = null;
                            bN = c9
                        }
                    } else {
                        c8 = null;
                        bN = c9
                    }
                    while (c8 !== null) {
                        da.push(c8);
                        c9 = bN;
                        c8 = [];
                        c7 = ck();
                        while (c7 !== null) {
                            c8.push(c7);
                            c7 = ck()
                        }
                        if (c8 !== null) {
                            c7 = bi();
                            if (c7 !== null) {
                                c8 = [c8, c7]
                            } else {
                                c8 = null;
                                bN = c9
                            }
                        } else {
                            c8 = null;
                            bN = c9
                        }
                    }
                    if (da !== null) {
                        dc = [dc, da]
                    } else {
                        dc = null;
                        bN = db
                    }
                } else {
                    dc = null;
                    bN = db
                }
                if (dc !== null) {
                    dc = (function (de) {
                        return aU.substring(bN, de)
                    })(dd)
                }
                if (dc === null) {
                    bN = dd
                }
                return dc
            }
            function bi() {
                var c7;
                if (/^[!-~]/.test(aU.charAt(bN))) {
                    c7 = aU.charAt(bN);
                    bN++
                } else {
                    c7 = null;
                    if (T === 0) {
                        at("[!-~]")
                    }
                }
                if (c7 === null) {
                    c7 = by()
                }
                return c7
            }
            function by() {
                var c7;
                if (/^[\x80-\xFF]/.test(aU.charAt(bN))) {
                    c7 = aU.charAt(bN);
                    bN++
                } else {
                    c7 = null;
                    if (T === 0) {
                        at("[\\x80-\\xFF]")
                    }
                }
                return c7
            }
            function b4() {
                var c7;
                if (/^[\x80-\xBF]/.test(aU.charAt(bN))) {
                    c7 = aU.charAt(bN);
                    bN++
                } else {
                    c7 = null;
                    if (T === 0) {
                        at("[\\x80-\\xBF]")
                    }
                }
                return c7
            }
            function bG() {
                var c7;
                c7 = bA();
                if (c7 === null) {
                    if (/^[a-f]/.test(aU.charAt(bN))) {
                        c7 = aU.charAt(bN);
                        bN++
                    } else {
                        c7 = null;
                        if (T === 0) {
                            at("[a-f]")
                        }
                    }
                }
                return c7
            }
            function bI() {
                var c8, c7;
                var c9;
                c9 = bN;
                c7 = aC();
                if (c7 === null) {
                    if (aU.charCodeAt(bN) === 45) {
                        c7 = "-";
                        bN++
                    } else {
                        c7 = null;
                        if (T === 0) {
                            at('"-"')
                        }
                    }
                    if (c7 === null) {
                        if (aU.charCodeAt(bN) === 46) {
                            c7 = ".";
                            bN++
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at('"."')
                            }
                        }
                        if (c7 === null) {
                            if (aU.charCodeAt(bN) === 33) {
                                c7 = "!";
                                bN++
                            } else {
                                c7 = null;
                                if (T === 0) {
                                    at('"!"')
                                }
                            }
                            if (c7 === null) {
                                if (aU.charCodeAt(bN) === 37) {
                                    c7 = "%";
                                    bN++
                                } else {
                                    c7 = null;
                                    if (T === 0) {
                                        at('"%"')
                                    }
                                }
                                if (c7 === null) {
                                    if (aU.charCodeAt(bN) === 42) {
                                        c7 = "*";
                                        bN++
                                    } else {
                                        c7 = null;
                                        if (T === 0) {
                                            at('"*"')
                                        }
                                    }
                                    if (c7 === null) {
                                        if (aU.charCodeAt(bN) === 95) {
                                            c7 = "_";
                                            bN++
                                        } else {
                                            c7 = null;
                                            if (T === 0) {
                                                at('"_"')
                                            }
                                        }
                                        if (c7 === null) {
                                            if (aU.charCodeAt(bN) === 43) {
                                                c7 = "+";
                                                bN++
                                            } else {
                                                c7 = null;
                                                if (T === 0) {
                                                    at('"+"')
                                                }
                                            }
                                            if (c7 === null) {
                                                if (aU.charCodeAt(bN) === 96) {
                                                    c7 = "`";
                                                    bN++
                                                } else {
                                                    c7 = null;
                                                    if (T === 0) {
                                                        at('"`"')
                                                    }
                                                }
                                                if (c7 === null) {
                                                    if (aU.charCodeAt(bN) === 39) {
                                                        c7 = "'";
                                                        bN++
                                                    } else {
                                                        c7 = null;
                                                        if (T === 0) {
                                                            at('"\'"')
                                                        }
                                                    }
                                                    if (c7 === null) {
                                                        if (aU.charCodeAt(bN) === 126) {
                                                            c7 = "~";
                                                            bN++
                                                        } else {
                                                            c7 = null;
                                                            if (T === 0) {
                                                                at('"~"')
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (c7 !== null) {
                    c8 = [];
                    while (c7 !== null) {
                        c8.push(c7);
                        c7 = aC();
                        if (c7 === null) {
                            if (aU.charCodeAt(bN) === 45) {
                                c7 = "-";
                                bN++
                            } else {
                                c7 = null;
                                if (T === 0) {
                                    at('"-"')
                                }
                            }
                            if (c7 === null) {
                                if (aU.charCodeAt(bN) === 46) {
                                    c7 = ".";
                                    bN++
                                } else {
                                    c7 = null;
                                    if (T === 0) {
                                        at('"."')
                                    }
                                }
                                if (c7 === null) {
                                    if (aU.charCodeAt(bN) === 33) {
                                        c7 = "!";
                                        bN++
                                    } else {
                                        c7 = null;
                                        if (T === 0) {
                                            at('"!"')
                                        }
                                    }
                                    if (c7 === null) {
                                        if (aU.charCodeAt(bN) === 37) {
                                            c7 = "%";
                                            bN++
                                        } else {
                                            c7 = null;
                                            if (T === 0) {
                                                at('"%"')
                                            }
                                        }
                                        if (c7 === null) {
                                            if (aU.charCodeAt(bN) === 42) {
                                                c7 = "*";
                                                bN++
                                            } else {
                                                c7 = null;
                                                if (T === 0) {
                                                    at('"*"')
                                                }
                                            }
                                            if (c7 === null) {
                                                if (aU.charCodeAt(bN) === 95) {
                                                    c7 = "_";
                                                    bN++
                                                } else {
                                                    c7 = null;
                                                    if (T === 0) {
                                                        at('"_"')
                                                    }
                                                }
                                                if (c7 === null) {
                                                    if (aU.charCodeAt(bN) === 43) {
                                                        c7 = "+";
                                                        bN++
                                                    } else {
                                                        c7 = null;
                                                        if (T === 0) {
                                                            at('"+"')
                                                        }
                                                    }
                                                    if (c7 === null) {
                                                        if (aU.charCodeAt(bN) === 96) {
                                                            c7 = "`";
                                                            bN++
                                                        } else {
                                                            c7 = null;
                                                            if (T === 0) {
                                                                at('"`"')
                                                            }
                                                        }
                                                        if (c7 === null) {
                                                            if (aU.charCodeAt(bN) === 39) {
                                                                c7 = "'";
                                                                bN++
                                                            } else {
                                                                c7 = null;
                                                                if (T === 0) {
                                                                    at('"\'"')
                                                                }
                                                            }
                                                            if (c7 === null) {
                                                                if (aU.charCodeAt(bN) === 126) {
                                                                    c7 = "~";
                                                                    bN++
                                                                } else {
                                                                    c7 = null;
                                                                    if (T === 0) {
                                                                        at('"~"')
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    c8 = null
                }
                if (c8 !== null) {
                    c8 = (function (da) {
                        return aU.substring(bN, da)
                    })(c9)
                }
                if (c8 === null) {
                    bN = c9
                }
                return c8
            }
            function F() {
                var c8, c7;
                var c9;
                c9 = bN;
                c7 = aC();
                if (c7 === null) {
                    if (aU.charCodeAt(bN) === 45) {
                        c7 = "-";
                        bN++
                    } else {
                        c7 = null;
                        if (T === 0) {
                            at('"-"')
                        }
                    }
                    if (c7 === null) {
                        if (aU.charCodeAt(bN) === 33) {
                            c7 = "!";
                            bN++
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at('"!"')
                            }
                        }
                        if (c7 === null) {
                            if (aU.charCodeAt(bN) === 37) {
                                c7 = "%";
                                bN++
                            } else {
                                c7 = null;
                                if (T === 0) {
                                    at('"%"')
                                }
                            }
                            if (c7 === null) {
                                if (aU.charCodeAt(bN) === 42) {
                                    c7 = "*";
                                    bN++
                                } else {
                                    c7 = null;
                                    if (T === 0) {
                                        at('"*"')
                                    }
                                }
                                if (c7 === null) {
                                    if (aU.charCodeAt(bN) === 95) {
                                        c7 = "_";
                                        bN++
                                    } else {
                                        c7 = null;
                                        if (T === 0) {
                                            at('"_"')
                                        }
                                    }
                                    if (c7 === null) {
                                        if (aU.charCodeAt(bN) === 43) {
                                            c7 = "+";
                                            bN++
                                        } else {
                                            c7 = null;
                                            if (T === 0) {
                                                at('"+"')
                                            }
                                        }
                                        if (c7 === null) {
                                            if (aU.charCodeAt(bN) === 96) {
                                                c7 = "`";
                                                bN++
                                            } else {
                                                c7 = null;
                                                if (T === 0) {
                                                    at('"`"')
                                                }
                                            }
                                            if (c7 === null) {
                                                if (aU.charCodeAt(bN) === 39) {
                                                    c7 = "'";
                                                    bN++
                                                } else {
                                                    c7 = null;
                                                    if (T === 0) {
                                                        at('"\'"')
                                                    }
                                                }
                                                if (c7 === null) {
                                                    if (aU.charCodeAt(bN) === 126) {
                                                        c7 = "~";
                                                        bN++
                                                    } else {
                                                        c7 = null;
                                                        if (T === 0) {
                                                            at('"~"')
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (c7 !== null) {
                    c8 = [];
                    while (c7 !== null) {
                        c8.push(c7);
                        c7 = aC();
                        if (c7 === null) {
                            if (aU.charCodeAt(bN) === 45) {
                                c7 = "-";
                                bN++
                            } else {
                                c7 = null;
                                if (T === 0) {
                                    at('"-"')
                                }
                            }
                            if (c7 === null) {
                                if (aU.charCodeAt(bN) === 33) {
                                    c7 = "!";
                                    bN++
                                } else {
                                    c7 = null;
                                    if (T === 0) {
                                        at('"!"')
                                    }
                                }
                                if (c7 === null) {
                                    if (aU.charCodeAt(bN) === 37) {
                                        c7 = "%";
                                        bN++
                                    } else {
                                        c7 = null;
                                        if (T === 0) {
                                            at('"%"')
                                        }
                                    }
                                    if (c7 === null) {
                                        if (aU.charCodeAt(bN) === 42) {
                                            c7 = "*";
                                            bN++
                                        } else {
                                            c7 = null;
                                            if (T === 0) {
                                                at('"*"')
                                            }
                                        }
                                        if (c7 === null) {
                                            if (aU.charCodeAt(bN) === 95) {
                                                c7 = "_";
                                                bN++
                                            } else {
                                                c7 = null;
                                                if (T === 0) {
                                                    at('"_"')
                                                }
                                            }
                                            if (c7 === null) {
                                                if (aU.charCodeAt(bN) === 43) {
                                                    c7 = "+";
                                                    bN++
                                                } else {
                                                    c7 = null;
                                                    if (T === 0) {
                                                        at('"+"')
                                                    }
                                                }
                                                if (c7 === null) {
                                                    if (aU.charCodeAt(bN) === 96) {
                                                        c7 = "`";
                                                        bN++
                                                    } else {
                                                        c7 = null;
                                                        if (T === 0) {
                                                            at('"`"')
                                                        }
                                                    }
                                                    if (c7 === null) {
                                                        if (aU.charCodeAt(bN) === 39) {
                                                            c7 = "'";
                                                            bN++
                                                        } else {
                                                            c7 = null;
                                                            if (T === 0) {
                                                                at('"\'"')
                                                            }
                                                        }
                                                        if (c7 === null) {
                                                            if (aU.charCodeAt(bN) === 126) {
                                                                c7 = "~";
                                                                bN++
                                                            } else {
                                                                c7 = null;
                                                                if (T === 0) {
                                                                    at('"~"')
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    c8 = null
                }
                if (c8 !== null) {
                    c8 = (function (da) {
                        return aU.substring(bN, da)
                    })(c9)
                }
                if (c8 === null) {
                    bN = c9
                }
                return c8
            }
            function cM() {
                var c7;
                if (aU.charCodeAt(bN) === 40) {
                    c7 = "(";
                    bN++
                } else {
                    c7 = null;
                    if (T === 0) {
                        at('"("')
                    }
                }
                if (c7 === null) {
                    if (aU.charCodeAt(bN) === 41) {
                        c7 = ")";
                        bN++
                    } else {
                        c7 = null;
                        if (T === 0) {
                            at('")"')
                        }
                    }
                    if (c7 === null) {
                        if (aU.charCodeAt(bN) === 60) {
                            c7 = "<";
                            bN++
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at('"<"')
                            }
                        }
                        if (c7 === null) {
                            if (aU.charCodeAt(bN) === 62) {
                                c7 = ">";
                                bN++
                            } else {
                                c7 = null;
                                if (T === 0) {
                                    at('">"')
                                }
                            }
                            if (c7 === null) {
                                if (aU.charCodeAt(bN) === 64) {
                                    c7 = "@";
                                    bN++
                                } else {
                                    c7 = null;
                                    if (T === 0) {
                                        at('"@"')
                                    }
                                }
                                if (c7 === null) {
                                    if (aU.charCodeAt(bN) === 44) {
                                        c7 = ",";
                                        bN++
                                    } else {
                                        c7 = null;
                                        if (T === 0) {
                                            at('","')
                                        }
                                    }
                                    if (c7 === null) {
                                        if (aU.charCodeAt(bN) === 59) {
                                            c7 = ";";
                                            bN++
                                        } else {
                                            c7 = null;
                                            if (T === 0) {
                                                at('";"')
                                            }
                                        }
                                        if (c7 === null) {
                                            if (aU.charCodeAt(bN) === 58) {
                                                c7 = ":";
                                                bN++
                                            } else {
                                                c7 = null;
                                                if (T === 0) {
                                                    at('":"')
                                                }
                                            }
                                            if (c7 === null) {
                                                if (aU.charCodeAt(bN) === 92) {
                                                    c7 = "\\";
                                                    bN++
                                                } else {
                                                    c7 = null;
                                                    if (T === 0) {
                                                        at('"\\\\"')
                                                    }
                                                }
                                                if (c7 === null) {
                                                    c7 = cu();
                                                    if (c7 === null) {
                                                        if (aU.charCodeAt(bN) === 47) {
                                                            c7 = "/";
                                                            bN++
                                                        } else {
                                                            c7 = null;
                                                            if (T === 0) {
                                                                at('"/"')
                                                            }
                                                        }
                                                        if (c7 === null) {
                                                            if (aU.charCodeAt(bN) === 91) {
                                                                c7 = "[";
                                                                bN++
                                                            } else {
                                                                c7 = null;
                                                                if (T === 0) {
                                                                    at('"["')
                                                                }
                                                            }
                                                            if (c7 === null) {
                                                                if (aU.charCodeAt(bN) === 93) {
                                                                    c7 = "]";
                                                                    bN++
                                                                } else {
                                                                    c7 = null;
                                                                    if (T === 0) {
                                                                        at('"]"')
                                                                    }
                                                                }
                                                                if (c7 === null) {
                                                                    if (aU.charCodeAt(bN) === 63) {
                                                                        c7 = "?";
                                                                        bN++
                                                                    } else {
                                                                        c7 = null;
                                                                        if (T === 0) {
                                                                            at('"?"')
                                                                        }
                                                                    }
                                                                    if (c7 === null) {
                                                                        if (aU.charCodeAt(bN) === 61) {
                                                                            c7 = "=";
                                                                            bN++
                                                                        } else {
                                                                            c7 = null;
                                                                            if (T === 0) {
                                                                                at('"="')
                                                                            }
                                                                        }
                                                                        if (c7 === null) {
                                                                            if (aU.charCodeAt(bN) === 123) {
                                                                                c7 = "{";
                                                                                bN++
                                                                            } else {
                                                                                c7 = null;
                                                                                if (T === 0) {
                                                                                    at('"{"')
                                                                                }
                                                                            }
                                                                            if (c7 === null) {
                                                                                if (aU.charCodeAt(bN) === 125) {
                                                                                    c7 = "}";
                                                                                    bN++
                                                                                } else {
                                                                                    c7 = null;
                                                                                    if (T === 0) {
                                                                                        at('"}"')
                                                                                    }
                                                                                }
                                                                                if (c7 === null) {
                                                                                    c7 = n();
                                                                                    if (c7 === null) {
                                                                                        c7 = r()
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return c7
            }
            function aZ() {
                var c8, c7;
                var c9;
                c9 = bN;
                c7 = aC();
                if (c7 === null) {
                    if (aU.charCodeAt(bN) === 45) {
                        c7 = "-";
                        bN++
                    } else {
                        c7 = null;
                        if (T === 0) {
                            at('"-"')
                        }
                    }
                    if (c7 === null) {
                        if (aU.charCodeAt(bN) === 46) {
                            c7 = ".";
                            bN++
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at('"."')
                            }
                        }
                        if (c7 === null) {
                            if (aU.charCodeAt(bN) === 33) {
                                c7 = "!";
                                bN++
                            } else {
                                c7 = null;
                                if (T === 0) {
                                    at('"!"')
                                }
                            }
                            if (c7 === null) {
                                if (aU.charCodeAt(bN) === 37) {
                                    c7 = "%";
                                    bN++
                                } else {
                                    c7 = null;
                                    if (T === 0) {
                                        at('"%"')
                                    }
                                }
                                if (c7 === null) {
                                    if (aU.charCodeAt(bN) === 42) {
                                        c7 = "*";
                                        bN++
                                    } else {
                                        c7 = null;
                                        if (T === 0) {
                                            at('"*"')
                                        }
                                    }
                                    if (c7 === null) {
                                        if (aU.charCodeAt(bN) === 95) {
                                            c7 = "_";
                                            bN++
                                        } else {
                                            c7 = null;
                                            if (T === 0) {
                                                at('"_"')
                                            }
                                        }
                                        if (c7 === null) {
                                            if (aU.charCodeAt(bN) === 43) {
                                                c7 = "+";
                                                bN++
                                            } else {
                                                c7 = null;
                                                if (T === 0) {
                                                    at('"+"')
                                                }
                                            }
                                            if (c7 === null) {
                                                if (aU.charCodeAt(bN) === 96) {
                                                    c7 = "`";
                                                    bN++
                                                } else {
                                                    c7 = null;
                                                    if (T === 0) {
                                                        at('"`"')
                                                    }
                                                }
                                                if (c7 === null) {
                                                    if (aU.charCodeAt(bN) === 39) {
                                                        c7 = "'";
                                                        bN++
                                                    } else {
                                                        c7 = null;
                                                        if (T === 0) {
                                                            at('"\'"')
                                                        }
                                                    }
                                                    if (c7 === null) {
                                                        if (aU.charCodeAt(bN) === 126) {
                                                            c7 = "~";
                                                            bN++
                                                        } else {
                                                            c7 = null;
                                                            if (T === 0) {
                                                                at('"~"')
                                                            }
                                                        }
                                                        if (c7 === null) {
                                                            if (aU.charCodeAt(bN) === 40) {
                                                                c7 = "(";
                                                                bN++
                                                            } else {
                                                                c7 = null;
                                                                if (T === 0) {
                                                                    at('"("')
                                                                }
                                                            }
                                                            if (c7 === null) {
                                                                if (aU.charCodeAt(bN) === 41) {
                                                                    c7 = ")";
                                                                    bN++
                                                                } else {
                                                                    c7 = null;
                                                                    if (T === 0) {
                                                                        at('")"')
                                                                    }
                                                                }
                                                                if (c7 === null) {
                                                                    if (aU.charCodeAt(bN) === 60) {
                                                                        c7 = "<";
                                                                        bN++
                                                                    } else {
                                                                        c7 = null;
                                                                        if (T === 0) {
                                                                            at('"<"')
                                                                        }
                                                                    }
                                                                    if (c7 === null) {
                                                                        if (aU.charCodeAt(bN) === 62) {
                                                                            c7 = ">";
                                                                            bN++
                                                                        } else {
                                                                            c7 = null;
                                                                            if (T === 0) {
                                                                                at('">"')
                                                                            }
                                                                        }
                                                                        if (c7 === null) {
                                                                            if (aU.charCodeAt(bN) === 58) {
                                                                                c7 = ":";
                                                                                bN++
                                                                            } else {
                                                                                c7 = null;
                                                                                if (T === 0) {
                                                                                    at('":"')
                                                                                }
                                                                            }
                                                                            if (c7 === null) {
                                                                                if (aU.charCodeAt(bN) === 92) {
                                                                                    c7 = "\\";
                                                                                    bN++
                                                                                } else {
                                                                                    c7 = null;
                                                                                    if (T === 0) {
                                                                                        at('"\\\\"')
                                                                                    }
                                                                                }
                                                                                if (c7 === null) {
                                                                                    c7 = cu();
                                                                                    if (c7 === null) {
                                                                                        if (aU.charCodeAt(bN) === 47) {
                                                                                            c7 = "/";
                                                                                            bN++
                                                                                        } else {
                                                                                            c7 = null;
                                                                                            if (T === 0) {
                                                                                                at('"/"')
                                                                                            }
                                                                                        }
                                                                                        if (c7 === null) {
                                                                                            if (aU.charCodeAt(bN) === 91) {
                                                                                                c7 = "[";
                                                                                                bN++
                                                                                            } else {
                                                                                                c7 = null;
                                                                                                if (T === 0) {
                                                                                                    at('"["')
                                                                                                }
                                                                                            }
                                                                                            if (c7 === null) {
                                                                                                if (aU.charCodeAt(bN) === 93) {
                                                                                                    c7 = "]";
                                                                                                    bN++
                                                                                                } else {
                                                                                                    c7 = null;
                                                                                                    if (T === 0) {
                                                                                                        at('"]"')
                                                                                                    }
                                                                                                }
                                                                                                if (c7 === null) {
                                                                                                    if (aU.charCodeAt(bN) === 63) {
                                                                                                        c7 = "?";
                                                                                                        bN++
                                                                                                    } else {
                                                                                                        c7 = null;
                                                                                                        if (T === 0) {
                                                                                                            at('"?"')
                                                                                                        }
                                                                                                    }
                                                                                                    if (c7 === null) {
                                                                                                        if (aU.charCodeAt(bN) === 123) {
                                                                                                            c7 = "{";
                                                                                                            bN++
                                                                                                        } else {
                                                                                                            c7 = null;
                                                                                                            if (T === 0) {
                                                                                                                at('"{"')
                                                                                                            }
                                                                                                        }
                                                                                                        if (c7 === null) {
                                                                                                            if (aU.charCodeAt(bN) === 125) {
                                                                                                                c7 = "}";
                                                                                                                bN++
                                                                                                            } else {
                                                                                                                c7 = null;
                                                                                                                if (T === 0) {
                                                                                                                    at('"}"')
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (c7 !== null) {
                    c8 = [];
                    while (c7 !== null) {
                        c8.push(c7);
                        c7 = aC();
                        if (c7 === null) {
                            if (aU.charCodeAt(bN) === 45) {
                                c7 = "-";
                                bN++
                            } else {
                                c7 = null;
                                if (T === 0) {
                                    at('"-"')
                                }
                            }
                            if (c7 === null) {
                                if (aU.charCodeAt(bN) === 46) {
                                    c7 = ".";
                                    bN++
                                } else {
                                    c7 = null;
                                    if (T === 0) {
                                        at('"."')
                                    }
                                }
                                if (c7 === null) {
                                    if (aU.charCodeAt(bN) === 33) {
                                        c7 = "!";
                                        bN++
                                    } else {
                                        c7 = null;
                                        if (T === 0) {
                                            at('"!"')
                                        }
                                    }
                                    if (c7 === null) {
                                        if (aU.charCodeAt(bN) === 37) {
                                            c7 = "%";
                                            bN++
                                        } else {
                                            c7 = null;
                                            if (T === 0) {
                                                at('"%"')
                                            }
                                        }
                                        if (c7 === null) {
                                            if (aU.charCodeAt(bN) === 42) {
                                                c7 = "*";
                                                bN++
                                            } else {
                                                c7 = null;
                                                if (T === 0) {
                                                    at('"*"')
                                                }
                                            }
                                            if (c7 === null) {
                                                if (aU.charCodeAt(bN) === 95) {
                                                    c7 = "_";
                                                    bN++
                                                } else {
                                                    c7 = null;
                                                    if (T === 0) {
                                                        at('"_"')
                                                    }
                                                }
                                                if (c7 === null) {
                                                    if (aU.charCodeAt(bN) === 43) {
                                                        c7 = "+";
                                                        bN++
                                                    } else {
                                                        c7 = null;
                                                        if (T === 0) {
                                                            at('"+"')
                                                        }
                                                    }
                                                    if (c7 === null) {
                                                        if (aU.charCodeAt(bN) === 96) {
                                                            c7 = "`";
                                                            bN++
                                                        } else {
                                                            c7 = null;
                                                            if (T === 0) {
                                                                at('"`"')
                                                            }
                                                        }
                                                        if (c7 === null) {
                                                            if (aU.charCodeAt(bN) === 39) {
                                                                c7 = "'";
                                                                bN++
                                                            } else {
                                                                c7 = null;
                                                                if (T === 0) {
                                                                    at('"\'"')
                                                                }
                                                            }
                                                            if (c7 === null) {
                                                                if (aU.charCodeAt(bN) === 126) {
                                                                    c7 = "~";
                                                                    bN++
                                                                } else {
                                                                    c7 = null;
                                                                    if (T === 0) {
                                                                        at('"~"')
                                                                    }
                                                                }
                                                                if (c7 === null) {
                                                                    if (aU.charCodeAt(bN) === 40) {
                                                                        c7 = "(";
                                                                        bN++
                                                                    } else {
                                                                        c7 = null;
                                                                        if (T === 0) {
                                                                            at('"("')
                                                                        }
                                                                    }
                                                                    if (c7 === null) {
                                                                        if (aU.charCodeAt(bN) === 41) {
                                                                            c7 = ")";
                                                                            bN++
                                                                        } else {
                                                                            c7 = null;
                                                                            if (T === 0) {
                                                                                at('")"')
                                                                            }
                                                                        }
                                                                        if (c7 === null) {
                                                                            if (aU.charCodeAt(bN) === 60) {
                                                                                c7 = "<";
                                                                                bN++
                                                                            } else {
                                                                                c7 = null;
                                                                                if (T === 0) {
                                                                                    at('"<"')
                                                                                }
                                                                            }
                                                                            if (c7 === null) {
                                                                                if (aU.charCodeAt(bN) === 62) {
                                                                                    c7 = ">";
                                                                                    bN++
                                                                                } else {
                                                                                    c7 = null;
                                                                                    if (T === 0) {
                                                                                        at('">"')
                                                                                    }
                                                                                }
                                                                                if (c7 === null) {
                                                                                    if (aU.charCodeAt(bN) === 58) {
                                                                                        c7 = ":";
                                                                                        bN++
                                                                                    } else {
                                                                                        c7 = null;
                                                                                        if (T === 0) {
                                                                                            at('":"')
                                                                                        }
                                                                                    }
                                                                                    if (c7 === null) {
                                                                                        if (aU.charCodeAt(bN) === 92) {
                                                                                            c7 = "\\";
                                                                                            bN++
                                                                                        } else {
                                                                                            c7 = null;
                                                                                            if (T === 0) {
                                                                                                at('"\\\\"')
                                                                                            }
                                                                                        }
                                                                                        if (c7 === null) {
                                                                                            c7 = cu();
                                                                                            if (c7 === null) {
                                                                                                if (aU.charCodeAt(bN) === 47) {
                                                                                                    c7 = "/";
                                                                                                    bN++
                                                                                                } else {
                                                                                                    c7 = null;
                                                                                                    if (T === 0) {
                                                                                                        at('"/"')
                                                                                                    }
                                                                                                }
                                                                                                if (c7 === null) {
                                                                                                    if (aU.charCodeAt(bN) === 91) {
                                                                                                        c7 = "[";
                                                                                                        bN++
                                                                                                    } else {
                                                                                                        c7 = null;
                                                                                                        if (T === 0) {
                                                                                                            at('"["')
                                                                                                        }
                                                                                                    }
                                                                                                    if (c7 === null) {
                                                                                                        if (aU.charCodeAt(bN) === 93) {
                                                                                                            c7 = "]";
                                                                                                            bN++
                                                                                                        } else {
                                                                                                            c7 = null;
                                                                                                            if (T === 0) {
                                                                                                                at('"]"')
                                                                                                            }
                                                                                                        }
                                                                                                        if (c7 === null) {
                                                                                                            if (aU.charCodeAt(bN) === 63) {
                                                                                                                c7 = "?";
                                                                                                                bN++
                                                                                                            } else {
                                                                                                                c7 = null;
                                                                                                                if (T === 0) {
                                                                                                                    at('"?"')
                                                                                                                }
                                                                                                            }
                                                                                                            if (c7 === null) {
                                                                                                                if (aU.charCodeAt(bN) === 123) {
                                                                                                                    c7 = "{";
                                                                                                                    bN++
                                                                                                                } else {
                                                                                                                    c7 = null;
                                                                                                                    if (T === 0) {
                                                                                                                        at('"{"')
                                                                                                                    }
                                                                                                                }
                                                                                                                if (c7 === null) {
                                                                                                                    if (aU.charCodeAt(bN) === 125) {
                                                                                                                        c7 = "}";
                                                                                                                        bN++
                                                                                                                    } else {
                                                                                                                        c7 = null;
                                                                                                                        if (T === 0) {
                                                                                                                            at('"}"')
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    c8 = null
                }
                if (c8 !== null) {
                    c8 = (function (da) {
                        return aU.substring(bN, da)
                    })(c9)
                }
                if (c8 === null) {
                    bN = c9
                }
                return c8
            }
            function aO() {
                var da, c8, c7;
                var db, c9;
                db = bN;
                c9 = bN;
                da = ak();
                if (da !== null) {
                    if (aU.charCodeAt(bN) === 42) {
                        c8 = "*";
                        bN++
                    } else {
                        c8 = null;
                        if (T === 0) {
                            at('"*"')
                        }
                    }
                    if (c8 !== null) {
                        c7 = ak();
                        if (c7 !== null) {
                            da = [da, c8, c7]
                        } else {
                            da = null;
                            bN = c9
                        }
                    } else {
                        da = null;
                        bN = c9
                    }
                } else {
                    da = null;
                    bN = c9
                }
                if (da !== null) {
                    da = (function (dc) {
                        return "*"
                    })(db)
                }
                if (da === null) {
                    bN = db
                }
                return da
            }
            function au() {
                var da, c8, c7;
                var db, c9;
                db = bN;
                c9 = bN;
                da = ak();
                if (da !== null) {
                    if (aU.charCodeAt(bN) === 47) {
                        c8 = "/";
                        bN++
                    } else {
                        c8 = null;
                        if (T === 0) {
                            at('"/"')
                        }
                    }
                    if (c8 !== null) {
                        c7 = ak();
                        if (c7 !== null) {
                            da = [da, c8, c7]
                        } else {
                            da = null;
                            bN = c9
                        }
                    } else {
                        da = null;
                        bN = c9
                    }
                } else {
                    da = null;
                    bN = c9
                }
                if (da !== null) {
                    da = (function (dc) {
                        return "/"
                    })(db)
                }
                if (da === null) {
                    bN = db
                }
                return da
            }
            function bw() {
                var da, c8, c7;
                var db, c9;
                db = bN;
                c9 = bN;
                da = ak();
                if (da !== null) {
                    if (aU.charCodeAt(bN) === 61) {
                        c8 = "=";
                        bN++
                    } else {
                        c8 = null;
                        if (T === 0) {
                            at('"="')
                        }
                    }
                    if (c8 !== null) {
                        c7 = ak();
                        if (c7 !== null) {
                            da = [da, c8, c7]
                        } else {
                            da = null;
                            bN = c9
                        }
                    } else {
                        da = null;
                        bN = c9
                    }
                } else {
                    da = null;
                    bN = c9
                }
                if (da !== null) {
                    da = (function (dc) {
                        return "="
                    })(db)
                }
                if (da === null) {
                    bN = db
                }
                return da
            }
            function bp() {
                var da, c8, c7;
                var db, c9;
                db = bN;
                c9 = bN;
                da = ak();
                if (da !== null) {
                    if (aU.charCodeAt(bN) === 40) {
                        c8 = "(";
                        bN++
                    } else {
                        c8 = null;
                        if (T === 0) {
                            at('"("')
                        }
                    }
                    if (c8 !== null) {
                        c7 = ak();
                        if (c7 !== null) {
                            da = [da, c8, c7]
                        } else {
                            da = null;
                            bN = c9
                        }
                    } else {
                        da = null;
                        bN = c9
                    }
                } else {
                    da = null;
                    bN = c9
                }
                if (da !== null) {
                    da = (function (dc) {
                        return "("
                    })(db)
                }
                if (da === null) {
                    bN = db
                }
                return da
            }
            function A() {
                var da, c8, c7;
                var db, c9;
                db = bN;
                c9 = bN;
                da = ak();
                if (da !== null) {
                    if (aU.charCodeAt(bN) === 41) {
                        c8 = ")";
                        bN++
                    } else {
                        c8 = null;
                        if (T === 0) {
                            at('")"')
                        }
                    }
                    if (c8 !== null) {
                        c7 = ak();
                        if (c7 !== null) {
                            da = [da, c8, c7]
                        } else {
                            da = null;
                            bN = c9
                        }
                    } else {
                        da = null;
                        bN = c9
                    }
                } else {
                    da = null;
                    bN = c9
                }
                if (da !== null) {
                    da = (function (dc) {
                        return ")"
                    })(db)
                }
                if (da === null) {
                    bN = db
                }
                return da
            }
            function a4() {
                var c9, c7;
                var da, c8;
                da = bN;
                c8 = bN;
                if (aU.charCodeAt(bN) === 62) {
                    c9 = ">";
                    bN++
                } else {
                    c9 = null;
                    if (T === 0) {
                        at('">"')
                    }
                }
                if (c9 !== null) {
                    c7 = ak();
                    if (c7 !== null) {
                        c9 = [c9, c7]
                    } else {
                        c9 = null;
                        bN = c8
                    }
                } else {
                    c9 = null;
                    bN = c8
                }
                if (c9 !== null) {
                    c9 = (function (db) {
                        return ">"
                    })(da)
                }
                if (c9 === null) {
                    bN = da
                }
                return c9
            }
            function cD() {
                var c9, c7;
                var da, c8;
                da = bN;
                c8 = bN;
                c9 = ak();
                if (c9 !== null) {
                    if (aU.charCodeAt(bN) === 60) {
                        c7 = "<";
                        bN++
                    } else {
                        c7 = null;
                        if (T === 0) {
                            at('"<"')
                        }
                    }
                    if (c7 !== null) {
                        c9 = [c9, c7]
                    } else {
                        c9 = null;
                        bN = c8
                    }
                } else {
                    c9 = null;
                    bN = c8
                }
                if (c9 !== null) {
                    c9 = (function (db) {
                        return "<"
                    })(da)
                }
                if (c9 === null) {
                    bN = da
                }
                return c9
            }
            function co() {
                var da, c8, c7;
                var db, c9;
                db = bN;
                c9 = bN;
                da = ak();
                if (da !== null) {
                    if (aU.charCodeAt(bN) === 44) {
                        c8 = ",";
                        bN++
                    } else {
                        c8 = null;
                        if (T === 0) {
                            at('","')
                        }
                    }
                    if (c8 !== null) {
                        c7 = ak();
                        if (c7 !== null) {
                            da = [da, c8, c7]
                        } else {
                            da = null;
                            bN = c9
                        }
                    } else {
                        da = null;
                        bN = c9
                    }
                } else {
                    da = null;
                    bN = c9
                }
                if (da !== null) {
                    da = (function (dc) {
                        return ","
                    })(db)
                }
                if (da === null) {
                    bN = db
                }
                return da
            }
            function w() {
                var da, c8, c7;
                var db, c9;
                db = bN;
                c9 = bN;
                da = ak();
                if (da !== null) {
                    if (aU.charCodeAt(bN) === 59) {
                        c8 = ";";
                        bN++
                    } else {
                        c8 = null;
                        if (T === 0) {
                            at('";"')
                        }
                    }
                    if (c8 !== null) {
                        c7 = ak();
                        if (c7 !== null) {
                            da = [da, c8, c7]
                        } else {
                            da = null;
                            bN = c9
                        }
                    } else {
                        da = null;
                        bN = c9
                    }
                } else {
                    da = null;
                    bN = c9
                }
                if (da !== null) {
                    da = (function (dc) {
                        return ";"
                    })(db)
                }
                if (da === null) {
                    bN = db
                }
                return da
            }
            function N() {
                var da, c8, c7;
                var db, c9;
                db = bN;
                c9 = bN;
                da = ak();
                if (da !== null) {
                    if (aU.charCodeAt(bN) === 58) {
                        c8 = ":";
                        bN++
                    } else {
                        c8 = null;
                        if (T === 0) {
                            at('":"')
                        }
                    }
                    if (c8 !== null) {
                        c7 = ak();
                        if (c7 !== null) {
                            da = [da, c8, c7]
                        } else {
                            da = null;
                            bN = c9
                        }
                    } else {
                        da = null;
                        bN = c9
                    }
                } else {
                    da = null;
                    bN = c9
                }
                if (da !== null) {
                    da = (function (dc) {
                        return ":"
                    })(db)
                }
                if (da === null) {
                    bN = db
                }
                return da
            }
            function s() {
                var c9, c7;
                var da, c8;
                da = bN;
                c8 = bN;
                c9 = ak();
                if (c9 !== null) {
                    c7 = cu();
                    if (c7 !== null) {
                        c9 = [c9, c7]
                    } else {
                        c9 = null;
                        bN = c8
                    }
                } else {
                    c9 = null;
                    bN = c8
                }
                if (c9 !== null) {
                    c9 = (function (db) {
                        return '"'
                    })(da)
                }
                if (c9 === null) {
                    bN = da
                }
                return c9
            }
            function bx() {
                var c9, c7;
                var da, c8;
                da = bN;
                c8 = bN;
                c9 = cu();
                if (c9 !== null) {
                    c7 = ak();
                    if (c7 !== null) {
                        c9 = [c9, c7]
                    } else {
                        c9 = null;
                        bN = c8
                    }
                } else {
                    c9 = null;
                    bN = c8
                }
                if (c9 !== null) {
                    c9 = (function (db) {
                        return '"'
                    })(da)
                }
                if (c9 === null) {
                    bN = da
                }
                return c9
            }
            function cn() {
                var c9, c8, c7;
                var da;
                da = bN;
                c9 = bp();
                if (c9 !== null) {
                    c8 = [];
                    c7 = k();
                    if (c7 === null) {
                        c7 = am();
                        if (c7 === null) {
                            c7 = cn()
                        }
                    }
                    while (c7 !== null) {
                        c8.push(c7);
                        c7 = k();
                        if (c7 === null) {
                            c7 = am();
                            if (c7 === null) {
                                c7 = cn()
                            }
                        }
                    }
                    if (c8 !== null) {
                        c7 = A();
                        if (c7 !== null) {
                            c9 = [c9, c8, c7]
                        } else {
                            c9 = null;
                            bN = da
                        }
                    } else {
                        c9 = null;
                        bN = da
                    }
                } else {
                    c9 = null;
                    bN = da
                }
                return c9
            }
            function k() {
                var c7;
                if (/^[!-']/.test(aU.charAt(bN))) {
                    c7 = aU.charAt(bN);
                    bN++
                } else {
                    c7 = null;
                    if (T === 0) {
                        at("[!-']")
                    }
                }
                if (c7 === null) {
                    if (/^[*-[]/.test(aU.charAt(bN))) {
                        c7 = aU.charAt(bN);
                        bN++
                    } else {
                        c7 = null;
                        if (T === 0) {
                            at("[*-[]")
                        }
                    }
                    if (c7 === null) {
                        if (/^[\]-~]/.test(aU.charAt(bN))) {
                            c7 = aU.charAt(bN);
                            bN++
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at("[\\]-~]")
                            }
                        }
                        if (c7 === null) {
                            c7 = by();
                            if (c7 === null) {
                                c7 = ck()
                            }
                        }
                    }
                }
                return c7
            }
            function cO() {
                var db, c9, c8, c7;
                var dc, da;
                dc = bN;
                da = bN;
                db = ak();
                if (db !== null) {
                    c9 = cu();
                    if (c9 !== null) {
                        c8 = [];
                        c7 = bn();
                        if (c7 === null) {
                            c7 = am()
                        }
                        while (c7 !== null) {
                            c8.push(c7);
                            c7 = bn();
                            if (c7 === null) {
                                c7 = am()
                            }
                        }
                        if (c8 !== null) {
                            c7 = cu();
                            if (c7 !== null) {
                                db = [db, c9, c8, c7]
                            } else {
                                db = null;
                                bN = da
                            }
                        } else {
                            db = null;
                            bN = da
                        }
                    } else {
                        db = null;
                        bN = da
                    }
                } else {
                    db = null;
                    bN = da
                }
                if (db !== null) {
                    db = (function (dd) {
                        return aU.substring(bN, dd)
                    })(dc)
                }
                if (db === null) {
                    bN = dc
                }
                return db
            }
            function bn() {
                var c7;
                c7 = ck();
                if (c7 === null) {
                    if (aU.charCodeAt(bN) === 33) {
                        c7 = "!";
                        bN++
                    } else {
                        c7 = null;
                        if (T === 0) {
                            at('"!"')
                        }
                    }
                    if (c7 === null) {
                        if (/^[#-[]/.test(aU.charAt(bN))) {
                            c7 = aU.charAt(bN);
                            bN++
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at("[#-[]")
                            }
                        }
                        if (c7 === null) {
                            if (/^[\]-~]/.test(aU.charAt(bN))) {
                                c7 = aU.charAt(bN);
                                bN++
                            } else {
                                c7 = null;
                                if (T === 0) {
                                    at("[\\]-~]")
                                }
                            }
                            if (c7 === null) {
                                c7 = by()
                            }
                        }
                    }
                }
                return c7
            }
            function am() {
                var c8, c7;
                var c9;
                c9 = bN;
                if (aU.charCodeAt(bN) === 92) {
                    c8 = "\\";
                    bN++
                } else {
                    c8 = null;
                    if (T === 0) {
                        at('"\\\\"')
                    }
                }
                if (c8 !== null) {
                    if (/^[\0-\t]/.test(aU.charAt(bN))) {
                        c7 = aU.charAt(bN);
                        bN++
                    } else {
                        c7 = null;
                        if (T === 0) {
                            at("[\\0-\\t]")
                        }
                    }
                    if (c7 === null) {
                        if (/^[\x0B-\f]/.test(aU.charAt(bN))) {
                            c7 = aU.charAt(bN);
                            bN++
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at("[\\x0B-\\f]")
                            }
                        }
                        if (c7 === null) {
                            if (/^[\x0E-]/.test(aU.charAt(bN))) {
                                c7 = aU.charAt(bN);
                                bN++
                            } else {
                                c7 = null;
                                if (T === 0) {
                                    at("[\\x0E-]")
                                }
                            }
                        }
                    }
                    if (c7 !== null) {
                        c8 = [c8, c7]
                    } else {
                        c8 = null;
                        bN = c9
                    }
                } else {
                    c8 = null;
                    bN = c9
                }
                return c8
            }
            function M() {
                var db, c9, c8, c7;
                var dc, da;
                dc = bN;
                da = bN;
                db = cY();
                if (db !== null) {
                    if (aU.charCodeAt(bN) === 58) {
                        c9 = ":";
                        bN++
                    } else {
                        c9 = null;
                        if (T === 0) {
                            at('":"')
                        }
                    }
                    if (c9 !== null) {
                        c8 = bf();
                        c8 = c8 !== null ? c8 : "";
                        if (c8 !== null) {
                            c7 = b3();
                            if (c7 !== null) {
                                db = [db, c9, c8, c7]
                            } else {
                                db = null;
                                bN = da
                            }
                        } else {
                            db = null;
                            bN = da
                        }
                    } else {
                        db = null;
                        bN = da
                    }
                } else {
                    db = null;
                    bN = da
                }
                if (db !== null) {
                    db = (function (dd) {
                        bE.uri = aU.substring(bN, dd)
                    })(dc)
                }
                if (db === null) {
                    bN = dc
                }
                return db
            }
            function z() {
                var dd, db, da, c9, c8, c7;
                var de, dc;
                de = bN;
                dc = bN;
                dd = cY();
                if (dd !== null) {
                    if (aU.charCodeAt(bN) === 58) {
                        db = ":";
                        bN++
                    } else {
                        db = null;
                        if (T === 0) {
                            at('":"')
                        }
                    }
                    if (db !== null) {
                        da = bf();
                        da = da !== null ? da : "";
                        if (da !== null) {
                            c9 = b3();
                            if (c9 !== null) {
                                c8 = U();
                                if (c8 !== null) {
                                    c7 = ap();
                                    c7 = c7 !== null ? c7 : "";
                                    if (c7 !== null) {
                                        dd = [dd, db, da, c9, c8, c7]
                                    } else {
                                        dd = null;
                                        bN = dc
                                    }
                                } else {
                                    dd = null;
                                    bN = dc
                                }
                            } else {
                                dd = null;
                                bN = dc
                            }
                        } else {
                            dd = null;
                            bN = dc
                        }
                    } else {
                        dd = null;
                        bN = dc
                    }
                } else {
                    dd = null;
                    bN = dc
                }
                if (dd !== null) {
                    dd = (function (df) {
                        bE.uri = aU.substring(bN, df)
                    })(de)
                }
                if (dd === null) {
                    bN = de
                }
                return dd
            }
            function cY() {
                var c7;
                var c8;
                c8 = bN;
                if (aU.substr(bN, 3) === "sip") {
                    c7 = "sip";
                    bN += 3
                } else {
                    c7 = null;
                    if (T === 0) {
                        at('"sip"')
                    }
                }
                if (c7 !== null) {
                    c7 = (function (da, c9) {
                        bE.scheme = c9
                    })(c8, c7)
                }
                if (c7 === null) {
                    bN = c8
                }
                return c7
            }
            function bf() {
                var c8, c7;
                var c9;
                c9 = bN;
                c8 = c5();
                if (c8 !== null) {
                    if (aU.charCodeAt(bN) === 64) {
                        c7 = "@";
                        bN++
                    } else {
                        c7 = null;
                        if (T === 0) {
                            at('"@"')
                        }
                    }
                    if (c7 !== null) {
                        c8 = [c8, c7]
                    } else {
                        c8 = null;
                        bN = c9
                    }
                } else {
                    c8 = null;
                    bN = c9
                }
                return c8
            }
            function c5() {
                var c8, c7;
                var c9;
                c9 = bN;
                c7 = b7();
                if (c7 === null) {
                    c7 = Z();
                    if (c7 === null) {
                        c7 = B()
                    }
                }
                if (c7 !== null) {
                    c8 = [];
                    while (c7 !== null) {
                        c8.push(c7);
                        c7 = b7();
                        if (c7 === null) {
                            c7 = Z();
                            if (c7 === null) {
                                c7 = B()
                            }
                        }
                    }
                } else {
                    c8 = null
                }
                if (c8 !== null) {
                    c8 = (function (da) {
                        bE.user = aU.substring(bN, da)
                    })(c9)
                }
                if (c8 === null) {
                    bN = c9
                }
                return c8
            }
            function B() {
                var c7;
                if (aU.charCodeAt(bN) === 38) {
                    c7 = "&";
                    bN++
                } else {
                    c7 = null;
                    if (T === 0) {
                        at('"&"')
                    }
                }
                if (c7 === null) {
                    if (aU.charCodeAt(bN) === 61) {
                        c7 = "=";
                        bN++
                    } else {
                        c7 = null;
                        if (T === 0) {
                            at('"="')
                        }
                    }
                    if (c7 === null) {
                        if (aU.charCodeAt(bN) === 43) {
                            c7 = "+";
                            bN++
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at('"+"')
                            }
                        }
                        if (c7 === null) {
                            if (aU.charCodeAt(bN) === 36) {
                                c7 = "$";
                                bN++
                            } else {
                                c7 = null;
                                if (T === 0) {
                                    at('"$"')
                                }
                            }
                            if (c7 === null) {
                                if (aU.charCodeAt(bN) === 44) {
                                    c7 = ",";
                                    bN++
                                } else {
                                    c7 = null;
                                    if (T === 0) {
                                        at('","')
                                    }
                                }
                                if (c7 === null) {
                                    if (aU.charCodeAt(bN) === 59) {
                                        c7 = ";";
                                        bN++
                                    } else {
                                        c7 = null;
                                        if (T === 0) {
                                            at('";"')
                                        }
                                    }
                                    if (c7 === null) {
                                        if (aU.charCodeAt(bN) === 63) {
                                            c7 = "?";
                                            bN++
                                        } else {
                                            c7 = null;
                                            if (T === 0) {
                                                at('"?"')
                                            }
                                        }
                                        if (c7 === null) {
                                            if (aU.charCodeAt(bN) === 47) {
                                                c7 = "/";
                                                bN++
                                            } else {
                                                c7 = null;
                                                if (T === 0) {
                                                    at('"/"')
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return c7
            }
            function aj() {
                var c8, c7;
                c8 = [];
                c7 = b7();
                if (c7 === null) {
                    c7 = Z();
                    if (c7 === null) {
                        if (aU.charCodeAt(bN) === 38) {
                            c7 = "&";
                            bN++
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at('"&"')
                            }
                        }
                        if (c7 === null) {
                            if (aU.charCodeAt(bN) === 61) {
                                c7 = "=";
                                bN++
                            } else {
                                c7 = null;
                                if (T === 0) {
                                    at('"="')
                                }
                            }
                            if (c7 === null) {
                                if (aU.charCodeAt(bN) === 43) {
                                    c7 = "+";
                                    bN++
                                } else {
                                    c7 = null;
                                    if (T === 0) {
                                        at('"+"')
                                    }
                                }
                                if (c7 === null) {
                                    if (aU.charCodeAt(bN) === 36) {
                                        c7 = "$";
                                        bN++
                                    } else {
                                        c7 = null;
                                        if (T === 0) {
                                            at('"$"')
                                        }
                                    }
                                    if (c7 === null) {
                                        if (aU.charCodeAt(bN) === 44) {
                                            c7 = ",";
                                            bN++
                                        } else {
                                            c7 = null;
                                            if (T === 0) {
                                                at('","')
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                while (c7 !== null) {
                    c8.push(c7);
                    c7 = b7();
                    if (c7 === null) {
                        c7 = Z();
                        if (c7 === null) {
                            if (aU.charCodeAt(bN) === 38) {
                                c7 = "&";
                                bN++
                            } else {
                                c7 = null;
                                if (T === 0) {
                                    at('"&"')
                                }
                            }
                            if (c7 === null) {
                                if (aU.charCodeAt(bN) === 61) {
                                    c7 = "=";
                                    bN++
                                } else {
                                    c7 = null;
                                    if (T === 0) {
                                        at('"="')
                                    }
                                }
                                if (c7 === null) {
                                    if (aU.charCodeAt(bN) === 43) {
                                        c7 = "+";
                                        bN++
                                    } else {
                                        c7 = null;
                                        if (T === 0) {
                                            at('"+"')
                                        }
                                    }
                                    if (c7 === null) {
                                        if (aU.charCodeAt(bN) === 36) {
                                            c7 = "$";
                                            bN++
                                        } else {
                                            c7 = null;
                                            if (T === 0) {
                                                at('"$"')
                                            }
                                        }
                                        if (c7 === null) {
                                            if (aU.charCodeAt(bN) === 44) {
                                                c7 = ",";
                                                bN++
                                            } else {
                                                c7 = null;
                                                if (T === 0) {
                                                    at('","')
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return c8
            }
            function b3() {
                var da, c8, c7;
                var db, c9;
                db = bN;
                da = u();
                if (da !== null) {
                    c9 = bN;
                    if (aU.charCodeAt(bN) === 58) {
                        c8 = ":";
                        bN++
                    } else {
                        c8 = null;
                        if (T === 0) {
                            at('":"')
                        }
                    }
                    if (c8 !== null) {
                        c7 = ct();
                        if (c7 !== null) {
                            c8 = [c8, c7]
                        } else {
                            c8 = null;
                            bN = c9
                        }
                    } else {
                        c8 = null;
                        bN = c9
                    }
                    c8 = c8 !== null ? c8 : "";
                    if (c8 !== null) {
                        da = [da, c8]
                    } else {
                        da = null;
                        bN = db
                    }
                } else {
                    da = null;
                    bN = db
                }
                return da
            }
            function u() {
                var c7;
                var c8;
                c8 = bN;
                c7 = cs();
                if (c7 === null) {
                    c7 = b6();
                    if (c7 === null) {
                        c7 = aQ()
                    }
                }
                if (c7 !== null) {
                    c7 = (function (c9) {
                        bE.host = aU.substring(bN, c9)
                    })(c8)
                }
                if (c7 === null) {
                    bN = c8
                }
                return c7
            }
            function cs() {
                var db, c9, c7;
                var dc, da, c8;
                dc = bN;
                da = bN;
                db = [];
                c8 = bN;
                c9 = bL();
                if (c9 !== null) {
                    if (aU.charCodeAt(bN) === 46) {
                        c7 = ".";
                        bN++
                    } else {
                        c7 = null;
                        if (T === 0) {
                            at('"."')
                        }
                    }
                    if (c7 !== null) {
                        c9 = [c9, c7]
                    } else {
                        c9 = null;
                        bN = c8
                    }
                } else {
                    c9 = null;
                    bN = c8
                }
                while (c9 !== null) {
                    db.push(c9);
                    c8 = bN;
                    c9 = bL();
                    if (c9 !== null) {
                        if (aU.charCodeAt(bN) === 46) {
                            c7 = ".";
                            bN++
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at('"."')
                            }
                        }
                        if (c7 !== null) {
                            c9 = [c9, c7]
                        } else {
                            c9 = null;
                            bN = c8
                        }
                    } else {
                        c9 = null;
                        bN = c8
                    }
                }
                if (db !== null) {
                    c9 = ad();
                    if (c9 !== null) {
                        if (aU.charCodeAt(bN) === 46) {
                            c7 = ".";
                            bN++
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at('"."')
                            }
                        }
                        c7 = c7 !== null ? c7 : "";
                        if (c7 !== null) {
                            db = [db, c9, c7]
                        } else {
                            db = null;
                            bN = da
                        }
                    } else {
                        db = null;
                        bN = da
                    }
                } else {
                    db = null;
                    bN = da
                }
                if (db !== null) {
                    db = (function (dd) {
                        bE.host_type = "domain";
                        return aU.substring(bN, dd)
                    })(dc)
                }
                if (db === null) {
                    bN = dc
                }
                return db
            }
            function bL() {
                var c8, c7;
                if (/^[a-zA-Z0-9_\-]/.test(aU.charAt(bN))) {
                    c7 = aU.charAt(bN);
                    bN++
                } else {
                    c7 = null;
                    if (T === 0) {
                        at("[a-zA-Z0-9_\\-]")
                    }
                }
                if (c7 !== null) {
                    c8 = [];
                    while (c7 !== null) {
                        c8.push(c7);
                        if (/^[a-zA-Z0-9_\-]/.test(aU.charAt(bN))) {
                            c7 = aU.charAt(bN);
                            bN++
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at("[a-zA-Z0-9_\\-]")
                            }
                        }
                    }
                } else {
                    c8 = null
                }
                return c8
            }
            function ad() {
                var c8, c7;
                if (/^[a-zA-Z_\-]/.test(aU.charAt(bN))) {
                    c7 = aU.charAt(bN);
                    bN++
                } else {
                    c7 = null;
                    if (T === 0) {
                        at("[a-zA-Z_\\-]")
                    }
                }
                if (c7 !== null) {
                    c8 = [];
                    while (c7 !== null) {
                        c8.push(c7);
                        if (/^[a-zA-Z_\-]/.test(aU.charAt(bN))) {
                            c7 = aU.charAt(bN);
                            bN++
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at("[a-zA-Z_\\-]")
                            }
                        }
                    }
                } else {
                    c8 = null
                }
                return c8
            }
            function aQ() {
                var da, c8, c7;
                var db, c9;
                db = bN;
                c9 = bN;
                if (aU.charCodeAt(bN) === 91) {
                    da = "[";
                    bN++
                } else {
                    da = null;
                    if (T === 0) {
                        at('"["')
                    }
                }
                if (da !== null) {
                    c8 = aS();
                    if (c8 !== null) {
                        if (aU.charCodeAt(bN) === 93) {
                            c7 = "]";
                            bN++
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at('"]"')
                            }
                        }
                        if (c7 !== null) {
                            da = [da, c8, c7]
                        } else {
                            da = null;
                            bN = c9
                        }
                    } else {
                        da = null;
                        bN = c9
                    }
                } else {
                    da = null;
                    bN = c9
                }
                if (da !== null) {
                    da = (function (dc) {
                        bE.host_type = "IPv6";
                        return aU.substring(bN, dc)
                    })(db)
                }
                if (da === null) {
                    bN = db
                }
                return da
            }
            function aS() {
                var dh, dg, df, dd, db, c9, c8, c7, dm, dl, de, dc, da;
                var dk, dj, di;
                dk = bN;
                dj = bN;
                dh = b1();
                if (dh !== null) {
                    if (aU.charCodeAt(bN) === 58) {
                        dg = ":";
                        bN++
                    } else {
                        dg = null;
                        if (T === 0) {
                            at('":"')
                        }
                    }
                    if (dg !== null) {
                        df = b1();
                        if (df !== null) {
                            if (aU.charCodeAt(bN) === 58) {
                                dd = ":";
                                bN++
                            } else {
                                dd = null;
                                if (T === 0) {
                                    at('":"')
                                }
                            }
                            if (dd !== null) {
                                db = b1();
                                if (db !== null) {
                                    if (aU.charCodeAt(bN) === 58) {
                                        c9 = ":";
                                        bN++
                                    } else {
                                        c9 = null;
                                        if (T === 0) {
                                            at('":"')
                                        }
                                    }
                                    if (c9 !== null) {
                                        c8 = b1();
                                        if (c8 !== null) {
                                            if (aU.charCodeAt(bN) === 58) {
                                                c7 = ":";
                                                bN++
                                            } else {
                                                c7 = null;
                                                if (T === 0) {
                                                    at('":"')
                                                }
                                            }
                                            if (c7 !== null) {
                                                dm = b1();
                                                if (dm !== null) {
                                                    if (aU.charCodeAt(bN) === 58) {
                                                        dl = ":";
                                                        bN++
                                                    } else {
                                                        dl = null;
                                                        if (T === 0) {
                                                            at('":"')
                                                        }
                                                    }
                                                    if (dl !== null) {
                                                        de = b1();
                                                        if (de !== null) {
                                                            if (aU.charCodeAt(bN) === 58) {
                                                                dc = ":";
                                                                bN++
                                                            } else {
                                                                dc = null;
                                                                if (T === 0) {
                                                                    at('":"')
                                                                }
                                                            }
                                                            if (dc !== null) {
                                                                da = ac();
                                                                if (da !== null) {
                                                                    dh = [dh, dg, df, dd, db, c9, c8, c7, dm, dl, de, dc, da]
                                                                } else {
                                                                    dh = null;
                                                                    bN = dj
                                                                }
                                                            } else {
                                                                dh = null;
                                                                bN = dj
                                                            }
                                                        } else {
                                                            dh = null;
                                                            bN = dj
                                                        }
                                                    } else {
                                                        dh = null;
                                                        bN = dj
                                                    }
                                                } else {
                                                    dh = null;
                                                    bN = dj
                                                }
                                            } else {
                                                dh = null;
                                                bN = dj
                                            }
                                        } else {
                                            dh = null;
                                            bN = dj
                                        }
                                    } else {
                                        dh = null;
                                        bN = dj
                                    }
                                } else {
                                    dh = null;
                                    bN = dj
                                }
                            } else {
                                dh = null;
                                bN = dj
                            }
                        } else {
                            dh = null;
                            bN = dj
                        }
                    } else {
                        dh = null;
                        bN = dj
                    }
                } else {
                    dh = null;
                    bN = dj
                }
                if (dh === null) {
                    dj = bN;
                    if (aU.substr(bN, 2) === "::") {
                        dh = "::";
                        bN += 2
                    } else {
                        dh = null;
                        if (T === 0) {
                            at('"::"')
                        }
                    }
                    if (dh !== null) {
                        dg = b1();
                        if (dg !== null) {
                            if (aU.charCodeAt(bN) === 58) {
                                df = ":";
                                bN++
                            } else {
                                df = null;
                                if (T === 0) {
                                    at('":"')
                                }
                            }
                            if (df !== null) {
                                dd = b1();
                                if (dd !== null) {
                                    if (aU.charCodeAt(bN) === 58) {
                                        db = ":";
                                        bN++
                                    } else {
                                        db = null;
                                        if (T === 0) {
                                            at('":"')
                                        }
                                    }
                                    if (db !== null) {
                                        c9 = b1();
                                        if (c9 !== null) {
                                            if (aU.charCodeAt(bN) === 58) {
                                                c8 = ":";
                                                bN++
                                            } else {
                                                c8 = null;
                                                if (T === 0) {
                                                    at('":"')
                                                }
                                            }
                                            if (c8 !== null) {
                                                c7 = b1();
                                                if (c7 !== null) {
                                                    if (aU.charCodeAt(bN) === 58) {
                                                        dm = ":";
                                                        bN++
                                                    } else {
                                                        dm = null;
                                                        if (T === 0) {
                                                            at('":"')
                                                        }
                                                    }
                                                    if (dm !== null) {
                                                        dl = b1();
                                                        if (dl !== null) {
                                                            if (aU.charCodeAt(bN) === 58) {
                                                                de = ":";
                                                                bN++
                                                            } else {
                                                                de = null;
                                                                if (T === 0) {
                                                                    at('":"')
                                                                }
                                                            }
                                                            if (de !== null) {
                                                                dc = ac();
                                                                if (dc !== null) {
                                                                    dh = [dh, dg, df, dd, db, c9, c8, c7, dm, dl, de, dc]
                                                                } else {
                                                                    dh = null;
                                                                    bN = dj
                                                                }
                                                            } else {
                                                                dh = null;
                                                                bN = dj
                                                            }
                                                        } else {
                                                            dh = null;
                                                            bN = dj
                                                        }
                                                    } else {
                                                        dh = null;
                                                        bN = dj
                                                    }
                                                } else {
                                                    dh = null;
                                                    bN = dj
                                                }
                                            } else {
                                                dh = null;
                                                bN = dj
                                            }
                                        } else {
                                            dh = null;
                                            bN = dj
                                        }
                                    } else {
                                        dh = null;
                                        bN = dj
                                    }
                                } else {
                                    dh = null;
                                    bN = dj
                                }
                            } else {
                                dh = null;
                                bN = dj
                            }
                        } else {
                            dh = null;
                            bN = dj
                        }
                    } else {
                        dh = null;
                        bN = dj
                    }
                    if (dh === null) {
                        dj = bN;
                        if (aU.substr(bN, 2) === "::") {
                            dh = "::";
                            bN += 2
                        } else {
                            dh = null;
                            if (T === 0) {
                                at('"::"')
                            }
                        }
                        if (dh !== null) {
                            dg = b1();
                            if (dg !== null) {
                                if (aU.charCodeAt(bN) === 58) {
                                    df = ":";
                                    bN++
                                } else {
                                    df = null;
                                    if (T === 0) {
                                        at('":"')
                                    }
                                }
                                if (df !== null) {
                                    dd = b1();
                                    if (dd !== null) {
                                        if (aU.charCodeAt(bN) === 58) {
                                            db = ":";
                                            bN++
                                        } else {
                                            db = null;
                                            if (T === 0) {
                                                at('":"')
                                            }
                                        }
                                        if (db !== null) {
                                            c9 = b1();
                                            if (c9 !== null) {
                                                if (aU.charCodeAt(bN) === 58) {
                                                    c8 = ":";
                                                    bN++
                                                } else {
                                                    c8 = null;
                                                    if (T === 0) {
                                                        at('":"')
                                                    }
                                                }
                                                if (c8 !== null) {
                                                    c7 = b1();
                                                    if (c7 !== null) {
                                                        if (aU.charCodeAt(bN) === 58) {
                                                            dm = ":";
                                                            bN++
                                                        } else {
                                                            dm = null;
                                                            if (T === 0) {
                                                                at('":"')
                                                            }
                                                        }
                                                        if (dm !== null) {
                                                            dl = ac();
                                                            if (dl !== null) {
                                                                dh = [dh, dg, df, dd, db, c9, c8, c7, dm, dl]
                                                            } else {
                                                                dh = null;
                                                                bN = dj
                                                            }
                                                        } else {
                                                            dh = null;
                                                            bN = dj
                                                        }
                                                    } else {
                                                        dh = null;
                                                        bN = dj
                                                    }
                                                } else {
                                                    dh = null;
                                                    bN = dj
                                                }
                                            } else {
                                                dh = null;
                                                bN = dj
                                            }
                                        } else {
                                            dh = null;
                                            bN = dj
                                        }
                                    } else {
                                        dh = null;
                                        bN = dj
                                    }
                                } else {
                                    dh = null;
                                    bN = dj
                                }
                            } else {
                                dh = null;
                                bN = dj
                            }
                        } else {
                            dh = null;
                            bN = dj
                        }
                        if (dh === null) {
                            dj = bN;
                            if (aU.substr(bN, 2) === "::") {
                                dh = "::";
                                bN += 2
                            } else {
                                dh = null;
                                if (T === 0) {
                                    at('"::"')
                                }
                            }
                            if (dh !== null) {
                                dg = b1();
                                if (dg !== null) {
                                    if (aU.charCodeAt(bN) === 58) {
                                        df = ":";
                                        bN++
                                    } else {
                                        df = null;
                                        if (T === 0) {
                                            at('":"')
                                        }
                                    }
                                    if (df !== null) {
                                        dd = b1();
                                        if (dd !== null) {
                                            if (aU.charCodeAt(bN) === 58) {
                                                db = ":";
                                                bN++
                                            } else {
                                                db = null;
                                                if (T === 0) {
                                                    at('":"')
                                                }
                                            }
                                            if (db !== null) {
                                                c9 = b1();
                                                if (c9 !== null) {
                                                    if (aU.charCodeAt(bN) === 58) {
                                                        c8 = ":";
                                                        bN++
                                                    } else {
                                                        c8 = null;
                                                        if (T === 0) {
                                                            at('":"')
                                                        }
                                                    }
                                                    if (c8 !== null) {
                                                        c7 = ac();
                                                        if (c7 !== null) {
                                                            dh = [dh, dg, df, dd, db, c9, c8, c7]
                                                        } else {
                                                            dh = null;
                                                            bN = dj
                                                        }
                                                    } else {
                                                        dh = null;
                                                        bN = dj
                                                    }
                                                } else {
                                                    dh = null;
                                                    bN = dj
                                                }
                                            } else {
                                                dh = null;
                                                bN = dj
                                            }
                                        } else {
                                            dh = null;
                                            bN = dj
                                        }
                                    } else {
                                        dh = null;
                                        bN = dj
                                    }
                                } else {
                                    dh = null;
                                    bN = dj
                                }
                            } else {
                                dh = null;
                                bN = dj
                            }
                            if (dh === null) {
                                dj = bN;
                                if (aU.substr(bN, 2) === "::") {
                                    dh = "::";
                                    bN += 2
                                } else {
                                    dh = null;
                                    if (T === 0) {
                                        at('"::"')
                                    }
                                }
                                if (dh !== null) {
                                    dg = b1();
                                    if (dg !== null) {
                                        if (aU.charCodeAt(bN) === 58) {
                                            df = ":";
                                            bN++
                                        } else {
                                            df = null;
                                            if (T === 0) {
                                                at('":"')
                                            }
                                        }
                                        if (df !== null) {
                                            dd = b1();
                                            if (dd !== null) {
                                                if (aU.charCodeAt(bN) === 58) {
                                                    db = ":";
                                                    bN++
                                                } else {
                                                    db = null;
                                                    if (T === 0) {
                                                        at('":"')
                                                    }
                                                }
                                                if (db !== null) {
                                                    c9 = ac();
                                                    if (c9 !== null) {
                                                        dh = [dh, dg, df, dd, db, c9]
                                                    } else {
                                                        dh = null;
                                                        bN = dj
                                                    }
                                                } else {
                                                    dh = null;
                                                    bN = dj
                                                }
                                            } else {
                                                dh = null;
                                                bN = dj
                                            }
                                        } else {
                                            dh = null;
                                            bN = dj
                                        }
                                    } else {
                                        dh = null;
                                        bN = dj
                                    }
                                } else {
                                    dh = null;
                                    bN = dj
                                }
                                if (dh === null) {
                                    dj = bN;
                                    if (aU.substr(bN, 2) === "::") {
                                        dh = "::";
                                        bN += 2
                                    } else {
                                        dh = null;
                                        if (T === 0) {
                                            at('"::"')
                                        }
                                    }
                                    if (dh !== null) {
                                        dg = b1();
                                        if (dg !== null) {
                                            if (aU.charCodeAt(bN) === 58) {
                                                df = ":";
                                                bN++
                                            } else {
                                                df = null;
                                                if (T === 0) {
                                                    at('":"')
                                                }
                                            }
                                            if (df !== null) {
                                                dd = ac();
                                                if (dd !== null) {
                                                    dh = [dh, dg, df, dd]
                                                } else {
                                                    dh = null;
                                                    bN = dj
                                                }
                                            } else {
                                                dh = null;
                                                bN = dj
                                            }
                                        } else {
                                            dh = null;
                                            bN = dj
                                        }
                                    } else {
                                        dh = null;
                                        bN = dj
                                    }
                                    if (dh === null) {
                                        dj = bN;
                                        if (aU.substr(bN, 2) === "::") {
                                            dh = "::";
                                            bN += 2
                                        } else {
                                            dh = null;
                                            if (T === 0) {
                                                at('"::"')
                                            }
                                        }
                                        if (dh !== null) {
                                            dg = ac();
                                            if (dg !== null) {
                                                dh = [dh, dg]
                                            } else {
                                                dh = null;
                                                bN = dj
                                            }
                                        } else {
                                            dh = null;
                                            bN = dj
                                        }
                                        if (dh === null) {
                                            dj = bN;
                                            if (aU.substr(bN, 2) === "::") {
                                                dh = "::";
                                                bN += 2
                                            } else {
                                                dh = null;
                                                if (T === 0) {
                                                    at('"::"')
                                                }
                                            }
                                            if (dh !== null) {
                                                dg = b1();
                                                if (dg !== null) {
                                                    dh = [dh, dg]
                                                } else {
                                                    dh = null;
                                                    bN = dj
                                                }
                                            } else {
                                                dh = null;
                                                bN = dj
                                            }
                                            if (dh === null) {
                                                dj = bN;
                                                dh = b1();
                                                if (dh !== null) {
                                                    if (aU.substr(bN, 2) === "::") {
                                                        dg = "::";
                                                        bN += 2
                                                    } else {
                                                        dg = null;
                                                        if (T === 0) {
                                                            at('"::"')
                                                        }
                                                    }
                                                    if (dg !== null) {
                                                        df = b1();
                                                        if (df !== null) {
                                                            if (aU.charCodeAt(bN) === 58) {
                                                                dd = ":";
                                                                bN++
                                                            } else {
                                                                dd = null;
                                                                if (T === 0) {
                                                                    at('":"')
                                                                }
                                                            }
                                                            if (dd !== null) {
                                                                db = b1();
                                                                if (db !== null) {
                                                                    if (aU.charCodeAt(bN) === 58) {
                                                                        c9 = ":";
                                                                        bN++
                                                                    } else {
                                                                        c9 = null;
                                                                        if (T === 0) {
                                                                            at('":"')
                                                                        }
                                                                    }
                                                                    if (c9 !== null) {
                                                                        c8 = b1();
                                                                        if (c8 !== null) {
                                                                            if (aU.charCodeAt(bN) === 58) {
                                                                                c7 = ":";
                                                                                bN++
                                                                            } else {
                                                                                c7 = null;
                                                                                if (T === 0) {
                                                                                    at('":"')
                                                                                }
                                                                            }
                                                                            if (c7 !== null) {
                                                                                dm = b1();
                                                                                if (dm !== null) {
                                                                                    if (aU.charCodeAt(bN) === 58) {
                                                                                        dl = ":";
                                                                                        bN++
                                                                                    } else {
                                                                                        dl = null;
                                                                                        if (T === 0) {
                                                                                            at('":"')
                                                                                        }
                                                                                    }
                                                                                    if (dl !== null) {
                                                                                        de = ac();
                                                                                        if (de !== null) {
                                                                                            dh = [dh, dg, df, dd, db, c9, c8, c7, dm, dl, de]
                                                                                        } else {
                                                                                            dh = null;
                                                                                            bN = dj
                                                                                        }
                                                                                    } else {
                                                                                        dh = null;
                                                                                        bN = dj
                                                                                    }
                                                                                } else {
                                                                                    dh = null;
                                                                                    bN = dj
                                                                                }
                                                                            } else {
                                                                                dh = null;
                                                                                bN = dj
                                                                            }
                                                                        } else {
                                                                            dh = null;
                                                                            bN = dj
                                                                        }
                                                                    } else {
                                                                        dh = null;
                                                                        bN = dj
                                                                    }
                                                                } else {
                                                                    dh = null;
                                                                    bN = dj
                                                                }
                                                            } else {
                                                                dh = null;
                                                                bN = dj
                                                            }
                                                        } else {
                                                            dh = null;
                                                            bN = dj
                                                        }
                                                    } else {
                                                        dh = null;
                                                        bN = dj
                                                    }
                                                } else {
                                                    dh = null;
                                                    bN = dj
                                                }
                                                if (dh === null) {
                                                    dj = bN;
                                                    dh = b1();
                                                    if (dh !== null) {
                                                        di = bN;
                                                        if (aU.charCodeAt(bN) === 58) {
                                                            dg = ":";
                                                            bN++
                                                        } else {
                                                            dg = null;
                                                            if (T === 0) {
                                                                at('":"')
                                                            }
                                                        }
                                                        if (dg !== null) {
                                                            df = b1();
                                                            if (df !== null) {
                                                                dg = [dg, df]
                                                            } else {
                                                                dg = null;
                                                                bN = di
                                                            }
                                                        } else {
                                                            dg = null;
                                                            bN = di
                                                        }
                                                        dg = dg !== null ? dg : "";
                                                        if (dg !== null) {
                                                            if (aU.substr(bN, 2) === "::") {
                                                                df = "::";
                                                                bN += 2
                                                            } else {
                                                                df = null;
                                                                if (T === 0) {
                                                                    at('"::"')
                                                                }
                                                            }
                                                            if (df !== null) {
                                                                dd = b1();
                                                                if (dd !== null) {
                                                                    if (aU.charCodeAt(bN) === 58) {
                                                                        db = ":";
                                                                        bN++
                                                                    } else {
                                                                        db = null;
                                                                        if (T === 0) {
                                                                            at('":"')
                                                                        }
                                                                    }
                                                                    if (db !== null) {
                                                                        c9 = b1();
                                                                        if (c9 !== null) {
                                                                            if (aU.charCodeAt(bN) === 58) {
                                                                                c8 = ":";
                                                                                bN++
                                                                            } else {
                                                                                c8 = null;
                                                                                if (T === 0) {
                                                                                    at('":"')
                                                                                }
                                                                            }
                                                                            if (c8 !== null) {
                                                                                c7 = b1();
                                                                                if (c7 !== null) {
                                                                                    if (aU.charCodeAt(bN) === 58) {
                                                                                        dm = ":";
                                                                                        bN++
                                                                                    } else {
                                                                                        dm = null;
                                                                                        if (T === 0) {
                                                                                            at('":"')
                                                                                        }
                                                                                    }
                                                                                    if (dm !== null) {
                                                                                        dl = ac();
                                                                                        if (dl !== null) {
                                                                                            dh = [dh, dg, df, dd, db, c9, c8, c7, dm, dl]
                                                                                        } else {
                                                                                            dh = null;
                                                                                            bN = dj
                                                                                        }
                                                                                    } else {
                                                                                        dh = null;
                                                                                        bN = dj
                                                                                    }
                                                                                } else {
                                                                                    dh = null;
                                                                                    bN = dj
                                                                                }
                                                                            } else {
                                                                                dh = null;
                                                                                bN = dj
                                                                            }
                                                                        } else {
                                                                            dh = null;
                                                                            bN = dj
                                                                        }
                                                                    } else {
                                                                        dh = null;
                                                                        bN = dj
                                                                    }
                                                                } else {
                                                                    dh = null;
                                                                    bN = dj
                                                                }
                                                            } else {
                                                                dh = null;
                                                                bN = dj
                                                            }
                                                        } else {
                                                            dh = null;
                                                            bN = dj
                                                        }
                                                    } else {
                                                        dh = null;
                                                        bN = dj
                                                    }
                                                    if (dh === null) {
                                                        dj = bN;
                                                        dh = b1();
                                                        if (dh !== null) {
                                                            di = bN;
                                                            if (aU.charCodeAt(bN) === 58) {
                                                                dg = ":";
                                                                bN++
                                                            } else {
                                                                dg = null;
                                                                if (T === 0) {
                                                                    at('":"')
                                                                }
                                                            }
                                                            if (dg !== null) {
                                                                df = b1();
                                                                if (df !== null) {
                                                                    dg = [dg, df]
                                                                } else {
                                                                    dg = null;
                                                                    bN = di
                                                                }
                                                            } else {
                                                                dg = null;
                                                                bN = di
                                                            }
                                                            dg = dg !== null ? dg : "";
                                                            if (dg !== null) {
                                                                di = bN;
                                                                if (aU.charCodeAt(bN) === 58) {
                                                                    df = ":";
                                                                    bN++
                                                                } else {
                                                                    df = null;
                                                                    if (T === 0) {
                                                                        at('":"')
                                                                    }
                                                                }
                                                                if (df !== null) {
                                                                    dd = b1();
                                                                    if (dd !== null) {
                                                                        df = [df, dd]
                                                                    } else {
                                                                        df = null;
                                                                        bN = di
                                                                    }
                                                                } else {
                                                                    df = null;
                                                                    bN = di
                                                                }
                                                                df = df !== null ? df : "";
                                                                if (df !== null) {
                                                                    if (aU.substr(bN, 2) === "::") {
                                                                        dd = "::";
                                                                        bN += 2
                                                                    } else {
                                                                        dd = null;
                                                                        if (T === 0) {
                                                                            at('"::"')
                                                                        }
                                                                    }
                                                                    if (dd !== null) {
                                                                        db = b1();
                                                                        if (db !== null) {
                                                                            if (aU.charCodeAt(bN) === 58) {
                                                                                c9 = ":";
                                                                                bN++
                                                                            } else {
                                                                                c9 = null;
                                                                                if (T === 0) {
                                                                                    at('":"')
                                                                                }
                                                                            }
                                                                            if (c9 !== null) {
                                                                                c8 = b1();
                                                                                if (c8 !== null) {
                                                                                    if (aU.charCodeAt(bN) === 58) {
                                                                                        c7 = ":";
                                                                                        bN++
                                                                                    } else {
                                                                                        c7 = null;
                                                                                        if (T === 0) {
                                                                                            at('":"')
                                                                                        }
                                                                                    }
                                                                                    if (c7 !== null) {
                                                                                        dm = ac();
                                                                                        if (dm !== null) {
                                                                                            dh = [dh, dg, df, dd, db, c9, c8, c7, dm]
                                                                                        } else {
                                                                                            dh = null;
                                                                                            bN = dj
                                                                                        }
                                                                                    } else {
                                                                                        dh = null;
                                                                                        bN = dj
                                                                                    }
                                                                                } else {
                                                                                    dh = null;
                                                                                    bN = dj
                                                                                }
                                                                            } else {
                                                                                dh = null;
                                                                                bN = dj
                                                                            }
                                                                        } else {
                                                                            dh = null;
                                                                            bN = dj
                                                                        }
                                                                    } else {
                                                                        dh = null;
                                                                        bN = dj
                                                                    }
                                                                } else {
                                                                    dh = null;
                                                                    bN = dj
                                                                }
                                                            } else {
                                                                dh = null;
                                                                bN = dj
                                                            }
                                                        } else {
                                                            dh = null;
                                                            bN = dj
                                                        }
                                                        if (dh === null) {
                                                            dj = bN;
                                                            dh = b1();
                                                            if (dh !== null) {
                                                                di = bN;
                                                                if (aU.charCodeAt(bN) === 58) {
                                                                    dg = ":";
                                                                    bN++
                                                                } else {
                                                                    dg = null;
                                                                    if (T === 0) {
                                                                        at('":"')
                                                                    }
                                                                }
                                                                if (dg !== null) {
                                                                    df = b1();
                                                                    if (df !== null) {
                                                                        dg = [dg, df]
                                                                    } else {
                                                                        dg = null;
                                                                        bN = di
                                                                    }
                                                                } else {
                                                                    dg = null;
                                                                    bN = di
                                                                }
                                                                dg = dg !== null ? dg : "";
                                                                if (dg !== null) {
                                                                    di = bN;
                                                                    if (aU.charCodeAt(bN) === 58) {
                                                                        df = ":";
                                                                        bN++
                                                                    } else {
                                                                        df = null;
                                                                        if (T === 0) {
                                                                            at('":"')
                                                                        }
                                                                    }
                                                                    if (df !== null) {
                                                                        dd = b1();
                                                                        if (dd !== null) {
                                                                            df = [df, dd]
                                                                        } else {
                                                                            df = null;
                                                                            bN = di
                                                                        }
                                                                    } else {
                                                                        df = null;
                                                                        bN = di
                                                                    }
                                                                    df = df !== null ? df : "";
                                                                    if (df !== null) {
                                                                        di = bN;
                                                                        if (aU.charCodeAt(bN) === 58) {
                                                                            dd = ":";
                                                                            bN++
                                                                        } else {
                                                                            dd = null;
                                                                            if (T === 0) {
                                                                                at('":"')
                                                                            }
                                                                        }
                                                                        if (dd !== null) {
                                                                            db = b1();
                                                                            if (db !== null) {
                                                                                dd = [dd, db]
                                                                            } else {
                                                                                dd = null;
                                                                                bN = di
                                                                            }
                                                                        } else {
                                                                            dd = null;
                                                                            bN = di
                                                                        }
                                                                        dd = dd !== null ? dd : "";
                                                                        if (dd !== null) {
                                                                            if (aU.substr(bN, 2) === "::") {
                                                                                db = "::";
                                                                                bN += 2
                                                                            } else {
                                                                                db = null;
                                                                                if (T === 0) {
                                                                                    at('"::"')
                                                                                }
                                                                            }
                                                                            if (db !== null) {
                                                                                c9 = b1();
                                                                                if (c9 !== null) {
                                                                                    if (aU.charCodeAt(bN) === 58) {
                                                                                        c8 = ":";
                                                                                        bN++
                                                                                    } else {
                                                                                        c8 = null;
                                                                                        if (T === 0) {
                                                                                            at('":"')
                                                                                        }
                                                                                    }
                                                                                    if (c8 !== null) {
                                                                                        c7 = ac();
                                                                                        if (c7 !== null) {
                                                                                            dh = [dh, dg, df, dd, db, c9, c8, c7]
                                                                                        } else {
                                                                                            dh = null;
                                                                                            bN = dj
                                                                                        }
                                                                                    } else {
                                                                                        dh = null;
                                                                                        bN = dj
                                                                                    }
                                                                                } else {
                                                                                    dh = null;
                                                                                    bN = dj
                                                                                }
                                                                            } else {
                                                                                dh = null;
                                                                                bN = dj
                                                                            }
                                                                        } else {
                                                                            dh = null;
                                                                            bN = dj
                                                                        }
                                                                    } else {
                                                                        dh = null;
                                                                        bN = dj
                                                                    }
                                                                } else {
                                                                    dh = null;
                                                                    bN = dj
                                                                }
                                                            } else {
                                                                dh = null;
                                                                bN = dj
                                                            }
                                                            if (dh === null) {
                                                                dj = bN;
                                                                dh = b1();
                                                                if (dh !== null) {
                                                                    di = bN;
                                                                    if (aU.charCodeAt(bN) === 58) {
                                                                        dg = ":";
                                                                        bN++
                                                                    } else {
                                                                        dg = null;
                                                                        if (T === 0) {
                                                                            at('":"')
                                                                        }
                                                                    }
                                                                    if (dg !== null) {
                                                                        df = b1();
                                                                        if (df !== null) {
                                                                            dg = [dg, df]
                                                                        } else {
                                                                            dg = null;
                                                                            bN = di
                                                                        }
                                                                    } else {
                                                                        dg = null;
                                                                        bN = di
                                                                    }
                                                                    dg = dg !== null ? dg : "";
                                                                    if (dg !== null) {
                                                                        di = bN;
                                                                        if (aU.charCodeAt(bN) === 58) {
                                                                            df = ":";
                                                                            bN++
                                                                        } else {
                                                                            df = null;
                                                                            if (T === 0) {
                                                                                at('":"')
                                                                            }
                                                                        }
                                                                        if (df !== null) {
                                                                            dd = b1();
                                                                            if (dd !== null) {
                                                                                df = [df, dd]
                                                                            } else {
                                                                                df = null;
                                                                                bN = di
                                                                            }
                                                                        } else {
                                                                            df = null;
                                                                            bN = di
                                                                        }
                                                                        df = df !== null ? df : "";
                                                                        if (df !== null) {
                                                                            di = bN;
                                                                            if (aU.charCodeAt(bN) === 58) {
                                                                                dd = ":";
                                                                                bN++
                                                                            } else {
                                                                                dd = null;
                                                                                if (T === 0) {
                                                                                    at('":"')
                                                                                }
                                                                            }
                                                                            if (dd !== null) {
                                                                                db = b1();
                                                                                if (db !== null) {
                                                                                    dd = [dd, db]
                                                                                } else {
                                                                                    dd = null;
                                                                                    bN = di
                                                                                }
                                                                            } else {
                                                                                dd = null;
                                                                                bN = di
                                                                            }
                                                                            dd = dd !== null ? dd : "";
                                                                            if (dd !== null) {
                                                                                di = bN;
                                                                                if (aU.charCodeAt(bN) === 58) {
                                                                                    db = ":";
                                                                                    bN++
                                                                                } else {
                                                                                    db = null;
                                                                                    if (T === 0) {
                                                                                        at('":"')
                                                                                    }
                                                                                }
                                                                                if (db !== null) {
                                                                                    c9 = b1();
                                                                                    if (c9 !== null) {
                                                                                        db = [db, c9]
                                                                                    } else {
                                                                                        db = null;
                                                                                        bN = di
                                                                                    }
                                                                                } else {
                                                                                    db = null;
                                                                                    bN = di
                                                                                }
                                                                                db = db !== null ? db : "";
                                                                                if (db !== null) {
                                                                                    if (aU.substr(bN, 2) === "::") {
                                                                                        c9 = "::";
                                                                                        bN += 2
                                                                                    } else {
                                                                                        c9 = null;
                                                                                        if (T === 0) {
                                                                                            at('"::"')
                                                                                        }
                                                                                    }
                                                                                    if (c9 !== null) {
                                                                                        c8 = ac();
                                                                                        if (c8 !== null) {
                                                                                            dh = [dh, dg, df, dd, db, c9, c8]
                                                                                        } else {
                                                                                            dh = null;
                                                                                            bN = dj
                                                                                        }
                                                                                    } else {
                                                                                        dh = null;
                                                                                        bN = dj
                                                                                    }
                                                                                } else {
                                                                                    dh = null;
                                                                                    bN = dj
                                                                                }
                                                                            } else {
                                                                                dh = null;
                                                                                bN = dj
                                                                            }
                                                                        } else {
                                                                            dh = null;
                                                                            bN = dj
                                                                        }
                                                                    } else {
                                                                        dh = null;
                                                                        bN = dj
                                                                    }
                                                                } else {
                                                                    dh = null;
                                                                    bN = dj
                                                                }
                                                                if (dh === null) {
                                                                    dj = bN;
                                                                    dh = b1();
                                                                    if (dh !== null) {
                                                                        di = bN;
                                                                        if (aU.charCodeAt(bN) === 58) {
                                                                            dg = ":";
                                                                            bN++
                                                                        } else {
                                                                            dg = null;
                                                                            if (T === 0) {
                                                                                at('":"')
                                                                            }
                                                                        }
                                                                        if (dg !== null) {
                                                                            df = b1();
                                                                            if (df !== null) {
                                                                                dg = [dg, df]
                                                                            } else {
                                                                                dg = null;
                                                                                bN = di
                                                                            }
                                                                        } else {
                                                                            dg = null;
                                                                            bN = di
                                                                        }
                                                                        dg = dg !== null ? dg : "";
                                                                        if (dg !== null) {
                                                                            di = bN;
                                                                            if (aU.charCodeAt(bN) === 58) {
                                                                                df = ":";
                                                                                bN++
                                                                            } else {
                                                                                df = null;
                                                                                if (T === 0) {
                                                                                    at('":"')
                                                                                }
                                                                            }
                                                                            if (df !== null) {
                                                                                dd = b1();
                                                                                if (dd !== null) {
                                                                                    df = [df, dd]
                                                                                } else {
                                                                                    df = null;
                                                                                    bN = di
                                                                                }
                                                                            } else {
                                                                                df = null;
                                                                                bN = di
                                                                            }
                                                                            df = df !== null ? df : "";
                                                                            if (df !== null) {
                                                                                di = bN;
                                                                                if (aU.charCodeAt(bN) === 58) {
                                                                                    dd = ":";
                                                                                    bN++
                                                                                } else {
                                                                                    dd = null;
                                                                                    if (T === 0) {
                                                                                        at('":"')
                                                                                    }
                                                                                }
                                                                                if (dd !== null) {
                                                                                    db = b1();
                                                                                    if (db !== null) {
                                                                                        dd = [dd, db]
                                                                                    } else {
                                                                                        dd = null;
                                                                                        bN = di
                                                                                    }
                                                                                } else {
                                                                                    dd = null;
                                                                                    bN = di
                                                                                }
                                                                                dd = dd !== null ? dd : "";
                                                                                if (dd !== null) {
                                                                                    di = bN;
                                                                                    if (aU.charCodeAt(bN) === 58) {
                                                                                        db = ":";
                                                                                        bN++
                                                                                    } else {
                                                                                        db = null;
                                                                                        if (T === 0) {
                                                                                            at('":"')
                                                                                        }
                                                                                    }
                                                                                    if (db !== null) {
                                                                                        c9 = b1();
                                                                                        if (c9 !== null) {
                                                                                            db = [db, c9]
                                                                                        } else {
                                                                                            db = null;
                                                                                            bN = di
                                                                                        }
                                                                                    } else {
                                                                                        db = null;
                                                                                        bN = di
                                                                                    }
                                                                                    db = db !== null ? db : "";
                                                                                    if (db !== null) {
                                                                                        di = bN;
                                                                                        if (aU.charCodeAt(bN) === 58) {
                                                                                            c9 = ":";
                                                                                            bN++
                                                                                        } else {
                                                                                            c9 = null;
                                                                                            if (T === 0) {
                                                                                                at('":"')
                                                                                            }
                                                                                        }
                                                                                        if (c9 !== null) {
                                                                                            c8 = b1();
                                                                                            if (c8 !== null) {
                                                                                                c9 = [c9, c8]
                                                                                            } else {
                                                                                                c9 = null;
                                                                                                bN = di
                                                                                            }
                                                                                        } else {
                                                                                            c9 = null;
                                                                                            bN = di
                                                                                        }
                                                                                        c9 = c9 !== null ? c9 : "";
                                                                                        if (c9 !== null) {
                                                                                            if (aU.substr(bN, 2) === "::") {
                                                                                                c8 = "::";
                                                                                                bN += 2
                                                                                            } else {
                                                                                                c8 = null;
                                                                                                if (T === 0) {
                                                                                                    at('"::"')
                                                                                                }
                                                                                            }
                                                                                            if (c8 !== null) {
                                                                                                c7 = b1();
                                                                                                if (c7 !== null) {
                                                                                                    dh = [dh, dg, df, dd, db, c9, c8, c7]
                                                                                                } else {
                                                                                                    dh = null;
                                                                                                    bN = dj
                                                                                                }
                                                                                            } else {
                                                                                                dh = null;
                                                                                                bN = dj
                                                                                            }
                                                                                        } else {
                                                                                            dh = null;
                                                                                            bN = dj
                                                                                        }
                                                                                    } else {
                                                                                        dh = null;
                                                                                        bN = dj
                                                                                    }
                                                                                } else {
                                                                                    dh = null;
                                                                                    bN = dj
                                                                                }
                                                                            } else {
                                                                                dh = null;
                                                                                bN = dj
                                                                            }
                                                                        } else {
                                                                            dh = null;
                                                                            bN = dj
                                                                        }
                                                                    } else {
                                                                        dh = null;
                                                                        bN = dj
                                                                    }
                                                                    if (dh === null) {
                                                                        dj = bN;
                                                                        dh = b1();
                                                                        if (dh !== null) {
                                                                            di = bN;
                                                                            if (aU.charCodeAt(bN) === 58) {
                                                                                dg = ":";
                                                                                bN++
                                                                            } else {
                                                                                dg = null;
                                                                                if (T === 0) {
                                                                                    at('":"')
                                                                                }
                                                                            }
                                                                            if (dg !== null) {
                                                                                df = b1();
                                                                                if (df !== null) {
                                                                                    dg = [dg, df]
                                                                                } else {
                                                                                    dg = null;
                                                                                    bN = di
                                                                                }
                                                                            } else {
                                                                                dg = null;
                                                                                bN = di
                                                                            }
                                                                            dg = dg !== null ? dg : "";
                                                                            if (dg !== null) {
                                                                                di = bN;
                                                                                if (aU.charCodeAt(bN) === 58) {
                                                                                    df = ":";
                                                                                    bN++
                                                                                } else {
                                                                                    df = null;
                                                                                    if (T === 0) {
                                                                                        at('":"')
                                                                                    }
                                                                                }
                                                                                if (df !== null) {
                                                                                    dd = b1();
                                                                                    if (dd !== null) {
                                                                                        df = [df, dd]
                                                                                    } else {
                                                                                        df = null;
                                                                                        bN = di
                                                                                    }
                                                                                } else {
                                                                                    df = null;
                                                                                    bN = di
                                                                                }
                                                                                df = df !== null ? df : "";
                                                                                if (df !== null) {
                                                                                    di = bN;
                                                                                    if (aU.charCodeAt(bN) === 58) {
                                                                                        dd = ":";
                                                                                        bN++
                                                                                    } else {
                                                                                        dd = null;
                                                                                        if (T === 0) {
                                                                                            at('":"')
                                                                                        }
                                                                                    }
                                                                                    if (dd !== null) {
                                                                                        db = b1();
                                                                                        if (db !== null) {
                                                                                            dd = [dd, db]
                                                                                        } else {
                                                                                            dd = null;
                                                                                            bN = di
                                                                                        }
                                                                                    } else {
                                                                                        dd = null;
                                                                                        bN = di
                                                                                    }
                                                                                    dd = dd !== null ? dd : "";
                                                                                    if (dd !== null) {
                                                                                        di = bN;
                                                                                        if (aU.charCodeAt(bN) === 58) {
                                                                                            db = ":";
                                                                                            bN++
                                                                                        } else {
                                                                                            db = null;
                                                                                            if (T === 0) {
                                                                                                at('":"')
                                                                                            }
                                                                                        }
                                                                                        if (db !== null) {
                                                                                            c9 = b1();
                                                                                            if (c9 !== null) {
                                                                                                db = [db, c9]
                                                                                            } else {
                                                                                                db = null;
                                                                                                bN = di
                                                                                            }
                                                                                        } else {
                                                                                            db = null;
                                                                                            bN = di
                                                                                        }
                                                                                        db = db !== null ? db : "";
                                                                                        if (db !== null) {
                                                                                            di = bN;
                                                                                            if (aU.charCodeAt(bN) === 58) {
                                                                                                c9 = ":";
                                                                                                bN++
                                                                                            } else {
                                                                                                c9 = null;
                                                                                                if (T === 0) {
                                                                                                    at('":"')
                                                                                                }
                                                                                            }
                                                                                            if (c9 !== null) {
                                                                                                c8 = b1();
                                                                                                if (c8 !== null) {
                                                                                                    c9 = [c9, c8]
                                                                                                } else {
                                                                                                    c9 = null;
                                                                                                    bN = di
                                                                                                }
                                                                                            } else {
                                                                                                c9 = null;
                                                                                                bN = di
                                                                                            }
                                                                                            c9 = c9 !== null ? c9 : "";
                                                                                            if (c9 !== null) {
                                                                                                di = bN;
                                                                                                if (aU.charCodeAt(bN) === 58) {
                                                                                                    c8 = ":";
                                                                                                    bN++
                                                                                                } else {
                                                                                                    c8 = null;
                                                                                                    if (T === 0) {
                                                                                                        at('":"')
                                                                                                    }
                                                                                                }
                                                                                                if (c8 !== null) {
                                                                                                    c7 = b1();
                                                                                                    if (c7 !== null) {
                                                                                                        c8 = [c8, c7]
                                                                                                    } else {
                                                                                                        c8 = null;
                                                                                                        bN = di
                                                                                                    }
                                                                                                } else {
                                                                                                    c8 = null;
                                                                                                    bN = di
                                                                                                }
                                                                                                c8 = c8 !== null ? c8 : "";
                                                                                                if (c8 !== null) {
                                                                                                    if (aU.substr(bN, 2) === "::") {
                                                                                                        c7 = "::";
                                                                                                        bN += 2
                                                                                                    } else {
                                                                                                        c7 = null;
                                                                                                        if (T === 0) {
                                                                                                            at('"::"')
                                                                                                        }
                                                                                                    }
                                                                                                    if (c7 !== null) {
                                                                                                        dh = [dh, dg, df, dd, db, c9, c8, c7]
                                                                                                    } else {
                                                                                                        dh = null;
                                                                                                        bN = dj
                                                                                                    }
                                                                                                } else {
                                                                                                    dh = null;
                                                                                                    bN = dj
                                                                                                }
                                                                                            } else {
                                                                                                dh = null;
                                                                                                bN = dj
                                                                                            }
                                                                                        } else {
                                                                                            dh = null;
                                                                                            bN = dj
                                                                                        }
                                                                                    } else {
                                                                                        dh = null;
                                                                                        bN = dj
                                                                                    }
                                                                                } else {
                                                                                    dh = null;
                                                                                    bN = dj
                                                                                }
                                                                            } else {
                                                                                dh = null;
                                                                                bN = dj
                                                                            }
                                                                        } else {
                                                                            dh = null;
                                                                            bN = dj
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (dh !== null) {
                    dh = (function (dn) {
                        bE.host_type = "IPv6";
                        return aU.substring(bN, dn)
                    })(dk)
                }
                if (dh === null) {
                    bN = dk
                }
                return dh
            }
            function b1() {
                var da, c9, c8, c7;
                var db;
                db = bN;
                da = aY();
                if (da !== null) {
                    c9 = aY();
                    c9 = c9 !== null ? c9 : "";
                    if (c9 !== null) {
                        c8 = aY();
                        c8 = c8 !== null ? c8 : "";
                        if (c8 !== null) {
                            c7 = aY();
                            c7 = c7 !== null ? c7 : "";
                            if (c7 !== null) {
                                da = [da, c9, c8, c7]
                            } else {
                                da = null;
                                bN = db
                            }
                        } else {
                            da = null;
                            bN = db
                        }
                    } else {
                        da = null;
                        bN = db
                    }
                } else {
                    da = null;
                    bN = db
                }
                return da
            }
            function ac() {
                var c9, c8, c7;
                var da;
                da = bN;
                c9 = b1();
                if (c9 !== null) {
                    if (aU.charCodeAt(bN) === 58) {
                        c8 = ":";
                        bN++
                    } else {
                        c8 = null;
                        if (T === 0) {
                            at('":"')
                        }
                    }
                    if (c8 !== null) {
                        c7 = b1();
                        if (c7 !== null) {
                            c9 = [c9, c8, c7]
                        } else {
                            c9 = null;
                            bN = da
                        }
                    } else {
                        c9 = null;
                        bN = da
                    }
                } else {
                    c9 = null;
                    bN = da
                }
                if (c9 === null) {
                    c9 = b6()
                }
                return c9
            }
            function b6() {
                var dd, dc, db, da, c9, c8, c7;
                var df, de;
                df = bN;
                de = bN;
                dd = ci();
                if (dd !== null) {
                    if (aU.charCodeAt(bN) === 46) {
                        dc = ".";
                        bN++
                    } else {
                        dc = null;
                        if (T === 0) {
                            at('"."')
                        }
                    }
                    if (dc !== null) {
                        db = ci();
                        if (db !== null) {
                            if (aU.charCodeAt(bN) === 46) {
                                da = ".";
                                bN++
                            } else {
                                da = null;
                                if (T === 0) {
                                    at('"."')
                                }
                            }
                            if (da !== null) {
                                c9 = ci();
                                if (c9 !== null) {
                                    if (aU.charCodeAt(bN) === 46) {
                                        c8 = ".";
                                        bN++
                                    } else {
                                        c8 = null;
                                        if (T === 0) {
                                            at('"."')
                                        }
                                    }
                                    if (c8 !== null) {
                                        c7 = ci();
                                        if (c7 !== null) {
                                            dd = [dd, dc, db, da, c9, c8, c7]
                                        } else {
                                            dd = null;
                                            bN = de
                                        }
                                    } else {
                                        dd = null;
                                        bN = de
                                    }
                                } else {
                                    dd = null;
                                    bN = de
                                }
                            } else {
                                dd = null;
                                bN = de
                            }
                        } else {
                            dd = null;
                            bN = de
                        }
                    } else {
                        dd = null;
                        bN = de
                    }
                } else {
                    dd = null;
                    bN = de
                }
                if (dd !== null) {
                    dd = (function (dg) {
                        bE.host_type = "IPv4";
                        return aU.substring(bN, dg)
                    })(df)
                }
                if (dd === null) {
                    bN = df
                }
                return dd
            }
            function ci() {
                var c9, c8, c7;
                var da;
                da = bN;
                if (aU.substr(bN, 2) === "25") {
                    c9 = "25";
                    bN += 2
                } else {
                    c9 = null;
                    if (T === 0) {
                        at('"25"')
                    }
                }
                if (c9 !== null) {
                    if (/^[0-5]/.test(aU.charAt(bN))) {
                        c8 = aU.charAt(bN);
                        bN++
                    } else {
                        c8 = null;
                        if (T === 0) {
                            at("[0-5]")
                        }
                    }
                    if (c8 !== null) {
                        c9 = [c9, c8]
                    } else {
                        c9 = null;
                        bN = da
                    }
                } else {
                    c9 = null;
                    bN = da
                }
                if (c9 === null) {
                    da = bN;
                    if (aU.charCodeAt(bN) === 50) {
                        c9 = "2";
                        bN++
                    } else {
                        c9 = null;
                        if (T === 0) {
                            at('"2"')
                        }
                    }
                    if (c9 !== null) {
                        if (/^[0-4]/.test(aU.charAt(bN))) {
                            c8 = aU.charAt(bN);
                            bN++
                        } else {
                            c8 = null;
                            if (T === 0) {
                                at("[0-4]")
                            }
                        }
                        if (c8 !== null) {
                            c7 = bA();
                            if (c7 !== null) {
                                c9 = [c9, c8, c7]
                            } else {
                                c9 = null;
                                bN = da
                            }
                        } else {
                            c9 = null;
                            bN = da
                        }
                    } else {
                        c9 = null;
                        bN = da
                    }
                    if (c9 === null) {
                        da = bN;
                        if (aU.charCodeAt(bN) === 49) {
                            c9 = "1";
                            bN++
                        } else {
                            c9 = null;
                            if (T === 0) {
                                at('"1"')
                            }
                        }
                        if (c9 !== null) {
                            c8 = bA();
                            if (c8 !== null) {
                                c7 = bA();
                                if (c7 !== null) {
                                    c9 = [c9, c8, c7]
                                } else {
                                    c9 = null;
                                    bN = da
                                }
                            } else {
                                c9 = null;
                                bN = da
                            }
                        } else {
                            c9 = null;
                            bN = da
                        }
                        if (c9 === null) {
                            da = bN;
                            if (/^[1-9]/.test(aU.charAt(bN))) {
                                c9 = aU.charAt(bN);
                                bN++
                            } else {
                                c9 = null;
                                if (T === 0) {
                                    at("[1-9]")
                                }
                            }
                            if (c9 !== null) {
                                c8 = bA();
                                if (c8 !== null) {
                                    c9 = [c9, c8]
                                } else {
                                    c9 = null;
                                    bN = da
                                }
                            } else {
                                c9 = null;
                                bN = da
                            }
                            if (c9 === null) {
                                c9 = bA()
                            }
                        }
                    }
                }
                return c9
            }
            function ct() {
                var dc, da, c9, c8, c7;
                var dd, db;
                dd = bN;
                db = bN;
                dc = bA();
                dc = dc !== null ? dc : "";
                if (dc !== null) {
                    da = bA();
                    da = da !== null ? da : "";
                    if (da !== null) {
                        c9 = bA();
                        c9 = c9 !== null ? c9 : "";
                        if (c9 !== null) {
                            c8 = bA();
                            c8 = c8 !== null ? c8 : "";
                            if (c8 !== null) {
                                c7 = bA();
                                c7 = c7 !== null ? c7 : "";
                                if (c7 !== null) {
                                    dc = [dc, da, c9, c8, c7]
                                } else {
                                    dc = null;
                                    bN = db
                                }
                            } else {
                                dc = null;
                                bN = db
                            }
                        } else {
                            dc = null;
                            bN = db
                        }
                    } else {
                        dc = null;
                        bN = db
                    }
                } else {
                    dc = null;
                    bN = db
                }
                if (dc !== null) {
                    dc = (function (df, de) {
                        de = parseInt(de.join(""));
                        bE.port = de;
                        return de
                    })(dd, dc)
                }
                if (dc === null) {
                    bN = dd
                }
                return dc
            }
            function U() {
                var c9, c8, c7;
                var da;
                c9 = [];
                da = bN;
                if (aU.charCodeAt(bN) === 59) {
                    c8 = ";";
                    bN++
                } else {
                    c8 = null;
                    if (T === 0) {
                        at('";"')
                    }
                }
                if (c8 !== null) {
                    c7 = ar();
                    if (c7 !== null) {
                        c8 = [c8, c7]
                    } else {
                        c8 = null;
                        bN = da
                    }
                } else {
                    c8 = null;
                    bN = da
                }
                while (c8 !== null) {
                    c9.push(c8);
                    da = bN;
                    if (aU.charCodeAt(bN) === 59) {
                        c8 = ";";
                        bN++
                    } else {
                        c8 = null;
                        if (T === 0) {
                            at('";"')
                        }
                    }
                    if (c8 !== null) {
                        c7 = ar();
                        if (c7 !== null) {
                            c8 = [c8, c7]
                        } else {
                            c8 = null;
                            bN = da
                        }
                    } else {
                        c8 = null;
                        bN = da
                    }
                }
                return c9
            }
            function ar() {
                var c7;
                c7 = cV();
                if (c7 === null) {
                    c7 = bB();
                    if (c7 === null) {
                        c7 = cB();
                        if (c7 === null) {
                            c7 = cP();
                            if (c7 === null) {
                                c7 = cS();
                                if (c7 === null) {
                                    c7 = be();
                                    if (c7 === null) {
                                        c7 = bu()
                                    }
                                }
                            }
                        }
                    }
                }
                return c7
            }
            function cV() {
                var c9, c7;
                var da, c8;
                da = bN;
                c8 = bN;
                if (aU.substr(bN, 10) === "transport=") {
                    c9 = "transport=";
                    bN += 10
                } else {
                    c9 = null;
                    if (T === 0) {
                        at('"transport="')
                    }
                }
                if (c9 !== null) {
                    if (aU.substr(bN, 3) === "udp") {
                        c7 = "udp";
                        bN += 3
                    } else {
                        c7 = null;
                        if (T === 0) {
                            at('"udp"')
                        }
                    }
                    if (c7 === null) {
                        if (aU.substr(bN, 3) === "tcp") {
                            c7 = "tcp";
                            bN += 3
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at('"tcp"')
                            }
                        }
                        if (c7 === null) {
                            if (aU.substr(bN, 4) === "sctp") {
                                c7 = "sctp";
                                bN += 4
                            } else {
                                c7 = null;
                                if (T === 0) {
                                    at('"sctp"')
                                }
                            }
                            if (c7 === null) {
                                if (aU.substr(bN, 3) === "tls") {
                                    c7 = "tls";
                                    bN += 3
                                } else {
                                    c7 = null;
                                    if (T === 0) {
                                        at('"tls"')
                                    }
                                }
                                if (c7 === null) {
                                    c7 = bI()
                                }
                            }
                        }
                    }
                    if (c7 !== null) {
                        c9 = [c9, c7]
                    } else {
                        c9 = null;
                        bN = c8
                    }
                } else {
                    c9 = null;
                    bN = c8
                }
                if (c9 !== null) {
                    c9 = (function (db, dc) {
                        if (!bE.params) {
                            bE.params = {}
                        }
                        bE.params.transport = dc
                    })(da, c9[1])
                }
                if (c9 === null) {
                    bN = da
                }
                return c9
            }
            function bB() {
                var c9, c7;
                var da, c8;
                da = bN;
                c8 = bN;
                if (aU.substr(bN, 5) === "user=") {
                    c9 = "user=";
                    bN += 5
                } else {
                    c9 = null;
                    if (T === 0) {
                        at('"user="')
                    }
                }
                if (c9 !== null) {
                    if (aU.substr(bN, 5) === "phone") {
                        c7 = "phone";
                        bN += 5
                    } else {
                        c7 = null;
                        if (T === 0) {
                            at('"phone"')
                        }
                    }
                    if (c7 === null) {
                        if (aU.substr(bN, 2) === "ip") {
                            c7 = "ip";
                            bN += 2
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at('"ip"')
                            }
                        }
                        if (c7 === null) {
                            c7 = bI()
                        }
                    }
                    if (c7 !== null) {
                        c9 = [c9, c7]
                    } else {
                        c9 = null;
                        bN = c8
                    }
                } else {
                    c9 = null;
                    bN = c8
                }
                if (c9 !== null) {
                    c9 = (function (dc, db) {
                        if (!bE.params) {
                            bE.params = {}
                        }
                        bE.params.user = db
                    })(da, c9[1])
                }
                if (c9 === null) {
                    bN = da
                }
                return c9
            }
            function cB() {
                var c9, c7;
                var da, c8;
                da = bN;
                c8 = bN;
                if (aU.substr(bN, 7) === "method=") {
                    c9 = "method=";
                    bN += 7
                } else {
                    c9 = null;
                    if (T === 0) {
                        at('"method="')
                    }
                }
                if (c9 !== null) {
                    c7 = aq();
                    if (c7 !== null) {
                        c9 = [c9, c7]
                    } else {
                        c9 = null;
                        bN = c8
                    }
                } else {
                    c9 = null;
                    bN = c8
                }
                if (c9 !== null) {
                    c9 = (function (db, dc) {
                        if (!bE.params) {
                            bE.params = {}
                        }
                        bE.params.method = dc
                    })(da, c9[1])
                }
                if (c9 === null) {
                    bN = da
                }
                return c9
            }
            function cP() {
                var c9, c7;
                var da, c8;
                da = bN;
                c8 = bN;
                if (aU.substr(bN, 4) === "ttl=") {
                    c9 = "ttl=";
                    bN += 4
                } else {
                    c9 = null;
                    if (T === 0) {
                        at('"ttl="')
                    }
                }
                if (c9 !== null) {
                    c7 = t();
                    if (c7 !== null) {
                        c9 = [c9, c7]
                    } else {
                        c9 = null;
                        bN = c8
                    }
                } else {
                    c9 = null;
                    bN = c8
                }
                if (c9 !== null) {
                    c9 = (function (dc, db) {
                        if (!bE.params) {
                            bE.params = {}
                        }
                        bE.params.ttl = db
                    })(da, c9[1])
                }
                if (c9 === null) {
                    bN = da
                }
                return c9
            }
            function cS() {
                var c9, c7;
                var da, c8;
                da = bN;
                c8 = bN;
                if (aU.substr(bN, 6) === "maddr=") {
                    c9 = "maddr=";
                    bN += 6
                } else {
                    c9 = null;
                    if (T === 0) {
                        at('"maddr="')
                    }
                }
                if (c9 !== null) {
                    c7 = u();
                    if (c7 !== null) {
                        c9 = [c9, c7]
                    } else {
                        c9 = null;
                        bN = c8
                    }
                } else {
                    c9 = null;
                    bN = c8
                }
                if (c9 !== null) {
                    c9 = (function (dc, db) {
                        if (!bE.params) {
                            bE.params = {}
                        }
                        bE.params.maddr = db
                    })(da, c9[1])
                }
                if (c9 === null) {
                    bN = da
                }
                return c9
            }
            function be() {
                var c7;
                var c8;
                c8 = bN;
                if (aU.substr(bN, 2) === "lr") {
                    c7 = "lr";
                    bN += 2
                } else {
                    c7 = null;
                    if (T === 0) {
                        at('"lr"')
                    }
                }
                if (c7 !== null) {
                    c7 = (function (da, c9) {
                        if (!bE.params) {
                            bE.params = {}
                        }
                        bE.params.lr = true
                    })(c8, c7)
                }
                if (c7 === null) {
                    bN = c8
                }
                return c7
            }
            function bu() {
                var db, c9, c7;
                var dc, da, c8;
                dc = bN;
                da = bN;
                db = j();
                if (db !== null) {
                    c8 = bN;
                    if (aU.charCodeAt(bN) === 61) {
                        c9 = "=";
                        bN++
                    } else {
                        c9 = null;
                        if (T === 0) {
                            at('"="')
                        }
                    }
                    if (c9 !== null) {
                        c7 = cg();
                        if (c7 !== null) {
                            c9 = [c9, c7]
                        } else {
                            c9 = null;
                            bN = c8
                        }
                    } else {
                        c9 = null;
                        bN = c8
                    }
                    c9 = c9 !== null ? c9 : "";
                    if (c9 !== null) {
                        db = [db, c9]
                    } else {
                        db = null;
                        bN = da
                    }
                } else {
                    db = null;
                    bN = da
                }
                if (db !== null) {
                    db = (function (de, dd) {
                        if (!bE.params) {
                            bE.params = {}
                        }
                        if (dd.length === (bN - de)) {
                            bE.params[dd] = true
                        } else {
                            bE.params[dd] = aU.substring(bN, de + dd.length + 1)
                        }
                    })(dc, db[0])
                }
                if (db === null) {
                    bN = dc
                }
                return db
            }
            function j() {
                var c8, c7;
                var c9;
                c9 = bN;
                c7 = bU();
                if (c7 !== null) {
                    c8 = [];
                    while (c7 !== null) {
                        c8.push(c7);
                        c7 = bU()
                    }
                } else {
                    c8 = null
                }
                if (c8 !== null) {
                    c8 = (function (db, da) {
                        return da.join("")
                    })(c9, c8)
                }
                if (c8 === null) {
                    bN = c9
                }
                return c8
            }
            function cg() {
                var c8, c7;
                var c9;
                c9 = bN;
                c7 = bU();
                if (c7 !== null) {
                    c8 = [];
                    while (c7 !== null) {
                        c8.push(c7);
                        c7 = bU()
                    }
                } else {
                    c8 = null
                }
                if (c8 !== null) {
                    c8 = (function (db, da) {
                        return da.join("")
                    })(c9, c8)
                }
                if (c8 === null) {
                    bN = c9
                }
                return c8
            }
            function bU() {
                var c7;
                c7 = bH();
                if (c7 === null) {
                    c7 = b7();
                    if (c7 === null) {
                        c7 = Z()
                    }
                }
                return c7
            }
            function bH() {
                var c7;
                if (aU.charCodeAt(bN) === 91) {
                    c7 = "[";
                    bN++
                } else {
                    c7 = null;
                    if (T === 0) {
                        at('"["')
                    }
                }
                if (c7 === null) {
                    if (aU.charCodeAt(bN) === 93) {
                        c7 = "]";
                        bN++
                    } else {
                        c7 = null;
                        if (T === 0) {
                            at('"]"')
                        }
                    }
                    if (c7 === null) {
                        if (aU.charCodeAt(bN) === 47) {
                            c7 = "/";
                            bN++
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at('"/"')
                            }
                        }
                        if (c7 === null) {
                            if (aU.charCodeAt(bN) === 58) {
                                c7 = ":";
                                bN++
                            } else {
                                c7 = null;
                                if (T === 0) {
                                    at('":"')
                                }
                            }
                            if (c7 === null) {
                                if (aU.charCodeAt(bN) === 38) {
                                    c7 = "&";
                                    bN++
                                } else {
                                    c7 = null;
                                    if (T === 0) {
                                        at('"&"')
                                    }
                                }
                                if (c7 === null) {
                                    if (aU.charCodeAt(bN) === 43) {
                                        c7 = "+";
                                        bN++
                                    } else {
                                        c7 = null;
                                        if (T === 0) {
                                            at('"+"')
                                        }
                                    }
                                    if (c7 === null) {
                                        if (aU.charCodeAt(bN) === 36) {
                                            c7 = "$";
                                            bN++
                                        } else {
                                            c7 = null;
                                            if (T === 0) {
                                                at('"$"')
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return c7
            }
            function ap() {
                var dc, da, c9, c8, c7;
                var dd, db;
                dd = bN;
                if (aU.charCodeAt(bN) === 63) {
                    dc = "?";
                    bN++
                } else {
                    dc = null;
                    if (T === 0) {
                        at('"?"')
                    }
                }
                if (dc !== null) {
                    da = cr();
                    if (da !== null) {
                        c9 = [];
                        db = bN;
                        if (aU.charCodeAt(bN) === 38) {
                            c8 = "&";
                            bN++
                        } else {
                            c8 = null;
                            if (T === 0) {
                                at('"&"')
                            }
                        }
                        if (c8 !== null) {
                            c7 = cr();
                            if (c7 !== null) {
                                c8 = [c8, c7]
                            } else {
                                c8 = null;
                                bN = db
                            }
                        } else {
                            c8 = null;
                            bN = db
                        }
                        while (c8 !== null) {
                            c9.push(c8);
                            db = bN;
                            if (aU.charCodeAt(bN) === 38) {
                                c8 = "&";
                                bN++
                            } else {
                                c8 = null;
                                if (T === 0) {
                                    at('"&"')
                                }
                            }
                            if (c8 !== null) {
                                c7 = cr();
                                if (c7 !== null) {
                                    c8 = [c8, c7]
                                } else {
                                    c8 = null;
                                    bN = db
                                }
                            } else {
                                c8 = null;
                                bN = db
                            }
                        }
                        if (c9 !== null) {
                            dc = [dc, da, c9]
                        } else {
                            dc = null;
                            bN = dd
                        }
                    } else {
                        dc = null;
                        bN = dd
                    }
                } else {
                    dc = null;
                    bN = dd
                }
                return dc
            }
            function cr() {
                var c9, c8, c7;
                var da;
                da = bN;
                c9 = ao();
                if (c9 !== null) {
                    if (aU.charCodeAt(bN) === 61) {
                        c8 = "=";
                        bN++
                    } else {
                        c8 = null;
                        if (T === 0) {
                            at('"="')
                        }
                    }
                    if (c8 !== null) {
                        c7 = b5();
                        if (c7 !== null) {
                            c9 = [c9, c8, c7]
                        } else {
                            c9 = null;
                            bN = da
                        }
                    } else {
                        c9 = null;
                        bN = da
                    }
                } else {
                    c9 = null;
                    bN = da
                }
                return c9
            }
            function ao() {
                var c8, c7;
                c7 = bZ();
                if (c7 === null) {
                    c7 = b7();
                    if (c7 === null) {
                        c7 = Z()
                    }
                }
                if (c7 !== null) {
                    c8 = [];
                    while (c7 !== null) {
                        c8.push(c7);
                        c7 = bZ();
                        if (c7 === null) {
                            c7 = b7();
                            if (c7 === null) {
                                c7 = Z()
                            }
                        }
                    }
                } else {
                    c8 = null
                }
                return c8
            }
            function b5() {
                var c8, c7;
                c8 = [];
                c7 = bZ();
                if (c7 === null) {
                    c7 = b7();
                    if (c7 === null) {
                        c7 = Z()
                    }
                }
                while (c7 !== null) {
                    c8.push(c7);
                    c7 = bZ();
                    if (c7 === null) {
                        c7 = b7();
                        if (c7 === null) {
                            c7 = Z()
                        }
                    }
                }
                return c8
            }
            function bZ() {
                var c7;
                if (aU.charCodeAt(bN) === 91) {
                    c7 = "[";
                    bN++
                } else {
                    c7 = null;
                    if (T === 0) {
                        at('"["')
                    }
                }
                if (c7 === null) {
                    if (aU.charCodeAt(bN) === 93) {
                        c7 = "]";
                        bN++
                    } else {
                        c7 = null;
                        if (T === 0) {
                            at('"]"')
                        }
                    }
                    if (c7 === null) {
                        if (aU.charCodeAt(bN) === 47) {
                            c7 = "/";
                            bN++
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at('"/"')
                            }
                        }
                        if (c7 === null) {
                            if (aU.charCodeAt(bN) === 63) {
                                c7 = "?";
                                bN++
                            } else {
                                c7 = null;
                                if (T === 0) {
                                    at('"?"')
                                }
                            }
                            if (c7 === null) {
                                if (aU.charCodeAt(bN) === 58) {
                                    c7 = ":";
                                    bN++
                                } else {
                                    c7 = null;
                                    if (T === 0) {
                                        at('":"')
                                    }
                                }
                                if (c7 === null) {
                                    if (aU.charCodeAt(bN) === 43) {
                                        c7 = "+";
                                        bN++
                                    } else {
                                        c7 = null;
                                        if (T === 0) {
                                            at('"+"')
                                        }
                                    }
                                    if (c7 === null) {
                                        if (aU.charCodeAt(bN) === 36) {
                                            c7 = "$";
                                            bN++
                                        } else {
                                            c7 = null;
                                            if (T === 0) {
                                                at('"$"')
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return c7
            }
            function b8() {
                var c7;
                c7 = bl();
                if (c7 === null) {
                    c7 = c6()
                }
                return c7
            }
            function c6() {
                var db, da, c9, c8, c7;
                var dc;
                dc = bN;
                db = aq();
                if (db !== null) {
                    da = n();
                    if (da !== null) {
                        c9 = bo();
                        if (c9 !== null) {
                            c8 = n();
                            if (c8 !== null) {
                                c7 = bj();
                                if (c7 !== null) {
                                    db = [db, da, c9, c8, c7]
                                } else {
                                    db = null;
                                    bN = dc
                                }
                            } else {
                                db = null;
                                bN = dc
                            }
                        } else {
                            db = null;
                            bN = dc
                        }
                    } else {
                        db = null;
                        bN = dc
                    }
                } else {
                    db = null;
                    bN = dc
                }
                return db
            }
            function bo() {
                var c7;
                c7 = z();
                if (c7 === null) {
                    c7 = cL()
                }
                return c7
            }
            function cL() {
                var c9, c8, c7;
                var da;
                da = bN;
                c9 = bO();
                if (c9 !== null) {
                    if (aU.charCodeAt(bN) === 58) {
                        c8 = ":";
                        bN++
                    } else {
                        c8 = null;
                        if (T === 0) {
                            at('":"')
                        }
                    }
                    if (c8 !== null) {
                        c7 = C();
                        if (c7 === null) {
                            c7 = ae()
                        }
                        if (c7 !== null) {
                            c9 = [c9, c8, c7]
                        } else {
                            c9 = null;
                            bN = da
                        }
                    } else {
                        c9 = null;
                        bN = da
                    }
                } else {
                    c9 = null;
                    bN = da
                }
                return c9
            }
            function C() {
                var da, c8, c7;
                var db, c9;
                db = bN;
                da = cI();
                if (da === null) {
                    da = cl()
                }
                if (da !== null) {
                    c9 = bN;
                    if (aU.charCodeAt(bN) === 63) {
                        c8 = "?";
                        bN++
                    } else {
                        c8 = null;
                        if (T === 0) {
                            at('"?"')
                        }
                    }
                    if (c8 !== null) {
                        c7 = cb();
                        if (c7 !== null) {
                            c8 = [c8, c7]
                        } else {
                            c8 = null;
                            bN = c9
                        }
                    } else {
                        c8 = null;
                        bN = c9
                    }
                    c8 = c8 !== null ? c8 : "";
                    if (c8 !== null) {
                        da = [da, c8]
                    } else {
                        da = null;
                        bN = db
                    }
                } else {
                    da = null;
                    bN = db
                }
                return da
            }
            function cI() {
                var c9, c8, c7;
                var da;
                da = bN;
                if (aU.substr(bN, 2) === "//") {
                    c9 = "//";
                    bN += 2
                } else {
                    c9 = null;
                    if (T === 0) {
                        at('"//"')
                    }
                }
                if (c9 !== null) {
                    c8 = O();
                    if (c8 !== null) {
                        c7 = cl();
                        c7 = c7 !== null ? c7 : "";
                        if (c7 !== null) {
                            c9 = [c9, c8, c7]
                        } else {
                            c9 = null;
                            bN = da
                        }
                    } else {
                        c9 = null;
                        bN = da
                    }
                } else {
                    c9 = null;
                    bN = da
                }
                return c9
            }
            function cl() {
                var c8, c7;
                var c9;
                c9 = bN;
                if (aU.charCodeAt(bN) === 47) {
                    c8 = "/";
                    bN++
                } else {
                    c8 = null;
                    if (T === 0) {
                        at('"/"')
                    }
                }
                if (c8 !== null) {
                    c7 = aE();
                    if (c7 !== null) {
                        c8 = [c8, c7]
                    } else {
                        c8 = null;
                        bN = c9
                    }
                } else {
                    c8 = null;
                    bN = c9
                }
                return c8
            }
            function ae() {
                var c9, c8, c7;
                var da;
                da = bN;
                c9 = p();
                if (c9 !== null) {
                    c8 = [];
                    c7 = S();
                    while (c7 !== null) {
                        c8.push(c7);
                        c7 = S()
                    }
                    if (c8 !== null) {
                        c9 = [c9, c8]
                    } else {
                        c9 = null;
                        bN = da
                    }
                } else {
                    c9 = null;
                    bN = da
                }
                return c9
            }
            function S() {
                var c7;
                c7 = L();
                if (c7 === null) {
                    c7 = b7();
                    if (c7 === null) {
                        c7 = Z()
                    }
                }
                return c7
            }
            function p() {
                var c7;
                c7 = b7();
                if (c7 === null) {
                    c7 = Z();
                    if (c7 === null) {
                        if (aU.charCodeAt(bN) === 59) {
                            c7 = ";";
                            bN++
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at('";"')
                            }
                        }
                        if (c7 === null) {
                            if (aU.charCodeAt(bN) === 63) {
                                c7 = "?";
                                bN++
                            } else {
                                c7 = null;
                                if (T === 0) {
                                    at('"?"')
                                }
                            }
                            if (c7 === null) {
                                if (aU.charCodeAt(bN) === 58) {
                                    c7 = ":";
                                    bN++
                                } else {
                                    c7 = null;
                                    if (T === 0) {
                                        at('":"')
                                    }
                                }
                                if (c7 === null) {
                                    if (aU.charCodeAt(bN) === 64) {
                                        c7 = "@";
                                        bN++
                                    } else {
                                        c7 = null;
                                        if (T === 0) {
                                            at('"@"')
                                        }
                                    }
                                    if (c7 === null) {
                                        if (aU.charCodeAt(bN) === 38) {
                                            c7 = "&";
                                            bN++
                                        } else {
                                            c7 = null;
                                            if (T === 0) {
                                                at('"&"')
                                            }
                                        }
                                        if (c7 === null) {
                                            if (aU.charCodeAt(bN) === 61) {
                                                c7 = "=";
                                                bN++
                                            } else {
                                                c7 = null;
                                                if (T === 0) {
                                                    at('"="')
                                                }
                                            }
                                            if (c7 === null) {
                                                if (aU.charCodeAt(bN) === 43) {
                                                    c7 = "+";
                                                    bN++
                                                } else {
                                                    c7 = null;
                                                    if (T === 0) {
                                                        at('"+"')
                                                    }
                                                }
                                                if (c7 === null) {
                                                    if (aU.charCodeAt(bN) === 36) {
                                                        c7 = "$";
                                                        bN++
                                                    } else {
                                                        c7 = null;
                                                        if (T === 0) {
                                                            at('"$"')
                                                        }
                                                    }
                                                    if (c7 === null) {
                                                        if (aU.charCodeAt(bN) === 44) {
                                                            c7 = ",";
                                                            bN++
                                                        } else {
                                                            c7 = null;
                                                            if (T === 0) {
                                                                at('","')
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return c7
            }
            function aE() {
                var db, c9, c8, c7;
                var dc, da;
                dc = bN;
                db = bM();
                if (db !== null) {
                    c9 = [];
                    da = bN;
                    if (aU.charCodeAt(bN) === 47) {
                        c8 = "/";
                        bN++
                    } else {
                        c8 = null;
                        if (T === 0) {
                            at('"/"')
                        }
                    }
                    if (c8 !== null) {
                        c7 = bM();
                        if (c7 !== null) {
                            c8 = [c8, c7]
                        } else {
                            c8 = null;
                            bN = da
                        }
                    } else {
                        c8 = null;
                        bN = da
                    }
                    while (c8 !== null) {
                        c9.push(c8);
                        da = bN;
                        if (aU.charCodeAt(bN) === 47) {
                            c8 = "/";
                            bN++
                        } else {
                            c8 = null;
                            if (T === 0) {
                                at('"/"')
                            }
                        }
                        if (c8 !== null) {
                            c7 = bM();
                            if (c7 !== null) {
                                c8 = [c8, c7]
                            } else {
                                c8 = null;
                                bN = da
                            }
                        } else {
                            c8 = null;
                            bN = da
                        }
                    }
                    if (c9 !== null) {
                        db = [db, c9]
                    } else {
                        db = null;
                        bN = dc
                    }
                } else {
                    db = null;
                    bN = dc
                }
                return db
            }
            function bM() {
                var db, c9, c8, c7;
                var dc, da;
                dc = bN;
                db = [];
                c9 = g();
                while (c9 !== null) {
                    db.push(c9);
                    c9 = g()
                }
                if (db !== null) {
                    c9 = [];
                    da = bN;
                    if (aU.charCodeAt(bN) === 59) {
                        c8 = ";";
                        bN++
                    } else {
                        c8 = null;
                        if (T === 0) {
                            at('";"')
                        }
                    }
                    if (c8 !== null) {
                        c7 = bg();
                        if (c7 !== null) {
                            c8 = [c8, c7]
                        } else {
                            c8 = null;
                            bN = da
                        }
                    } else {
                        c8 = null;
                        bN = da
                    }
                    while (c8 !== null) {
                        c9.push(c8);
                        da = bN;
                        if (aU.charCodeAt(bN) === 59) {
                            c8 = ";";
                            bN++
                        } else {
                            c8 = null;
                            if (T === 0) {
                                at('";"')
                            }
                        }
                        if (c8 !== null) {
                            c7 = bg();
                            if (c7 !== null) {
                                c8 = [c8, c7]
                            } else {
                                c8 = null;
                                bN = da
                            }
                        } else {
                            c8 = null;
                            bN = da
                        }
                    }
                    if (c9 !== null) {
                        db = [db, c9]
                    } else {
                        db = null;
                        bN = dc
                    }
                } else {
                    db = null;
                    bN = dc
                }
                return db
            }
            function bg() {
                var c8, c7;
                c8 = [];
                c7 = g();
                while (c7 !== null) {
                    c8.push(c7);
                    c7 = g()
                }
                return c8
            }
            function g() {
                var c7;
                c7 = b7();
                if (c7 === null) {
                    c7 = Z();
                    if (c7 === null) {
                        if (aU.charCodeAt(bN) === 58) {
                            c7 = ":";
                            bN++
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at('":"')
                            }
                        }
                        if (c7 === null) {
                            if (aU.charCodeAt(bN) === 64) {
                                c7 = "@";
                                bN++
                            } else {
                                c7 = null;
                                if (T === 0) {
                                    at('"@"')
                                }
                            }
                            if (c7 === null) {
                                if (aU.charCodeAt(bN) === 38) {
                                    c7 = "&";
                                    bN++
                                } else {
                                    c7 = null;
                                    if (T === 0) {
                                        at('"&"')
                                    }
                                }
                                if (c7 === null) {
                                    if (aU.charCodeAt(bN) === 61) {
                                        c7 = "=";
                                        bN++
                                    } else {
                                        c7 = null;
                                        if (T === 0) {
                                            at('"="')
                                        }
                                    }
                                    if (c7 === null) {
                                        if (aU.charCodeAt(bN) === 43) {
                                            c7 = "+";
                                            bN++
                                        } else {
                                            c7 = null;
                                            if (T === 0) {
                                                at('"+"')
                                            }
                                        }
                                        if (c7 === null) {
                                            if (aU.charCodeAt(bN) === 36) {
                                                c7 = "$";
                                                bN++
                                            } else {
                                                c7 = null;
                                                if (T === 0) {
                                                    at('"$"')
                                                }
                                            }
                                            if (c7 === null) {
                                                if (aU.charCodeAt(bN) === 44) {
                                                    c7 = ",";
                                                    bN++
                                                } else {
                                                    c7 = null;
                                                    if (T === 0) {
                                                        at('","')
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return c7
            }
            function bO() {
                var da, c8, c7;
                var db, c9;
                db = bN;
                c9 = bN;
                da = bK();
                if (da !== null) {
                    c8 = [];
                    c7 = bK();
                    if (c7 === null) {
                        c7 = bA();
                        if (c7 === null) {
                            if (aU.charCodeAt(bN) === 43) {
                                c7 = "+";
                                bN++
                            } else {
                                c7 = null;
                                if (T === 0) {
                                    at('"+"')
                                }
                            }
                            if (c7 === null) {
                                if (aU.charCodeAt(bN) === 45) {
                                    c7 = "-";
                                    bN++
                                } else {
                                    c7 = null;
                                    if (T === 0) {
                                        at('"-"')
                                    }
                                }
                                if (c7 === null) {
                                    if (aU.charCodeAt(bN) === 46) {
                                        c7 = ".";
                                        bN++
                                    } else {
                                        c7 = null;
                                        if (T === 0) {
                                            at('"."')
                                        }
                                    }
                                }
                            }
                        }
                    }
                    while (c7 !== null) {
                        c8.push(c7);
                        c7 = bK();
                        if (c7 === null) {
                            c7 = bA();
                            if (c7 === null) {
                                if (aU.charCodeAt(bN) === 43) {
                                    c7 = "+";
                                    bN++
                                } else {
                                    c7 = null;
                                    if (T === 0) {
                                        at('"+"')
                                    }
                                }
                                if (c7 === null) {
                                    if (aU.charCodeAt(bN) === 45) {
                                        c7 = "-";
                                        bN++
                                    } else {
                                        c7 = null;
                                        if (T === 0) {
                                            at('"-"')
                                        }
                                    }
                                    if (c7 === null) {
                                        if (aU.charCodeAt(bN) === 46) {
                                            c7 = ".";
                                            bN++
                                        } else {
                                            c7 = null;
                                            if (T === 0) {
                                                at('"."')
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (c8 !== null) {
                        da = [da, c8]
                    } else {
                        da = null;
                        bN = c9
                    }
                } else {
                    da = null;
                    bN = c9
                }
                if (da !== null) {
                    da = (function (dc) {
                        bE.scheme = aU.substring(bN, dc)
                    })(db)
                }
                if (da === null) {
                    bN = db
                }
                return da
            }
            function O() {
                var c7;
                c7 = bQ();
                if (c7 === null) {
                    c7 = cJ()
                }
                return c7
            }
            function bQ() {
                var c9, c7;
                var da, c8;
                da = bN;
                c8 = bN;
                c9 = bf();
                if (c9 !== null) {
                    if (aU.charCodeAt(bN) === 64) {
                        c7 = "@";
                        bN++
                    } else {
                        c7 = null;
                        if (T === 0) {
                            at('"@"')
                        }
                    }
                    if (c7 !== null) {
                        c9 = [c9, c7]
                    } else {
                        c9 = null;
                        bN = c8
                    }
                } else {
                    c9 = null;
                    bN = c8
                }
                c9 = c9 !== null ? c9 : "";
                if (c9 !== null) {
                    c7 = b3();
                    if (c7 !== null) {
                        c9 = [c9, c7]
                    } else {
                        c9 = null;
                        bN = da
                    }
                } else {
                    c9 = null;
                    bN = da
                }
                c9 = c9 !== null ? c9 : "";
                return c9
            }
            function cJ() {
                var c8, c7;
                c7 = b7();
                if (c7 === null) {
                    c7 = Z();
                    if (c7 === null) {
                        if (aU.charCodeAt(bN) === 36) {
                            c7 = "$";
                            bN++
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at('"$"')
                            }
                        }
                        if (c7 === null) {
                            if (aU.charCodeAt(bN) === 44) {
                                c7 = ",";
                                bN++
                            } else {
                                c7 = null;
                                if (T === 0) {
                                    at('","')
                                }
                            }
                            if (c7 === null) {
                                if (aU.charCodeAt(bN) === 59) {
                                    c7 = ";";
                                    bN++
                                } else {
                                    c7 = null;
                                    if (T === 0) {
                                        at('";"')
                                    }
                                }
                                if (c7 === null) {
                                    if (aU.charCodeAt(bN) === 58) {
                                        c7 = ":";
                                        bN++
                                    } else {
                                        c7 = null;
                                        if (T === 0) {
                                            at('":"')
                                        }
                                    }
                                    if (c7 === null) {
                                        if (aU.charCodeAt(bN) === 64) {
                                            c7 = "@";
                                            bN++
                                        } else {
                                            c7 = null;
                                            if (T === 0) {
                                                at('"@"')
                                            }
                                        }
                                        if (c7 === null) {
                                            if (aU.charCodeAt(bN) === 38) {
                                                c7 = "&";
                                                bN++
                                            } else {
                                                c7 = null;
                                                if (T === 0) {
                                                    at('"&"')
                                                }
                                            }
                                            if (c7 === null) {
                                                if (aU.charCodeAt(bN) === 61) {
                                                    c7 = "=";
                                                    bN++
                                                } else {
                                                    c7 = null;
                                                    if (T === 0) {
                                                        at('"="')
                                                    }
                                                }
                                                if (c7 === null) {
                                                    if (aU.charCodeAt(bN) === 43) {
                                                        c7 = "+";
                                                        bN++
                                                    } else {
                                                        c7 = null;
                                                        if (T === 0) {
                                                            at('"+"')
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (c7 !== null) {
                    c8 = [];
                    while (c7 !== null) {
                        c8.push(c7);
                        c7 = b7();
                        if (c7 === null) {
                            c7 = Z();
                            if (c7 === null) {
                                if (aU.charCodeAt(bN) === 36) {
                                    c7 = "$";
                                    bN++
                                } else {
                                    c7 = null;
                                    if (T === 0) {
                                        at('"$"')
                                    }
                                }
                                if (c7 === null) {
                                    if (aU.charCodeAt(bN) === 44) {
                                        c7 = ",";
                                        bN++
                                    } else {
                                        c7 = null;
                                        if (T === 0) {
                                            at('","')
                                        }
                                    }
                                    if (c7 === null) {
                                        if (aU.charCodeAt(bN) === 59) {
                                            c7 = ";";
                                            bN++
                                        } else {
                                            c7 = null;
                                            if (T === 0) {
                                                at('";"')
                                            }
                                        }
                                        if (c7 === null) {
                                            if (aU.charCodeAt(bN) === 58) {
                                                c7 = ":";
                                                bN++
                                            } else {
                                                c7 = null;
                                                if (T === 0) {
                                                    at('":"')
                                                }
                                            }
                                            if (c7 === null) {
                                                if (aU.charCodeAt(bN) === 64) {
                                                    c7 = "@";
                                                    bN++
                                                } else {
                                                    c7 = null;
                                                    if (T === 0) {
                                                        at('"@"')
                                                    }
                                                }
                                                if (c7 === null) {
                                                    if (aU.charCodeAt(bN) === 38) {
                                                        c7 = "&";
                                                        bN++
                                                    } else {
                                                        c7 = null;
                                                        if (T === 0) {
                                                            at('"&"')
                                                        }
                                                    }
                                                    if (c7 === null) {
                                                        if (aU.charCodeAt(bN) === 61) {
                                                            c7 = "=";
                                                            bN++
                                                        } else {
                                                            c7 = null;
                                                            if (T === 0) {
                                                                at('"="')
                                                            }
                                                        }
                                                        if (c7 === null) {
                                                            if (aU.charCodeAt(bN) === 43) {
                                                                c7 = "+";
                                                                bN++
                                                            } else {
                                                                c7 = null;
                                                                if (T === 0) {
                                                                    at('"+"')
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    c8 = null
                }
                return c8
            }
            function cb() {
                var c8, c7;
                c8 = [];
                c7 = S();
                while (c7 !== null) {
                    c8.push(c7);
                    c7 = S()
                }
                return c8
            }
            function bj() {
                var dd, db, da, c9, c8, c7;
                var de, dc;
                de = bN;
                dc = bN;
                if (aU.substr(bN, 3) === "SIP") {
                    dd = "SIP";
                    bN += 3
                } else {
                    dd = null;
                    if (T === 0) {
                        at('"SIP"')
                    }
                }
                if (dd !== null) {
                    if (aU.charCodeAt(bN) === 47) {
                        db = "/";
                        bN++
                    } else {
                        db = null;
                        if (T === 0) {
                            at('"/"')
                        }
                    }
                    if (db !== null) {
                        c9 = bA();
                        if (c9 !== null) {
                            da = [];
                            while (c9 !== null) {
                                da.push(c9);
                                c9 = bA()
                            }
                        } else {
                            da = null
                        }
                        if (da !== null) {
                            if (aU.charCodeAt(bN) === 46) {
                                c9 = ".";
                                bN++
                            } else {
                                c9 = null;
                                if (T === 0) {
                                    at('"."')
                                }
                            }
                            if (c9 !== null) {
                                c7 = bA();
                                if (c7 !== null) {
                                    c8 = [];
                                    while (c7 !== null) {
                                        c8.push(c7);
                                        c7 = bA()
                                    }
                                } else {
                                    c8 = null
                                }
                                if (c8 !== null) {
                                    dd = [dd, db, da, c9, c8]
                                } else {
                                    dd = null;
                                    bN = dc
                                }
                            } else {
                                dd = null;
                                bN = dc
                            }
                        } else {
                            dd = null;
                            bN = dc
                        }
                    } else {
                        dd = null;
                        bN = dc
                    }
                } else {
                    dd = null;
                    bN = dc
                }
                if (dd !== null) {
                    dd = (function (df) {
                        bE.sip_version = aU.substring(bN, df)
                    })(de)
                }
                if (dd === null) {
                    bN = de
                }
                return dd
            }
            function bX() {
                var c7;
                if (aU.substr(bN, 6) === "INVITE") {
                    c7 = "INVITE";
                    bN += 6
                } else {
                    c7 = null;
                    if (T === 0) {
                        at('"INVITE"')
                    }
                }
                return c7
            }
            function ai() {
                var c7;
                if (aU.substr(bN, 3) === "ACK") {
                    c7 = "ACK";
                    bN += 3
                } else {
                    c7 = null;
                    if (T === 0) {
                        at('"ACK"')
                    }
                }
                return c7
            }
            function Q() {
                var c7;
                if (aU.substr(bN, 7) === "OPTIONS") {
                    c7 = "OPTIONS";
                    bN += 7
                } else {
                    c7 = null;
                    if (T === 0) {
                        at('"OPTIONS"')
                    }
                }
                return c7
            }
            function cc() {
                var c7;
                if (aU.substr(bN, 3) === "BYE") {
                    c7 = "BYE";
                    bN += 3
                } else {
                    c7 = null;
                    if (T === 0) {
                        at('"BYE"')
                    }
                }
                return c7
            }
            function a7() {
                var c7;
                if (aU.substr(bN, 6) === "CANCEL") {
                    c7 = "CANCEL";
                    bN += 6
                } else {
                    c7 = null;
                    if (T === 0) {
                        at('"CANCEL"')
                    }
                }
                return c7
            }
            function aH() {
                var c7;
                if (aU.substr(bN, 8) === "REGISTER") {
                    c7 = "REGISTER";
                    bN += 8
                } else {
                    c7 = null;
                    if (T === 0) {
                        at('"REGISTER"')
                    }
                }
                return c7
            }
            function aI() {
                var c7;
                if (aU.substr(bN, 9) === "SUBSCRIBE") {
                    c7 = "SUBSCRIBE";
                    bN += 9
                } else {
                    c7 = null;
                    if (T === 0) {
                        at('"SUBSCRIBE"')
                    }
                }
                return c7
            }
            function cm() {
                var c7;
                if (aU.substr(bN, 6) === "NOTIFY") {
                    c7 = "NOTIFY";
                    bN += 6
                } else {
                    c7 = null;
                    if (T === 0) {
                        at('"NOTIFY"')
                    }
                }
                return c7
            }
            function aq() {
                var c7;
                var c8;
                c8 = bN;
                c7 = bX();
                if (c7 === null) {
                    c7 = ai();
                    if (c7 === null) {
                        c7 = Q();
                        if (c7 === null) {
                            c7 = cc();
                            if (c7 === null) {
                                c7 = a7();
                                if (c7 === null) {
                                    c7 = aH();
                                    if (c7 === null) {
                                        c7 = aI();
                                        if (c7 === null) {
                                            c7 = cm();
                                            if (c7 === null) {
                                                c7 = bI()
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (c7 !== null) {
                    c7 = (function (c9) {
                        bE.method = aU.substring(bN, c9)
                    })(c8)
                }
                if (c7 === null) {
                    bN = c8
                }
                return c7
            }
            function bl() {
                var db, da, c9, c8, c7;
                var dc;
                dc = bN;
                db = bj();
                if (db !== null) {
                    da = n();
                    if (da !== null) {
                        c9 = aA();
                        if (c9 !== null) {
                            c8 = n();
                            if (c8 !== null) {
                                c7 = ax();
                                if (c7 !== null) {
                                    db = [db, da, c9, c8, c7]
                                } else {
                                    db = null;
                                    bN = dc
                                }
                            } else {
                                db = null;
                                bN = dc
                            }
                        } else {
                            db = null;
                            bN = dc
                        }
                    } else {
                        db = null;
                        bN = dc
                    }
                } else {
                    db = null;
                    bN = dc
                }
                return db
            }
            function aA() {
                var c7;
                var c8;
                c8 = bN;
                c7 = c3();
                if (c7 !== null) {
                    c7 = (function (da, c9) {
                        bE.status_code = parseInt(c9.join(""))
                    })(c8, c7)
                }
                if (c7 === null) {
                    bN = c8
                }
                return c7
            }
            function c3() {
                var c9, c8, c7;
                var da;
                da = bN;
                c9 = bA();
                if (c9 !== null) {
                    c8 = bA();
                    if (c8 !== null) {
                        c7 = bA();
                        if (c7 !== null) {
                            c9 = [c9, c8, c7]
                        } else {
                            c9 = null;
                            bN = da
                        }
                    } else {
                        c9 = null;
                        bN = da
                    }
                } else {
                    c9 = null;
                    bN = da
                }
                return c9
            }
            function ax() {
                var c8, c7;
                var c9;
                c9 = bN;
                c8 = [];
                c7 = L();
                if (c7 === null) {
                    c7 = b7();
                    if (c7 === null) {
                        c7 = Z();
                        if (c7 === null) {
                            c7 = by();
                            if (c7 === null) {
                                c7 = b4();
                                if (c7 === null) {
                                    c7 = n();
                                    if (c7 === null) {
                                        c7 = r()
                                    }
                                }
                            }
                        }
                    }
                }
                while (c7 !== null) {
                    c8.push(c7);
                    c7 = L();
                    if (c7 === null) {
                        c7 = b7();
                        if (c7 === null) {
                            c7 = Z();
                            if (c7 === null) {
                                c7 = by();
                                if (c7 === null) {
                                    c7 = b4();
                                    if (c7 === null) {
                                        c7 = n();
                                        if (c7 === null) {
                                            c7 = r()
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (c8 !== null) {
                    c8 = (function (da) {
                        bE.reason_phrase = aU.substring(bN, da)
                    })(c9)
                }
                if (c8 === null) {
                    bN = c9
                }
                return c8
            }
            function cC() {
                var db, c9, c8, c7;
                var dc, da;
                dc = bN;
                db = bW();
                if (db !== null) {
                    c9 = [];
                    da = bN;
                    c8 = co();
                    if (c8 !== null) {
                        c7 = bW();
                        if (c7 !== null) {
                            c8 = [c8, c7]
                        } else {
                            c8 = null;
                            bN = da
                        }
                    } else {
                        c8 = null;
                        bN = da
                    }
                    while (c8 !== null) {
                        c9.push(c8);
                        da = bN;
                        c8 = co();
                        if (c8 !== null) {
                            c7 = bW();
                            if (c7 !== null) {
                                c8 = [c8, c7]
                            } else {
                                c8 = null;
                                bN = da
                            }
                        } else {
                            c8 = null;
                            bN = da
                        }
                    }
                    if (c9 !== null) {
                        db = [db, c9]
                    } else {
                        db = null;
                        bN = dc
                    }
                } else {
                    db = null;
                    bN = dc
                }
                return db
            }
            function al() {
                var db, c9, c7;
                var dc, da, c8;
                dc = bN;
                da = bN;
                db = aZ();
                if (db !== null) {
                    c8 = bN;
                    if (aU.charCodeAt(bN) === 64) {
                        c9 = "@";
                        bN++
                    } else {
                        c9 = null;
                        if (T === 0) {
                            at('"@"')
                        }
                    }
                    if (c9 !== null) {
                        c7 = aZ();
                        if (c7 !== null) {
                            c9 = [c9, c7]
                        } else {
                            c9 = null;
                            bN = c8
                        }
                    } else {
                        c9 = null;
                        bN = c8
                    }
                    c9 = c9 !== null ? c9 : "";
                    if (c9 !== null) {
                        db = [db, c9]
                    } else {
                        db = null;
                        bN = da
                    }
                } else {
                    db = null;
                    bN = da
                }
                if (db !== null) {
                    db = (function (dd) {
                        bE = aU.substring(bN, dd)
                    })(dc)
                }
                if (db === null) {
                    bN = dc
                }
                return db
            }
            function ch() {
                var db, c9, c8, c7;
                var dc, da;
                db = aO();
                if (db === null) {
                    dc = bN;
                    db = cK();
                    if (db !== null) {
                        c9 = [];
                        da = bN;
                        c8 = co();
                        if (c8 !== null) {
                            c7 = cK();
                            if (c7 !== null) {
                                c8 = [c8, c7]
                            } else {
                                c8 = null;
                                bN = da
                            }
                        } else {
                            c8 = null;
                            bN = da
                        }
                        while (c8 !== null) {
                            c9.push(c8);
                            da = bN;
                            c8 = co();
                            if (c8 !== null) {
                                c7 = cK();
                                if (c7 !== null) {
                                    c8 = [c8, c7]
                                } else {
                                    c8 = null;
                                    bN = da
                                }
                            } else {
                                c8 = null;
                                bN = da
                            }
                        }
                        if (c9 !== null) {
                            db = [db, c9]
                        } else {
                            db = null;
                            bN = dc
                        }
                    } else {
                        db = null;
                        bN = dc
                    }
                }
                return db
            }
            function cK() {
                var db, c9, c8, c7;
                var dc, da;
                dc = bN;
                db = aV();
                if (db === null) {
                    db = a8()
                }
                if (db !== null) {
                    c9 = [];
                    da = bN;
                    c8 = w();
                    if (c8 !== null) {
                        c7 = cp();
                        if (c7 !== null) {
                            c8 = [c8, c7]
                        } else {
                            c8 = null;
                            bN = da
                        }
                    } else {
                        c8 = null;
                        bN = da
                    }
                    while (c8 !== null) {
                        c9.push(c8);
                        da = bN;
                        c8 = w();
                        if (c8 !== null) {
                            c7 = cp();
                            if (c7 !== null) {
                                c8 = [c8, c7]
                            } else {
                                c8 = null;
                                bN = da
                            }
                        } else {
                            c8 = null;
                            bN = da
                        }
                    }
                    if (c9 !== null) {
                        db = [db, c9]
                    } else {
                        db = null;
                        bN = dc
                    }
                } else {
                    db = null;
                    bN = dc
                }
                return db
            }
            function a8() {
                var da, c9, c8, c7;
                var db;
                db = bN;
                da = az();
                da = da !== null ? da : "";
                if (da !== null) {
                    c9 = cD();
                    if (c9 !== null) {
                        c8 = aV();
                        if (c8 !== null) {
                            c7 = a4();
                            if (c7 !== null) {
                                da = [da, c9, c8, c7]
                            } else {
                                da = null;
                                bN = db
                            }
                        } else {
                            da = null;
                            bN = db
                        }
                    } else {
                        da = null;
                        bN = db
                    }
                } else {
                    da = null;
                    bN = db
                }
                return da
            }
            function aV() {
                var c7;
                c7 = z();
                if (c7 === null) {
                    c7 = cL()
                }
                return c7
            }
            function cw() {
                var c7;
                c7 = M();
                if (c7 === null) {
                    c7 = cL()
                }
                return c7
            }
            function az() {
                var dc, da, c8, c7;
                var dd, db, c9;
                dd = bN;
                db = bN;
                dc = bI();
                if (dc !== null) {
                    da = [];
                    c9 = bN;
                    c8 = ck();
                    if (c8 !== null) {
                        c7 = bI();
                        if (c7 !== null) {
                            c8 = [c8, c7]
                        } else {
                            c8 = null;
                            bN = c9
                        }
                    } else {
                        c8 = null;
                        bN = c9
                    }
                    while (c8 !== null) {
                        da.push(c8);
                        c9 = bN;
                        c8 = ck();
                        if (c8 !== null) {
                            c7 = bI();
                            if (c7 !== null) {
                                c8 = [c8, c7]
                            } else {
                                c8 = null;
                                bN = c9
                            }
                        } else {
                            c8 = null;
                            bN = c9
                        }
                    }
                    if (da !== null) {
                        dc = [dc, da]
                    } else {
                        dc = null;
                        bN = db
                    }
                } else {
                    dc = null;
                    bN = db
                }
                if (dc === null) {
                    dc = cO()
                }
                if (dc !== null) {
                    dc = (function (df, de) {
                        bE.display_name = de
                    })(dd, dc)
                }
                if (dc === null) {
                    bN = dd
                }
                return dc
            }
            function cp() {
                var c7;
                c7 = cE();
                if (c7 === null) {
                    c7 = a2();
                    if (c7 === null) {
                        c7 = a3()
                    }
                }
                return c7
            }
            function cE() {
                var da, c8, c7;
                var db, c9;
                db = bN;
                c9 = bN;
                if (aU.charCodeAt(bN) === 113) {
                    da = "q";
                    bN++
                } else {
                    da = null;
                    if (T === 0) {
                        at('"q"')
                    }
                }
                if (da !== null) {
                    c8 = bw();
                    if (c8 !== null) {
                        c7 = v();
                        if (c7 !== null) {
                            da = [da, c8, c7]
                        } else {
                            da = null;
                            bN = c9
                        }
                    } else {
                        da = null;
                        bN = c9
                    }
                } else {
                    da = null;
                    bN = c9
                }
                if (da !== null) {
                    da = (function (dd, dc) {
                        if (!bE.params) {
                            bE.params = {}
                        }
                        bE.params.q = dc
                    })(db, da[2])
                }
                if (da === null) {
                    bN = db
                }
                return da
            }
            function a2() {
                var da, c8, c7;
                var db, c9;
                db = bN;
                c9 = bN;
                if (aU.substr(bN, 7) === "expires") {
                    da = "expires";
                    bN += 7
                } else {
                    da = null;
                    if (T === 0) {
                        at('"expires"')
                    }
                }
                if (da !== null) {
                    c8 = bw();
                    if (c8 !== null) {
                        c7 = c4();
                        if (c7 !== null) {
                            da = [da, c8, c7]
                        } else {
                            da = null;
                            bN = c9
                        }
                    } else {
                        da = null;
                        bN = c9
                    }
                } else {
                    da = null;
                    bN = c9
                }
                if (da !== null) {
                    da = (function (dd, dc) {
                        if (!bE.params) {
                            bE.params = {}
                        }
                        bE.params.expires = dc
                    })(db, da[2])
                }
                if (da === null) {
                    bN = db
                }
                return da
            }
            function a3() {
                var c7;
                var c8;
                c8 = bN;
                c7 = aN();
                if (c7 !== null) {
                    c7 = (function (da, c9) {
                        if (!bE.params) {
                            bE.params = {}
                        }
                        if (c9[1]) {
                            bE.params[c9[0]] = c9[1]
                        } else {
                            bE.params[c9[0]] = true
                        }
                    })(c8, c7)
                }
                if (c7 === null) {
                    bN = c8
                }
                return c7
            }
            function c4() {
                var c8, c7;
                var c9;
                c9 = bN;
                c7 = bA();
                if (c7 !== null) {
                    c8 = [];
                    while (c7 !== null) {
                        c8.push(c7);
                        c7 = bA()
                    }
                } else {
                    c8 = null
                }
                if (c8 !== null) {
                    c8 = (function (db, da) {
                        return parseInt(da.join(""))
                    })(c9, c8)
                }
                if (c8 === null) {
                    bN = c9
                }
                return c8
            }
            function v() {
                var dd, db, c9, c8, c7;
                var de, dc, da;
                de = bN;
                dc = bN;
                if (aU.charCodeAt(bN) === 48) {
                    dd = "0";
                    bN++
                } else {
                    dd = null;
                    if (T === 0) {
                        at('"0"')
                    }
                }
                if (dd !== null) {
                    da = bN;
                    if (aU.charCodeAt(bN) === 46) {
                        db = ".";
                        bN++
                    } else {
                        db = null;
                        if (T === 0) {
                            at('"."')
                        }
                    }
                    if (db !== null) {
                        c9 = bA();
                        c9 = c9 !== null ? c9 : "";
                        if (c9 !== null) {
                            c8 = bA();
                            c8 = c8 !== null ? c8 : "";
                            if (c8 !== null) {
                                c7 = bA();
                                c7 = c7 !== null ? c7 : "";
                                if (c7 !== null) {
                                    db = [db, c9, c8, c7]
                                } else {
                                    db = null;
                                    bN = da
                                }
                            } else {
                                db = null;
                                bN = da
                            }
                        } else {
                            db = null;
                            bN = da
                        }
                    } else {
                        db = null;
                        bN = da
                    }
                    db = db !== null ? db : "";
                    if (db !== null) {
                        dd = [dd, db]
                    } else {
                        dd = null;
                        bN = dc
                    }
                } else {
                    dd = null;
                    bN = dc
                }
                if (dd !== null) {
                    dd = (function (df) {
                        return parseFloat(aU.substring(bN, df))
                    })(de)
                }
                if (dd === null) {
                    bN = de
                }
                return dd
            }
            function aN() {
                var db, c9, c7;
                var dc, da, c8;
                dc = bN;
                da = bN;
                db = bI();
                if (db !== null) {
                    c8 = bN;
                    c9 = bw();
                    if (c9 !== null) {
                        c7 = cZ();
                        if (c7 !== null) {
                            c9 = [c9, c7]
                        } else {
                            c9 = null;
                            bN = c8
                        }
                    } else {
                        c9 = null;
                        bN = c8
                    }
                    c9 = c9 !== null ? c9 : "";
                    if (c9 !== null) {
                        db = [db, c9]
                    } else {
                        db = null;
                        bN = da
                    }
                } else {
                    db = null;
                    bN = da
                }
                if (db !== null) {
                    db = (function (df, de, dd) {
                        if (typeof dd === "undefined") {
                            var dd = null
                        } else {
                            dd = dd[1]
                        }
                        return [de, dd]
                    })(dc, db[0], db[1])
                }
                if (db === null) {
                    bN = dc
                }
                return db
            }
            function cZ() {
                var c7;
                c7 = bI();
                if (c7 === null) {
                    c7 = u();
                    if (c7 === null) {
                        c7 = cO()
                    }
                }
                return c7
            }
            function aR() {
                var db, c9, c8, c7;
                var dc, da;
                dc = bN;
                db = ca();
                if (db !== null) {
                    c9 = [];
                    da = bN;
                    c8 = w();
                    if (c8 !== null) {
                        c7 = c1();
                        if (c7 !== null) {
                            c8 = [c8, c7]
                        } else {
                            c8 = null;
                            bN = da
                        }
                    } else {
                        c8 = null;
                        bN = da
                    }
                    while (c8 !== null) {
                        c9.push(c8);
                        da = bN;
                        c8 = w();
                        if (c8 !== null) {
                            c7 = c1();
                            if (c7 !== null) {
                                c8 = [c8, c7]
                            } else {
                                c8 = null;
                                bN = da
                            }
                        } else {
                            c8 = null;
                            bN = da
                        }
                    }
                    if (c9 !== null) {
                        db = [db, c9]
                    } else {
                        db = null;
                        bN = dc
                    }
                } else {
                    db = null;
                    bN = dc
                }
                return db
            }
            function ca() {
                var c7;
                if (aU.substr(bN, 6) === "render") {
                    c7 = "render";
                    bN += 6
                } else {
                    c7 = null;
                    if (T === 0) {
                        at('"render"')
                    }
                }
                if (c7 === null) {
                    if (aU.substr(bN, 7) === "session") {
                        c7 = "session";
                        bN += 7
                    } else {
                        c7 = null;
                        if (T === 0) {
                            at('"session"')
                        }
                    }
                    if (c7 === null) {
                        if (aU.substr(bN, 4) === "icon") {
                            c7 = "icon";
                            bN += 4
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at('"icon"')
                            }
                        }
                        if (c7 === null) {
                            if (aU.substr(bN, 5) === "alert") {
                                c7 = "alert";
                                bN += 5
                            } else {
                                c7 = null;
                                if (T === 0) {
                                    at('"alert"')
                                }
                            }
                            if (c7 === null) {
                                c7 = bI()
                            }
                        }
                    }
                }
                return c7
            }
            function c1() {
                var c7;
                c7 = bJ();
                if (c7 === null) {
                    c7 = aN()
                }
                return c7
            }
            function bJ() {
                var c9, c8, c7;
                var da;
                da = bN;
                if (aU.substr(bN, 8) === "handling") {
                    c9 = "handling";
                    bN += 8
                } else {
                    c9 = null;
                    if (T === 0) {
                        at('"handling"')
                    }
                }
                if (c9 !== null) {
                    c8 = bw();
                    if (c8 !== null) {
                        if (aU.substr(bN, 8) === "optional") {
                            c7 = "optional";
                            bN += 8
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at('"optional"')
                            }
                        }
                        if (c7 === null) {
                            if (aU.substr(bN, 8) === "required") {
                                c7 = "required";
                                bN += 8
                            } else {
                                c7 = null;
                                if (T === 0) {
                                    at('"required"')
                                }
                            }
                            if (c7 === null) {
                                c7 = bI()
                            }
                        }
                        if (c7 !== null) {
                            c9 = [c9, c8, c7]
                        } else {
                            c9 = null;
                            bN = da
                        }
                    } else {
                        c9 = null;
                        bN = da
                    }
                } else {
                    c9 = null;
                    bN = da
                }
                return c9
            }
            function aL() {
                var db, c9, c8, c7;
                var dc, da;
                dc = bN;
                db = bI();
                if (db !== null) {
                    c9 = [];
                    da = bN;
                    c8 = co();
                    if (c8 !== null) {
                        c7 = bI();
                        if (c7 !== null) {
                            c8 = [c8, c7]
                        } else {
                            c8 = null;
                            bN = da
                        }
                    } else {
                        c8 = null;
                        bN = da
                    }
                    while (c8 !== null) {
                        c9.push(c8);
                        da = bN;
                        c8 = co();
                        if (c8 !== null) {
                            c7 = bI();
                            if (c7 !== null) {
                                c8 = [c8, c7]
                            } else {
                                c8 = null;
                                bN = da
                            }
                        } else {
                            c8 = null;
                            bN = da
                        }
                    }
                    if (c9 !== null) {
                        db = [db, c9]
                    } else {
                        db = null;
                        bN = dc
                    }
                } else {
                    db = null;
                    bN = dc
                }
                return db
            }
            function ah() {
                var c8, c7;
                var c9;
                c9 = bN;
                c7 = bA();
                if (c7 !== null) {
                    c8 = [];
                    while (c7 !== null) {
                        c8.push(c7);
                        c7 = bA()
                    }
                } else {
                    c8 = null
                }
                if (c8 !== null) {
                    c8 = (function (db, da) {
                        bE = parseInt(da.join(""))
                    })(c9, c8)
                }
                if (c8 === null) {
                    bN = c9
                }
                return c8
            }
            function bT() {
                var c7;
                var c8;
                c8 = bN;
                c7 = cj();
                if (c7 !== null) {
                    c7 = (function (c9) {
                        bE = aU.substring(bN, c9)
                    })(c8)
                }
                if (c7 === null) {
                    bN = c8
                }
                return c7
            }
            function cj() {
                var dd, db, da, c9, c8, c7;
                var de, dc;
                de = bN;
                dd = aX();
                if (dd !== null) {
                    db = au();
                    if (db !== null) {
                        da = K();
                        if (da !== null) {
                            c9 = [];
                            dc = bN;
                            c8 = w();
                            if (c8 !== null) {
                                c7 = bv();
                                if (c7 !== null) {
                                    c8 = [c8, c7]
                                } else {
                                    c8 = null;
                                    bN = dc
                                }
                            } else {
                                c8 = null;
                                bN = dc
                            }
                            while (c8 !== null) {
                                c9.push(c8);
                                dc = bN;
                                c8 = w();
                                if (c8 !== null) {
                                    c7 = bv();
                                    if (c7 !== null) {
                                        c8 = [c8, c7]
                                    } else {
                                        c8 = null;
                                        bN = dc
                                    }
                                } else {
                                    c8 = null;
                                    bN = dc
                                }
                            }
                            if (c9 !== null) {
                                dd = [dd, db, da, c9]
                            } else {
                                dd = null;
                                bN = de
                            }
                        } else {
                            dd = null;
                            bN = de
                        }
                    } else {
                        dd = null;
                        bN = de
                    }
                } else {
                    dd = null;
                    bN = de
                }
                return dd
            }
            function aX() {
                var c7;
                c7 = aT();
                if (c7 === null) {
                    c7 = b2()
                }
                return c7
            }
            function aT() {
                var c7;
                if (aU.substr(bN, 4) === "text") {
                    c7 = "text";
                    bN += 4
                } else {
                    c7 = null;
                    if (T === 0) {
                        at('"text"')
                    }
                }
                if (c7 === null) {
                    if (aU.substr(bN, 5) === "image") {
                        c7 = "image";
                        bN += 5
                    } else {
                        c7 = null;
                        if (T === 0) {
                            at('"image"')
                        }
                    }
                    if (c7 === null) {
                        if (aU.substr(bN, 5) === "audio") {
                            c7 = "audio";
                            bN += 5
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at('"audio"')
                            }
                        }
                        if (c7 === null) {
                            if (aU.substr(bN, 5) === "video") {
                                c7 = "video";
                                bN += 5
                            } else {
                                c7 = null;
                                if (T === 0) {
                                    at('"video"')
                                }
                            }
                            if (c7 === null) {
                                if (aU.substr(bN, 11) === "application") {
                                    c7 = "application";
                                    bN += 11
                                } else {
                                    c7 = null;
                                    if (T === 0) {
                                        at('"application"')
                                    }
                                }
                                if (c7 === null) {
                                    c7 = i()
                                }
                            }
                        }
                    }
                }
                return c7
            }
            function b2() {
                var c7;
                if (aU.substr(bN, 7) === "message") {
                    c7 = "message";
                    bN += 7
                } else {
                    c7 = null;
                    if (T === 0) {
                        at('"message"')
                    }
                }
                if (c7 === null) {
                    if (aU.substr(bN, 9) === "multipart") {
                        c7 = "multipart";
                        bN += 9
                    } else {
                        c7 = null;
                        if (T === 0) {
                            at('"multipart"')
                        }
                    }
                    if (c7 === null) {
                        c7 = i()
                    }
                }
                return c7
            }
            function i() {
                var c7;
                c7 = bI();
                if (c7 === null) {
                    c7 = a6()
                }
                return c7
            }
            function a6() {
                var c8, c7;
                var c9;
                c9 = bN;
                if (aU.substr(bN, 2) === "x-") {
                    c8 = "x-";
                    bN += 2
                } else {
                    c8 = null;
                    if (T === 0) {
                        at('"x-"')
                    }
                }
                if (c8 !== null) {
                    c7 = bI();
                    if (c7 !== null) {
                        c8 = [c8, c7]
                    } else {
                        c8 = null;
                        bN = c9
                    }
                } else {
                    c8 = null;
                    bN = c9
                }
                return c8
            }
            function K() {
                var c7;
                c7 = i();
                if (c7 === null) {
                    c7 = bI()
                }
                return c7
            }
            function bv() {
                var c9, c8, c7;
                var da;
                da = bN;
                c9 = bI();
                if (c9 !== null) {
                    c8 = bw();
                    if (c8 !== null) {
                        c7 = an();
                        if (c7 !== null) {
                            c9 = [c9, c8, c7]
                        } else {
                            c9 = null;
                            bN = da
                        }
                    } else {
                        c9 = null;
                        bN = da
                    }
                } else {
                    c9 = null;
                    bN = da
                }
                return c9
            }
            function an() {
                var c7;
                c7 = bI();
                if (c7 === null) {
                    c7 = cO()
                }
                return c7
            }
            function a0() {
                var c9, c8, c7;
                var da;
                da = bN;
                c9 = h();
                if (c9 !== null) {
                    c8 = ck();
                    if (c8 !== null) {
                        c7 = aq();
                        if (c7 !== null) {
                            c9 = [c9, c8, c7]
                        } else {
                            c9 = null;
                            bN = da
                        }
                    } else {
                        c9 = null;
                        bN = da
                    }
                } else {
                    c9 = null;
                    bN = da
                }
                return c9
            }
            function h() {
                var c8, c7;
                var c9;
                c9 = bN;
                c7 = bA();
                if (c7 !== null) {
                    c8 = [];
                    while (c7 !== null) {
                        c8.push(c7);
                        c7 = bA()
                    }
                } else {
                    c8 = null
                }
                if (c8 !== null) {
                    c8 = (function (db, da) {
                        bE.value = parseInt(da.join(""))
                    })(c9, c8)
                }
                if (c8 === null) {
                    bN = c9
                }
                return c8
            }
            function aw() {
                var c7;
                var c8;
                c8 = bN;
                c7 = c4();
                if (c7 !== null) {
                    c7 = (function (da, c9) {
                        bE = c9
                    })(c8, c7)
                }
                if (c7 === null) {
                    bN = c8
                }
                return c7
            }
            function b0() {
                var dc, da, c8, c7;
                var dd, db, c9;
                dd = bN;
                db = bN;
                dc = bW();
                if (dc !== null) {
                    da = [];
                    c9 = bN;
                    c8 = w();
                    if (c8 !== null) {
                        c7 = bS();
                        if (c7 !== null) {
                            c8 = [c8, c7]
                        } else {
                            c8 = null;
                            bN = c9
                        }
                    } else {
                        c8 = null;
                        bN = c9
                    }
                    while (c8 !== null) {
                        da.push(c8);
                        c9 = bN;
                        c8 = w();
                        if (c8 !== null) {
                            c7 = bS();
                            if (c7 !== null) {
                                c8 = [c8, c7]
                            } else {
                                c8 = null;
                                bN = c9
                            }
                        } else {
                            c8 = null;
                            bN = c9
                        }
                    }
                    if (da !== null) {
                        dc = [dc, da]
                    } else {
                        dc = null;
                        bN = db
                    }
                } else {
                    dc = null;
                    bN = db
                }
                if (dc !== null) {
                    dc = (function (de, df) {
                        bE.event = df.join("")
                    })(dd, dc[0])
                }
                if (dc === null) {
                    bN = dd
                }
                return dc
            }
            function bW() {
                var db, c9, c8, c7;
                var dc, da;
                dc = bN;
                db = F();
                if (db !== null) {
                    c9 = [];
                    da = bN;
                    if (aU.charCodeAt(bN) === 46) {
                        c8 = ".";
                        bN++
                    } else {
                        c8 = null;
                        if (T === 0) {
                            at('"."')
                        }
                    }
                    if (c8 !== null) {
                        c7 = F();
                        if (c7 !== null) {
                            c8 = [c8, c7]
                        } else {
                            c8 = null;
                            bN = da
                        }
                    } else {
                        c8 = null;
                        bN = da
                    }
                    while (c8 !== null) {
                        c9.push(c8);
                        da = bN;
                        if (aU.charCodeAt(bN) === 46) {
                            c8 = ".";
                            bN++
                        } else {
                            c8 = null;
                            if (T === 0) {
                                at('"."')
                            }
                        }
                        if (c8 !== null) {
                            c7 = F();
                            if (c7 !== null) {
                                c8 = [c8, c7]
                            } else {
                                c8 = null;
                                bN = da
                            }
                        } else {
                            c8 = null;
                            bN = da
                        }
                    }
                    if (c9 !== null) {
                        db = [db, c9]
                    } else {
                        db = null;
                        bN = dc
                    }
                } else {
                    db = null;
                    bN = dc
                }
                return db
            }
            function bS() {
                var c7;
                var c8;
                c8 = bN;
                c7 = aN();
                if (c7 !== null) {
                    c7 = (function (da, c9) {
                        if (!bE.params) {
                            bE.params = {}
                        }
                        if (c9[1]) {
                            bE.params[c9[0]] = c9[1]
                        } else {
                            bE.params[c9[0]] = true
                        }
                    })(c8, c7)
                }
                if (c7 === null) {
                    bN = c8
                }
                return c7
            }
            function bh() {
                var db, c9, c8, c7;
                var dc, da;
                dc = bN;
                db = cw();
                if (db === null) {
                    db = a8()
                }
                if (db !== null) {
                    c9 = [];
                    da = bN;
                    c8 = w();
                    if (c8 !== null) {
                        c7 = cR();
                        if (c7 !== null) {
                            c8 = [c8, c7]
                        } else {
                            c8 = null;
                            bN = da
                        }
                    } else {
                        c8 = null;
                        bN = da
                    }
                    while (c8 !== null) {
                        c9.push(c8);
                        da = bN;
                        c8 = w();
                        if (c8 !== null) {
                            c7 = cR();
                            if (c7 !== null) {
                                c8 = [c8, c7]
                            } else {
                                c8 = null;
                                bN = da
                            }
                        } else {
                            c8 = null;
                            bN = da
                        }
                    }
                    if (c9 !== null) {
                        db = [db, c9]
                    } else {
                        db = null;
                        bN = dc
                    }
                } else {
                    db = null;
                    bN = dc
                }
                return db
            }
            function cR() {
                var c7;
                c7 = aK();
                if (c7 === null) {
                    c7 = aN()
                }
                return c7
            }
            function aK() {
                var da, c8, c7;
                var db, c9;
                db = bN;
                c9 = bN;
                if (aU.substr(bN, 3) === "tag") {
                    da = "tag";
                    bN += 3
                } else {
                    da = null;
                    if (T === 0) {
                        at('"tag"')
                    }
                }
                if (da !== null) {
                    c8 = bw();
                    if (c8 !== null) {
                        c7 = bI();
                        if (c7 !== null) {
                            da = [da, c8, c7]
                        } else {
                            da = null;
                            bN = c9
                        }
                    } else {
                        da = null;
                        bN = c9
                    }
                } else {
                    da = null;
                    bN = c9
                }
                if (da !== null) {
                    da = (function (dd, dc) {
                        bE.tag = dc
                    })(db, da[2])
                }
                if (da === null) {
                    bN = db
                }
                return da
            }
            function a1() {
                var c8, c7;
                var c9;
                c9 = bN;
                c7 = bA();
                if (c7 !== null) {
                    c8 = [];
                    while (c7 !== null) {
                        c8.push(c7);
                        c7 = bA()
                    }
                } else {
                    c8 = null
                }
                if (c8 !== null) {
                    c8 = (function (db, da) {
                        bE = parseInt(da.join(""))
                    })(c9, c8)
                }
                if (c8 === null) {
                    bN = c9
                }
                return c8
            }
            function cf() {
                var c7;
                var c8;
                c8 = bN;
                c7 = c4();
                if (c7 !== null) {
                    c7 = (function (da, c9) {
                        bE = c9
                    })(c8, c7)
                }
                if (c7 === null) {
                    bN = c8
                }
                return c7
            }
            function cW() {
                var c7;
                c7 = c0();
                return c7
            }
            function c0() {
                var dd, db, da, c9, c8, c7;
                var de, dc;
                de = bN;
                if (aU.substr(bN, 6) === "Digest") {
                    dd = "Digest";
                    bN += 6
                } else {
                    dd = null;
                    if (T === 0) {
                        at('"Digest"')
                    }
                }
                if (dd !== null) {
                    db = ck();
                    if (db !== null) {
                        da = cN();
                        if (da !== null) {
                            c9 = [];
                            dc = bN;
                            c8 = co();
                            if (c8 !== null) {
                                c7 = cN();
                                if (c7 !== null) {
                                    c8 = [c8, c7]
                                } else {
                                    c8 = null;
                                    bN = dc
                                }
                            } else {
                                c8 = null;
                                bN = dc
                            }
                            while (c8 !== null) {
                                c9.push(c8);
                                dc = bN;
                                c8 = co();
                                if (c8 !== null) {
                                    c7 = cN();
                                    if (c7 !== null) {
                                        c8 = [c8, c7]
                                    } else {
                                        c8 = null;
                                        bN = dc
                                    }
                                } else {
                                    c8 = null;
                                    bN = dc
                                }
                            }
                            if (c9 !== null) {
                                dd = [dd, db, da, c9]
                            } else {
                                dd = null;
                                bN = de
                            }
                        } else {
                            dd = null;
                            bN = de
                        }
                    } else {
                        dd = null;
                        bN = de
                    }
                } else {
                    dd = null;
                    bN = de
                }
                if (dd === null) {
                    dd = aG()
                }
                return dd
            }
            function aG() {
                var dd, db, da, c9, c8, c7;
                var de, dc;
                de = bN;
                dd = bI();
                if (dd !== null) {
                    db = ck();
                    if (db !== null) {
                        da = o();
                        if (da !== null) {
                            c9 = [];
                            dc = bN;
                            c8 = co();
                            if (c8 !== null) {
                                c7 = o();
                                if (c7 !== null) {
                                    c8 = [c8, c7]
                                } else {
                                    c8 = null;
                                    bN = dc
                                }
                            } else {
                                c8 = null;
                                bN = dc
                            }
                            while (c8 !== null) {
                                c9.push(c8);
                                dc = bN;
                                c8 = co();
                                if (c8 !== null) {
                                    c7 = o();
                                    if (c7 !== null) {
                                        c8 = [c8, c7]
                                    } else {
                                        c8 = null;
                                        bN = dc
                                    }
                                } else {
                                    c8 = null;
                                    bN = dc
                                }
                            }
                            if (c9 !== null) {
                                dd = [dd, db, da, c9]
                            } else {
                                dd = null;
                                bN = de
                            }
                        } else {
                            dd = null;
                            bN = de
                        }
                    } else {
                        dd = null;
                        bN = de
                    }
                } else {
                    dd = null;
                    bN = de
                }
                return dd
            }
            function o() {
                var c9, c8, c7;
                var da;
                da = bN;
                c9 = bI();
                if (c9 !== null) {
                    c8 = bw();
                    if (c8 !== null) {
                        c7 = bI();
                        if (c7 === null) {
                            c7 = cO()
                        }
                        if (c7 !== null) {
                            c9 = [c9, c8, c7]
                        } else {
                            c9 = null;
                            bN = da
                        }
                    } else {
                        c9 = null;
                        bN = da
                    }
                } else {
                    c9 = null;
                    bN = da
                }
                return c9
            }
            function cN() {
                var c7;
                c7 = bs();
                if (c7 === null) {
                    c7 = cH();
                    if (c7 === null) {
                        c7 = f();
                        if (c7 === null) {
                            c7 = bV();
                            if (c7 === null) {
                                c7 = bq();
                                if (c7 === null) {
                                    c7 = E();
                                    if (c7 === null) {
                                        c7 = bt();
                                        if (c7 === null) {
                                            c7 = o()
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return c7
            }
            function bs() {
                var c9, c8, c7;
                var da;
                da = bN;
                if (aU.substr(bN, 5) === "realm") {
                    c9 = "realm";
                    bN += 5
                } else {
                    c9 = null;
                    if (T === 0) {
                        at('"realm"')
                    }
                }
                if (c9 !== null) {
                    c8 = bw();
                    if (c8 !== null) {
                        c7 = e();
                        if (c7 !== null) {
                            c9 = [c9, c8, c7]
                        } else {
                            c9 = null;
                            bN = da
                        }
                    } else {
                        c9 = null;
                        bN = da
                    }
                } else {
                    c9 = null;
                    bN = da
                }
                return c9
            }
            function e() {
                var c7;
                var c8;
                c8 = bN;
                c7 = cO();
                if (c7 !== null) {
                    c7 = (function (da, c9) {
                        bE.realm = c9
                    })(c8, c7)
                }
                if (c7 === null) {
                    bN = c8
                }
                return c7
            }
            function cH() {
                var dd, dc, db, da, c9, c8, c7;
                var df, de;
                df = bN;
                if (aU.substr(bN, 6) === "domain") {
                    dd = "domain";
                    bN += 6
                } else {
                    dd = null;
                    if (T === 0) {
                        at('"domain"')
                    }
                }
                if (dd !== null) {
                    dc = bw();
                    if (dc !== null) {
                        db = s();
                        if (db !== null) {
                            da = bR();
                            if (da !== null) {
                                c9 = [];
                                de = bN;
                                c7 = n();
                                if (c7 !== null) {
                                    c8 = [];
                                    while (c7 !== null) {
                                        c8.push(c7);
                                        c7 = n()
                                    }
                                } else {
                                    c8 = null
                                }
                                if (c8 !== null) {
                                    c7 = bR();
                                    if (c7 !== null) {
                                        c8 = [c8, c7]
                                    } else {
                                        c8 = null;
                                        bN = de
                                    }
                                } else {
                                    c8 = null;
                                    bN = de
                                }
                                while (c8 !== null) {
                                    c9.push(c8);
                                    de = bN;
                                    c7 = n();
                                    if (c7 !== null) {
                                        c8 = [];
                                        while (c7 !== null) {
                                            c8.push(c7);
                                            c7 = n()
                                        }
                                    } else {
                                        c8 = null
                                    }
                                    if (c8 !== null) {
                                        c7 = bR();
                                        if (c7 !== null) {
                                            c8 = [c8, c7]
                                        } else {
                                            c8 = null;
                                            bN = de
                                        }
                                    } else {
                                        c8 = null;
                                        bN = de
                                    }
                                }
                                if (c9 !== null) {
                                    c8 = bx();
                                    if (c8 !== null) {
                                        dd = [dd, dc, db, da, c9, c8]
                                    } else {
                                        dd = null;
                                        bN = df
                                    }
                                } else {
                                    dd = null;
                                    bN = df
                                }
                            } else {
                                dd = null;
                                bN = df
                            }
                        } else {
                            dd = null;
                            bN = df
                        }
                    } else {
                        dd = null;
                        bN = df
                    }
                } else {
                    dd = null;
                    bN = df
                }
                return dd
            }
            function bR() {
                var c7;
                c7 = cL();
                if (c7 === null) {
                    c7 = cl()
                }
                return c7
            }
            function f() {
                var c9, c8, c7;
                var da;
                da = bN;
                if (aU.substr(bN, 5) === "nonce") {
                    c9 = "nonce";
                    bN += 5
                } else {
                    c9 = null;
                    if (T === 0) {
                        at('"nonce"')
                    }
                }
                if (c9 !== null) {
                    c8 = bw();
                    if (c8 !== null) {
                        c7 = aF();
                        if (c7 !== null) {
                            c9 = [c9, c8, c7]
                        } else {
                            c9 = null;
                            bN = da
                        }
                    } else {
                        c9 = null;
                        bN = da
                    }
                } else {
                    c9 = null;
                    bN = da
                }
                return c9
            }
            function aF() {
                var c7;
                var c8;
                c8 = bN;
                c7 = cO();
                if (c7 !== null) {
                    c7 = (function (da, c9) {
                        bE.nonce = c9
                    })(c8, c7)
                }
                if (c7 === null) {
                    bN = c8
                }
                return c7
            }
            function bV() {
                var da, c8, c7;
                var db, c9;
                db = bN;
                c9 = bN;
                if (aU.substr(bN, 6) === "opaque") {
                    da = "opaque";
                    bN += 6
                } else {
                    da = null;
                    if (T === 0) {
                        at('"opaque"')
                    }
                }
                if (da !== null) {
                    c8 = bw();
                    if (c8 !== null) {
                        c7 = cO();
                        if (c7 !== null) {
                            da = [da, c8, c7]
                        } else {
                            da = null;
                            bN = c9
                        }
                    } else {
                        da = null;
                        bN = c9
                    }
                } else {
                    da = null;
                    bN = c9
                }
                if (da !== null) {
                    da = (function (dd, dc) {
                        bE.opaque = dc
                    })(db, da[2])
                }
                if (da === null) {
                    bN = db
                }
                return da
            }
            function bq() {
                var da, c8, c7;
                var db, c9;
                db = bN;
                c9 = bN;
                if (aU.substr(bN, 5) === "stale") {
                    da = "stale";
                    bN += 5
                } else {
                    da = null;
                    if (T === 0) {
                        at('"stale"')
                    }
                }
                if (da !== null) {
                    c8 = bw();
                    if (c8 !== null) {
                        if (aU.substr(bN, 4) === "true") {
                            c7 = "true";
                            bN += 4
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at('"true"')
                            }
                        }
                        if (c7 === null) {
                            if (aU.substr(bN, 5) === "false") {
                                c7 = "false";
                                bN += 5
                            } else {
                                c7 = null;
                                if (T === 0) {
                                    at('"false"')
                                }
                            }
                        }
                        if (c7 !== null) {
                            da = [da, c8, c7]
                        } else {
                            da = null;
                            bN = c9
                        }
                    } else {
                        da = null;
                        bN = c9
                    }
                } else {
                    da = null;
                    bN = c9
                }
                if (da !== null) {
                    da = (function (dd, dc) {
                        bE.stale = dc
                    })(db, da[2])
                }
                if (da === null) {
                    bN = db
                }
                return da
            }
            function E() {
                var da, c8, c7;
                var db, c9;
                db = bN;
                c9 = bN;
                if (aU.substr(bN, 9) === "algorithm") {
                    da = "algorithm";
                    bN += 9
                } else {
                    da = null;
                    if (T === 0) {
                        at('"algorithm"')
                    }
                }
                if (da !== null) {
                    c8 = bw();
                    if (c8 !== null) {
                        if (aU.substr(bN, 3) === "MD5") {
                            c7 = "MD5";
                            bN += 3
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at('"MD5"')
                            }
                        }
                        if (c7 === null) {
                            if (aU.substr(bN, 8) === "MD5-sess") {
                                c7 = "MD5-sess";
                                bN += 8
                            } else {
                                c7 = null;
                                if (T === 0) {
                                    at('"MD5-sess"')
                                }
                            }
                            if (c7 === null) {
                                c7 = bI()
                            }
                        }
                        if (c7 !== null) {
                            da = [da, c8, c7]
                        } else {
                            da = null;
                            bN = c9
                        }
                    } else {
                        da = null;
                        bN = c9
                    }
                } else {
                    da = null;
                    bN = c9
                }
                if (da !== null) {
                    da = (function (dd, dc) {
                        bE.algorithm = dc
                    })(db, da[2])
                }
                if (da === null) {
                    bN = db
                }
                return da
            }
            function bt() {
                var dd, dc, db, da, c9, c8, c7;
                var dh, dg, df, de;
                dh = bN;
                dg = bN;
                if (aU.substr(bN, 3) === "qop") {
                    dd = "qop";
                    bN += 3
                } else {
                    dd = null;
                    if (T === 0) {
                        at('"qop"')
                    }
                }
                if (dd !== null) {
                    dc = bw();
                    if (dc !== null) {
                        db = s();
                        if (db !== null) {
                            df = bN;
                            da = G();
                            if (da !== null) {
                                c9 = [];
                                de = bN;
                                if (aU.charCodeAt(bN) === 44) {
                                    c8 = ",";
                                    bN++
                                } else {
                                    c8 = null;
                                    if (T === 0) {
                                        at('","')
                                    }
                                }
                                if (c8 !== null) {
                                    c7 = G();
                                    if (c7 !== null) {
                                        c8 = [c8, c7]
                                    } else {
                                        c8 = null;
                                        bN = de
                                    }
                                } else {
                                    c8 = null;
                                    bN = de
                                }
                                while (c8 !== null) {
                                    c9.push(c8);
                                    de = bN;
                                    if (aU.charCodeAt(bN) === 44) {
                                        c8 = ",";
                                        bN++
                                    } else {
                                        c8 = null;
                                        if (T === 0) {
                                            at('","')
                                        }
                                    }
                                    if (c8 !== null) {
                                        c7 = G();
                                        if (c7 !== null) {
                                            c8 = [c8, c7]
                                        } else {
                                            c8 = null;
                                            bN = de
                                        }
                                    } else {
                                        c8 = null;
                                        bN = de
                                    }
                                }
                                if (c9 !== null) {
                                    da = [da, c9]
                                } else {
                                    da = null;
                                    bN = df
                                }
                            } else {
                                da = null;
                                bN = df
                            }
                            if (da !== null) {
                                c9 = bx();
                                if (c9 !== null) {
                                    dd = [dd, dc, db, da, c9]
                                } else {
                                    dd = null;
                                    bN = dg
                                }
                            } else {
                                dd = null;
                                bN = dg
                            }
                        } else {
                            dd = null;
                            bN = dg
                        }
                    } else {
                        dd = null;
                        bN = dg
                    }
                } else {
                    dd = null;
                    bN = dg
                }
                if (dd !== null) {
                    dd = (function (dj, di) {
                        bE.qop = aU.substring(bN - 1, dj + 5)
                    })(dh, dd[3])
                }
                if (dd === null) {
                    bN = dh
                }
                return dd
            }
            function G() {
                var c7;
                if (aU.substr(bN, 8) === "auth-int") {
                    c7 = "auth-int";
                    bN += 8
                } else {
                    c7 = null;
                    if (T === 0) {
                        at('"auth-int"')
                    }
                }
                if (c7 === null) {
                    if (aU.substr(bN, 4) === "auth") {
                        c7 = "auth";
                        bN += 4
                    } else {
                        c7 = null;
                        if (T === 0) {
                            at('"auth"')
                        }
                    }
                    if (c7 === null) {
                        c7 = bI()
                    }
                }
                return c7
            }
            function m() {
                var db, c9, c8, c7;
                var dc, da;
                dc = bN;
                db = bI();
                if (db !== null) {
                    c9 = [];
                    da = bN;
                    c8 = co();
                    if (c8 !== null) {
                        c7 = bI();
                        if (c7 !== null) {
                            c8 = [c8, c7]
                        } else {
                            c8 = null;
                            bN = da
                        }
                    } else {
                        c8 = null;
                        bN = da
                    }
                    while (c8 !== null) {
                        c9.push(c8);
                        da = bN;
                        c8 = co();
                        if (c8 !== null) {
                            c7 = bI();
                            if (c7 !== null) {
                                c8 = [c8, c7]
                            } else {
                                c8 = null;
                                bN = da
                            }
                        } else {
                            c8 = null;
                            bN = da
                        }
                    }
                    if (c9 !== null) {
                        db = [db, c9]
                    } else {
                        db = null;
                        bN = dc
                    }
                } else {
                    db = null;
                    bN = dc
                }
                return db
            }
            function x() {
                var db, c9, c8, c7;
                var dc, da;
                dc = bN;
                db = aM();
                if (db !== null) {
                    c9 = [];
                    da = bN;
                    c8 = co();
                    if (c8 !== null) {
                        c7 = aM();
                        if (c7 !== null) {
                            c8 = [c8, c7]
                        } else {
                            c8 = null;
                            bN = da
                        }
                    } else {
                        c8 = null;
                        bN = da
                    }
                    while (c8 !== null) {
                        c9.push(c8);
                        da = bN;
                        c8 = co();
                        if (c8 !== null) {
                            c7 = aM();
                            if (c7 !== null) {
                                c8 = [c8, c7]
                            } else {
                                c8 = null;
                                bN = da
                            }
                        } else {
                            c8 = null;
                            bN = da
                        }
                    }
                    if (c9 !== null) {
                        db = [db, c9]
                    } else {
                        db = null;
                        bN = dc
                    }
                } else {
                    db = null;
                    bN = dc
                }
                return db
            }
            function aM() {
                var db, c9, c8, c7;
                var dc, da;
                dc = bN;
                db = a8();
                if (db !== null) {
                    c9 = [];
                    da = bN;
                    c8 = w();
                    if (c8 !== null) {
                        c7 = aN();
                        if (c7 !== null) {
                            c8 = [c8, c7]
                        } else {
                            c8 = null;
                            bN = da
                        }
                    } else {
                        c8 = null;
                        bN = da
                    }
                    while (c8 !== null) {
                        c9.push(c8);
                        da = bN;
                        c8 = w();
                        if (c8 !== null) {
                            c7 = aN();
                            if (c7 !== null) {
                                c8 = [c8, c7]
                            } else {
                                c8 = null;
                                bN = da
                            }
                        } else {
                            c8 = null;
                            bN = da
                        }
                    }
                    if (c9 !== null) {
                        db = [db, c9]
                    } else {
                        db = null;
                        bN = dc
                    }
                } else {
                    db = null;
                    bN = dc
                }
                return db
            }
            function l() {
                var db, c9, c8, c7;
                var dc, da;
                dc = bN;
                db = bI();
                if (db !== null) {
                    c9 = [];
                    da = bN;
                    c8 = co();
                    if (c8 !== null) {
                        c7 = bI();
                        if (c7 !== null) {
                            c8 = [c8, c7]
                        } else {
                            c8 = null;
                            bN = da
                        }
                    } else {
                        c8 = null;
                        bN = da
                    }
                    while (c8 !== null) {
                        c9.push(c8);
                        da = bN;
                        c8 = co();
                        if (c8 !== null) {
                            c7 = bI();
                            if (c7 !== null) {
                                c8 = [c8, c7]
                            } else {
                                c8 = null;
                                bN = da
                            }
                        } else {
                            c8 = null;
                            bN = da
                        }
                    }
                    if (c9 !== null) {
                        db = [db, c9]
                    } else {
                        db = null;
                        bN = dc
                    }
                } else {
                    db = null;
                    bN = dc
                }
                return db
            }
            function cU() {
                var db, c9, c8, c7;
                var dc, da;
                dc = bN;
                db = aD();
                if (db !== null) {
                    c9 = [];
                    da = bN;
                    c8 = co();
                    if (c8 !== null) {
                        c7 = aD();
                        if (c7 !== null) {
                            c8 = [c8, c7]
                        } else {
                            c8 = null;
                            bN = da
                        }
                    } else {
                        c8 = null;
                        bN = da
                    }
                    while (c8 !== null) {
                        c9.push(c8);
                        da = bN;
                        c8 = co();
                        if (c8 !== null) {
                            c7 = aD();
                            if (c7 !== null) {
                                c8 = [c8, c7]
                            } else {
                                c8 = null;
                                bN = da
                            }
                        } else {
                            c8 = null;
                            bN = da
                        }
                    }
                    if (c9 !== null) {
                        db = [db, c9]
                    } else {
                        db = null;
                        bN = dc
                    }
                } else {
                    db = null;
                    bN = dc
                }
                return db
            }
            function aD() {
                var db, c9, c8, c7;
                var dc, da;
                dc = bN;
                db = a8();
                if (db !== null) {
                    c9 = [];
                    da = bN;
                    c8 = w();
                    if (c8 !== null) {
                        c7 = aN();
                        if (c7 !== null) {
                            c8 = [c8, c7]
                        } else {
                            c8 = null;
                            bN = da
                        }
                    } else {
                        c8 = null;
                        bN = da
                    }
                    while (c8 !== null) {
                        c9.push(c8);
                        da = bN;
                        c8 = w();
                        if (c8 !== null) {
                            c7 = aN();
                            if (c7 !== null) {
                                c8 = [c8, c7]
                            } else {
                                c8 = null;
                                bN = da
                            }
                        } else {
                            c8 = null;
                            bN = da
                        }
                    }
                    if (c9 !== null) {
                        db = [db, c9]
                    } else {
                        db = null;
                        bN = dc
                    }
                } else {
                    db = null;
                    bN = dc
                }
                return db
            }
            function bc() {
                var db, c9, c8, c7;
                var dc, da;
                dc = bN;
                db = bD();
                if (db !== null) {
                    c9 = [];
                    da = bN;
                    c8 = w();
                    if (c8 !== null) {
                        c7 = bC();
                        if (c7 !== null) {
                            c8 = [c8, c7]
                        } else {
                            c8 = null;
                            bN = da
                        }
                    } else {
                        c8 = null;
                        bN = da
                    }
                    while (c8 !== null) {
                        c9.push(c8);
                        da = bN;
                        c8 = w();
                        if (c8 !== null) {
                            c7 = bC();
                            if (c7 !== null) {
                                c8 = [c8, c7]
                            } else {
                                c8 = null;
                                bN = da
                            }
                        } else {
                            c8 = null;
                            bN = da
                        }
                    }
                    if (c9 !== null) {
                        db = [db, c9]
                    } else {
                        db = null;
                        bN = dc
                    }
                } else {
                    db = null;
                    bN = dc
                }
                return db
            }
            function bD() {
                var c7;
                var c8;
                c8 = bN;
                if (aU.substr(bN, 6) === "active") {
                    c7 = "active";
                    bN += 6
                } else {
                    c7 = null;
                    if (T === 0) {
                        at('"active"')
                    }
                }
                if (c7 === null) {
                    if (aU.substr(bN, 7) === "pending") {
                        c7 = "pending";
                        bN += 7
                    } else {
                        c7 = null;
                        if (T === 0) {
                            at('"pending"')
                        }
                    }
                    if (c7 === null) {
                        if (aU.substr(bN, 10) === "terminated") {
                            c7 = "terminated";
                            bN += 10
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at('"terminated"')
                            }
                        }
                        if (c7 === null) {
                            c7 = bI()
                        }
                    }
                }
                if (c7 !== null) {
                    c7 = (function (c9) {
                        bE.state = aU.substring(bN, c9)
                    })(c8)
                }
                if (c7 === null) {
                    bN = c8
                }
                return c7
            }
            function bC() {
                var da, c8, c7;
                var db, c9;
                db = bN;
                c9 = bN;
                if (aU.substr(bN, 6) === "reason") {
                    da = "reason";
                    bN += 6
                } else {
                    da = null;
                    if (T === 0) {
                        at('"reason"')
                    }
                }
                if (da !== null) {
                    c8 = bw();
                    if (c8 !== null) {
                        c7 = ag();
                        if (c7 !== null) {
                            da = [da, c8, c7]
                        } else {
                            da = null;
                            bN = c9
                        }
                    } else {
                        da = null;
                        bN = c9
                    }
                } else {
                    da = null;
                    bN = c9
                }
                if (da !== null) {
                    da = (function (dd, dc) {
                        if (typeof dc !== "undefined") {
                            bE.reason = dc
                        }
                    })(db, da[2])
                }
                if (da === null) {
                    bN = db
                }
                if (da === null) {
                    db = bN;
                    c9 = bN;
                    if (aU.substr(bN, 7) === "expires") {
                        da = "expires";
                        bN += 7
                    } else {
                        da = null;
                        if (T === 0) {
                            at('"expires"')
                        }
                    }
                    if (da !== null) {
                        c8 = bw();
                        if (c8 !== null) {
                            c7 = c4();
                            if (c7 !== null) {
                                da = [da, c8, c7]
                            } else {
                                da = null;
                                bN = c9
                            }
                        } else {
                            da = null;
                            bN = c9
                        }
                    } else {
                        da = null;
                        bN = c9
                    }
                    if (da !== null) {
                        da = (function (dd, dc) {
                            if (typeof dc !== "undefined") {
                                bE.expires = dc
                            }
                        })(db, da[2])
                    }
                    if (da === null) {
                        bN = db
                    }
                    if (da === null) {
                        db = bN;
                        c9 = bN;
                        if (aU.substr(bN, 11) === "retry_after") {
                            da = "retry_after";
                            bN += 11
                        } else {
                            da = null;
                            if (T === 0) {
                                at('"retry_after"')
                            }
                        }
                        if (da !== null) {
                            c8 = bw();
                            if (c8 !== null) {
                                c7 = c4();
                                if (c7 !== null) {
                                    da = [da, c8, c7]
                                } else {
                                    da = null;
                                    bN = c9
                                }
                            } else {
                                da = null;
                                bN = c9
                            }
                        } else {
                            da = null;
                            bN = c9
                        }
                        if (da !== null) {
                            da = (function (dd, dc) {
                                if (typeof dc !== "undefined") {
                                    bE.retry_after = dc
                                }
                            })(db, da[2])
                        }
                        if (da === null) {
                            bN = db
                        }
                        if (da === null) {
                            db = bN;
                            da = aN();
                            if (da !== null) {
                                da = (function (dd, dc) {
                                    if (typeof dc !== "undefined") {
                                        if (!bE.params) {
                                            bE.params = {}
                                        }
                                        if (dc[1]) {
                                            bE.params[dc[0]] = dc[1]
                                        } else {
                                            bE.params[dc[0]] = true
                                        }
                                    }
                                })(db, da)
                            }
                            if (da === null) {
                                bN = db
                            }
                        }
                    }
                }
                return da
            }
            function ag() {
                var c7;
                if (aU.substr(bN, 11) === "deactivated") {
                    c7 = "deactivated";
                    bN += 11
                } else {
                    c7 = null;
                    if (T === 0) {
                        at('"deactivated"')
                    }
                }
                if (c7 === null) {
                    if (aU.substr(bN, 9) === "probation") {
                        c7 = "probation";
                        bN += 9
                    } else {
                        c7 = null;
                        if (T === 0) {
                            at('"probation"')
                        }
                    }
                    if (c7 === null) {
                        if (aU.substr(bN, 8) === "rejected") {
                            c7 = "rejected";
                            bN += 8
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at('"rejected"')
                            }
                        }
                        if (c7 === null) {
                            if (aU.substr(bN, 7) === "timeout") {
                                c7 = "timeout";
                                bN += 7
                            } else {
                                c7 = null;
                                if (T === 0) {
                                    at('"timeout"')
                                }
                            }
                            if (c7 === null) {
                                if (aU.substr(bN, 6) === "giveup") {
                                    c7 = "giveup";
                                    bN += 6
                                } else {
                                    c7 = null;
                                    if (T === 0) {
                                        at('"giveup"')
                                    }
                                }
                                if (c7 === null) {
                                    if (aU.substr(bN, 10) === "noresource") {
                                        c7 = "noresource";
                                        bN += 10
                                    } else {
                                        c7 = null;
                                        if (T === 0) {
                                            at('"noresource"')
                                        }
                                    }
                                    if (c7 === null) {
                                        if (aU.substr(bN, 9) === "invariant") {
                                            c7 = "invariant";
                                            bN += 9
                                        } else {
                                            c7 = null;
                                            if (T === 0) {
                                                at('"invariant"')
                                            }
                                        }
                                        if (c7 === null) {
                                            c7 = bI()
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return c7
            }
            function I() {
                var c7;
                c7 = cv();
                c7 = c7 !== null ? c7 : "";
                return c7
            }
            function a5() {
                var db, c9, c8, c7;
                var dc, da;
                dc = bN;
                db = bI();
                if (db !== null) {
                    c9 = [];
                    da = bN;
                    c8 = co();
                    if (c8 !== null) {
                        c7 = bI();
                        if (c7 !== null) {
                            c8 = [c8, c7]
                        } else {
                            c8 = null;
                            bN = da
                        }
                    } else {
                        c8 = null;
                        bN = da
                    }
                    while (c8 !== null) {
                        c9.push(c8);
                        da = bN;
                        c8 = co();
                        if (c8 !== null) {
                            c7 = bI();
                            if (c7 !== null) {
                                c8 = [c8, c7]
                            } else {
                                c8 = null;
                                bN = da
                            }
                        } else {
                            c8 = null;
                            bN = da
                        }
                    }
                    if (c9 !== null) {
                        db = [db, c9]
                    } else {
                        db = null;
                        bN = dc
                    }
                } else {
                    db = null;
                    bN = dc
                }
                db = db !== null ? db : "";
                return db
            }
            function cq() {
                var db, c9, c8, c7;
                var dc, da;
                dc = bN;
                db = cw();
                if (db === null) {
                    db = a8()
                }
                if (db !== null) {
                    c9 = [];
                    da = bN;
                    c8 = w();
                    if (c8 !== null) {
                        c7 = cz();
                        if (c7 !== null) {
                            c8 = [c8, c7]
                        } else {
                            c8 = null;
                            bN = da
                        }
                    } else {
                        c8 = null;
                        bN = da
                    }
                    while (c8 !== null) {
                        c9.push(c8);
                        da = bN;
                        c8 = w();
                        if (c8 !== null) {
                            c7 = cz();
                            if (c7 !== null) {
                                c8 = [c8, c7]
                            } else {
                                c8 = null;
                                bN = da
                            }
                        } else {
                            c8 = null;
                            bN = da
                        }
                    }
                    if (c9 !== null) {
                        db = [db, c9]
                    } else {
                        db = null;
                        bN = dc
                    }
                } else {
                    db = null;
                    bN = dc
                }
                return db
            }
            function cz() {
                var c7;
                c7 = aK();
                if (c7 === null) {
                    c7 = aN()
                }
                return c7
            }
            function af() {
                var db, c9, c8, c7;
                var dc, da;
                dc = bN;
                db = bd();
                if (db !== null) {
                    c9 = [];
                    da = bN;
                    c8 = co();
                    if (c8 !== null) {
                        c7 = bd();
                        if (c7 !== null) {
                            c8 = [c8, c7]
                        } else {
                            c8 = null;
                            bN = da
                        }
                    } else {
                        c8 = null;
                        bN = da
                    }
                    while (c8 !== null) {
                        c9.push(c8);
                        da = bN;
                        c8 = co();
                        if (c8 !== null) {
                            c7 = bd();
                            if (c7 !== null) {
                                c8 = [c8, c7]
                            } else {
                                c8 = null;
                                bN = da
                            }
                        } else {
                            c8 = null;
                            bN = da
                        }
                    }
                    if (c9 !== null) {
                        db = [db, c9]
                    } else {
                        db = null;
                        bN = dc
                    }
                } else {
                    db = null;
                    bN = dc
                }
                return db
            }
            function bd() {
                var dd, db, da, c9, c8, c7;
                var de, dc;
                de = bN;
                dd = bF();
                if (dd !== null) {
                    db = ck();
                    if (db !== null) {
                        da = W();
                        if (da !== null) {
                            c9 = [];
                            dc = bN;
                            c8 = w();
                            if (c8 !== null) {
                                c7 = bP();
                                if (c7 !== null) {
                                    c8 = [c8, c7]
                                } else {
                                    c8 = null;
                                    bN = dc
                                }
                            } else {
                                c8 = null;
                                bN = dc
                            }
                            while (c8 !== null) {
                                c9.push(c8);
                                dc = bN;
                                c8 = w();
                                if (c8 !== null) {
                                    c7 = bP();
                                    if (c7 !== null) {
                                        c8 = [c8, c7]
                                    } else {
                                        c8 = null;
                                        bN = dc
                                    }
                                } else {
                                    c8 = null;
                                    bN = dc
                                }
                            }
                            if (c9 !== null) {
                                dd = [dd, db, da, c9]
                            } else {
                                dd = null;
                                bN = de
                            }
                        } else {
                            dd = null;
                            bN = de
                        }
                    } else {
                        dd = null;
                        bN = de
                    }
                } else {
                    dd = null;
                    bN = de
                }
                return dd
            }
            function bP() {
                var c7;
                c7 = R();
                if (c7 === null) {
                    c7 = aa();
                    if (c7 === null) {
                        c7 = ay();
                        if (c7 === null) {
                            c7 = ce();
                            if (c7 === null) {
                                c7 = J();
                                if (c7 === null) {
                                    c7 = aN()
                                }
                            }
                        }
                    }
                }
                return c7
            }
            function R() {
                var da, c8, c7;
                var db, c9;
                db = bN;
                c9 = bN;
                if (aU.substr(bN, 3) === "ttl") {
                    da = "ttl";
                    bN += 3
                } else {
                    da = null;
                    if (T === 0) {
                        at('"ttl"')
                    }
                }
                if (da !== null) {
                    c8 = bw();
                    if (c8 !== null) {
                        c7 = t();
                        if (c7 !== null) {
                            da = [da, c8, c7]
                        } else {
                            da = null;
                            bN = c9
                        }
                    } else {
                        da = null;
                        bN = c9
                    }
                } else {
                    da = null;
                    bN = c9
                }
                if (da !== null) {
                    da = (function (dd, dc) {
                        bE.ttl = dc
                    })(db, da[2])
                }
                if (da === null) {
                    bN = db
                }
                return da
            }
            function aa() {
                var da, c8, c7;
                var db, c9;
                db = bN;
                c9 = bN;
                if (aU.substr(bN, 5) === "maddr") {
                    da = "maddr";
                    bN += 5
                } else {
                    da = null;
                    if (T === 0) {
                        at('"maddr"')
                    }
                }
                if (da !== null) {
                    c8 = bw();
                    if (c8 !== null) {
                        c7 = u();
                        if (c7 !== null) {
                            da = [da, c8, c7]
                        } else {
                            da = null;
                            bN = c9
                        }
                    } else {
                        da = null;
                        bN = c9
                    }
                } else {
                    da = null;
                    bN = c9
                }
                if (da !== null) {
                    da = (function (dc, dd) {
                        bE.maddr = dd
                    })(db, da[2])
                }
                if (da === null) {
                    bN = db
                }
                return da
            }
            function ay() {
                var da, c8, c7;
                var db, c9;
                db = bN;
                c9 = bN;
                if (aU.substr(bN, 8) === "received") {
                    da = "received";
                    bN += 8
                } else {
                    da = null;
                    if (T === 0) {
                        at('"received"')
                    }
                }
                if (da !== null) {
                    c8 = bw();
                    if (c8 !== null) {
                        c7 = b6();
                        if (c7 === null) {
                            c7 = aS()
                        }
                        if (c7 !== null) {
                            da = [da, c8, c7]
                        } else {
                            da = null;
                            bN = c9
                        }
                    } else {
                        da = null;
                        bN = c9
                    }
                } else {
                    da = null;
                    bN = c9
                }
                if (da !== null) {
                    da = (function (dd, dc) {
                        bE.received = dc
                    })(db, da[2])
                }
                if (da === null) {
                    bN = db
                }
                return da
            }
            function ce() {
                var da, c8, c7;
                var db, c9;
                db = bN;
                c9 = bN;
                if (aU.substr(bN, 6) === "branch") {
                    da = "branch";
                    bN += 6
                } else {
                    da = null;
                    if (T === 0) {
                        at('"branch"')
                    }
                }
                if (da !== null) {
                    c8 = bw();
                    if (c8 !== null) {
                        c7 = bI();
                        if (c7 !== null) {
                            da = [da, c8, c7]
                        } else {
                            da = null;
                            bN = c9
                        }
                    } else {
                        da = null;
                        bN = c9
                    }
                } else {
                    da = null;
                    bN = c9
                }
                if (da !== null) {
                    da = (function (dd, dc) {
                        bE.branch = dc
                    })(db, da[2])
                }
                if (da === null) {
                    bN = db
                }
                return da
            }
            function J() {
                var dc, da, c8, c7;
                var dd, db, c9;
                dd = bN;
                db = bN;
                if (aU.substr(bN, 5) === "rport") {
                    dc = "rport";
                    bN += 5
                } else {
                    dc = null;
                    if (T === 0) {
                        at('"rport"')
                    }
                }
                if (dc !== null) {
                    c9 = bN;
                    da = bw();
                    if (da !== null) {
                        c8 = [];
                        c7 = bA();
                        while (c7 !== null) {
                            c8.push(c7);
                            c7 = bA()
                        }
                        if (c8 !== null) {
                            da = [da, c8]
                        } else {
                            da = null;
                            bN = c9
                        }
                    } else {
                        da = null;
                        bN = c9
                    }
                    da = da !== null ? da : "";
                    if (da !== null) {
                        dc = [dc, da]
                    } else {
                        dc = null;
                        bN = db
                    }
                } else {
                    dc = null;
                    bN = db
                }
                if (dc !== null) {
                    dc = (function (de) {
                        if (typeof response_port !== "undefined") {
                            bE.rport = response_port.join("")
                        }
                    })(dd)
                }
                if (dc === null) {
                    bN = dd
                }
                return dc
            }
            function bF() {
                var db, da, c9, c8, c7;
                var dc;
                dc = bN;
                db = bb();
                if (db !== null) {
                    da = au();
                    if (da !== null) {
                        c9 = bI();
                        if (c9 !== null) {
                            c8 = au();
                            if (c8 !== null) {
                                c7 = d();
                                if (c7 !== null) {
                                    db = [db, da, c9, c8, c7]
                                } else {
                                    db = null;
                                    bN = dc
                                }
                            } else {
                                db = null;
                                bN = dc
                            }
                        } else {
                            db = null;
                            bN = dc
                        }
                    } else {
                        db = null;
                        bN = dc
                    }
                } else {
                    db = null;
                    bN = dc
                }
                return db
            }
            function bb() {
                var c7;
                var c8;
                c8 = bN;
                if (aU.substr(bN, 3) === "SIP") {
                    c7 = "SIP";
                    bN += 3
                } else {
                    c7 = null;
                    if (T === 0) {
                        at('"SIP"')
                    }
                }
                if (c7 === null) {
                    c7 = bI()
                }
                if (c7 !== null) {
                    c7 = (function (da, c9) {
                        bE.protocol = c9
                    })(c8, c7)
                }
                if (c7 === null) {
                    bN = c8
                }
                return c7
            }
            function d() {
                var c7;
                var c8;
                c8 = bN;
                if (aU.substr(bN, 3) === "UDP") {
                    c7 = "UDP";
                    bN += 3
                } else {
                    c7 = null;
                    if (T === 0) {
                        at('"UDP"')
                    }
                }
                if (c7 === null) {
                    if (aU.substr(bN, 3) === "TCP") {
                        c7 = "TCP";
                        bN += 3
                    } else {
                        c7 = null;
                        if (T === 0) {
                            at('"TCP"')
                        }
                    }
                    if (c7 === null) {
                        if (aU.substr(bN, 3) === "TLS") {
                            c7 = "TLS";
                            bN += 3
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at('"TLS"')
                            }
                        }
                        if (c7 === null) {
                            if (aU.substr(bN, 4) === "SCTP") {
                                c7 = "SCTP";
                                bN += 4
                            } else {
                                c7 = null;
                                if (T === 0) {
                                    at('"SCTP"')
                                }
                            }
                            if (c7 === null) {
                                c7 = bI()
                            }
                        }
                    }
                }
                if (c7 !== null) {
                    c7 = (function (da, c9) {
                        bE.transport = c9
                    })(c8, c7)
                }
                if (c7 === null) {
                    bN = c8
                }
                return c7
            }
            function W() {
                var da, c8, c7;
                var db, c9;
                db = bN;
                da = bk();
                if (da !== null) {
                    c9 = bN;
                    c8 = N();
                    if (c8 !== null) {
                        c7 = aB();
                        if (c7 !== null) {
                            c8 = [c8, c7]
                        } else {
                            c8 = null;
                            bN = c9
                        }
                    } else {
                        c8 = null;
                        bN = c9
                    }
                    c8 = c8 !== null ? c8 : "";
                    if (c8 !== null) {
                        da = [da, c8]
                    } else {
                        da = null;
                        bN = db
                    }
                } else {
                    da = null;
                    bN = db
                }
                return da
            }
            function bk() {
                var c7;
                var c8;
                c8 = bN;
                c7 = cs();
                if (c7 === null) {
                    c7 = b6();
                    if (c7 === null) {
                        c7 = aQ()
                    }
                }
                if (c7 !== null) {
                    c7 = (function (c9) {
                        bE.host = aU.substring(bN, c9)
                    })(c8)
                }
                if (c7 === null) {
                    bN = c8
                }
                return c7
            }
            function aB() {
                var dc, da, c9, c8, c7;
                var dd, db;
                dd = bN;
                db = bN;
                dc = bA();
                dc = dc !== null ? dc : "";
                if (dc !== null) {
                    da = bA();
                    da = da !== null ? da : "";
                    if (da !== null) {
                        c9 = bA();
                        c9 = c9 !== null ? c9 : "";
                        if (c9 !== null) {
                            c8 = bA();
                            c8 = c8 !== null ? c8 : "";
                            if (c8 !== null) {
                                c7 = bA();
                                c7 = c7 !== null ? c7 : "";
                                if (c7 !== null) {
                                    dc = [dc, da, c9, c8, c7]
                                } else {
                                    dc = null;
                                    bN = db
                                }
                            } else {
                                dc = null;
                                bN = db
                            }
                        } else {
                            dc = null;
                            bN = db
                        }
                    } else {
                        dc = null;
                        bN = db
                    }
                } else {
                    dc = null;
                    bN = db
                }
                if (dc !== null) {
                    dc = (function (df, de) {
                        bE.port = parseInt(de.join(""))
                    })(dd, dc)
                }
                if (dc === null) {
                    bN = dd
                }
                return dc
            }
            function t() {
                var da, c8, c7;
                var db, c9;
                db = bN;
                c9 = bN;
                da = bA();
                if (da !== null) {
                    c8 = bA();
                    c8 = c8 !== null ? c8 : "";
                    if (c8 !== null) {
                        c7 = bA();
                        c7 = c7 !== null ? c7 : "";
                        if (c7 !== null) {
                            da = [da, c8, c7]
                        } else {
                            da = null;
                            bN = c9
                        }
                    } else {
                        da = null;
                        bN = c9
                    }
                } else {
                    da = null;
                    bN = c9
                }
                if (da !== null) {
                    da = (function (dd, dc) {
                        return parseInt(dc.join(""))
                    })(db, da)
                }
                if (da === null) {
                    bN = db
                }
                return da
            }
            function cd() {
                var c7;
                c7 = c0();
                return c7
            }
            function aW() {
                var c9, c8, c7;
                var da;
                da = bN;
                c9 = bI();
                if (c9 !== null) {
                    c8 = a9();
                    if (c8 !== null) {
                        c7 = D();
                        if (c7 !== null) {
                            c9 = [c9, c8, c7]
                        } else {
                            c9 = null;
                            bN = da
                        }
                    } else {
                        c9 = null;
                        bN = da
                    }
                } else {
                    c9 = null;
                    bN = da
                }
                return c9
            }
            function D() {
                var c8, c7;
                c8 = [];
                c7 = bi();
                if (c7 === null) {
                    c7 = b4();
                    if (c7 === null) {
                        c7 = ck()
                    }
                }
                while (c7 !== null) {
                    c8.push(c7);
                    c7 = bi();
                    if (c7 === null) {
                        c7 = b4();
                        if (c7 === null) {
                            c7 = ck()
                        }
                    }
                }
                return c8
            }
            function cy() {
                var c8, c7;
                c8 = [];
                c7 = cF();
                while (c7 !== null) {
                    c8.push(c7);
                    c7 = cF()
                }
                return c8
            }
            function aP() {
                var c9, c8, c7;
                var da;
                da = bN;
                c9 = Y();
                if (c9 !== null) {
                    if (aU.charCodeAt(bN) === 58) {
                        c8 = ":";
                        bN++
                    } else {
                        c8 = null;
                        if (T === 0) {
                            at('":"')
                        }
                    }
                    if (c8 !== null) {
                        c7 = bY();
                        if (c7 !== null) {
                            c9 = [c9, c8, c7]
                        } else {
                            c9 = null;
                            bN = da
                        }
                    } else {
                        c9 = null;
                        bN = da
                    }
                } else {
                    c9 = null;
                    bN = da
                }
                return c9
            }
            function Y() {
                var c7;
                var c8;
                c8 = bN;
                if (aU.substr(bN, 5) === "stuns") {
                    c7 = "stuns";
                    bN += 5
                } else {
                    c7 = null;
                    if (T === 0) {
                        at('"stuns"')
                    }
                }
                if (c7 === null) {
                    if (aU.substr(bN, 4) === "stun") {
                        c7 = "stun";
                        bN += 4
                    } else {
                        c7 = null;
                        if (T === 0) {
                            at('"stun"')
                        }
                    }
                }
                if (c7 !== null) {
                    c7 = (function (da, c9) {
                        bE.scheme = c9
                    })(c8, c7)
                }
                if (c7 === null) {
                    bN = c8
                }
                return c7
            }
            function bY() {
                var da, c8, c7;
                var db, c9;
                db = bN;
                da = bz();
                if (da !== null) {
                    c9 = bN;
                    if (aU.charCodeAt(bN) === 58) {
                        c8 = ":";
                        bN++
                    } else {
                        c8 = null;
                        if (T === 0) {
                            at('":"')
                        }
                    }
                    if (c8 !== null) {
                        c7 = ct();
                        if (c7 !== null) {
                            c8 = [c8, c7]
                        } else {
                            c8 = null;
                            bN = c9
                        }
                    } else {
                        c8 = null;
                        bN = c9
                    }
                    c8 = c8 !== null ? c8 : "";
                    if (c8 !== null) {
                        da = [da, c8]
                    } else {
                        da = null;
                        bN = db
                    }
                } else {
                    da = null;
                    bN = db
                }
                return da
            }
            function bz() {
                var c7;
                var c8;
                c8 = bN;
                c7 = cJ();
                if (c7 === null) {
                    c7 = b6();
                    if (c7 === null) {
                        c7 = aQ()
                    }
                }
                if (c7 !== null) {
                    c7 = (function (da, c9) {
                        bE.host = c9.join("")
                    })(c8, c7)
                }
                if (c7 === null) {
                    bN = c8
                }
                return c7
            }
            function cJ() {
                var c8, c7;
                c8 = [];
                c7 = H();
                if (c7 === null) {
                    c7 = Z();
                    if (c7 === null) {
                        c7 = c()
                    }
                }
                while (c7 !== null) {
                    c8.push(c7);
                    c7 = H();
                    if (c7 === null) {
                        c7 = Z();
                        if (c7 === null) {
                            c7 = c()
                        }
                    }
                }
                return c8
            }
            function H() {
                var c7;
                c7 = bK();
                if (c7 === null) {
                    c7 = bA();
                    if (c7 === null) {
                        if (aU.charCodeAt(bN) === 45) {
                            c7 = "-";
                            bN++
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at('"-"')
                            }
                        }
                        if (c7 === null) {
                            if (aU.charCodeAt(bN) === 46) {
                                c7 = ".";
                                bN++
                            } else {
                                c7 = null;
                                if (T === 0) {
                                    at('"."')
                                }
                            }
                            if (c7 === null) {
                                if (aU.charCodeAt(bN) === 95) {
                                    c7 = "_";
                                    bN++
                                } else {
                                    c7 = null;
                                    if (T === 0) {
                                        at('"_"')
                                    }
                                }
                                if (c7 === null) {
                                    if (aU.charCodeAt(bN) === 126) {
                                        c7 = "~";
                                        bN++
                                    } else {
                                        c7 = null;
                                        if (T === 0) {
                                            at('"~"')
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return c7
            }
            function c() {
                var c7;
                if (aU.charCodeAt(bN) === 33) {
                    c7 = "!";
                    bN++
                } else {
                    c7 = null;
                    if (T === 0) {
                        at('"!"')
                    }
                }
                if (c7 === null) {
                    if (aU.charCodeAt(bN) === 36) {
                        c7 = "$";
                        bN++
                    } else {
                        c7 = null;
                        if (T === 0) {
                            at('"$"')
                        }
                    }
                    if (c7 === null) {
                        if (aU.charCodeAt(bN) === 38) {
                            c7 = "&";
                            bN++
                        } else {
                            c7 = null;
                            if (T === 0) {
                                at('"&"')
                            }
                        }
                        if (c7 === null) {
                            if (aU.charCodeAt(bN) === 39) {
                                c7 = "'";
                                bN++
                            } else {
                                c7 = null;
                                if (T === 0) {
                                    at('"\'"')
                                }
                            }
                            if (c7 === null) {
                                if (aU.charCodeAt(bN) === 40) {
                                    c7 = "(";
                                    bN++
                                } else {
                                    c7 = null;
                                    if (T === 0) {
                                        at('"("')
                                    }
                                }
                                if (c7 === null) {
                                    if (aU.charCodeAt(bN) === 41) {
                                        c7 = ")";
                                        bN++
                                    } else {
                                        c7 = null;
                                        if (T === 0) {
                                            at('")"')
                                        }
                                    }
                                    if (c7 === null) {
                                        if (aU.charCodeAt(bN) === 42) {
                                            c7 = "*";
                                            bN++
                                        } else {
                                            c7 = null;
                                            if (T === 0) {
                                                at('"*"')
                                            }
                                        }
                                        if (c7 === null) {
                                            if (aU.charCodeAt(bN) === 43) {
                                                c7 = "+";
                                                bN++
                                            } else {
                                                c7 = null;
                                                if (T === 0) {
                                                    at('"+"')
                                                }
                                            }
                                            if (c7 === null) {
                                                if (aU.charCodeAt(bN) === 44) {
                                                    c7 = ",";
                                                    bN++
                                                } else {
                                                    c7 = null;
                                                    if (T === 0) {
                                                        at('","')
                                                    }
                                                }
                                                if (c7 === null) {
                                                    if (aU.charCodeAt(bN) === 59) {
                                                        c7 = ";";
                                                        bN++
                                                    } else {
                                                        c7 = null;
                                                        if (T === 0) {
                                                            at('";"')
                                                        }
                                                    }
                                                    if (c7 === null) {
                                                        if (aU.charCodeAt(bN) === 61) {
                                                            c7 = "=";
                                                            bN++
                                                        } else {
                                                            c7 = null;
                                                            if (T === 0) {
                                                                at('"="')
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return c7
            }
            function cG() {
                var dc, da, c9, c8, c7;
                var dd, db;
                dd = bN;
                dc = ba();
                if (dc !== null) {
                    if (aU.charCodeAt(bN) === 58) {
                        da = ":";
                        bN++
                    } else {
                        da = null;
                        if (T === 0) {
                            at('":"')
                        }
                    }
                    if (da !== null) {
                        c9 = bY();
                        if (c9 !== null) {
                            db = bN;
                            if (aU.substr(bN, 11) === "?transport=") {
                                c8 = "?transport=";
                                bN += 11
                            } else {
                                c8 = null;
                                if (T === 0) {
                                    at('"?transport="')
                                }
                            }
                            if (c8 !== null) {
                                c7 = d();
                                if (c7 !== null) {
                                    c8 = [c8, c7]
                                } else {
                                    c8 = null;
                                    bN = db
                                }
                            } else {
                                c8 = null;
                                bN = db
                            }
                            c8 = c8 !== null ? c8 : "";
                            if (c8 !== null) {
                                dc = [dc, da, c9, c8]
                            } else {
                                dc = null;
                                bN = dd
                            }
                        } else {
                            dc = null;
                            bN = dd
                        }
                    } else {
                        dc = null;
                        bN = dd
                    }
                } else {
                    dc = null;
                    bN = dd
                }
                return dc
            }
            function ba() {
                var c7;
                var c8;
                c8 = bN;
                if (aU.substr(bN, 5) === "turns") {
                    c7 = "turns";
                    bN += 5
                } else {
                    c7 = null;
                    if (T === 0) {
                        at('"turns"')
                    }
                }
                if (c7 === null) {
                    if (aU.substr(bN, 4) === "turn") {
                        c7 = "turn";
                        bN += 4
                    } else {
                        c7 = null;
                        if (T === 0) {
                            at('"turn"')
                        }
                    }
                }
                if (c7 !== null) {
                    c7 = (function (da, c9) {
                        bE.scheme = c9
                    })(c8, c7)
                }
                if (c7 === null) {
                    bN = c8
                }
                return c7
            }
            function X() {
                var da, c8, c7;
                var db, c9;
                db = bN;
                c9 = bN;
                da = d();
                if (da !== null) {
                    if (aU.substr(bN, 3) === "udp") {
                        c8 = "udp";
                        bN += 3
                    } else {
                        c8 = null;
                        if (T === 0) {
                            at('"udp"')
                        }
                    }
                    if (c8 === null) {
                        if (aU.substr(bN, 3) === "tcp") {
                            c8 = "tcp";
                            bN += 3
                        } else {
                            c8 = null;
                            if (T === 0) {
                                at('"tcp"')
                            }
                        }
                        if (c8 === null) {
                            c8 = [];
                            c7 = b7();
                            while (c7 !== null) {
                                c8.push(c7);
                                c7 = b7()
                            }
                        }
                    }
                    if (c8 !== null) {
                        da = [da, c8]
                    } else {
                        da = null;
                        bN = c9
                    }
                } else {
                    da = null;
                    bN = c9
                }
                if (da !== null) {
                    da = (function (dc) {
                        bE.transport = transport
                    })(db)
                }
                if (da === null) {
                    bN = db
                }
                return da
            }
            function cx() {
                var db, c9, c8, c7;
                var dc, da;
                dc = bN;
                da = bN;
                db = cY();
                if (db !== null) {
                    if (aU.charCodeAt(bN) === 58) {
                        c9 = ":";
                        bN++
                    } else {
                        c9 = null;
                        if (T === 0) {
                            at('":"')
                        }
                    }
                    if (c9 !== null) {
                        db = [db, c9]
                    } else {
                        db = null;
                        bN = da
                    }
                } else {
                    db = null;
                    bN = da
                }
                db = db !== null ? db : "";
                if (db !== null) {
                    c9 = c5();
                    if (c9 !== null) {
                        da = bN;
                        if (aU.charCodeAt(bN) === 64) {
                            c8 = "@";
                            bN++
                        } else {
                            c8 = null;
                            if (T === 0) {
                                at('"@"')
                            }
                        }
                        if (c8 !== null) {
                            c7 = b3();
                            if (c7 !== null) {
                                c8 = [c8, c7]
                            } else {
                                c8 = null;
                                bN = da
                            }
                        } else {
                            c8 = null;
                            bN = da
                        }
                        c8 = c8 !== null ? c8 : "";
                        if (c8 !== null) {
                            c7 = U();
                            if (c7 !== null) {
                                db = [db, c9, c8, c7]
                            } else {
                                db = null;
                                bN = dc
                            }
                        } else {
                            db = null;
                            bN = dc
                        }
                    } else {
                        db = null;
                        bN = dc
                    }
                } else {
                    db = null;
                    bN = dc
                }
                return db
            }
            function cQ(c9) {
                c9.sort();
                var da = null;
                var c8 = [];
                for (var c7 = 0; c7 < c9.length; c7++) {
                    if (c9[c7] !== da) {
                        c8.push(c9[c7]);
                        da = c9[c7]
                    }
                }
                return c8
            }
            function ab() {
                var c7 = 1;
                var da = 1;
                var db = false;
                for (var c8 = 0; c8 < Math.max(bN, q); c8++) {
                    var c9 = aU.charAt(c8);
                    if (c9 === "\n") {
                        if (!db) {
                            c7++
                        }
                        da = 1;
                        db = false
                    } else {
                        if (c9 === "\r" || c9 === "\u2028" || c9 === "\u2029") {
                            c7++;
                            da = 1;
                            db = true
                        } else {
                            da++;
                            db = false
                        }
                    }
                }
                return {
                    line: c7,
                    column: da
                }
            }
            var bE = {};
            var P = V[c2]();
            if (P === null || bN !== aU.length) {
                var cA = Math.max(bN, q);
                var bm = cA < aU.length ? aU.charAt(cA) : null;
                var cX = ab();
                new this.SyntaxError(cQ(cT), bm, cA, cX.line, cX.column);
                return -1
            }
            return bE
        },
        toSource: function () {
            return this._source
        }
    };
    a.SyntaxError = function (f, g, h, d, e) {
        function c(k, l) {
            var i, j;
            switch (k.length) {
                case 0:
                    i = "end of input";
                    break;
                case 1:
                    i = k[0];
                    break;
                default:
                    i = k.slice(0, k.length - 1).join(", ") + " or " + k[k.length - 1]
            }
            j = l ? b(l) : "end of input";
            return "Expected " + i + " but " + j + " found."
        }
        this.name = "SyntaxError";
        this.expected = f;
        this.found = g;
        this.message = c(f, g);
        this.offset = h;
        this.line = d;
        this.column = e
    };
    a.SyntaxError.prototype = Error.prototype;
    return a
})();
(function () {
    var a;
    a = (function () {
        var r = "plivojs";
        var d = "phone.plivo.com";
        var l = {
            outbound_proxy_set: "ws://phone.plivo.com:5065",
            register_expires: 600,
            secure_transport: false,
            stun_server: "stun:stun.l.google.com:19302",
            hack_via_tcp: true,
            hack_ip_in_contact: true,
            trace_sip: true
        };
        var k;
        var x;
        var z;
        var o = false;
        var j = "plivo_webrtc_selfview";
        var h = "plivo_webrtc_remoteview";

        function p(C) {
            z = C;
            w(z)
        }
        var w = function (C) {
            Plivo.logDevel("plivo init");
            window.storedStream = null;
            var F = document.createElement("audio");
            F.id = j;
            F.hidden = true;
            F.autoplay = true;
            document.body.appendChild(F);
            var E = document.createElement("audio");
            E.id = h;
            E.hidden = true;
            E.autoplay = true;
            document.body.appendChild(E);
            var G = function (H) {
                window.storedStream = H;
                Plivo.onMediaPermission(true)
            };
            var D = function () {
                Plivo.onMediaPermission(false)
            };
            Plivo.logDevel("asking for media permission");
            navigator.webkitGetUserMedia({
                audio: true,
                video: false
            }, G, D)
        }; /*Name: JsSIP Maintainer: José Luis Millán <jmillan@aliax.net> Copyright (c) 2012-2013 José Luis Millán <jmillan@aliax.net> License: The MIT License Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*/
        p.prototype.login = function (E, C) {
            l.uri = E + "@" + d;
            l.password = C;
            try {
                k = new WebSDK.UA(l)
            } catch (D) {
                Plivo.logDevel("failed to create UA")
            }
            k.on("registered", q);
            k.on("unregistered", i);
            k.on("registrationFailed", m);
            k.on("newSession", c);
            k.start()
        };
        p.prototype.logout = function () {
            if (x) {
                Plivo.logDebug("logging out when there is active call. Terminate the call");
                x.terminate()
            }
            k.unregister("all")
        };
        p.prototype.call = function (D, H) {
            if (x) {
                Plivo.logDebug("Can't make another call while in call");
                return false
            }
            H = H || {};
            var G = [];
            for (var E in H) {
                var F = H[E];
                if (n(E, F) === true) {
                    G.push(E + ": " + F);
                    Plivo.logDevel("valid hdr = " + E + " -> " + F)
                } else {
                    Plivo.logDebug("invalid hdr = " + E + " -> " + F)
                }
            }
            dest_uri = "sip:" + D;
            var C = {
                selfView: null,
                remoteView: document.getElementById(h)
            };
            k.call(dest_uri, true, false, b, C, G)
        };
        p.prototype.answer = function () {
            if (x) {
                x.answer();
                Plivo.ringToneStop()
            } else {
                Plivo.logDebug("answer() failed : no incoming call")
            }
        };
        p.prototype.hangup = function () {
            if (x) {
                x.terminate();
                Plivo.rbToneStop()
            } else {
                Plivo.logDebug("hangup() failed:no call session exist")
            }
        };
        p.prototype.reject = function () {
            if (x) {
                x.reject();
                Plivo.ringToneStop()
            } else {
                Plivo.logDebug("reject() failed : no incoming call")
            }
        };
        p.prototype.send_dtmf = function (C) {
            if (x) {
                x.dtmf(C);
                Plivo.dtmfTonePlay(C)
            } else {
                Plivo.logDebug("send_dtmf() failed : no active call session")
            }
        };
        p.prototype.mute = function () {
            if (x) {
                x.mediaSession.localMedia.audioTracks[0].enabled = false
            } else {
                Plivo.logDebug("mute failed : no active call session")
            }
        };
        p.prototype.unmute = function () {
            if (x) {
                x.mediaSession.localMedia.audioTracks[0].enabled = true
            } else {
                Plivo.logDebug("unmute() failed : no active call session")
            }
        };
        var e = {
            connecting: 1,
            progress: 2,
            failed: 3,
            started: 4,
            ended: 5
        };
        var A;

        function v(C) {
            if (C.substr(0, 5) != "X-Ph-") {
                return false
            }
            var D = /^([a-z0-9A-Z]){1,19}$/;
            if (D.test(C.substr(5)) === false) {
                return false
            }
            return true
        }
        function u(D) {
            var C = /^([a-z0-9A-Z%]){1,47}$/;
            if (C.test(D) === false) {
                Plivo.logDevel("invalid value = " + D);
                return false
            }
            return true
        }
        function n(C, D) {
            if (v(C) === false) {
                return false
            }
            if (u(D) === false) {
                return false
            }
            return true
        }
        function B(D, F) {
            var E = {};
            Plivo.logDevel("recvExtraHeader");
            for (var C in F) {
                if (v(C)) {
                    Plivo.logDevel("->key " + C + "  is valid");
                    val = D.getHeader(C);
                    if (u(val)) {
                        E[C] = val
                    } else {
                        Plivo.logDevel("Invalid value:" + val)
                    }
                } else {}
            }
            return E
        }
        var q = function () {
            if (o === false) {
                o = true;
                Plivo.logDevel("onLogin");
                Plivo.onLogin()
            }
        };
        var m = function () {
            Plivo.logDebug("Login failed");
            Plivo.onLoginFailed()
        };
        var i = function () {
            Plivo.logDevel("_onLogout");
            o = false;
            Plivo.rbToneStop();
            Plivo.ringToneStop();
            Plivo.onLogout()
        };
        var c = function (C) {
            Plivo.logDevel(r + ":_onNewSession");
            x = C.data.session;
            if (C.data.originator == "remote") {
                A = "incoming";
                x.on("connecting", s);
                x.on("progress", g);
                x.on("failed", y);
                x.on("started", t);
                x.on("ended", f);
                var E = C.data.request;
                var F = E.headers;
                var D = B(E, F);
                Plivo.ringTonePlay();
                Plivo.onIncomingCall(x.remote_identity.slice(4, x.remote_identity.indexOf("@")) + "@phone.plivo.com", D)
            } else {
                A = "outgoing"
            }
            if (A == "incoming") {}
        };
        var s = function (C) {
            Plivo.logDevel(r + ":_onCallConnecting");
            Plivo.rbTonePlay();
            Plivo.onCalling()
        };
        var g = function (C) {
            Plivo.logDevel(r + ":_onCallProgress");
            if (A && A == "outgoing") {
                Plivo.rbTonePlay();
                Plivo.onCallRemoteRinging()
            }
        };
        var y = function (C) {
            Plivo.logDevel(r + ":call failed:" + C.data.cause);
            if (C.data.cause == WebSDK.c.causes.CANCELED && A == "incoming") {
                Plivo.ringToneStop();
                Plivo.onIncomingCallCanceled()
            } else {
                Plivo.rbToneStop();
                Plivo.onCallFailed(C.data.cause)
            }
            x = null;
            A = null
        };
        var t = function (C) {
            Plivo.logDevel(r + ":onCallStarted");
            Plivo.rbToneStop();
            Plivo.ringToneStop();
            Plivo.onCallAnswered()
        };
        var f = function (C) {
            Plivo.logDevel(r + ":onCallEnded");
            Plivo.ringToneStop();
            Plivo.onCallTerminated();
            x = null;
            A = null
        };
        var b = {
            connecting: s,
            progress: g,
            failed: y,
            started: t,
            ended: f
        };
        return p
    })();
    window.plivojs = a
}).call(this);
var CryptoJS = CryptoJS || function (e, c) {
        var s = {}, i = s.lib = {}, g = i.Base = function () {
            function b() {}
            return {
                extend: function (f) {
                    b.prototype = this;
                    var h = new b;
                    f && h.mixIn(f);
                    h.$super = this;
                    return h
                },
                create: function () {
                    var f = this.extend();
                    f.init.apply(f, arguments);
                    return f
                },
                init: function () {},
                mixIn: function (f) {
                    for (var h in f) {
                        f.hasOwnProperty(h) && (this[h] = f[h])
                    }
                    f.hasOwnProperty("toString") && (this.toString = f.toString)
                },
                clone: function () {
                    return this.$super.extend(this)
                }
            }
        }(),
            u = i.WordArray = g.extend({
                init: function (b, f) {
                    b = this.words = b || [];
                    this.sigBytes = f != c ? f : 4 * b.length
                },
                toString: function (b) {
                    return (b || a).stringify(this)
                },
                concat: function (h) {
                    var j = this.words,
                        l = h.words,
                        k = this.sigBytes,
                        h = h.sigBytes;
                    this.clamp();
                    if (k % 4) {
                        for (var f = 0; f < h; f++) {
                            j[k + f >>> 2] |= (l[f >>> 2] >>> 24 - 8 * (f % 4) & 255) << 24 - 8 * ((k + f) % 4)
                        }
                    } else {
                        if (65535 < l.length) {
                            for (f = 0; f < h; f += 4) {
                                j[k + f >>> 2] = l[f >>> 2]
                            }
                        } else {
                            j.push.apply(j, l)
                        }
                    }
                    this.sigBytes += h;
                    return this
                },
                clamp: function () {
                    var b = this.words,
                        f = this.sigBytes;
                    b[f >>> 2] &= 4294967295 << 32 - 8 * (f % 4);
                    b.length = e.ceil(f / 4)
                },
                clone: function () {
                    var b = g.clone.call(this);
                    b.words = this.words.slice(0);
                    return b
                },
                random: function (b) {
                    for (var f = [], h = 0; h < b; h += 4) {
                        f.push(4294967296 * e.random() | 0)
                    }
                    return u.create(f, b)
                }
            }),
            t = s.enc = {}, a = t.Hex = {
                stringify: function (h) {
                    for (var j = h.words, h = h.sigBytes, l = [], k = 0; k < h; k++) {
                        var f = j[k >>> 2] >>> 24 - 8 * (k % 4) & 255;
                        l.push((f >>> 4).toString(16));
                        l.push((f & 15).toString(16))
                    }
                    return l.join("")
                },
                parse: function (h) {
                    for (var f = h.length, k = [], j = 0; j < f; j += 2) {
                        k[j >>> 3] |= parseInt(h.substr(j, 2), 16) << 24 - 4 * (j % 8)
                    }
                    return u.create(k, f / 2)
                }
            }, d = t.Latin1 = {
                stringify: function (h) {
                    for (var f = h.words, h = h.sigBytes, k = [], j = 0; j < h; j++) {
                        k.push(String.fromCharCode(f[j >>> 2] >>> 24 - 8 * (j % 4) & 255))
                    }
                    return k.join("")
                },
                parse: function (h) {
                    for (var f = h.length, k = [], j = 0; j < f; j++) {
                        k[j >>> 2] |= (h.charCodeAt(j) & 255) << 24 - 8 * (j % 4)
                    }
                    return u.create(k, f)
                }
            }, v = t.Utf8 = {
                stringify: function (h) {
                    try {
                        return decodeURIComponent(escape(d.stringify(h)))
                    } catch (f) {
                        throw Error("Malformed UTF-8 data")
                    }
                },
                parse: function (b) {
                    return d.parse(unescape(encodeURIComponent(b)))
                }
            }, x = i.BufferedBlockAlgorithm = g.extend({
                reset: function () {
                    this._data = u.create();
                    this._nDataBytes = 0
                },
                _append: function (b) {
                    "string" == typeof b && (b = v.parse(b));
                    this._data.concat(b);
                    this._nDataBytes += b.sigBytes
                },
                _process: function (k) {
                    var j = this._data,
                        p = j.words,
                        o = j.sigBytes,
                        n = this.blockSize,
                        l = o / (4 * n),
                        l = k ? e.ceil(l) : e.max((l | 0) - this._minBufferSize, 0),
                        k = l * n,
                        o = e.min(4 * k, o);
                    if (k) {
                        for (var m = 0; m < k; m += n) {
                            this._doProcessBlock(p, m)
                        }
                        m = p.splice(0, k);
                        j.sigBytes -= o
                    }
                    return u.create(m, o)
                },
                clone: function () {
                    var b = g.clone.call(this);
                    b._data = this._data.clone();
                    return b
                },
                _minBufferSize: 0
            });
        i.Hasher = x.extend({
            init: function () {
                this.reset()
            },
            reset: function () {
                x.reset.call(this);
                this._doReset()
            },
            update: function (b) {
                this._append(b);
                this._process();
                return this
            },
            finalize: function (b) {
                b && this._append(b);
                this._doFinalize();
                return this._hash
            },
            clone: function () {
                var b = x.clone.call(this);
                b._hash = this._hash.clone();
                return b
            },
            blockSize: 16,
            _createHelper: function (b) {
                return function (f, h) {
                    return b.create(h).finalize(f)
                }
            },
            _createHmacHelper: function (b) {
                return function (f, h) {
                    return w.HMAC.create(b, h).finalize(f)
                }
            }
        });
        var w = s.algo = {};
        return s
    }(Math);
(function (d) {
    function b(h, l, j, m, o, n, k) {
        h = h + (l & j | ~l & m) + o + k;
        return (h << n | h >>> 32 - n) + l
    }
    function g(h, l, j, m, o, n, k) {
        h = h + (l & m | j & ~m) + o + k;
        return (h << n | h >>> 32 - n) + l
    }
    function f(h, l, j, m, o, n, k) {
        h = h + (l ^ j ^ m) + o + k;
        return (h << n | h >>> 32 - n) + l
    }
    function e(h, l, j, m, o, n, k) {
        h = h + (j ^ (l | ~m)) + o + k;
        return (h << n | h >>> 32 - n) + l
    }
    var s = CryptoJS,
        i = s.lib,
        a = i.WordArray,
        i = i.Hasher,
        c = s.algo,
        t = [];
    (function () {
        for (var h = 0; 64 > h; h++) {
            t[h] = 4294967296 * d.abs(d.sin(h + 1)) | 0
        }
    })();
    c = c.MD5 = i.extend({
        _doReset: function () {
            this._hash = a.create([1732584193, 4023233417, 2562383102, 271733878])
        },
        _doProcessBlock: function (h, m) {
            for (var j = 0; 16 > j; j++) {
                var n = m + j,
                    p = h[n];
                h[n] = (p << 8 | p >>> 24) & 16711935 | (p << 24 | p >>> 8) & 4278255360
            }
            for (var n = this._hash.words, p = n[0], o = n[1], l = n[2], k = n[3], j = 0; 64 > j; j += 4) {
                16 > j ? (p = b(p, o, l, k, h[m + j], 7, t[j]), k = b(k, p, o, l, h[m + j + 1], 12, t[j + 1]), l = b(l, k, p, o, h[m + j + 2], 17, t[j + 2]), o = b(o, l, k, p, h[m + j + 3], 22, t[j + 3])) : 32 > j ? (p = g(p, o, l, k, h[m + (j + 1) % 16], 5, t[j]), k = g(k, p, o, l, h[m + (j + 6) % 16], 9, t[j + 1]), l = g(l, k, p, o, h[m + (j + 11) % 16], 14, t[j + 2]), o = g(o, l, k, p, h[m + j % 16], 20, t[j + 3])) : 48 > j ? (p = f(p, o, l, k, h[m + (3 * j + 5) % 16], 4, t[j]), k = f(k, p, o, l, h[m + (3 * j + 8) % 16], 11, t[j + 1]), l = f(l, k, p, o, h[m + (3 * j + 11) % 16], 16, t[j + 2]), o = f(o, l, k, p, h[m + (3 * j + 14) % 16], 23, t[j + 3])) : (p = e(p, o, l, k, h[m + 3 * j % 16], 6, t[j]), k = e(k, p, o, l, h[m + (3 * j + 7) % 16], 10, t[j + 1]), l = e(l, k, p, o, h[m + (3 * j + 14) % 16], 15, t[j + 2]), o = e(o, l, k, p, h[m + (3 * j + 5) % 16], 21, t[j + 3]))
            }
            n[0] = n[0] + p | 0;
            n[1] = n[1] + o | 0;
            n[2] = n[2] + l | 0;
            n[3] = n[3] + k | 0
        },
        _doFinalize: function () {
            var h = this._data,
                k = h.words,
                j = 8 * this._nDataBytes,
                l = 8 * h.sigBytes;
            k[l >>> 5] |= 128 << 24 - l % 32;
            k[(l + 64 >>> 9 << 4) + 14] = (j << 8 | j >>> 24) & 16711935 | (j << 24 | j >>> 8) & 4278255360;
            h.sigBytes = 4 * (k.length + 1);
            this._process();
            h = this._hash.words;
            for (k = 0; 4 > k; k++) {
                j = h[k], h[k] = (j << 8 | j >>> 24) & 16711935 | (j << 24 | j >>> 8) & 4278255360
            }
        }
    });
    s.MD5 = i._createHelper(c);
    s.HmacMD5 = i._createHmacHelper(c)
})(Math);
