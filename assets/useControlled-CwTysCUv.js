import{r as u,a4 as i}from"./index-DZ-2hnVc.js";let l=0;function m(t){const[e,a]=u.useState(t),n=t||e;return u.useEffect(()=>{e==null&&(l+=1,a(`mui-${l}`))},[e]),n}const o=i.useId;function S(t){if(o!==void 0){const e=o();return t??e}return m(t)}function p({controlled:t,default:e,name:a,state:n="value"}){const{current:s}=u.useRef(t!==void 0),[c,f]=u.useState(e),r=s?t:c,d=u.useCallback(I=>{s||f(I)},[]);return[r,d]}export{p as a,S as u};
