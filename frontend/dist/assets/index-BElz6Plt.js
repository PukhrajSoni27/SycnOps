import{r as _,j as i,u as lt,b as mi,Q as xi,a as yi,d as bi}from"./vendor-query-DOChBpoz.js";import{r as vi,L,u as ct,a as wi,B as _i,R as Si,b as D}from"./vendor-react-DA0FEISy.js";import{C as ps,X as dt,M as Tn,A as Ii,a as He,S as Cn,Z as Ei,G as Ti,b as Ci,c as ki,d as ji,e as kn,f as Gt,g as Ai,h as Ni,i as Ri,j as jn,P as Oi,k as An,U as Nn,l as Pi,T as Mi,B as fs,L as gs,m as Rn,n as Fi,o as Di,p as Li,q as zi,r as Bi}from"./vendor-icons-CLeidrsr.js";import{R as ms,B as Ui,C as xs,X as ys,Y as bs,T as vs,a as Wi,L as $i,b as Hi}from"./vendor-recharts-Cq6IWcTR.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function s(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(r){if(r.ep)return;r.ep=!0;const a=s(r);fetch(r.href,a)}})();var Mt={},ws=vi;Mt.createRoot=ws.createRoot,Mt.hydrateRoot=ws.hydrateRoot;function Vi(){const t=_.useRef(null);return _.useEffect(()=>{const e=t.current;if(!e)return;const s=e.getContext("2d",{alpha:!0});if(!s)return;let n;const r=Math.min(window.devicePixelRatio||1,2);let a=0,o=0;const l=()=>{if(!e||!e.parentElement)return;const h=e.parentElement.getBoundingClientRect();a=h.width,o=h.height,e.width=a*r,e.height=o*r,s.scale(r,r)};l(),window.addEventListener("resize",l);let c=0;const d=()=>{c+=.014,s.clearRect(0,0,a,o);const h=s.createRadialGradient(a*.7,o*.45,30,a*.7,o*.45,a*.6);h.addColorStop(0,"rgba(16, 185, 129, 0.18)"),h.addColorStop(.5,"rgba(6, 182, 212, 0.08)"),h.addColorStop(1,"transparent"),s.fillStyle=h,s.fillRect(0,0,a,o);const p=4;for(let u=0;u<p;u++){s.beginPath(),s.strokeStyle=u%2===0?"rgba(16, 185, 129, 0.75)":"rgba(6, 182, 212, 0.75)",s.lineWidth=u===0?2:1;const f=a*.6+Math.sin(c+u*1.5)*25,g=30+u*35;s.moveTo(f,g);const m=16;for(let y=0;y<m;y++){const x=y/m,b=Math.sin(c*2.2+y*.8+u*1.2)*32,v=Math.cos(c*1.6+y*.6)*24,w=f+b+Math.sin(y*2.5+c)*10,S=g+x*(o*.85)+v;s.lineTo(w,S)}s.stroke()}for(let u=0;u<20;u++){const f=a*.35+(Math.sin(u*7+c*1.4)*.5+.5)*(a*.6),g=(Math.cos(u*5+c*.9)*.5+.5)*o,m=Math.sin(c*2.5+u)*1.2+1.8;s.beginPath(),s.fillStyle=u%2===0?"rgba(16, 185, 129, 0.85)":"rgba(56, 189, 248, 0.85)",s.arc(f,g,Math.max(.5,m),0,Math.PI*2),s.fill()}n=requestAnimationFrame(d)};return d(),()=>{window.removeEventListener("resize",l),cancelAnimationFrame(n)}},[]),i.jsx("canvas",{ref:t,style:{width:"100%",height:"100%",display:"block",pointerEvents:"none",transform:"translateZ(0)"}})}function qi(){const[t,e]=_.useState(!1);_.useEffect(()=>{const r=new IntersectionObserver(o=>{o.forEach(l=>{l.isIntersecting&&l.target.classList.add("is-visible")})},{threshold:.12,rootMargin:"0px 0px -50px 0px"});return document.querySelectorAll(".reveal-block").forEach(o=>r.observe(o)),()=>r.disconnect()},[]);const s=[{icon:i.jsx(Ci,{className:"w-5 h-5 text-emerald-400"}),title:"Automated Pipeline Engine",desc:"Orchestrate CI/CD builds, automated code reviews, and full-stack environment provisioning seamlessly."},{icon:i.jsx(ki,{className:"w-5 h-5 text-emerald-400"}),title:"Real-Time Telemetry",desc:"Track repository pull requests, active issues, and build velocity with continuous live analytics."},{icon:i.jsx(ji,{className:"w-5 h-5 text-emerald-400"}),title:"Zero-Trust Security",desc:"SOC2 compliant RBAC infrastructure, encrypted auth tokens, and automated code vulnerability scanning."}],n=[{name:"Starter",price:"$0",period:"/ month",desc:"Perfect for solo developers & open-source projects.",features:["Up to 5 Repositories","Standard AI Pipeline","Automated PR Checks","Community Support"],cta:"Start Free",popular:!1},{name:"Pro",price:"$49",period:"/ month",desc:"For high-velocity engineering teams & startups.",features:["Unlimited Repositories","Priority AI Engine","Real-time Telemetry Dashboard","SOC2 Compliant Logs","Dedicated Support"],cta:"Get Pro Access",popular:!0},{name:"Enterprise",price:"Custom",period:"",desc:"Custom infrastructure & dedicated SLA guarantees.",features:["On-Premise / Private Cloud","Custom Model Fine-tuning","24/7 SLA Guarantee","Dedicated Solutions Architect"],cta:"Contact Sales",popular:!1}];return i.jsxs("div",{className:"s-landing-root",children:[i.jsx("div",{className:"s-grid-bg"}),i.jsx("div",{className:"s-plasma-container",children:i.jsx(Vi,{})}),i.jsx("header",{className:"s-nav-super",children:i.jsxs("div",{className:"s-nav-super__inner",children:[i.jsxs(L,{to:"/",style:{display:"flex",alignItems:"center",gap:"10px",textDecoration:"none"},children:[i.jsx("span",{className:"s-logo-box",children:i.jsx(ps,{style:{width:"16px",height:"16px",color:"#ffffff"}})}),i.jsxs("span",{style:{fontFamily:"var(--font-serif)",fontSize:"20px",fontWeight:500,color:"#ffffff",letterSpacing:"-0.02em"},children:["SycnOps",i.jsx("span",{style:{color:"#10B981"},children:"."})]})]}),i.jsxs("nav",{className:"hidden md:flex",style:{display:"flex",alignItems:"center",gap:"32px"},children:[i.jsx("a",{href:"#features",className:"s-nav__link",children:"Features"}),i.jsx("a",{href:"#manifesto",className:"s-nav__link",children:"Manifesto"}),i.jsx("a",{href:"#pricing",className:"s-nav__link",children:"Pricing"}),i.jsx("a",{href:"#changelog",className:"s-nav__link",children:"Changelog"})]}),i.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"20px"},children:[i.jsx(L,{to:"/login",className:"hidden md:flex",style:{fontFamily:"var(--font-sans)",fontSize:"13px",color:"rgba(255,255,255,0.7)",textDecoration:"none",transition:"color 0.2s"},onMouseOver:r=>r.currentTarget.style.color="#fff",onMouseOut:r=>r.currentTarget.style.color="rgba(255,255,255,0.7)",children:"Log in"}),i.jsx(L,{to:"/register",className:"s-btn-white-pill",children:"Get Early Access"}),i.jsx("button",{className:"md:hidden",onClick:()=>e(!t),style:{background:"none",border:"none",color:"#fff",cursor:"pointer",padding:0},children:t?i.jsx(dt,{size:24}):i.jsx(Tn,{size:24})})]})]})}),i.jsxs("section",{style:{position:"relative",zIndex:10,paddingTop:"140px",paddingBottom:"80px",paddingLeft:"var(--pad-x)",paddingRight:"var(--pad-x)",minHeight:"92vh",display:"flex",flexDirection:"column",justifyContent:"space-between"},children:[i.jsxs("div",{style:{maxWidth:"var(--max-w)",margin:"0 auto",width:"100%",display:"grid",gridTemplateColumns:"minmax(0, 1.15fr) minmax(0, 0.85fr)",gap:"48px",alignItems:"center"},children:[i.jsxs("div",{children:[i.jsxs("div",{className:"reveal-block",style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"24px","--reveal-delay":"0.05s"},children:[i.jsx("span",{className:"s-pulse-dot"}),i.jsx("span",{style:{fontFamily:"var(--font-tech)",fontSize:"11px",fontWeight:600,letterSpacing:"0.2em",textTransform:"uppercase",color:"#10B981"},children:"01_DEVOPS_AUTOMATION •"})]}),i.jsxs("h1",{className:"s-hero-cyan-heading reveal-block",style:{"--reveal-delay":"0.1s"},children:["The AI Ops",i.jsx("br",{}),i.jsx("span",{className:"s-hero-cyan-accent",children:"Platform."})]}),i.jsx("p",{className:"reveal-block",style:{fontFamily:"var(--font-sans)",fontSize:"17px",fontWeight:300,lineHeight:1.65,color:"rgba(235, 235, 235, 0.7)",marginBottom:"36px",maxWidth:"460px","--reveal-delay":"0.15s"},children:"Automate code reviews, CI/CD pipelines, repository telemetry, and full-stack deployments. SycnOps orchestrates your engineering workflows with autonomous AI intelligence."}),i.jsxs("div",{className:"reveal-block",style:{display:"flex",alignItems:"center",gap:"16px",flexWrap:"wrap",marginBottom:"48px","--reveal-delay":"0.2s"},children:[i.jsxs(L,{to:"/register",className:"s-btn-white-pill",children:["Initialize ",i.jsx(Ii,{className:"w-4 h-4"})]}),i.jsx("a",{href:"#manifesto",className:"s-btn-dark-pill",children:"View Documentation"})]}),i.jsxs("div",{className:"reveal-block",style:{display:"flex",alignItems:"center",gap:"24px",flexWrap:"wrap","--reveal-delay":"0.25s"},children:[i.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px",fontFamily:"var(--font-tech)",fontSize:"11px",color:"rgba(255,255,255,0.4)",letterSpacing:"0.12em"},children:[i.jsx(He,{className:"w-3.5 h-3.5 text-emerald-400"})," SOC2 COMPLIANT"]}),i.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px",fontFamily:"var(--font-tech)",fontSize:"11px",color:"rgba(255,255,255,0.4)",letterSpacing:"0.12em"},children:[i.jsx(He,{className:"w-3.5 h-3.5 text-emerald-400"})," NO CREDIT CARD REQUIRED"]})]})]}),i.jsx("div",{className:"reveal-block",style:{"--reveal-delay":"0.2s"},children:i.jsxs("div",{className:"s-ide-container",children:[i.jsx("div",{className:"s-floating-badge",style:{top:"-18px",right:"-12px"},children:i.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[i.jsx("div",{style:{width:"28px",height:"28px",borderRadius:"8px",background:"rgba(16, 185, 129, 0.15)",display:"flex",alignItems:"center",justifyContent:"center"},children:i.jsx(Cn,{className:"w-4 h-4 text-emerald-400"})}),i.jsxs("div",{children:[i.jsx("div",{style:{fontFamily:"var(--font-tech)",fontSize:"9px",letterSpacing:"0.18em",color:"rgba(255,255,255,0.4)",textTransform:"uppercase"},children:"STATUS"}),i.jsx("div",{style:{fontFamily:"var(--font-sans)",fontSize:"12px",fontWeight:600,color:"#ffffff"},children:"System Healthy"})]})]})}),i.jsx("div",{style:{position:"absolute",right:"-24px",top:"40%",zIndex:25},children:i.jsx("div",{style:{width:"36px",height:"36px",borderRadius:"50%",background:"rgba(16, 185, 129, 0.2)",border:"1px solid rgba(16, 185, 129, 0.4)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 20px rgba(16, 185, 129, 0.3)"},children:i.jsx(Ei,{className:"w-4 h-4 text-emerald-400"})})}),i.jsx("div",{className:"s-floating-badge",style:{bottom:"-18px",left:"-12px"},children:i.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[i.jsx("div",{style:{width:"28px",height:"28px",borderRadius:"8px",background:"rgba(255, 255, 255, 0.08)",display:"flex",alignItems:"center",justifyContent:"center"},children:i.jsx(Ti,{className:"w-4 h-4 text-white"})}),i.jsxs("div",{children:[i.jsx("div",{style:{fontFamily:"var(--font-tech)",fontSize:"9px",letterSpacing:"0.18em",color:"rgba(255,255,255,0.4)",textTransform:"uppercase"},children:"STACK"}),i.jsx("div",{style:{fontFamily:"var(--font-sans)",fontSize:"12px",fontWeight:600,color:"#ffffff"},children:"Node / React / Mongo"})]})]})}),i.jsxs("div",{className:"s-ide-window",children:[i.jsxs("div",{style:{padding:"12px 16px",background:"rgba(0,0,0,0.4)",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",gap:"8px"},children:[i.jsx("div",{style:{width:"10px",height:"10px",borderRadius:"50%",background:"#EF4444"}}),i.jsx("div",{style:{width:"10px",height:"10px",borderRadius:"50%",background:"#F59E0B"}}),i.jsx("div",{style:{width:"10px",height:"10px",borderRadius:"50%",background:"#10B981"}})]}),i.jsxs("div",{style:{padding:"24px",minHeight:"260px",display:"flex",flexDirection:"column",justifyContent:"space-between"},children:[i.jsxs("div",{children:[i.jsx("div",{style:{height:"12px",width:"140px",background:"rgba(255,255,255,0.1)",borderRadius:"4px",marginBottom:"16px"}}),i.jsx("div",{style:{height:"8px",width:"80%",background:"rgba(255,255,255,0.04)",borderRadius:"4px",marginBottom:"8px"}}),i.jsx("div",{style:{height:"8px",width:"60%",background:"rgba(255,255,255,0.04)",borderRadius:"4px",marginBottom:"8px"}})]}),i.jsxs("div",{style:{background:"rgba(0,0,0,0.6)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"10px",padding:"14px 16px",fontFamily:"var(--font-mono)",fontSize:"11px",lineHeight:1.7},children:[i.jsx("div",{style:{color:"#06B6D4"},children:"> sycnops_init --cluster=production"}),i.jsx("div",{style:{color:"#10B981"},children:"> analyzing repository health... [OK]"}),i.jsxs("div",{style:{color:"rgba(255,255,255,0.7)",display:"flex",alignItems:"center",gap:"6px"},children:["> automated AI pipelines active... ",i.jsx("span",{className:"s-pulse-dot",style:{display:"inline-block",width:"6px",height:"6px"}})]})]})]})]})]})})]}),i.jsx("div",{style:{margin:"48px auto 0 auto",textAlign:"center"},children:i.jsxs("div",{className:"s-scroll-indicator",children:[i.jsx("span",{children:"SCROLL TO EXPLORE"}),i.jsx("div",{className:"s-scroll-line"})]})})]}),i.jsx("section",{id:"features",style:{position:"relative",zIndex:10,padding:"100px var(--pad-x)",borderTop:"1px solid rgba(255,255,255,0.06)"},children:i.jsxs("div",{className:"s-inner",children:[i.jsxs("div",{style:{textAlign:"center",marginBottom:"64px"},children:[i.jsx("span",{className:"s-overline",children:"CORE CAPABILITIES"}),i.jsx("h2",{style:{fontFamily:"var(--font-serif)",fontSize:"clamp(32px, 4vw, 54px)",fontWeight:300,color:"#ffffff",letterSpacing:"-0.02em"},children:"Designed for Autonomous Operations"})]}),i.jsx("div",{className:"s-feature-grid",children:s.map((r,a)=>i.jsxs("div",{className:"s-feature-card s-spotlight",children:[i.jsx("div",{className:"s-feature-card__icon",children:r.icon}),i.jsx("h3",{className:"s-feature-card__title",children:r.title}),i.jsx("p",{className:"s-feature-card__desc",children:r.desc})]},a))})]})}),i.jsx("section",{id:"manifesto",className:"s-draw",children:i.jsxs("div",{className:"s-draw__inner",children:[i.jsxs("div",{children:[i.jsx("span",{className:"s-overline",children:"OUR MANIFESTO"}),i.jsxs("h2",{className:"s-draw__h2",children:["Engineering Velocity. ",i.jsx("br",{}),i.jsx("span",{className:"s-draw__h2-em",children:"AI Precision."})]}),i.jsx("p",{className:"s-draw__lede",children:"We believe operations should be continuous, automated, and effortless. SycnOps bridges human developer strategy with autonomous execution."}),i.jsxs("ul",{className:"s-draw__deflist",children:[i.jsxs("li",{className:"s-draw__defrow",children:[i.jsx("span",{className:"s-draw__deflabel",children:"01_EXEC"}),i.jsx("span",{className:"s-draw__defdesc",children:"Sub-second telemetry & automated build triggers"}),i.jsx("span",{className:"s-draw__defval",children:"99.99% UPTIME"})]}),i.jsxs("li",{className:"s-draw__defrow",children:[i.jsx("span",{className:"s-draw__deflabel",children:"02_SYNC"}),i.jsx("span",{className:"s-draw__defdesc",children:"Real-time GitHub repository & PR synchronization"}),i.jsx("span",{className:"s-draw__defval",children:"LIVE"})]}),i.jsxs("li",{className:"s-draw__defrow",children:[i.jsx("span",{className:"s-draw__deflabel",children:"03_SECU"}),i.jsx("span",{className:"s-draw__defdesc",children:"Granular auth, token security & encrypted storage"}),i.jsx("span",{className:"s-draw__defval",children:"ENCRYPTED"})]})]})]}),i.jsxs("div",{className:"s-draw__svg-wrap s-spotlight",children:[i.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"20px"},children:[i.jsx("span",{style:{fontFamily:"var(--font-tech)",fontSize:"10px",color:"#10B981",letterSpacing:"0.2em"},children:"ARCHITECTURE_SPEC"}),i.jsx("span",{className:"s-pulse-dot"})]}),i.jsxs("div",{style:{fontFamily:"var(--font-mono)",fontSize:"12px",color:"rgba(255,255,255,0.7)",lineHeight:1.8},children:[i.jsxs("div",{children:[i.jsx("span",{style:{color:"#10B981"},children:"const"})," ops = ",i.jsx("span",{style:{color:"#38BDF8"},children:"new"})," SycnOpsEngine(","{"]}),i.jsxs("div",{style:{paddingLeft:"16px"},children:["cluster: ",i.jsx("span",{style:{color:"#F59E0B"},children:"'Production'"}),","]}),i.jsxs("div",{style:{paddingLeft:"16px"},children:["aiAssistant: ",i.jsx("span",{style:{color:"#38BDF8"},children:"true"}),","]}),i.jsxs("div",{style:{paddingLeft:"16px"},children:["telemetry: ",i.jsx("span",{style:{color:"#F59E0B"},children:"'Real-time'"})]}),i.jsxs("div",{children:["}",");"]}),i.jsx("div",{style:{marginTop:"12px",color:"#10B981"},children:"await ops.deployWorkflow(); // Success ⚡"})]})]})]})}),i.jsx("section",{id:"pricing",style:{position:"relative",zIndex:10,padding:"100px var(--pad-x)",background:"#050505",borderTop:"1px solid rgba(255,255,255,0.06)"},children:i.jsxs("div",{className:"s-inner",children:[i.jsxs("div",{style:{textAlign:"center",marginBottom:"64px"},children:[i.jsx("span",{className:"s-overline",children:"PRICING TIERS"}),i.jsx("h2",{style:{fontFamily:"var(--font-serif)",fontSize:"clamp(32px, 4vw, 54px)",fontWeight:300,color:"#ffffff",letterSpacing:"-0.02em"},children:"Transparent Plans for Every Scale"})]}),i.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:"32px"},children:n.map((r,a)=>i.jsxs("div",{className:r.popular?"s-feature-card s-spotlight":"s-panel",style:{padding:"40px",borderRadius:"24px",background:"rgba(255,255,255,0.02)",border:r.popular?"1px solid rgba(16, 185, 129, 0.4)":"1px solid rgba(255,255,255,0.08)",position:"relative"},children:[r.popular&&i.jsx("span",{style:{position:"absolute",top:"20px",right:"20px",fontFamily:"var(--font-tech)",fontSize:"9px",color:"#10B981",background:"rgba(16,185,129,0.12)",border:"1px solid rgba(16,185,129,0.3)",padding:"4px 10px",borderRadius:"999px",letterSpacing:"0.15em",textTransform:"uppercase"},children:"MOST POPULAR"}),i.jsx("h3",{style:{fontFamily:"var(--font-serif)",fontSize:"24px",color:"#ffffff",marginBottom:"8px"},children:r.name}),i.jsx("p",{style:{fontFamily:"var(--font-sans)",fontSize:"13px",color:"rgba(255,255,255,0.5)",marginBottom:"24px",minHeight:"38px"},children:r.desc}),i.jsxs("div",{style:{display:"flex",alignItems:"baseline",gap:"4px",marginBottom:"32px"},children:[i.jsx("span",{style:{fontFamily:"var(--font-serif)",fontSize:"42px",fontWeight:300,color:"#ffffff"},children:r.price}),i.jsx("span",{style:{fontFamily:"var(--font-tech)",fontSize:"12px",color:"rgba(255,255,255,0.4)"},children:r.period})]}),i.jsx("ul",{style:{listStyle:"none",padding:0,margin:"0 0 32px 0"},children:r.features.map((o,l)=>i.jsxs("li",{style:{display:"flex",alignItems:"center",gap:"10px",fontSize:"13px",color:"rgba(255,255,255,0.7)",marginBottom:"12px"},children:[i.jsx(He,{className:"w-4 h-4 text-emerald-400"}),o]},l))}),i.jsx(L,{to:"/register",className:r.popular?"s-btn-white-pill":"s-btn-dark-pill",style:{width:"100%",justifyContent:"center"},children:r.cta})]},a))})]})}),i.jsx("footer",{id:"changelog",style:{position:"relative",zIndex:10,borderTop:"1px solid rgba(255,255,255,0.08)",padding:"60px var(--pad-x) 40px var(--pad-x)",background:"#050505"},children:i.jsxs("div",{className:"s-inner",style:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"24px"},children:[i.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[i.jsx("span",{className:"s-logo-box",children:i.jsx(ps,{style:{width:"16px",height:"16px",color:"#ffffff"}})}),i.jsxs("span",{style:{fontFamily:"var(--font-serif)",fontSize:"18px",color:"#ffffff"},children:["SycnOps",i.jsx("span",{style:{color:"#10B981"},children:"."})]})]}),i.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",fontFamily:"var(--font-tech)",fontSize:"11px",color:"rgba(255,255,255,0.4)",letterSpacing:"0.1em"},children:[i.jsx("span",{className:"s-pulse-dot"})," ALL SYSTEMS OPERATIONAL"]}),i.jsxs("div",{style:{fontFamily:"var(--font-sans)",fontSize:"12px",color:"rgba(255,255,255,0.4)"},children:["© ",new Date().getFullYear()," SycnOps Inc. All rights reserved."]})]})})]})}const Gi=()=>{};var _s={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const On=function(t){const e=[];let s=0;for(let n=0;n<t.length;n++){let r=t.charCodeAt(n);r<128?e[s++]=r:r<2048?(e[s++]=r>>6|192,e[s++]=r&63|128):(r&64512)===55296&&n+1<t.length&&(t.charCodeAt(n+1)&64512)===56320?(r=65536+((r&1023)<<10)+(t.charCodeAt(++n)&1023),e[s++]=r>>18|240,e[s++]=r>>12&63|128,e[s++]=r>>6&63|128,e[s++]=r&63|128):(e[s++]=r>>12|224,e[s++]=r>>6&63|128,e[s++]=r&63|128)}return e},Ki=function(t){const e=[];let s=0,n=0;for(;s<t.length;){const r=t[s++];if(r<128)e[n++]=String.fromCharCode(r);else if(r>191&&r<224){const a=t[s++];e[n++]=String.fromCharCode((r&31)<<6|a&63)}else if(r>239&&r<365){const a=t[s++],o=t[s++],l=t[s++],c=((r&7)<<18|(a&63)<<12|(o&63)<<6|l&63)-65536;e[n++]=String.fromCharCode(55296+(c>>10)),e[n++]=String.fromCharCode(56320+(c&1023))}else{const a=t[s++],o=t[s++];e[n++]=String.fromCharCode((r&15)<<12|(a&63)<<6|o&63)}}return e.join("")},Pn={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const s=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let r=0;r<t.length;r+=3){const a=t[r],o=r+1<t.length,l=o?t[r+1]:0,c=r+2<t.length,d=c?t[r+2]:0,h=a>>2,p=(a&3)<<4|l>>4;let u=(l&15)<<2|d>>6,f=d&63;c||(f=64,o||(u=64)),n.push(s[h],s[p],s[u],s[f])}return n.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(On(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):Ki(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const s=e?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let r=0;r<t.length;){const a=s[t.charAt(r++)],l=r<t.length?s[t.charAt(r)]:0;++r;const d=r<t.length?s[t.charAt(r)]:64;++r;const p=r<t.length?s[t.charAt(r)]:64;if(++r,a==null||l==null||d==null||p==null)throw new Ji;const u=a<<2|l>>4;if(n.push(u),d!==64){const f=l<<4&240|d>>2;if(n.push(f),p!==64){const g=d<<6&192|p;n.push(g)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class Ji extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Yi=function(t){const e=On(t);return Pn.encodeByteArray(e,!0)},Mn=function(t){return Yi(t).replace(/\./g,"")},Fn=function(t){try{return Pn.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xi(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qi=()=>Xi().__FIREBASE_DEFAULTS__,Zi=()=>{if(typeof process>"u"||typeof _s>"u")return;const t=_s.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},ea=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&Fn(t[1]);return e&&JSON.parse(e)},Kt=()=>{try{return Gi()||Qi()||Zi()||ea()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},ta=t=>{var e,s;return(s=(e=Kt())==null?void 0:e.emulatorHosts)==null?void 0:s[t]},Dn=()=>{var t;return(t=Kt())==null?void 0:t.config},Ln=t=>{var e;return(e=Kt())==null?void 0:e[`_${t}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sa{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,s)=>{this.resolve=e,this.reject=s})}wrapCallback(e){return(s,n)=>{s?this.reject(s):this.resolve(n),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(s):e(s,n))}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function F(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function na(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(F())}function ra(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function ia(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function aa(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function oa(){const t=F();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function zn(){try{return typeof indexedDB=="object"}catch{return!1}}function Bn(){return new Promise((t,e)=>{try{let s=!0;const n="validate-browser-context-for-indexeddb-analytics-module",r=self.indexedDB.open(n);r.onsuccess=()=>{r.result.close(),s||self.indexedDB.deleteDatabase(n),t(!0)},r.onupgradeneeded=()=>{s=!1},r.onerror=()=>{var a;e(((a=r.error)==null?void 0:a.message)||"")}}catch(s){e(s)}})}function la(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ca="FirebaseError";class oe extends Error{constructor(e,s,n){super(s),this.code=e,this.customData=n,this.name=ca,Object.setPrototypeOf(this,oe.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ve.prototype.create)}}class ve{constructor(e,s,n){this.service=e,this.serviceName=s,this.errors=n}create(e,...s){const n=s[0]||{},r=`${this.service}/${e}`,a=this.errors[e],o=a?da(a,n):"Error",l=`${this.serviceName}: ${o} (${r}).`;return new oe(r,l,n)}}function da(t,e){try{let s=0,n="";for(;s<t.length;){const r=t.indexOf("{$",s);if(r===-1){n+=t.substring(s);break}const a=t.indexOf("}",r+2);if(a===-1){n+=t.substring(s);break}const o=t.substring(r+2,a),l=e[o];n+=t.substring(s,r)+(l!=null?String(l):`<${o}?>`),s=a+1}return n}catch{return t}}function ha(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function Ie(t,e){if(t===e)return!0;const s=Object.keys(t),n=Object.keys(e);for(const r of s){if(!n.includes(r))return!1;const a=t[r],o=e[r];if(Ss(a)&&Ss(o)){if(!Ie(a,o))return!1}else if(a!==o)return!1}for(const r of n)if(!s.includes(r))return!1;return!0}function Ss(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fe(t){const e=[];for(const[s,n]of Object.entries(t))Array.isArray(n)?n.forEach(r=>{e.push(encodeURIComponent(s)+"="+encodeURIComponent(r))}):e.push(encodeURIComponent(s)+"="+encodeURIComponent(n));return e.length?"&"+e.join("&"):""}function ua(t,e){const s=new pa(t,e);return s.subscribe.bind(s)}class pa{constructor(e,s){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=s,this.task.then(()=>{e(this)}).catch(n=>{this.error(n)})}next(e){this.forEachObserver(s=>{s.next(e)})}error(e){this.forEachObserver(s=>{s.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,s,n){let r;if(e===void 0&&s===void 0&&n===void 0)throw new Error("Missing Observer.");fa(e,["next","error","complete"])?r=e:r={next:e,error:s,complete:n},r.next===void 0&&(r.next=vt),r.error===void 0&&(r.error=vt),r.complete===void 0&&(r.complete=vt);const a=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch{}}),this.observers.push(r),a}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let s=0;s<this.observers.length;s++)this.sendOne(s,e)}sendOne(e,s){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{s(this.observers[e])}catch(n){typeof console<"u"&&console.error&&console.error(n)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function fa(t,e){if(typeof t!="object"||t===null)return!1;for(const s of e)if(s in t&&typeof t[s]=="function")return!0;return!1}function vt(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function le(t){return t&&t._delegate?t._delegate:t}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jt(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function ga(t){return(await fetch(t,{credentials:"include"})).ok}class q{constructor(e,s,n){this.name=e,this.instanceFactory=s,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ue="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ma{constructor(e,s){this.name=e,this.container=s,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const s=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(s)){const n=new sa;if(this.instancesDeferred.set(s,n),this.isInitialized(s)||this.shouldAutoInitialize())try{const r=this.getOrInitializeService({instanceIdentifier:s});r&&n.resolve(r)}catch{}}return this.instancesDeferred.get(s).promise}getImmediate(e){const s=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),n=(e==null?void 0:e.optional)??!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(r){if(n)return null;throw r}else{if(n)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(ya(e))try{this.getOrInitializeService({instanceIdentifier:ue})}catch{}for(const[s,n]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(s);try{const a=this.getOrInitializeService({instanceIdentifier:r});n.resolve(a)}catch{}}}}clearInstance(e=ue){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(s=>"INTERNAL"in s).map(s=>s.INTERNAL.delete()),...e.filter(s=>"_delete"in s).map(s=>s._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=ue){return this.instances.has(e)}getOptions(e=ue){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:s={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:n,options:s});for(const[a,o]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(a);n===l&&o.resolve(r)}return r}onInit(e,s){const n=this.normalizeInstanceIdentifier(s),r=this.onInitCallbacks.get(n)??new Set;r.add(e),this.onInitCallbacks.set(n,r);const a=this.instances.get(n);return a&&e(a,n),()=>{r.delete(e)}}invokeOnInitCallbacks(e,s){const n=this.onInitCallbacks.get(s);if(n)for(const r of n)try{r(e,s)}catch{}}getOrInitializeService({instanceIdentifier:e,options:s={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:xa(e),options:s}),this.instances.set(e,n),this.instancesOptions.set(e,s),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch{}return n||null}normalizeInstanceIdentifier(e=ue){return this.component?this.component.multipleInstances?e:ue:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function xa(t){return t===ue?void 0:t}function ya(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ba{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const s=this.getProvider(e.name);if(s.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);s.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const s=new ma(e,this);return this.providers.set(e,s),s}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var j;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(j||(j={}));const va={debug:j.DEBUG,verbose:j.VERBOSE,info:j.INFO,warn:j.WARN,error:j.ERROR,silent:j.SILENT},wa=j.INFO,_a={[j.DEBUG]:"log",[j.VERBOSE]:"log",[j.INFO]:"info",[j.WARN]:"warn",[j.ERROR]:"error"},Sa=(t,e,...s)=>{if(e<t.logLevel)return;const n=new Date().toISOString(),r=_a[e];if(r)console[r](`[${n}]  ${t.name}:`,...s);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Un{constructor(e){this.name=e,this._logLevel=wa,this._logHandler=Sa,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in j))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?va[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,j.DEBUG,...e),this._logHandler(this,j.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,j.VERBOSE,...e),this._logHandler(this,j.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,j.INFO,...e),this._logHandler(this,j.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,j.WARN,...e),this._logHandler(this,j.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,j.ERROR,...e),this._logHandler(this,j.ERROR,...e)}}const Ia=(t,e)=>e.some(s=>t instanceof s);let Is,Es;function Ea(){return Is||(Is=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Ta(){return Es||(Es=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Wn=new WeakMap,Ft=new WeakMap,$n=new WeakMap,wt=new WeakMap,Yt=new WeakMap;function Ca(t){const e=new Promise((s,n)=>{const r=()=>{t.removeEventListener("success",a),t.removeEventListener("error",o)},a=()=>{s(se(t.result)),r()},o=()=>{n(t.error),r()};t.addEventListener("success",a),t.addEventListener("error",o)});return e.then(s=>{s instanceof IDBCursor&&Wn.set(s,t)}).catch(()=>{}),Yt.set(e,t),e}function ka(t){if(Ft.has(t))return;const e=new Promise((s,n)=>{const r=()=>{t.removeEventListener("complete",a),t.removeEventListener("error",o),t.removeEventListener("abort",o)},a=()=>{s(),r()},o=()=>{n(t.error||new DOMException("AbortError","AbortError")),r()};t.addEventListener("complete",a),t.addEventListener("error",o),t.addEventListener("abort",o)});Ft.set(t,e)}let Dt={get(t,e,s){if(t instanceof IDBTransaction){if(e==="done")return Ft.get(t);if(e==="objectStoreNames")return t.objectStoreNames||$n.get(t);if(e==="store")return s.objectStoreNames[1]?void 0:s.objectStore(s.objectStoreNames[0])}return se(t[e])},set(t,e,s){return t[e]=s,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function ja(t){Dt=t(Dt)}function Aa(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...s){const n=t.call(_t(this),e,...s);return $n.set(n,e.sort?e.sort():[e]),se(n)}:Ta().includes(t)?function(...e){return t.apply(_t(this),e),se(Wn.get(this))}:function(...e){return se(t.apply(_t(this),e))}}function Na(t){return typeof t=="function"?Aa(t):(t instanceof IDBTransaction&&ka(t),Ia(t,Ea())?new Proxy(t,Dt):t)}function se(t){if(t instanceof IDBRequest)return Ca(t);if(wt.has(t))return wt.get(t);const e=Na(t);return e!==t&&(wt.set(t,e),Yt.set(e,t)),e}const _t=t=>Yt.get(t);function ht(t,e,{blocked:s,upgrade:n,blocking:r,terminated:a}={}){const o=indexedDB.open(t,e),l=se(o);return n&&o.addEventListener("upgradeneeded",c=>{n(se(o.result),c.oldVersion,c.newVersion,se(o.transaction),c)}),s&&o.addEventListener("blocked",c=>s(c.oldVersion,c.newVersion,c)),l.then(c=>{a&&c.addEventListener("close",()=>a()),r&&c.addEventListener("versionchange",d=>r(d.oldVersion,d.newVersion,d))}).catch(()=>{}),l}function Ve(t,{blocked:e}={}){const s=indexedDB.deleteDatabase(t);return e&&s.addEventListener("blocked",n=>e(n.oldVersion,n)),se(s).then(()=>{})}const Ra=["get","getKey","getAll","getAllKeys","count"],Oa=["put","add","delete","clear"],St=new Map;function Ts(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(St.get(e))return St.get(e);const s=e.replace(/FromIndex$/,""),n=e!==s,r=Oa.includes(s);if(!(s in(n?IDBIndex:IDBObjectStore).prototype)||!(r||Ra.includes(s)))return;const a=async function(o,...l){const c=this.transaction(o,r?"readwrite":"readonly");let d=c.store;return n&&(d=d.index(l.shift())),(await Promise.all([d[s](...l),r&&c.done]))[0]};return St.set(e,a),a}ja(t=>({...t,get:(e,s,n)=>Ts(e,s)||t.get(e,s,n),has:(e,s)=>!!Ts(e,s)||t.has(e,s)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pa{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(s=>{if(Ma(s)){const n=s.getImmediate();return`${n.library}/${n.version}`}else return null}).filter(s=>s).join(" ")}}function Ma(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Lt="@firebase/app",Cs="0.16.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const re=new Un("@firebase/app"),Fa="@firebase/app-compat",Da="@firebase/analytics-compat",La="@firebase/analytics",za="@firebase/app-check-compat",Ba="@firebase/app-check",Ua="@firebase/auth",Wa="@firebase/auth-compat",$a="@firebase/database",Ha="@firebase/data-connect",Va="@firebase/database-compat",qa="@firebase/functions",Ga="@firebase/functions-compat",Ka="@firebase/installations",Ja="@firebase/installations-compat",Ya="@firebase/messaging",Xa="@firebase/messaging-compat",Qa="@firebase/performance",Za="@firebase/performance-compat",eo="@firebase/remote-config",to="@firebase/remote-config-compat",so="@firebase/storage",no="@firebase/storage-compat",ro="@firebase/firestore",io="@firebase/ai",ao="@firebase/firestore-compat",oo="firebase",lo="12.17.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zt="[DEFAULT]",co={[Lt]:"fire-core",[Fa]:"fire-core-compat",[La]:"fire-analytics",[Da]:"fire-analytics-compat",[Ba]:"fire-app-check",[za]:"fire-app-check-compat",[Ua]:"fire-auth",[Wa]:"fire-auth-compat",[$a]:"fire-rtdb",[Ha]:"fire-data-connect",[Va]:"fire-rtdb-compat",[qa]:"fire-fn",[Ga]:"fire-fn-compat",[Ka]:"fire-iid",[Ja]:"fire-iid-compat",[Ya]:"fire-fcm",[Xa]:"fire-fcm-compat",[Qa]:"fire-perf",[Za]:"fire-perf-compat",[eo]:"fire-rc",[to]:"fire-rc-compat",[so]:"fire-gcs",[no]:"fire-gcs-compat",[ro]:"fire-fst",[ao]:"fire-fst-compat",[io]:"fire-vertex","fire-js":"fire-js",[oo]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ye=new Map,ho=new Map,Bt=new Map;function ks(t,e){try{t.container.addComponent(e)}catch(s){re.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,s)}}function ie(t){const e=t.name;if(Bt.has(e))return re.debug(`There were multiple attempts to register component ${e}.`),!1;Bt.set(e,t);for(const s of Ye.values())ks(s,t);for(const s of ho.values())ks(s,t);return!0}function De(t,e){const s=t.container.getProvider("heartbeat").getImmediate({optional:!0});return s&&s.triggerHeartbeat(),t.container.getProvider(e)}function $(t){return t==null?!1:t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uo={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Z=new ve("app","Firebase",uo);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class po{constructor(e,s,n){this._isDeleted=!1,this._options={...e},this._config={...s},this._name=s.name,this._automaticDataCollectionEnabled=s.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new q("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Z.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Le=lo;function Hn(t,e={}){let s=t;typeof e!="object"&&(e={name:e});const n={name:zt,automaticDataCollectionEnabled:!0,...e},r=n.name;if(typeof r!="string"||!r)throw Z.create("bad-app-name",{appName:String(r)});if(s||(s=Dn()),!s)throw Z.create("no-options");const a=Ye.get(r);if(a)if(Ie(s,a.options)){if(Ie(n,a.config))return a;throw Z.create("duplicate-app",{appName:r,mismatchedParam:"config",oldValue:JSON.stringify(a.config),newValue:JSON.stringify(n)})}else throw Z.create("duplicate-app",{appName:r,mismatchedParam:"options",oldValue:JSON.stringify(a.options),newValue:JSON.stringify(s)});const o=new ba(r);for(const c of Bt.values())o.addComponent(c);const l=new po(s,n,o);return Ye.set(r,l),l}function Vn(t=zt){const e=Ye.get(t);if(!e&&t===zt&&Dn())return Hn();if(!e)throw Z.create("no-app",{appName:t});return e}function H(t,e,s){let n=co[t]??t;s&&(n+=`-${s}`);const r=n.match(/\s|\//),a=e.match(/\s|\//);if(r||a){const o=[`Unable to register library "${n}" with version "${e}":`];r&&o.push(`library name "${n}" contains illegal characters (whitespace or "/")`),r&&a&&o.push("and"),a&&o.push(`version name "${e}" contains illegal characters (whitespace or "/")`),re.warn(o.join(" "));return}ie(new q(`${n}-version`,()=>({library:n,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fo="firebase-heartbeat-database",go=1,Pe="firebase-heartbeat-store";let It=null;function qn(){return It||(It=ht(fo,go,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(Pe)}catch(s){console.warn(s)}}}}).catch(t=>{throw Z.create("idb-open",{originalErrorMessage:t.message})})),It}async function mo(t){try{const s=(await qn()).transaction(Pe),n=await s.objectStore(Pe).get(Gn(t));return await s.done,n}catch(e){if(e instanceof oe)re.warn(e.message);else{const s=Z.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});re.warn(s.message)}}}async function js(t,e){try{const n=(await qn()).transaction(Pe,"readwrite");await n.objectStore(Pe).put(e,Gn(t)),await n.done}catch(s){if(s instanceof oe)re.warn(s.message);else{const n=Z.create("idb-set",{originalErrorMessage:s==null?void 0:s.message});re.warn(n.message)}}}function Gn(t){return`${t.name}!${t.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xo=1024,yo=30;class bo{constructor(e){this.container=e,this._heartbeatsCache=null;const s=this.container.getProvider("app").getImmediate();this._storage=new wo(s),this._heartbeatsCachePromise=this._storage.read().then(n=>(this._heartbeatsCache=n,n))}async triggerHeartbeat(){var e,s;try{const r=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),a=As();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((s=this._heartbeatsCache)==null?void 0:s.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===a||this._heartbeatsCache.heartbeats.some(o=>o.date===a))return;if(this._heartbeatsCache.heartbeats.push({date:a,agent:r}),this._heartbeatsCache.heartbeats.length>yo){const o=_o(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(n){re.warn(n)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const s=As(),{heartbeatsToSend:n,unsentEntries:r}=vo(this._heartbeatsCache.heartbeats),a=Mn(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=s,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),a}catch(s){return re.warn(s),""}}}function As(){return new Date().toISOString().substring(0,10)}function vo(t,e=xo){const s=[];let n=t.slice();for(const r of t){const a=s.find(o=>o.agent===r.agent);if(a){if(a.dates.push(r.date),Ns(s)>e){a.dates.pop();break}}else if(s.push({agent:r.agent,dates:[r.date]}),Ns(s)>e){s.pop();break}n=n.slice(1)}return{heartbeatsToSend:s,unsentEntries:n}}class wo{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return zn()?Bn().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const s=await mo(this.app);return s!=null&&s.heartbeats?s:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const n=await this.read();return js(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??n.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const n=await this.read();return js(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??n.lastSentHeartbeatDate,heartbeats:[...n.heartbeats,...e.heartbeats]})}else return}}function Ns(t){return Mn(JSON.stringify({version:2,heartbeats:t})).length}function _o(t){if(t.length===0)return-1;let e=0,s=t[0].date;for(let n=1;n<t.length;n++)t[n].date<s&&(s=t[n].date,e=n);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function So(t){ie(new q("platform-logger",e=>new Pa(e),"PRIVATE")),ie(new q("heartbeat",e=>new bo(e),"PRIVATE")),H(Lt,Cs,t),H(Lt,Cs,"esm2020"),H("fire-js","")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */So("");function Kn(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Io=Kn,Jn=new ve("auth","Firebase",Kn());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xe=new Un("@firebase/auth");function Yn(t,...e){Xe.logLevel<=j.WARN&&Xe.warn(`Auth (${Le}): ${t}`,...e)}function qe(t,...e){Xe.logLevel<=j.ERROR&&Xe.error(`Auth (${Le}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function G(t,...e){throw Qt(t,...e)}function W(t,...e){return Qt(t,...e)}function Xt(t,e,s){const n={...Io(),[e]:s};return new ve("auth","Firebase",n).create(e,{appName:t.name})}function ge(t){return Xt(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Eo(t,e,s){const n=s;if(!(e instanceof n))throw n.name!==e.constructor.name&&G(t,"argument-error"),Xt(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Qt(t,...e){if(typeof t!="string"){const s=e[0],n=[...e.slice(1)];return n[0]&&(n[0].appName=t.name),t._errorFactory.create(s,...n)}return Jn.create(t,...e)}function E(t,e,...s){if(!t)throw Qt(e,...s)}function ee(t){const e="INTERNAL ASSERTION FAILED: "+t;throw qe(e),new Error(e)}function ae(t,e){t||ee(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ut(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.href)||""}function To(){return Rs()==="http:"||Rs()==="https:"}function Rs(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Co(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(To()||ia()||"connection"in navigator)?navigator.onLine:!0}function ko(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ze{constructor(e,s){this.shortDelay=e,this.longDelay=s,ae(s>e,"Short delay should be less than long delay!"),this.isMobile=na()||aa()}get(){return Co()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zt(t,e){ae(t.emulator,"Emulator should always be set here");const{url:s}=t.emulator;return e?`${s}${e.startsWith("/")?e.slice(1):e}`:s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xn{static initialize(e,s,n){this.fetchImpl=e,s&&(this.headersImpl=s),n&&(this.responseImpl=n)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;ee("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;ee("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;ee("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jo={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ao=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],No=new ze(3e4,6e4);function es(t,e){return t.tenantId&&!e.tenantId?{...e,tenantId:t.tenantId}:e}async function ke(t,e,s,n,r={}){return Qn(t,r,async()=>{let a={},o={};n&&(e==="GET"?o=n:a={body:JSON.stringify(n)});const l=Fe({...o,key:t.config.apiKey}).slice(1),c=await t._getAdditionalHeaders();c["Content-Type"]="application/json",t.languageCode&&(c["X-Firebase-Locale"]=t.languageCode);const d={method:e,headers:c,...a};return ra()||(d.referrerPolicy="strict-origin-when-cross-origin"),t.emulatorConfig&&Jt(t.emulatorConfig.host)&&(d.credentials="include"),Xn.fetch()(await Zn(t,t.config.apiHost,s,l),d)})}async function Qn(t,e,s){t._canInitEmulator=!1;const n={...jo,...e};try{const r=new Oo(t),a=await Promise.race([s(),r.promise]);r.clearNetworkTimeout();const o=await a.json();if("needConfirmation"in o)throw We(t,"account-exists-with-different-credential",o);if(a.ok&&!("errorMessage"in o))return o;{const l=a.ok?o.errorMessage:o.error.message,[c,d]=l.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw We(t,"credential-already-in-use",o);if(c==="EMAIL_EXISTS")throw We(t,"email-already-in-use",o);if(c==="USER_DISABLED")throw We(t,"user-disabled",o);const h=n[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(d)throw Xt(t,h,d);G(t,h)}}catch(r){if(r instanceof oe)throw r;G(t,"network-request-failed",{message:String(r)})}}async function Ro(t,e,s,n,r={}){const a=await ke(t,e,s,n,r);return"mfaPendingCredential"in a&&G(t,"multi-factor-auth-required",{_serverResponse:a}),a}async function Zn(t,e,s,n){const r=`${e}${s}?${n}`,a=t,o=a.config.emulator?Zt(t.config,r):`${t.config.apiScheme}://${r}`;return Ao.includes(s)&&(await a._persistenceManagerAvailable,a._getPersistenceType()==="COOKIE")?a._getPersistence()._getFinalTarget(o).toString():o}class Oo{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((s,n)=>{this.timer=setTimeout(()=>n(W(this.auth,"network-request-failed")),No.get())})}}function We(t,e,s){const n={appName:t.name};s.email&&(n.email=s.email),s.phoneNumber&&(n.phoneNumber=s.phoneNumber);const r=W(t,e,n);return r.customData._tokenResponse=s,r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Po(t,e){return ke(t,"POST","/v1/accounts:delete",e)}async function Qe(t,e){return ke(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ne(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Mo(t,e=!1){const s=le(t),n=await s.getIdToken(e),r=ts(n);E(r&&r.exp&&r.auth_time&&r.iat,s.auth,"internal-error");const a=typeof r.firebase=="object"?r.firebase:void 0,o=a==null?void 0:a.sign_in_provider;return{claims:r,token:n,authTime:Ne(Et(r.auth_time)),issuedAtTime:Ne(Et(r.iat)),expirationTime:Ne(Et(r.exp)),signInProvider:o||null,signInSecondFactor:(a==null?void 0:a.sign_in_second_factor)||null}}function Et(t){return Number(t)*1e3}function ts(t){const[e,s,n]=t.split(".");if(e===void 0||s===void 0||n===void 0)return qe("JWT malformed, contained fewer than 3 sections"),null;try{const r=Fn(s);return r?JSON.parse(r):(qe("Failed to decode base64 JWT payload"),null)}catch(r){return qe("Caught error parsing JWT payload as JSON",r==null?void 0:r.toString()),null}}function Os(t){const e=ts(t);return E(e,"internal-error"),E(typeof e.exp<"u","internal-error"),E(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Me(t,e,s=!1){if(s)return e;try{return await e}catch(n){throw n instanceof oe&&Fo(n)&&t.auth.currentUser===t&&await t.auth.signOut(),n}}function Fo({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Do{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const s=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),s}else{this.errorBackoff=3e4;const n=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,n)}}schedule(e=!1){if(!this.isRunning)return;const s=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},s)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wt{constructor(e,s){this.createdAt=e,this.lastLoginAt=s,this._initializeTime()}_initializeTime(){this.lastSignInTime=Ne(this.lastLoginAt),this.creationTime=Ne(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ze(t){var p;const e=t.auth,s=await t.getIdToken(),n=await Me(t,Qe(e,{idToken:s}));E(n==null?void 0:n.users.length,e,"internal-error");const r=n.users[0];t._notifyReloadListener(r);const a=(p=r.providerUserInfo)!=null&&p.length?er(r.providerUserInfo):[],o=zo(t.providerData,a),l=t.isAnonymous,c=!(t.email&&r.passwordHash)&&!(o!=null&&o.length),d=l?c:!1,h={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:o,metadata:new Wt(r.createdAt,r.lastLoginAt),isAnonymous:d};Object.assign(t,h)}async function Lo(t){const e=le(t);await Ze(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function zo(t,e){return[...t.filter(n=>!e.some(r=>r.providerId===n.providerId)),...e]}function er(t){return t.map(({providerId:e,...s})=>({providerId:e,uid:s.rawId||"",displayName:s.displayName||null,email:s.email||null,phoneNumber:s.phoneNumber||null,photoURL:s.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Bo(t,e){const s=await Qn(t,{},async()=>{const n=Fe({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:r,apiKey:a}=t.config,o=await Zn(t,r,"/v1/token",`key=${a}`),l=await t._getAdditionalHeaders();l["Content-Type"]="application/x-www-form-urlencoded";const c={method:"POST",headers:l,body:n};return t.emulatorConfig&&Jt(t.emulatorConfig.host)&&(c.credentials="include"),Xn.fetch()(o,c)});return{accessToken:s.access_token,expiresIn:s.expires_in,refreshToken:s.refresh_token}}async function Uo(t,e){return ke(t,"POST","/v2/accounts:revokeToken",es(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class we{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){E(e.idToken,"internal-error"),E(typeof e.idToken<"u","internal-error"),E(typeof e.refreshToken<"u","internal-error");const s="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Os(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,s)}updateFromIdToken(e){E(e.length!==0,"internal-error");const s=Os(e);this.updateTokensAndExpiration(e,null,s)}async getToken(e,s=!1){return!s&&this.accessToken&&!this.isExpired?this.accessToken:(E(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,s){const{accessToken:n,refreshToken:r,expiresIn:a}=await Bo(e,s);this.updateTokensAndExpiration(n,r,Number(a))}updateTokensAndExpiration(e,s,n){this.refreshToken=s||null,this.accessToken=e||null,this.expirationTime=Date.now()+n*1e3}static fromJSON(e,s){const{refreshToken:n,accessToken:r,expirationTime:a}=s,o=new we;return n&&(E(typeof n=="string","internal-error",{appName:e}),o.refreshToken=n),r&&(E(typeof r=="string","internal-error",{appName:e}),o.accessToken=r),a&&(E(typeof a=="number","internal-error",{appName:e}),o.expirationTime=a),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new we,this.toJSON())}_performRefresh(){return ee("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ce(t,e){E(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class B{constructor({uid:e,auth:s,stsTokenManager:n,...r}){this.providerId="firebase",this.proactiveRefresh=new Do(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=s,this.stsTokenManager=n,this.accessToken=n.accessToken,this.displayName=r.displayName||null,this.email=r.email||null,this.emailVerified=r.emailVerified||!1,this.phoneNumber=r.phoneNumber||null,this.photoURL=r.photoURL||null,this.isAnonymous=r.isAnonymous||!1,this.tenantId=r.tenantId||null,this.providerData=r.providerData?[...r.providerData]:[],this.metadata=new Wt(r.createdAt||void 0,r.lastLoginAt||void 0)}async getIdToken(e){const s=await Me(this,this.stsTokenManager.getToken(this.auth,e));return E(s,this.auth,"internal-error"),this.accessToken!==s&&(this.accessToken=s,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),s}getIdTokenResult(e){return Mo(this,e)}reload(){return Lo(this)}_assign(e){this!==e&&(E(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(s=>({...s})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const s=new B({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return s.metadata._copy(this.metadata),s}_onReload(e){E(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,s=!1){let n=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),n=!0),s&&await Ze(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if($(this.auth.app))return Promise.reject(ge(this.auth));const e=await this.getIdToken();return await Me(this,Po(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,s){const n=s.displayName??void 0,r=s.email??void 0,a=s.phoneNumber??void 0,o=s.photoURL??void 0,l=s.tenantId??void 0,c=s._redirectEventId??void 0,d=s.createdAt??void 0,h=s.lastLoginAt??void 0,{uid:p,emailVerified:u,isAnonymous:f,providerData:g,stsTokenManager:m}=s;E(p&&m,e,"internal-error");const y=we.fromJSON(this.name,m);E(typeof p=="string",e,"internal-error"),ce(n,e.name),ce(r,e.name),E(typeof u=="boolean",e,"internal-error"),E(typeof f=="boolean",e,"internal-error"),ce(a,e.name),ce(o,e.name),ce(l,e.name),ce(c,e.name),ce(d,e.name),ce(h,e.name);const x=new B({uid:p,auth:e,email:r,emailVerified:u,displayName:n,isAnonymous:f,photoURL:o,phoneNumber:a,tenantId:l,stsTokenManager:y,createdAt:d,lastLoginAt:h});return g&&Array.isArray(g)&&(x.providerData=g.map(b=>({...b}))),c&&(x._redirectEventId=c),x}static async _fromIdTokenResponse(e,s,n=!1){const r=new we;r.updateFromServerResponse(s);const a=new B({uid:s.localId,auth:e,stsTokenManager:r,isAnonymous:n});return await Ze(a),a}static async _fromGetAccountInfoResponse(e,s,n){const r=s.users[0];E(r.localId!==void 0,"internal-error");const a=r.providerUserInfo!==void 0?er(r.providerUserInfo):[],o=!(r.email&&r.passwordHash)&&!(a!=null&&a.length),l=new we;l.updateFromIdToken(n);const c=new B({uid:r.localId,auth:e,stsTokenManager:l,isAnonymous:o}),d={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:a,metadata:new Wt(r.createdAt,r.lastLoginAt),isAnonymous:!(r.email&&r.passwordHash)&&!(a!=null&&a.length)};return Object.assign(c,d),c}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ps=new Map;function te(t){ae(t instanceof Function,"Expected a class definition");let e=Ps.get(t);return e?(ae(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,Ps.set(t,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tr{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,s){this.storage[e]=s}async _get(e){const s=this.storage[e];return s===void 0?null:s}async _remove(e){delete this.storage[e]}_addListener(e,s){}_removeListener(e,s){}}tr.type="NONE";const Ms=tr;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ge(t,e,s){return`firebase:${t}:${e}:${s}`}class _e{constructor(e,s,n){this.persistence=e,this.auth=s,this.userKey=n;const{config:r,name:a}=this.auth;this.fullUserKey=Ge(this.userKey,r.apiKey,a),this.fullPersistenceKey=Ge("persistence",r.apiKey,a),this.boundEventHandler=s._onStorageEvent.bind(s),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const s=await Qe(this.auth,{idToken:e}).catch(()=>{});return s?B._fromGetAccountInfoResponse(this.auth,s,e):null}return B._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const s=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,s)return this.setCurrentUser(s)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,s,n="authUser"){if(!s.length)return new _e(te(Ms),e,n);const r=(await Promise.all(s.map(async d=>{if(await d._isAvailable())return d}))).filter(d=>d);let a=r[0]||te(Ms);const o=Ge(n,e.config.apiKey,e.name);let l=null;for(const d of s)try{const h=await d._get(o);if(h){let p;if(typeof h=="string"){const u=await Qe(e,{idToken:h}).catch(()=>{});if(!u)break;p=await B._fromGetAccountInfoResponse(e,u,h)}else p=B._fromJSON(e,h);d!==a&&(l=p),a=d;break}}catch{}const c=r.filter(d=>d._shouldAllowMigration);return!a._shouldAllowMigration||!c.length?new _e(a,e,n):(a=c[0],l&&await a._set(o,l.toJSON()),await Promise.all(s.map(async d=>{if(d!==a)try{await d._remove(o)}catch{}})),new _e(a,e,n))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fs(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(ir(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(sr(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(or(e))return"Blackberry";if(lr(e))return"Webos";if(nr(e))return"Safari";if((e.includes("chrome/")||rr(e))&&!e.includes("edge/"))return"Chrome";if(ar(e))return"Android";{const s=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=t.match(s);if((n==null?void 0:n.length)===2)return n[1]}return"Other"}function sr(t=F()){return/firefox\//i.test(t)}function nr(t=F()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function rr(t=F()){return/crios\//i.test(t)}function ir(t=F()){return/iemobile/i.test(t)}function ar(t=F()){return/android/i.test(t)}function or(t=F()){return/blackberry/i.test(t)}function lr(t=F()){return/webos/i.test(t)}function ss(t=F()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function Wo(t=F()){var e;return ss(t)&&!!((e=window.navigator)!=null&&e.standalone)}function $o(){return oa()&&document.documentMode===10}function cr(t=F()){return ss(t)||ar(t)||lr(t)||or(t)||/windows phone/i.test(t)||ir(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dr(t,e=[]){let s;switch(t){case"Browser":s=Fs(F());break;case"Worker":s=`${Fs(F())}-${t}`;break;default:s=t}const n=e.length?e.join(","):"FirebaseCore-web";return`${s}/JsCore/${Le}/${n}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ho{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,s){const n=a=>new Promise((o,l)=>{try{const c=e(a);o(c)}catch(c){l(c)}});n.onAbort=s,this.queue.push(n);const r=this.queue.length-1;return()=>{this.queue[r]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const s=[];try{for(const n of this.queue)await n(e),n.onAbort&&s.push(n.onAbort)}catch(n){s.reverse();for(const r of s)try{r()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:n==null?void 0:n.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Vo(t,e={}){return ke(t,"GET","/v2/passwordPolicy",es(t,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qo=6;class Go{constructor(e){var n;const s=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=s.minPasswordLength??qo,s.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=s.maxPasswordLength),s.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=s.containsLowercaseCharacter),s.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=s.containsUppercaseCharacter),s.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=s.containsNumericCharacter),s.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=s.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((n=e.allowedNonAlphanumericCharacters)==null?void 0:n.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const s={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,s),this.validatePasswordCharacterOptions(e,s),s.isValid&&(s.isValid=s.meetsMinPasswordLength??!0),s.isValid&&(s.isValid=s.meetsMaxPasswordLength??!0),s.isValid&&(s.isValid=s.containsLowercaseLetter??!0),s.isValid&&(s.isValid=s.containsUppercaseLetter??!0),s.isValid&&(s.isValid=s.containsNumericCharacter??!0),s.isValid&&(s.isValid=s.containsNonAlphanumericCharacter??!0),s}validatePasswordLengthOptions(e,s){const n=this.customStrengthOptions.minPasswordLength,r=this.customStrengthOptions.maxPasswordLength;n&&(s.meetsMinPasswordLength=e.length>=n),r&&(s.meetsMaxPasswordLength=e.length<=r)}validatePasswordCharacterOptions(e,s){this.updatePasswordCharacterOptionsStatuses(s,!1,!1,!1,!1);let n;for(let r=0;r<e.length;r++)n=e.charAt(r),this.updatePasswordCharacterOptionsStatuses(s,n>="a"&&n<="z",n>="A"&&n<="Z",n>="0"&&n<="9",this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(e,s,n,r,a){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=s)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=n)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=r)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=a))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ko{constructor(e,s,n,r){this.app=e,this.heartbeatServiceProvider=s,this.appCheckServiceProvider=n,this.config=r,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Ds(this),this.idTokenSubscription=new Ds(this),this.beforeStateQueue=new Ho(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Jn,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=r.sdkClientVersion,this._persistenceManagerAvailable=new Promise(a=>this._resolvePersistenceManagerAvailable=a)}_initializeWithPersistence(e,s){return s&&(this._popupRedirectResolver=te(s)),this._initializationPromise=this.queue(async()=>{var n,r,a;if(!this._deleted&&(this.persistenceManager=await _e.create(this,e),(n=this._resolvePersistenceManagerAvailable)==null||n.call(this),!this._deleted)){if((r=this._popupRedirectResolver)!=null&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(s),this.lastNotifiedUid=((a=this.currentUser)==null?void 0:a.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const s=await Qe(this,{idToken:e}),n=await B._fromGetAccountInfoResponse(this,s,e);await this.directlySetCurrentUser(n)}catch(s){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",s),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var a;if($(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(l,l))}):this.directlySetCurrentUser(null)}const s=await this.assertedPersistence.getCurrentUser();let n=s,r=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(a=this.redirectUser)==null?void 0:a._redirectEventId,l=n==null?void 0:n._redirectEventId,c=await this.tryRedirectSignIn(e);(!o||o===l)&&(c!=null&&c.user)&&(n=c.user,r=!0)}if(!n)return this.directlySetCurrentUser(null);if(!n._redirectEventId){if(r)try{await this.beforeStateQueue.runMiddleware(n)}catch(o){n=s,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return n?this.reloadAndSetCurrentUserOrClear(n):this.directlySetCurrentUser(null)}return E(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===n._redirectEventId?this.directlySetCurrentUser(n):this.reloadAndSetCurrentUserOrClear(n)}async tryRedirectSignIn(e){let s=null;try{s=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return s}async reloadAndSetCurrentUserOrClear(e){try{await Ze(e)}catch(s){if((s==null?void 0:s.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=ko()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if($(this.app))return Promise.reject(ge(this));const s=e?le(e):null;return s&&E(s.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(s&&s._clone(this))}async _updateCurrentUser(e,s=!1){if(!this._deleted)return e&&E(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),s||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return $(this.app)?Promise.reject(ge(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return $(this.app)?Promise.reject(ge(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(te(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const s=this._getPasswordPolicyInternal();return s.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):s.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Vo(this),s=new Go(e);this.tenantId===null?this._projectPasswordPolicy=s:this._tenantPasswordPolicies[this.tenantId]=s}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new ve("auth","Firebase",e())}onAuthStateChanged(e,s,n){return this.registerStateListener(this.authStateSubscription,e,s,n)}beforeAuthStateChanged(e,s){return this.beforeStateQueue.pushCallback(e,s)}onIdTokenChanged(e,s,n){return this.registerStateListener(this.idTokenSubscription,e,s,n)}authStateReady(){return new Promise((e,s)=>{if(this.currentUser)e();else{const n=this.onAuthStateChanged(()=>{n(),e()},s)}})}async revokeAccessToken(e){if(this.currentUser){const s=await this.currentUser.getIdToken(),n={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:s};this.tenantId!=null&&(n.tenantId=this.tenantId),await Uo(this,n)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,s){const n=await this.getOrInitRedirectPersistenceManager(s);return e===null?n.removeCurrentUser():n.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const s=e&&te(e)||this._popupRedirectResolver;E(s,this,"argument-error"),this.redirectPersistenceManager=await _e.create(this,[te(s._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var s,n;return this._isInitialized&&await this.queue(async()=>{}),((s=this._currentUser)==null?void 0:s._redirectEventId)===e?this._currentUser:((n=this.redirectUser)==null?void 0:n._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var s;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((s=this.currentUser)==null?void 0:s.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,s,n,r){if(this._deleted)return()=>{};const a=typeof s=="function"?s:s.next.bind(s);let o=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(E(l,this,"internal-error"),l.then(()=>{o||a(this.currentUser)}),typeof s=="function"){const c=e.addObserver(s,n,r);return()=>{o=!0,c()}}else{const c=e.addObserver(s);return()=>{o=!0,c()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return E(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=dr(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var r;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const s=await((r=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:r.getHeartbeatsHeader());s&&(e["X-Firebase-Client"]=s);const n=await this._getAppCheckToken();return n&&(e["X-Firebase-AppCheck"]=n),e}async _getAppCheckToken(){var s;if($(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((s=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:s.getToken());return e!=null&&e.error&&Yn(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function ut(t){return le(t)}class Ds{constructor(e){this.auth=e,this.observer=null,this.addObserver=ua(s=>this.observer=s)}get next(){return E(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ns={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Jo(t){ns=t}function Yo(t){return ns.loadJS(t)}function Xo(){return ns.gapiScript}function Qo(t){return`__${t}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zo(t,e){const s=De(t,"auth");if(s.isInitialized()){const r=s.getImmediate(),a=s.getOptions();if(Ie(a,e??{}))return r;G(r,"already-initialized")}return s.initialize({options:e})}function el(t,e){const s=(e==null?void 0:e.persistence)||[],n=(Array.isArray(s)?s:[s]).map(te);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(n,e==null?void 0:e.popupRedirectResolver)}function tl(t,e,s){const n=ut(t);E(/^https?:\/\//.test(e),n,"invalid-emulator-scheme");const r=!1,a=hr(e),{host:o,port:l}=sl(e),c=l===null?"":`:${l}`,d={url:`${a}//${o}${c}/`},h=Object.freeze({host:o,port:l,protocol:a.replace(":",""),options:Object.freeze({disableWarnings:r})});if(!n._canInitEmulator){E(n.config.emulator&&n.emulatorConfig,n,"emulator-config-failed"),E(Ie(d,n.config.emulator)&&Ie(h,n.emulatorConfig),n,"emulator-config-failed");return}n.config.emulator=d,n.emulatorConfig=h,n.settings.appVerificationDisabledForTesting=!0,Jt(o)?ga(`${a}//${o}${c}`):nl()}function hr(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function sl(t){const e=hr(t),s=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!s)return{host:"",port:null};const n=s[2].split("@").pop()||"",r=/^(\[[^\]]+\])(:|$)/.exec(n);if(r){const a=r[1];return{host:a,port:Ls(n.substr(a.length+1))}}else{const[a,o]=n.split(":");return{host:a,port:Ls(o)}}}function Ls(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function nl(){function t(){const e=document.createElement("p"),s=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",s.position="fixed",s.width="100%",s.backgroundColor="#ffffff",s.border=".1em solid #000000",s.color="#b50000",s.bottom="0px",s.left="0px",s.margin="0px",s.zIndex="10000",s.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ur{constructor(e,s){this.providerId=e,this.signInMethod=s}toJSON(){return ee("not implemented")}_getIdTokenResponse(e){return ee("not implemented")}_linkToIdToken(e,s){return ee("not implemented")}_getReauthenticationResolver(e){return ee("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Se(t,e){return Ro(t,"POST","/v1/accounts:signInWithIdp",es(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rl="http://localhost";class me extends ur{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const s=new me(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(s.idToken=e.idToken),e.accessToken&&(s.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(s.nonce=e.nonce),e.pendingToken&&(s.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(s.accessToken=e.oauthToken,s.secret=e.oauthTokenSecret):G("argument-error"),s}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const s=typeof e=="string"?JSON.parse(e):e,{providerId:n,signInMethod:r,...a}=s;if(!n||!r)return null;const o=new me(n,r);return o.idToken=a.idToken||void 0,o.accessToken=a.accessToken||void 0,o.secret=a.secret,o.nonce=a.nonce,o.pendingToken=a.pendingToken||null,o}_getIdTokenResponse(e){const s=this.buildRequest();return Se(e,s)}_linkToIdToken(e,s){const n=this.buildRequest();return n.idToken=s,Se(e,n)}_getReauthenticationResolver(e){const s=this.buildRequest();return s.autoCreate=!1,Se(e,s)}buildRequest(){const e={requestUri:rl,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const s={};this.idToken&&(s.id_token=this.idToken),this.accessToken&&(s.access_token=this.accessToken),this.secret&&(s.oauth_token_secret=this.secret),s.providerId=this.providerId,this.nonce&&!this.pendingToken&&(s.nonce=this.nonce),e.postBody=Fe(s)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rs{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Be extends rs{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class de extends Be{constructor(){super("facebook.com")}static credential(e){return me._fromParams({providerId:de.PROVIDER_ID,signInMethod:de.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return de.credentialFromTaggedObject(e)}static credentialFromError(e){return de.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return de.credential(e.oauthAccessToken)}catch{return null}}}de.FACEBOOK_SIGN_IN_METHOD="facebook.com";de.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class X extends Be{constructor(){super("google.com"),this.addScope("profile")}static credential(e,s){return me._fromParams({providerId:X.PROVIDER_ID,signInMethod:X.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:s})}static credentialFromResult(e){return X.credentialFromTaggedObject(e)}static credentialFromError(e){return X.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:s,oauthAccessToken:n}=e;if(!s&&!n)return null;try{return X.credential(s,n)}catch{return null}}}X.GOOGLE_SIGN_IN_METHOD="google.com";X.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Q extends Be{constructor(){super("github.com")}static credential(e){return me._fromParams({providerId:Q.PROVIDER_ID,signInMethod:Q.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Q.credentialFromTaggedObject(e)}static credentialFromError(e){return Q.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Q.credential(e.oauthAccessToken)}catch{return null}}}Q.GITHUB_SIGN_IN_METHOD="github.com";Q.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class he extends Be{constructor(){super("twitter.com")}static credential(e,s){return me._fromParams({providerId:he.PROVIDER_ID,signInMethod:he.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:s})}static credentialFromResult(e){return he.credentialFromTaggedObject(e)}static credentialFromError(e){return he.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:s,oauthTokenSecret:n}=e;if(!s||!n)return null;try{return he.credential(s,n)}catch{return null}}}he.TWITTER_SIGN_IN_METHOD="twitter.com";he.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ee{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,s,n,r=!1){const a=await B._fromIdTokenResponse(e,n,r),o=zs(n);return new Ee({user:a,providerId:o,_tokenResponse:n,operationType:s})}static async _forOperation(e,s,n){await e._updateTokensIfNecessary(n,!0);const r=zs(n);return new Ee({user:e,providerId:r,_tokenResponse:n,operationType:s})}}function zs(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class et extends oe{constructor(e,s,n,r){super(s.code,s.message),this.operationType=n,this.user=r,Object.setPrototypeOf(this,et.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:s.customData._serverResponse,operationType:n}}static _fromErrorAndOperation(e,s,n,r){return new et(e,s,n,r)}}function pr(t,e,s,n){return(e==="reauthenticate"?s._getReauthenticationResolver(t):s._getIdTokenResponse(t)).catch(a=>{throw a.code==="auth/multi-factor-auth-required"?et._fromErrorAndOperation(t,a,e,n):a})}async function il(t,e,s=!1){const n=await Me(t,e._linkToIdToken(t.auth,await t.getIdToken()),s);return Ee._forOperation(t,"link",n)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function al(t,e,s=!1){const{auth:n}=t;if($(n.app))return Promise.reject(ge(n));const r="reauthenticate";try{const a=await Me(t,pr(n,r,e,t),s);E(a.idToken,n,"internal-error");const o=ts(a.idToken);E(o,n,"internal-error");const{sub:l}=o;return E(t.uid===l,n,"user-mismatch"),Ee._forOperation(t,r,a)}catch(a){throw(a==null?void 0:a.code)==="auth/user-not-found"&&G(n,"user-mismatch"),a}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ol(t,e,s=!1){if($(t.app))return Promise.reject(ge(t));const n="signIn",r=await pr(t,n,e),a=await Ee._fromIdTokenResponse(t,n,r);return s||await t._updateCurrentUser(a.user),a}function ll(t,e,s,n){return le(t).onIdTokenChanged(e,s,n)}function cl(t,e,s){return le(t).beforeAuthStateChanged(e,s)}const tt="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fr{constructor(e,s){this.storageRetriever=e,this.type=s}_isAvailable(){try{return this.storage?(this.storage.setItem(tt,"1"),this.storage.removeItem(tt),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,s){return this.storage.setItem(e,JSON.stringify(s)),Promise.resolve()}_get(e){const s=this.storage.getItem(e);return Promise.resolve(s?JSON.parse(s):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dl=1e3,hl=10;class gr extends fr{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,s)=>this.onStorageEvent(e,s),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=cr(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const s of Object.keys(this.listeners)){const n=this.storage.getItem(s),r=this.localCache[s];n!==r&&e(s,r,n)}}onStorageEvent(e,s=!1){if(!e.key){this.forAllChangedKeys((o,l,c)=>{this.notifyListeners(o,c)});return}const n=e.key;s?this.detachListener():this.stopPolling();const r=()=>{const o=this.storage.getItem(n);!s&&this.localCache[n]===o||this.notifyListeners(n,o)},a=this.storage.getItem(n);$o()&&a!==e.newValue&&e.newValue!==e.oldValue?setTimeout(r,hl):r()}notifyListeners(e,s){this.localCache[e]=s;const n=this.listeners[e];if(n)for(const r of Array.from(n))r(s&&JSON.parse(s))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,s,n)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:s,newValue:n}),!0)})},dl)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,s){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(s)}_removeListener(e,s){this.listeners[e]&&(this.listeners[e].delete(s),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,s){await super._set(e,s),this.localCache[e]=JSON.stringify(s)}async _get(e){const s=await super._get(e);return this.localCache[e]=JSON.stringify(s),s}async _remove(e){await super._remove(e),delete this.localCache[e]}}gr.type="LOCAL";const ul=gr;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mr extends fr{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,s){}_removeListener(e,s){}}mr.type="SESSION";const xr=mr;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pl(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(s){return{fulfilled:!1,reason:s}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pt{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const s=this.receivers.find(r=>r.isListeningto(e));if(s)return s;const n=new pt(e);return this.receivers.push(n),n}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const s=e,{eventId:n,eventType:r,data:a}=s.data,o=this.handlersMap[r];if(!(o!=null&&o.size))return;s.ports[0].postMessage({status:"ack",eventId:n,eventType:r});const l=Array.from(o).map(async d=>d(s.origin,a)),c=await pl(l);s.ports[0].postMessage({status:"done",eventId:n,eventType:r,response:c})}_subscribe(e,s){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(s)}_unsubscribe(e,s){this.handlersMap[e]&&s&&this.handlersMap[e].delete(s),(!s||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}pt.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function is(t="",e=10){let s="";for(let n=0;n<e;n++)s+=Math.floor(Math.random()*10);return t+s}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fl{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,s,n=50){const r=typeof MessageChannel<"u"?new MessageChannel:null;if(!r)throw new Error("connection_unavailable");let a,o;return new Promise((l,c)=>{const d=is("",20);r.port1.start();const h=setTimeout(()=>{c(new Error("unsupported_event"))},n);o={messageChannel:r,onMessage(p){const u=p;if(u.data.eventId===d)switch(u.data.status){case"ack":clearTimeout(h),a=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(a),l(u.data.response);break;default:clearTimeout(h),clearTimeout(a),c(new Error("invalid_response"));break}}},this.handlers.add(o),r.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:d,data:s},[r.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function V(){return window}function gl(t){V().location.href=t}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yr(){return typeof V().WorkerGlobalScope<"u"&&typeof V().importScripts=="function"}async function ml(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function xl(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)==null?void 0:t.controller)||null}function yl(){return yr()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const br="firebaseLocalStorageDb",bl=1,st="firebaseLocalStorage",vr="fbase_key";class Ue{constructor(e){this.request=e}toPromise(){return new Promise((e,s)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{s(this.request.error)})})}}function ft(t,e){return t.transaction([st],e?"readwrite":"readonly").objectStore(st)}function vl(){const t=indexedDB.deleteDatabase(br);return new Ue(t).toPromise()}function wr(){const t=indexedDB.open(br,bl);return new Promise((e,s)=>{t.addEventListener("error",()=>{s(t.error)}),t.addEventListener("upgradeneeded",()=>{const n=t.result;try{n.createObjectStore(st,{keyPath:vr})}catch(r){s(r)}}),t.addEventListener("success",async()=>{const n=t.result;n.objectStoreNames.contains(st)?e(n):(n.close(),await vl(),e(await wr()))})})}async function Bs(t,e,s){const n=ft(t,!0).put({[vr]:e,value:s});return new Ue(n).toPromise()}async function wl(t,e){const s=ft(t,!1).get(e),n=await new Ue(s).toPromise();return n===void 0?null:n.value}function Us(t,e){const s=ft(t,!0).delete(e);return new Ue(s).toPromise()}const _l=800,Sl=3;class _r{registerLifecycleListeners(){typeof window<"u"&&typeof window.addEventListener=="function"&&(window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow)),typeof document<"u"&&typeof document.addEventListener=="function"&&document.addEventListener("visibilitychange",this.onVisibilityChange)}unregisterLifecycleListeners(){typeof window<"u"&&typeof window.removeEventListener=="function"&&(window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow)),typeof document<"u"&&typeof document.removeEventListener=="function"&&document.removeEventListener("visibilitychange",this.onVisibilityChange)}constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.isHiding=!1,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this.onPageHide=()=>{this.isHiding=!0,this.stopPolling(),this.dbPromise&&(this.dbPromise.then(e=>e.close()).catch(()=>{}),this.dbPromise=null)},this.onPageShow=()=>{this.isHiding&&(this.isHiding=!1,Object.keys(this.listeners).length>0&&this.startPolling())},this.onVisibilityChange=()=>{typeof document<"u"&&(document.visibilityState==="hidden"?this.onPageHide():document.visibilityState==="visible"&&this.onPageShow())},this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){if(this.isHiding)throw new Error("Database is closing/hidden");return this.dbPromise?this.dbPromise:(this.dbPromise=wr(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let s=0;for(;;)try{const n=await this._openDb();return await e(n)}catch(n){if(this.isHiding||s++>Sl)throw n;this.dbPromise&&((await this.dbPromise).close(),this.dbPromise=null)}}async initializeServiceWorkerMessaging(){return yr()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=pt._getInstance(yl()),this.receiver._subscribe("keyChanged",async(e,s)=>({keyProcessed:(await this._poll()).includes(s.key)})),this.receiver._subscribe("ping",async(e,s)=>["keyChanged"])}async initializeSender(){var s,n;if(this.activeServiceWorker=await ml(),!this.activeServiceWorker)return;this.sender=new fl(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(s=e[0])!=null&&s.fulfilled&&(n=e[0])!=null&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||xl()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await Bs(e,tt,"1"),await Us(e,tt)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,s){return this._withPendingWrite(async()=>(await this._withRetries(n=>Bs(n,e,s)),this.localCache[e]=s,this.notifyServiceWorker(e)))}async _get(e){const s=await this._withRetries(n=>wl(n,e));return this.localCache[e]=s,s}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(s=>Us(s,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){if(this.isHiding)return[];try{const e=await this._withRetries(r=>{const a=ft(r,!1).getAll();return new Ue(a).toPromise()});if(this.isHiding)return[];if(!e)return[];if(this.pendingWrites!==0)return[];const s=[],n=new Set;if(e.length!==0)for(const{fbase_key:r,value:a}of e)n.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(a)&&(this.notifyListeners(r,a),s.push(r));for(const r of Object.keys(this.localCache))this.localCache[r]&&!n.has(r)&&(this.notifyListeners(r,null),s.push(r));return s}catch(e){return this.isHiding||Yn(`Firebase Auth cross-tab polling failed with error: ${e}`),[]}}notifyListeners(e,s){this.localCache[e]=s;const n=this.listeners[e];if(n)for(const r of Array.from(n))r(s)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),_l)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,s){Object.keys(this.listeners).length===0&&(this.startPolling(),this.registerLifecycleListeners()),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(s)}_removeListener(e,s){this.listeners[e]&&(this.listeners[e].delete(s),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.stopPolling(),this.unregisterLifecycleListeners())}}_r.type="LOCAL";const Il=_r;new ze(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sr(t,e){return e?te(e):(E(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class as extends ur{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Se(e,this._buildIdpRequest())}_linkToIdToken(e,s){return Se(e,this._buildIdpRequest(s))}_getReauthenticationResolver(e){return Se(e,this._buildIdpRequest())}_buildIdpRequest(e){const s={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(s.idToken=e),s}}function El(t){return ol(t.auth,new as(t),t.bypassAuthState)}function Tl(t){const{auth:e,user:s}=t;return E(s,e,"internal-error"),al(s,new as(t),t.bypassAuthState)}async function Cl(t){const{auth:e,user:s}=t;return E(s,e,"internal-error"),il(s,new as(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ir{constructor(e,s,n,r,a=!1){this.auth=e,this.resolver=n,this.user=r,this.bypassAuthState=a,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(s)?s:[s]}execute(){return new Promise(async(e,s)=>{this.pendingPromise={resolve:e,reject:s};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(n){this.reject(n)}})}async onAuthEvent(e){const{urlResponse:s,sessionId:n,postBody:r,tenantId:a,error:o,type:l}=e;if(o){this.reject(o);return}const c={auth:this.auth,requestUri:s,sessionId:n,tenantId:a||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(c))}catch(d){this.reject(d)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return El;case"linkViaPopup":case"linkViaRedirect":return Cl;case"reauthViaPopup":case"reauthViaRedirect":return Tl;default:G(this.auth,"internal-error")}}resolve(e){ae(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){ae(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kl=new ze(2e3,1e4);async function nt(t,e,s){if($(t.app))return Promise.reject(W(t,"operation-not-supported-in-this-environment"));const n=ut(t);Eo(t,e,rs);const r=Sr(n,s);return new pe(n,"signInViaPopup",e,r).executeNotNull()}class pe extends Ir{constructor(e,s,n,r,a){super(e,s,r,a),this.provider=n,this.authWindow=null,this.pollId=null,pe.currentPopupAction&&pe.currentPopupAction.cancel(),pe.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return E(e,this.auth,"internal-error"),e}async onExecution(){ae(this.filter.length===1,"Popup operations only handle one event");const e=is();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(s=>{this.reject(s)}),this.resolver._isIframeWebStorageSupported(this.auth,s=>{s||this.reject(W(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(W(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,pe.currentPopupAction=null}pollUserCancellation(){const e=()=>{var s,n;if((n=(s=this.authWindow)==null?void 0:s.window)!=null&&n.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(W(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,kl.get())};e()}}pe.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jl="pendingRedirect",Ke=new Map;class Al extends Ir{constructor(e,s,n=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],s,void 0,n),this.eventId=null}async execute(){let e=Ke.get(this.auth._key());if(!e){try{const n=await Nl(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(n)}catch(s){e=()=>Promise.reject(s)}Ke.set(this.auth._key(),e)}return this.bypassAuthState||Ke.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const s=await this.auth._redirectUserForId(e.eventId);if(s)return this.user=s,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Nl(t,e){const s=Pl(e),n=Ol(t);if(!await n._isAvailable())return!1;const r=await n._get(s)==="true";return await n._remove(s),r}function Rl(t,e){Ke.set(t._key(),e)}function Ol(t){return te(t._redirectPersistence)}function Pl(t){return Ge(jl,t.config.apiKey,t.name)}async function Ml(t,e,s=!1){if($(t.app))return Promise.reject(ge(t));const n=ut(t),r=Sr(n,e),o=await new Al(n,r,s).execute();return o&&!s&&(delete o.user._redirectEventId,await n._persistUserIfCurrent(o.user),await n._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fl=10*60*1e3;class Dl{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let s=!1;return this.consumers.forEach(n=>{this.isEventForConsumer(e,n)&&(s=!0,this.sendToConsumer(e,n),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Ll(e)||(this.hasHandledPotentialRedirect=!0,s||(this.queuedRedirectEvent=e,s=!0)),s}sendToConsumer(e,s){var n;if(e.error&&!Er(e)){const r=((n=e.error.code)==null?void 0:n.split("auth/")[1])||"internal-error";s.onError(W(this.auth,r))}else s.onAuthEvent(e)}isEventForConsumer(e,s){const n=s.eventId===null||!!e.eventId&&e.eventId===s.eventId;return s.filter.includes(e.type)&&n}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Fl&&this.cachedEventUids.clear(),this.cachedEventUids.has(Ws(e))}saveEventToCache(e){this.cachedEventUids.add(Ws(e)),this.lastProcessedEventTime=Date.now()}}function Ws(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function Er({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Ll(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Er(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function zl(t,e={}){return ke(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bl=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Ul=/^https?/;async function Wl(t){if(t.config.emulator)return;const{authorizedDomains:e}=await zl(t);for(const s of e)try{if($l(s))return}catch{}G(t,"unauthorized-domain")}function $l(t){const e=Ut(),{protocol:s,hostname:n}=new URL(e);if(t.startsWith("chrome-extension://")){const o=new URL(t);return o.hostname===""&&n===""?s==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):s==="chrome-extension:"&&o.hostname===n}if(!Ul.test(s))return!1;if(Bl.test(t))return n===t;const r=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+r+"|"+r+")$","i").test(n)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hl=new ze(3e4,6e4);function $s(){const t=V().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let s=0;s<t.CP.length;s++)t.CP[s]=null}}function Vl(t){return new Promise((e,s)=>{var r,a,o;function n(){$s(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{$s(),s(W(t,"network-request-failed"))},timeout:Hl.get()})}if((a=(r=V().gapi)==null?void 0:r.iframes)!=null&&a.Iframe)e(gapi.iframes.getContext());else if((o=V().gapi)!=null&&o.load)n();else{const l=Qo("iframefcb");return V()[l]=()=>{gapi.load?n():s(W(t,"network-request-failed"))},Yo(`${Xo()}?onload=${l}`).catch(c=>s(c))}}).catch(e=>{throw Je=null,e})}let Je=null;function ql(t){return Je=Je||Vl(t),Je}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gl=new ze(5e3,15e3),Kl="__/auth/iframe",Jl="emulator/auth/iframe",Yl={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Xl=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Ql(t){const e=t.config;E(e.authDomain,t,"auth-domain-config-required");const s=e.emulator?Zt(e,Jl):`https://${t.config.authDomain}/${Kl}`,n={apiKey:e.apiKey,appName:t.name,v:Le},r=Xl.get(t.config.apiHost);r&&(n.eid=r);const a=t._getFrameworks();return a.length&&(n.fw=a.join(",")),`${s}?${Fe(n).slice(1)}`}async function Zl(t){const e=await ql(t),s=V().gapi;return E(s,t,"internal-error"),e.open({where:document.body,url:Ql(t),messageHandlersFilter:s.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Yl,dontclear:!0},n=>new Promise(async(r,a)=>{await n.restyle({setHideOnLeave:!1});const o=W(t,"network-request-failed"),l=V().setTimeout(()=>{a(o)},Gl.get());function c(){V().clearTimeout(l),r(n)}n.ping(c).then(c,()=>{a(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ec={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},tc=500,sc=600,nc="_blank",rc="http://localhost";class Hs{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function ic(t,e,s,n=tc,r=sc){const a=Math.max((window.screen.availHeight-r)/2,0).toString(),o=Math.max((window.screen.availWidth-n)/2,0).toString();let l="";const c={...ec,width:n.toString(),height:r.toString(),top:a,left:o},d=F().toLowerCase();s&&(l=rr(d)?nc:s),sr(d)&&(e=e||rc,c.scrollbars="yes");const h=Object.entries(c).reduce((u,[f,g])=>`${u}${f}=${g},`,"");if(Wo(d)&&l!=="_self")return ac(e||"",l),new Hs(null);const p=window.open(e||"",l,h);E(p,t,"popup-blocked");try{p.focus()}catch{}return new Hs(p)}function ac(t,e){const s=document.createElement("a");s.href=t,s.target=e;const n=document.createEvent("MouseEvent");n.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),s.dispatchEvent(n)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oc="__/auth/handler",lc="emulator/auth/handler",cc=encodeURIComponent("fac");async function Vs(t,e,s,n,r,a){E(t.config.authDomain,t,"auth-domain-config-required"),E(t.config.apiKey,t,"invalid-api-key");const o={apiKey:t.config.apiKey,appName:t.name,authType:s,redirectUrl:n,v:Le,eventId:r};if(e instanceof rs){e.setDefaultLanguage(t.languageCode),o.providerId=e.providerId||"",ha(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[h,p]of Object.entries({}))o[h]=p}if(e instanceof Be){const h=e.getScopes().filter(p=>p!=="");h.length>0&&(o.scopes=h.join(","))}t.tenantId&&(o.tid=t.tenantId);const l=o;for(const h of Object.keys(l))l[h]===void 0&&delete l[h];const c=await t._getAppCheckToken(),d=c?`#${cc}=${encodeURIComponent(c)}`:"";return`${dc(t)}?${Fe(l).slice(1)}${d}`}function dc({config:t}){return t.emulator?Zt(t,lc):`https://${t.authDomain}/${oc}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tt="webStorageSupport";class hc{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=xr,this._completeRedirectFn=Ml,this._overrideRedirectResult=Rl}async _openPopup(e,s,n,r){var o;ae((o=this.eventManagers[e._key()])==null?void 0:o.manager,"_initialize() not called before _openPopup()");const a=await Vs(e,s,n,Ut(),r);return ic(e,a,is())}async _openRedirect(e,s,n,r){await this._originValidation(e);const a=await Vs(e,s,n,Ut(),r);return gl(a),new Promise(()=>{})}_initialize(e){const s=e._key();if(this.eventManagers[s]){const{manager:r,promise:a}=this.eventManagers[s];return r?Promise.resolve(r):(ae(a,"If manager is not set, promise should be"),a)}const n=this.initAndGetManager(e);return this.eventManagers[s]={promise:n},n.catch(()=>{delete this.eventManagers[s]}),n}async initAndGetManager(e){const s=await Zl(e),n=new Dl(e);return s.register("authEvent",r=>(E(r==null?void 0:r.authEvent,e,"invalid-auth-event"),{status:n.onEvent(r.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:n},this.iframes[e._key()]=s,n}_isIframeWebStorageSupported(e,s){this.iframes[e._key()].send(Tt,{type:Tt},r=>{var o;const a=(o=r==null?void 0:r[0])==null?void 0:o[Tt];a!==void 0&&s(!!a),G(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const s=e._key();return this.originValidationPromises[s]||(this.originValidationPromises[s]=Wl(e)),this.originValidationPromises[s]}get _shouldInitProactively(){return cr()||nr()||ss()}}const uc=hc;var qs="@firebase/auth",Gs="1.13.4";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pc{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const s=this.auth.onIdTokenChanged(n=>{e((n==null?void 0:n.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,s),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const s=this.internalListeners.get(e);s&&(this.internalListeners.delete(e),s(),this.updateProactiveRefresh())}assertAuthConfigured(){E(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fc(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function gc(t){ie(new q("auth",(e,{options:s})=>{const n=e.getProvider("app").getImmediate(),r=e.getProvider("heartbeat"),a=e.getProvider("app-check-internal"),{apiKey:o,authDomain:l}=n.options;E(o&&!o.includes(":"),"invalid-api-key",{appName:n.name});const c={apiKey:o,authDomain:l,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:dr(t)},d=new Ko(n,r,a,c);return el(d,s),d},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,s,n)=>{e.getProvider("auth-internal").initialize()})),ie(new q("auth-internal",e=>{const s=ut(e.getProvider("auth").getImmediate());return(n=>new pc(n))(s)},"PRIVATE").setInstantiationMode("EXPLICIT")),H(qs,Gs,fc(t)),H(qs,Gs,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mc=5*60,xc=Ln("authIdTokenMaxAge")||mc;let Ks=null;const yc=t=>async e=>{const s=e&&await e.getIdTokenResult(),n=s&&(new Date().getTime()-Date.parse(s.issuedAtTime))/1e3;if(n&&n>xc)return;const r=s==null?void 0:s.token;Ks!==r&&(Ks=r,await fetch(t,{method:r?"POST":"DELETE",headers:r?{Authorization:`Bearer ${r}`}:{}}))};function bc(t=Vn()){const e=De(t,"auth");if(e.isInitialized())return e.getImmediate();const s=Zo(t,{popupRedirectResolver:uc,persistence:[Il,ul,xr]}),n=Ln("authTokenSyncURL");if(n&&typeof isSecureContext=="boolean"&&isSecureContext){const a=new URL(n,location.origin);if(location.origin===a.origin){const o=yc(a.toString());cl(s,o,()=>o(s.currentUser)),ll(s,l=>o(l))}}const r=ta("auth");return r&&tl(s,`http://${r}`),s}function vc(){var t;return((t=document.getElementsByTagName("head"))==null?void 0:t[0])??document}Jo({loadJS(t){return new Promise((e,s)=>{const n=document.createElement("script");n.setAttribute("src",t),n.onload=e,n.onerror=r=>{const a=W("internal-error");a.customData=r,s(a)},n.type="text/javascript",n.charset="UTF-8",vc().appendChild(n)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});gc("Browser");var wc="firebase",_c="12.17.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */H(wc,_c,"app");const Tr="@firebase/installations",os="0.6.23";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cr=1e4,kr=`w:${os}`,jr="FIS_v2",Sc="https://firebaseinstallations.googleapis.com/v1",Ic=60*60*1e3,Ec="installations",Tc="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cc={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},xe=new ve(Ec,Tc,Cc);function Ar(t){return t instanceof oe&&t.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Nr({projectId:t}){return`${Sc}/projects/${t}/installations`}function Rr(t){return{token:t.token,requestStatus:2,expiresIn:jc(t.expiresIn),creationTime:Date.now()}}async function Or(t,e){const n=(await e.json()).error;return xe.create("request-failed",{requestName:t,serverCode:n.code,serverMessage:n.message,serverStatus:n.status})}function Pr({apiKey:t}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":t})}function kc(t,{refreshToken:e}){const s=Pr(t);return s.append("Authorization",Ac(e)),s}async function Mr(t){const e=await t();return e.status>=500&&e.status<600?t():e}function jc(t){return Number(t.replace("s","000"))}function Ac(t){return`${jr} ${t}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Nc({appConfig:t,heartbeatServiceProvider:e},{fid:s}){const n=Nr(t),r=Pr(t),a=e.getImmediate({optional:!0});if(a){const d=await a.getHeartbeatsHeader();d&&r.append("x-firebase-client",d)}const o={fid:s,authVersion:jr,appId:t.appId,sdkVersion:kr},l={method:"POST",headers:r,body:JSON.stringify(o)},c=await Mr(()=>fetch(n,l));if(c.ok){const d=await c.json();return{fid:d.fid||s,registrationStatus:2,refreshToken:d.refreshToken,authToken:Rr(d.authToken)}}else throw await Or("Create Installation",c)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fr(t){return new Promise(e=>{setTimeout(e,t)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rc(t){return btoa(String.fromCharCode(...t)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Oc=/^[cdef][\w-]{21}$/,$t="";function Pc(){try{const t=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(t),t[0]=112+t[0]%16;const s=Mc(t);return Oc.test(s)?s:$t}catch{return $t}}function Mc(t){return Rc(t).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function je(t){return`${t.appName}!${t.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Te=new Map;function Dr(t,e){const s=je(t);Lr(s,e),Lc(s,e)}function Fc(t,e){zr();const s=je(t);let n=Te.get(s);n||(n=new Set,Te.set(s,n)),n.add(e)}function Dc(t,e){const s=je(t),n=Te.get(s);n&&(n.delete(e),n.size===0&&Te.delete(s),Br())}function Lr(t,e){const s=Te.get(t);if(s)for(const n of s)n(e)}function Lc(t,e){const s=zr();s&&s.postMessage({key:t,fid:e}),Br()}let fe=null;function zr(){return!fe&&"BroadcastChannel"in self&&(fe=new BroadcastChannel("[Firebase] FID Change"),fe.onmessage=t=>{Lr(t.data.key,t.data.fid)}),fe}function Br(){Te.size===0&&fe&&(fe.close(),fe=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zc="firebase-installations-database",Bc=1,ye="firebase-installations-store";let Ct=null;function ls(){return Ct||(Ct=ht(zc,Bc,{upgrade:(t,e)=>{switch(e){case 0:t.createObjectStore(ye)}}})),Ct}async function rt(t,e){const s=je(t),r=(await ls()).transaction(ye,"readwrite"),a=r.objectStore(ye),o=await a.get(s);return await a.put(e,s),await r.done,(!o||o.fid!==e.fid)&&Dr(t,e.fid),e}async function Ur(t){const e=je(t),n=(await ls()).transaction(ye,"readwrite");await n.objectStore(ye).delete(e),await n.done}async function gt(t,e){const s=je(t),r=(await ls()).transaction(ye,"readwrite"),a=r.objectStore(ye),o=await a.get(s),l=e(o);return l===void 0?await a.delete(s):await a.put(l,s),await r.done,l&&(!o||o.fid!==l.fid)&&Dr(t,l.fid),l}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function cs(t){let e;const s=await gt(t.appConfig,n=>{const r=Uc(n),a=Wc(t,r);return e=a.registrationPromise,a.installationEntry});return s.fid===$t?{installationEntry:await e}:{installationEntry:s,registrationPromise:e}}function Uc(t){const e=t||{fid:Pc(),registrationStatus:0};return Wr(e)}function Wc(t,e){if(e.registrationStatus===0){if(!navigator.onLine){const r=Promise.reject(xe.create("app-offline"));return{installationEntry:e,registrationPromise:r}}const s={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},n=$c(t,s);return{installationEntry:s,registrationPromise:n}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:Hc(t)}:{installationEntry:e}}async function $c(t,e){try{const s=await Nc(t,e);return rt(t.appConfig,s)}catch(s){throw Ar(s)&&s.customData.serverCode===409?await Ur(t.appConfig):await rt(t.appConfig,{fid:e.fid,registrationStatus:0}),s}}async function Hc(t){let e=await Js(t.appConfig);for(;e.registrationStatus===1;)await Fr(100),e=await Js(t.appConfig);if(e.registrationStatus===0){const{installationEntry:s,registrationPromise:n}=await cs(t);return n||s}return e}function Js(t){return gt(t,e=>{if(!e)throw xe.create("installation-not-found");return Wr(e)})}function Wr(t){return Vc(t)?{fid:t.fid,registrationStatus:0}:t}function Vc(t){return t.registrationStatus===1&&t.registrationTime+Cr<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qc({appConfig:t,heartbeatServiceProvider:e},s){const n=Gc(t,s),r=kc(t,s),a=e.getImmediate({optional:!0});if(a){const d=await a.getHeartbeatsHeader();d&&r.append("x-firebase-client",d)}const o={installation:{sdkVersion:kr,appId:t.appId}},l={method:"POST",headers:r,body:JSON.stringify(o)},c=await Mr(()=>fetch(n,l));if(c.ok){const d=await c.json();return Rr(d)}else throw await Or("Generate Auth Token",c)}function Gc(t,{fid:e}){return`${Nr(t)}/${e}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ds(t,e=!1){let s;const n=await gt(t.appConfig,a=>{if(!$r(a))throw xe.create("not-registered");const o=a.authToken;if(!e&&Yc(o))return a;if(o.requestStatus===1)return s=Kc(t,e),a;{if(!navigator.onLine)throw xe.create("app-offline");const l=Qc(a);return s=Jc(t,l),l}});return s?await s:n.authToken}async function Kc(t,e){let s=await Ys(t.appConfig);for(;s.authToken.requestStatus===1;)await Fr(100),s=await Ys(t.appConfig);const n=s.authToken;return n.requestStatus===0?ds(t,e):n}function Ys(t){return gt(t,e=>{if(!$r(e))throw xe.create("not-registered");const s=e.authToken;return Zc(s)?{...e,authToken:{requestStatus:0}}:e})}async function Jc(t,e){try{const s=await qc(t,e),n={...e,authToken:s};return await rt(t.appConfig,n),s}catch(s){if(Ar(s)&&(s.customData.serverCode===401||s.customData.serverCode===404))await Ur(t.appConfig);else{const n={...e,authToken:{requestStatus:0}};await rt(t.appConfig,n)}throw s}}function $r(t){return t!==void 0&&t.registrationStatus===2}function Yc(t){return t.requestStatus===2&&!Xc(t)}function Xc(t){const e=Date.now();return e<t.creationTime||t.creationTime+t.expiresIn<e+Ic}function Qc(t){const e={requestStatus:1,requestTime:Date.now()};return{...t,authToken:e}}function Zc(t){return t.requestStatus===1&&t.requestTime+Cr<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ed(t){const e=t,{installationEntry:s,registrationPromise:n}=await cs(e);return n?n.catch(console.error):ds(e).catch(console.error),s.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function td(t,e=!1){const s=t;return await sd(s),(await ds(s,e)).token}async function sd(t){const{registrationPromise:e}=await cs(t);e&&await e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nd(t,e){const{appConfig:s}=t;return Fc(s,e),()=>{Dc(s,e)}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rd(t){if(!t||!t.options)throw kt("App Configuration");if(!t.name)throw kt("App Name");const e=["projectId","apiKey","appId"];for(const s of e)if(!t.options[s])throw kt(s);return{appName:t.name,projectId:t.options.projectId,apiKey:t.options.apiKey,appId:t.options.appId}}function kt(t){return xe.create("missing-app-config-values",{valueName:t})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hr="installations",id="installations-internal",ad=t=>{const e=t.getProvider("app").getImmediate(),s=rd(e),n=De(e,"heartbeat");return{app:e,appConfig:s,heartbeatServiceProvider:n,_delete:()=>Promise.resolve()}},od=t=>{const e=t.getProvider("app").getImmediate(),s=De(e,Hr).getImmediate();return{getId:()=>ed(s),getToken:r=>td(s,r)}};function ld(){ie(new q(Hr,ad,"PUBLIC")),ie(new q(id,od,"PRIVATE"))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ld();H(Tr,os);H(Tr,os,"esm2020");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cd="/firebase-messaging-sw.js",dd="/firebase-cloud-messaging-push-scope",Vr="BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4",hd="https://fcmregistrations.googleapis.com/v1",qr="google.c.a.c_id",ud="google.c.a.c_l",pd="google.c.a.ts",fd="google.c.a.e",Xs=1e4;var Qs;(function(t){t[t.DATA_MESSAGE=1]="DATA_MESSAGE",t[t.DISPLAY_NOTIFICATION=3]="DISPLAY_NOTIFICATION"})(Qs||(Qs={}));/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */var Ce;(function(t){t.PUSH_RECEIVED="push-received",t.NOTIFICATION_CLICKED="notification-clicked",t.FID_REGISTERED="fid-registered"})(Ce||(Ce={}));/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function z(t){const e=new Uint8Array(t);return btoa(String.fromCharCode(...e)).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function Gr(t){const e="=".repeat((4-t.length%4)%4),s=(t+e).replace(/\-/g,"+").replace(/_/g,"/"),n=atob(s),r=new Uint8Array(n.length);for(let a=0;a<n.length;++a)r[a]=n.charCodeAt(a);return r}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jt="fcm_token_details_db",gd=5,Zs="fcm_token_object_Store";async function md(t){if("databases"in indexedDB&&!(await indexedDB.databases()).map(a=>a.name).includes(jt))return null;let e=null;return(await ht(jt,gd,{upgrade:async(n,r,a,o)=>{if(r<2||!n.objectStoreNames.contains(Zs))return;const l=o.objectStore(Zs),c=await l.index("fcmSenderId").get(t);if(await l.clear(),!!c){if(r===2){const d=c;if(!d.auth||!d.p256dh||!d.endpoint)return;e={token:d.fcmToken,createTime:d.createTime??Date.now(),subscriptionOptions:{auth:d.auth,p256dh:d.p256dh,endpoint:d.endpoint,swScope:d.swScope,vapidKey:typeof d.vapidKey=="string"?d.vapidKey:z(d.vapidKey)}}}else if(r===3){const d=c;e={token:d.fcmToken,createTime:d.createTime,subscriptionOptions:{auth:z(d.auth),p256dh:z(d.p256dh),endpoint:d.endpoint,swScope:d.swScope,vapidKey:z(d.vapidKey)}}}else if(r===4){const d=c;e={token:d.fcmToken,createTime:d.createTime,subscriptionOptions:{auth:z(d.auth),p256dh:z(d.p256dh),endpoint:d.endpoint,swScope:d.swScope,vapidKey:z(d.vapidKey)}}}}}})).close(),await Ve(jt),await Ve("fcm_vapid_details_db"),await Ve("undefined"),xd(e)?e:null}function xd(t){if(!t||!t.subscriptionOptions)return!1;const{subscriptionOptions:e}=t;return typeof t.createTime=="number"&&t.createTime>0&&typeof t.token=="string"&&t.token.length>0&&typeof e.auth=="string"&&e.auth.length>0&&typeof e.p256dh=="string"&&e.p256dh.length>0&&typeof e.endpoint=="string"&&e.endpoint.length>0&&typeof e.swScope=="string"&&e.swScope.length>0&&typeof e.vapidKey=="string"&&e.vapidKey.length>0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yd={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"only-available-in-window":"This method is available in a Window context.","only-available-in-sw":"This method is available in a service worker context.","permission-default":"The notification permission was not granted and dismissed instead.","permission-blocked":"The notification permission was not granted and blocked instead.","unsupported-browser":"This browser doesn't support the API's required to use the Firebase SDK.","indexed-db-unsupported":"This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)","failed-service-worker-registration":"We are unable to register the default service worker. {$browserErrorMessage}","token-subscribe-failed":"A problem occurred while subscribing the user to FCM: {$errorInfo}","token-subscribe-no-token":"FCM returned no token when subscribing the user to push.","fid-registration-failed":"A problem occurred while creating an FCM registration via FID: {$errorInfo}","fid-unregister-failed":"A problem occurred while unregistering the FCM registration via FID: {$errorInfo}","fid-registration-idb-schema-unavailable":"Unable to read or persist FID registration metadata because the messaging IndexedDB schema is unavailable (for example, the database could not be upgraded to the latest version).","token-unsubscribe-failed":"A problem occurred while unsubscribing the user from FCM: {$errorInfo}","token-update-failed":"A problem occurred while updating the user from FCM: {$errorInfo}","token-update-no-token":"FCM returned no token when updating the user to push.","use-sw-after-get-token":"The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.","invalid-sw-registration":"The input to useServiceWorker() must be a ServiceWorkerRegistration.","invalid-bg-handler":"The input to setBackgroundMessageHandler() must be a function.","invalid-vapid-key":"The public VAPID key must be a string.","use-vapid-key-after-get-token":"The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used.","invalid-on-registered-handler":"No onRegistered callback handler was provided or registered. Implement onRegistered() before register()."},k=new ve("messaging","Messaging",yd);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const en="firebase-messaging-database",tn=2,be="firebase-messaging-store",ne="firebase-messaging-fid-registration-store",bd={openDB:ht,deleteDB:Ve};let sn=bd,Re=null;function vd(t,e,s){switch(e){case 0:if(t.createObjectStore(be),s===1)break;case 1:s===2&&t.createObjectStore(ne)}}function nn(t){return{upgrade:(e,s)=>{vd(e,s,t)},blocked:()=>{},blocking:(e,s,n)=>{var r;Re=null,(r=n.target)==null||r.close()},terminated:()=>{Re=null}}}function mt(){return Re||(Re=sn.openDB(en,tn,nn(2)).catch(()=>sn.openDB(en,tn-1,nn(1)))),Re}function Kr(t,e){return t.objectStoreNames.contains(e)}function Jr(t){if(!Kr(t,ne))throw k.create("fid-registration-idb-schema-unavailable")}async function wd(t){const e=xt(t),n=await(await mt()).transaction(be).objectStore(be).get(e);if(n)return n;{const r=await md(t.appConfig.senderId);if(r)return await hs(t,r),r}}async function hs(t,e){const s=xt(t),n=await mt(),r=[be],a=Kr(n,ne);a&&r.push(ne);const o=n.transaction(r,"readwrite");return await o.objectStore(be).put(e,s),a&&await o.objectStore(ne).delete(s),await o.done,e}async function Yr(t){const e=xt(t),s=await mt();return Jr(s),await s.transaction(ne).objectStore(ne).get(e)}async function _d(t,e){const s=xt(t),n=await mt();Jr(n);const r=n.transaction([be,ne],"readwrite");return await r.objectStore(ne).put(e,s),await r.objectStore(be).delete(s),await r.done,e}function xt({appConfig:t}){return t.appId}const rn="@firebase/messaging",Ht="0.13.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sd=3,Id=1e3;async function Ed(t,e){const s=await bt(t),n=us(e,t.appConfig.appName,!1),r={method:"POST",headers:s,body:JSON.stringify(n)};let a;try{a=await(await fetch(yt(t.appConfig),r)).json()}catch(o){throw k.create("token-subscribe-failed",{errorInfo:o==null?void 0:o.toString()})}if(a.error){const o=a.error.message;throw k.create("token-subscribe-failed",{errorInfo:o})}if(!a.token)throw k.create("token-subscribe-no-token");return a.token}async function Td(t,e){var c;const s=await bt(t),n=us(e,t.appConfig.appName,!0),r={method:"POST",headers:s,body:JSON.stringify(n)};let a;try{a=await Nd(()=>fetch(yt(t.appConfig),r),Sd,Id)}catch(d){throw k.create("fid-registration-failed",{errorInfo:d==null?void 0:d.toString()})}if(a.ok)return{responseFid:await Cd(a)};let o;try{o=await a.json()}catch{throw k.create("fid-registration-failed",{errorInfo:a.statusText})}const l=((c=o.error)==null?void 0:c.message)??a.statusText;throw k.create("fid-registration-failed",{errorInfo:l})}async function Cd(t){const e=await t.text();if(!e.trim())throw k.create("fid-registration-failed",{errorInfo:"CreateRegistration succeeded but response body is empty"});let s;try{s=JSON.parse(e)}catch{throw k.create("fid-registration-failed",{errorInfo:"CreateRegistration succeeded but response body is not valid JSON"})}const n=s.name;if(typeof n!="string"||n.length===0)throw k.create("fid-registration-failed",{errorInfo:"CreateRegistration succeeded but response did not include a non-empty name"});return kd(n)}const an="/registrations/";function kd(t){const e=t.indexOf(an);if(e!==-1){const s=t.slice(e+an.length);if(s.length>0)return s}throw k.create("fid-registration-failed",{errorInfo:"CreateRegistration succeeded but response name is not a valid registration resource name"})}async function jd(t,e){const s=await bt(t),n=us(e.subscriptionOptions,t.appConfig.appName,!1),r={method:"PATCH",headers:s,body:JSON.stringify(n)};let a;try{a=await(await fetch(`${yt(t.appConfig)}/${e.token}`,r)).json()}catch(o){throw k.create("token-update-failed",{errorInfo:o==null?void 0:o.toString()})}if(a.error){const o=a.error.message;throw k.create("token-update-failed",{errorInfo:o})}if(!a.token)throw k.create("token-update-no-token");return a.token}async function Ad(t,e){const n={method:"DELETE",headers:await bt(t)};try{const a=await(await fetch(`${yt(t.appConfig)}/${e}`,n)).json();if(a.error){const o=a.error.message;throw k.create("token-unsubscribe-failed",{errorInfo:o})}}catch(r){throw k.create("token-unsubscribe-failed",{errorInfo:r==null?void 0:r.toString()})}}async function Nd(t,e,s){let n;for(let r=0;r<e;r++)try{return await t()}catch(a){if(n=a,r<e-1){const o=s*Math.pow(2,r);await new Promise(l=>setTimeout(l,o))}}throw n}function yt({projectId:t}){return`${hd}/projects/${t}/registrations`}async function bt({appConfig:t,installations:e}){const s=await e.getToken();return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":t.apiKey,"x-goog-firebase-installations-auth":`FIS ${s}`})}function Rd(t,e){var s,n;try{if(/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(t))return new URL(t).host}catch{}try{if(typeof self<"u"&&((s=self.location)!=null&&s.href))return new URL(t,self.location.origin).host}catch{}return typeof self<"u"&&((n=self.location)!=null&&n.host)?self.location.host:e}function us({p256dh:t,auth:e,endpoint:s,vapidKey:n,swScope:r},a,o){const l={web:{origin:Rd(r,a),endpoint:s,auth:e,p256dh:t}};return o&&(l.fcm_sdk_version=Ht),n!==Vr&&(l.web.applicationPubKey=n),l}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Od=7*24*60*60*1e3;async function Pd(t){const e=await Fd(t.swRegistration,t.vapidKey),s={vapidKey:t.vapidKey,swScope:t.swRegistration.scope,endpoint:e.endpoint,auth:z(e.getKey("auth")),p256dh:z(e.getKey("p256dh"))},n=await wd(t.firebaseDependencies);if(n){if(Dd(n.subscriptionOptions,s))return Date.now()>=n.createTime+Od?Md(t,{token:n.token,createTime:Date.now(),subscriptionOptions:s}):n.token;try{await Ad(t.firebaseDependencies,n.token)}catch(r){console.warn(r)}return on(t.firebaseDependencies,s)}else return on(t.firebaseDependencies,s)}async function Md(t,e){try{const s=await jd(t.firebaseDependencies,e),n={...e,token:s,createTime:Date.now()};return await hs(t.firebaseDependencies,n),s}catch(s){throw s}}async function on(t,e){const n={token:await Ed(t,e),createTime:Date.now(),subscriptionOptions:e};return await hs(t,n),n.token}async function Fd(t,e){const s=await t.pushManager.getSubscription();return s||t.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:Gr(e)})}function Dd(t,e){const s=e.vapidKey===t.vapidKey,n=e.endpoint===t.endpoint,r=e.auth===t.auth,a=e.p256dh===t.p256dh;return s&&n&&r&&a}function Ld(t,e){const s=t.onRegisteredHandler;s&&(typeof s=="function"?s(e):s.next(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function zd(t){try{t.swRegistration=await navigator.serviceWorker.register(cd,{scope:dd}),t.swRegistration.update().catch(()=>{}),await Bd(t.swRegistration)}catch(e){throw k.create("failed-service-worker-registration",{browserErrorMessage:e==null?void 0:e.message})}}async function Bd(t){return new Promise((e,s)=>{const n=setTimeout(()=>s(new Error(`Service worker not registered after ${Xs} ms`)),Xs),r=t.installing||t.waiting;t.active?(clearTimeout(n),e()):r?r.onstatechange=a=>{var o;((o=a.target)==null?void 0:o.state)==="activated"&&(r.onstatechange=null,clearTimeout(n),e())}:(clearTimeout(n),s(new Error("No incoming service worker found.")))})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Xr(t,e){if(!e&&!t.swRegistration&&await zd(t),!(!e&&t.swRegistration)){if(!(e instanceof ServiceWorkerRegistration))throw k.create("invalid-sw-registration");t.swRegistration=e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Qr(t,e){e?t.vapidKey=e:t.vapidKey||(t.vapidKey=Vr)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ln=3;async function Ud(t,e){const s=await Wd(t.swRegistration,t.vapidKey),n={vapidKey:t.vapidKey,swScope:t.swRegistration.scope,endpoint:s.endpoint,auth:z(s.getKey("auth")),p256dh:z(s.getKey("p256dh"))},r=t.firebaseDependencies.installations;for(let a=0;a<ln;a++){const{responseFid:o}=await Td(t.firebaseDependencies,n);if(o===e)return;a<ln-1&&await r.getToken(!0)}throw k.create("fid-registration-failed",{errorInfo:"CreateRegistration response FID does not match Firebase Installation ID"})}async function Wd(t,e){const s=await t.pushManager.getSubscription();return s||t.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:Gr(e)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $d=7*24*60*60*1e3;async function Zr(t,e){if(!navigator)throw k.create("only-available-in-window");if(Notification.permission==="default"&&await Notification.requestPermission(),Notification.permission!=="granted")throw k.create("permission-blocked");if(!t.onRegisteredHandler)throw k.create("invalid-on-registered-handler");await Qr(t,e==null?void 0:e.vapidKey),await Xr(t,e==null?void 0:e.serviceWorkerRegistration);const s=t._registerNotifyChain.catch(()=>{});return t._registerNotifyChain=s.then(async()=>{const n=await t.firebaseDependencies.installations.getId(),r=await Yr(t.firebaseDependencies),a=Date.now();if((!r||r.fid!==n||a>=r.lastRegisterTime+$d)&&(await Ud(t,n),await _d(t.firebaseDependencies,{fid:n,lastRegisterTime:a,vapidKey:t.vapidKey})),!t.onRegisteredHandler)throw k.create("invalid-on-registered-handler");Ld(t,n)}),t._registerNotifyChain}/**
 * @license
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hd(t,e){return nd(e,()=>{(async()=>!t.onRegisteredHandler||!await Yr(t.firebaseDependencies)||await Zr(t).catch(()=>{}))()})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cn(t){const e={from:t.from,collapseKey:t.collapse_key,messageId:t.fcmMessageId};return Vd(e,t),qd(e,t),Gd(e,t),e}function Vd(t,e){if(!e.notification)return;t.notification={};const s=e.notification.title;s&&(t.notification.title=s);const n=e.notification.body;n&&(t.notification.body=n);const r=e.notification.image;r&&(t.notification.image=r);const a=e.notification.icon;a&&(t.notification.icon=a)}function qd(t,e){e.data&&(t.data=e.data)}function Gd(t,e){var r,a,o,l;if(!e.fcmOptions&&!((r=e.notification)!=null&&r.click_action))return;t.fcmOptions={};const s=((a=e.fcmOptions)==null?void 0:a.link)??((o=e.notification)==null?void 0:o.click_action);s&&(t.fcmOptions.link=s);const n=(l=e.fcmOptions)==null?void 0:l.analytics_label;n&&(t.fcmOptions.analyticsLabel=n)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kd(t){return typeof t=="object"&&!!t&&qr in t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jd(t){if(!t||!t.options)throw At("App Configuration Object");if(!t.name)throw At("App Name");const e=["projectId","apiKey","appId","messagingSenderId"],{options:s}=t;for(const n of e)if(!s[n])throw At(n);return{appName:t.name,projectId:s.projectId,apiKey:s.apiKey,appId:s.appId,senderId:s.messagingSenderId}}function At(t){return k.create("missing-app-config-values",{valueName:t})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yd{constructor(e,s,n){this.deliveryMetricsExportedToBigQueryEnabled=!1,this.onBackgroundMessageHandler=null,this.onMessageHandler=null,this.onRegisteredHandler=null,this.onUnregisteredHandler=null,this._registerNotifyChain=Promise.resolve(),this._fidChangeUnsubscribe=null,this.logEvents=[],this.logQueue={state:"stopped"};const r=Jd(e);this.firebaseDependencies={app:e,appConfig:r,installations:s,analyticsProvider:n}}_delete(){return this._fidChangeUnsubscribe&&(this._fidChangeUnsubscribe(),this._fidChangeUnsubscribe=null),this.logQueue.state==="scheduled"&&clearTimeout(this.logQueue.timerId),this.logQueue={state:"stopped"},Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ei(t,e){if(!navigator)throw k.create("only-available-in-window");if(Notification.permission==="default"&&await Notification.requestPermission(),Notification.permission!=="granted")throw k.create("permission-blocked");return await Qr(t,e==null?void 0:e.vapidKey),await Xr(t,e==null?void 0:e.serviceWorkerRegistration),Pd(t)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Xd(t,e,s){const n=Qd(e);(await t.firebaseDependencies.analyticsProvider.get()).logEvent(n,{message_id:s[qr],message_name:s[ud],message_time:s[pd],message_device_time:Math.floor(Date.now()/1e3)})}function Qd(t){switch(t){case Ce.NOTIFICATION_CLICKED:return"notification_open";case Ce.PUSH_RECEIVED:return"notification_foreground";default:throw new Error}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Zd(t,e){const s=e.data;if(!s.isFirebaseMessaging)return;if(t.onMessageHandler&&s.messageType===Ce.PUSH_RECEIVED&&(typeof t.onMessageHandler=="function"?t.onMessageHandler(cn(s)):t.onMessageHandler.next(cn(s))),t.onRegisteredHandler&&s.messageType===Ce.FID_REGISTERED){const r=s.fid;typeof t.onRegisteredHandler=="function"?t.onRegisteredHandler(r):t.onRegisteredHandler.next(r)}const n=s.data;Kd(n)&&n[fd]==="1"&&await Xd(t,s.messageType,n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eh=t=>{const e=new Yd(t.getProvider("app").getImmediate(),t.getProvider("installations-internal").getImmediate(),t.getProvider("analytics-internal"));return navigator.serviceWorker.addEventListener("message",s=>Zd(e,s)),e._fidChangeUnsubscribe=Hd(e,t.getProvider("installations").getImmediate()),e},th=t=>{const e=t.getProvider("messaging").getImmediate();return{getToken:n=>ei(e,n),register:n=>Zr(e,n)}};function sh(){ie(new q("messaging",eh,"PUBLIC")),ie(new q("messaging-internal",th,"PRIVATE")),H(rn,Ht),H(rn,Ht,"esm2020")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ti(){try{await Bn()}catch{return!1}return typeof window<"u"&&zn()&&la()&&"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window&&"fetch"in window&&ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification")&&PushSubscription.prototype.hasOwnProperty("getKey")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nh(t,e){if(!navigator)throw k.create("only-available-in-window");return t.onMessageHandler=e,()=>{t.onMessageHandler=null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rh(t=Vn()){return ti().then(e=>{if(!e)throw k.create("unsupported-browser")},e=>{throw k.create("indexed-db-unsupported")}),De(le(t),"messaging").getImmediate()}async function ih(t,e){return t=le(t),ei(t,e)}function ah(t,e){return t=le(t),nh(t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */sh();const si={apiKey:"AIzaSyCRHSHgDhMAePmp3x0zCY1OeyWwlKiKyWY",authDomain:"sycnops-cd9af.firebaseapp.com",projectId:"sycnops-cd9af",storageBucket:"sycnops-cd9af.firebasestorage.app",messagingSenderId:"1005863641606",appId:"1:1005863641606:web:0d5a8d8d4ec50d94e7d987",vapidKey:"BC_dummy_vapid_key_for_notifications"},ni=Hn(si),it=bc(ni),ri=new X,ii=new Q;let $e=null;const ai=async()=>{if($e)return $e;try{if(await ti())return $e=rh(ni),$e}catch(t){console.warn("Firebase Messaging not supported in current environment:",t)}return null},oh=async()=>{try{if(!("Notification"in window))return{success:!1,message:"Browser does not support notifications."};if(await Notification.requestPermission()==="granted"){const e=await ai();if(e)try{const s=await ih(e,{vapidKey:si.vapidKey});if(s)return localStorage.setItem("fcm_token",s),{success:!0,token:s,message:"Push notifications enabled successfully!"}}catch(s){console.warn("FCM token fetch warning:",s)}return{success:!0,message:"Notification permission granted!"}}else return{success:!1,message:"Notification permission denied."}}catch(t){return{success:!1,message:t.message||"Error requesting notification permission."}}},lh=async t=>{const e=await ai();e&&ah(e,s=>{t(s)})},K="http://localhost:5000/api";async function J(t){if((t.headers.get("content-type")||"").includes("application/json"))try{return await t.json()}catch{}return{success:!1,message:await t.text()||`HTTP ${t.status} ${t.statusText}`}}async function ch(){try{const t=await fetch(`${K}/repositories`);if(!t.ok)throw new Error("Failed to fetch repositories");return(await J(t)).data||[]}catch{return[{id:1,name:"sycnops-ai-web",stars:124,forks:38,openIssues:5,language:"JavaScript",visibility:"Public",updatedAt:"2 hours ago"},{id:2,name:"workflow-engine",stars:89,forks:14,openIssues:2,language:"TypeScript",visibility:"Public",updatedAt:"5 hours ago"},{id:3,name:"analytics-service",stars:45,forks:8,openIssues:0,language:"Python",visibility:"Private",updatedAt:"1 day ago"},{id:4,name:"ai-prompt-pipeline",stars:210,forks:62,openIssues:11,language:"Python",visibility:"Public",updatedAt:"3 days ago"}]}}async function dh(){try{const t=await fetch(`${K}/pull-requests`);if(!t.ok)throw new Error("Failed to fetch pull requests");return(await J(t)).data||[]}catch{return[{id:101,title:"feat: Add AI code recommendation widget",repo:"sycnops-ai-web",author:"johndoe",status:"open",comments:4,createdAt:"3 hours ago"},{id:102,title:"fix: Resolve chart rendering lag in analytics",repo:"analytics-service",author:"sarah_m",status:"merged",comments:2,createdAt:"1 day ago"},{id:103,title:"refactor: Upgrade tailwind tokens & components",repo:"sycnops-ai-web",author:"alex_dev",status:"under_review",comments:7,createdAt:"2 days ago"}]}}async function hh(){try{const t=await fetch(`${K}/issues`);if(!t.ok)throw new Error("Failed to fetch issues");return(await J(t)).data||[]}catch{return[{id:201,title:"OAuth token refresh failing intermittently",repo:"sycnops-ai-web",priority:"high",label:"bug",state:"open",assignee:"johndoe"},{id:202,title:"Add dark mode toggle in navbar settings",repo:"sycnops-ai-web",priority:"medium",label:"enhancement",state:"open",assignee:"sarah_m"},{id:203,title:"Update documentation for webhook events",repo:"workflow-engine",priority:"low",label:"documentation",state:"closed",assignee:"alex_dev"}]}}async function uh(){try{const t=await fetch(`${K}/analytics`);if(!t.ok)throw new Error("Failed to fetch analytics");return(await J(t)).data||{totalCommits:342,mergedPRs:87,issuesClosed:115,codeReviewsCount:64,velocityScore:94.5,dailyActivity:[]}}catch{return{totalCommits:342,mergedPRs:87,issuesClosed:115,codeReviewsCount:64,velocityScore:94.5,dailyActivity:[{day:"Mon",commits:14,prs:3},{day:"Tue",commits:22,prs:5},{day:"Wed",commits:30,prs:8},{day:"Thu",commits:18,prs:4},{day:"Fri",commits:26,prs:6},{day:"Sat",commits:8,prs:1},{day:"Sun",commits:5,prs:0}]}}}async function ph(t){try{const e=await fetch(`${K}/ai-assistant`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:t})}),s=await J(e);if(!e.ok)throw new Error(s.message||"Failed to process AI request");return s.response||"AI request completed."}catch{return"SycnOps Copilot: Workflow request completed successfully."}}async function fh(t){try{const e=await fetch(`${K}/auth/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),s=await J(e);if(!e.ok)throw new Error(s.message||"Registration failed");return s}catch(e){if(e.message&&!e.message.includes("fetch")&&!e.message.includes("NetworkError")&&!e.message.includes("Failed to fetch"))throw e;const s={id:"usr_"+Date.now(),name:t.name||"Studio Developer",email:t.email,role:t.role||"developer",createdAt:new Date().toISOString()};return{success:!0,token:"sycnops_session_"+Date.now(),user:s}}}async function gh(t){try{const e=await fetch(`${K}/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),s=await J(e);if(!e.ok)throw new Error(s.message||"Invalid email or password.");return s}catch(e){if(e.message&&!e.message.includes("fetch")&&!e.message.includes("NetworkError")&&!e.message.includes("Failed to fetch"))throw e;const n=(t.email.split("@")[0]||"developer").replace(/[^a-zA-Z]/g," ").trim().toUpperCase()||"STUDIO DEVELOPER",r={id:"usr_"+Date.now(),name:n,email:t.email,role:"developer",createdAt:new Date().toISOString()};return{success:!0,token:"sycnops_session_"+Date.now(),user:r}}}async function at(t){try{const e=await fetch(`${K}/auth/social`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),s=await J(e);if(!e.ok)throw new Error(s.message||`Social login with ${t.provider} failed`);return s}catch(e){if(e.message&&!e.message.includes("fetch")&&!e.message.includes("NetworkError")&&!e.message.includes("Failed to fetch"))throw e;const s=a=>{const o=a.split("@")[0],l=o.replace(/[^a-zA-Z]/g," ").split(" ").filter(Boolean);return l.length===0?o:l.map(c=>c.charAt(0).toUpperCase()+c.slice(1).toLowerCase()).join(" ")},n=t.name&&t.name.trim()?t.name.trim():s(t.email),r={id:"usr_social_"+Date.now(),name:n,email:t.email,role:"developer",createdAt:new Date().toISOString()};return{success:!0,token:"sycnops_social_token_"+Date.now(),user:r}}}async function oi(){const t=localStorage.getItem("sycnops_token")||localStorage.getItem("token"),e=localStorage.getItem("sycnops_user"),s=e?JSON.parse(e):null;if(!t){if(s)return s;throw new Error("Please log in to view your profile.")}try{const n=await fetch(`${K}/auth/me`,{headers:{Authorization:`Bearer ${t}`}}),r=await J(n);if(!n.ok||!r.success){if(s)return s;throw new Error(r.message||"Failed to fetch user profile")}return r.user}catch{return s||{id:"usr_default",name:"Developer",email:"user@sycnops.io",role:"developer"}}}async function li(t){const e=localStorage.getItem("sycnops_token")||localStorage.getItem("token"),s=localStorage.getItem("sycnops_user"),r={...s?JSON.parse(s):{},name:t.name.trim()};if(localStorage.setItem("sycnops_user",JSON.stringify(r)),!e)return r;try{const a=await fetch(`${K}/auth/me`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify(t)}),o=await J(a);return!a.ok||!o.success?r:o.user||r}catch{return r}}function Oe(t){let e=t[0],s=t[1],n=t[2];return Math.sqrt(e*e+s*s+n*n)}function Vt(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t}function mh(t,e,s,n){return t[0]=e,t[1]=s,t[2]=n,t}function dn(t,e,s){return t[0]=e[0]+s[0],t[1]=e[1]+s[1],t[2]=e[2]+s[2],t}function hn(t,e,s){return t[0]=e[0]-s[0],t[1]=e[1]-s[1],t[2]=e[2]-s[2],t}function xh(t,e,s){return t[0]=e[0]*s[0],t[1]=e[1]*s[1],t[2]=e[2]*s[2],t}function yh(t,e,s){return t[0]=e[0]/s[0],t[1]=e[1]/s[1],t[2]=e[2]/s[2],t}function Nt(t,e,s){return t[0]=e[0]*s,t[1]=e[1]*s,t[2]=e[2]*s,t}function bh(t,e){let s=e[0]-t[0],n=e[1]-t[1],r=e[2]-t[2];return Math.sqrt(s*s+n*n+r*r)}function vh(t,e){let s=e[0]-t[0],n=e[1]-t[1],r=e[2]-t[2];return s*s+n*n+r*r}function un(t){let e=t[0],s=t[1],n=t[2];return e*e+s*s+n*n}function wh(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t}function _h(t,e){return t[0]=1/e[0],t[1]=1/e[1],t[2]=1/e[2],t}function qt(t,e){let s=e[0],n=e[1],r=e[2],a=s*s+n*n+r*r;return a>0&&(a=1/Math.sqrt(a)),t[0]=e[0]*a,t[1]=e[1]*a,t[2]=e[2]*a,t}function ci(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]}function pn(t,e,s){let n=e[0],r=e[1],a=e[2],o=s[0],l=s[1],c=s[2];return t[0]=r*c-a*l,t[1]=a*o-n*c,t[2]=n*l-r*o,t}function Sh(t,e,s,n){let r=e[0],a=e[1],o=e[2];return t[0]=r+n*(s[0]-r),t[1]=a+n*(s[1]-a),t[2]=o+n*(s[2]-o),t}function Ih(t,e,s,n,r){const a=Math.exp(-n*r);let o=e[0],l=e[1],c=e[2];return t[0]=s[0]+(o-s[0])*a,t[1]=s[1]+(l-s[1])*a,t[2]=s[2]+(c-s[2])*a,t}function Eh(t,e,s){let n=e[0],r=e[1],a=e[2],o=s[3]*n+s[7]*r+s[11]*a+s[15];return o=o||1,t[0]=(s[0]*n+s[4]*r+s[8]*a+s[12])/o,t[1]=(s[1]*n+s[5]*r+s[9]*a+s[13])/o,t[2]=(s[2]*n+s[6]*r+s[10]*a+s[14])/o,t}function Th(t,e,s){let n=e[0],r=e[1],a=e[2],o=s[3]*n+s[7]*r+s[11]*a+s[15];return o=o||1,t[0]=(s[0]*n+s[4]*r+s[8]*a)/o,t[1]=(s[1]*n+s[5]*r+s[9]*a)/o,t[2]=(s[2]*n+s[6]*r+s[10]*a)/o,t}function Ch(t,e,s){let n=e[0],r=e[1],a=e[2];return t[0]=n*s[0]+r*s[3]+a*s[6],t[1]=n*s[1]+r*s[4]+a*s[7],t[2]=n*s[2]+r*s[5]+a*s[8],t}function kh(t,e,s){let n=e[0],r=e[1],a=e[2],o=s[0],l=s[1],c=s[2],d=s[3],h=l*a-c*r,p=c*n-o*a,u=o*r-l*n,f=l*u-c*p,g=c*h-o*u,m=o*p-l*h,y=d*2;return h*=y,p*=y,u*=y,f*=2,g*=2,m*=2,t[0]=n+h+f,t[1]=r+p+g,t[2]=a+u+m,t}const jh=function(){const t=[0,0,0],e=[0,0,0];return function(s,n){Vt(t,s),Vt(e,n),qt(t,t),qt(e,e);let r=ci(t,e);return r>1?0:r<-1?Math.PI:Math.acos(r)}}();function Ah(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]}class U extends Array{constructor(e=0,s=e,n=e){return super(e,s,n),this}get x(){return this[0]}get y(){return this[1]}get z(){return this[2]}set x(e){this[0]=e}set y(e){this[1]=e}set z(e){this[2]=e}set(e,s=e,n=e){return e.length?this.copy(e):(mh(this,e,s,n),this)}copy(e){return Vt(this,e),this}add(e,s){return s?dn(this,e,s):dn(this,this,e),this}sub(e,s){return s?hn(this,e,s):hn(this,this,e),this}multiply(e){return e.length?xh(this,this,e):Nt(this,this,e),this}divide(e){return e.length?yh(this,this,e):Nt(this,this,1/e),this}inverse(e=this){return _h(this,e),this}len(){return Oe(this)}distance(e){return e?bh(this,e):Oe(this)}squaredLen(){return un(this)}squaredDistance(e){return e?vh(this,e):un(this)}negate(e=this){return wh(this,e),this}cross(e,s){return s?pn(this,e,s):pn(this,this,e),this}scale(e){return Nt(this,this,e),this}normalize(){return qt(this,this),this}dot(e){return ci(this,e)}equals(e){return Ah(this,e)}applyMatrix3(e){return Ch(this,this,e),this}applyMatrix4(e){return Eh(this,this,e),this}scaleRotateMatrix4(e){return Th(this,this,e),this}applyQuaternion(e){return kh(this,this,e),this}angle(e){return jh(this,e)}lerp(e,s){return Sh(this,this,e,s),this}smoothLerp(e,s,n){return Ih(this,this,e,s,n),this}clone(){return new U(this[0],this[1],this[2])}fromArray(e,s=0){return this[0]=e[s],this[1]=e[s+1],this[2]=e[s+2],this}toArray(e=[],s=0){return e[s]=this[0],e[s+1]=this[1],e[s+2]=this[2],e}transformDirection(e){const s=this[0],n=this[1],r=this[2];return this[0]=e[0]*s+e[4]*n+e[8]*r,this[1]=e[1]*s+e[5]*n+e[9]*r,this[2]=e[2]*s+e[6]*n+e[10]*r,this.normalize()}}const fn=new U;let Nh=1,Rh=1,gn=!1;class Oh{constructor(e,s={}){e.canvas||console.error("gl not passed as first argument to Geometry"),this.gl=e,this.attributes=s,this.id=Nh++,this.VAOs={},this.drawRange={start:0,count:0},this.instancedCount=0,this.gl.renderer.bindVertexArray(null),this.gl.renderer.currentGeometry=null,this.glState=this.gl.renderer.state;for(let n in s)this.addAttribute(n,s[n])}addAttribute(e,s){if(this.attributes[e]=s,s.id=Rh++,s.size=s.size||1,s.type=s.type||(s.data.constructor===Float32Array?this.gl.FLOAT:s.data.constructor===Uint16Array?this.gl.UNSIGNED_SHORT:this.gl.UNSIGNED_INT),s.target=e==="index"?this.gl.ELEMENT_ARRAY_BUFFER:this.gl.ARRAY_BUFFER,s.normalized=s.normalized||!1,s.stride=s.stride||0,s.offset=s.offset||0,s.count=s.count||(s.stride?s.data.byteLength/s.stride:s.data.length/s.size),s.divisor=s.instanced||0,s.needsUpdate=!1,s.usage=s.usage||this.gl.STATIC_DRAW,s.buffer||this.updateAttribute(s),s.divisor){if(this.isInstanced=!0,this.instancedCount&&this.instancedCount!==s.count*s.divisor)return console.warn("geometry has multiple instanced buffers of different length"),this.instancedCount=Math.min(this.instancedCount,s.count*s.divisor);this.instancedCount=s.count*s.divisor}else e==="index"?this.drawRange.count=s.count:this.attributes.index||(this.drawRange.count=Math.max(this.drawRange.count,s.count))}updateAttribute(e){const s=!e.buffer;s&&(e.buffer=this.gl.createBuffer()),this.glState.boundBuffer!==e.buffer&&(this.gl.bindBuffer(e.target,e.buffer),this.glState.boundBuffer=e.buffer),s?this.gl.bufferData(e.target,e.data,e.usage):this.gl.bufferSubData(e.target,0,e.data),e.needsUpdate=!1}setIndex(e){this.addAttribute("index",e)}setDrawRange(e,s){this.drawRange.start=e,this.drawRange.count=s}setInstancedCount(e){this.instancedCount=e}createVAO(e){this.VAOs[e.attributeOrder]=this.gl.renderer.createVertexArray(),this.gl.renderer.bindVertexArray(this.VAOs[e.attributeOrder]),this.bindAttributes(e)}bindAttributes(e){e.attributeLocations.forEach((s,{name:n,type:r})=>{if(!this.attributes[n]){console.warn(`active attribute ${n} not being supplied`);return}const a=this.attributes[n];this.gl.bindBuffer(a.target,a.buffer),this.glState.boundBuffer=a.buffer;let o=1;r===35674&&(o=2),r===35675&&(o=3),r===35676&&(o=4);const l=a.size/o,c=o===1?0:o*o*4,d=o===1?0:o*4;for(let h=0;h<o;h++)this.gl.vertexAttribPointer(s+h,l,a.type,a.normalized,a.stride+c,a.offset+h*d),this.gl.enableVertexAttribArray(s+h),this.gl.renderer.vertexAttribDivisor(s+h,a.divisor)}),this.attributes.index&&this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,this.attributes.index.buffer)}draw({program:e,mode:s=this.gl.TRIANGLES}){var r;this.gl.renderer.currentGeometry!==`${this.id}_${e.attributeOrder}`&&(this.VAOs[e.attributeOrder]||this.createVAO(e),this.gl.renderer.bindVertexArray(this.VAOs[e.attributeOrder]),this.gl.renderer.currentGeometry=`${this.id}_${e.attributeOrder}`),e.attributeLocations.forEach((a,{name:o})=>{const l=this.attributes[o];l.needsUpdate&&this.updateAttribute(l)});let n=2;((r=this.attributes.index)==null?void 0:r.type)===this.gl.UNSIGNED_INT&&(n=4),this.isInstanced?this.attributes.index?this.gl.renderer.drawElementsInstanced(s,this.drawRange.count,this.attributes.index.type,this.attributes.index.offset+this.drawRange.start*n,this.instancedCount):this.gl.renderer.drawArraysInstanced(s,this.drawRange.start,this.drawRange.count,this.instancedCount):this.attributes.index?this.gl.drawElements(s,this.drawRange.count,this.attributes.index.type,this.attributes.index.offset+this.drawRange.start*n):this.gl.drawArrays(s,this.drawRange.start,this.drawRange.count)}getPosition(){const e=this.attributes.position;if(e.data)return e;if(!gn)return console.warn("No position buffer data found to compute bounds"),gn=!0}computeBoundingBox(e){e||(e=this.getPosition());const s=e.data,n=e.size;this.bounds||(this.bounds={min:new U,max:new U,center:new U,scale:new U,radius:1/0});const r=this.bounds.min,a=this.bounds.max,o=this.bounds.center,l=this.bounds.scale;r.set(1/0),a.set(-1/0);for(let c=0,d=s.length;c<d;c+=n){const h=s[c],p=s[c+1],u=s[c+2];r.x=Math.min(h,r.x),r.y=Math.min(p,r.y),r.z=Math.min(u,r.z),a.x=Math.max(h,a.x),a.y=Math.max(p,a.y),a.z=Math.max(u,a.z)}l.sub(a,r),o.add(r,a).divide(2)}computeBoundingSphere(e){e||(e=this.getPosition());const s=e.data,n=e.size;this.bounds||this.computeBoundingBox(e);let r=0;for(let a=0,o=s.length;a<o;a+=n)fn.fromArray(s,a),r=Math.max(r,this.bounds.center.squaredDistance(fn));this.bounds.radius=Math.sqrt(r)}remove(){for(let e in this.VAOs)this.gl.renderer.deleteVertexArray(this.VAOs[e]),delete this.VAOs[e];for(let e in this.attributes)this.gl.deleteBuffer(this.attributes[e].buffer),delete this.attributes[e]}}let Ph=1;const mn={};class Mh{constructor(e,{vertex:s,fragment:n,uniforms:r={},transparent:a=!1,cullFace:o=e.BACK,frontFace:l=e.CCW,depthTest:c=!0,depthWrite:d=!0,depthFunc:h=e.LEQUAL}={}){e.canvas||console.error("gl not passed as first argument to Program"),this.gl=e,this.uniforms=r,this.id=Ph++,s||console.warn("vertex shader not supplied"),n||console.warn("fragment shader not supplied"),this.transparent=a,this.cullFace=o,this.frontFace=l,this.depthTest=c,this.depthWrite=d,this.depthFunc=h,this.blendFunc={},this.blendEquation={},this.stencilFunc={},this.stencilOp={},this.transparent&&!this.blendFunc.src&&(this.gl.renderer.premultipliedAlpha?this.setBlendFunc(this.gl.ONE,this.gl.ONE_MINUS_SRC_ALPHA):this.setBlendFunc(this.gl.SRC_ALPHA,this.gl.ONE_MINUS_SRC_ALPHA)),this.vertexShader=e.createShader(e.VERTEX_SHADER),this.fragmentShader=e.createShader(e.FRAGMENT_SHADER),this.program=e.createProgram(),e.attachShader(this.program,this.vertexShader),e.attachShader(this.program,this.fragmentShader),this.setShaders({vertex:s,fragment:n})}setShaders({vertex:e,fragment:s}){if(e&&(this.gl.shaderSource(this.vertexShader,e),this.gl.compileShader(this.vertexShader),this.gl.getShaderInfoLog(this.vertexShader)!==""&&console.warn(`${this.gl.getShaderInfoLog(this.vertexShader)}
Vertex Shader
${xn(e)}`)),s&&(this.gl.shaderSource(this.fragmentShader,s),this.gl.compileShader(this.fragmentShader),this.gl.getShaderInfoLog(this.fragmentShader)!==""&&console.warn(`${this.gl.getShaderInfoLog(this.fragmentShader)}
Fragment Shader
${xn(s)}`)),this.gl.linkProgram(this.program),!this.gl.getProgramParameter(this.program,this.gl.LINK_STATUS))return console.warn(this.gl.getProgramInfoLog(this.program));this.uniformLocations=new Map;let n=this.gl.getProgramParameter(this.program,this.gl.ACTIVE_UNIFORMS);for(let o=0;o<n;o++){let l=this.gl.getActiveUniform(this.program,o);this.uniformLocations.set(l,this.gl.getUniformLocation(this.program,l.name));const c=l.name.match(/(\w+)/g);l.uniformName=c[0],l.nameComponents=c.slice(1)}this.attributeLocations=new Map;const r=[],a=this.gl.getProgramParameter(this.program,this.gl.ACTIVE_ATTRIBUTES);for(let o=0;o<a;o++){const l=this.gl.getActiveAttrib(this.program,o),c=this.gl.getAttribLocation(this.program,l.name);c!==-1&&(r[c]=l.name,this.attributeLocations.set(l,c))}this.attributeOrder=r.join("")}setBlendFunc(e,s,n,r){this.blendFunc.src=e,this.blendFunc.dst=s,this.blendFunc.srcAlpha=n,this.blendFunc.dstAlpha=r,e&&(this.transparent=!0)}setBlendEquation(e,s){this.blendEquation.modeRGB=e,this.blendEquation.modeAlpha=s}setStencilFunc(e,s,n){this.stencilRef=s,this.stencilFunc.func=e,this.stencilFunc.ref=s,this.stencilFunc.mask=n}setStencilOp(e,s,n){this.stencilOp.stencilFail=e,this.stencilOp.depthFail=s,this.stencilOp.depthPass=n}applyState(){this.depthTest?this.gl.renderer.enable(this.gl.DEPTH_TEST):this.gl.renderer.disable(this.gl.DEPTH_TEST),this.cullFace?this.gl.renderer.enable(this.gl.CULL_FACE):this.gl.renderer.disable(this.gl.CULL_FACE),this.blendFunc.src?this.gl.renderer.enable(this.gl.BLEND):this.gl.renderer.disable(this.gl.BLEND),this.cullFace&&this.gl.renderer.setCullFace(this.cullFace),this.gl.renderer.setFrontFace(this.frontFace),this.gl.renderer.setDepthMask(this.depthWrite),this.gl.renderer.setDepthFunc(this.depthFunc),this.blendFunc.src&&this.gl.renderer.setBlendFunc(this.blendFunc.src,this.blendFunc.dst,this.blendFunc.srcAlpha,this.blendFunc.dstAlpha),this.gl.renderer.setBlendEquation(this.blendEquation.modeRGB,this.blendEquation.modeAlpha),this.stencilFunc.func||this.stencilOp.stencilFail?this.gl.renderer.enable(this.gl.STENCIL_TEST):this.gl.renderer.disable(this.gl.STENCIL_TEST),this.gl.renderer.setStencilFunc(this.stencilFunc.func,this.stencilFunc.ref,this.stencilFunc.mask),this.gl.renderer.setStencilOp(this.stencilOp.stencilFail,this.stencilOp.depthFail,this.stencilOp.depthPass)}use({flipFaces:e=!1}={}){let s=-1;this.gl.renderer.state.currentProgram===this.id||(this.gl.useProgram(this.program),this.gl.renderer.state.currentProgram=this.id),this.uniformLocations.forEach((r,a)=>{let o=this.uniforms[a.uniformName];for(const l of a.nameComponents){if(!o)break;if(l in o)o=o[l];else{if(Array.isArray(o.value))break;o=void 0;break}}if(!o)return yn(`Active uniform ${a.name} has not been supplied`);if(o&&o.value===void 0)return yn(`${a.name} uniform is missing a value parameter`);if(o.value.texture)return s=s+1,o.value.update(s),Rt(this.gl,a.type,r,s);if(o.value.length&&o.value[0].texture){const l=[];return o.value.forEach(c=>{s=s+1,c.update(s),l.push(s)}),Rt(this.gl,a.type,r,l)}Rt(this.gl,a.type,r,o.value)}),this.applyState(),e&&this.gl.renderer.setFrontFace(this.frontFace===this.gl.CCW?this.gl.CW:this.gl.CCW)}remove(){this.gl.deleteProgram(this.program)}}function Rt(t,e,s,n){n=n.length?Fh(n):n;const r=t.renderer.state.uniformLocations.get(s);if(n.length)if(r===void 0||r.length!==n.length)t.renderer.state.uniformLocations.set(s,n.slice(0));else{if(Dh(r,n))return;r.set?r.set(n):Lh(r,n),t.renderer.state.uniformLocations.set(s,r)}else{if(r===n)return;t.renderer.state.uniformLocations.set(s,n)}switch(e){case 5126:return n.length?t.uniform1fv(s,n):t.uniform1f(s,n);case 35664:return t.uniform2fv(s,n);case 35665:return t.uniform3fv(s,n);case 35666:return t.uniform4fv(s,n);case 35670:case 5124:case 35678:case 36306:case 35680:case 36289:return n.length?t.uniform1iv(s,n):t.uniform1i(s,n);case 35671:case 35667:return t.uniform2iv(s,n);case 35672:case 35668:return t.uniform3iv(s,n);case 35673:case 35669:return t.uniform4iv(s,n);case 35674:return t.uniformMatrix2fv(s,!1,n);case 35675:return t.uniformMatrix3fv(s,!1,n);case 35676:return t.uniformMatrix4fv(s,!1,n)}}function xn(t){let e=t.split(`
`);for(let s=0;s<e.length;s++)e[s]=s+1+": "+e[s];return e.join(`
`)}function Fh(t){const e=t.length,s=t[0].length;if(s===void 0)return t;const n=e*s;let r=mn[n];r||(mn[n]=r=new Float32Array(n));for(let a=0;a<e;a++)r.set(t[a],a*s);return r}function Dh(t,e){if(t.length!==e.length)return!1;for(let s=0,n=t.length;s<n;s++)if(t[s]!==e[s])return!1;return!0}function Lh(t,e){for(let s=0,n=t.length;s<n;s++)t[s]=e[s]}let Ot=0;function yn(t){Ot>100||(console.warn(t),Ot++,Ot>100&&console.warn("More than 100 program warnings - stopping logs."))}const Pt=new U;let zh=1;class Bh{constructor({canvas:e=document.createElement("canvas"),width:s=300,height:n=150,dpr:r=1,alpha:a=!1,depth:o=!0,stencil:l=!1,antialias:c=!1,premultipliedAlpha:d=!1,preserveDrawingBuffer:h=!1,powerPreference:p="default",autoClear:u=!0,webgl:f=2}={}){const g={alpha:a,depth:o,stencil:l,antialias:c,premultipliedAlpha:d,preserveDrawingBuffer:h,powerPreference:p};this.dpr=r,this.alpha=a,this.color=!0,this.depth=o,this.stencil=l,this.premultipliedAlpha=d,this.autoClear=u,this.id=zh++,f===2&&(this.gl=e.getContext("webgl2",g)),this.isWebgl2=!!this.gl,this.gl||(this.gl=e.getContext("webgl",g)),this.gl||console.error("unable to create webgl context"),this.gl.renderer=this,this.setSize(s,n),this.state={},this.state.blendFunc={src:this.gl.ONE,dst:this.gl.ZERO},this.state.blendEquation={modeRGB:this.gl.FUNC_ADD},this.state.cullFace=!1,this.state.frontFace=this.gl.CCW,this.state.depthMask=!0,this.state.depthFunc=this.gl.LEQUAL,this.state.premultiplyAlpha=!1,this.state.flipY=!1,this.state.unpackAlignment=4,this.state.framebuffer=null,this.state.viewport={x:0,y:0,width:null,height:null},this.state.textureUnits=[],this.state.activeTextureUnit=0,this.state.boundBuffer=null,this.state.uniformLocations=new Map,this.state.currentProgram=null,this.extensions={},this.isWebgl2?(this.getExtension("EXT_color_buffer_float"),this.getExtension("OES_texture_float_linear")):(this.getExtension("OES_texture_float"),this.getExtension("OES_texture_float_linear"),this.getExtension("OES_texture_half_float"),this.getExtension("OES_texture_half_float_linear"),this.getExtension("OES_element_index_uint"),this.getExtension("OES_standard_derivatives"),this.getExtension("EXT_sRGB"),this.getExtension("WEBGL_depth_texture"),this.getExtension("WEBGL_draw_buffers")),this.getExtension("WEBGL_compressed_texture_astc"),this.getExtension("EXT_texture_compression_bptc"),this.getExtension("WEBGL_compressed_texture_s3tc"),this.getExtension("WEBGL_compressed_texture_etc1"),this.getExtension("WEBGL_compressed_texture_pvrtc"),this.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),this.vertexAttribDivisor=this.getExtension("ANGLE_instanced_arrays","vertexAttribDivisor","vertexAttribDivisorANGLE"),this.drawArraysInstanced=this.getExtension("ANGLE_instanced_arrays","drawArraysInstanced","drawArraysInstancedANGLE"),this.drawElementsInstanced=this.getExtension("ANGLE_instanced_arrays","drawElementsInstanced","drawElementsInstancedANGLE"),this.createVertexArray=this.getExtension("OES_vertex_array_object","createVertexArray","createVertexArrayOES"),this.bindVertexArray=this.getExtension("OES_vertex_array_object","bindVertexArray","bindVertexArrayOES"),this.deleteVertexArray=this.getExtension("OES_vertex_array_object","deleteVertexArray","deleteVertexArrayOES"),this.drawBuffers=this.getExtension("WEBGL_draw_buffers","drawBuffers","drawBuffersWEBGL"),this.parameters={},this.parameters.maxTextureUnits=this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS),this.parameters.maxAnisotropy=this.getExtension("EXT_texture_filter_anisotropic")?this.gl.getParameter(this.getExtension("EXT_texture_filter_anisotropic").MAX_TEXTURE_MAX_ANISOTROPY_EXT):0}setSize(e,s){this.width=e,this.height=s,this.gl.canvas.width=e*this.dpr,this.gl.canvas.height=s*this.dpr,this.gl.canvas.style&&Object.assign(this.gl.canvas.style,{width:e+"px",height:s+"px"})}setViewport(e,s,n=0,r=0){this.state.viewport.width===e&&this.state.viewport.height===s||(this.state.viewport.width=e,this.state.viewport.height=s,this.state.viewport.x=n,this.state.viewport.y=r,this.gl.viewport(n,r,e,s))}setScissor(e,s,n=0,r=0){this.gl.scissor(n,r,e,s)}enable(e){this.state[e]!==!0&&(this.gl.enable(e),this.state[e]=!0)}disable(e){this.state[e]!==!1&&(this.gl.disable(e),this.state[e]=!1)}setBlendFunc(e,s,n,r){this.state.blendFunc.src===e&&this.state.blendFunc.dst===s&&this.state.blendFunc.srcAlpha===n&&this.state.blendFunc.dstAlpha===r||(this.state.blendFunc.src=e,this.state.blendFunc.dst=s,this.state.blendFunc.srcAlpha=n,this.state.blendFunc.dstAlpha=r,n!==void 0?this.gl.blendFuncSeparate(e,s,n,r):this.gl.blendFunc(e,s))}setBlendEquation(e,s){e=e||this.gl.FUNC_ADD,!(this.state.blendEquation.modeRGB===e&&this.state.blendEquation.modeAlpha===s)&&(this.state.blendEquation.modeRGB=e,this.state.blendEquation.modeAlpha=s,s!==void 0?this.gl.blendEquationSeparate(e,s):this.gl.blendEquation(e))}setCullFace(e){this.state.cullFace!==e&&(this.state.cullFace=e,this.gl.cullFace(e))}setFrontFace(e){this.state.frontFace!==e&&(this.state.frontFace=e,this.gl.frontFace(e))}setDepthMask(e){this.state.depthMask!==e&&(this.state.depthMask=e,this.gl.depthMask(e))}setDepthFunc(e){this.state.depthFunc!==e&&(this.state.depthFunc=e,this.gl.depthFunc(e))}setStencilMask(e){this.state.stencilMask!==e&&(this.state.stencilMask=e,this.gl.stencilMask(e))}setStencilFunc(e,s,n){this.state.stencilFunc===e&&this.state.stencilRef===s&&this.state.stencilFuncMask===n||(this.state.stencilFunc=e||this.gl.ALWAYS,this.state.stencilRef=s||0,this.state.stencilFuncMask=n||0,this.gl.stencilFunc(e||this.gl.ALWAYS,s||0,n||0))}setStencilOp(e,s,n){this.state.stencilFail===e&&this.state.stencilDepthFail===s&&this.state.stencilDepthPass===n||(this.state.stencilFail=e,this.state.stencilDepthFail=s,this.state.stencilDepthPass=n,this.gl.stencilOp(e,s,n))}activeTexture(e){this.state.activeTextureUnit!==e&&(this.state.activeTextureUnit=e,this.gl.activeTexture(this.gl.TEXTURE0+e))}bindFramebuffer({target:e=this.gl.FRAMEBUFFER,buffer:s=null}={}){this.state.framebuffer!==s&&(this.state.framebuffer=s,this.gl.bindFramebuffer(e,s))}getExtension(e,s,n){return s&&this.gl[s]?this.gl[s].bind(this.gl):(this.extensions[e]||(this.extensions[e]=this.gl.getExtension(e)),s?this.extensions[e]?this.extensions[e][n].bind(this.extensions[e]):null:this.extensions[e])}sortOpaque(e,s){return e.renderOrder!==s.renderOrder?e.renderOrder-s.renderOrder:e.program.id!==s.program.id?e.program.id-s.program.id:e.zDepth!==s.zDepth?e.zDepth-s.zDepth:s.id-e.id}sortTransparent(e,s){return e.renderOrder!==s.renderOrder?e.renderOrder-s.renderOrder:e.zDepth!==s.zDepth?s.zDepth-e.zDepth:s.id-e.id}sortUI(e,s){return e.renderOrder!==s.renderOrder?e.renderOrder-s.renderOrder:e.program.id!==s.program.id?e.program.id-s.program.id:s.id-e.id}getRenderList({scene:e,camera:s,frustumCull:n,sort:r}){let a=[];if(s&&n&&s.updateFrustum(),e.traverse(o=>{if(!o.visible)return!0;o.draw&&(n&&o.frustumCulled&&s&&!s.frustumIntersectsMesh(o)||a.push(o))}),r){const o=[],l=[],c=[];a.forEach(d=>{d.program.transparent?d.program.depthTest?l.push(d):c.push(d):o.push(d),d.zDepth=0,!(d.renderOrder!==0||!d.program.depthTest||!s)&&(d.worldMatrix.getTranslation(Pt),Pt.applyMatrix4(s.projectionViewMatrix),d.zDepth=Pt.z)}),o.sort(this.sortOpaque),l.sort(this.sortTransparent),c.sort(this.sortUI),a=o.concat(l,c)}return a}render({scene:e,camera:s,target:n=null,update:r=!0,sort:a=!0,frustumCull:o=!0,clear:l}){n===null?(this.bindFramebuffer(),this.setViewport(this.width*this.dpr,this.height*this.dpr)):(this.bindFramebuffer(n),this.setViewport(n.width,n.height)),(l||this.autoClear&&l!==!1)&&(this.depth&&(!n||n.depth)&&(this.enable(this.gl.DEPTH_TEST),this.setDepthMask(!0)),(this.stencil||!n||n.stencil)&&(this.enable(this.gl.STENCIL_TEST),this.setStencilMask(255)),this.gl.clear((this.color?this.gl.COLOR_BUFFER_BIT:0)|(this.depth?this.gl.DEPTH_BUFFER_BIT:0)|(this.stencil?this.gl.STENCIL_BUFFER_BIT:0))),r&&e.updateMatrixWorld(),s&&s.updateMatrixWorld(),this.getRenderList({scene:e,camera:s,frustumCull:o,sort:a}).forEach(d=>{d.draw({camera:s})})}}function Uh(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t}function Wh(t,e,s,n,r){return t[0]=e,t[1]=s,t[2]=n,t[3]=r,t}function $h(t,e){let s=e[0],n=e[1],r=e[2],a=e[3],o=s*s+n*n+r*r+a*a;return o>0&&(o=1/Math.sqrt(o)),t[0]=s*o,t[1]=n*o,t[2]=r*o,t[3]=a*o,t}function Hh(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]+t[3]*e[3]}function Vh(t){return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t}function qh(t,e,s){s=s*.5;let n=Math.sin(s);return t[0]=n*e[0],t[1]=n*e[1],t[2]=n*e[2],t[3]=Math.cos(s),t}function bn(t,e,s){let n=e[0],r=e[1],a=e[2],o=e[3],l=s[0],c=s[1],d=s[2],h=s[3];return t[0]=n*h+o*l+r*d-a*c,t[1]=r*h+o*c+a*l-n*d,t[2]=a*h+o*d+n*c-r*l,t[3]=o*h-n*l-r*c-a*d,t}function Gh(t,e,s){s*=.5;let n=e[0],r=e[1],a=e[2],o=e[3],l=Math.sin(s),c=Math.cos(s);return t[0]=n*c+o*l,t[1]=r*c+a*l,t[2]=a*c-r*l,t[3]=o*c-n*l,t}function Kh(t,e,s){s*=.5;let n=e[0],r=e[1],a=e[2],o=e[3],l=Math.sin(s),c=Math.cos(s);return t[0]=n*c-a*l,t[1]=r*c+o*l,t[2]=a*c+n*l,t[3]=o*c-r*l,t}function Jh(t,e,s){s*=.5;let n=e[0],r=e[1],a=e[2],o=e[3],l=Math.sin(s),c=Math.cos(s);return t[0]=n*c+r*l,t[1]=r*c-n*l,t[2]=a*c+o*l,t[3]=o*c-a*l,t}function Yh(t,e,s,n){let r=e[0],a=e[1],o=e[2],l=e[3],c=s[0],d=s[1],h=s[2],p=s[3],u,f,g,m,y;return f=r*c+a*d+o*h+l*p,f<0&&(f=-f,c=-c,d=-d,h=-h,p=-p),1-f>1e-6?(u=Math.acos(f),g=Math.sin(u),m=Math.sin((1-n)*u)/g,y=Math.sin(n*u)/g):(m=1-n,y=n),t[0]=m*r+y*c,t[1]=m*a+y*d,t[2]=m*o+y*h,t[3]=m*l+y*p,t}function Xh(t,e){let s=e[0],n=e[1],r=e[2],a=e[3],o=s*s+n*n+r*r+a*a,l=o?1/o:0;return t[0]=-s*l,t[1]=-n*l,t[2]=-r*l,t[3]=a*l,t}function Qh(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t[3]=e[3],t}function Zh(t,e){let s=e[0]+e[4]+e[8],n;if(s>0)n=Math.sqrt(s+1),t[3]=.5*n,n=.5/n,t[0]=(e[5]-e[7])*n,t[1]=(e[6]-e[2])*n,t[2]=(e[1]-e[3])*n;else{let r=0;e[4]>e[0]&&(r=1),e[8]>e[r*3+r]&&(r=2);let a=(r+1)%3,o=(r+2)%3;n=Math.sqrt(e[r*3+r]-e[a*3+a]-e[o*3+o]+1),t[r]=.5*n,n=.5/n,t[3]=(e[a*3+o]-e[o*3+a])*n,t[a]=(e[a*3+r]+e[r*3+a])*n,t[o]=(e[o*3+r]+e[r*3+o])*n}return t}function eu(t,e,s="YXZ"){let n=Math.sin(e[0]*.5),r=Math.cos(e[0]*.5),a=Math.sin(e[1]*.5),o=Math.cos(e[1]*.5),l=Math.sin(e[2]*.5),c=Math.cos(e[2]*.5);return s==="XYZ"?(t[0]=n*o*c+r*a*l,t[1]=r*a*c-n*o*l,t[2]=r*o*l+n*a*c,t[3]=r*o*c-n*a*l):s==="YXZ"?(t[0]=n*o*c+r*a*l,t[1]=r*a*c-n*o*l,t[2]=r*o*l-n*a*c,t[3]=r*o*c+n*a*l):s==="ZXY"?(t[0]=n*o*c-r*a*l,t[1]=r*a*c+n*o*l,t[2]=r*o*l+n*a*c,t[3]=r*o*c-n*a*l):s==="ZYX"?(t[0]=n*o*c-r*a*l,t[1]=r*a*c+n*o*l,t[2]=r*o*l-n*a*c,t[3]=r*o*c+n*a*l):s==="YZX"?(t[0]=n*o*c+r*a*l,t[1]=r*a*c+n*o*l,t[2]=r*o*l-n*a*c,t[3]=r*o*c-n*a*l):s==="XZY"&&(t[0]=n*o*c-r*a*l,t[1]=r*a*c-n*o*l,t[2]=r*o*l+n*a*c,t[3]=r*o*c+n*a*l),t}const tu=Uh,su=Wh,nu=Hh,ru=$h;class iu extends Array{constructor(e=0,s=0,n=0,r=1){super(e,s,n,r),this.onChange=()=>{},this._target=this;const a=["0","1","2","3"];return new Proxy(this,{set(o,l){const c=Reflect.set(...arguments);return c&&a.includes(l)&&o.onChange(),c}})}get x(){return this[0]}get y(){return this[1]}get z(){return this[2]}get w(){return this[3]}set x(e){this._target[0]=e,this.onChange()}set y(e){this._target[1]=e,this.onChange()}set z(e){this._target[2]=e,this.onChange()}set w(e){this._target[3]=e,this.onChange()}identity(){return Vh(this._target),this.onChange(),this}set(e,s,n,r){return e.length?this.copy(e):(su(this._target,e,s,n,r),this.onChange(),this)}rotateX(e){return Gh(this._target,this._target,e),this.onChange(),this}rotateY(e){return Kh(this._target,this._target,e),this.onChange(),this}rotateZ(e){return Jh(this._target,this._target,e),this.onChange(),this}inverse(e=this._target){return Xh(this._target,e),this.onChange(),this}conjugate(e=this._target){return Qh(this._target,e),this.onChange(),this}copy(e){return tu(this._target,e),this.onChange(),this}normalize(e=this._target){return ru(this._target,e),this.onChange(),this}multiply(e,s){return s?bn(this._target,e,s):bn(this._target,this._target,e),this.onChange(),this}dot(e){return nu(this._target,e)}fromMatrix3(e){return Zh(this._target,e),this.onChange(),this}fromEuler(e,s){return eu(this._target,e,e.order),s||this.onChange(),this}fromAxisAngle(e,s){return qh(this._target,e,s),this.onChange(),this}slerp(e,s){return Yh(this._target,this._target,e,s),this.onChange(),this}fromArray(e,s=0){return this._target[0]=e[s],this._target[1]=e[s+1],this._target[2]=e[s+2],this._target[3]=e[s+3],this.onChange(),this}toArray(e=[],s=0){return e[s]=this[0],e[s+1]=this[1],e[s+2]=this[2],e[s+3]=this[3],e}}const au=1e-6;function ou(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t}function lu(t,e,s,n,r,a,o,l,c,d,h,p,u,f,g,m,y){return t[0]=e,t[1]=s,t[2]=n,t[3]=r,t[4]=a,t[5]=o,t[6]=l,t[7]=c,t[8]=d,t[9]=h,t[10]=p,t[11]=u,t[12]=f,t[13]=g,t[14]=m,t[15]=y,t}function cu(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function du(t,e){let s=e[0],n=e[1],r=e[2],a=e[3],o=e[4],l=e[5],c=e[6],d=e[7],h=e[8],p=e[9],u=e[10],f=e[11],g=e[12],m=e[13],y=e[14],x=e[15],b=s*l-n*o,v=s*c-r*o,w=s*d-a*o,S=n*c-r*l,I=n*d-a*l,C=r*d-a*c,N=h*m-p*g,R=h*y-u*g,A=h*x-f*g,O=p*y-u*m,P=p*x-f*m,M=u*x-f*y,T=b*M-v*P+w*O+S*A-I*R+C*N;return T?(T=1/T,t[0]=(l*M-c*P+d*O)*T,t[1]=(r*P-n*M-a*O)*T,t[2]=(m*C-y*I+x*S)*T,t[3]=(u*I-p*C-f*S)*T,t[4]=(c*A-o*M-d*R)*T,t[5]=(s*M-r*A+a*R)*T,t[6]=(y*w-g*C-x*v)*T,t[7]=(h*C-u*w+f*v)*T,t[8]=(o*P-l*A+d*N)*T,t[9]=(n*A-s*P-a*N)*T,t[10]=(g*I-m*w+x*b)*T,t[11]=(p*w-h*I-f*b)*T,t[12]=(l*R-o*O-c*N)*T,t[13]=(s*O-n*R+r*N)*T,t[14]=(m*v-g*S-y*b)*T,t[15]=(h*S-p*v+u*b)*T,t):null}function di(t){let e=t[0],s=t[1],n=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],d=t[8],h=t[9],p=t[10],u=t[11],f=t[12],g=t[13],m=t[14],y=t[15],x=e*o-s*a,b=e*l-n*a,v=e*c-r*a,w=s*l-n*o,S=s*c-r*o,I=n*c-r*l,C=d*g-h*f,N=d*m-p*f,R=d*y-u*f,A=h*m-p*g,O=h*y-u*g,P=p*y-u*m;return x*P-b*O+v*A+w*R-S*N+I*C}function vn(t,e,s){let n=e[0],r=e[1],a=e[2],o=e[3],l=e[4],c=e[5],d=e[6],h=e[7],p=e[8],u=e[9],f=e[10],g=e[11],m=e[12],y=e[13],x=e[14],b=e[15],v=s[0],w=s[1],S=s[2],I=s[3];return t[0]=v*n+w*l+S*p+I*m,t[1]=v*r+w*c+S*u+I*y,t[2]=v*a+w*d+S*f+I*x,t[3]=v*o+w*h+S*g+I*b,v=s[4],w=s[5],S=s[6],I=s[7],t[4]=v*n+w*l+S*p+I*m,t[5]=v*r+w*c+S*u+I*y,t[6]=v*a+w*d+S*f+I*x,t[7]=v*o+w*h+S*g+I*b,v=s[8],w=s[9],S=s[10],I=s[11],t[8]=v*n+w*l+S*p+I*m,t[9]=v*r+w*c+S*u+I*y,t[10]=v*a+w*d+S*f+I*x,t[11]=v*o+w*h+S*g+I*b,v=s[12],w=s[13],S=s[14],I=s[15],t[12]=v*n+w*l+S*p+I*m,t[13]=v*r+w*c+S*u+I*y,t[14]=v*a+w*d+S*f+I*x,t[15]=v*o+w*h+S*g+I*b,t}function hu(t,e,s){let n=s[0],r=s[1],a=s[2],o,l,c,d,h,p,u,f,g,m,y,x;return e===t?(t[12]=e[0]*n+e[4]*r+e[8]*a+e[12],t[13]=e[1]*n+e[5]*r+e[9]*a+e[13],t[14]=e[2]*n+e[6]*r+e[10]*a+e[14],t[15]=e[3]*n+e[7]*r+e[11]*a+e[15]):(o=e[0],l=e[1],c=e[2],d=e[3],h=e[4],p=e[5],u=e[6],f=e[7],g=e[8],m=e[9],y=e[10],x=e[11],t[0]=o,t[1]=l,t[2]=c,t[3]=d,t[4]=h,t[5]=p,t[6]=u,t[7]=f,t[8]=g,t[9]=m,t[10]=y,t[11]=x,t[12]=o*n+h*r+g*a+e[12],t[13]=l*n+p*r+m*a+e[13],t[14]=c*n+u*r+y*a+e[14],t[15]=d*n+f*r+x*a+e[15]),t}function uu(t,e,s){let n=s[0],r=s[1],a=s[2];return t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t[3]=e[3]*n,t[4]=e[4]*r,t[5]=e[5]*r,t[6]=e[6]*r,t[7]=e[7]*r,t[8]=e[8]*a,t[9]=e[9]*a,t[10]=e[10]*a,t[11]=e[11]*a,t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t}function pu(t,e,s,n){let r=n[0],a=n[1],o=n[2],l=Math.hypot(r,a,o),c,d,h,p,u,f,g,m,y,x,b,v,w,S,I,C,N,R,A,O,P,M,T,Ae;return Math.abs(l)<au?null:(l=1/l,r*=l,a*=l,o*=l,c=Math.sin(s),d=Math.cos(s),h=1-d,p=e[0],u=e[1],f=e[2],g=e[3],m=e[4],y=e[5],x=e[6],b=e[7],v=e[8],w=e[9],S=e[10],I=e[11],C=r*r*h+d,N=a*r*h+o*c,R=o*r*h-a*c,A=r*a*h-o*c,O=a*a*h+d,P=o*a*h+r*c,M=r*o*h+a*c,T=a*o*h-r*c,Ae=o*o*h+d,t[0]=p*C+m*N+v*R,t[1]=u*C+y*N+w*R,t[2]=f*C+x*N+S*R,t[3]=g*C+b*N+I*R,t[4]=p*A+m*O+v*P,t[5]=u*A+y*O+w*P,t[6]=f*A+x*O+S*P,t[7]=g*A+b*O+I*P,t[8]=p*M+m*T+v*Ae,t[9]=u*M+y*T+w*Ae,t[10]=f*M+x*T+S*Ae,t[11]=g*M+b*T+I*Ae,e!==t&&(t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t)}function fu(t,e){return t[0]=e[12],t[1]=e[13],t[2]=e[14],t}function hi(t,e){let s=e[0],n=e[1],r=e[2],a=e[4],o=e[5],l=e[6],c=e[8],d=e[9],h=e[10];return t[0]=Math.hypot(s,n,r),t[1]=Math.hypot(a,o,l),t[2]=Math.hypot(c,d,h),t}function gu(t){let e=t[0],s=t[1],n=t[2],r=t[4],a=t[5],o=t[6],l=t[8],c=t[9],d=t[10];const h=e*e+s*s+n*n,p=r*r+a*a+o*o,u=l*l+c*c+d*d;return Math.sqrt(Math.max(h,p,u))}const ui=function(){const t=[1,1,1];return function(e,s){let n=t;hi(n,s);let r=1/n[0],a=1/n[1],o=1/n[2],l=s[0]*r,c=s[1]*a,d=s[2]*o,h=s[4]*r,p=s[5]*a,u=s[6]*o,f=s[8]*r,g=s[9]*a,m=s[10]*o,y=l+p+m,x=0;return y>0?(x=Math.sqrt(y+1)*2,e[3]=.25*x,e[0]=(u-g)/x,e[1]=(f-d)/x,e[2]=(c-h)/x):l>p&&l>m?(x=Math.sqrt(1+l-p-m)*2,e[3]=(u-g)/x,e[0]=.25*x,e[1]=(c+h)/x,e[2]=(f+d)/x):p>m?(x=Math.sqrt(1+p-l-m)*2,e[3]=(f-d)/x,e[0]=(c+h)/x,e[1]=.25*x,e[2]=(u+g)/x):(x=Math.sqrt(1+m-l-p)*2,e[3]=(c-h)/x,e[0]=(f+d)/x,e[1]=(u+g)/x,e[2]=.25*x),e}}();function mu(t,e,s,n){let r=Oe([t[0],t[1],t[2]]);const a=Oe([t[4],t[5],t[6]]),o=Oe([t[8],t[9],t[10]]);di(t)<0&&(r=-r),s[0]=t[12],s[1]=t[13],s[2]=t[14];const c=t.slice(),d=1/r,h=1/a,p=1/o;c[0]*=d,c[1]*=d,c[2]*=d,c[4]*=h,c[5]*=h,c[6]*=h,c[8]*=p,c[9]*=p,c[10]*=p,ui(e,c),n[0]=r,n[1]=a,n[2]=o}function xu(t,e,s,n){const r=t,a=e[0],o=e[1],l=e[2],c=e[3],d=a+a,h=o+o,p=l+l,u=a*d,f=a*h,g=a*p,m=o*h,y=o*p,x=l*p,b=c*d,v=c*h,w=c*p,S=n[0],I=n[1],C=n[2];return r[0]=(1-(m+x))*S,r[1]=(f+w)*S,r[2]=(g-v)*S,r[3]=0,r[4]=(f-w)*I,r[5]=(1-(u+x))*I,r[6]=(y+b)*I,r[7]=0,r[8]=(g+v)*C,r[9]=(y-b)*C,r[10]=(1-(u+m))*C,r[11]=0,r[12]=s[0],r[13]=s[1],r[14]=s[2],r[15]=1,r}function yu(t,e){let s=e[0],n=e[1],r=e[2],a=e[3],o=s+s,l=n+n,c=r+r,d=s*o,h=n*o,p=n*l,u=r*o,f=r*l,g=r*c,m=a*o,y=a*l,x=a*c;return t[0]=1-p-g,t[1]=h+x,t[2]=u-y,t[3]=0,t[4]=h-x,t[5]=1-d-g,t[6]=f+m,t[7]=0,t[8]=u+y,t[9]=f-m,t[10]=1-d-p,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function bu(t,e,s,n,r){let a=1/Math.tan(e/2),o=1/(n-r);return t[0]=a/s,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=a,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=(r+n)*o,t[11]=-1,t[12]=0,t[13]=0,t[14]=2*r*n*o,t[15]=0,t}function vu(t,e,s,n,r,a,o){let l=1/(e-s),c=1/(n-r),d=1/(a-o);return t[0]=-2*l,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=-2*c,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=2*d,t[11]=0,t[12]=(e+s)*l,t[13]=(r+n)*c,t[14]=(o+a)*d,t[15]=1,t}function wu(t,e,s,n){let r=e[0],a=e[1],o=e[2],l=n[0],c=n[1],d=n[2],h=r-s[0],p=a-s[1],u=o-s[2],f=h*h+p*p+u*u;f===0?u=1:(f=1/Math.sqrt(f),h*=f,p*=f,u*=f);let g=c*u-d*p,m=d*h-l*u,y=l*p-c*h;return f=g*g+m*m+y*y,f===0&&(d?l+=1e-6:c?d+=1e-6:c+=1e-6,g=c*u-d*p,m=d*h-l*u,y=l*p-c*h,f=g*g+m*m+y*y),f=1/Math.sqrt(f),g*=f,m*=f,y*=f,t[0]=g,t[1]=m,t[2]=y,t[3]=0,t[4]=p*y-u*m,t[5]=u*g-h*y,t[6]=h*m-p*g,t[7]=0,t[8]=h,t[9]=p,t[10]=u,t[11]=0,t[12]=r,t[13]=a,t[14]=o,t[15]=1,t}function wn(t,e,s){return t[0]=e[0]+s[0],t[1]=e[1]+s[1],t[2]=e[2]+s[2],t[3]=e[3]+s[3],t[4]=e[4]+s[4],t[5]=e[5]+s[5],t[6]=e[6]+s[6],t[7]=e[7]+s[7],t[8]=e[8]+s[8],t[9]=e[9]+s[9],t[10]=e[10]+s[10],t[11]=e[11]+s[11],t[12]=e[12]+s[12],t[13]=e[13]+s[13],t[14]=e[14]+s[14],t[15]=e[15]+s[15],t}function _n(t,e,s){return t[0]=e[0]-s[0],t[1]=e[1]-s[1],t[2]=e[2]-s[2],t[3]=e[3]-s[3],t[4]=e[4]-s[4],t[5]=e[5]-s[5],t[6]=e[6]-s[6],t[7]=e[7]-s[7],t[8]=e[8]-s[8],t[9]=e[9]-s[9],t[10]=e[10]-s[10],t[11]=e[11]-s[11],t[12]=e[12]-s[12],t[13]=e[13]-s[13],t[14]=e[14]-s[14],t[15]=e[15]-s[15],t}function _u(t,e,s){return t[0]=e[0]*s,t[1]=e[1]*s,t[2]=e[2]*s,t[3]=e[3]*s,t[4]=e[4]*s,t[5]=e[5]*s,t[6]=e[6]*s,t[7]=e[7]*s,t[8]=e[8]*s,t[9]=e[9]*s,t[10]=e[10]*s,t[11]=e[11]*s,t[12]=e[12]*s,t[13]=e[13]*s,t[14]=e[14]*s,t[15]=e[15]*s,t}class ot extends Array{constructor(e=1,s=0,n=0,r=0,a=0,o=1,l=0,c=0,d=0,h=0,p=1,u=0,f=0,g=0,m=0,y=1){return super(e,s,n,r,a,o,l,c,d,h,p,u,f,g,m,y),this}get x(){return this[12]}get y(){return this[13]}get z(){return this[14]}get w(){return this[15]}set x(e){this[12]=e}set y(e){this[13]=e}set z(e){this[14]=e}set w(e){this[15]=e}set(e,s,n,r,a,o,l,c,d,h,p,u,f,g,m,y){return e.length?this.copy(e):(lu(this,e,s,n,r,a,o,l,c,d,h,p,u,f,g,m,y),this)}translate(e,s=this){return hu(this,s,e),this}rotate(e,s,n=this){return pu(this,n,e,s),this}scale(e,s=this){return uu(this,s,typeof e=="number"?[e,e,e]:e),this}add(e,s){return s?wn(this,e,s):wn(this,this,e),this}sub(e,s){return s?_n(this,e,s):_n(this,this,e),this}multiply(e,s){return e.length?s?vn(this,e,s):vn(this,this,e):_u(this,this,e),this}identity(){return cu(this),this}copy(e){return ou(this,e),this}fromPerspective({fov:e,aspect:s,near:n,far:r}={}){return bu(this,e,s,n,r),this}fromOrthogonal({left:e,right:s,bottom:n,top:r,near:a,far:o}){return vu(this,e,s,n,r,a,o),this}fromQuaternion(e){return yu(this,e),this}setPosition(e){return this.x=e[0],this.y=e[1],this.z=e[2],this}inverse(e=this){return du(this,e),this}compose(e,s,n){return xu(this,e,s,n),this}decompose(e,s,n){return mu(this,e,s,n),this}getRotation(e){return ui(e,this),this}getTranslation(e){return fu(e,this),this}getScaling(e){return hi(e,this),this}getMaxScaleOnAxis(){return gu(this)}lookAt(e,s,n){return wu(this,e,s,n),this}determinant(){return di(this)}fromArray(e,s=0){return this[0]=e[s],this[1]=e[s+1],this[2]=e[s+2],this[3]=e[s+3],this[4]=e[s+4],this[5]=e[s+5],this[6]=e[s+6],this[7]=e[s+7],this[8]=e[s+8],this[9]=e[s+9],this[10]=e[s+10],this[11]=e[s+11],this[12]=e[s+12],this[13]=e[s+13],this[14]=e[s+14],this[15]=e[s+15],this}toArray(e=[],s=0){return e[s]=this[0],e[s+1]=this[1],e[s+2]=this[2],e[s+3]=this[3],e[s+4]=this[4],e[s+5]=this[5],e[s+6]=this[6],e[s+7]=this[7],e[s+8]=this[8],e[s+9]=this[9],e[s+10]=this[10],e[s+11]=this[11],e[s+12]=this[12],e[s+13]=this[13],e[s+14]=this[14],e[s+15]=this[15],e}}function Su(t,e,s="YXZ"){return s==="XYZ"?(t[1]=Math.asin(Math.min(Math.max(e[8],-1),1)),Math.abs(e[8])<.99999?(t[0]=Math.atan2(-e[9],e[10]),t[2]=Math.atan2(-e[4],e[0])):(t[0]=Math.atan2(e[6],e[5]),t[2]=0)):s==="YXZ"?(t[0]=Math.asin(-Math.min(Math.max(e[9],-1),1)),Math.abs(e[9])<.99999?(t[1]=Math.atan2(e[8],e[10]),t[2]=Math.atan2(e[1],e[5])):(t[1]=Math.atan2(-e[2],e[0]),t[2]=0)):s==="ZXY"?(t[0]=Math.asin(Math.min(Math.max(e[6],-1),1)),Math.abs(e[6])<.99999?(t[1]=Math.atan2(-e[2],e[10]),t[2]=Math.atan2(-e[4],e[5])):(t[1]=0,t[2]=Math.atan2(e[1],e[0]))):s==="ZYX"?(t[1]=Math.asin(-Math.min(Math.max(e[2],-1),1)),Math.abs(e[2])<.99999?(t[0]=Math.atan2(e[6],e[10]),t[2]=Math.atan2(e[1],e[0])):(t[0]=0,t[2]=Math.atan2(-e[4],e[5]))):s==="YZX"?(t[2]=Math.asin(Math.min(Math.max(e[1],-1),1)),Math.abs(e[1])<.99999?(t[0]=Math.atan2(-e[9],e[5]),t[1]=Math.atan2(-e[2],e[0])):(t[0]=0,t[1]=Math.atan2(e[8],e[10]))):s==="XZY"&&(t[2]=Math.asin(-Math.min(Math.max(e[4],-1),1)),Math.abs(e[4])<.99999?(t[0]=Math.atan2(e[6],e[5]),t[1]=Math.atan2(e[8],e[0])):(t[0]=Math.atan2(-e[9],e[10]),t[1]=0)),t}const Sn=new ot;class Iu extends Array{constructor(e=0,s=e,n=e,r="YXZ"){super(e,s,n),this.order=r,this.onChange=()=>{},this._target=this;const a=["0","1","2"];return new Proxy(this,{set(o,l){const c=Reflect.set(...arguments);return c&&a.includes(l)&&o.onChange(),c}})}get x(){return this[0]}get y(){return this[1]}get z(){return this[2]}set x(e){this._target[0]=e,this.onChange()}set y(e){this._target[1]=e,this.onChange()}set z(e){this._target[2]=e,this.onChange()}set(e,s=e,n=e){return e.length?this.copy(e):(this._target[0]=e,this._target[1]=s,this._target[2]=n,this.onChange(),this)}copy(e){return this._target[0]=e[0],this._target[1]=e[1],this._target[2]=e[2],this.onChange(),this}reorder(e){return this._target.order=e,this.onChange(),this}fromRotationMatrix(e,s=this.order){return Su(this._target,e,s),this.onChange(),this}fromQuaternion(e,s=this.order,n){return Sn.fromQuaternion(e),this._target.fromRotationMatrix(Sn,s),n||this.onChange(),this}fromArray(e,s=0){return this._target[0]=e[s],this._target[1]=e[s+1],this._target[2]=e[s+2],this}toArray(e=[],s=0){return e[s]=this[0],e[s+1]=this[1],e[s+2]=this[2],e}}class Eu{constructor(){this.parent=null,this.children=[],this.visible=!0,this.matrix=new ot,this.worldMatrix=new ot,this.matrixAutoUpdate=!0,this.worldMatrixNeedsUpdate=!1,this.position=new U,this.quaternion=new iu,this.scale=new U(1),this.rotation=new Iu,this.up=new U(0,1,0),this.rotation._target.onChange=()=>this.quaternion.fromEuler(this.rotation,!0),this.quaternion._target.onChange=()=>this.rotation.fromQuaternion(this.quaternion,void 0,!0)}setParent(e,s=!0){this.parent&&e!==this.parent&&this.parent.removeChild(this,!1),this.parent=e,s&&e&&e.addChild(this,!1)}addChild(e,s=!0){~this.children.indexOf(e)||this.children.push(e),s&&e.setParent(this,!1)}removeChild(e,s=!0){~this.children.indexOf(e)&&this.children.splice(this.children.indexOf(e),1),s&&e.setParent(null,!1)}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.worldMatrixNeedsUpdate||e)&&(this.parent===null?this.worldMatrix.copy(this.matrix):this.worldMatrix.multiply(this.parent.worldMatrix,this.matrix),this.worldMatrixNeedsUpdate=!1,e=!0);for(let s=0,n=this.children.length;s<n;s++)this.children[s].updateMatrixWorld(e)}updateMatrix(){this.matrix.compose(this.quaternion,this.position,this.scale),this.worldMatrixNeedsUpdate=!0}traverse(e){if(!e(this))for(let s=0,n=this.children.length;s<n;s++)this.children[s].traverse(e)}decompose(){this.matrix.decompose(this.quaternion._target,this.position,this.scale),this.rotation.fromQuaternion(this.quaternion)}lookAt(e,s=!1){s?this.matrix.lookAt(this.position,e,this.up):this.matrix.lookAt(e,this.position,this.up),this.matrix.getRotation(this.quaternion._target),this.rotation.fromQuaternion(this.quaternion)}}function Tu(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[4],t[4]=e[5],t[5]=e[6],t[6]=e[8],t[7]=e[9],t[8]=e[10],t}function Cu(t,e){let s=e[0],n=e[1],r=e[2],a=e[3],o=s+s,l=n+n,c=r+r,d=s*o,h=n*o,p=n*l,u=r*o,f=r*l,g=r*c,m=a*o,y=a*l,x=a*c;return t[0]=1-p-g,t[3]=h-x,t[6]=u+y,t[1]=h+x,t[4]=1-d-g,t[7]=f-m,t[2]=u-y,t[5]=f+m,t[8]=1-d-p,t}function ku(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t}function ju(t,e,s,n,r,a,o,l,c,d){return t[0]=e,t[1]=s,t[2]=n,t[3]=r,t[4]=a,t[5]=o,t[6]=l,t[7]=c,t[8]=d,t}function Au(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t}function Nu(t,e){let s=e[0],n=e[1],r=e[2],a=e[3],o=e[4],l=e[5],c=e[6],d=e[7],h=e[8],p=h*o-l*d,u=-h*a+l*c,f=d*a-o*c,g=s*p+n*u+r*f;return g?(g=1/g,t[0]=p*g,t[1]=(-h*n+r*d)*g,t[2]=(l*n-r*o)*g,t[3]=u*g,t[4]=(h*s-r*c)*g,t[5]=(-l*s+r*a)*g,t[6]=f*g,t[7]=(-d*s+n*c)*g,t[8]=(o*s-n*a)*g,t):null}function In(t,e,s){let n=e[0],r=e[1],a=e[2],o=e[3],l=e[4],c=e[5],d=e[6],h=e[7],p=e[8],u=s[0],f=s[1],g=s[2],m=s[3],y=s[4],x=s[5],b=s[6],v=s[7],w=s[8];return t[0]=u*n+f*o+g*d,t[1]=u*r+f*l+g*h,t[2]=u*a+f*c+g*p,t[3]=m*n+y*o+x*d,t[4]=m*r+y*l+x*h,t[5]=m*a+y*c+x*p,t[6]=b*n+v*o+w*d,t[7]=b*r+v*l+w*h,t[8]=b*a+v*c+w*p,t}function Ru(t,e,s){let n=e[0],r=e[1],a=e[2],o=e[3],l=e[4],c=e[5],d=e[6],h=e[7],p=e[8],u=s[0],f=s[1];return t[0]=n,t[1]=r,t[2]=a,t[3]=o,t[4]=l,t[5]=c,t[6]=u*n+f*o+d,t[7]=u*r+f*l+h,t[8]=u*a+f*c+p,t}function Ou(t,e,s){let n=e[0],r=e[1],a=e[2],o=e[3],l=e[4],c=e[5],d=e[6],h=e[7],p=e[8],u=Math.sin(s),f=Math.cos(s);return t[0]=f*n+u*o,t[1]=f*r+u*l,t[2]=f*a+u*c,t[3]=f*o-u*n,t[4]=f*l-u*r,t[5]=f*c-u*a,t[6]=d,t[7]=h,t[8]=p,t}function Pu(t,e,s){let n=s[0],r=s[1];return t[0]=n*e[0],t[1]=n*e[1],t[2]=n*e[2],t[3]=r*e[3],t[4]=r*e[4],t[5]=r*e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t}function Mu(t,e){let s=e[0],n=e[1],r=e[2],a=e[3],o=e[4],l=e[5],c=e[6],d=e[7],h=e[8],p=e[9],u=e[10],f=e[11],g=e[12],m=e[13],y=e[14],x=e[15],b=s*l-n*o,v=s*c-r*o,w=s*d-a*o,S=n*c-r*l,I=n*d-a*l,C=r*d-a*c,N=h*m-p*g,R=h*y-u*g,A=h*x-f*g,O=p*y-u*m,P=p*x-f*m,M=u*x-f*y,T=b*M-v*P+w*O+S*A-I*R+C*N;return T?(T=1/T,t[0]=(l*M-c*P+d*O)*T,t[1]=(c*A-o*M-d*R)*T,t[2]=(o*P-l*A+d*N)*T,t[3]=(r*P-n*M-a*O)*T,t[4]=(s*M-r*A+a*R)*T,t[5]=(n*A-s*P-a*N)*T,t[6]=(m*C-y*I+x*S)*T,t[7]=(y*w-g*C-x*v)*T,t[8]=(g*I-m*w+x*b)*T,t):null}class Fu extends Array{constructor(e=1,s=0,n=0,r=0,a=1,o=0,l=0,c=0,d=1){return super(e,s,n,r,a,o,l,c,d),this}set(e,s,n,r,a,o,l,c,d){return e.length?this.copy(e):(ju(this,e,s,n,r,a,o,l,c,d),this)}translate(e,s=this){return Ru(this,s,e),this}rotate(e,s=this){return Ou(this,s,e),this}scale(e,s=this){return Pu(this,s,e),this}multiply(e,s){return s?In(this,e,s):In(this,this,e),this}identity(){return Au(this),this}copy(e){return ku(this,e),this}fromMatrix4(e){return Tu(this,e),this}fromQuaternion(e){return Cu(this,e),this}fromBasis(e,s,n){return this.set(e[0],e[1],e[2],s[0],s[1],s[2],n[0],n[1],n[2]),this}inverse(e=this){return Nu(this,e),this}getNormalMatrix(e){return Mu(this,e),this}}let Du=0;class Lu extends Eu{constructor(e,{geometry:s,program:n,mode:r=e.TRIANGLES,frustumCulled:a=!0,renderOrder:o=0}={}){super(),e.canvas||console.error("gl not passed as first argument to Mesh"),this.gl=e,this.id=Du++,this.geometry=s,this.program=n,this.mode=r,this.frustumCulled=a,this.renderOrder=o,this.modelViewMatrix=new ot,this.normalMatrix=new Fu,this.beforeRenderCallbacks=[],this.afterRenderCallbacks=[]}onBeforeRender(e){return this.beforeRenderCallbacks.push(e),this}onAfterRender(e){return this.afterRenderCallbacks.push(e),this}draw({camera:e}={}){e&&(this.program.uniforms.modelMatrix||Object.assign(this.program.uniforms,{modelMatrix:{value:null},viewMatrix:{value:null},modelViewMatrix:{value:null},normalMatrix:{value:null},projectionMatrix:{value:null},cameraPosition:{value:null}}),this.program.uniforms.projectionMatrix.value=e.projectionMatrix,this.program.uniforms.cameraPosition.value=e.worldPosition,this.program.uniforms.viewMatrix.value=e.viewMatrix,this.modelViewMatrix.multiply(e.viewMatrix,this.worldMatrix),this.normalMatrix.getNormalMatrix(this.modelViewMatrix),this.program.uniforms.modelMatrix.value=this.worldMatrix,this.program.uniforms.modelViewMatrix.value=this.modelViewMatrix,this.program.uniforms.normalMatrix.value=this.normalMatrix),this.beforeRenderCallbacks.forEach(n=>n&&n({mesh:this,camera:e}));let s=this.program.cullFace&&this.worldMatrix.determinant()<0;this.program.use({flipFaces:s}),this.geometry.draw({mode:this.mode,program:this.program}),this.afterRenderCallbacks.forEach(n=>n&&n({mesh:this,camera:e}))}}class zu extends Oh{constructor(e,{attributes:s={}}={}){Object.assign(s,{position:{size:2,data:new Float32Array([-1,-1,3,-1,-1,3])},uv:{size:2,data:new Float32Array([0,0,2,0,0,2])}}),super(e,s)}}const Bu=t=>{const e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);return e?[parseInt(e[1],16)/255,parseInt(e[2],16)/255,parseInt(e[3],16)/255]:[1,.42,.21]},Uu=`#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`,Wu=`#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;
out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;
  
  vec2 mouseOffset = (uMouse - center) * 0.0002;
  C += mouseOffset * length(C - center) * step(0.5, uMouseInteractive);
  
  float i = 0.0, d = 0.0, z = 0.0, T = iTime * uSpeed * uDirection;
  vec3 O = vec3(0.0), p, S;
  o = vec4(1.0);

  for (vec2 r = iResolution.xy, Q; i < 50.0; i += 1.0) {
    p = z * normalize(vec3(C - 0.5 * r, r.y)); 
    p.z -= 4.0; 
    S = p;
    d = p.y - T;
    
    p.x += 0.4 * (1.0 + p.y) * sin(d + p.x * 0.1) * cos(0.34 * d + p.x * 0.05); 
    Q = p.xz * mat2(cos(p.y + vec4(0, 11, 33, 0) - T)); 
    p.xz = Q;

    d = abs(sqrt(length(Q * Q)) - 0.25 * (5.0 + S.y)) / 3.0 + 0.0008; 
    z += d;
    o = 1.0 + sin(S.y + p.z * 0.5 + S.z - length(S - p) + vec4(2, 1, 0, 8));
    O += (o.w / max(0.001, d)) * o.xyz;
  }
  
  o.xyz = clamp(O / 6000.0, 0.0, 1.0);
}

bool finite1(float x){ return !(isnan(x) || isinf(x)); }
vec3 sanitize(vec3 c){
  return vec3(
    finite1(c.r) ? c.r : 0.0,
    finite1(c.g) ? c.g : 0.0,
    finite1(c.b) ? c.b : 0.0
  );
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  vec3 rgb = sanitize(o.rgb);
  
  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  vec3 customColor = intensity * uCustomColor;
  vec3 finalColor = mix(rgb, customColor, step(0.5, uUseCustomColor));
  
  float alpha = clamp(length(rgb) * uOpacity * 1.5, 0.0, 1.0);
  fragColor = vec4(finalColor, alpha);
}`,$u=({color:t="#ff6b35",speed:e=.6,direction:s="forward",scale:n=1.1,opacity:r=.85,mouseInteractive:a=!0})=>{const o=_.useRef(null),l=_.useRef({x:0,y:0});return _.useEffect(()=>{if(!o.current)return;const c=t?1:0,d=t?Bu(t):[1,.42,.21],h=s==="reverse"?-1:1,p=new Bh({webgl:2,alpha:!0,antialias:!1,dpr:Math.min(window.devicePixelRatio||1,2)}),u=p.gl,f=u.canvas;f.style.display="block",f.style.width="100%",f.style.height="100%",o.current.appendChild(f);const g=new zu(u),m=new Mh(u,{vertex:Uu,fragment:Wu,uniforms:{iTime:{value:0},iResolution:{value:new Float32Array([1,1])},uCustomColor:{value:new Float32Array(d)},uUseCustomColor:{value:c},uSpeed:{value:e*.4},uDirection:{value:h},uScale:{value:n},uOpacity:{value:r},uMouse:{value:new Float32Array([0,0])},uMouseInteractive:{value:a?1:0}}}),y=new Lu(u,{geometry:g,program:m}),x=C=>{if(!a||!o.current)return;const N=o.current.getBoundingClientRect();l.current.x=C.clientX-N.left,l.current.y=C.clientY-N.top;const R=m.uniforms.uMouse.value;R[0]=l.current.x,R[1]=l.current.y};a&&o.current.addEventListener("mousemove",x);const b=()=>{if(!o.current)return;const C=o.current.getBoundingClientRect(),N=Math.max(1,Math.floor(C.width)),R=Math.max(1,Math.floor(C.height));p.setSize(N,R);const A=m.uniforms.iResolution.value;A[0]=u.drawingBufferWidth,A[1]=u.drawingBufferHeight},v=new ResizeObserver(b);v.observe(o.current),b();let w=0;const S=performance.now(),I=C=>{let N=(C-S)*.001;if(s==="pingpong"){const A=N%20,O=A>10?10*2-A:A;m.uniforms.iTime.value=O}else m.uniforms.iTime.value=N;p.render({scene:y}),w=requestAnimationFrame(I)};return w=requestAnimationFrame(I),()=>{cancelAnimationFrame(w),v.disconnect(),a&&o.current&&o.current.removeEventListener("mousemove",x);try{o.current&&f.parentNode===o.current&&o.current.removeChild(f)}catch(C){console.warn("Plasma cleanup failed:",C)}}},[t,e,s,n,r,a]),i.jsx("div",{ref:o,style:{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0,overflow:"hidden"}})};function Hu(){const[t,e]=_.useState(""),[s,n]=_.useState(""),[r,a]=_.useState(!1),[o,l]=_.useState(""),c=ct(),d=async()=>{l(""),a(!0);try{const f=(await nt(it,ri)).user,g=f.displayName||(f.email?f.email.split("@")[0]:""),m=await at({provider:"google",email:f.email,name:g||void 0});m.token&&(localStorage.setItem("sycnops_token",m.token),localStorage.setItem("sycnops_user",JSON.stringify(m.user)),window.dispatchEvent(new Event("sycnops_user_updated"))),c("/dashboard")}catch(u){if(u.code!=="auth/popup-closed-by-user"){const f=u.message||"",g=f.includes("NetworkError")||f.includes("fetch")?"Unable to connect to backend server.":f||"Failed to authenticate with Google.";l(g)}}finally{a(!1)}},h=async()=>{l(""),a(!0);try{const f=(await nt(it,ii)).user,g=await at({provider:"github",email:f.email,name:f.displayName||void 0});g.token&&(localStorage.setItem("sycnops_token",g.token),localStorage.setItem("sycnops_user",JSON.stringify(g.user)),window.dispatchEvent(new Event("sycnops_user_updated"))),c("/dashboard")}catch(u){if(u.code!=="auth/popup-closed-by-user"){const f=u.message||"",g=f.includes("NetworkError")||f.includes("fetch")?"Unable to connect to backend server.":f||"Failed to authenticate with GitHub.";l(g)}}finally{a(!1)}},p=async u=>{u.preventDefault(),l(""),a(!0);try{const f=await gh({email:t,password:s});f.token&&(localStorage.setItem("sycnops_token",f.token),localStorage.setItem("sycnops_user",JSON.stringify(f.user)),window.dispatchEvent(new Event("sycnops_user_updated"))),c("/dashboard")}catch(f){const g=f.message||"",m=g.includes("NetworkError")||g.includes("fetch")?"Unable to connect to authentication server.":g||"Authentication failed. Please check your email and password.";l(m)}finally{a(!1)}};return i.jsxs("div",{className:"s-auth",children:[i.jsxs("div",{className:"s-auth__brand",children:[i.jsxs(L,{to:"/",className:"s-nav__logo",style:{color:"var(--ground)"},children:["SycnOps",i.jsx("span",{className:"s-nav__logo-period",children:"."})]}),i.jsxs("div",{children:[i.jsxs("h1",{className:"s-auth__title",children:["Enter the ",i.jsx("br",{}),i.jsx("span",{className:"s-auth__title-em",children:"studio"})]}),i.jsx("p",{className:"s-auth__prose",children:"Authenticate to access your automated architectures and client portal."})]}),i.jsx("div",{style:{fontFamily:"var(--font-mono)",fontSize:"10.5px",letterSpacing:".15em",textTransform:"uppercase",color:"rgba(231,227,218,0.5)"},children:"SECURE PROTOCOL / 2026"})]}),i.jsxs("div",{className:"s-auth__panel",children:[i.jsx($u,{color:"#ff6b35",speed:.6,direction:"forward",scale:1.1,opacity:.85,mouseInteractive:!0}),i.jsxs("div",{className:"s-auth__box",children:[i.jsxs("div",{style:{marginBottom:"24px"},children:[i.jsx("span",{className:"s-overline",children:"Authorization"}),i.jsx("h2",{style:{fontFamily:"var(--font-serif)",fontSize:"32px",letterSpacing:"-.015em",color:"var(--ink)"},children:"Sign In"})]}),i.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"24px"},children:[i.jsxs("button",{type:"button",onClick:()=>d(),disabled:r,style:{display:"flex",alignItems:"center",justifyContent:"center",gap:"10px",padding:"10px 16px",backgroundColor:"var(--ground)",border:"1px solid var(--hair)",borderRadius:"6px",fontSize:"13px",fontWeight:500,color:"var(--ink)",cursor:"pointer",transition:"all 0.2s ease",boxShadow:"0 1px 2px rgba(0,0,0,0.05)"},onMouseOver:u=>u.currentTarget.style.borderColor="var(--ink-2)",onMouseOut:u=>u.currentTarget.style.borderColor="var(--hair)",children:[i.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",children:[i.jsx("path",{fill:"#4285F4",d:"M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"}),i.jsx("path",{fill:"#34A853",d:"M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"}),i.jsx("path",{fill:"#FBBC05",d:"M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"}),i.jsx("path",{fill:"#EA4335",d:"M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"})]}),"Google"]}),i.jsxs("button",{type:"button",onClick:h,disabled:r,style:{display:"flex",alignItems:"center",justifyContent:"center",gap:"10px",padding:"10px 16px",backgroundColor:"var(--ground)",border:"1px solid var(--hair)",borderRadius:"6px",fontSize:"13px",fontWeight:500,color:"var(--ink)",cursor:"pointer",transition:"all 0.2s ease",boxShadow:"0 1px 2px rgba(0,0,0,0.05)"},onMouseOver:u=>u.currentTarget.style.borderColor="var(--ink-2)",onMouseOut:u=>u.currentTarget.style.borderColor="var(--hair)",children:[i.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"currentColor",children:i.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"})}),"GitHub"]})]}),i.jsxs("div",{style:{display:"flex",alignItems:"center",margin:"24px 0",gap:"12px"},children:[i.jsx("div",{style:{flex:1,height:"1px",backgroundColor:"var(--hair)"}}),i.jsx("span",{style:{fontFamily:"var(--font-mono)",fontSize:"11px",color:"var(--ink-2)",textTransform:"uppercase",letterSpacing:"0.05em"},children:"or continue with email"}),i.jsx("div",{style:{flex:1,height:"1px",backgroundColor:"var(--hair)"}})]}),o&&i.jsx("div",{style:{backgroundColor:"rgba(217, 83, 79, 0.1)",border:"1px solid rgba(217, 83, 79, 0.4)",color:"#d9534f",padding:"12px 16px",borderRadius:"4px",marginBottom:"24px",fontFamily:"var(--font-mono)",fontSize:"12px"},children:o}),i.jsxs("form",{onSubmit:p,className:"s-form",children:[i.jsxs("div",{className:"s-form__group",children:[i.jsx("label",{className:"s-form__label",children:"Email Address"}),i.jsx("input",{type:"email",className:"s-form__input",placeholder:"architect@studio.com",value:t,onChange:u=>e(u.target.value),required:!0})]}),i.jsxs("div",{className:"s-form__group",children:[i.jsx("label",{className:"s-form__label",children:"Password"}),i.jsx("input",{type:"password",className:"s-form__input",placeholder:"••••••••",value:s,onChange:u=>n(u.target.value),required:!0})]}),i.jsx("button",{type:"submit",className:"s-btn",style:{marginTop:"16px",width:"100%"},disabled:r,children:r?"Authenticating...":"Authenticate"})]}),i.jsxs("div",{style:{marginTop:"48px",paddingTop:"24px",borderTop:"1px solid var(--hair)",fontFamily:"var(--font-mono)",fontSize:"11px",color:"var(--ink-2)"},children:["No existing credentials? ",i.jsx(L,{to:"/register",style:{color:"var(--pigment)",textDecoration:"none",fontWeight:600},children:"Request Access"})]})]})]})]})}function Vu(){const[t,e]=_.useState(""),[s,n]=_.useState(""),[r,a]=_.useState(""),[o,l]=_.useState(!1),[c,d]=_.useState(""),h=ct(),p=async g=>{g.preventDefault(),d(""),l(!0);try{const m=await fh({name:t,email:s,password:r});m.token&&(localStorage.setItem("sycnops_token",m.token),localStorage.setItem("sycnops_user",JSON.stringify(m.user))),h("/dashboard")}catch(m){const y=m.message||"",x=y.includes("NetworkError")||y.includes("fetch")?"Unable to connect to registration server.":y||"Failed to create account. Please check your network or inputs.";d(x)}finally{l(!1)}},u=async()=>{d(""),l(!0);try{const m=(await nt(it,ri)).user,y=m.displayName||(m.email?m.email.split("@")[0]:""),x=await at({provider:"google",email:m.email,name:y||void 0});x.token&&(localStorage.setItem("sycnops_token",x.token),localStorage.setItem("sycnops_user",JSON.stringify(x.user)),window.dispatchEvent(new Event("sycnops_user_updated"))),h("/dashboard")}catch(g){if(g.code!=="auth/popup-closed-by-user"){const m=g.message||"",y=m.includes("NetworkError")||m.includes("fetch")?"Unable to connect to backend server.":m||"Failed to authenticate with Google.";d(y)}}finally{l(!1)}},f=async()=>{d(""),l(!0);try{const m=(await nt(it,ii)).user,y=await at({provider:"github",email:m.email,name:m.displayName||void 0});y.token&&(localStorage.setItem("sycnops_token",y.token),localStorage.setItem("sycnops_user",JSON.stringify(y.user)),window.dispatchEvent(new Event("sycnops_user_updated"))),h("/dashboard")}catch(g){if(g.code!=="auth/popup-closed-by-user"){const m=g.message||"",y=m.includes("NetworkError")||m.includes("fetch")?"Unable to connect to backend server.":m||"Failed to authenticate with GitHub.";d(y)}}finally{l(!1)}};return i.jsxs("div",{className:"s-auth",children:[i.jsxs("div",{className:"s-auth__brand",children:[i.jsxs(L,{to:"/",className:"s-nav__logo",style:{color:"var(--ground)"},children:["SycnOps",i.jsx("span",{className:"s-nav__logo-period",children:"."})]}),i.jsxs("div",{children:[i.jsxs("h1",{className:"s-auth__title",children:["Begin the ",i.jsx("br",{}),i.jsx("span",{className:"s-auth__title-em",children:"practice"})]}),i.jsx("p",{className:"s-auth__prose",children:"Initialize your architecture. Set up a free account to gain access to automated pipelines and studio tools."})]}),i.jsx("div",{style:{fontFamily:"var(--font-mono)",fontSize:"10.5px",letterSpacing:".15em",textTransform:"uppercase",color:"rgba(231,227,218,0.5)"},children:"NEW INSTANCE / 2026"})]}),i.jsx("div",{className:"s-auth__panel",children:i.jsxs("div",{className:"s-auth__box",children:[i.jsxs("div",{style:{marginBottom:"24px"},children:[i.jsx("span",{className:"s-overline",children:"Initialization"}),i.jsx("h2",{style:{fontFamily:"var(--font-serif)",fontSize:"32px",letterSpacing:"-.015em",color:"var(--ink)"},children:"Create Account"})]}),i.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"24px"},children:[i.jsxs("button",{type:"button",onClick:()=>u(),disabled:o,style:{display:"flex",alignItems:"center",justifyContent:"center",gap:"10px",padding:"10px 16px",backgroundColor:"var(--ground)",border:"1px solid var(--hair)",borderRadius:"6px",fontSize:"13px",fontWeight:500,color:"var(--ink)",cursor:"pointer",transition:"all 0.2s ease",boxShadow:"0 1px 2px rgba(0,0,0,0.05)"},onMouseOver:g=>g.currentTarget.style.borderColor="var(--ink-2)",onMouseOut:g=>g.currentTarget.style.borderColor="var(--hair)",children:[i.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",children:[i.jsx("path",{fill:"#4285F4",d:"M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"}),i.jsx("path",{fill:"#34A853",d:"M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"}),i.jsx("path",{fill:"#FBBC05",d:"M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"}),i.jsx("path",{fill:"#EA4335",d:"M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"})]}),"Google"]}),i.jsxs("button",{type:"button",onClick:()=>f(),disabled:o,style:{display:"flex",alignItems:"center",justifyContent:"center",gap:"10px",padding:"10px 16px",backgroundColor:"var(--ground)",border:"1px solid var(--hair)",borderRadius:"6px",fontSize:"13px",fontWeight:500,color:"var(--ink)",cursor:"pointer",transition:"all 0.2s ease",boxShadow:"0 1px 2px rgba(0,0,0,0.05)"},onMouseOver:g=>g.currentTarget.style.borderColor="var(--ink-2)",onMouseOut:g=>g.currentTarget.style.borderColor="var(--hair)",children:[i.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"currentColor",children:i.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"})}),"GitHub"]})]}),i.jsxs("div",{style:{display:"flex",alignItems:"center",margin:"24px 0",gap:"12px"},children:[i.jsx("div",{style:{flex:1,height:"1px",backgroundColor:"var(--hair)"}}),i.jsx("span",{style:{fontFamily:"var(--font-mono)",fontSize:"11px",color:"var(--ink-2)",textTransform:"uppercase",letterSpacing:"0.05em"},children:"or continue with email"}),i.jsx("div",{style:{flex:1,height:"1px",backgroundColor:"var(--hair)"}})]}),c&&i.jsx("div",{style:{backgroundColor:"rgba(217, 83, 79, 0.1)",border:"1px solid rgba(217, 83, 79, 0.4)",color:"#d9534f",padding:"12px 16px",borderRadius:"4px",marginBottom:"24px",fontFamily:"var(--font-mono)",fontSize:"12px"},children:c}),i.jsxs("form",{onSubmit:p,className:"s-form",children:[i.jsxs("div",{className:"s-form__group",children:[i.jsx("label",{className:"s-form__label",children:"Full Name"}),i.jsx("input",{type:"text",className:"s-form__input",placeholder:"Architect Name",value:t,onChange:g=>e(g.target.value),required:!0})]}),i.jsxs("div",{className:"s-form__group",children:[i.jsx("label",{className:"s-form__label",children:"Email Address"}),i.jsx("input",{type:"email",className:"s-form__input",placeholder:"architect@studio.com",value:s,onChange:g=>n(g.target.value),required:!0})]}),i.jsxs("div",{className:"s-form__group",children:[i.jsx("label",{className:"s-form__label",children:"Password"}),i.jsx("input",{type:"password",className:"s-form__input",placeholder:"••••••••",value:r,onChange:g=>a(g.target.value),required:!0})]}),i.jsx("button",{type:"submit",className:"s-btn",style:{marginTop:"16px",width:"100%"},disabled:o,children:o?"Initializing...":"Initialize"})]}),i.jsxs("div",{style:{marginTop:"48px",paddingTop:"24px",borderTop:"1px solid var(--hair)",fontFamily:"var(--font-mono)",fontSize:"11px",color:"var(--ink-2)"},children:["Already have active credentials? ",i.jsx(L,{to:"/login",style:{color:"var(--pigment)",textDecoration:"none",fontWeight:600},children:"Authenticate"})]})]})})]})}function pi(){return lt({queryKey:["repositories"],queryFn:ch})}function fi(){return lt({queryKey:["pull-requests"],queryFn:dh})}function gi(){return lt({queryKey:["issues"],queryFn:hh})}function qu(){return lt({queryKey:["analytics"],queryFn:uh})}function Gu(){return mi({mutationFn:t=>ph(t)})}function Ku(){const{data:t=[],isLoading:e}=pi(),{data:s=[],isLoading:n}=fi(),{data:r=[],isLoading:a}=gi(),l=(()=>{try{const d=localStorage.getItem("sycnops_user");if(d){const h=JSON.parse(d);if(h.name)return h.name.toLowerCase().replace(/\s+/g,"");if(h.email)return h.email.split("@")[0]}}catch{}return"developer"})(),c=[{id:"a1b2c3d",message:"feat(api): Implement token refresh flow",author:l,time:"10m ago"},{id:"f4e5d6c",message:"fix(ui): Align sidebar navigation on mobile",author:l,time:"1h ago"},{id:"b7a8901",message:"chore: Update dependencies",author:"sallysmith",time:"3h ago"},{id:"e2d3c4b",message:"docs: Document new deployment protocol",author:l,time:"5h ago"}];return i.jsxs("div",{style:{maxWidth:"1200px",margin:"0 auto",display:"flex",flexDirection:"column",gap:"48px"},children:[i.jsxs("div",{children:[i.jsx("span",{className:"s-overline",children:"OVERVIEW"}),i.jsx("h1",{style:{fontFamily:"var(--font-serif)",fontSize:"clamp(36px, 5vw, 56px)",letterSpacing:"-0.03em",color:"var(--text)",fontWeight:300},children:"Telemetry"})]}),i.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"24px",borderTop:"1px solid var(--border-subtle)",borderBottom:"1px solid var(--border-subtle)",padding:"32px 0"},children:[i.jsxs("div",{className:"s-metric",children:[i.jsx("span",{className:"s-metric__label",children:"Active Repos"}),i.jsx("span",{className:"s-metric__value",children:e?"--":t.length})]}),i.jsxs("div",{className:"s-metric",children:[i.jsx("span",{className:"s-metric__label",children:"Open PRs"}),i.jsx("span",{className:"s-metric__value",children:n?"--":s.length})]}),i.jsxs("div",{className:"s-metric",children:[i.jsx("span",{className:"s-metric__label",children:"Open Issues"}),i.jsx("span",{className:"s-metric__value",children:a?"--":r.length})]}),i.jsxs("div",{className:"s-metric",children:[i.jsx("span",{className:"s-metric__label",children:"Velocity Score"}),i.jsxs("span",{className:"s-metric__value",children:["94.5",i.jsx("span",{style:{fontSize:"20px",color:"var(--emerald)"},children:"%"})]})]})]}),i.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(400px, 1fr))",gap:"24px"},children:[i.jsxs("div",{className:"s-panel",style:{padding:0},children:[i.jsx("div",{style:{padding:"24px 32px",borderBottom:"1px solid var(--border)"},children:i.jsx("h2",{style:{fontFamily:"var(--font-serif)",fontSize:"24px",letterSpacing:"-0.02em",color:"var(--text)",fontWeight:400},children:"Recent Commits"})}),i.jsx("div",{style:{display:"flex",flexDirection:"column"},children:c.map((d,h)=>i.jsxs("div",{style:{display:"flex",gap:"16px",padding:"20px 32px",borderBottom:h!==c.length-1?"1px solid var(--border-subtle)":"none",transition:"background 0.2s",cursor:"default"},onMouseEnter:p=>p.currentTarget.style.background="rgba(255,255,255,0.02)",onMouseLeave:p=>p.currentTarget.style.background="transparent",children:[i.jsx("div",{style:{fontFamily:"var(--font-mono)",fontSize:"11px",color:"var(--emerald)",flexShrink:0,paddingTop:"2px"},children:d.id}),i.jsxs("div",{children:[i.jsx("div",{style:{fontFamily:"var(--font-sans)",fontSize:"13px",color:"var(--text)",marginBottom:"6px"},children:d.message}),i.jsxs("div",{style:{fontFamily:"var(--font-tech)",fontSize:"10px",color:"var(--text-dim)",letterSpacing:".1em"},children:["@",d.author," • ",d.time]})]})]},d.id))})]}),i.jsxs("div",{className:"s-panel",style:{padding:0},children:[i.jsx("div",{style:{padding:"24px 32px",borderBottom:"1px solid var(--border)"},children:i.jsx("h2",{style:{fontFamily:"var(--font-serif)",fontSize:"24px",letterSpacing:"-0.02em",color:"var(--text)",fontWeight:400},children:"Active Pull Requests"})}),i.jsx("div",{style:{display:"flex",flexDirection:"column"},children:n?i.jsx("div",{style:{padding:"32px",textAlign:"center",fontFamily:"var(--font-tech)",fontSize:"11px",color:"var(--text-dim)",letterSpacing:".2em"},children:"SYNCING..."}):s.slice(0,4).map((d,h)=>i.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 32px",borderBottom:h!==Math.min(3,s.length-1)?"1px solid var(--border-subtle)":"none",transition:"background 0.2s"},onMouseEnter:p=>p.currentTarget.style.background="rgba(255,255,255,0.02)",onMouseLeave:p=>p.currentTarget.style.background="transparent",children:[i.jsxs("div",{children:[i.jsx("div",{style:{fontFamily:"var(--font-sans)",fontSize:"13px",color:"var(--text)",marginBottom:"6px",maxWidth:"30ch",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:d.title}),i.jsxs("div",{style:{fontFamily:"var(--font-tech)",fontSize:"10px",color:"var(--text-dim)",letterSpacing:".1em"},children:[d.repo," • @",d.author]})]}),i.jsx("div",{style:{fontFamily:"var(--font-tech)",fontSize:"10px",letterSpacing:".2em",textTransform:"uppercase",color:d.status==="merged"?"var(--text-dim)":"var(--emerald)"},children:d.status})]},d.id))})]})]})]})}function Ju(){const{data:t=[],isLoading:e}=pi(),[s,n]=_.useState(""),[r,a]=_.useState(!1),[o,l]=_.useState(!1),d=(()=>{try{const u=localStorage.getItem("sycnops_user");if(u){const f=JSON.parse(u);if(f.name)return f.name.toLowerCase().replace(/\s+/g,"");if(f.email)return f.email.split("@")[0]}}catch{}return"developer"})(),h=t.filter(u=>u.name.toLowerCase().includes(s.toLowerCase())||u.language.toLowerCase().includes(s.toLowerCase())),p=()=>{a(!0),setTimeout(()=>{a(!1),l(!1)},2e3)};return i.jsxs("div",{style:{maxWidth:"1200px",margin:"0 auto"},children:[i.jsxs("div",{style:{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"48px",flexWrap:"wrap",gap:"24px"},children:[i.jsxs("div",{children:[i.jsx("h1",{style:{fontFamily:"var(--font-serif)",fontSize:"clamp(32px, 4vw, 48px)",letterSpacing:"-.015em",color:"var(--ink)",marginBottom:"8px"},children:"Repositories"}),i.jsx("p",{style:{fontFamily:"var(--font-mono)",fontSize:"12px",color:"var(--ink-2)"},children:"Manage and monitor your connected source architectures."})]}),i.jsx("button",{className:"s-btn",onClick:()=>l(!0),children:"Import Repository"})]}),i.jsx("div",{style:{marginBottom:"32px"},children:i.jsx("input",{type:"text",className:"s-form__input",placeholder:"Search registered architectures...",value:s,onChange:u=>n(u.target.value),style:{maxWidth:"400px"}})}),i.jsx("div",{className:"s-panel",style:{padding:"0",overflowX:"auto"},children:e?i.jsx("div",{style:{padding:"48px",textAlign:"center",fontFamily:"var(--font-mono)",fontSize:"12px",color:"var(--muted)"},children:"INITIALIZING DATA LAYER..."}):i.jsxs("table",{className:"s-work__table",children:[i.jsx("thead",{children:i.jsxs("tr",{children:[i.jsx("th",{className:"s-work__th",style:{paddingLeft:"32px"},children:"Repository"}),i.jsx("th",{className:"s-work__th",children:"Language"}),i.jsx("th",{className:"s-work__th",children:"Visibility"}),i.jsx("th",{className:"s-work__th",children:"Metrics"}),i.jsx("th",{className:"s-work__th s-work__th--right",style:{paddingRight:"32px"},children:"Status"})]})}),i.jsxs("tbody",{children:[h.map(u=>i.jsxs("tr",{className:"s-work__tr",children:[i.jsx("td",{className:"s-work__td s-work__name",style:{paddingLeft:"32px"},children:u.name}),i.jsx("td",{className:"s-work__td s-work__meta",children:u.language}),i.jsx("td",{className:"s-work__td s-work__meta",children:u.visibility}),i.jsxs("td",{className:"s-work__td s-work__meta",children:["★ ",u.stars,"   ⑂ ",u.forks,"   ⊙ ",u.openIssues]}),i.jsx("td",{className:"s-work__td s-work__status s-work__status--active",style:{paddingRight:"32px"},children:"SYNCED"})]},u.id)),h.length===0&&i.jsx("tr",{children:i.jsx("td",{colSpan:5,style:{padding:"48px",textAlign:"center",fontFamily:"var(--font-mono)",fontSize:"11px",color:"var(--ink-2)"},children:"NO REPOSITORIES MATCH QUERY"})})]})]})}),o&&i.jsxs("div",{style:{position:"fixed",inset:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"},children:[i.jsx("div",{style:{position:"absolute",inset:0,backgroundColor:"rgba(26,25,23,0.4)",backdropFilter:"blur(4px)"},onClick:()=>l(!1)}),i.jsxs("div",{className:"s-panel",style:{position:"relative",zIndex:101,width:"100%",maxWidth:"500px",backgroundColor:"var(--ground-2)"},children:[i.jsx("h2",{className:"s-panel__title",children:"Import from GitHub"}),i.jsxs("div",{style:{fontFamily:"var(--font-mono)",fontSize:"12px",color:"var(--ink-2)",marginBottom:"24px",lineHeight:1.6},children:["Select a repository from your connected GitHub account (@",d,") to begin monitoring and automation."]}),i.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"12px",marginBottom:"32px"},children:[i.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"16px",border:"1px solid var(--hair)",background:"var(--ground)"},children:[i.jsxs("span",{style:{fontFamily:"var(--font-mono)",fontSize:"11px",fontWeight:600},children:[d,"/sycnops-frontend"]}),i.jsx("span",{style:{fontFamily:"var(--font-mono)",fontSize:"10.5px",color:"var(--pigment)"},children:"IMPORTED"})]}),i.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px",border:"1px solid var(--ink)",background:"var(--ground)"},children:[i.jsxs("span",{style:{fontFamily:"var(--font-mono)",fontSize:"11px",fontWeight:600},children:[d,"/sycnops-api"]}),i.jsx("span",{style:{fontFamily:"var(--font-mono)",fontSize:"10.5px",color:"var(--muted)"},children:"SELECT"})]}),i.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"16px",border:"1px solid var(--hair)",background:"var(--ground)"},children:[i.jsxs("span",{style:{fontFamily:"var(--font-mono)",fontSize:"11px",fontWeight:600},children:[d,"/infrastructure-as-code"]}),i.jsx("span",{style:{fontFamily:"var(--font-mono)",fontSize:"10.5px",color:"var(--muted)"},children:"SELECT"})]})]}),i.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:"12px"},children:[i.jsx("button",{className:"s-btn s-btn--outline",onClick:()=>l(!1),children:"Cancel"}),i.jsx("button",{className:"s-btn",onClick:p,disabled:r,children:r?"Importing...":"Import Selected"})]})]})]})]})}function Yu(){const{data:t=[],isLoading:e}=fi(),[s,n]=_.useState(""),[r,a]=_.useState(null),[o,l]=_.useState(!1),c=t.filter(d=>d.title.toLowerCase().includes(s.toLowerCase())||d.repo.toLowerCase().includes(s.toLowerCase()));return i.jsxs("div",{style:{maxWidth:"1100px",margin:"0 auto"},children:[i.jsxs("div",{style:{marginBottom:"40px",display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:"16px"},children:[i.jsxs("div",{children:[i.jsx("span",{style:{fontFamily:"var(--font-tech)",fontSize:"10px",fontWeight:600,letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--emerald)"},children:"WORKFLOW TELEMETRY"}),i.jsx("h1",{style:{fontFamily:"var(--font-serif)",fontSize:"clamp(32px, 4vw, 48px)",fontWeight:300,letterSpacing:"-0.02em",color:"var(--text)",marginTop:"4px"},children:"Pull Requests"}),i.jsx("p",{style:{fontFamily:"var(--font-sans)",fontSize:"14px",color:"var(--text-muted)",marginTop:"4px"},children:"Track code reviews, automated CI/CD checks, and active pull requests."})]}),i.jsx("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:i.jsxs("span",{style:{fontFamily:"var(--font-tech)",fontSize:"11px",color:"var(--text-muted)"},children:["Active PRs: ",i.jsx("strong",{style:{color:"var(--text)"},children:t.length})]})})]}),i.jsx("div",{style:{marginBottom:"32px",display:"flex",gap:"16px",alignItems:"center"},children:i.jsxs("div",{style:{position:"relative",flex:1,maxWidth:"440px"},children:[i.jsx(kn,{style:{position:"absolute",left:"14px",top:"50%",transform:"translateY(-50%)",width:"16px",height:"16px",color:"var(--text-dim)"}}),i.jsx("input",{type:"text",placeholder:"Search pull requests by title or repo...",value:s,onChange:d=>n(d.target.value),style:{width:"100%",padding:"12px 16px 12px 40px",backgroundColor:"rgba(255,255,255,0.03)",border:"1px solid var(--border)",borderRadius:"12px",color:"var(--text)",fontFamily:"var(--font-sans)",fontSize:"13px",outline:"none",transition:"border-color 0.2s, background-color 0.2s"},onFocus:d=>d.currentTarget.style.borderColor="var(--emerald)",onBlur:d=>d.currentTarget.style.borderColor="var(--border)"})]})}),e?i.jsx("div",{className:"s-shimmer-card",style:{padding:"48px",textAlign:"center",fontFamily:"var(--font-tech)",fontSize:"12px",color:"var(--text-muted)"},children:"Loading pull requests pipeline..."}):c.length===0?i.jsx("div",{className:"s-shimmer-card",style:{padding:"48px",textAlign:"center"},children:i.jsxs("p",{style:{fontFamily:"var(--font-sans)",fontSize:"14px",color:"var(--text-muted)"},children:['No pull requests found matching "',s,'"']})}):i.jsx("div",{style:{display:"grid",gap:"16px"},children:c.map(d=>i.jsxs("div",{className:"s-spotlight",onClick:()=>{a(d),l(!1)},style:{backgroundColor:"var(--bg-card)",backdropFilter:"blur(12px)",border:"1px solid var(--border)",borderRadius:"16px",padding:"24px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"24px",flexWrap:"wrap",cursor:"pointer",transition:"border-color 0.3s, transform 0.2s"},children:[i.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:"16px",minWidth:"280px",flex:1},children:[i.jsx("div",{style:{width:"42px",height:"42px",borderRadius:"12px",backgroundColor:"rgba(16, 185, 129, 0.1)",border:"1px solid rgba(16, 185, 129, 0.2)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--emerald)",flexShrink:0},children:i.jsx(Gt,{className:"w-5 h-5"})}),i.jsxs("div",{children:[i.jsx("h3",{style:{fontFamily:"var(--font-serif)",fontSize:"18px",fontWeight:400,color:"var(--text)",marginBottom:"6px"},children:d.title}),i.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",flexWrap:"wrap",fontFamily:"var(--font-tech)",fontSize:"11px",color:"var(--text-muted)"},children:[i.jsx("span",{style:{color:"var(--emerald)",fontWeight:500},children:d.repo}),i.jsx("span",{children:"•"}),i.jsxs("span",{children:["by @",d.author]}),i.jsx("span",{children:"•"}),i.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"4px"},children:[i.jsx(Ai,{className:"w-3 h-3 text-secondary-400"})," ",d.createdAt]})]})]})]}),i.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"20px"},children:[i.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"6px",fontFamily:"var(--font-tech)",fontSize:"11px",color:"var(--text-muted)"},children:[i.jsx(Ni,{className:"w-4 h-4 text-emerald-400"}),d.comments," comments"]}),i.jsx("span",{style:{fontFamily:"var(--font-tech)",fontSize:"10px",fontWeight:600,letterSpacing:"0.15em",textTransform:"uppercase",padding:"6px 14px",borderRadius:"999px",backgroundColor:d.status==="merged"?"rgba(16, 185, 129, 0.12)":"rgba(56, 189, 248, 0.12)",color:d.status==="merged"?"#10B981":"#38BDF8",border:d.status==="merged"?"1px solid rgba(16, 185, 129, 0.3)":"1px solid rgba(56, 189, 248, 0.3)"},children:d.status}),i.jsx("button",{style:{background:"none",border:"none",color:"var(--text-dim)",cursor:"pointer"},children:i.jsx(Ri,{className:"w-4 h-4 hover:text-white transition-colors"})})]})]},d.id))}),r&&i.jsxs("div",{style:{position:"fixed",inset:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"},children:[i.jsx("div",{style:{position:"absolute",inset:0,backgroundColor:"rgba(0,0,0,0.7)",backdropFilter:"blur(6px)"},onClick:()=>a(null)}),i.jsxs("div",{className:"s-panel",style:{position:"relative",zIndex:101,width:"100%",maxWidth:"560px",backgroundColor:"var(--bg-card)",border:"1px solid var(--border)",borderRadius:"24px",padding:"32px"},children:[i.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"},children:[i.jsx("span",{style:{fontFamily:"var(--font-tech)",fontSize:"10px",color:"#10B981",letterSpacing:"0.2em"},children:"PULL REQUEST REVIEW"}),i.jsx("button",{onClick:()=>a(null),style:{background:"none",border:"none",color:"var(--text-muted)",cursor:"pointer"},children:i.jsx(dt,{className:"w-5 h-5"})})]}),i.jsx("h2",{style:{fontFamily:"var(--font-serif)",fontSize:"24px",color:"var(--text)",marginBottom:"8px"},children:r.title}),i.jsxs("p",{style:{fontFamily:"var(--font-tech)",fontSize:"12px",color:"var(--emerald)",marginBottom:"24px"},children:["Repository: ",r.repo," • Author: @",r.author]}),i.jsxs("div",{style:{backgroundColor:"rgba(0,0,0,0.4)",padding:"16px",borderRadius:"12px",border:"1px solid var(--border)",fontFamily:"var(--font-mono)",fontSize:"11px",color:"var(--text-muted)",marginBottom:"24px"},children:[i.jsxs("div",{children:["Status: ",i.jsx("strong",{style:{color:"#10B981"},children:o?"APPROVED & READY TO MERGE":r.status.toUpperCase()})]}),i.jsx("div",{style:{marginTop:"8px"},children:"Automated CI Checks: PASSING (12/12)"}),i.jsx("div",{style:{marginTop:"8px"},children:"Security Audit: 0 Vulnerabilities Detected"})]}),i.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:"12px"},children:[i.jsx("button",{onClick:()=>a(null),className:"s-btn s-btn--outline",style:{padding:"8px 16px",fontSize:"12px"},children:"Close"}),i.jsxs("button",{onClick:()=>l(!0),disabled:o,className:"s-btn-white-pill",style:{display:"inline-flex",alignItems:"center",gap:"6px"},children:[i.jsx(jn,{className:"w-4 h-4 text-emerald-400"})," ",o?"PR Approved":"Approve Pull Request"]})]})]})]})]})}function Xu(){const{data:t=[],isLoading:e}=gi(),[s,n]=_.useState(""),[r,a]=_.useState([]),[o,l]=_.useState(!1),[c,d]=_.useState(""),[h,p]=_.useState("sycnops-ai-web"),[u,f]=_.useState("high"),g=[...r,...t],m=g.filter(x=>x.title.toLowerCase().includes(s.toLowerCase())||x.repo.toLowerCase().includes(s.toLowerCase())),y=x=>{if(x.preventDefault(),!c.trim())return;const b={id:Date.now(),title:c.trim(),repo:h,priority:u,label:"bug",state:"open",assignee:"current_user"};a(v=>[b,...v]),d(""),l(!1)};return i.jsxs("div",{style:{maxWidth:"1100px",margin:"0 auto"},children:[i.jsxs("div",{style:{marginBottom:"40px",display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:"16px"},children:[i.jsxs("div",{children:[i.jsx("span",{style:{fontFamily:"var(--font-tech)",fontSize:"10px",fontWeight:600,letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--emerald)"},children:"ISSUE TELEMETRY"}),i.jsx("h1",{style:{fontFamily:"var(--font-serif)",fontSize:"clamp(32px, 4vw, 48px)",fontWeight:300,letterSpacing:"-0.02em",color:"var(--text)",marginTop:"4px"},children:"Issues"}),i.jsx("p",{style:{fontFamily:"var(--font-sans)",fontSize:"14px",color:"var(--text-muted)",marginTop:"4px"},children:"Monitor, prioritize, and resolve repository issues and system bug reports."})]}),i.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"16px"},children:[i.jsxs("span",{style:{fontFamily:"var(--font-tech)",fontSize:"11px",color:"var(--text-muted)"},children:["Open Issues: ",i.jsx("strong",{style:{color:"#F59E0B"},children:g.length})]}),i.jsxs("button",{onClick:()=>l(!0),className:"s-btn-white-pill",style:{display:"inline-flex",alignItems:"center",gap:"6px"},children:[i.jsx(Oi,{className:"w-4 h-4"})," New Issue"]})]})]}),i.jsx("div",{style:{marginBottom:"32px",display:"flex",gap:"16px",alignItems:"center"},children:i.jsxs("div",{style:{position:"relative",flex:1,maxWidth:"440px"},children:[i.jsx(kn,{style:{position:"absolute",left:"14px",top:"50%",transform:"translateY(-50%)",width:"16px",height:"16px",color:"var(--text-dim)"}}),i.jsx("input",{type:"text",placeholder:"Search issues by title or repo...",value:s,onChange:x=>n(x.target.value),style:{width:"100%",padding:"12px 16px 12px 40px",backgroundColor:"rgba(255,255,255,0.03)",border:"1px solid var(--border)",borderRadius:"12px",color:"var(--text)",fontFamily:"var(--font-sans)",fontSize:"13px",outline:"none",transition:"border-color 0.2s, background-color 0.2s"},onFocus:x=>x.currentTarget.style.borderColor="var(--emerald)",onBlur:x=>x.currentTarget.style.borderColor="var(--border)"})]})}),e?i.jsx("div",{className:"s-shimmer-card",style:{padding:"48px",textAlign:"center",fontFamily:"var(--font-tech)",fontSize:"12px",color:"var(--text-muted)"},children:"Loading issue diagnostics..."}):m.length===0?i.jsx("div",{className:"s-shimmer-card",style:{padding:"48px",textAlign:"center"},children:i.jsxs("p",{style:{fontFamily:"var(--font-sans)",fontSize:"14px",color:"var(--text-muted)"},children:['No issues found matching "',s,'"']})}):i.jsx("div",{style:{display:"grid",gap:"16px"},children:m.map(x=>i.jsxs("div",{className:"s-spotlight",style:{backgroundColor:"var(--bg-card)",backdropFilter:"blur(12px)",border:"1px solid var(--border)",borderRadius:"16px",padding:"24px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"24px",flexWrap:"wrap",transition:"border-color 0.3s, transform 0.2s"},children:[i.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:"16px",minWidth:"280px",flex:1},children:[i.jsx("div",{style:{width:"42px",height:"42px",borderRadius:"12px",backgroundColor:x.priority==="high"?"rgba(239, 68, 68, 0.1)":"rgba(245, 158, 11, 0.1)",border:x.priority==="high"?"1px solid rgba(239, 68, 68, 0.25)":"1px solid rgba(245, 158, 11, 0.25)",display:"flex",alignItems:"center",justifyContent:"center",color:x.priority==="high"?"#EF4444":"#F59E0B",flexShrink:0},children:i.jsx(An,{className:"w-5 h-5"})}),i.jsxs("div",{children:[i.jsx("h3",{style:{fontFamily:"var(--font-serif)",fontSize:"18px",fontWeight:400,color:"var(--text)",marginBottom:"6px"},children:x.title}),i.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",flexWrap:"wrap",fontFamily:"var(--font-tech)",fontSize:"11px",color:"var(--text-muted)"},children:[i.jsx("span",{style:{color:"var(--emerald)",fontWeight:500},children:x.repo}),i.jsx("span",{children:"•"}),i.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"4px"},children:[i.jsx(Nn,{className:"w-3.5 h-3.5 text-secondary-400"})," Assignee: @",x.assignee]})]})]})]}),i.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[i.jsxs("span",{style:{fontFamily:"var(--font-tech)",fontSize:"10px",fontWeight:600,letterSpacing:"0.15em",textTransform:"uppercase",padding:"6px 14px",borderRadius:"999px",backgroundColor:x.priority==="high"?"rgba(239, 68, 68, 0.12)":"rgba(245, 158, 11, 0.12)",color:x.priority==="high"?"#EF4444":"#F59E0B",border:x.priority==="high"?"1px solid rgba(239, 68, 68, 0.3)":"1px solid rgba(245, 158, 11, 0.3)"},children:[x.priority," Priority"]}),i.jsx("span",{style:{fontFamily:"var(--font-tech)",fontSize:"10px",fontWeight:500,letterSpacing:"0.12em",textTransform:"uppercase",padding:"6px 14px",borderRadius:"999px",backgroundColor:"rgba(255,255,255,0.06)",color:"var(--text)",border:"1px solid rgba(255,255,255,0.12)"},children:x.label})]})]},x.id))}),o&&i.jsxs("div",{style:{position:"fixed",inset:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"},children:[i.jsx("div",{style:{position:"absolute",inset:0,backgroundColor:"rgba(0,0,0,0.7)",backdropFilter:"blur(6px)"},onClick:()=>l(!1)}),i.jsxs("div",{className:"s-panel",style:{position:"relative",zIndex:101,width:"100%",maxWidth:"520px",backgroundColor:"var(--bg-card)",border:"1px solid var(--border)",borderRadius:"24px",padding:"32px"},children:[i.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"},children:[i.jsx("span",{style:{fontFamily:"var(--font-tech)",fontSize:"10px",color:"#10B981",letterSpacing:"0.2em"},children:"CREATE ISSUE"}),i.jsx("button",{onClick:()=>l(!1),style:{background:"none",border:"none",color:"var(--text-muted)",cursor:"pointer"},children:i.jsx(dt,{className:"w-5 h-5"})})]}),i.jsxs("form",{onSubmit:y,className:"s-form",children:[i.jsxs("div",{className:"s-form__group",children:[i.jsx("label",{className:"s-form__label",children:"Issue Title"}),i.jsx("input",{type:"text",className:"s-form__input",placeholder:"Describe the bug or task...",value:c,onChange:x=>d(x.target.value),required:!0})]}),i.jsxs("div",{className:"s-form__group",children:[i.jsx("label",{className:"s-form__label",children:"Target Repository"}),i.jsxs("select",{className:"s-form__input",value:h,onChange:x=>p(x.target.value),style:{backgroundColor:"rgba(0,0,0,0.6)",color:"var(--text)"},children:[i.jsx("option",{value:"sycnops-ai-web",children:"sycnops-ai-web"}),i.jsx("option",{value:"workflow-engine",children:"workflow-engine"}),i.jsx("option",{value:"analytics-service",children:"analytics-service"})]})]}),i.jsxs("div",{className:"s-form__group",children:[i.jsx("label",{className:"s-form__label",children:"Priority"}),i.jsxs("select",{className:"s-form__input",value:u,onChange:x=>f(x.target.value),style:{backgroundColor:"rgba(0,0,0,0.6)",color:"var(--text)"},children:[i.jsx("option",{value:"high",children:"High Priority"}),i.jsx("option",{value:"medium",children:"Medium Priority"}),i.jsx("option",{value:"low",children:"Low Priority"})]})]}),i.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:"12px",marginTop:"24px"},children:[i.jsx("button",{type:"button",onClick:()=>l(!1),className:"s-btn s-btn--outline",style:{padding:"8px 16px",fontSize:"12px"},children:"Cancel"}),i.jsx("button",{type:"submit",className:"s-btn-white-pill",children:"Create Issue"})]})]})]})]})]})}function Qu(){const{data:t,isLoading:e}=qu(),s=(t==null?void 0:t.dailyActivity)||[],n=({active:r,payload:a,label:o})=>r&&a&&a.length?i.jsxs("div",{style:{backgroundColor:"#050505",border:"1px solid rgba(255, 255, 255, 0.15)",borderRadius:"10px",padding:"10px 14px",boxShadow:"0 10px 30px rgba(0, 0, 0, 0.8)",fontFamily:"var(--font-tech)",fontSize:"12px"},children:[i.jsx("p",{style:{color:"var(--emerald)",marginBottom:"4px",textTransform:"uppercase",letterSpacing:"0.1em"},children:o}),i.jsxs("p",{style:{color:"#EBEBEB"},children:[a[0].name,": ",i.jsx("strong",{style:{color:"#10B981"},children:a[0].value})]})]}):null;return i.jsxs("div",{style:{maxWidth:"1100px",margin:"0 auto"},children:[i.jsxs("div",{style:{marginBottom:"40px"},children:[i.jsx("span",{style:{fontFamily:"var(--font-tech)",fontSize:"10px",fontWeight:600,letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--emerald)"},children:"PERFORMANCE METRICS"}),i.jsx("h1",{style:{fontFamily:"var(--font-serif)",fontSize:"clamp(32px, 4vw, 48px)",fontWeight:300,letterSpacing:"-0.02em",color:"var(--text)",marginTop:"4px"},children:"Analytics"}),i.jsx("p",{style:{fontFamily:"var(--font-sans)",fontSize:"14px",color:"var(--text-muted)",marginTop:"4px"},children:"Real-time productivity telemetry, daily commit velocity, and PR merge trends."})]}),i.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))",gap:"20px",marginBottom:"40px"},children:[i.jsxs("div",{className:"s-spotlight",style:{backgroundColor:"var(--bg-card)",backdropFilter:"blur(12px)",border:"1px solid var(--border)",borderRadius:"18px",padding:"24px",display:"flex",alignItems:"center",justifyContent:"space-between"},children:[i.jsxs("div",{children:[i.jsx("p",{style:{fontFamily:"var(--font-tech)",fontSize:"10px",letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--text-muted)"},children:"Total Commits"}),i.jsx("h3",{style:{fontFamily:"var(--font-serif)",fontSize:"32px",fontWeight:300,color:"var(--text)",marginTop:"4px"},children:e?"...":t==null?void 0:t.totalCommits})]}),i.jsx("div",{style:{width:"44px",height:"44px",borderRadius:"12px",backgroundColor:"rgba(16, 185, 129, 0.1)",border:"1px solid rgba(16, 185, 129, 0.25)",display:"flex",alignItems:"center",justifyContent:"center",color:"#10B981"},children:i.jsx(Pi,{className:"w-6 h-6"})})]}),i.jsxs("div",{className:"s-spotlight",style:{backgroundColor:"var(--bg-card)",backdropFilter:"blur(12px)",border:"1px solid var(--border)",borderRadius:"18px",padding:"24px",display:"flex",alignItems:"center",justifyContent:"space-between"},children:[i.jsxs("div",{children:[i.jsx("p",{style:{fontFamily:"var(--font-tech)",fontSize:"10px",letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--text-muted)"},children:"Merged PRs"}),i.jsx("h3",{style:{fontFamily:"var(--font-serif)",fontSize:"32px",fontWeight:300,color:"var(--text)",marginTop:"4px"},children:e?"...":t==null?void 0:t.mergedPRs})]}),i.jsx("div",{style:{width:"44px",height:"44px",borderRadius:"12px",backgroundColor:"rgba(6, 182, 212, 0.1)",border:"1px solid rgba(6, 182, 212, 0.25)",display:"flex",alignItems:"center",justifyContent:"center",color:"#06B6D4"},children:i.jsx(Gt,{className:"w-6 h-6"})})]}),i.jsxs("div",{className:"s-spotlight",style:{backgroundColor:"var(--bg-card)",backdropFilter:"blur(12px)",border:"1px solid var(--border)",borderRadius:"18px",padding:"24px",display:"flex",alignItems:"center",justifyContent:"space-between"},children:[i.jsxs("div",{children:[i.jsx("p",{style:{fontFamily:"var(--font-tech)",fontSize:"10px",letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--text-muted)"},children:"Issues Closed"}),i.jsx("h3",{style:{fontFamily:"var(--font-serif)",fontSize:"32px",fontWeight:300,color:"var(--text)",marginTop:"4px"},children:e?"...":t==null?void 0:t.issuesClosed})]}),i.jsx("div",{style:{width:"44px",height:"44px",borderRadius:"12px",backgroundColor:"rgba(168, 85, 247, 0.1)",border:"1px solid rgba(168, 85, 247, 0.25)",display:"flex",alignItems:"center",justifyContent:"center",color:"#A855F7"},children:i.jsx(jn,{className:"w-6 h-6"})})]}),i.jsxs("div",{className:"s-spotlight",style:{backgroundColor:"var(--bg-card)",backdropFilter:"blur(12px)",border:"1px solid var(--border)",borderRadius:"18px",padding:"24px",display:"flex",alignItems:"center",justifyContent:"space-between"},children:[i.jsxs("div",{children:[i.jsx("p",{style:{fontFamily:"var(--font-tech)",fontSize:"10px",letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--text-muted)"},children:"Velocity Score"}),i.jsx("h3",{style:{fontFamily:"var(--font-serif)",fontSize:"32px",fontWeight:300,color:"#10B981",marginTop:"4px"},children:e?"...":`${t==null?void 0:t.velocityScore}%`})]}),i.jsx("div",{style:{width:"44px",height:"44px",borderRadius:"12px",backgroundColor:"rgba(16, 185, 129, 0.1)",border:"1px solid rgba(16, 185, 129, 0.25)",display:"flex",alignItems:"center",justifyContent:"center",color:"#10B981"},children:i.jsx(Mi,{className:"w-6 h-6"})})]})]}),i.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(440px, 1fr))",gap:"32px"},children:[i.jsxs("div",{className:"s-spotlight",style:{backgroundColor:"var(--bg-card)",backdropFilter:"blur(16px)",border:"1px solid var(--border)",borderRadius:"24px",padding:"28px"},children:[i.jsx("h2",{style:{fontFamily:"var(--font-serif)",fontSize:"20px",fontWeight:400,color:"var(--text)",marginBottom:"20px"},children:"Daily Commit Velocity"}),i.jsx("div",{style:{width:"100%",height:"280px"},children:i.jsx(ms,{width:"100%",height:"100%",children:i.jsxs(Ui,{data:s,children:[i.jsx(xs,{strokeDasharray:"3 3",stroke:"rgba(255,255,255,0.06)",vertical:!1}),i.jsx(ys,{dataKey:"day",stroke:"rgba(235,235,235,0.4)",tick:{fontFamily:"var(--font-tech)",fontSize:11}}),i.jsx(bs,{stroke:"rgba(235,235,235,0.4)",tick:{fontFamily:"var(--font-tech)",fontSize:11}}),i.jsx(vs,{content:i.jsx(n,{})}),i.jsx(Wi,{dataKey:"commits",fill:"#10B981",radius:[6,6,0,0]})]})})})]}),i.jsxs("div",{className:"s-spotlight",style:{backgroundColor:"var(--bg-card)",backdropFilter:"blur(16px)",border:"1px solid var(--border)",borderRadius:"24px",padding:"28px"},children:[i.jsx("h2",{style:{fontFamily:"var(--font-serif)",fontSize:"20px",fontWeight:400,color:"var(--text)",marginBottom:"20px"},children:"Pull Request Merge Trends"}),i.jsx("div",{style:{width:"100%",height:"280px"},children:i.jsx(ms,{width:"100%",height:"100%",children:i.jsxs($i,{data:s,children:[i.jsx(xs,{strokeDasharray:"3 3",stroke:"rgba(255,255,255,0.06)",vertical:!1}),i.jsx(ys,{dataKey:"day",stroke:"rgba(235,235,235,0.4)",tick:{fontFamily:"var(--font-tech)",fontSize:11}}),i.jsx(bs,{stroke:"rgba(235,235,235,0.4)",tick:{fontFamily:"var(--font-tech)",fontSize:11}}),i.jsx(vs,{content:i.jsx(n,{})}),i.jsx(Hi,{type:"monotone",dataKey:"prs",stroke:"#06B6D4",strokeWidth:3,dot:{fill:"#06B6D4",r:4}})]})})})]})]})]})}function Zu(){const[t,e]=_.useState(""),[s,n]=_.useState([{id:"1",sender:"ai",text:"Hello! I am your SycnOps AI assistant. How can I help optimize your engineering workflow, summarize PRs, or review code today?",timestamp:"10:00 AM"}]),r=Gu(),a=async o=>{if(o.preventDefault(),!t.trim()||r.isPending)return;const l={id:Date.now().toString(),sender:"user",text:t,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})};n(d=>[...d,l]);const c=t;e("");try{const d=await r.mutateAsync(c),h={id:(Date.now()+1).toString(),sender:"ai",text:d,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})};n(p=>[...p,h])}catch{const d={id:(Date.now()+1).toString(),sender:"ai",text:"Sorry, I encountered an issue connecting to the SycnOps backend service.",timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})};n(h=>[...h,d])}};return i.jsxs("div",{style:{maxWidth:"900px",margin:"0 auto"},children:[i.jsxs("div",{style:{marginBottom:"32px"},children:[i.jsx("span",{style:{fontFamily:"var(--font-tech)",fontSize:"10px",fontWeight:600,letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--emerald)"},children:"AUTONOMOUS COPILOT"}),i.jsx("h1",{style:{fontFamily:"var(--font-serif)",fontSize:"clamp(32px, 4vw, 48px)",fontWeight:300,letterSpacing:"-0.02em",color:"var(--text)",marginTop:"4px"},children:"AI Assistant"}),i.jsx("p",{style:{fontFamily:"var(--font-sans)",fontSize:"14px",color:"var(--text-muted)",marginTop:"4px"},children:"Chat with AI for workflow automation, PR summaries, code reviews, and architecture optimization."})]}),i.jsxs("div",{className:"s-spotlight",style:{height:"620px",display:"flex",flexDirection:"column",backgroundColor:"var(--bg-card)",backdropFilter:"blur(16px)",border:"1px solid var(--border)",borderRadius:"24px",overflow:"hidden",boxShadow:"0 20px 60px rgba(0, 0, 0, 0.6)"},children:[i.jsxs("div",{style:{padding:"20px 24px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:"14px",backgroundColor:"rgba(0,0,0,0.3)"},children:[i.jsx("div",{style:{width:"40px",height:"40px",borderRadius:"12px",backgroundColor:"rgba(16, 185, 129, 0.15)",border:"1px solid rgba(16, 185, 129, 0.3)",display:"flex",alignItems:"center",justifyContent:"center",color:"#10B981"},children:i.jsx(fs,{className:"w-5 h-5"})}),i.jsxs("div",{children:[i.jsx("h2",{style:{fontFamily:"var(--font-serif)",fontSize:"18px",fontWeight:400,color:"var(--text)"},children:"SycnOps Copilot"}),i.jsxs("p",{style:{fontFamily:"var(--font-tech)",fontSize:"10px",color:"#10B981",display:"flex",alignItems:"center",gap:"4px",marginTop:"2px",letterSpacing:"0.1em"},children:[i.jsx(Cn,{className:"w-3 h-3 text-emerald-400"})," ONLINE & ACTIVE"]})]})]}),i.jsxs("div",{style:{flex:1,overflowY:"auto",padding:"24px",display:"flex",flexDirection:"column",gap:"16px"},children:[s.map(o=>i.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:"12px",flexDirection:o.sender==="user"?"row-reverse":"row"},children:[i.jsx("div",{style:{width:"34px",height:"34px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:600,backgroundColor:o.sender==="user"?"rgba(255,255,255,0.1)":"rgba(16,185,129,0.2)",color:o.sender==="user"?"#FFFFFF":"#10B981",border:o.sender==="user"?"1px solid rgba(255,255,255,0.2)":"1px solid rgba(16,185,129,0.3)",flexShrink:0},children:o.sender==="user"?i.jsx(Nn,{className:"w-4 h-4"}):i.jsx(fs,{className:"w-4 h-4"})}),i.jsxs("div",{style:{maxWidth:"75%",borderRadius:"18px",padding:"14px 18px",fontSize:"14px",lineHeight:1.6,fontFamily:"var(--font-sans)",backgroundColor:o.sender==="user"?"rgba(16, 185, 129, 0.15)":"rgba(255, 255, 255, 0.04)",color:o.sender==="user"?"#FFFFFF":"var(--text)",border:o.sender==="user"?"1px solid rgba(16, 185, 129, 0.35)":"1px solid rgba(255, 255, 255, 0.08)",boxShadow:"0 4px 16px rgba(0,0,0,0.3)"},children:[i.jsx("p",{style:{margin:0},children:o.text}),i.jsx("span",{style:{display:"block",fontSize:"10px",fontFamily:"var(--font-tech)",color:"var(--text-dim)",textAlign:"right",marginTop:"6px"},children:o.timestamp})]})]},o.id)),r.isPending&&i.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",fontFamily:"var(--font-tech)",fontSize:"12px",color:"var(--text-muted)"},children:[i.jsx(gs,{className:"w-4 h-4 animate-spin text-emerald-400"}),"SycnOps AI is thinking..."]})]}),i.jsxs("form",{onSubmit:a,style:{padding:"16px 20px",borderTop:"1px solid var(--border)",display:"flex",gap:"12px",backgroundColor:"rgba(0,0,0,0.4)"},children:[i.jsx("input",{type:"text",placeholder:"Ask AI to summarize PRs, review code, or generate docs...",value:t,onChange:o=>e(o.target.value),disabled:r.isPending,style:{flex:1,padding:"12px 18px",backgroundColor:"rgba(255,255,255,0.04)",border:"1px solid var(--border)",borderRadius:"12px",color:"var(--text)",fontFamily:"var(--font-sans)",fontSize:"13px",outline:"none",transition:"border-color 0.2s"},onFocus:o=>o.currentTarget.style.borderColor="var(--emerald)",onBlur:o=>o.currentTarget.style.borderColor="var(--border)"}),i.jsx("button",{type:"submit",disabled:r.isPending,style:{padding:"12px 20px",backgroundColor:"var(--emerald)",color:"#FFFFFF",border:"none",borderRadius:"12px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"},children:r.isPending?i.jsx(gs,{className:"w-4 h-4 animate-spin"}):i.jsx(Rn,{className:"w-4 h-4"})})]})]})]})}function ep(){const[t,e]=_.useState([{id:"1",title:"New PR Review Assigned",description:"Alex assigned you to review PR #101 on main branch",time:"10 min ago",read:!1,type:"pr"},{id:"2",title:"High Priority Issue Opened",description:"Issue #201: OAuth token refresh failing in production cluster",time:"1 hour ago",read:!1,type:"issue"},{id:"3",title:"AI Automation Completed",description:"Weekly telemetry & documentation summary successfully generated",time:"2 hours ago",read:!0,type:"system"}]),[s,n]=_.useState("Notification"in window?Notification.permission:"unsupported"),[r,a]=_.useState("");_.useEffect(()=>{lh(d=>{if(d!=null&&d.notification){const h={id:Date.now().toString(),title:d.notification.title||"Firebase FCM Event",description:d.notification.body||"New live telemetry event received.",time:"Just now",read:!1,type:"system"};e(p=>[h,...p])}})},[]);const o=async()=>{a("Requesting Firebase FCM permission...");const d=await oh();a(d.message),"Notification"in window&&n(Notification.permission),setTimeout(()=>a(""),4e3)},l=()=>{const d={id:Date.now().toString(),title:"⚡ SycnOps Firebase Test Notification",description:"Firebase Cloud Messaging integration test completed successfully on MongoDB Atlas backplane.",time:"Just now",read:!1,type:"system"};e(h=>[d,...h]),"Notification"in window&&Notification.permission==="granted"&&new Notification("⚡ SycnOps Notification",{body:"Firebase Cloud Messaging test event received!",icon:"/favicon.ico"}),a("Test push notification emitted!"),setTimeout(()=>a(""),3e3)},c=()=>{e(d=>d.map(h=>({...h,read:!0})))};return i.jsxs("div",{style:{maxWidth:"900px",margin:"0 auto"},children:[i.jsxs("div",{style:{marginBottom:"32px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"16px"},children:[i.jsxs("div",{children:[i.jsx("span",{style:{fontFamily:"var(--font-tech)",fontSize:"10px",fontWeight:600,letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--emerald)"},children:"FIREBASE EVENT STREAM"}),i.jsx("h1",{style:{fontFamily:"var(--font-serif)",fontSize:"clamp(32px, 4vw, 48px)",fontWeight:300,letterSpacing:"-0.02em",color:"var(--text)",marginTop:"4px"},children:"Notifications"}),i.jsx("p",{style:{fontFamily:"var(--font-sans)",fontSize:"14px",color:"var(--text-muted)",marginTop:"4px"},children:"Stay updated with continuous repository events, PR reviews, and AI workflow alerts."})]}),i.jsxs("div",{style:{display:"flex",gap:"10px",flexWrap:"wrap"},children:[i.jsxs("button",{onClick:o,style:{display:"inline-flex",alignItems:"center",gap:"6px",padding:"8px 16px",backgroundColor:s==="granted"?"rgba(16, 185, 129, 0.12)":"rgba(56, 189, 248, 0.12)",border:s==="granted"?"1px solid rgba(16, 185, 129, 0.3)":"1px solid rgba(56, 189, 248, 0.3)",borderRadius:"999px",color:s==="granted"?"#10B981":"#38BDF8",fontFamily:"var(--font-tech)",fontSize:"11px",cursor:"pointer",transition:"all 0.2s"},children:[s==="granted"?i.jsx(Fi,{className:"w-3.5 h-3.5"}):i.jsx(Di,{className:"w-3.5 h-3.5"}),s==="granted"?"Push Notifications Active":"Enable Firebase Notifications"]}),i.jsxs("button",{onClick:l,style:{display:"inline-flex",alignItems:"center",gap:"6px",padding:"8px 16px",backgroundColor:"rgba(255,255,255,0.04)",border:"1px solid var(--border)",borderRadius:"999px",color:"var(--text)",fontFamily:"var(--font-tech)",fontSize:"11px",cursor:"pointer",transition:"all 0.2s"},children:[i.jsx(Rn,{className:"w-3.5 h-3.5 text-emerald-400"})," Send Test Notification"]}),i.jsxs("button",{onClick:c,style:{display:"inline-flex",alignItems:"center",gap:"6px",padding:"8px 16px",backgroundColor:"rgba(255,255,255,0.04)",border:"1px solid var(--border)",borderRadius:"999px",color:"var(--emerald)",fontFamily:"var(--font-tech)",fontSize:"11px",cursor:"pointer",transition:"all 0.2s"},children:[i.jsx(He,{className:"w-3.5 h-3.5"})," Mark all read"]})]})]}),r&&i.jsx("div",{style:{backgroundColor:"rgba(16, 185, 129, 0.1)",border:"1px solid rgba(16, 185, 129, 0.3)",color:"#10B981",padding:"10px 16px",borderRadius:"10px",marginBottom:"20px",fontFamily:"var(--font-tech)",fontSize:"11px"},children:r}),i.jsx("div",{style:{display:"grid",gap:"16px"},children:t.map(d=>i.jsxs("div",{className:"s-spotlight",style:{backgroundColor:"var(--bg-card)",backdropFilter:"blur(12px)",border:d.read?"1px solid var(--border)":"1px solid rgba(16, 185, 129, 0.4)",borderRadius:"16px",padding:"24px",display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"20px",opacity:d.read?.75:1,transition:"all 0.3s"},children:[i.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:"16px"},children:[i.jsx("div",{style:{width:"42px",height:"42px",borderRadius:"12px",backgroundColor:d.type==="pr"?"rgba(16, 185, 129, 0.1)":d.type==="issue"?"rgba(245, 158, 11, 0.1)":"rgba(56, 189, 248, 0.1)",border:d.type==="pr"?"1px solid rgba(16, 185, 129, 0.25)":d.type==="issue"?"1px solid rgba(245, 158, 11, 0.25)":"1px solid rgba(56, 189, 248, 0.25)",display:"flex",alignItems:"center",justifyContent:"center",color:d.type==="pr"?"#10B981":d.type==="issue"?"#F59E0B":"#38BDF8",flexShrink:0},children:d.type==="pr"?i.jsx(Gt,{className:"w-5 h-5"}):d.type==="issue"?i.jsx(An,{className:"w-5 h-5"}):i.jsx(Li,{className:"w-5 h-5"})}),i.jsxs("div",{children:[i.jsx("h3",{style:{fontFamily:"var(--font-serif)",fontSize:"18px",fontWeight:400,color:"var(--text)",marginBottom:"4px"},children:d.title}),i.jsx("p",{style:{fontFamily:"var(--font-sans)",fontSize:"13px",color:"var(--text-muted)"},children:d.description}),i.jsx("span",{style:{display:"block",fontFamily:"var(--font-tech)",fontSize:"10px",color:"var(--text-dim)",marginTop:"8px"},children:d.time})]})]}),!d.read&&i.jsx("span",{style:{fontFamily:"var(--font-tech)",fontSize:"9px",fontWeight:600,letterSpacing:"0.15em",textTransform:"uppercase",padding:"4px 10px",borderRadius:"999px",backgroundColor:"rgba(16, 185, 129, 0.15)",color:"#10B981",border:"1px solid rgba(16, 185, 129, 0.3)"},children:"NEW"})]},d.id))})]})}function tp(){const[t,e]=_.useState(""),[s,n]=_.useState(""),[r,a]=_.useState("Senior Full-Stack Developer"),[o,l]=_.useState(!1),[c,d]=_.useState(!1),[h,p]=_.useState(!1),[u,f]=_.useState(!1);_.useEffect(()=>{async function x(){try{const b=await oi();e(b.name||""),n(b.email||""),b.role&&a(b.role)}catch{const b=localStorage.getItem("sycnops_user");if(b){const v=JSON.parse(b);e(v.name||""),n(v.email||""),v.role&&a(v.role)}}}x()},[]);const g=async x=>{if(x.preventDefault(),!!t.trim()){d(!0);try{const b=await li({name:t.trim()});e(b.name||t.trim());const v=localStorage.getItem("sycnops_user"),S={...v?JSON.parse(v):{},name:b.name||t.trim(),role:r};localStorage.setItem("sycnops_user",JSON.stringify(S)),window.dispatchEvent(new Event("sycnops_user_updated")),l(!0),setTimeout(()=>l(!1),3e3)}catch{l(!0),setTimeout(()=>l(!1),3e3)}finally{d(!1)}}},m=()=>{f(!0),setTimeout(()=>{p(!0),f(!1)},1500)},y=t?t.toLowerCase().replace(/\s+/g,""):"developer";return i.jsxs("div",{style:{maxWidth:"800px",margin:"0 auto"},children:[i.jsxs("div",{style:{marginBottom:"48px"},children:[i.jsx("h1",{style:{fontFamily:"var(--font-serif)",fontSize:"clamp(32px, 4vw, 48px)",letterSpacing:"-.015em",color:"var(--ink)",marginBottom:"8px"},children:"Configuration"}),i.jsx("p",{style:{fontFamily:"var(--font-mono)",fontSize:"12px",color:"var(--ink-2)"},children:"Manage your account preferences and integrations."})]}),i.jsxs("div",{className:"s-panel",style:{marginBottom:"32px"},children:[i.jsx("h2",{className:"s-panel__title",children:"Integrations"}),i.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",paddingBottom:"24px",borderBottom:"1px solid var(--hair)"},children:[i.jsxs("div",{children:[i.jsx("div",{style:{fontFamily:"var(--font-mono)",fontSize:"12.5px",fontWeight:600,color:"var(--ink)"},children:"GitHub"}),i.jsx("div",{style:{fontFamily:"var(--font-mono)",fontSize:"11px",color:"var(--ink-2)",marginTop:"4px"},children:h?`Connected as @${y}`:"Link your account to import repositories and track workflows."})]}),h?i.jsx("button",{className:"s-btn s-btn--outline",onClick:()=>p(!1),children:"Disconnect"}):i.jsx("button",{className:"s-btn",onClick:m,disabled:u,children:u?"Authenticating...":"Connect GitHub"})]})]}),i.jsxs("div",{className:"s-panel",children:[i.jsx("h2",{className:"s-panel__title",children:"Profile"}),i.jsxs("form",{onSubmit:g,className:"s-form",children:[i.jsxs("div",{className:"s-form__group",children:[i.jsx("label",{className:"s-form__label",children:"Full Name"}),i.jsx("input",{type:"text",className:"s-form__input",value:t,onChange:x=>e(x.target.value),placeholder:"Your Full Name",required:!0})]}),i.jsxs("div",{className:"s-form__group",children:[i.jsx("label",{className:"s-form__label",children:"Job Title"}),i.jsx("input",{type:"text",className:"s-form__input",value:r,onChange:x=>a(x.target.value),placeholder:"Job Title"})]}),i.jsxs("div",{className:"s-form__group",children:[i.jsx("label",{className:"s-form__label",children:"Email Address (Locked)"}),i.jsx("input",{type:"email",className:"s-form__input",value:s,disabled:!0,style:{color:"var(--muted)",cursor:"not-allowed"}})]}),i.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"16px",marginTop:"16px"},children:[i.jsx("button",{type:"submit",className:"s-btn",disabled:c,children:c?"Saving...":"Save Changes"}),o&&i.jsx("span",{style:{fontFamily:"var(--font-mono)",fontSize:"10.5px",color:"var(--pigment)",letterSpacing:".1em",textTransform:"uppercase"},children:"Configuration Saved"})]})]})]})]})}function sp(){const[t,e]=_.useState(void 0),[s,n]=_.useState(!t),[r,a]=_.useState(""),o=ct(),[l,c]=_.useState(!1),[d,h]=_.useState(""),[p,u]=_.useState(!1),[f,g]=_.useState("");_.useEffect(()=>{async function b(){try{const w=await oi();e(w),h(w.name||""),localStorage.setItem("sycnops_user",JSON.stringify(w))}catch(w){const S=localStorage.getItem("sycnops_user");if(S){const I=JSON.parse(S);e(I),h(I.name||"")}else a(w.message||"Please log in to view your profile.")}finally{n(!1)}}b();const v=()=>b();return window.addEventListener("sycnops_user_updated",v),()=>window.removeEventListener("sycnops_user_updated",v)},[]);const m=()=>{localStorage.removeItem("sycnops_token"),localStorage.removeItem("token"),localStorage.removeItem("sycnops_user"),localStorage.removeItem("user"),window.dispatchEvent(new Event("sycnops_user_updated")),o("/login")},y=async()=>{if(d.trim()){u(!0),g("");try{const b=await li({name:d.trim()});e(I=>I&&{...I,name:b.name});const v=localStorage.getItem("sycnops_user"),S={...v?JSON.parse(v):{},name:b.name};localStorage.setItem("sycnops_user",JSON.stringify(S)),window.dispatchEvent(new Event("sycnops_user_updated")),c(!1),g("Name updated successfully!"),setTimeout(()=>g(""),3e3)}catch(b){let v=b.message||"Failed to update name";(v.includes("JSON.parse")||v.includes("Unexpected")||v.includes("unexpected"))&&(e(w=>w&&{...w,name:d.trim()}),c(!1),v="Name updated successfully!"),g(v),setTimeout(()=>g(""),3e3)}finally{u(!1)}}};if(s)return i.jsx("div",{style:{maxWidth:"900px",margin:"0 auto",paddingTop:"60px",textAlign:"center"},children:i.jsx("p",{style:{fontFamily:"var(--font-tech)",fontSize:"12px",color:"var(--text-muted)",letterSpacing:"0.15em"},children:"LOADING PROFILE IDENTITY..."})});if(r&&!t)return i.jsx("div",{style:{maxWidth:"600px",margin:"60px auto 0 auto",textAlign:"center"},children:i.jsxs("div",{className:"s-shimmer-card",style:{padding:"48px 24px"},children:[i.jsx("h2",{style:{fontFamily:"var(--font-serif)",fontSize:"28px",color:"var(--text)",marginBottom:"12px"},children:"Authentication Required"}),i.jsx("p",{style:{fontFamily:"var(--font-sans)",fontSize:"14px",color:"var(--text-muted)",marginBottom:"24px"},children:r}),i.jsx(L,{to:"/login",className:"s-btn-white-pill",children:"Authenticate Now"})]})});const x=t!=null&&t.name?t.name.split(" ").map(b=>b[0]).join("").substring(0,2).toUpperCase():"U";return i.jsxs("div",{style:{maxWidth:"900px",margin:"0 auto"},children:[i.jsxs("div",{style:{marginBottom:"40px",display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:"16px"},children:[i.jsxs("div",{children:[i.jsx("span",{style:{fontFamily:"var(--font-tech)",fontSize:"10px",fontWeight:600,letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--emerald)"},children:"USER IDENTITY PROTOCOL"}),i.jsx("h1",{style:{fontFamily:"var(--font-serif)",fontSize:"clamp(32px, 4vw, 48px)",fontWeight:300,letterSpacing:"-0.02em",color:"var(--text)",marginTop:"4px"},children:"Profile"}),i.jsx("p",{style:{fontFamily:"var(--font-sans)",fontSize:"14px",color:"var(--text-muted)",marginTop:"4px"},children:"Manage developer credentials, identity protocols, and active stack configurations."})]}),i.jsxs("button",{onClick:m,style:{display:"inline-flex",alignItems:"center",gap:"8px",padding:"10px 20px",backgroundColor:"rgba(239, 68, 68, 0.1)",border:"1px solid rgba(239, 68, 68, 0.3)",borderRadius:"999px",fontFamily:"var(--font-tech)",fontSize:"11px",color:"#EF4444",cursor:"pointer",transition:"all 0.2s"},onMouseOver:b=>b.currentTarget.style.backgroundColor="rgba(239, 68, 68, 0.2)",onMouseOut:b=>b.currentTarget.style.backgroundColor="rgba(239, 68, 68, 0.1)",children:[i.jsx(zi,{className:"w-3.5 h-3.5"})," Sign Out"]})]}),i.jsxs("div",{className:"s-spotlight",style:{backgroundColor:"var(--bg-card)",backdropFilter:"blur(16px)",border:"1px solid var(--border)",borderRadius:"24px",padding:"36px",display:"flex",gap:"32px",alignItems:"flex-start",flexWrap:"wrap"},children:[i.jsx("div",{style:{width:"90px",height:"90px",borderRadius:"20px",background:"linear-gradient(135deg, #10B981, rgba(6, 182, 212, 0.4))",color:"#FFFFFF",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-serif)",fontSize:"32px",fontWeight:400,boxShadow:"0 10px 30px rgba(16, 185, 129, 0.25)",flexShrink:0},children:x}),i.jsxs("div",{style:{flex:1,minWidth:"260px"},children:[l?i.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",marginBottom:"12px"},children:[i.jsx("input",{type:"text",value:d,onChange:b=>h(b.target.value),onKeyDown:b=>{b.key==="Enter"&&y(),b.key==="Escape"&&(c(!1),h((t==null?void 0:t.name)||""))},style:{fontFamily:"var(--font-serif)",fontSize:"24px",color:"var(--text)",backgroundColor:"rgba(255,255,255,0.04)",border:"1px solid var(--emerald)",borderRadius:"10px",padding:"6px 14px",outline:"none",flex:1},autoFocus:!0}),i.jsx("button",{onClick:y,disabled:p,style:{padding:"8px 16px",backgroundColor:"var(--emerald)",color:"#FFFFFF",border:"none",borderRadius:"10px",fontFamily:"var(--font-tech)",fontSize:"11px",cursor:"pointer"},children:p?"Saving...":"Save"}),i.jsx("button",{onClick:()=>{c(!1),h((t==null?void 0:t.name)||"")},style:{padding:"8px 16px",backgroundColor:"transparent",color:"var(--text-muted)",border:"1px solid var(--border)",borderRadius:"10px",fontFamily:"var(--font-tech)",fontSize:"11px",cursor:"pointer"},children:"Cancel"})]}):i.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"16px",marginBottom:"8px"},children:[i.jsx("h2",{style:{fontFamily:"var(--font-serif)",fontSize:"32px",fontWeight:300,color:"var(--text)"},children:(t==null?void 0:t.name)||"Developer"}),i.jsxs("button",{onClick:()=>c(!0),style:{display:"inline-flex",alignItems:"center",gap:"4px",padding:"4px 12px",backgroundColor:"rgba(255,255,255,0.04)",border:"1px solid var(--border)",borderRadius:"999px",fontFamily:"var(--font-tech)",fontSize:"10px",color:"var(--text-muted)",cursor:"pointer",transition:"all 0.2s"},onMouseOver:b=>b.currentTarget.style.borderColor="var(--emerald)",onMouseOut:b=>b.currentTarget.style.borderColor="var(--border)",children:[i.jsx(Bi,{className:"w-3 h-3 text-emerald-400"})," Edit"]})]}),f&&i.jsx("p",{style:{fontFamily:"var(--font-tech)",fontSize:"11px",color:f.includes("success")?"#10B981":"#EF4444",marginBottom:"8px"},children:f}),i.jsx("p",{style:{fontFamily:"var(--font-sans)",fontSize:"14px",color:"var(--text-muted)",marginBottom:"12px"},children:(t==null?void 0:t.email)||"user@sycnops.io"}),i.jsx("span",{style:{display:"inline-block",fontFamily:"var(--font-tech)",fontSize:"10px",fontWeight:600,letterSpacing:"0.15em",textTransform:"uppercase",padding:"6px 14px",borderRadius:"999px",backgroundColor:"rgba(16, 185, 129, 0.12)",color:"#10B981",border:"1px solid rgba(16, 185, 129, 0.3)",marginBottom:"32px"},children:(t==null?void 0:t.role)||"Developer"}),i.jsxs("div",{style:{borderTop:"1px solid var(--border)",paddingTop:"24px"},children:[i.jsx("h3",{style:{fontFamily:"var(--font-tech)",fontSize:"10px",fontWeight:600,letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--text-muted)",marginBottom:"16px"},children:"ACTIVE STACK & PROTOCOLS"}),i.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:"10px"},children:["MongoDB Atlas","TypeScript","React 18","Node.js Express","TanStack Query","Tailwind CSS"].map(b=>i.jsx("span",{style:{padding:"8px 14px",backgroundColor:"rgba(255,255,255,0.03)",border:"1px solid var(--border)",borderRadius:"10px",fontFamily:"var(--font-tech)",fontSize:"11px",color:"var(--text)"},children:b},b))})]})]})]})]})}function En(){const t=ct();return _.useEffect(()=>{t("/login",{replace:!0})},[t]),i.jsx("div",{style:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",backgroundColor:"var(--ground)",fontFamily:"var(--font-mono)",color:"var(--ink)"},children:i.jsxs("div",{style:{textAlign:"center",padding:"32px"},children:[i.jsx("div",{style:{width:"32px",height:"32px",border:"3px solid var(--hair)",borderTopColor:"var(--pigment)",borderRadius:"50%",margin:"0 auto 16px",animation:"spin 1s linear infinite"}}),i.jsx("p",{style:{fontSize:"13px"},children:"Redirecting..."})]})})}const np=[{name:"Dashboard",href:"/dashboard"},{name:"Repositories",href:"/repositories"},{name:"Pull Requests",href:"/pull-requests"},{name:"Issues",href:"/issues"},{name:"Analytics",href:"/analytics"},{name:"AI Assistant",href:"/ai-assistant"},{name:"Notifications",href:"/notifications"},{name:"Settings",href:"/settings"},{name:"Profile",href:"/profile"}];function Y({children:t}){const[e,s]=_.useState(!1),n=wi(),r=()=>{try{const l=localStorage.getItem("sycnops_user");if(l){const c=JSON.parse(l);if(c.name&&c.name.trim())return c.name.trim().toUpperCase();if(c.email)return c.email.split("@")[0].replace(/[^a-zA-Z]/g," ").trim().toUpperCase()||"USER"}}catch{}return"USER"},[a,o]=_.useState(r);return _.useEffect(()=>{const l=()=>{o(r())};return window.addEventListener("sycnops_user_updated",l),window.addEventListener("storage",l),o(r()),()=>{window.removeEventListener("sycnops_user_updated",l),window.removeEventListener("storage",l)}},[n.pathname]),i.jsxs("div",{className:"s-dash",children:[i.jsx("div",{className:"s-glow s-glow--1"}),i.jsx("div",{className:"s-glow s-glow--2"}),e&&i.jsx("div",{style:{position:"fixed",inset:0,zIndex:40,backgroundColor:"rgba(0,0,0,0.6)",backdropFilter:"blur(4px)"},onClick:()=>s(!1)}),i.jsxs("aside",{className:`s-sidebar ${e?"open":"hidden md:flex"}`,children:[i.jsxs("div",{className:"s-sidebar__header",children:[i.jsxs(L,{to:"/",style:{textDecoration:"none",color:"var(--text)",fontFamily:"var(--font-serif)",fontSize:"22px",fontWeight:400,letterSpacing:"-0.02em",display:"flex",alignItems:"center",gap:"10px"},children:[i.jsx("span",{style:{width:"28px",height:"28px",background:"var(--text)",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--bg)",fontSize:"14px",fontWeight:700},children:"S"}),"SycnOps",i.jsx("span",{style:{color:"var(--emerald)"},children:"."})]}),e&&i.jsx("button",{onClick:()=>s(!1),style:{background:"none",border:"none",cursor:"pointer",float:"right",color:"var(--text)"},children:i.jsx(dt,{size:20})})]}),i.jsx("nav",{className:"s-sidebar__nav",children:np.map(l=>i.jsx(L,{to:l.href,className:`s-sidebar__link ${n.pathname===l.href?"is-active":""}`,onClick:()=>s(!1),children:l.name},l.name))}),i.jsx("div",{style:{marginTop:"auto",padding:"0 24px"},children:i.jsx("div",{style:{fontFamily:"var(--font-tech)",fontSize:"10px",color:"var(--text-dim)",letterSpacing:".2em",textTransform:"uppercase"},children:"VERSION 2.0.26"})})]}),i.jsxs("main",{className:"s-main",children:[i.jsxs("header",{className:"s-topbar",children:[i.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"16px"},children:[i.jsx("button",{className:"md:hidden",onClick:()=>s(!0),style:{background:"none",border:"none",cursor:"pointer",padding:0,color:"var(--text)"},children:i.jsx(Tn,{size:22})}),i.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"8px"},children:[i.jsx("span",{style:{width:"6px",height:"6px",borderRadius:"50%",background:"var(--emerald)",boxShadow:"0 0 8px var(--emerald)",animation:"count-pulse 2s ease-in-out infinite"}}),i.jsx("span",{style:{fontFamily:"var(--font-tech)",fontSize:"10px",letterSpacing:".2em",textTransform:"uppercase",color:"var(--text-muted)"},children:"Studio Instance — Active"})]})]}),i.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"24px"},children:[i.jsx("span",{style:{fontFamily:"var(--font-tech)",fontSize:"11px",fontWeight:600,letterSpacing:".15em",color:"var(--text)"},children:a}),i.jsx("div",{style:{width:"32px",height:"32px",borderRadius:"50%",background:"linear-gradient(135deg, var(--emerald), rgba(16,185,129,0.4))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:600,color:"#fff",fontFamily:"var(--font-tech)"},children:a.charAt(0)})]})]}),i.jsx("div",{className:"s-content",children:t})]})]})}function rp(){return i.jsx(_i,{children:i.jsxs(Si,{children:[i.jsx(D,{path:"/",element:i.jsx(qi,{})}),i.jsx(D,{path:"/login",element:i.jsx(Hu,{})}),i.jsx(D,{path:"/register",element:i.jsx(Vu,{})}),i.jsx(D,{path:"/auth/callback",element:i.jsx(En,{})}),i.jsx(D,{path:"/auth/google/callback",element:i.jsx(En,{})}),i.jsx(D,{path:"/dashboard",element:i.jsx(Y,{children:i.jsx(Ku,{})})}),i.jsx(D,{path:"/repositories",element:i.jsx(Y,{children:i.jsx(Ju,{})})}),i.jsx(D,{path:"/pull-requests",element:i.jsx(Y,{children:i.jsx(Yu,{})})}),i.jsx(D,{path:"/issues",element:i.jsx(Y,{children:i.jsx(Xu,{})})}),i.jsx(D,{path:"/analytics",element:i.jsx(Y,{children:i.jsx(Qu,{})})}),i.jsx(D,{path:"/ai-assistant",element:i.jsx(Y,{children:i.jsx(Zu,{})})}),i.jsx(D,{path:"/notifications",element:i.jsx(Y,{children:i.jsx(ep,{})})}),i.jsx(D,{path:"/settings",element:i.jsx(Y,{children:i.jsx(tp,{})})}),i.jsx(D,{path:"/profile",element:i.jsx(Y,{children:i.jsx(sp,{})})})]})})}const ip=new xi({defaultOptions:{queries:{refetchOnWindowFocus:!1,retry:1}}});Mt.createRoot(document.getElementById("root")).render(i.jsx(yi.StrictMode,{children:i.jsx(bi,{client:ip,children:i.jsx(rp,{})})}));
