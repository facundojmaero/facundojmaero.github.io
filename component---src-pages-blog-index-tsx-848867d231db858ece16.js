"use strict";(self.webpackChunkfacundojmaero_github_io=self.webpackChunkfacundojmaero_github_io||[]).push([[643],{1046:function(e,t,a){a.d(t,{w_:function(){return c}});var r=a(7294),n={color:void 0,size:void 0,className:void 0,style:void 0,attr:void 0},l=r.createContext&&r.createContext(n),i=function(){return(i=Object.assign||function(e){for(var t,a=1,r=arguments.length;a<r;a++)for(var n in t=arguments[a])Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e}).apply(this,arguments)},s=function(e,t){var a={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(a[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var n=0;for(r=Object.getOwnPropertySymbols(e);n<r.length;n++)t.indexOf(r[n])<0&&Object.prototype.propertyIsEnumerable.call(e,r[n])&&(a[r[n]]=e[r[n]])}return a};function o(e){return e&&e.map((function(e,t){return r.createElement(e.tag,i({key:t},e.attr),o(e.child))}))}function c(e){return function(t){return r.createElement(m,i({attr:i({},e.attr)},t),o(e.child))}}function m(e){var t=function(t){var a,n=e.attr,l=e.size,o=e.title,c=s(e,["attr","size","title"]),m=l||t.size||"1em";return t.className&&(a=t.className),e.className&&(a=(a?a+" ":"")+e.className),r.createElement("svg",i({stroke:"currentColor",fill:"currentColor",strokeWidth:"0"},t.attr,n,c,{className:a,style:i(i({color:e.color||t.color},t.style),e.style),height:m,width:m,xmlns:"http://www.w3.org/2000/svg"}),o&&r.createElement("title",null,o),e.children)};return void 0!==l?r.createElement(l.Consumer,null,(function(e){return t(e)})):t(n)}},6568:function(e,t,a){a.d(t,{Z:function(){return c}});var r=a(7294),n=a(5444),l=a(3201),i=function(){var e=(0,n.K2)("426988268"),t="navigation-bar__link--active";return r.createElement("header",{className:"navigation-bar"},r.createElement(n.rU,{to:"/",className:"navigation-bar__title"},r.createElement(l.bit,{size:"50",className:"navigation-bar__title__profile-picture"}),r.createElement("p",{className:"navigation-bar__title__name"},e.site.siteMetadata.title)),r.createElement("nav",null,r.createElement(n.rU,{to:"/blog",className:"navigation-bar__link",activeClassName:t},"Blog"),r.createElement(n.rU,{to:"/about",className:"navigation-bar__link",activeClassName:t},"About")))},s=function(e,t){var a;switch(e){case"twitter":a="https://www.twitter.com/"+t;break;case"github":a="https://github.com/"+t;break;case"email":a="mailto:"+t;break;case"linkedin":a="https://www.linkedin.com/in/"+t;break;case"resume":a="https://registry.jsonresume.org/"+t;break;default:a=t}return a},o=function(){var e=(0,n.K2)("715814695").site.siteMetadata.author.contacts;return r.createElement("footer",{className:"footer"},r.createElement("h3",{className:"footer__title"},"Links"),r.createElement("ul",{className:"footer__link-list"},Object.keys(e).map((function(t,a){var n=function(e){return{twitter:l.fWC,github:l.hJX,email:l.SRX,linkedin:l.ltd,resume:l.mGS}[e]}(t);return r.createElement("li",{className:"footer__link-list__item",key:a},r.createElement("a",{className:"footer__link-list__item-link",href:s(t,e[t]),title:t[0].toUpperCase()+t.slice(1)},r.createElement(n,{size:"32"})))}))),r.createElement("p",{className:"footer__credit"},"Built with ",r.createElement("a",{href:"https://www.gatsbyjs.com"},"Gatsby")))},c=function(e){var t=e.pageTitle,a=e.children,l=(0,n.K2)("426988268");return r.createElement("div",{className:"container"},r.createElement("title",null,t," | ",l.site.siteMetadata.title),r.createElement(i,null),r.createElement("main",null,a),r.createElement(o,null))}},3406:function(e,t,a){a.r(t),a.d(t,{default:function(){return s}});var r=a(7294),n=a(6568),l=a(5444),i=function(e){var t=e.posts;return r.createElement("div",{className:"post-list"},t.map((function(e){return r.createElement("article",{className:"post-list__post",key:e.id},r.createElement("h2",{className:"post-list__post__title"},r.createElement(l.rU,{to:"/blog/"+e.slug},e.frontmatter.title)),r.createElement("div",{className:"post-list__post__publication-date"},e.frontmatter.date," - ",e.fields.readingTime.text))})))},s=function(e){var t=e.data;return r.createElement(n.Z,{pageTitle:"My Blog Posts"},r.createElement(i,{posts:t.allMdx.nodes}))}}}]);
//# sourceMappingURL=component---src-pages-blog-index-tsx-848867d231db858ece16.js.map