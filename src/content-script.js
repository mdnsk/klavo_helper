import { START_FLICKR_TITLE, STOP_FLICKR_TITLE, UNREAD_MESSAGES_COUNTER_CHANGED } from './messages';

import registerController from './helpers/register-controller';

const FLICKR_TITLE_INTERVAL = 500;

let previousCount;
let currentCount;

registerController(
  () => {
    const messageCounter = document.querySelector('.userpanel .user-block .user-dropdown .mail .cnt');
    
    if (!messageCounter) {
      throw new Error('[Klavo Helper]: messageCounter not found');
    }

    if (currentCount === undefined) {
      currentCount = messageCounter.innerText;
      return false;
    }

    const messagesCountChanged = messageCounter.innerText !== currentCount;

    if (messagesCountChanged) {
      previousCount = currentCount;
      currentCount = messageCounter.innerText;
    }

    return messagesCountChanged;
  },
  () => {
    chrome.runtime.sendMessage({ id: UNREAD_MESSAGES_COUNTER_CHANGED, data: { currentCount, previousCount } });
  },
);

let originalTitle;
let isOriginalTitleVisible = true;
let flickrIntervalId = null;

chrome.runtime.onMessage.addListener(({ id: messageId }) => {
  if (messageId === START_FLICKR_TITLE) {
    if (!flickrIntervalId) {
      flickrIntervalId = setInterval(flickrTitle, FLICKR_TITLE_INTERVAL);
    }
  } else if (messageId === STOP_FLICKR_TITLE) {
    if (flickrIntervalId) {
      clearInterval(flickrIntervalId);
      flickrIntervalId = null;

      if (!isOriginalTitleVisible) {
        document.title = originalTitle;
      }
    }
  }
});

function flickrTitle() {
  if (originalTitle === undefined) {
    originalTitle = document.title;
  }

  document.title = isOriginalTitleVisible ? `(+${parseInt(currentCount)}) Новое сообщение` : originalTitle;
  isOriginalTitleVisible = !isOriginalTitleVisible;
}
