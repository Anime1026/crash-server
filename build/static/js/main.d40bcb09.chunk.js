(this["webpackJsonpmy-app"]=this["webpackJsonpmy-app"]||[]).push([[0],{24:function(e,n,t){},25:function(e,n,t){},40:function(e,n,t){"use strict";t.r(n);var a=t(0),o=t.n(a),i=t(14),c=t.n(i),r=(t(24),t(25),t(16)),s=t(1),l=t(11),d=t.n(l),u=t(15),m=t(3),j=new l.UnityContext({loaderUrl:"build/Build/build.loader.js",dataUrl:"build/Build/build.data",frameworkUrl:"build/Build/build.framework.js",codeUrl:"build/Build/build.wasm"});var b=function(){return Object(a.useEffect)((function(){j.on("GameReady",(function(e){if("Ready"==e)try{window.onmessage=function(e){if("iframe_message"===e.data.name)if("demo"==e.data.token)j.send("CrashController","RequestToken",JSON.stringify({userName:"demo",token:e.data.token,amount:e.data.allowanceAmount}));else{var n=Object(u.a)(e.data.token);j.send("CrashController","RequestToken",JSON.stringify({userName:n.name,token:e.data.token,amount:e.data.allowanceAmount})),console.log(n.name+"  ----------- "+e.data.allowanceAmount)}},window.parent.postMessage({name:"iframe_message"},"*")}catch(n){console.log("error",n)}else console.log("error")}))}),[]),Object(m.jsx)("div",{children:Object(m.jsx)(d.a,{unityContext:j,matchWebGLToCanvasSize:!0,style:{height:"99.5vh"}})})};var f=function(){return Object(m.jsx)(r.a,{children:Object(m.jsx)(s.c,{children:Object(m.jsx)(s.a,{exact:!0,path:"/",component:b})})})};var h=function(){return Object(m.jsx)("div",{className:"App",children:Object(m.jsx)("div",{className:"App",children:Object(m.jsx)("div",{className:"App",children:Object(m.jsx)(f,{})})})})},p=function(e){e&&e instanceof Function&&t.e(3).then(t.bind(null,42)).then((function(n){var t=n.getCLS,a=n.getFID,o=n.getFCP,i=n.getLCP,c=n.getTTFB;t(e),a(e),o(e),i(e),c(e)}))};c.a.render(Object(m.jsx)(o.a.StrictMode,{children:Object(m.jsx)(h,{})}),document.getElementById("root")),p()}},[[40,1,2]]]);
//# sourceMappingURL=main.d40bcb09.chunk.js.map