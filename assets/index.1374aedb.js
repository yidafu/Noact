var j=Object.defineProperty,v=Object.defineProperties;var M=Object.getOwnPropertyDescriptors;var T=Object.getOwnPropertySymbols;var S=Object.prototype.hasOwnProperty,U=Object.prototype.propertyIsEnumerable;var k=(e,t,n)=>t in e?j(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,C=(e,t)=>{for(var n in t||(t={}))S.call(t,n)&&k(e,n,t[n]);if(T)for(var n of T(t))U.call(t,n)&&k(e,n,t[n]);return e},L=(e,t)=>v(e,M(t));const F=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))o(l);new MutationObserver(l=>{for(const i of l)if(i.type==="childList")for(const c of i.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function n(l){const i={};return l.integrity&&(i.integrity=l.integrity),l.referrerpolicy&&(i.referrerPolicy=l.referrerpolicy),l.crossorigin==="use-credentials"?i.credentials="include":l.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(l){if(l.ep)return;l.ep=!0;const i=n(l);fetch(l.href,i)}};F();function r(e,t,...n){return{type:e,props:L(C({},t),{children:n.map(o=>typeof o=="object"?o:H(o))})}}function H(e){return{type:"TEXT_ELEMENT",props:{nodeValue:e,children:[]}}}let f=null,a=null,s=null,O=[],u=null,h=-1;function y(e){f=e}function g(e){a=e}function x(e){s=e}function D(){O.length=0}function R(e){u=e}function I(e){h=e}function E(e){return e.startsWith("on")}function N(e){return e!=="children"&&!E(e)}function d(e,t){return function(n){return e[n]!==t[n]}}function X(){O.forEach(p),p(a.child),x(a),g(null)}function p(e){var o;if(!e)return;let t=e.parent;for(;!t.dom;)t=t.parent;const n=t.dom;e.effectTag==="PLACEMENT"&&e.dom!==null?n==null||n.appendChild(e.dom):e.effectTag==="DELETION"&&e.dom!==null?W(e,n):e.effectTag==="UPDATE"&&e.dom!==null&&w(e.dom,(o=e.alternate)==null?void 0:o.props,e.props),p(e.child),p(e.sibling)}function W(e,t){e.dom!=null?t.removeChild(e.dom):W(e.child,t)}function w(e,t,n){Object.keys(t).filter(E).filter(o=>!(o in n)||d(t,n)(o)).forEach(o=>{const l=o.toLowerCase().substring(2);e.removeEventListener(l,t[o])}),Object.keys(n).filter(E).filter(d(t,n)).forEach(o=>{const l=o.toLowerCase().substring(2);e.addEventListener(l,n[o])}),Object.keys(t).filter(N).filter(o=>!(o in n)||d(t,n)(o)).forEach(o=>{e[o]=""}),Object.keys(n).filter(N).filter(d(t,n)).forEach(o=>{e[o]=n[o]})}function q(e,t){let n=0,o=null,l=e.alternate&&e.alternate.child;for(;n<t.length||l!=null;){const i=t[n];let c=null;const m=l&&i&&l.type===i.type;m&&(c={type:l.type,props:i.props,dom:l.dom,parent:e,alternate:l,effectTag:"UPDATE"}),i&&!m&&(c={type:i.type,props:i.props,dom:null,parent:e,alternate:null,effectTag:"PLACEMENT"}),l&!m&&(l.effectTag="DELETION",deletions.push(l)),l&&(l=l.sibling),n===0?e.child=c:i&&(o.sibling=c),o=c,n++}}function _(e){const t=e.type==="TEXT_ELEMENT"?document.createTextNode(""):document.createElement(e.type);return w(t,{},e.props),t}function B(e,t){g({dom:t,props:{children:[e]},alternate:s}),D(),y(a)}function A(e){console.log("work loop ...");let t=!1;for(;f&&!t;){const n=K(f);y(n),t=e.timeRemaining()<1}!f&&a&&X(),requestIdleCallback(A)}requestIdleCallback(A);function K(e){if(e.type instanceof Function?V(e):Y(e),e.child)return e.child;let n=e;for(;n;){if(n.sibling)return n.sibling;n=n.parent}}function V(e){R(e),I(0),u.hooks=[];const t=[e.type(e.props)];q(e,t)}function Y(e){e.dom||(e.dom=_(e));const t=e.props.children;q(e,t)}function $(e){var i;const t=(i=u==null?void 0:u.alternate)==null?void 0:i.hooks[h],n={state:t?t.state:e,queue:[]};(t?t.queue:[]).forEach(c=>{n.state=c(n.state)});const l=c=>{n.queue.push(c),g({dom:s==null?void 0:s.dom,props:s==null?void 0:s.props,alternate:s}),y(a),D()};return u==null||u.hooks.push(n),I(h+1),[n.state,l]}function z(e){const[t,n]=$(1);return r("div",null,r("h1",null,"Counter power by ",e.name),r("button",{style:"margin: 10px",onClick:()=>n(o=>o+1)},"plus 1"),r("button",{style:"margin: 10px",onClick:()=>n(o=>o-1)},"minus 1"),r("span",null,"result: ",t))}B(r(z,{name:"Noact"}),document.getElementById("app"));
