(self.webpackChunkgatsby_starter_glass=self.webpackChunkgatsby_starter_glass||[]).push([[946],{1621:function(e,t,a){"use strict";var r=a(7294),n=a(7452),o=a(404);t.Z=function(e){var t=e.tags,a=e.langKey;return r.createElement("div",null,t&&t.map((function(e){return r.createElement(i,{key:e},r.createElement(o.Z,{langKey:a,to:"/tags/"+(t=e,t.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g).map((function(e){return e.toLowerCase()})).join("-"))},e));var t})))};var i=n.ZP.span.withConfig({displayName:"tags__Tag",componentId:"sc-16itk8x-0"})(["margin-right:0.6rem;margin-bottom:0.6rem;text-transform:uppercase;font-size:var(--size-300);& a{position:relative;z-index:2;background-color:rgba(255,255,255,0.7);text-decoration:none;color:inherit;padding:0.2rem 0.6rem;border:1px solid rgba(255,255,255,1);border-radius:4px;}& a:hover{background-color:rgba(255,255,255,0.9);}"])},545:function(e,t,a){"use strict";a.r(t);var r=a(7294),n=a(5444),o=a(9313),i=a(7452),l=a(1621),s=a(4165);t.default=function(e){var t=e.data,a=e.pageContext,i=t.markdownRemark,u=i.frontmatter,f=i.excerpt,h=i.html,v=t.prev,b=t.next;return r.createElement(o.Z,{title:u.title,description:u.description||f,langKey:a.langKey},r.createElement(p,null,r.createElement("article",null,r.createElement(c,null,u.title),r.createElement(m,null,(0,s.p)(u.date,a.langKey)),r.createElement(d,{dangerouslySetInnerHTML:{__html:h}})),r.createElement(g,null,v&&r.createElement("div",null,r.createElement("span",null,"previous"),r.createElement(n.Link,{to:v.fields.slug}," ",v.frontmatter.title)),b&&r.createElement("div",null,r.createElement("span",null,"next"),r.createElement(n.Link,{to:b.fields.slug}," ",b.frontmatter.title))),r.createElement(l.Z,{tags:u.tags,langKey:a.langKey})))};var p=i.ZP.div.withConfig({displayName:"post-template__PostWrapper",componentId:"afk1br-0"})(["padding-top:var(--size-900);padding-bottom:var(--size-900);margin-left:auto;margin-right:auto;max-width:70ch;word-wrap:break-word;"]),c=i.ZP.h1.withConfig({displayName:"post-template__PostTitle",componentId:"afk1br-1"})(["font-size:var(--size-700);"]),m=i.ZP.span.withConfig({displayName:"post-template__PostDate",componentId:"afk1br-2"})(["font-size:var(--size-400);padding-top:1rem;text-transform:uppercase;"]),d=i.ZP.section.withConfig({displayName:"post-template__PostContent",componentId:"afk1br-3"})(['padding-top:var(--size-800);& > * + *{margin-top:var(--size-300);}& > p + p{margin-top:var(--size-700);}* + h1,* + h2,* + h3{margin-top:var(--size-900);}h1{font-size:var(--size-700);}h2{font-size:var(--size-600);}h3{font-size:var(--size-500);}b,strong{font-weight:600;}a{color:inherit;text-decoration:underline;text-decoration-thickness:0.125rem;}blockquote{padding-left:var(--size-400);border-left:5px solid;font-style:italic;}code{font-family:"Source Sans Pro",monospace;overflow-x:auto;white-space:pre-wrap;}pre{overflow-x:auto;white-space:pre-wrap;max-width:100%;}']),g=i.ZP.nav.withConfig({displayName:"post-template__PostPagination",componentId:"afk1br-4"})(['display:flex;flex-wrap:wrap;margin-top:var(--size-900);& > *{position:relative;flex:1;display:flex;flex-direction:column;padding:1rem;padding-top:0.5rem;padding-bottom:0.5rem;border-radius:8px;border:1px solid rgba(255,255,255,0.5);background-color:rgba(255,255,255,0.3);backdrop-filter:blur(10px);margin:0.5rem;}& > *:hover{background-color:rgba(255,255,255,0.5);}& span{text-transform:uppercase;opacity:0.6;font-size:var(--size-400);padding-bottom:var(--size-500);}& a{color:inherit;text-decoration:none;font-size:var(--size-400);text-transform:capitalize;}& a::after{content:"";position:absolute;left:0;right:0;top:0;bottom:0;}'])},4165:function(e,t,a){"use strict";a.d(t,{p:function(){return r}});var r=function(e,t){var a=e instanceof Date?e:new Date(e);switch(t){case"en":return a.toLocaleDateString("en",{month:"long",year:"numeric",day:"numeric"});case"zh":return a.toLocaleDateString("zh",{month:"numeric",year:"numeric",day:"numeric"});default:return a.toLocaleDateString()}}}}]);
//# sourceMappingURL=component---src-templates-post-template-js-b153a158908e39a4d464.js.map