(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[832],{3832:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>b});var o=r(5155),n=r(2115),a=r(833),s=r(5402),c=r(3710),i=r(9579),l=r(8998),d=r(1348),u=r(894),p=r(2282),h=r(368),m=r(5899),j=r(6756),g=r(8310),x=r(5480);function f(e){let{onSelectCategory:t}=e,[r,a]=(0,n.useState)(null),s=!!r,c=e=>{a(null),null!==e&&t(e)};return(0,o.jsxs)("div",{children:[(0,o.jsx)(p.A,{variant:"outlined",onClick:e=>{a(e.currentTarget)},"aria-controls":s?"category-menu":void 0,"aria-haspopup":"true","aria-expanded":s?"true":void 0,children:"Select Category"}),(0,o.jsxs)(g.A,{id:"category-menu",anchorEl:r,open:s,onClose:()=>c(null),children:[(0,o.jsx)(x.A,{onClick:()=>c(""),children:"All Projects"}),(0,o.jsx)(x.A,{onClick:()=>c("Art-Based Projects"),children:"Art-Based Projects"}),(0,o.jsx)(x.A,{onClick:()=>c("Research Projects"),children:"Research Projects"}),(0,o.jsx)(x.A,{onClick:()=>c("Education and Community Outreach"),children:"Education and Community Outreach"})]})]})}function k(e){let{open:t,onClose:r,filteredProjects:n,onSelectCategory:a,markerRefs:s,isDarkMode:c,toggleDarkMode:g}=e,x=(0,j.ko)(),k=(e,t,r)=>{x&&s.current[r]&&(x.flyTo([e,t],13,{animate:!0}),s.current[r].openPopup())};return(0,o.jsx)(i.Ay,{anchor:"right",open:t,onClose:r,children:(0,o.jsxs)(l.A,{className:"sidebar",children:[(0,o.jsxs)(l.A,{className:"sidebar-header",children:[(0,o.jsx)(d.A,{variant:"h6",children:"Sidebar"}),(0,o.jsx)(u.A,{onClick:r,children:(0,o.jsx)(m.A,{})})]}),(0,o.jsxs)(l.A,{className:"sidebar-controls",children:[(0,o.jsx)("div",{className:"categories-dropdown",children:(0,o.jsx)(f,{onSelectCategory:a})}),(0,o.jsx)("div",{className:"zoom-out-button",children:(0,o.jsx)(p.A,{variant:"contained",onClick:()=>{x.setZoom(9)},children:"Zoom Out"})}),(0,o.jsxs)("div",{className:"dark-mode-toggle",children:[(0,o.jsx)(d.A,{children:"Dark Mode"}),(0,o.jsx)(h.A,{checked:c,onChange:g})]})]}),(0,o.jsxs)(l.A,{className:"sidebar-projects",children:[(0,o.jsx)(d.A,{variant:"body1",gutterBottom:!0,children:"Filtered Projects:"}),n.map((e,t)=>{let r=parseFloat(e.Latitude),n=parseFloat(e.Longitude),a="".concat(e["Project Name"],"-").concat(t);return(0,o.jsx)(d.A,{variant:"body2",style:{cursor:"pointer",marginBottom:"0.5rem"},onClick:()=>k(r,n,a),children:e["Project Name"]},a)})]})]})})}function C(e){let{onClick:t}=e;return(0,o.jsx)("button",{onClick:t,style:{position:"absolute",top:"1rem",right:"1rem",zIndex:1e3,padding:"0.5rem 1rem",backgroundColor:"#007bff",color:"#fff",border:"none",borderRadius:"5px",cursor:"pointer"},children:"Open Sidebar"})}r(3353),r(8280);var A=r(2127);function b(){let[e,t]=(0,n.useState)(!1),{projects:r,filteredProjects:i,filterProjects:l}=function(){let[e,t]=(0,n.useState)([]),[r,o]=(0,n.useState)([]);return(0,n.useEffect)(()=>{(async()=>{try{let e=await fetch("https://adamfehse.github.io/storymapapp/storymapdata.json"),r=await e.json();t(r),o(r)}catch(e){console.error("Error fetching project data:",e)}})()},[]),{projects:e,filteredProjects:r,filterProjects:t=>{e.length&&o("All"===t||""===t?e:e.filter(e=>e["Project Category"]===t))}}}(),d=(0,n.useRef)({}),[u,p]=(0,n.useState)(!1);return(0,n.useEffect)(()=>{i.forEach((e,t)=>{let r="".concat(e["Project Name"],"-").concat(t),o=d.current[r];if(o){let t='\n              <div class="popup-content">\n                <img \n                  src="'.concat(e.ImageUrl||"https://via.placeholder.com/150",'" \n                  alt="').concat(e["Project Name"],'" \n                  class="popup-image" \n                />\n                <strong>').concat(e["Project Name"],'</strong>\n                <p class="popup-description">').concat(e.DescriptionShort,"</p>\n              </div>\n            "),r=A.responsivePopup({hasTip:!0,autoPan:!0}).setContent(t);o.bindPopup(r)}})},[i]),(0,o.jsxs)(a.W,{center:[31.916004,-110.990274],zoom:9,style:{height:"100vh",width:"100%"},children:[(0,o.jsx)(s.e,{url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",attribution:"\xa9 OpenStreetMap contributors"}),i.map((e,t)=>{let r=[parseFloat(e.Latitude),parseFloat(e.Longitude)],n="".concat(e["Project Name"],"-").concat(t);return r[0]&&r[1]?(0,o.jsx)(c.p,{position:r,ref:e=>{e&&(d.current[n]=e)}},n):null}),(0,o.jsx)(C,{onClick:()=>t(!0)}),(0,o.jsx)(k,{open:e,onClose:()=>t(!1),projects:r,filteredProjects:i,onSelectCategory:l,markerRefs:d,isDarkMode:u,toggleDarkMode:()=>{p(e=>{let t=!e;return document.body.classList.toggle("dark-mode",t),t})}})]})}r(1744),r(4999),r(9235),L.Icon.Default.mergeOptions({iconRetinaUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",iconUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",shadowUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"})},8280:()=>{},4999:()=>{},9235:()=>{},3353:()=>{}}]);