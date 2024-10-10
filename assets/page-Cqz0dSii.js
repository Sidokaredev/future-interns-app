import{r as j,g as $,a as G,b as N,_ as v,u as O,e as E,j as e,f as V,h as U,d as A,H as Re,i as oe,I as Se,c as z,B as r,T as a,v as t,A as te,D as y,L as pe,z as me,J as xe}from"./index-DZ-2hnVc.js";import{D as He,T as Pe}from"./DashboardLayout-BzTbuGc_.js";import{C as We,P as Ie}from"./PersonalDetail-C3YExHDo.js";import{S as Le}from"./SimpleEmphasis-pz3CoZox.js";import{u as ue}from"./useMediaQuery-S3cV_GLX.js";import{T as De}from"./TextField-Bb5yWQ6L.js";import{I as Be}from"./InputAdornment-Du7y2E0j.js";import{S as Ae}from"./SearchRounded-D73GWp-i.js";import{S as Q,M as I}from"./MenuItem-C_eeMoD4.js";import{M as he}from"./Menu-BFsOZlVc.js";import{L,a as D,I as ge,b as je,G as be,D as $e}from"./Footer-DqvIlHva.js";import{C as X}from"./Collapse-B_mFS5tO.js";import{B as K}from"./Button-DamuMybp.js";import{V as ne}from"./Visibility-DFqExYaq.js";import{I as f}from"./IconButton-D8lIrsrq.js";import{M as Z,D as Ge}from"./MoreVert-CohUzDoh.js";import{P as ee}from"./Pagination-BUnUHXlJ.js";import{a as Y,I as Ne}from"./InsertDriveFileRounded-BaHDaINl.js";import{D as Oe}from"./DonutLargeRounded-TWkQHQXa.js";import{C as ie}from"./Chip-Cj_G0IfX.js";import{C as Ee}from"./CloseRounded-CLutRPPJ.js";import{G as re}from"./Grid-BJ1PkSY_.js";import"./Popper-BdNlPE_8.js";import"./useControlled-CwTysCUv.js";import"./SocialCard-RbgYg8yG.js";const ze=j.createContext();function Ve(o){return $("MuiTable",o)}G("MuiTable",["root","stickyHeader"]);const Ue=["className","component","padding","size","stickyHeader"],_e=o=>{const{classes:s,stickyHeader:i}=o;return U({root:["root",i&&"stickyHeader"]},Ve,s)},qe=N("table",{name:"MuiTable",slot:"Root",overridesResolver:(o,s)=>{const{ownerState:i}=o;return[s.root,i.stickyHeader&&s.stickyHeader]}})(({theme:o,ownerState:s})=>v({display:"table",width:"100%",borderCollapse:"collapse",borderSpacing:0,"& caption":v({},o.typography.body2,{padding:o.spacing(2),color:(o.vars||o).palette.text.secondary,textAlign:"left",captionSide:"bottom"})},s.stickyHeader&&{borderCollapse:"separate"})),ve="table",ae=j.forwardRef(function(s,i){const l=O({props:s,name:"MuiTable"}),{className:m,component:c=ve,padding:u="normal",size:d="medium",stickyHeader:g=!1}=l,T=E(l,Ue),C=v({},l,{component:c,padding:u,size:d,stickyHeader:g}),R=_e(C),S=j.useMemo(()=>({padding:u,size:d,stickyHeader:g}),[u,d,g]);return e.jsx(ze.Provider,{value:S,children:e.jsx(qe,v({as:c,role:c===ve?null:"table",ref:i,className:V(R.root,m),ownerState:C},T))})}),se=j.createContext();function Fe(o){return $("MuiTableBody",o)}G("MuiTableBody",["root"]);const Xe=["className","component"],Ye=o=>{const{classes:s}=o;return U({root:["root"]},Fe,s)},Je=N("tbody",{name:"MuiTableBody",slot:"Root",overridesResolver:(o,s)=>s.root})({display:"table-row-group"}),Qe={variant:"body"},fe="tbody",le=j.forwardRef(function(s,i){const l=O({props:s,name:"MuiTableBody"}),{className:m,component:c=fe}=l,u=E(l,Xe),d=v({},l,{component:c}),g=Ye(d);return e.jsx(se.Provider,{value:Qe,children:e.jsx(Je,v({className:V(g.root,m),as:c,ref:i,role:c===fe?null:"rowgroup",ownerState:d},u))})});function Ke(o){return $("MuiTableCell",o)}const Ze=G("MuiTableCell",["root","head","body","footer","sizeSmall","sizeMedium","paddingCheckbox","paddingNone","alignLeft","alignCenter","alignRight","alignJustify","stickyHeader"]),eo=["align","className","component","padding","scope","size","sortDirection","variant"],oo=o=>{const{classes:s,variant:i,align:l,padding:m,size:c,stickyHeader:u}=o,d={root:["root",i,u&&"stickyHeader",l!=="inherit"&&`align${A(l)}`,m!=="normal"&&`padding${A(m)}`,`size${A(c)}`]};return U(d,Ke,s)},so=N("td",{name:"MuiTableCell",slot:"Root",overridesResolver:(o,s)=>{const{ownerState:i}=o;return[s.root,s[i.variant],s[`size${A(i.size)}`],i.padding!=="normal"&&s[`padding${A(i.padding)}`],i.align!=="inherit"&&s[`align${A(i.align)}`],i.stickyHeader&&s.stickyHeader]}})(({theme:o,ownerState:s})=>v({},o.typography.body2,{display:"table-cell",verticalAlign:"inherit",borderBottom:o.vars?`1px solid ${o.vars.palette.TableCell.border}`:`1px solid
    ${o.palette.mode==="light"?Re(oe(o.palette.divider,1),.88):Se(oe(o.palette.divider,1),.68)}`,textAlign:"left",padding:16},s.variant==="head"&&{color:(o.vars||o).palette.text.primary,lineHeight:o.typography.pxToRem(24),fontWeight:o.typography.fontWeightMedium},s.variant==="body"&&{color:(o.vars||o).palette.text.primary},s.variant==="footer"&&{color:(o.vars||o).palette.text.secondary,lineHeight:o.typography.pxToRem(21),fontSize:o.typography.pxToRem(12)},s.size==="small"&&{padding:"6px 16px",[`&.${Ze.paddingCheckbox}`]:{width:24,padding:"0 12px 0 16px","& > *":{padding:0}}},s.padding==="checkbox"&&{width:48,padding:"0 0 0 4px"},s.padding==="none"&&{padding:0},s.align==="left"&&{textAlign:"left"},s.align==="center"&&{textAlign:"center"},s.align==="right"&&{textAlign:"right",flexDirection:"row-reverse"},s.align==="justify"&&{textAlign:"justify"},s.stickyHeader&&{position:"sticky",top:0,zIndex:2,backgroundColor:(o.vars||o).palette.background.default})),x=j.forwardRef(function(s,i){const l=O({props:s,name:"MuiTableCell"}),{align:m="inherit",className:c,component:u,padding:d,scope:g,size:T,sortDirection:C,variant:R}=l,S=E(l,eo),k=j.useContext(ze),H=j.useContext(se),_=H&&H.variant==="head";let P;u?P=u:P=_?"th":"td";let q=g;P==="td"?q=void 0:!q&&_&&(q="col");const F=R||H&&H.variant,J=v({},l,{align:m,component:P,padding:d||(k&&k.padding?k.padding:"normal"),size:T||(k&&k.size?k.size:"medium"),sortDirection:C,stickyHeader:F==="head"&&k&&k.stickyHeader,variant:F}),W=oo(J);let n=null;return C&&(n=C==="asc"?"ascending":"descending"),e.jsx(so,v({as:P,ref:i,className:V(W.root,c),"aria-sort":n,scope:q,ownerState:J},S))});function to(o){return $("MuiTableContainer",o)}G("MuiTableContainer",["root"]);const no=["className","component"],io=o=>{const{classes:s}=o;return U({root:["root"]},to,s)},ro=N("div",{name:"MuiTableContainer",slot:"Root",overridesResolver:(o,s)=>s.root})({width:"100%",overflowX:"auto"}),ce=j.forwardRef(function(s,i){const l=O({props:s,name:"MuiTableContainer"}),{className:m,component:c="div"}=l,u=E(l,no),d=v({},l,{component:c}),g=io(d);return e.jsx(ro,v({ref:i,as:c,className:V(g.root,m),ownerState:d},u))});function ao(o){return $("MuiTableHead",o)}G("MuiTableHead",["root"]);const lo=["className","component"],co=o=>{const{classes:s}=o;return U({root:["root"]},ao,s)},po=N("thead",{name:"MuiTableHead",slot:"Root",overridesResolver:(o,s)=>s.root})({display:"table-header-group"}),mo={variant:"head"},ye="thead",de=j.forwardRef(function(s,i){const l=O({props:s,name:"MuiTableHead"}),{className:m,component:c=ye}=l,u=E(l,lo),d=v({},l,{component:c}),g=co(d);return e.jsx(se.Provider,{value:mo,children:e.jsx(po,v({as:c,className:V(g.root,m),ref:i,role:c===ye?null:"rowgroup",ownerState:d},u))})});function xo(o){return $("MuiTableRow",o)}const Ce=G("MuiTableRow",["root","selected","hover","head","footer"]),uo=["className","component","hover","selected"],ho=o=>{const{classes:s,selected:i,hover:l,head:m,footer:c}=o;return U({root:["root",i&&"selected",l&&"hover",m&&"head",c&&"footer"]},xo,s)},go=N("tr",{name:"MuiTableRow",slot:"Root",overridesResolver:(o,s)=>{const{ownerState:i}=o;return[s.root,i.head&&s.head,i.footer&&s.footer]}})(({theme:o})=>({color:"inherit",display:"table-row",verticalAlign:"middle",outline:0,[`&.${Ce.hover}:hover`]:{backgroundColor:(o.vars||o).palette.action.hover},[`&.${Ce.selected}`]:{backgroundColor:o.vars?`rgba(${o.vars.palette.primary.mainChannel} / ${o.vars.palette.action.selectedOpacity})`:oe(o.palette.primary.main,o.palette.action.selectedOpacity),"&:hover":{backgroundColor:o.vars?`rgba(${o.vars.palette.primary.mainChannel} / calc(${o.vars.palette.action.selectedOpacity} + ${o.vars.palette.action.hoverOpacity}))`:oe(o.palette.primary.main,o.palette.action.selectedOpacity+o.palette.action.hoverOpacity)}}})),we="tr",B=j.forwardRef(function(s,i){const l=O({props:s,name:"MuiTableRow"}),{className:m,component:c=we,hover:u=!1,selected:d=!1}=l,g=E(l,uo),T=j.useContext(se),C=v({},l,{component:c,hover:u,selected:d,head:T&&T.variant==="head",footer:T&&T.variant==="footer"}),R=ho(C);return e.jsx(go,v({as:c,ref:i,className:V(R.root,m),role:c===we?null:"row",ownerState:C},g))}),Te=z(e.jsx("path",{d:"M5 13h11.17l-4.88 4.88c-.39.39-.39 1.03 0 1.42.39.39 1.02.39 1.41 0l6.59-6.59c.39-.39.39-1.02 0-1.41l-6.58-6.6a.9959.9959 0 0 0-1.41 0c-.39.39-.39 1.02 0 1.41L16.17 11H5c-.55 0-1 .45-1 1s.45 1 1 1"}),"ArrowForwardRounded"),jo=z(e.jsx("path",{d:"M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1m0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3m6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1z"}),"AssignmentIndRounded"),bo=z(e.jsx("path",{d:"M17 2c-.55 0-1 .45-1 1v1H8V3c0-.55-.45-1-1-1s-1 .45-1 1v1H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-1V3c0-.55-.45-1-1-1m2 18H5V10h14zm-8-7c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1m-4 0c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1m8 0c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1m-4 4c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1m-4 0c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1m8 0c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1"}),"CalendarMonthRounded"),vo=z(e.jsx("path",{d:"M14.59 2.59c-.38-.38-.89-.59-1.42-.59H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8.83c0-.53-.21-1.04-.59-1.41zM15 18H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1m0-4H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1m-2-6V3.5L18.5 9H14c-.55 0-1-.45-1-1"}),"DescriptionRounded"),fo=z(e.jsx("path",{d:"M16 13h-3c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1m0-10v1H8V3c0-.55-.45-1-1-1s-1 .45-1 1v1H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-1V3c0-.55-.45-1-1-1s-1 .45-1 1m2 17H6c-.55 0-1-.45-1-1V9h14v10c0 .55-.45 1-1 1"}),"EventRounded"),yo=z(e.jsx("path",{d:"M17 7h-3c-.55 0-1 .45-1 1s.45 1 1 1h3c1.65 0 3 1.35 3 3s-1.35 3-3 3h-3c-.55 0-1 .45-1 1s.45 1 1 1h3c2.76 0 5-2.24 5-5s-2.24-5-5-5m-9 5c0 .55.45 1 1 1h6c.55 0 1-.45 1-1s-.45-1-1-1H9c-.55 0-1 .45-1 1m2 3H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h3c.55 0 1-.45 1-1s-.45-1-1-1H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h3c.55 0 1-.45 1-1s-.45-1-1-1"}),"LinkRounded"),ke=z(e.jsx("path",{d:"M12 4C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4m0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5m0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3"}),"VisibilityRounded"),Me=z(e.jsx("path",{d:"M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"}),"X");function Fo(){const o=ue("(max-width: 900px)"),s=ue("(max-width: 600px)"),[i,l]=j.useState("screening"),[m,c]=j.useState({}),[u,d]=j.useState(!1),[g,T]=j.useState({}),C=n=>()=>{T(p=>({...p,[n]:!p[n]}))},R=n=>({["#"+n]:{backgroundColor:"#389a8a",".MuiTypography-body2":{color:"white"},".MuiBox-root":{backgroundColor:"white",".MuiTypography-caption":{color:"#389a8a"}}}}),S=n=>{switch(n){case"Scheduled":return{color:xe[700],backgroundColor:xe[50]};case"Re-scheduled":return{color:Y[700],backgroundColor:Y[50]};default:return{color:me[700],backgroundColor:me[50]}}},k=[{valueProp:"#",label:"#"},{valueProp:"name",label:"Name"},{valueProp:"education",label:"Education"},{valueProp:"domicile",label:"Domicile"},{valueProp:"socials",label:"Social"},{valueProp:"option",label:"Option"}],H=[{valueProp:"name",label:"Name"},{valueProp:"education",label:"Education"},{valueProp:"option",label:"Option"}],_=[{name:"Fatkhur Rozak",email:"fatkhurawe@gmail.com",domicile:"Sidoarjo",education:"Politeknik Negeri Jember",socials:[{src:"https://github.com",name:"github"}]},{name:"Vrij Brahmaak",email:"vrij.brahmaak@gmail.com",domicile:"Delhi",education:"Politeknik Negeri Jember",socials:[{src:"https://github.com",name:"github"},{src:"https://linkedin.com",name:"linkedin"}]}],F=o?[{valueProp:"name",label:"Name"},{valueProp:"schedule",label:"Schedule"},{valueProp:"option",label:"Option"}]:[{valueProp:"#",label:"#"},{valueProp:"name",label:"Name"},{valueProp:"date",label:"Date"},{valueProp:"location",label:"Location"},{valueProp:"status",label:"Status"},{valueProp:"option",label:"Option"}],J=[{name:"Fatkhur Rozak",email:"fatkhurawe@gmail.com",date:new Date(Date.now()).toDateString(),location:{name:"Google Meet",url:"https://google.com"},status:"Scheduled"},{name:"Dinda Amalia Julyandri",email:"dindaamalia0309@gmail.com",date:new Date(Date.now()).toDateString(),location:{name:"Google Meet",url:"https://www.youtube.com/watch?v=Vb-Z7oe0Hao&list=RD1rKRkRyzO3E&index=5"},status:"Re-scheduled"}],W=o?H:k;return e.jsx(He,{children:e.jsxs(r,{component:"div",sx:{},children:[e.jsxs(r,{component:"div",sx:{display:"flex",flexWrap:"wrap",justifyContent:"space-between",rowGap:{xs:"0.5em",sm:0}},children:[e.jsx(a,{component:"p",variant:"h6",sx:{fontWeight:550,fontSize:{xs:"medium",md:"normal"},color:t[800]},children:"Cloud Architect"}),e.jsx(De,{type:"text",name:"search",placeholder:"Search candidate name ...",autoComplete:"off",size:"small",InputProps:{startAdornment:e.jsx(Be,{position:"start",children:e.jsx(Ae,{})}),sx:{minWidth:{md:"20em"},fontSize:"small"}},sx:{width:{xs:"100%",sm:"auto"}}})]}),e.jsxs(Q,{direction:"row",spacing:2,sx:{marginY:"1em",paddingBottom:"0.5em",...R(i),".MuiBox-root":{backgroundColor:"white",".MuiTypography-body2":{letterSpacing:{xs:"",md:"0.03em"},color:t[600]},".MuiBox-root":{backgroundColor:t[600],".MuiTypography-caption":{color:"white"}},cursor:"pointer"},"> .MuiBox-root:hover":{backgroundColor:t[200]},overflowX:{xs:"auto"}},children:[e.jsxs(r,{component:"div",sx:{display:"flex",justifyContent:"center",alignItems:"center",columnGap:"0.3em",padding:"0.5em",borderRadius:"0.3em"},id:"screening",onClick:()=>l("screening"),children:[e.jsx(a,{component:"p",variant:"body2",sx:{fontWeight:550,fontSize:{xs:"small",sm:""}},children:"Screening"}),e.jsx(r,{component:"div",sx:{width:20,height:20,display:"grid",placeItems:"center",borderRadius:"50%"},children:e.jsx(a,{variant:"caption",sx:{fontWeight:550},children:"5"})})]}),e.jsx(r,{component:"div",sx:{display:"flex",justifyContent:"center",alignItems:"center",columnGap:"0.3em",padding:"0.5em",borderRadius:"0.3em"},id:"assessments",onClick:()=>l("assessments"),children:e.jsx(a,{component:"p",variant:"body2",sx:{fontWeight:550,fontSize:{xs:"small",sm:""},color:t[600]},children:"Assessments"})}),e.jsx(r,{component:"div",sx:{display:"flex",justifyContent:"center",alignItems:"center",columnGap:"0.3em",padding:"0.5em",borderRadius:"0.3em"},id:"interviews",onClick:()=>l("interviews"),children:e.jsx(a,{component:"p",variant:"body2",sx:{fontWeight:550,fontSize:{xs:"small",sm:""},color:t[600]},children:"Interviews"})}),e.jsxs(r,{component:"div",sx:{display:"flex",justifyContent:"center",alignItems:"center",columnGap:"0.3em",padding:"0.5em",borderRadius:"0.3em"},id:"offerings",onClick:()=>l("offerings"),children:[e.jsx(a,{component:"p",variant:"body2",sx:{fontWeight:550,fontSize:{xs:"small",sm:""},color:t[600]},children:"Offerings"}),e.jsx(r,{component:"div",sx:{width:20,height:20,display:"grid",placeItems:"center",borderRadius:"50%"},children:e.jsx(a,{variant:"caption",sx:{fontWeight:550},children:"3"})})]}),e.jsx(r,{component:"div",sx:{display:"flex",justifyContent:"center",alignItems:"center",columnGap:"0.3em",padding:"0.5em",borderRadius:"0.3em"},id:"LoA",onClick:()=>l("LoA"),children:e.jsx(a,{component:"p",variant:"body2",sx:{fontWeight:550,fontSize:{xs:"small",sm:""},color:t[600]},children:"LoA"})})]}),e.jsxs(he,{open:!!m.screening,anchorEl:m.screening,onClose:()=>c(n=>({...n,screening:null})),anchorOrigin:{horizontal:"right",vertical:"bottom"},transformOrigin:{horizontal:"right",vertical:"top"},slotProps:{paper:{sx:{minWidth:{xs:"auto",md:"10em"},padding:0,border:"1px solid "+t[400],boxShadow:"none"}}},MenuListProps:{dense:!0},sx:{".MuiMenuItem-root:hover":{backgroundColor:t[100],".MuiListItemIcon-root":{color:"#06816d"},".MuiListItemText-primary":{color:"#06816d"}}},children:[e.jsxs(I,{children:[e.jsx(L,{children:e.jsx(Te,{fontSize:"small"})}),e.jsx(D,{primary:"Assign to",sx:{".MuiListItemText-primary":{fontSize:"small",fontWeight:550,color:t[600]}}})]}),s&&e.jsxs(I,{onClick:()=>d(!0),children:[e.jsx(L,{children:e.jsx(ke,{fontSize:"small"})}),e.jsx(D,{primary:"View",sx:{".MuiListItemText-primary":{fontSize:"small",fontWeight:550,color:t[600]}}})]})]}),e.jsxs(he,{open:!!m.interviews,anchorEl:m.interviews,onClose:()=>c(n=>({...n,interviews:null})),anchorOrigin:{horizontal:"right",vertical:"bottom"},transformOrigin:{horizontal:"right",vertical:"top"},slotProps:{paper:{sx:{minWidth:{xs:"auto",md:"10em"},padding:0,border:"1px solid "+t[400],boxShadow:"none"}}},MenuListProps:{dense:!0},sx:{".MuiMenuItem-root:hover":{backgroundColor:t[100],".MuiListItemIcon-root":{color:"#06816d"},".MuiListItemText-primary":{color:"#06816d"}}},children:[e.jsxs(I,{children:[e.jsx(L,{children:e.jsx(Te,{fontSize:"small"})}),e.jsx(D,{primary:"Assign to",sx:{".MuiListItemText-primary":{fontSize:"small",fontWeight:550,color:t[600]}}})]}),e.jsxs(I,{children:[e.jsx(L,{children:e.jsx(fo,{fontSize:"small"})}),e.jsx(D,{primary:"Create Interview",sx:{".MuiListItemText-primary":{fontSize:"small",fontWeight:550,color:t[600]}}})]}),e.jsxs(I,{children:[e.jsx(L,{children:e.jsx(bo,{fontSize:"small"})}),e.jsx(D,{primary:"Interview History",sx:{".MuiListItemText-primary":{fontSize:"small",fontWeight:550,color:t[600]}}})]}),e.jsxs(I,{children:[e.jsx(L,{children:e.jsx(ke,{fontSize:"small"})}),e.jsx(D,{primary:"View Detail",sx:{".MuiListItemText-primary":{fontSize:"small",fontWeight:550,color:t[600]}}})]})]}),e.jsx(X,{in:i==="screening",mountOnEnter:!0,unmountOnExit:!0,children:e.jsxs(r,{component:"div",id:"screenings-panel",children:[e.jsx(ce,{sx:{".MuiTableHead-root":{".MuiTableCell-root":{borderBottom:"none"}}},children:e.jsxs(ae,{children:[e.jsx(de,{children:e.jsx(B,{children:W.map((n,p)=>e.jsx(x,{children:e.jsx(a,{variant:"subtitle2",sx:{fontWeight:550,color:t[500]},children:n.label})},p))})}),e.jsx(le,{sx:{"> .MuiTableRow-root:hover":{backgroundColor:t[100]},".MuiTableCell-root":{borderColor:t[300]}},children:_.map((n,p)=>e.jsx(B,{children:W.map((M,h)=>{switch(M.valueProp){case"#":return e.jsx(x,{children:p+1},h);case"name":return e.jsx(x,{size:"small",sx:{},children:e.jsxs(r,{component:"div",sx:{width:"100%",display:"flex",flexWrap:"wrap",columnGap:{xs:0,sm:"0.7em"},rowGap:{xs:"0.7em",sm:0}},children:[!s&&e.jsx(te,{alt:"candidate-profile",src:"https://placehold.co/40x40",sx:{width:40,height:40}}),e.jsxs(r,{component:"div",children:[e.jsx(a,{component:"p",variant:"subtitle2",sx:{fontWeight:550,color:t[800]},children:n.name}),e.jsx(a,{component:"p",variant:"caption",sx:{wordBreak:"break-word"},children:n.email})]})]})},h);case"socials":return e.jsx(x,{children:e.jsx(Q,{direction:"row",sx:{flexWrap:"wrap",maxWidth:"10em"},children:n.socials.map((w,b)=>{switch(w.name){case"github":return e.jsx(f,{size:"small",onClick:()=>console.info("navigate to 	:",w.src),children:e.jsx(be,{})},b);case"linkedin":return e.jsx(f,{size:"small",children:e.jsx(je,{})},b);case"instagram":return e.jsx(f,{size:"small",children:e.jsx(ge,{})},b);case"x":return e.jsx(f,{size:"small",children:e.jsx(Me,{})},b);default:return}})})},h);case"option":return e.jsx(x,{size:"small",sx:{},children:e.jsxs(r,{component:"div",sx:{display:"flex",justifyContent:"space-between"},children:[!o&&e.jsx(K,{variant:"text",size:"small",startIcon:e.jsx(ne,{fontSize:"small"}),onClick:()=>d(!0),children:"View"}),e.jsx(f,{size:"small",onClick:w=>c(b=>({...b,[i]:w.currentTarget})),children:e.jsx(Z,{fontSize:"small"})})]})},h);default:return e.jsx(x,{size:"small",sx:{},children:e.jsx(a,{variant:"subtitle2",children:n[M.valueProp]})},h)}})},p))})]})}),e.jsx(ee,{color:"primary",count:13,sx:{display:"flex",justifyContent:"end",marginY:"2em"}})]})}),e.jsxs(X,{in:i==="assessments",mountOnEnter:!0,unmountOnExit:!0,children:[e.jsx(Q,{direction:"column",spacing:2,children:[0,1,2,3].map((n,p)=>e.jsxs(r,{component:"div",className:"assessment-item",sx:{border:"1px solid "+t[400],borderRadius:"0.3em"},children:[e.jsxs(r,{component:"div",sx:{padding:"0.5em 0.8em"},children:[e.jsxs(r,{component:"div",sx:{display:"flex",alignItems:{xs:"start",sm:"center"},justifyContent:"space-between",columnGap:"0.5em"},children:[e.jsxs(r,{component:"div",sx:{flexGrow:1,display:"flex",flexWrap:"wrap",justifyContent:"space-between",marginBottom:{xs:"0.5em",sm:""}},children:[e.jsxs(a,{component:"p",variant:"subtitle2",sx:{fontWeight:550,color:t[800]},children:["Test Case Configuring Firewall ",p]}),e.jsxs(a,{component:"p",variant:"caption",sx:{width:"max-content",padding:"0.3em 0.8em",borderRadius:"2em",color:Y[700],fontStyle:"italic",backgroundColor:Y[50]},children:["Due date on"," ",e.jsx(Le,{text:"Fri 30 May, 2024",textColor:Y[700],sx:{fontStyle:"italic"}})]})]}),e.jsx(Pe,{title:"More option",placement:"top",children:e.jsx(f,{children:e.jsx(Z,{fontSize:"small"})})})]}),e.jsxs(r,{component:"div",children:[e.jsxs(r,{component:"div",sx:{display:"flex",columnGap:"0.3em"},children:[e.jsx(vo,{fontSize:"small",sx:{color:"#06816d"}}),e.jsxs(r,{component:"div",children:[e.jsx(a,{component:"p",variant:"caption",sx:{fontWeight:550,color:t[700]},children:"Note"}),e.jsxs(a,{component:"p",variant:"caption",sx:{color:t[600]},noWrap:!g[String(p)],children:["Lorem, ipsum dolor sit amet consectetur adipisicing elit. Explicabo itaque voluptatum totam inventore eaque odio ipsum, magni atque, libero consequuntur, consequatur exercitationem repellat facilis. Enim error sed nihil in. Iste. ",e.jsx("br",{})," Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae facere nisi possimus cupiditate omnis dolores odio assumenda exercitationem expedita impedit iure maiores consequuntur officiis voluptas ea magnam quo, et amet! Aspernatur quos vel in eaque ab soluta accusantium maxime eligendi labore a omnis earum explicabo repellendus, at odit, debitis dolorem blanditiis. Eos nesciunt explicabo mollitia sint veniam dolores laborum modi."]}),e.jsx(a,{component:"span",variant:"caption",sx:{color:t[600],fontWeight:550,fontStyle:"italic",":hover":{color:y[500]},cursor:"pointer"},onClick:C(String(p)),children:!g[String(p)]&&"See more ..."})]})]}),e.jsxs(r,{component:"div",sx:{marginTop:"0.5em",display:"flex",flexWrap:{xs:"wrap",sm:"nowrap"},columnGap:"0.5em",rowGap:{xs:"0.7em",sm:""}},children:[e.jsxs(r,{component:"div",sx:{flexBasis:{xs:"100%",sm:"40%"},display:"flex",columnGap:"0.3em"},children:[e.jsx(yo,{fontSize:"small",sx:{color:"#06816d"}}),e.jsxs(r,{component:"div",children:[e.jsx(a,{component:"div",variant:"caption",sx:{fontWeight:550,color:t[700]},children:"Assessment Link"}),e.jsx(a,{component:"div",variant:"caption",sx:{color:t[600],":hover":{color:y[500]}},children:"https://dribbble.com/shots/18937872-Orders-List-Tabbed-Nav-with-Large-Tile-List"})]})]}),e.jsxs(r,{component:"div",sx:{flexBasis:{xs:"100%",sm:"40%"},display:"flex",columnGap:"0.3em"},children:[e.jsx(Ne,{fontSize:"small",sx:{color:"#06816d"}}),e.jsxs(r,{component:"div",children:[e.jsx(a,{component:"p",variant:"caption",sx:{fontWeight:550,color:t[700]},children:"Attached Files"}),e.jsxs(r,{component:"div",sx:{display:"flex",flexWrap:"wrap",columnGap:"0.5em",rowGap:"0.3em"},children:[e.jsx(r,{component:"div",sx:{padding:"0.2em 0.5em",borderRadius:"0.3em",backgroundColor:t[200],cursor:"pointer",":hover":{backgroundColor:y[50]},":hover .MuiTypography-caption":{color:y[500]}},children:e.jsx(a,{variant:"caption",sx:{color:t[600]},children:"guide-assessment.pdf"})}),e.jsx(r,{component:"div",sx:{padding:"0.2em 0.5em",borderRadius:"0.3em",backgroundColor:t[200],cursor:"pointer",":hover":{backgroundColor:y[50]},":hover .MuiTypography-caption":{color:y[500]}},children:e.jsx(a,{variant:"caption",sx:{color:t[600]},children:"schedule-interview.pdf"})}),e.jsx(r,{component:"div",sx:{padding:"0.2em 0.5em",borderRadius:"0.3em",backgroundColor:t[200],cursor:"pointer",":hover":{backgroundColor:y[50]},":hover .MuiTypography-caption":{color:y[500]}},children:e.jsx(a,{variant:"caption",sx:{color:t[600]},children:"submission-score-rules-2024.pdf"})})]})]})]}),e.jsxs(r,{component:"div",sx:{flexBasis:{xs:"100%",sm:"20%"},display:"flex",columnGap:"0.3em"},children:[e.jsx(jo,{fontSize:"small",sx:{color:"#06816d"}}),e.jsxs(r,{component:"div",children:[e.jsx(a,{component:"p",variant:"caption",sx:{fontWeight:550,color:t[700]},children:"Assignee"}),e.jsx(a,{component:"p",variant:"caption",sx:{color:t[600]},children:"13 Candidates"}),e.jsx(K,{variant:"text",size:"small",startIcon:e.jsx(ne,{fontSize:"small"}),children:"Details"})]})]})]})]})]}),e.jsx($e,{orientation:"horizontal",sx:{borderColor:t[400]}}),e.jsxs(r,{component:"div",sx:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.5em 0.8em"},children:[e.jsx(K,{variant:"contained",startIcon:e.jsx(Oe,{}),children:"View Submissions"}),e.jsx(ie,{label:e.jsx(a,{variant:"caption",sx:{color:y[700],fontStyle:"italic"},children:"4 submitted out of 13"}),size:"small",sx:{paddingX:{xs:0,sm:"0.5em"},backgroundColor:y[50]}})]})]},p))}),e.jsx(ee,{color:"primary",count:13,sx:{display:"flex",justifyContent:"end",marginY:"2em"}})]}),e.jsx(X,{in:i==="interviews",mountOnEnter:!0,unmountOnExit:!0,children:e.jsxs(r,{component:"div",id:"screenings-panel",children:[e.jsx(ce,{sx:{".MuiTableHead-root":{".MuiTableCell-root":{borderBottom:"none"}}},children:e.jsxs(ae,{children:[e.jsx(de,{children:e.jsx(B,{children:F.map((n,p)=>e.jsx(x,{children:e.jsx(a,{variant:"subtitle2",sx:{fontWeight:550,color:t[500]},children:n.label})},p))})}),e.jsx(le,{sx:{"> .MuiTableRow-root:hover":{backgroundColor:t[100]},".MuiTableCell-root":{borderColor:t[300]}},children:J.map((n,p)=>e.jsx(B,{children:F.map((M,h)=>{switch(M.valueProp){case"#":return e.jsx(x,{children:p+1},h);case"name":return e.jsx(x,{size:"small",sx:{},children:e.jsxs(r,{component:"div",sx:{width:"100%",display:"flex",flexWrap:"wrap",columnGap:{xs:0,sm:"0.7em"},rowGap:{xs:"0.7em",sm:0}},children:[!s&&e.jsx(te,{alt:"candidate-profile",src:"https://placehold.co/40x40",sx:{width:40,height:40}}),e.jsxs(r,{component:"div",children:[e.jsx(a,{component:"p",variant:"subtitle2",sx:{fontWeight:550,color:t[800]},children:n.name}),e.jsx(a,{component:"p",variant:"caption",sx:{wordBreak:"break-word"},children:n.email})]})]})},h);case"location":return e.jsxs(x,{sx:{maxWidth:"15em"},children:[e.jsx(a,{component:"p",variant:"subtitle2",sx:{fontWeight:550,color:t[700]},children:n.location.name}),e.jsx(pe,{to:n.location.url,style:{textDecoration:"none"},children:e.jsx(a,{component:"p",variant:"subtitle2",sx:{color:t[600],":hover":{color:y[700],textDecoration:"underline"},wordBreak:"break-word"},children:n.location.url})})]},h);case"status":return e.jsx(x,{children:e.jsx(ie,{label:n.status,size:"small",sx:S(n.status)})},h);case"option":return e.jsx(x,{size:"small",sx:{},children:e.jsx(r,{component:"div",sx:{display:"flex",justifyContent:"space-between"},children:e.jsx(f,{size:"small",onClick:w=>c(b=>({...b,[i]:w.currentTarget})),children:e.jsx(Z,{fontSize:"small"})})})},h);case"schedule":return e.jsxs(x,{children:[e.jsxs(a,{component:"p",variant:"caption",children:[n.date," at ",n.location.name]}),e.jsx(pe,{to:n.location.url,target:"_blank",style:{textDecoration:"none",fontStyle:"italic"},children:e.jsx(a,{component:"p",variant:"caption",sx:{color:t[600],":hover":{color:y[500],textDecoration:"underline"}},children:"Link here"})}),e.jsx(r,{component:"div",sx:{marginY:"0.5em",textAlign:"center"},children:e.jsx(ie,{label:n.status,size:"small",sx:S(n.status)})})]},h);default:return e.jsx(x,{size:"small",sx:{},children:e.jsx(a,{variant:"subtitle2",sx:{color:t[600]},children:n[M.valueProp]})},h)}})},p))})]})}),e.jsx(ee,{color:"primary",count:13,sx:{display:"flex",justifyContent:"end",marginY:"2em"}})]})}),e.jsx(X,{in:i==="offerings",mountOnEnter:!0,unmountOnExit:!0,children:e.jsxs(r,{component:"div",id:"screenings-panel",children:[e.jsx(ce,{sx:{".MuiTableHead-root":{".MuiTableCell-root":{borderBottom:"none"}}},children:e.jsxs(ae,{children:[e.jsx(de,{children:e.jsx(B,{children:W.map((n,p)=>e.jsx(x,{children:e.jsx(a,{variant:"subtitle2",sx:{fontWeight:550,color:t[500]},children:n.label})},p))})}),e.jsx(le,{sx:{"> .MuiTableRow-root:hover":{backgroundColor:t[100]},".MuiTableCell-root":{borderColor:t[300]}},children:_.map((n,p)=>e.jsx(B,{children:W.map((M,h)=>{switch(M.valueProp){case"#":return e.jsx(x,{children:p+1},h);case"name":return e.jsx(x,{size:"small",sx:{},children:e.jsxs(r,{component:"div",sx:{width:"100%",display:"flex",flexWrap:"wrap",columnGap:{xs:0,sm:"0.7em"},rowGap:{xs:"0.7em",sm:0}},children:[!s&&e.jsx(te,{alt:"candidate-profile",src:"https://placehold.co/40x40",sx:{width:40,height:40}}),e.jsxs(r,{component:"div",children:[e.jsx(a,{component:"p",variant:"subtitle2",sx:{fontWeight:550,color:t[800]},children:n.name}),e.jsx(a,{component:"p",variant:"caption",sx:{wordBreak:"break-word"},children:n.email})]})]})},h);case"socials":return e.jsx(x,{children:e.jsx(Q,{direction:"row",sx:{flexWrap:"wrap",maxWidth:"10em"},children:n.socials.map((w,b)=>{switch(w.name){case"github":return e.jsx(f,{size:"small",onClick:()=>console.info("navigate to 	:",w.src),children:e.jsx(be,{})},b);case"linkedin":return e.jsx(f,{size:"small",children:e.jsx(je,{})},b);case"instagram":return e.jsx(f,{size:"small",children:e.jsx(ge,{})},b);case"x":return e.jsx(f,{size:"small",children:e.jsx(Me,{})},b);default:return}})})},h);case"option":return e.jsx(x,{size:"small",sx:{},children:e.jsxs(r,{component:"div",sx:{display:"flex",justifyContent:"space-between"},children:[!o&&e.jsx(K,{variant:"text",size:"small",startIcon:e.jsx(ne,{fontSize:"small"}),onClick:()=>d(!0),children:"View"}),e.jsx(f,{size:"small",onClick:w=>c(b=>({...b,[i]:w.currentTarget})),children:e.jsx(Z,{fontSize:"small"})})]})},h);default:return e.jsx(x,{size:"small",sx:{},children:e.jsx(a,{variant:"subtitle2",children:n[M.valueProp]})},h)}})},p))})]})}),e.jsx(ee,{color:"primary",count:13,sx:{display:"flex",justifyContent:"end",marginY:"2em"}})]})}),e.jsx(X,{in:!1}),e.jsxs(Ge,{maxWidth:"lg",open:u,onClose:()=>d(!1),fullWidth:!0,fullScreen:o,PaperProps:{sx:{paddingX:"1em","&::-webkit-scrollbar":{width:"0.5em"},"&::-webkit-scrollbar-thumb":{backgroundColor:t[300],borderRadius:"0.15em"}}},children:[e.jsx(r,{component:"div",sx:{display:"flex",justifyContent:"end",paddingTop:"0.5em"},children:e.jsx(f,{onClick:()=>d(!1),children:e.jsx(Ee,{})})}),e.jsxs(re,{container:!0,spacing:2,children:[e.jsx(re,{item:!0,lg:8,xs:12,children:e.jsx(We,{})}),e.jsx(re,{item:!0,lg:4,xs:12,children:e.jsx(Ie,{containerStyle:{top:"0.5em"}})})]})]})]})})}export{Fo as default};
