"use strict";{const e=document.getElementById("toggle-nav-sidebar");if(null!==e){const n=document.querySelectorAll("#nav-sidebar a");function disableNavLinkTabbing(){for(const e of n)e.tabIndex=-1}function enableNavLinkTabbing(){for(const e of n)e.tabIndex=0}const a=document.getElementById("main");let t=localStorage.getItem("django.admin.navSidebarIsOpen");null===t&&(t="true"),"false"===t&&disableNavLinkTabbing(),a.classList.toggle("shifted","true"===t),e.addEventListener("click",(function(){"true"===t?(t="false",disableNavLinkTabbing()):(t="true",enableNavLinkTabbing()),localStorage.setItem("django.admin.navSidebarIsOpen",t),a.classList.toggle("shifted")}))}}