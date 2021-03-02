# Laracasts Discuss PUSH Notifications

Simple [Google Chrome](https://www.google.com/chrome/) and [Firefox](https://www.mozilla.org/ru/firefox/new/) extension,
adds "Follow by PUSH" button in https://laracasts.com/discuss. \
Works only on desktops or laptops, use system notification center

<table>
<tr>
<th>MacOS</th>
<th>Ubuntu</th>
</tr>
<tr>
<td width="50%">
<img src="https://habrastorage.org/webt/ui/xs/dl/uixsdlbfvcstpr3qpv44ahyuask.jpeg" width="100%" />
</td>
<td>
<img src="https://habrastorage.org/webt/ef/w8/mt/efw8mt0po5mtlxn-osba3qrpazq.jpeg" width="100%" />
</td>
</tr>
</table>


<p align="center">
	<img src="https://habrastorage.org/webt/en/ky/1a/enky1alpxxjsza2xb1a-zyarkde.jpeg" />
</p>

## Whats happend?

Laracasts discuss provide to follow on thread by email, it is not always convenient. \
This extension works only local JS, checks new answers in thread to which you subscribed and send Push notification, if
any new answers. \
**NON ANY DATA SEND TO EXTERNAL SERVER**

## How it works?

Extension adds button "Follow by push" and save threads to localstorage. In background once every 30 seconds fetchs all
threads, witch you subscribed to and check updates. \
Threads with no updates in 3 days, autoremoved. \
You will not receive push, if author of answer is you. Information about your id take from laracasts web page
automatically

## Whats wrong?

* [x] ~~vinaigrette code. need to refactor code in one style with background, content and options page of extension~~
* [x] ~~quick-and-dirty code. need to refactor project, include webpack etc~~
* [x] ~~preact options page. need to vue3~~
* [ ] strange message system. need to refactor "communication" with extension modules. for example, at now hard to
  dispatch events from options page to content
* [ ] no sync with different device. need to add feature for syncing settings and list of subscribed threads to cloud

---

any remarks, comments, bugs and PR are welcome
