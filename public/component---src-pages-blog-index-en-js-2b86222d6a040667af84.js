(self.webpackChunkgatsby_starter_glass=self.webpackChunkgatsby_starter_glass||[]).push([[220],{7383:function(e,t,a){"use strict";var n=a(7294),r=a(7452),i=a(5444),o=a(1621),l=a(4165),s=a(5887);t.Z=function(e){var t=e.posts,a=e.langKey,r=t.map((function(e){var t=e.frontmatter,r=e.fields,i=e.excerpt,o=e.timeToRead,s=t.title,m=t.tags,d=t.date,p=t.description,g=r.slug;return n.createElement(c,{key:g,tags:m,title:s,date:(0,l.p)(d,a),slug:g,timeToRead:o,description:p,excerpt:i})}));return n.createElement(m,null,r)};var c=function(e){var t=e.title,a=e.date,r=e.timeToRead,l=e.tags,c=e.excerpt,m=e.description,f=e.slug;return n.createElement(d,null,n.createElement(o.Z,{tags:l}),n.createElement(p,null,n.createElement(i.Link,{to:f},t)),n.createElement(g,{dangerouslySetInnerHTML:{__html:m||c}}),n.createElement(u,null,n.createElement("span",null,a),n.createElement("span",null,n.createElement(s.c,{i18nKey:"timeToRead",count:r},{timeToRead:r}," mins"))))},m=r.ZP.ul.withConfig({displayName:"post-list__StyledPostList",componentId:"rmizj4-0"})(["padding:0;list-style:none;display:grid;justify-items:center;grid-gap:var(--size-600);grid-template-columns:repeat(auto-fit,minmax(35ch,1fr));@media screen and (max-width:500px){&{display:block;}}"]),d=r.ZP.li.withConfig({displayName:"post-list__StyledPostListItem",componentId:"rmizj4-1"})(["position:relative;display:flex;flex-direction:column;padding:1.5rem;border:1px solid rgba(255,255,255,0.5);background-color:rgba(255,255,255,0.3);backdrop-filter:blur(10px);border-radius:8px;&:hover{background-color:rgba(255,255,255,0.5);}@media screen and (max-width:500px){&{margin-top:var(--size-600);}}"]),p=r.ZP.h2.withConfig({displayName:"post-list__PostListTitle",componentId:"rmizj4-2"})(['line-height:1.2;margin-top:1rem;margin-bottom:1rem;text-transform:capitalize;font-size:var(--size-600);font-weight:700;& a{text-decoration:none;color:inherit;}& a::after{content:"";position:absolute;top:0;bottom:0;left:0;right:0;}']),g=r.ZP.p.withConfig({displayName:"post-list__PostListExcerpt",componentId:"rmizj4-3"})(["margin-top:auto;font-size:var(--size-400);"]),u=r.ZP.div.withConfig({displayName:"post-list__PostListMeta",componentId:"rmizj4-4"})(["margin-top:2rem;font-size:var(--size-300);display:flex;justify-content:space-between;"])},1621:function(e,t,a){"use strict";var n=a(7294),r=a(7452),i=a(404);t.Z=function(e){var t=e.tags,a=e.langKey;return n.createElement("div",null,t&&t.map((function(e){return n.createElement(o,{key:e},n.createElement(i.Z,{langKey:a,to:"/tags/"+(t=e,t.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g).map((function(e){return e.toLowerCase()})).join("-"))},e));var t})))};var o=r.ZP.span.withConfig({displayName:"tags__Tag",componentId:"sc-16itk8x-0"})(["margin-right:0.6rem;margin-bottom:0.6rem;text-transform:uppercase;font-size:var(--size-300);& a{position:relative;z-index:2;background-color:rgba(255,255,255,0.7);text-decoration:none;color:inherit;padding:0.2rem 0.6rem;border:1px solid rgba(255,255,255,1);border-radius:4px;}& a:hover{background-color:rgba(255,255,255,0.9);}"])},2983:function(e,t,a){"use strict";var n=a(7294),r=a(9313),i=a(7383),o=a(404),l=a(7452),s=a(8270),c=(0,l.ZP)(o.Z).withConfig({displayName:"_base___StyledLinkWithLang",componentId:"sc-1pjfnaq-0"})(["margin-top:var(--size-400);color:inherit;text-transform:uppercase;"]);t.Z=function(e){var t=e.data,a=e.pageContext,o=(0,s.$)().t,l=t.allMarkdownRemark.nodes;return n.createElement(r.Z,{title:o("blog"),langKey:a.langKey},n.createElement(m,null,n.createElement("h1",null,o("blog")),n.createElement(c,{langKey:a.langKey,to:"/tags"},o("viewAllTags"))),n.createElement(i.Z,{posts:l,langKey:a.langKey}))};var m=l.ZP.div.withConfig({displayName:"_base__HeaderWrapper",componentId:"sc-1pjfnaq-1"})(["display:flex;flex-direction:column;margin-top:var(--size-900);margin-bottom:var(--size-700);h1{max-width:none;}"])},6025:function(e,t,a){"use strict";a.r(t);var n=a(2983);t.default=n.Z},4165:function(e,t,a){"use strict";a.d(t,{p:function(){return n}});var n=function(e,t){var a=e instanceof Date?e:new Date(e);switch(t){case"en":return a.toLocaleDateString("en",{month:"long",year:"numeric",day:"numeric"});case"zh":return a.toLocaleDateString("zh",{month:"numeric",year:"numeric",day:"numeric"});default:return a.toLocaleDateString()}}}}]);
//# sourceMappingURL=component---src-pages-blog-index-en-js-2b86222d6a040667af84.js.map