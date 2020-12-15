(this.webpackJsonppushr=this.webpackJsonppushr||[]).push([[0],{117:function(e,n){},118:function(e,n){},120:function(e,n){},122:function(e,n){},131:function(e,n,t){"use strict";t.r(n);var r=t(0),a=t(2),i=t.n(a),o=t(64),c=t.n(o),s=(t(74),t(65)),u=t(38),d=(t(75),t(66)),l=t(67),f=t(1),h=t.n(f),p=t(3),m=t(21),v=t(6),b=t(8),g=t(9),j=t(12),O=function(e){Object(b.a)(t,e);var n=Object(g.a)(t);function t(e,r){var a;return Object(v.a)(this,t),(a=n.call(this,"message_received")).sender=e,a.data=r,a}return t}(Object(j.a)(Event)),k=function(e){Object(b.a)(t,e);var n=Object(g.a)(t);function t(e,r,a){var i;return Object(v.a)(this,t),(i=n.call(this,"authorization_requested")).sender=e,i.resolve=r,i.reject=a,i}return t}(Object(j.a)(Event)),w=function(e){Object(b.a)(t,e);var n=Object(g.a)(t);function t(e){return Object(v.a)(this,t),n.call(this,"connection_".concat(e))}return t}(Object(j.a)(Event)),y=function(e){Object(b.a)(t,e);var n=Object(g.a)(t);function t(){return Object(v.a)(this,t),n.call(this,"closed")}return t}(w),x=function(e){Object(b.a)(t,e);var n=Object(g.a)(t);function t(){return Object(v.a)(this,t),n.call(this,"ready")}return t}(w),S=function(e){Object(b.a)(t,e);var n=Object(g.a)(t);function t(e,r,a){var i;Object(v.a)(this,t),(i=n.call(this)).signaler=e,i.id=r,i.remoteId=a,i.conn=void 0,i.chan=void 0,i.signaler=e,i.id=r,i.remoteId=a;return i.conn=new RTCPeerConnection({iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:"turn:turn.anyfirewall.com",credential:"webrtc",username:"webrtc"}]}),i.conn.ondatachannel=function(e){e.channel.onerror=function(e){console.error(e),i.dispatchEvent(new y)},e.channel.onclose=function(e){i.dispatchEvent(new y)},e.channel.onopen=function(){i.dispatchEvent(new x)},e.channel.onmessage=function(e){i.dispatchEvent(new O(i.remoteId,e.data))}},i.conn.onicecandidate=function(e){e.candidate&&i.signaler.signalCandidate(i.remoteId,e.candidate)},i.chan=i.conn.createDataChannel("io.pushr.channels.send.".concat(r,"-").concat(a)),i}return Object(m.a)(t,[{key:"init",value:function(){var e=Object(p.a)(h.a.mark((function e(){var n;return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.conn.createOffer();case 2:return n=e.sent,this.conn.setLocalDescription(n),console.debug(this.remoteId,"sending description"),e.abrupt("return",this.signaler.sendDescription(this.remoteId,n));case 6:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"close",value:function(){this.chan.close()}},{key:"ready",value:function(){var e=Object(p.a)(h.a.mark((function e(){var n=this;return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,t){var r,a;"open"!==n.chan.readyState?(r=function(){n.removeEventListener("connection_closed",a),e()},a=function(){n.removeEventListener("connection_ready",r),t()},console.debug("waiting for conn to be ready. current state is",n.chan.readyState),n.addEventListener("connection_ready",r,{once:!0}),n.addEventListener("connection_closed",a,{once:!0})):e()})));case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()},{key:"addIceCandidate",value:function(){var e=Object(p.a)(h.a.mark((function e(n){return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(null===n){e.next=10;break}return console.debug(this.remoteId,"received ice candidate",n),e.prev=2,e.next=5,this.conn.addIceCandidate(n);case 5:e.next=10;break;case 7:e.prev=7,e.t0=e.catch(2),console.error("failed to add remote ICE candidate:",e.t0);case 10:case"end":return e.stop()}}),e,this,[[2,7]])})));return function(n){return e.apply(this,arguments)}}()},{key:"informOffer",value:function(){var e=Object(p.a)(h.a.mark((function e(n){var t;return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.debug(this.remoteId,"received remote description",n),this.conn.setRemoteDescription(n),e.next=4,this.conn.createAnswer();case 4:return t=e.sent,this.conn.setLocalDescription(t),console.debug(this.remoteId,"description exchange complete"),e.abrupt("return",t);case 8:case"end":return e.stop()}}),e,this)})));return function(n){return e.apply(this,arguments)}}()},{key:"offerCallback",value:function(e){this.conn.setRemoteDescription(e),console.debug(this.remoteId,"description exchange complete")}},{key:"send",value:function(e){return this.chan.send(e)}}]),t}(Object(j.a)(EventTarget)),C=function(e){Object(b.a)(t,e);var n=Object(g.a)(t);function t(e,r){var a;return Object(v.a)(this,t),(a=n.call(this)).signaler=e,a.id=r,a.registered=!1,a.conns=void 0,a.signaler=e,a.conns=[],a.id=r,a}return Object(m.a)(t,[{key:"register",value:function(){var e=this;this.signaler.register(this),this.signaler.addEventListener("session_left",(function(n){e.removeConn(n.id)})),this.registered=!0}},{key:"confirmOffer",value:function(){var e=Object(p.a)(h.a.mark((function e(n,t){var r,a=this;return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return(r=new S(this.signaler,this.id,n)).addEventListener("connection_closed",(function(){a.removeConn(n)})),r.addEventListener("message_received",(function(e){a.dispatchEvent(new O(e.sender,e.data))})),this.conns.push({from:n,to:this.id,conn:r}),e.abrupt("return",r.informOffer(t));case 5:case"end":return e.stop()}}),e,this)})));return function(n,t){return e.apply(this,arguments)}}()},{key:"informOffer",value:function(){var e=Object(p.a)(h.a.mark((function e(n,t){var r=this;return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(void 0===this.conns.find((function(e){return e.from===n}))){e.next=3;break}return e.abrupt("return");case 3:return e.prev=3,e.next=6,new Promise((function(e,t){r.dispatchEvent(new k(n,e,t))}));case 6:return e.abrupt("return",this.confirmOffer(n,t));case 9:throw e.prev=9,e.t0=e.catch(3),new Error("permission denied");case 12:case"end":return e.stop()}}),e,this,[[3,9]])})));return function(n,t){return e.apply(this,arguments)}}()},{key:"descriptionCallback",value:function(e,n){this.conns.filter((function(n){return n.to===e})).forEach((function(e){e.conn.offerCallback(n)}))}},{key:"removeConn",value:function(e){var n=this.conns.findIndex((function(n){return n.to===e}));n<0||(this.conns[n].conn.close(),this.conns.splice(n,1),(n=this.conns.findIndex((function(n){return n.from===e})))<0||(this.conns[n].conn.close(),this.conns.splice(n,1),console.debug("removed connection to ".concat(e))))}},{key:"addIceCandidate",value:function(){var e=Object(p.a)(h.a.mark((function e(n,t){return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",Promise.all(this.conns.filter((function(e){return e.to===n})).map((function(e){return e.conn.addIceCandidate(t)}))));case 1:case"end":return e.stop()}}),e,this)})));return function(n,t){return e.apply(this,arguments)}}()},{key:"dial",value:function(){var e=Object(p.a)(h.a.mark((function e(n){var t,r,a=this;return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.registered){e.next=2;break}throw new Error("dialer not registered");case 2:if(void 0===(t=this.conns.find((function(e){return e.to===n})))){e.next=5;break}return e.abrupt("return",t.conn);case 5:return console.debug("conn to",n,"not found: dialing a new one"),r=new S(this.signaler,this.id,n),this.conns.push({from:this.id,to:n,conn:r}),r.addEventListener("connection_closed",(function(){a.removeConn(n)})),e.next=11,r.init();case 11:return console.debug(n,"conn init done"),e.abrupt("return",r);case 13:case"end":return e.stop()}}),e,this)})));return function(n){return e.apply(this,arguments)}}()}]),t}(Object(j.a)(EventTarget)),N=t(11),E=function e(n,t,r,a){Object(v.a)(this,e),this.chunkNumber=n,this.metadata=t,this.value=r,this.end=a},L=function(e){return new Promise((function(n){var t=new FileReader;t.onloadend=function(e){t.result&&n(t.result.toString())},t.readAsDataURL(e)}))},q=function(e){var n=Object(a.useState)(""),t=Object(N.a)(n,2),i=t[0],o=t[1],c=Object(a.useState)(0),s=Object(N.a)(c,2),u=s[0],d=s[1],l=Object(a.useState)({chunkNumber:0,conn:void 0,metadata:{name:"",size:0},total:0,value:""}),f=Object(N.a)(l,2),m=f[0],v=f[1],b=function(){var e=Object(p.a)(h.a.mark((function e(n){var t;return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(null!==n&&0!==n.length){e.next=4;break}return o(""),d(0),e.abrupt("return");case 4:return t=n[0],o(t.name),e.next=8,g({name:t.name,size:t.size},t);case 8:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}();Object(a.useEffect)((function(){if(m.conn){var e,n;if(d((e=m.total,n=m.value.length,(e-n)/e*100)),0===m.value.length)return m.conn.send(JSON.stringify(new E(m.chunkNumber,m.metadata,"",!0))),void console.log("send complete");var t=m.value.slice(0,1e3);m.conn.send(JSON.stringify(new E(m.chunkNumber,m.metadata,t,!1))),v((function(e){return{chunkNumber:e.chunkNumber+1,conn:e.conn,metadata:e.metadata,value:e.value.slice(t.length),total:e.total}}))}}),[m]);var g=function(){var n=Object(p.a)(h.a.mark((function n(t,r){var a,i;return h.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,e.dialer.dial(e.sessionId);case 2:return a=n.sent,n.next=5,a.ready();case 5:return n.next=7,L(r);case 7:i=n.sent,v({chunkNumber:0,conn:a,metadata:t,value:i,total:i.length});case 9:case"end":return n.stop()}}),n)})));return function(e,t){return n.apply(this,arguments)}}();return Object(r.jsxs)("label",{htmlFor:e.sessionId,children:[Object(r.jsx)("div",{children:e.friendlyName}),""!==i?Object(r.jsxs)("div",{children:[i," (",u.toFixed(2),"%)"]}):null,Object(r.jsx)("input",{type:"file",className:"remote-session-input",id:e.sessionId,onChange:function(e){b(e.target.files)}})]})},I=function(e){var n=Object(a.useState)([]),t=Object(N.a)(n,2),i=t[0],o=t[1];return Object(a.useEffect)((function(){e.signaler.addEventListener("session_joined",(function(e){console.debug("session",e.id,"joined"),o((function(n){return n.some((function(n){return n.id===e.id}))?n:n.concat({id:e.id,friendlyName:e.friendlyName})}))})),e.signaler.addEventListener("session_left",(function(e){console.debug("session",e.id,"left"),o((function(n){return n.filter((function(n){return n.id!==e.id}))}))}))}),[e]),Object(r.jsx)("div",{className:"presence",children:i.filter((function(n){return n.id!==e.id})).map((function(n){return Object(r.jsx)(q,{dialer:e.dialer,sessionId:n.id,friendlyName:n.friendlyName},n.id)}))})},P=t(68),D=t.n(P),J=function(e){Object(b.a)(t,e);var n=Object(g.a)(t);function t(e,r){var a;return Object(v.a)(this,t),(a=n.call(this,"session_".concat(e))).id=void 0,a.id=r,a}return t}(Object(j.a)(Event)),_=function(e){Object(b.a)(t,e);var n=Object(g.a)(t);function t(e,r){var a;return Object(v.a)(this,t),(a=n.call(this,"joined",e)).friendlyName=void 0,a.friendlyName=r,a}return t}(J),M=function(e){Object(b.a)(t,e);var n=Object(g.a)(t);function t(e){return Object(v.a)(this,t),n.call(this,"left",e)}return t}(J),F=function(e){Object(b.a)(t,e);var n=Object(g.a)(t);function t(e,r){var a;Object(v.a)(this,t),(a=n.call(this)).id=e,a.name=r,a.dialer=void 0,a.mqtt=void 0,a.sessions=[];var i="sessions/";try{fetch("https://broker.iot.cloud.vx-labs.net/mqtt")}catch(o){}return a.mqtt=D.a.connect("wss://broker.iot.cloud.vx-labs.net/mqtt",{username:"julien@bonachera.fr/pushr/browser",password:"VeryPasswordMuchSecureWow",connectTimeout:3e4,clean:!0,resubscribe:!1,clientId:"pushr_".concat(e),will:{retain:!0,payload:"",qos:2,topic:"sessions/".concat(a.id)}}),a.mqtt.on("message",(function(e,n){if(e.startsWith(i)){var t=(e=e.slice(i.length)).split("/");if(1===t.length){var r=t[0];if(0===n.length)a.sessions.some((function(e){return e.id===r}))&&(a.sessions=a.sessions.filter((function(e){return e.id!==r}))),a.dispatchEvent(new M(r));else{var o=JSON.parse(n.toString());a.sessions.some((function(e){return e.id===r}))||a.sessions.push({id:r,name:o.name}),a.dispatchEvent(new _(r,o.name))}}else if(e.startsWith(a.id)){if(void 0===a.dialer)return void console.error("dropped packet: dialer not registered");switch(e=e.slice(a.id.length+1)){case"candidate":var c=JSON.parse(n.toString());a.dialer.addIceCandidate(c.from,c.candidate);break;case"description_denied":var s=JSON.parse(n.toString());a.dialer.removeConn(s.from);break;case"description_answer":var u=JSON.parse(n.toString());a.dialer.descriptionCallback(u.from,u.desc);break;case"description":var d=JSON.parse(n.toString());a.dialer.informOffer(d.from,d.desc).then((function(e){a.mqtt.publish("sessions/".concat(d.from,"/description_answer"),JSON.stringify({from:a.id,desc:e}),{qos:2})})).catch((function(){a.mqtt.publish("sessions/".concat(d.from,"/description_denied"),JSON.stringify({from:a.id}),{qos:2})}));break;default:console.warn("unknown rpc received:",e)}}}})),a.mqtt.on("connect",Object(p.a)(h.a.mark((function e(){var n;return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:n=["sessions/".concat(a.id,"/+"),"sessions/+"],a.mqtt.subscribe(n,{qos:2},(function(e){e?console.error("presence setup failed",e):(console.log("presence setup"),a.mqtt.publish("sessions/".concat(a.id),JSON.stringify({id:a.id,name:a.name}),{qos:2,retain:!0},(function(e){e&&console.error(e)})))})),console.debug("connection to mqtt broker established");case 3:case"end":return e.stop()}}),e)})))),a}return Object(m.a)(t,[{key:"close",value:function(){this.mqtt.end(!0)}},{key:"getPeer",value:function(e){var n=this.sessions.find((function(n){return n.id===e}));return void 0===n?{id:e,name:" Unknown"}:n}}]),Object(m.a)(t,[{key:"register",value:function(e){this.dialer=e}},{key:"signalCandidate",value:function(){var e=Object(p.a)(h.a.mark((function e(n,t){var r=this;return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,a){r.mqtt.publish("sessions/".concat(n,"/candidate"),JSON.stringify({candidate:t,from:r.id}),{qos:2},(function(n){n?a(n):e()}))})));case 1:case"end":return e.stop()}}),e)})));return function(n,t){return e.apply(this,arguments)}}()},{key:"sendDescription",value:function(){var e=Object(p.a)(h.a.mark((function e(n,t){var r=this;return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,a){r.mqtt.publish("sessions/".concat(n,"/description"),JSON.stringify({from:r.id,desc:t}),{qos:2},(function(n){n?a(n):e()}))})));case 1:case"end":return e.stop()}}),e)})));return function(n,t){return e.apply(this,arguments)}}()}]),t}(Object(j.a)(EventTarget)),G=function(e){var n=Object(a.useState)({show:!1}),t=Object(N.a)(n,2),i=t[0],o=t[1];return Object(a.useEffect)((function(){e.dialer.addEventListener("authorization_requested",(function(n){console.log("".concat(n.sender," requested authorization")),o((function(){return{show:!0,allow:function(){o({show:!1}),n.resolve()},deny:function(){o({show:!1}),n.reject()},from:e.signaler.getPeer(n.sender).name}}))}))}),[e]),i.show?Object(r.jsx)("div",{className:"modal-overlay",children:Object(r.jsxs)("div",{className:"modal",children:[Object(r.jsxs)("div",{children:[i.from," requested authorization."]}),Object(r.jsxs)("div",{children:[Object(r.jsx)("button",{onClick:i.allow,children:"Allow"}),Object(r.jsx)("button",{onClick:i.deny,children:"Deny"})]})]})}):null},R=function(e){var n=Object(a.useState)([]),t=Object(N.a)(n,2),i=t[0],o=t[1];return Object(a.useEffect)((function(){e.dialer.addEventListener("message_received",(function(e){try{var n=JSON.parse(e.data);o((function(t){var r=t.slice(),a=r.find((function(t){return t.from===e.sender&&t.name===n.metadata.name}));return void 0===a?(console.log("creating chunk",n.chunkNumber),r.concat({from:e.sender,chunks:[{no:n.chunkNumber,value:n.value}],value:"",size:n.metadata.size,name:n.metadata.name,complete:!1})):(n.end?(a.value=a.chunks.sort((function(e,n){return e.no-n.no})).reduce((function(e,n){return e+n.value}),""),a.complete=!0):a.chunks.some((function(e){return e.no===n.chunkNumber}))||(a.chunks=a.chunks.concat({no:n.chunkNumber,value:n.value})),r)}))}catch(t){console.log("failed:",t)}}))}),[e.dialer]),Object(r.jsxs)("div",{children:["Files:"," ",i.filter((function(e){return e.complete})).map((function(e){return Object(r.jsx)("a",{download:e.name,href:e.value,children:e.name},e.from+e.name)}))]})},W=function(e){var n=Object(s.a)(e),t=n[0],r=n.slice(1),a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:navigator.language;return[t.toLocaleUpperCase(a)].concat(Object(u.a)(r)).join("")},z=function(e){return e[Math.floor(Math.random()*e.length)]},T=Object(u.a)(Array(8)).map((function(){return(~~(36*Math.random())).toString(36)})).join(""),A="".concat(W(z(l))," ").concat(W(z(d))),B=new F(T,A),H=new C(B,T);H.register();var K=function(){return Object(r.jsxs)("div",{className:"App",children:[Object(r.jsx)(G,{signaler:B,dialer:H}),Object(r.jsx)("div",{className:"peers",children:Object(r.jsx)(I,{dialer:H,friendlyName:A,signaler:B,id:T})}),Object(r.jsxs)("div",{className:"self",children:[Object(r.jsxs)("div",{children:["I am ",A]}),Object(r.jsx)(R,{dialer:H})]})]})},Q=function(e){e&&e instanceof Function&&t.e(3).then(t.bind(null,132)).then((function(n){var t=n.getCLS,r=n.getFID,a=n.getFCP,i=n.getLCP,o=n.getTTFB;t(e),r(e),a(e),i(e),o(e)}))};c.a.render(Object(r.jsx)(i.a.StrictMode,{children:Object(r.jsx)(K,{})}),document.getElementById("root")),Q()},66:function(e){e.exports=JSON.parse('["Aardvark","Albatross","Alligator","Alpaca","Ant","Anteater","Antelope","Ape","Armadillo","Donkey","Baboon","Badger","Barracuda","Bat","Bear","Beaver","Bee","Bison","Boar","Buffalo","Butterfly","Camel","Capybara","Caribou","Cassowary","Cat","Caterpillar","Cattle","Chamois","Cheetah","Chicken","Chimpanzee","Chinchilla","Chough","Clam","Cobra","Cockroach","Cod","Cormorant","Coyote","Crab","Crane","Crocodile","Crow","Curlew","Deer","Dinosaur","Dog","Dogfish","Dolphin","Dotterel","Dove","Dragonfly","Duck","Dugong","Dunlin","Eagle","Echidna","Eel","Eland","Elephant","Elk","Emu","Falcon","Ferret","Finch","Fish","Flamingo","Fly","Fox","Frog","Gaur","Gazelle","Gerbil","Giraffe","Gnat","Gnu","Goat","Goldfinch","Goldfish","Goose","Gorilla","Goshawk","Grasshopper","Grouse","Guanaco","Gull","Hamster","Hare","Hawk","Hedgehog","Heron","Herring","Hippopotamus","Hornet","Horse","Human","Hummingbird","Hyena","Ibex","Ibis","Jackal","Jaguar","Jay","Jellyfish","Kangaroo","Kingfisher","Koala","Kookabura","Kouprey","Kudu","Lapwing","Lark","Lemur","Leopard","Lion","Llama","Lobster","Locust","Loris","Louse","Lyrebird","Magpie","Mallard","Manatee","Mandrill","Mantis","Marten","Meerkat","Mink","Mole","Mongoose","Monkey","Moose","Mosquito","Mouse","Mule","Narwhal","Newt","Nightingale","Octopus","Okapi","Opossum","Oryx","Ostrich","Otter","Owl","Oyster","Panther","Parrot","Partridge","Peafowl","Pelican","Penguin","Pheasant","Pig","Pigeon","Pony","Porcupine","Porpoise","Quail","Quelea","Quetzal","Rabbit","Raccoon","Rail","Ram","Rat","Raven","Red deer","Red panda","Reindeer","Rhinoceros","Rook","Salamander","Salmon","Sand Dollar","Sandpiper","Sardine","Scorpion","Seahorse","Seal","Shark","Sheep","Shrew","Skunk","Snail","Snake","Sparrow","Spider","Spoonbill","Squid","Squirrel","Starling","Stingray","Stinkbug","Stork","Swallow","Swan","Tapir","Tarsier","Termite","Tiger","Toad","Trout","Turkey","Turtle","Viper","Vulture","Wallaby","Walrus","Wasp","Weasel","Whale","Wildcat","Wolf","Wolverine","Wombat","Woodcock","Woodpecker","Worm","Wren","Yak","Zebra"]')},67:function(e){e.exports=JSON.parse('["old","young","atlantic","male","female","large","dead","big","huge","great","more","single","adult","grown","fat","stranded","fine","harpooned","angry","raw","frozen","giant","brown","modern","pleasant","poor","stuffed","sized","pacific","enormous","fresh","impatient","largest","fossil","artful","myopic","occasional","numerous","wet","benevolent","live","official","mammoth","friendly","aged","amiable","wounded","playful","enraged","captive","slain","enough","lazy","sad","carnivorous","blessed","wary","sick","hunted","asthmatic","allied","albino","pregnant","funny","mad","five","lone","wicked","tuskless","brainless","odd","gruff","horrible","trained","unsuspecting","sardonic","arctic"]')},74:function(e,n,t){},75:function(e,n,t){},80:function(e,n){},82:function(e,n){}},[[131,1,2]]]);
//# sourceMappingURL=main.f6d8455a.chunk.js.map