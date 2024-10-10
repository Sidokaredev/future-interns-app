import{r as $,a2 as Rt,e as De,j as be,_ as Z,k as Ye,h as At,a3 as Ct,b as jt,u as Dt}from"./index-DZ-2hnVc.js";import{o as ze,f as $t}from"./Menu-BFsOZlVc.js";import{a as Ge,c as Tt}from"./Button-DamuMybp.js";const St={disableDefaultClasses:!1},Mt=$.createContext(St);function kt(e){const{disableDefaultClasses:t}=$.useContext(Mt);return r=>t?"":e(r)}const at="base";function Bt(e){return`${at}--${e}`}function Wt(e,t){return`${at}-${e}-${t}`}function it(e,t){const r=Rt[t];return r?Bt(r):Wt(e,t)}function Lt(e,t){const r={};return t.forEach(o=>{r[o]=it(e,o)}),r}var S="top",L="bottom",H="right",M="left",$e="auto",le=[S,L,H,M],ee="start",fe="end",Ht="clippingParents",st="viewport",ie="popper",Nt="reference",Je=le.reduce(function(e,t){return e.concat([t+"-"+ee,t+"-"+fe])},[]),pt=[].concat(le,[$e]).reduce(function(e,t){return e.concat([t,t+"-"+ee,t+"-"+fe])},[]),Vt="beforeRead",Ft="read",qt="afterRead",Ut="beforeMain",It="main",Xt="afterMain",_t="beforeWrite",Yt="write",zt="afterWrite",Gt=[Vt,Ft,qt,Ut,It,Xt,_t,Yt,zt];function V(e){return e?(e.nodeName||"").toLowerCase():null}function B(e){if(e==null)return window;if(e.toString()!=="[object Window]"){var t=e.ownerDocument;return t&&t.defaultView||window}return e}function K(e){var t=B(e).Element;return e instanceof t||e instanceof Element}function W(e){var t=B(e).HTMLElement;return e instanceof t||e instanceof HTMLElement}function Te(e){if(typeof ShadowRoot>"u")return!1;var t=B(e).ShadowRoot;return e instanceof t||e instanceof ShadowRoot}function Jt(e){var t=e.state;Object.keys(t.elements).forEach(function(r){var o=t.styles[r]||{},n=t.attributes[r]||{},a=t.elements[r];!W(a)||!V(a)||(Object.assign(a.style,o),Object.keys(n).forEach(function(f){var s=n[f];s===!1?a.removeAttribute(f):a.setAttribute(f,s===!0?"":s)}))})}function Kt(e){var t=e.state,r={popper:{position:t.options.strategy,left:"0",top:"0",margin:"0"},arrow:{position:"absolute"},reference:{}};return Object.assign(t.elements.popper.style,r.popper),t.styles=r,t.elements.arrow&&Object.assign(t.elements.arrow.style,r.arrow),function(){Object.keys(t.elements).forEach(function(o){var n=t.elements[o],a=t.attributes[o]||{},f=Object.keys(t.styles.hasOwnProperty(o)?t.styles[o]:r[o]),s=f.reduce(function(i,c){return i[c]="",i},{});!W(n)||!V(n)||(Object.assign(n.style,s),Object.keys(a).forEach(function(i){n.removeAttribute(i)}))})}}const Qt={name:"applyStyles",enabled:!0,phase:"write",fn:Jt,effect:Kt,requires:["computeStyles"]};function N(e){return e.split("-")[0]}var J=Math.max,we=Math.min,te=Math.round;function Ae(){var e=navigator.userAgentData;return e!=null&&e.brands&&Array.isArray(e.brands)?e.brands.map(function(t){return t.brand+"/"+t.version}).join(" "):navigator.userAgent}function ft(){return!/^((?!chrome|android).)*safari/i.test(Ae())}function re(e,t,r){t===void 0&&(t=!1),r===void 0&&(r=!1);var o=e.getBoundingClientRect(),n=1,a=1;t&&W(e)&&(n=e.offsetWidth>0&&te(o.width)/e.offsetWidth||1,a=e.offsetHeight>0&&te(o.height)/e.offsetHeight||1);var f=K(e)?B(e):window,s=f.visualViewport,i=!ft()&&r,c=(o.left+(i&&s?s.offsetLeft:0))/n,p=(o.top+(i&&s?s.offsetTop:0))/a,v=o.width/n,y=o.height/a;return{width:v,height:y,top:p,right:c+v,bottom:p+y,left:c,x:c,y:p}}function Se(e){var t=re(e),r=e.offsetWidth,o=e.offsetHeight;return Math.abs(t.width-r)<=1&&(r=t.width),Math.abs(t.height-o)<=1&&(o=t.height),{x:e.offsetLeft,y:e.offsetTop,width:r,height:o}}function ct(e,t){var r=t.getRootNode&&t.getRootNode();if(e.contains(t))return!0;if(r&&Te(r)){var o=t;do{if(o&&e.isSameNode(o))return!0;o=o.parentNode||o.host}while(o)}return!1}function U(e){return B(e).getComputedStyle(e)}function Zt(e){return["table","td","th"].indexOf(V(e))>=0}function _(e){return((K(e)?e.ownerDocument:e.document)||window.document).documentElement}function xe(e){return V(e)==="html"?e:e.assignedSlot||e.parentNode||(Te(e)?e.host:null)||_(e)}function Ke(e){return!W(e)||U(e).position==="fixed"?null:e.offsetParent}function er(e){var t=/firefox/i.test(Ae()),r=/Trident/i.test(Ae());if(r&&W(e)){var o=U(e);if(o.position==="fixed")return null}var n=xe(e);for(Te(n)&&(n=n.host);W(n)&&["html","body"].indexOf(V(n))<0;){var a=U(n);if(a.transform!=="none"||a.perspective!=="none"||a.contain==="paint"||["transform","perspective"].indexOf(a.willChange)!==-1||t&&a.willChange==="filter"||t&&a.filter&&a.filter!=="none")return n;n=n.parentNode}return null}function ue(e){for(var t=B(e),r=Ke(e);r&&Zt(r)&&U(r).position==="static";)r=Ke(r);return r&&(V(r)==="html"||V(r)==="body"&&U(r).position==="static")?t:r||er(e)||t}function Me(e){return["top","bottom"].indexOf(e)>=0?"x":"y"}function se(e,t,r){return J(e,we(t,r))}function tr(e,t,r){var o=se(e,t,r);return o>r?r:o}function lt(){return{top:0,right:0,bottom:0,left:0}}function ut(e){return Object.assign({},lt(),e)}function dt(e,t){return t.reduce(function(r,o){return r[o]=e,r},{})}var rr=function(t,r){return t=typeof t=="function"?t(Object.assign({},r.rects,{placement:r.placement})):t,ut(typeof t!="number"?t:dt(t,le))};function or(e){var t,r=e.state,o=e.name,n=e.options,a=r.elements.arrow,f=r.modifiersData.popperOffsets,s=N(r.placement),i=Me(s),c=[M,H].indexOf(s)>=0,p=c?"height":"width";if(!(!a||!f)){var v=rr(n.padding,r),y=Se(a),u=i==="y"?S:M,x=i==="y"?L:H,d=r.rects.reference[p]+r.rects.reference[i]-f[i]-r.rects.popper[p],m=f[i]-r.rects.reference[i],w=ue(a),P=w?i==="y"?w.clientHeight||0:w.clientWidth||0:0,b=d/2-m/2,l=v[u],h=P-y[p]-v[x],g=P/2-y[p]/2+b,O=se(l,g,h),A=i;r.modifiersData[o]=(t={},t[A]=O,t.centerOffset=O-g,t)}}function nr(e){var t=e.state,r=e.options,o=r.element,n=o===void 0?"[data-popper-arrow]":o;n!=null&&(typeof n=="string"&&(n=t.elements.popper.querySelector(n),!n)||ct(t.elements.popper,n)&&(t.elements.arrow=n))}const ar={name:"arrow",enabled:!0,phase:"main",fn:or,effect:nr,requires:["popperOffsets"],requiresIfExists:["preventOverflow"]};function oe(e){return e.split("-")[1]}var ir={top:"auto",right:"auto",bottom:"auto",left:"auto"};function sr(e,t){var r=e.x,o=e.y,n=t.devicePixelRatio||1;return{x:te(r*n)/n||0,y:te(o*n)/n||0}}function Qe(e){var t,r=e.popper,o=e.popperRect,n=e.placement,a=e.variation,f=e.offsets,s=e.position,i=e.gpuAcceleration,c=e.adaptive,p=e.roundOffsets,v=e.isFixed,y=f.x,u=y===void 0?0:y,x=f.y,d=x===void 0?0:x,m=typeof p=="function"?p({x:u,y:d}):{x:u,y:d};u=m.x,d=m.y;var w=f.hasOwnProperty("x"),P=f.hasOwnProperty("y"),b=M,l=S,h=window;if(c){var g=ue(r),O="clientHeight",A="clientWidth";if(g===B(r)&&(g=_(r),U(g).position!=="static"&&s==="absolute"&&(O="scrollHeight",A="scrollWidth")),g=g,n===S||(n===M||n===H)&&a===fe){l=L;var R=v&&g===h&&h.visualViewport?h.visualViewport.height:g[O];d-=R-o.height,d*=i?1:-1}if(n===M||(n===S||n===L)&&a===fe){b=H;var E=v&&g===h&&h.visualViewport?h.visualViewport.width:g[A];u-=E-o.width,u*=i?1:-1}}var C=Object.assign({position:s},c&&ir),k=p===!0?sr({x:u,y:d},B(r)):{x:u,y:d};if(u=k.x,d=k.y,i){var D;return Object.assign({},C,(D={},D[l]=P?"0":"",D[b]=w?"0":"",D.transform=(h.devicePixelRatio||1)<=1?"translate("+u+"px, "+d+"px)":"translate3d("+u+"px, "+d+"px, 0)",D))}return Object.assign({},C,(t={},t[l]=P?d+"px":"",t[b]=w?u+"px":"",t.transform="",t))}function pr(e){var t=e.state,r=e.options,o=r.gpuAcceleration,n=o===void 0?!0:o,a=r.adaptive,f=a===void 0?!0:a,s=r.roundOffsets,i=s===void 0?!0:s,c={placement:N(t.placement),variation:oe(t.placement),popper:t.elements.popper,popperRect:t.rects.popper,gpuAcceleration:n,isFixed:t.options.strategy==="fixed"};t.modifiersData.popperOffsets!=null&&(t.styles.popper=Object.assign({},t.styles.popper,Qe(Object.assign({},c,{offsets:t.modifiersData.popperOffsets,position:t.options.strategy,adaptive:f,roundOffsets:i})))),t.modifiersData.arrow!=null&&(t.styles.arrow=Object.assign({},t.styles.arrow,Qe(Object.assign({},c,{offsets:t.modifiersData.arrow,position:"absolute",adaptive:!1,roundOffsets:i})))),t.attributes.popper=Object.assign({},t.attributes.popper,{"data-popper-placement":t.placement})}const fr={name:"computeStyles",enabled:!0,phase:"beforeWrite",fn:pr,data:{}};var ge={passive:!0};function cr(e){var t=e.state,r=e.instance,o=e.options,n=o.scroll,a=n===void 0?!0:n,f=o.resize,s=f===void 0?!0:f,i=B(t.elements.popper),c=[].concat(t.scrollParents.reference,t.scrollParents.popper);return a&&c.forEach(function(p){p.addEventListener("scroll",r.update,ge)}),s&&i.addEventListener("resize",r.update,ge),function(){a&&c.forEach(function(p){p.removeEventListener("scroll",r.update,ge)}),s&&i.removeEventListener("resize",r.update,ge)}}const lr={name:"eventListeners",enabled:!0,phase:"write",fn:function(){},effect:cr,data:{}};var ur={left:"right",right:"left",bottom:"top",top:"bottom"};function ye(e){return e.replace(/left|right|bottom|top/g,function(t){return ur[t]})}var dr={start:"end",end:"start"};function Ze(e){return e.replace(/start|end/g,function(t){return dr[t]})}function ke(e){var t=B(e),r=t.pageXOffset,o=t.pageYOffset;return{scrollLeft:r,scrollTop:o}}function Be(e){return re(_(e)).left+ke(e).scrollLeft}function vr(e,t){var r=B(e),o=_(e),n=r.visualViewport,a=o.clientWidth,f=o.clientHeight,s=0,i=0;if(n){a=n.width,f=n.height;var c=ft();(c||!c&&t==="fixed")&&(s=n.offsetLeft,i=n.offsetTop)}return{width:a,height:f,x:s+Be(e),y:i}}function mr(e){var t,r=_(e),o=ke(e),n=(t=e.ownerDocument)==null?void 0:t.body,a=J(r.scrollWidth,r.clientWidth,n?n.scrollWidth:0,n?n.clientWidth:0),f=J(r.scrollHeight,r.clientHeight,n?n.scrollHeight:0,n?n.clientHeight:0),s=-o.scrollLeft+Be(e),i=-o.scrollTop;return U(n||r).direction==="rtl"&&(s+=J(r.clientWidth,n?n.clientWidth:0)-a),{width:a,height:f,x:s,y:i}}function We(e){var t=U(e),r=t.overflow,o=t.overflowX,n=t.overflowY;return/auto|scroll|overlay|hidden/.test(r+n+o)}function vt(e){return["html","body","#document"].indexOf(V(e))>=0?e.ownerDocument.body:W(e)&&We(e)?e:vt(xe(e))}function pe(e,t){var r;t===void 0&&(t=[]);var o=vt(e),n=o===((r=e.ownerDocument)==null?void 0:r.body),a=B(o),f=n?[a].concat(a.visualViewport||[],We(o)?o:[]):o,s=t.concat(f);return n?s:s.concat(pe(xe(f)))}function Ce(e){return Object.assign({},e,{left:e.x,top:e.y,right:e.x+e.width,bottom:e.y+e.height})}function hr(e,t){var r=re(e,!1,t==="fixed");return r.top=r.top+e.clientTop,r.left=r.left+e.clientLeft,r.bottom=r.top+e.clientHeight,r.right=r.left+e.clientWidth,r.width=e.clientWidth,r.height=e.clientHeight,r.x=r.left,r.y=r.top,r}function et(e,t,r){return t===st?Ce(vr(e,r)):K(t)?hr(t,r):Ce(mr(_(e)))}function gr(e){var t=pe(xe(e)),r=["absolute","fixed"].indexOf(U(e).position)>=0,o=r&&W(e)?ue(e):e;return K(o)?t.filter(function(n){return K(n)&&ct(n,o)&&V(n)!=="body"}):[]}function yr(e,t,r,o){var n=t==="clippingParents"?gr(e):[].concat(t),a=[].concat(n,[r]),f=a[0],s=a.reduce(function(i,c){var p=et(e,c,o);return i.top=J(p.top,i.top),i.right=we(p.right,i.right),i.bottom=we(p.bottom,i.bottom),i.left=J(p.left,i.left),i},et(e,f,o));return s.width=s.right-s.left,s.height=s.bottom-s.top,s.x=s.left,s.y=s.top,s}function mt(e){var t=e.reference,r=e.element,o=e.placement,n=o?N(o):null,a=o?oe(o):null,f=t.x+t.width/2-r.width/2,s=t.y+t.height/2-r.height/2,i;switch(n){case S:i={x:f,y:t.y-r.height};break;case L:i={x:f,y:t.y+t.height};break;case H:i={x:t.x+t.width,y:s};break;case M:i={x:t.x-r.width,y:s};break;default:i={x:t.x,y:t.y}}var c=n?Me(n):null;if(c!=null){var p=c==="y"?"height":"width";switch(a){case ee:i[c]=i[c]-(t[p]/2-r[p]/2);break;case fe:i[c]=i[c]+(t[p]/2-r[p]/2);break}}return i}function ce(e,t){t===void 0&&(t={});var r=t,o=r.placement,n=o===void 0?e.placement:o,a=r.strategy,f=a===void 0?e.strategy:a,s=r.boundary,i=s===void 0?Ht:s,c=r.rootBoundary,p=c===void 0?st:c,v=r.elementContext,y=v===void 0?ie:v,u=r.altBoundary,x=u===void 0?!1:u,d=r.padding,m=d===void 0?0:d,w=ut(typeof m!="number"?m:dt(m,le)),P=y===ie?Nt:ie,b=e.rects.popper,l=e.elements[x?P:y],h=yr(K(l)?l:l.contextElement||_(e.elements.popper),i,p,f),g=re(e.elements.reference),O=mt({reference:g,element:b,strategy:"absolute",placement:n}),A=Ce(Object.assign({},b,O)),R=y===ie?A:g,E={top:h.top-R.top+w.top,bottom:R.bottom-h.bottom+w.bottom,left:h.left-R.left+w.left,right:R.right-h.right+w.right},C=e.modifiersData.offset;if(y===ie&&C){var k=C[n];Object.keys(E).forEach(function(D){var F=[H,L].indexOf(D)>=0?1:-1,q=[S,L].indexOf(D)>=0?"y":"x";E[D]+=k[q]*F})}return E}function br(e,t){t===void 0&&(t={});var r=t,o=r.placement,n=r.boundary,a=r.rootBoundary,f=r.padding,s=r.flipVariations,i=r.allowedAutoPlacements,c=i===void 0?pt:i,p=oe(o),v=p?s?Je:Je.filter(function(x){return oe(x)===p}):le,y=v.filter(function(x){return c.indexOf(x)>=0});y.length===0&&(y=v);var u=y.reduce(function(x,d){return x[d]=ce(e,{placement:d,boundary:n,rootBoundary:a,padding:f})[N(d)],x},{});return Object.keys(u).sort(function(x,d){return u[x]-u[d]})}function wr(e){if(N(e)===$e)return[];var t=ye(e);return[Ze(e),t,Ze(t)]}function xr(e){var t=e.state,r=e.options,o=e.name;if(!t.modifiersData[o]._skip){for(var n=r.mainAxis,a=n===void 0?!0:n,f=r.altAxis,s=f===void 0?!0:f,i=r.fallbackPlacements,c=r.padding,p=r.boundary,v=r.rootBoundary,y=r.altBoundary,u=r.flipVariations,x=u===void 0?!0:u,d=r.allowedAutoPlacements,m=t.options.placement,w=N(m),P=w===m,b=i||(P||!x?[ye(m)]:wr(m)),l=[m].concat(b).reduce(function(Q,X){return Q.concat(N(X)===$e?br(t,{placement:X,boundary:p,rootBoundary:v,padding:c,flipVariations:x,allowedAutoPlacements:d}):X)},[]),h=t.rects.reference,g=t.rects.popper,O=new Map,A=!0,R=l[0],E=0;E<l.length;E++){var C=l[E],k=N(C),D=oe(C)===ee,F=[S,L].indexOf(k)>=0,q=F?"width":"height",j=ce(t,{placement:C,boundary:p,rootBoundary:v,altBoundary:y,padding:c}),T=F?D?H:M:D?L:S;h[q]>g[q]&&(T=ye(T));var I=ye(T),Y=[];if(a&&Y.push(j[k]<=0),s&&Y.push(j[T]<=0,j[I]<=0),Y.every(function(Q){return Q})){R=C,A=!1;break}O.set(C,Y)}if(A)for(var de=x?3:1,Oe=function(X){var ae=l.find(function(me){var z=O.get(me);if(z)return z.slice(0,X).every(function(Pe){return Pe})});if(ae)return R=ae,"break"},ne=de;ne>0;ne--){var ve=Oe(ne);if(ve==="break")break}t.placement!==R&&(t.modifiersData[o]._skip=!0,t.placement=R,t.reset=!0)}}const Or={name:"flip",enabled:!0,phase:"main",fn:xr,requiresIfExists:["offset"],data:{_skip:!1}};function tt(e,t,r){return r===void 0&&(r={x:0,y:0}),{top:e.top-t.height-r.y,right:e.right-t.width+r.x,bottom:e.bottom-t.height+r.y,left:e.left-t.width-r.x}}function rt(e){return[S,H,L,M].some(function(t){return e[t]>=0})}function Pr(e){var t=e.state,r=e.name,o=t.rects.reference,n=t.rects.popper,a=t.modifiersData.preventOverflow,f=ce(t,{elementContext:"reference"}),s=ce(t,{altBoundary:!0}),i=tt(f,o),c=tt(s,n,a),p=rt(i),v=rt(c);t.modifiersData[r]={referenceClippingOffsets:i,popperEscapeOffsets:c,isReferenceHidden:p,hasPopperEscaped:v},t.attributes.popper=Object.assign({},t.attributes.popper,{"data-popper-reference-hidden":p,"data-popper-escaped":v})}const Er={name:"hide",enabled:!0,phase:"main",requiresIfExists:["preventOverflow"],fn:Pr};function Rr(e,t,r){var o=N(e),n=[M,S].indexOf(o)>=0?-1:1,a=typeof r=="function"?r(Object.assign({},t,{placement:e})):r,f=a[0],s=a[1];return f=f||0,s=(s||0)*n,[M,H].indexOf(o)>=0?{x:s,y:f}:{x:f,y:s}}function Ar(e){var t=e.state,r=e.options,o=e.name,n=r.offset,a=n===void 0?[0,0]:n,f=pt.reduce(function(p,v){return p[v]=Rr(v,t.rects,a),p},{}),s=f[t.placement],i=s.x,c=s.y;t.modifiersData.popperOffsets!=null&&(t.modifiersData.popperOffsets.x+=i,t.modifiersData.popperOffsets.y+=c),t.modifiersData[o]=f}const Cr={name:"offset",enabled:!0,phase:"main",requires:["popperOffsets"],fn:Ar};function jr(e){var t=e.state,r=e.name;t.modifiersData[r]=mt({reference:t.rects.reference,element:t.rects.popper,strategy:"absolute",placement:t.placement})}const Dr={name:"popperOffsets",enabled:!0,phase:"read",fn:jr,data:{}};function $r(e){return e==="x"?"y":"x"}function Tr(e){var t=e.state,r=e.options,o=e.name,n=r.mainAxis,a=n===void 0?!0:n,f=r.altAxis,s=f===void 0?!1:f,i=r.boundary,c=r.rootBoundary,p=r.altBoundary,v=r.padding,y=r.tether,u=y===void 0?!0:y,x=r.tetherOffset,d=x===void 0?0:x,m=ce(t,{boundary:i,rootBoundary:c,padding:v,altBoundary:p}),w=N(t.placement),P=oe(t.placement),b=!P,l=Me(w),h=$r(l),g=t.modifiersData.popperOffsets,O=t.rects.reference,A=t.rects.popper,R=typeof d=="function"?d(Object.assign({},t.rects,{placement:t.placement})):d,E=typeof R=="number"?{mainAxis:R,altAxis:R}:Object.assign({mainAxis:0,altAxis:0},R),C=t.modifiersData.offset?t.modifiersData.offset[t.placement]:null,k={x:0,y:0};if(g){if(a){var D,F=l==="y"?S:M,q=l==="y"?L:H,j=l==="y"?"height":"width",T=g[l],I=T+m[F],Y=T-m[q],de=u?-A[j]/2:0,Oe=P===ee?O[j]:A[j],ne=P===ee?-A[j]:-O[j],ve=t.elements.arrow,Q=u&&ve?Se(ve):{width:0,height:0},X=t.modifiersData["arrow#persistent"]?t.modifiersData["arrow#persistent"].padding:lt(),ae=X[F],me=X[q],z=se(0,O[j],Q[j]),Pe=b?O[j]/2-de-z-ae-E.mainAxis:Oe-z-ae-E.mainAxis,bt=b?-O[j]/2+de+z+me+E.mainAxis:ne+z+me+E.mainAxis,Ee=t.elements.arrow&&ue(t.elements.arrow),wt=Ee?l==="y"?Ee.clientTop||0:Ee.clientLeft||0:0,He=(D=C==null?void 0:C[l])!=null?D:0,xt=T+Pe-He-wt,Ot=T+bt-He,Ne=se(u?we(I,xt):I,T,u?J(Y,Ot):Y);g[l]=Ne,k[l]=Ne-T}if(s){var Ve,Pt=l==="x"?S:M,Et=l==="x"?L:H,G=g[h],he=h==="y"?"height":"width",Fe=G+m[Pt],qe=G-m[Et],Re=[S,M].indexOf(w)!==-1,Ue=(Ve=C==null?void 0:C[h])!=null?Ve:0,Ie=Re?Fe:G-O[he]-A[he]-Ue+E.altAxis,Xe=Re?G+O[he]+A[he]-Ue-E.altAxis:qe,_e=u&&Re?tr(Ie,G,Xe):se(u?Ie:Fe,G,u?Xe:qe);g[h]=_e,k[h]=_e-G}t.modifiersData[o]=k}}const Sr={name:"preventOverflow",enabled:!0,phase:"main",fn:Tr,requiresIfExists:["offset"]};function Mr(e){return{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}}function kr(e){return e===B(e)||!W(e)?ke(e):Mr(e)}function Br(e){var t=e.getBoundingClientRect(),r=te(t.width)/e.offsetWidth||1,o=te(t.height)/e.offsetHeight||1;return r!==1||o!==1}function Wr(e,t,r){r===void 0&&(r=!1);var o=W(t),n=W(t)&&Br(t),a=_(t),f=re(e,n,r),s={scrollLeft:0,scrollTop:0},i={x:0,y:0};return(o||!o&&!r)&&((V(t)!=="body"||We(a))&&(s=kr(t)),W(t)?(i=re(t,!0),i.x+=t.clientLeft,i.y+=t.clientTop):a&&(i.x=Be(a))),{x:f.left+s.scrollLeft-i.x,y:f.top+s.scrollTop-i.y,width:f.width,height:f.height}}function Lr(e){var t=new Map,r=new Set,o=[];e.forEach(function(a){t.set(a.name,a)});function n(a){r.add(a.name);var f=[].concat(a.requires||[],a.requiresIfExists||[]);f.forEach(function(s){if(!r.has(s)){var i=t.get(s);i&&n(i)}}),o.push(a)}return e.forEach(function(a){r.has(a.name)||n(a)}),o}function Hr(e){var t=Lr(e);return Gt.reduce(function(r,o){return r.concat(t.filter(function(n){return n.phase===o}))},[])}function Nr(e){var t;return function(){return t||(t=new Promise(function(r){Promise.resolve().then(function(){t=void 0,r(e())})})),t}}function Vr(e){var t=e.reduce(function(r,o){var n=r[o.name];return r[o.name]=n?Object.assign({},n,o,{options:Object.assign({},n.options,o.options),data:Object.assign({},n.data,o.data)}):o,r},{});return Object.keys(t).map(function(r){return t[r]})}var ot={placement:"bottom",modifiers:[],strategy:"absolute"};function nt(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];return!t.some(function(o){return!(o&&typeof o.getBoundingClientRect=="function")})}function Fr(e){e===void 0&&(e={});var t=e,r=t.defaultModifiers,o=r===void 0?[]:r,n=t.defaultOptions,a=n===void 0?ot:n;return function(s,i,c){c===void 0&&(c=a);var p={placement:"bottom",orderedModifiers:[],options:Object.assign({},ot,a),modifiersData:{},elements:{reference:s,popper:i},attributes:{},styles:{}},v=[],y=!1,u={state:p,setOptions:function(w){var P=typeof w=="function"?w(p.options):w;d(),p.options=Object.assign({},a,p.options,P),p.scrollParents={reference:K(s)?pe(s):s.contextElement?pe(s.contextElement):[],popper:pe(i)};var b=Hr(Vr([].concat(o,p.options.modifiers)));return p.orderedModifiers=b.filter(function(l){return l.enabled}),x(),u.update()},forceUpdate:function(){if(!y){var w=p.elements,P=w.reference,b=w.popper;if(nt(P,b)){p.rects={reference:Wr(P,ue(b),p.options.strategy==="fixed"),popper:Se(b)},p.reset=!1,p.placement=p.options.placement,p.orderedModifiers.forEach(function(E){return p.modifiersData[E.name]=Object.assign({},E.data)});for(var l=0;l<p.orderedModifiers.length;l++){if(p.reset===!0){p.reset=!1,l=-1;continue}var h=p.orderedModifiers[l],g=h.fn,O=h.options,A=O===void 0?{}:O,R=h.name;typeof g=="function"&&(p=g({state:p,options:A,name:R,instance:u})||p)}}}},update:Nr(function(){return new Promise(function(m){u.forceUpdate(),m(p)})}),destroy:function(){d(),y=!0}};if(!nt(s,i))return u;u.setOptions(c).then(function(m){!y&&c.onFirstUpdate&&c.onFirstUpdate(m)});function x(){p.orderedModifiers.forEach(function(m){var w=m.name,P=m.options,b=P===void 0?{}:P,l=m.effect;if(typeof l=="function"){var h=l({state:p,name:w,instance:u,options:b}),g=function(){};v.push(h||g)}})}function d(){v.forEach(function(m){return m()}),v=[]}return u}}var qr=[lr,Dr,fr,Qt,Cr,Or,Sr,ar,Er],Ur=Fr({defaultModifiers:qr});const ht="Popper";function Ir(e){return it(ht,e)}Lt(ht,["root"]);const Xr=["anchorEl","children","direction","disablePortal","modifiers","open","placement","popperOptions","popperRef","slotProps","slots","TransitionProps","ownerState"],_r=["anchorEl","children","container","direction","disablePortal","keepMounted","modifiers","open","placement","popperOptions","popperRef","style","transition","slotProps","slots"];function Yr(e,t){if(t==="ltr")return e;switch(e){case"bottom-end":return"bottom-start";case"bottom-start":return"bottom-end";case"top-end":return"top-start";case"top-start":return"top-end";default:return e}}function je(e){return typeof e=="function"?e():e}function zr(e){return e.nodeType!==void 0}const Gr=()=>At({root:["root"]},kt(Ir)),Jr={},Kr=$.forwardRef(function(t,r){var o;const{anchorEl:n,children:a,direction:f,disablePortal:s,modifiers:i,open:c,placement:p,popperOptions:v,popperRef:y,slotProps:u={},slots:x={},TransitionProps:d}=t,m=De(t,Xr),w=$.useRef(null),P=Ye(w,r),b=$.useRef(null),l=Ye(b,y),h=$.useRef(l);Ge(()=>{h.current=l},[l]),$.useImperativeHandle(y,()=>b.current,[]);const g=Yr(p,f),[O,A]=$.useState(g),[R,E]=$.useState(je(n));$.useEffect(()=>{b.current&&b.current.forceUpdate()}),$.useEffect(()=>{n&&E(je(n))},[n]),Ge(()=>{if(!R||!c)return;const q=I=>{A(I.placement)};let j=[{name:"preventOverflow",options:{altBoundary:s}},{name:"flip",options:{altBoundary:s}},{name:"onUpdate",enabled:!0,phase:"afterWrite",fn:({state:I})=>{q(I)}}];i!=null&&(j=j.concat(i)),v&&v.modifiers!=null&&(j=j.concat(v.modifiers));const T=Ur(R,w.current,Z({placement:g},v,{modifiers:j}));return h.current(T),()=>{T.destroy(),h.current(null)}},[R,s,i,c,v,g]);const C={placement:O};d!==null&&(C.TransitionProps=d);const k=Gr(),D=(o=x.root)!=null?o:"div",F=Tt({elementType:D,externalSlotProps:u.root,externalForwardedProps:m,additionalProps:{role:"tooltip",ref:P},ownerState:t,className:k.root});return be.jsx(D,Z({},F,{children:typeof a=="function"?a(C):a}))}),Qr=$.forwardRef(function(t,r){const{anchorEl:o,children:n,container:a,direction:f="ltr",disablePortal:s=!1,keepMounted:i=!1,modifiers:c,open:p,placement:v="bottom",popperOptions:y=Jr,popperRef:u,style:x,transition:d=!1,slotProps:m={},slots:w={}}=t,P=De(t,_r),[b,l]=$.useState(!0),h=()=>{l(!1)},g=()=>{l(!0)};if(!i&&!p&&(!d||b))return null;let O;if(a)O=a;else if(o){const E=je(o);O=E&&zr(E)?ze(E).body:ze(null).body}const A=!p&&i&&(!d||b)?"none":void 0,R=d?{in:p,onEnter:h,onExited:g}:void 0;return be.jsx($t,{disablePortal:s,container:O,children:be.jsx(Kr,Z({anchorEl:o,direction:f,disablePortal:s,modifiers:c,ref:r,open:d?!b:p,placement:v,popperOptions:y,popperRef:u,slotProps:m,slots:w},P,{style:Z({position:"fixed",top:0,left:0,display:A},x),TransitionProps:R,children:n}))})});var Le={};Object.defineProperty(Le,"__esModule",{value:!0});var gt=Le.default=void 0,Zr=to($),eo=Ct;function yt(e){if(typeof WeakMap!="function")return null;var t=new WeakMap,r=new WeakMap;return(yt=function(o){return o?r:t})(e)}function to(e,t){if(e&&e.__esModule)return e;if(e===null||typeof e!="object"&&typeof e!="function")return{default:e};var r=yt(t);if(r&&r.has(e))return r.get(e);var o={__proto__:null},n=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var a in e)if(a!=="default"&&Object.prototype.hasOwnProperty.call(e,a)){var f=n?Object.getOwnPropertyDescriptor(e,a):null;f&&(f.get||f.set)?Object.defineProperty(o,a,f):o[a]=e[a]}return o.default=e,r&&r.set(e,o),o}function ro(e){return Object.keys(e).length===0}function oo(e=null){const t=Zr.useContext(eo.ThemeContext);return!t||ro(t)?e:t}gt=Le.default=oo;const no=["anchorEl","component","components","componentsProps","container","disablePortal","keepMounted","modifiers","open","placement","popperOptions","popperRef","transition","slots","slotProps"],ao=jt(Qr,{name:"MuiPopper",slot:"Root",overridesResolver:(e,t)=>t.root})({}),fo=$.forwardRef(function(t,r){var o;const n=gt(),a=Dt({props:t,name:"MuiPopper"}),{anchorEl:f,component:s,components:i,componentsProps:c,container:p,disablePortal:v,keepMounted:y,modifiers:u,open:x,placement:d,popperOptions:m,popperRef:w,transition:P,slots:b,slotProps:l}=a,h=De(a,no),g=(o=b==null?void 0:b.root)!=null?o:i==null?void 0:i.Root,O=Z({anchorEl:f,container:p,disablePortal:v,keepMounted:y,modifiers:u,open:x,placement:d,popperOptions:m,popperRef:w,transition:P},h);return be.jsx(ao,Z({as:s,direction:n==null?void 0:n.direction,slots:{root:g},slotProps:l??c},O,{ref:r}))});export{fo as P};
