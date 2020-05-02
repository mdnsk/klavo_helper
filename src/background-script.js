import debounce from 'debounce';

import { UNREAD_MESSAGES_COUNTER_CHANGED } from './messages';

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
    }
  }
});
