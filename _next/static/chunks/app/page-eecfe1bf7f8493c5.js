(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[974],{3385:(e,t,n)=>{Promise.resolve().then(n.bind(n,1004))},1004:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>a});var l=n(5155),r=n(1956);let u=n.n(r)()(()=>Promise.all([n.e(864),n.e(740),n.e(415),n.e(761),n.e(968),n.e(591)]).then(n.bind(n,8591)),{loadableGenerated:{webpack:()=>[8591]},ssr:!1});function o(){return(0,l.jsx)(u,{})}function a(){return(0,l.jsx)("main",{style:{width:"100%",height:"100%",position:"relative"},children:(0,l.jsx)(o,{})})}},1956:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return r}});let l=n(306)._(n(580));function r(e,t){var n;let r={};"function"==typeof e&&(r.loader=e);let u={...r,...t};return(0,l.default)({...u,modules:null==(n=u.loadableGenerated)?void 0:n.modules})}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},9827:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"BailoutToCSR",{enumerable:!0,get:function(){return r}});let l=n(3719);function r(e){let{reason:t,children:n}=e;if("undefined"==typeof window)throw new l.BailoutToCSRError(t);return n}},580:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return s}});let l=n(5155),r=n(2115),u=n(9827),o=n(9214);function a(e){return{default:e&&"default"in e?e.default:e}}let i={loader:()=>Promise.resolve(a(()=>null)),loading:null,ssr:!0},s=function(e){let t={...i,...e},n=(0,r.lazy)(()=>t.loader().then(a)),s=t.loading;function d(e){let a=s?(0,l.jsx)(s,{isLoading:!0,pastDelay:!0,error:null}):null,i=!t.ssr||!!t.loading,d=i?r.Suspense:r.Fragment,f=t.ssr?(0,l.jsxs)(l.Fragment,{children:["undefined"==typeof window?(0,l.jsx)(o.PreloadChunks,{moduleIds:t.modules}):null,(0,l.jsx)(n,{...e})]}):(0,l.jsx)(u.BailoutToCSR,{reason:"next/dynamic",children:(0,l.jsx)(n,{...e})});return(0,l.jsx)(d,{...i?{fallback:a}:{},children:f})}return d.displayName="LoadableComponent",d}},9214:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"PreloadChunks",{enumerable:!0,get:function(){return a}});let l=n(5155),r=n(7650),u=n(5861),o=n(8284);function a(e){let{moduleIds:t}=e;if("undefined"!=typeof window)return null;let n=u.workAsyncStorage.getStore();if(void 0===n)return null;let a=[];if(n.reactLoadableManifest&&t){let e=n.reactLoadableManifest;for(let n of t){if(!e[n])continue;let t=e[n].files;a.push(...t)}}return 0===a.length?null:(0,l.jsx)(l.Fragment,{children:a.map(e=>{let t=n.assetPrefix+"/_next/"+(0,o.encodeURIPath)(e);return e.endsWith(".css")?(0,l.jsx)("link",{precedence:"dynamic",href:t,rel:"stylesheet",as:"style"},e):((0,r.preload)(t,{as:"script",fetchPriority:"low"}),null)})})}}},e=>{var t=t=>e(e.s=t);e.O(0,[441,517,358],()=>t(3385)),_N_E=e.O()}]);