((t,e)=>{if("object"==typeof exports&&"object"==typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var r=e();for(var f in r)("object"==typeof exports?exports:t)[f]=r[f]}})(window,()=>(t=>{function e(f){if(r[f])return r[f].exports;var n=r[f]={i:f,l:!1,exports:{}};return t[f].call(n.exports,n,n.exports,e),n.l=!0,n.exports}var r={};return e.m=t,e.c=r,e.d=(t,r,f)=>{e.o(t,r)||Object.defineProperty(t,r,{enumerable:!0,get:f})},e.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=(t,r)=>{if(1&r&&(t=e(t)),8&r)return t;if(4&r&&"object"==typeof t&&t&&t.__esModule)return t;var f=Object.create(null);if(e.r(f),Object.defineProperty(f,"default",{enumerable:!0,value:t}),2&r&&"string"!=typeof t)for(var n in t)e.d(f,n,(e=>t[e]).bind(null,n));return f},e.n=t=>{var r=t&&t.__esModule?()=>t.default:()=>t;return e.d(r,"a",r),r},e.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),e.p="",e(e.s=2)})([(t,e,r)=>{r.d(e,"b",()=>f),r.d(e,"u",()=>n),r.d(e,"B",()=>a),r.d(e,"w",()=>o),r.d(e,"v",()=>d),r.d(e,"x",()=>i),r.d(e,"s",()=>s),r.d(e,"p",()=>c),r.d(e,"z",()=>u),r.d(e,"m",()=>b),r.d(e,"h",()=>l),r.d(e,"g",()=>g),r.d(e,"E",()=>j),r.d(e,"q",()=>p),r.d(e,"f",()=>v),r.d(e,"A",()=>O),r.d(e,"C",()=>y),r.d(e,"n",()=>w),r.d(e,"y",()=>h),r.d(e,"d",()=>U),r.d(e,"e",()=>m),r.d(e,"o",()=>E),r.d(e,"D",()=>L),r.d(e,"k",()=>x),r.d(e,"i",()=>k),r.d(e,"j",()=>D),r.d(e,"l",()=>I),r.d(e,"t",()=>A),r.d(e,"r",()=>B),r.d(e,"a",()=>S),r.d(e,"c",()=>M);var f=119734787,n=0,a=1,o=2,d=3,i=4,s=5,c=6,u=7,b=8,l=10,g=11,j=13,p=14,v=15,O=32,y=59,w=61,h=62,U=65,m=71,E=72,L=79,x=127,k=129,D=133,I=248,A=317,B=330,S=5817,T=[1,1,0,0],_={0:[0],2:[0,4,0,0,0,1,4],10:[0,1,7,72,4,4,4,4],19:[5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,4],44:[39,7],51:[39],54:[7],56:[0,39],59:[7],61:[71,42,0,0,7],71:[4,4,1,0,0],77:[71,72,72,39,71,72,31],87:[72,72,73,73,72,72,73,73,72,73,73,72,43,31,31,31,32,31,32,31,31],109:[31,31,31,31,31,31,31,31,31,31,31,31,31,31,71,31],126:[31,31,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32],154:[31,31,31,31,31,31,31,32,32,32,32,32,32,32,31,33,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32],194:[32,32,32,32,32,32,31,34,33,33,31,31],218:[0,0,0,0],224:[3,2],228:[0],246:[42,41,1,8,43,0,0,0,0,0,0,0],260:[0],280:[0,0],287:[0,0],297:[0,0],301:[0,0],305:[72,72,73,73,72,72,73,73,72,73,73,31,0],319:[0],322:[1],327:[1,7,42,0,0,0],5299:[0],5335:[0,0,0],5341:[1],5344:[0],5358:[1],5360:[0],5364:[0,0],5380:[0],5576:[0],5578:[0],5581:[0],5632:[0,0],5700:[1,1,1,1,1,1,1,1,1,1,1,1,1]},q=Object.keys(_).reduce((t,e)=>{for(var r=0;r<_[e].length;++r)t[parseInt(e)+r]=_[e][r];return t},{}),M=t=>{var e,r,f=q[t];return void 0===f?T:("number"==typeof f?f<10?(e=f,r=f>>3&1):r=f-10*(e=Math.floor(f/10)):(e=f[0],r=f[1]),[1&e,2&e,4&e,r])}},(t,e,r)=>{function f(t){return t>=0&&t<L.a&&Object(L.c)(t)[0]>0}function n(t){return t>=0&&t<L.a&&Object(L.c)(t)[1]>0}function a(t){return t>=0&&t<L.a&&Object(L.c)(t)[2]>0}function o(t){return t<0||t>L.a?0:Object(L.c)(t)[3]}function d(t){return t===L.w||t===L.v||t===L.x||t===L.s||t===L.p||t===L.z||t===L.m||t===L.t||t===L.r}function i(t){return 0==t||t>=2&&t<=5?0:t>=29&&t<=37?1:-1}function s(t,e){if(!t.data||t.data.byteLength<20)return!1;if(t.data.getUint32(t.offset,!1)===e)throw new Error("Big endian encoding not supported");return t.data.getUint32(t.offset,!0)===e&&(t.data.getUint32(t.offset+4,!0),!0)}function c(t){return s(t,L.b)}function u(t){return!(!s(t,x)||t.data.byteLength<24)}function b(t,e){if(t.offset+e>t.data.byteLength){var r=t.data.byteLength+e,f=1.5*t.data.byteLength,n=new ArrayBuffer(f>r?f:r),a=new Uint8Array(t.data.buffer,t.data.byteOffset,t.data.byteLength);new Uint8Array(n).set(a),t.data=new DataView(n)}}function l(t,e){b(t,4),t.data.setUint32(t.offset,e,!0),t.offset+=4}function g(t){var e=t.data.getUint32(t.offset,!0);return t.offset+=4,e}function j(t,e){b(t,1),t.data.setUint8(t.offset,e),t.offset+=1}function p(t){var e=t.data.getUint8(t.offset);return t.offset+=1,e}function v(t,e){for(;e>127;)b(t,1),t.data.setUint8(t.offset,127&e|128),t.offset++,e>>=7;b(t,1),t.data.setUint8(t.offset,127&e),t.offset++}function O(t){for(var e=0,r=0;t.offset<t.data.byteLength;){var f=t.data.getUint8(t.offset);if(e|=(127&f)<<r,r+=7,t.offset++,!(128&f))break}return e}function y(t){return t>>>0<<1^t>>31}function w(t){return 1&t?t>>1^-1:t>>1}function h(t){return t===L.e?L.u:t===L.u?L.e:t===L.n?L.B:t===L.B?L.n:t===L.y?L.w:t===L.w?L.y:t===L.d?L.v:t===L.v?L.d:t===L.D?L.x:t===L.x?L.D:t===L.o?L.z:t===L.z?L.o:t===L.l?L.m:t===L.m?L.l:t===L.C?9:9===t?L.C:t===L.j?L.h:t===L.h?L.j:t===L.i?L.g:t===L.g?L.i:t===L.A?L.q:t===L.q?L.A:t===L.k?L.f:t===L.f?L.k:t}function U(t,e,r){if((e=((t,e)=>(e--,t===L.D&&(e-=4),t===L.E&&(e-=4),t===L.e&&(e-=2),t===L.n&&(e-=3),t===L.d&&(e-=3),e))(r,e))>65535)throw new Error("Invalid length field");v(t,e>>4<<20|(r=h(r))>>4<<8|(15&e)<<4|15&r)}function m(t){var e,r,f=O(t),n=f>>20<<4|f>>4&15,a=f>>4&65520|15&f;return r=n,r++,(e=a=h(a))===L.D&&(r+=4),e===L.E&&(r+=4),e===L.e&&(r+=2),e===L.n&&(r+=3),e===L.d&&(r+=3),n=r,k.op=a,k.len=n,k}function E(t){var e=t.data.getUint32(t.offset,!0);if(D.len=e>>16,D.len<1)throw new Error("Invaid instruction: Length must be at least 1");if(t.offset+D.len>t.data.byteLength)throw new Error("Invalid instruction: Length exceeds buffer");return D.op=65535&e,D}r.d(e,"a",()=>x),r.d(e,"g",()=>f),r.d(e,"h",()=>n),r.d(e,"i",()=>a),r.d(e,"f",()=>o),r.d(e,"e",()=>d),r.d(e,"d",()=>i),r.d(e,"c",()=>c),r.d(e,"b",()=>u),r.d(e,"p",()=>l),r.d(e,"k",()=>g),r.d(e,"o",()=>j),r.d(e,"j",()=>p),r.d(e,"r",()=>v),r.d(e,"n",()=>O),r.d(e,"t",()=>y),r.d(e,"s",()=>w),r.d(e,"q",()=>U),r.d(e,"l",()=>m),r.d(e,"m",()=>E);var L=r(0),x=1397575500,k={op:0,len:0},D={op:0,len:0}},(t,e,r)=>{function f(t,e,r,f){var o=r,d=e||0;f={stripDebugInfo:f&&f.stripDebugInfo};var i={data:new DataView(t,d,o),offset:0};if(!Object(a.c)(i))throw new Error("Invalid SpirV header");var s={data:new DataView(new ArrayBuffer(i.data.byteLength/2)),offset:0},c=(Object(a.k)(i),Object(a.k)(i)),u=Object(a.k)(i),b=Object(a.k)(i),l=Object(a.k)(i);Object(a.p)(s,a.a),Object(a.p)(s,c),Object(a.p)(s,u),Object(a.p)(s,b),Object(a.p)(s,l);var g=s.offset;Object(a.p)(s,i.data.byteLength);for(var j=i.data.byteLength/4,p=0,v=0;i.offset<i.data.byteLength;){var O=Object(a.m)(i),y=O.op,w=O.len;if(f.stripDebugInfo&&Object(a.e)(y))j-=w,i.offset+=4*w;else{var h=0;if(y===n.D&&w<=9){var U=w>5?i.data.getUint32(i.offset+20,!0):0,m=w>6?i.data.getUint32(i.offset+24,!0):0,E=w>7?i.data.getUint32(i.offset+28,!0):0,L=w>8?i.data.getUint32(i.offset+32,!0):0;U<4&&m<4&&E<4&&L<4&&(y=n.E,h=U<<6|m<<4|E<<2|L)}Object(a.q)(s,w,y);var x=1;if(Object(a.h)(y)){if(x>=w)throw new Error("Too many operands");Object(a.r)(s,i.data.getUint32(i.offset+4*x,!0)),x++}if(Object(a.g)(y)){if(x>=w)throw new Error("Too many operands");var k=i.data.getUint32(i.offset+4*x,!0);Object(a.r)(s,Object(a.t)(k-p)),p=k,x++}if(y===n.e||y===n.o){if(x>=w)throw new Error("Too many operands");k=i.data.getUint32(i.offset+4*x,!0),Object(a.r)(s,Object(a.t)(k-v)),v=k,x++}if(y!==n.o){var D=Object(a.f)(y);for(H=0;H<D&&x<w;++H,++x){if(x>=w)throw new Error("Too many operands");var I=p-i.data.getUint32(i.offset+4*x,!0);Object(a.r)(s,Object(a.t)(I))}if(y===n.E)Object(a.o)(s,h),x=w;else if(Object(a.i)(y))for(;x<w;++x)Object(a.r)(s,i.data.getUint32(i.offset+4*x,!0));else for(;x<w;++x)Object(a.p)(s,i.data.getUint32(i.offset+4*x,!0));i.offset+=4*w}else{var A=i.data.getUint32(i.offset+4*(x-1),!0),B={data:i.data,offset:i.offset},S=0,T=0,_=s.offset;Object(a.o)(s,0);for(var q=0;B.offset<i.data.byteLength&&q<255;){var M=Object(a.m)(B),P=M.op,z=M.len;if(P!==n.o)break;if(z<4)throw new Error("Invalid input");if(B.data.getUint32(B.offset+4,!0)!==A)break;var V=B.data.getUint32(B.offset+8,!0);Object(a.r)(s,V-S),S=V;var C=B.data.getUint32(B.offset+12,!0);Object(a.r)(s,C);var F=Object(a.d)(C);if(-1===F)Object(a.r)(s,z-4);else if(F+4!==z)throw new Error("Invalid input");if(35===C){if(5!==z)throw new Error("Invalid offset");var G=B.data.getUint32(B.offset+16,!0);Object(a.r)(s,G-T),T=G}else for(var H=4;H<z;++H)Object(a.r)(s,B.data.getUint32(B.offset+4*H,!0));B.offset+=4*z,++q}s.data.setUint8(_,q),i.offset=B.offset}}}return j!==i.data.byteLength/4&&s.data.setUint32(g,4*j),new Uint8Array(s.data.buffer,s.data.byteOffset,s.offset)}r.r(e),r.d(e,"default",()=>f);var n=r(0),a=r(1)}]));