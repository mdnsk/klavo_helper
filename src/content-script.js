import { UNREAD_MESSAGES_COUNTER_CHANGED } from './messages';

import registerController from './helpers/register-controller';

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
