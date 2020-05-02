import debounce from 'debounce';

import { START_FLICKR_TITLE, STOP_FLICKR_TITLE, UNREAD_MESSAGES_COUNTER_CHANGED } from './messages';

const DEBOUNCE_THRESHOLD = 1000;

const player = new Audio(chrome.extension.getURL('assets/message.wav'));
const playSound = debounce(() => player.play(), DEBOUNCE_THRESHOLD);

chrome.runtime.onMessage.addListener(({ id: messageId, data }, { tab: { id: tabId } }) => {
  if (messageId === UNREAD_MESSAGES_COUNTER_CHANGED) {
    const currentCount = parseInt(data.currentCount);
    const previousCount = parseInt(data.previousCount);

    if (Number.isNaN(currentCount) || Number.isNaN(previousCount)) {
      throw new Error('[Klavo Helper]: Invalid counter data');
    }

    if (currentCount > previousCount) {
      playSound();
      flickrTitle();
    }
  }
});

async function flickrTitle() {
  chrome.tabs.query({ url: '*://klavogonki.ru/*' }, tabs => {
    if (tabs.length) {
      let tab = tabs.find(t => /messages\/contacts\/$/.test(t.url));
  
      if (!tab) {
        tab = tabs[0];
      }
  
      if (!tab.active) {
        chrome.tabs.sendMessage(tab.id, { id: START_FLICKR_TITLE });
      }
    }
  });
}

chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.sendMessage(activeInfo.tabId, { id: STOP_FLICKR_TITLE });
});
