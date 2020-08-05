Used permissions:  
downloads, contextMenus, \[hosts array\]  

Used APIs:  

API | Availiability on Android | Availiability on desktop  
chrome.contextMenus.create                  | unsupported by FF Android | FF 55 (48 non-standard name)  
chrome.contextMenus.update                  | unsupported by FF Android | FF 55  
chrome.contextMenus.removeAll               | unsupported by FF Android | FF 55  
chrome.contextMenus.onClicked.addListener   | unsupported by FF Android | FF 55 (48 non-standard name)  
chrome.commands.onCommand.addListener       | unsupported by FF Android | FF 63 (48 but was not treated as user-action)  
chrome.tabs.query                           | FF Android 54 | FF 45  
chrome.tabs.sendMessage                     | FF Android 54 | FF 45  
chrome.tabs.onActivated.addListener         | FF Android 54 | FF 45  
chrome.tabs.onUpdated.addListener           | FF Android 54 | FF 45  
chrome.runtime.lastError                    | FF Android 48 | FF 47  
chrome.downloads.download                   | FF Android raises an error if saveAs is set to true; either set saveAs to false or drop it | FF 47 (52 to use saveAs)  

General consensus: suitable for FF >55 (hotkeys >63)  
