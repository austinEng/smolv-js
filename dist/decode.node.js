((e,t)=>{if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var n=t();for(var r in n)("object"==typeof exports?exports:e)[r]=n[r]}})(global,()=>(e=>{function t(r){if(n[r])return n[r].exports;var f=n[r]={i:r,l:!1,exports:{}};return e[r].call(f.exports,f,f.exports,t),f.l=!0,f.exports}var n={};return t.m=e,t.c=n,t.d=(e,n,r)=>{t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:r})},t.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=(e,n)=>{if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var f in e)t.d(r,f,(t=>e[t]).bind(null,f));return r},t.n=e=>{var n=e&&e.__esModule?()=>e.default:()=>e;return t.d(n,"a",n),n},t.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),t.p="",t(t.s=3)})([(e,t,n)=>{n.d(t,"b",()=>r),n.d(t,"u",()=>f),n.d(t,"B",()=>o),n.d(t,"w",()=>a),n.d(t,"v",()=>d),n.d(t,"x",()=>c),n.d(t,"s",()=>i),n.d(t,"p",()=>b),n.d(t,"z",()=>u),n.d(t,"m",()=>s),n.d(t,"h",()=>j),n.d(t,"g",()=>O),n.d(t,"E",()=>l),n.d(t,"q",()=>p),n.d(t,"f",()=>v),n.d(t,"A",()=>g),n.d(t,"C",()=>y),n.d(t,"n",()=>w),n.d(t,"y",()=>h),n.d(t,"d",()=>m),n.d(t,"e",()=>U),n.d(t,"o",()=>x),n.d(t,"D",()=>D),n.d(t,"k",()=>k),n.d(t,"i",()=>E),n.d(t,"j",()=>L),n.d(t,"l",()=>A),n.d(t,"t",()=>S),n.d(t,"r",()=>B),n.d(t,"a",()=>I),n.d(t,"c",()=>P);var r=119734787,f=0,o=1,a=2,d=3,c=4,i=5,b=6,u=7,s=8,j=10,O=11,l=13,p=14,v=15,g=32,y=59,w=61,h=62,m=65,U=71,x=72,D=79,k=127,E=129,L=133,A=248,S=317,B=330,I=5817,_=[1,1,0,0],z={0:[0],2:[0,4,0,0,0,1,4],10:[0,1,7,72,4,4,4,4],19:[5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,4],44:[39,7],51:[39],54:[7],56:[0,39],59:[7],61:[71,42,0,0,7],71:[4,4,1,0,0],77:[71,72,72,39,71,72,31],87:[72,72,73,73,72,72,73,73,72,73,73,72,43,31,31,31,32,31,32,31,31],109:[31,31,31,31,31,31,31,31,31,31,31,31,31,31,71,31],126:[31,31,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32],154:[31,31,31,31,31,31,31,32,32,32,32,32,32,32,31,33,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32],194:[32,32,32,32,32,32,31,34,33,33,31,31],218:[0,0,0,0],224:[3,2],228:[0],246:[42,41,1,8,43,0,0,0,0,0,0,0],260:[0],280:[0,0],287:[0,0],297:[0,0],301:[0,0],305:[72,72,73,73,72,72,73,73,72,73,73,31,0],319:[0],322:[1],327:[1,7,42,0,0,0],5299:[0],5335:[0,0,0],5341:[1],5344:[0],5358:[1],5360:[0],5364:[0,0],5380:[0],5576:[0],5578:[0],5581:[0],5632:[0,0],5700:[1,1,1,1,1,1,1,1,1,1,1,1,1]},M=Object.keys(z).reduce((e,t)=>{for(var n=0;n<z[t].length;++n)e[parseInt(t)+n]=z[t][n];return e},{}),P=e=>{var t,n,r=M[e];return void 0===r?_:("number"==typeof r?r<10?(t=r,n=r>>3&1):n=r-10*(t=Math.floor(r/10)):(t=r[0],n=r[1]),[1&t,2&t,4&t,n])}},(e,t,n)=>{function r(e){return e>=0&&e<D.a&&Object(D.c)(e)[0]>0}function f(e){return e>=0&&e<D.a&&Object(D.c)(e)[1]>0}function o(e){return e>=0&&e<D.a&&Object(D.c)(e)[2]>0}function a(e){return e<0||e>D.a?0:Object(D.c)(e)[3]}function d(e){return e===D.w||e===D.v||e===D.x||e===D.s||e===D.p||e===D.z||e===D.m||e===D.t||e===D.r}function c(e){return 0==e||e>=2&&e<=5?0:e>=29&&e<=37?1:-1}function i(e,t){if(!e.data||e.data.byteLength<20)return!1;if(e.data.getUint32(e.offset,!1)===t)throw new Error("Big endian encoding not supported");return e.data.getUint32(e.offset,!0)===t&&(e.data.getUint32(e.offset+4,!0),!0)}function b(e){return i(e,D.b)}function u(e){return!(!i(e,k)||e.data.byteLength<24)}function s(e,t){if(e.offset+t>e.data.byteLength){var n=e.data.byteLength+t,r=1.5*e.data.byteLength,f=new ArrayBuffer(r>n?r:n),o=new Uint8Array(e.data.buffer,e.data.byteOffset,e.data.byteLength);new Uint8Array(f).set(o),e.data=new DataView(f)}}function j(e,t){s(e,4),e.data.setUint32(e.offset,t,!0),e.offset+=4}function O(e){var t=e.data.getUint32(e.offset,!0);return e.offset+=4,t}function l(e,t){s(e,1),e.data.setUint8(e.offset,t),e.offset+=1}function p(e){var t=e.data.getUint8(e.offset);return e.offset+=1,t}function v(e,t){for(;t>127;)s(e,1),e.data.setUint8(e.offset,127&t|128),e.offset++,t>>=7;s(e,1),e.data.setUint8(e.offset,127&t),e.offset++}function g(e){for(var t=0,n=0;e.offset<e.data.byteLength;){var r=e.data.getUint8(e.offset);if(t|=(127&r)<<n,n+=7,e.offset++,!(128&r))break}return t}function y(e){return e>>>0<<1^e>>31}function w(e){return 1&e?e>>1^-1:e>>1}function h(e){return e===D.e?D.u:e===D.u?D.e:e===D.n?D.B:e===D.B?D.n:e===D.y?D.w:e===D.w?D.y:e===D.d?D.v:e===D.v?D.d:e===D.D?D.x:e===D.x?D.D:e===D.o?D.z:e===D.z?D.o:e===D.l?D.m:e===D.m?D.l:e===D.C?9:9===e?D.C:e===D.j?D.h:e===D.h?D.j:e===D.i?D.g:e===D.g?D.i:e===D.A?D.q:e===D.q?D.A:e===D.k?D.f:e===D.f?D.k:e}function m(e,t,n){if((t=((e,t)=>(t--,e===D.D&&(t-=4),e===D.E&&(t-=4),e===D.e&&(t-=2),e===D.n&&(t-=3),e===D.d&&(t-=3),t))(n,t))>65535)throw new Error("Invalid length field");v(e,t>>4<<20|(n=h(n))>>4<<8|(15&t)<<4|15&n)}function U(e){var t,n,r=g(e),f=r>>20<<4|r>>4&15,o=r>>4&65520|15&r;return n=f,n++,(t=o=h(o))===D.D&&(n+=4),t===D.E&&(n+=4),t===D.e&&(n+=2),t===D.n&&(n+=3),t===D.d&&(n+=3),f=n,E.op=o,E.len=f,E}function x(e){var t=e.data.getUint32(e.offset,!0);if(L.len=t>>16,L.len<1)throw new Error("Invaid instruction: Length must be at least 1");if(e.offset+L.len>e.data.byteLength)throw new Error("Invalid instruction: Length exceeds buffer");return L.op=65535&t,L}n.d(t,"a",()=>k),n.d(t,"g",()=>r),n.d(t,"h",()=>f),n.d(t,"i",()=>o),n.d(t,"f",()=>a),n.d(t,"e",()=>d),n.d(t,"d",()=>c),n.d(t,"c",()=>b),n.d(t,"b",()=>u),n.d(t,"p",()=>j),n.d(t,"k",()=>O),n.d(t,"o",()=>l),n.d(t,"j",()=>p),n.d(t,"r",()=>v),n.d(t,"n",()=>g),n.d(t,"t",()=>y),n.d(t,"s",()=>w),n.d(t,"q",()=>m),n.d(t,"l",()=>U),n.d(t,"m",()=>x);var D=n(0),k=1397575500,E={op:0,len:0},L={op:0,len:0}},,(e,t,n)=>{function r(e,t,n){var r={data:new DataView(e,t||0,n),offset:0};if(!Object(a.b)(r))throw new Error("Invalid SmolV header");return r}function f(e,t,n){return r(e,t,n).data.getUint32(20,!0)}function o(e,t,n){var f=r(e,t,n),o=f.data.getUint32(20,!0),c={data:new DataView(new ArrayBuffer(o)),offset:0};Object(a.p)(c,d.b),f.offset+=4,Object(a.p)(c,Object(a.k)(f)),Object(a.p)(c,Object(a.k)(f)),Object(a.p)(c,Object(a.k)(f)),Object(a.p)(c,Object(a.k)(f)),f.offset+=4;for(var i=0,b=0;f.offset<f.data.byteLength;){var u=Object(a.l)(f),s=u.op,j=u.len,O=s===d.E;O&&(s=d.D),Object(a.p)(c,j<<16|s);var l=1;if(Object(a.h)(s)&&(Object(a.p)(c,Object(a.n)(f)),l++),Object(a.g)(s)){var p=i+Object(a.s)(Object(a.n)(f));Object(a.p)(c,p),i=p,l++}if(s!==d.e&&s!==d.o||(p=b+Object(a.s)(Object(a.n)(f)),Object(a.p)(c,p),b=p,l++),s!==d.o){var v=Object(a.f)(s);for(E=0;E<v&&l<j;++E,++l)p=Object(a.s)(Object(a.n)(f)),Object(a.p)(c,i-p);if(O&&j<=9){var g=Object(a.j)(f);j>5&&Object(a.p)(c,g>>6&3),j>6&&Object(a.p)(c,g>>4&3),j>7&&Object(a.p)(c,g>>2&3),j>8&&Object(a.p)(c,3&g)}else if(Object(a.i)(s))for(;l<j;++l)Object(a.p)(c,Object(a.n)(f));else for(;l<j;++l)Object(a.p)(c,Object(a.k)(f))}else for(var y=Object(a.j)(f),w=0,h=0,m=0;m<y;++m){var U=w+Object(a.n)(f);w=U;var x,D=Object(a.n)(f),k=Object(a.d)(D);if(x=-1===k?4+Object(a.n)(f):4+k,0!==m&&(Object(a.p)(c,x<<16|s),Object(a.p)(c,b)),Object(a.p)(c,U),Object(a.p)(c,D),35===D){if(5!==x)throw new Error("Invalid decoration length");p=h+Object(a.n)(f);Object(a.p)(c,p),h=p}else for(var E=4;E<x;++E)Object(a.p)(c,Object(a.n)(f))}}if(c.offset!==o)throw new Error("Decode error: Did not fill destination buffer");return new Uint8Array(c.data.buffer,c.data.byteOffset,c.offset)}n.r(t),n.d(t,"smolvDecodedSize",()=>f),n.d(t,"default",()=>o);var a=n(1),d=n(0)}]));