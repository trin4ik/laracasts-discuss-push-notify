import './index.scss'

var extid = document.createElement('script');
extid.textContent = "var extensionId = " + JSON.stringify(chrome.runtime.id);
(document.head || document.documentElement).appendChild(extid);
extid.parentNode.removeChild(extid);

const script = document.createElement('script');
script.setAttribute("type", "module");
script.setAttribute("src", chrome.extension.getURL('/page/index.js'));
const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
head.insertBefore(script, head.lastChild);
