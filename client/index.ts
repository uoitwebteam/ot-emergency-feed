import { SocketPollClient } from 'mighty-polling-socket-server';
import './styles/main.scss';

import {
  RSSUtility,
  RSSFeed,
  Notification
} from './lib';
import { 
  ServiceDisruption,
  ServiceDisruptionRSSItem,
  EmergencyMessage,
  TYPE_DISRUPTION,
  TYPE_EMERGENCY,
} from './models';

const REDIRECT_URL = 'http://uoit.ca/emergency';

const rss = new RSSUtility();
const toast = new Notification();
const client = new SocketPollClient();

/**
 * Hold references to all feed containers (also provides a null checks).
 */
const emergencyMessageBar = document.getElementById('emergencyMessageBar');
const emergencyFeedMessage = document.getElementById('emergencyFeedMessage');
const serviceDisruptionMessage = document.getElementById('serviceDisruptionMessage');

/**
 * A bind-ready function for running a 5-second countdown
 * inside the notification displayed before emergency message
 * redirects, to notify of impending redirection.
 */
const onNotify = function startCountdown() {
  let secondsLeft = 5, countdownDone = false;
  const elements: Element[] = [...this.childNodes];
  const countdownEl = elements.find(el => el.classList && el.classList.contains('countdown'));
  countdownEl.innerHTML = `${secondsLeft} seconds`;
  const ticker = setInterval(() => {
    secondsLeft--;
    countdownDone = secondsLeft === 0;
    countdownEl.innerHTML = countdownDone ? 'Now!' : `${secondsLeft} seconds`;
    countdownDone && clearInterval(ticker);
  }, 1000)
};

/**
 * Performs a redirect after notification has been dismissed.
 */
const onDismiss = () => document.location.assign(REDIRECT_URL);

/**
 * Listens to incoming service disruption socket data. Responsible for
 * mapping `ServiceDisruptionRSSItem` objects to more useful `ServiceDisruption`
 * instances, and building a templated list from the items (if any).
 */
client.on<TYPE_DISRUPTION, RSSFeed>(TYPE_DISRUPTION, ({ data }) => {
  /** Sets and compares a cookie of last viewed pubDate */
  const viewedBefore = rss.checkViewStatus(TYPE_DISRUPTION, data);

  if (serviceDisruptionMessage) {
    const rssItems = rss.parseItems(data, (item: ServiceDisruptionRSSItem) => new ServiceDisruption(item));

    if (rssItems.length) {
      const html = rssItems.map((item: ServiceDisruption)  => `<div class="emergencyNewsItem">
        <a href="${ item.link }" title="${ item.title }"><img src="${ item.mediaContent }" alt="${ item.mediaDescription }" width="100" height="67"></a>
        <p><strong><a href="${ item.link }">${ item.title }</strong></a></p>
        <p class="date">${ item.pubDate }</p>
      </div>`).join('\n');
      serviceDisruptionMessage.innerHTML = html;
    }
  // } else {
    if (!viewedBefore) {
      /** If not viewed, show notification and redirect to new page */
      const html = `<span class="icon_emergency warning text-larger"></span>
        <strong>Notice:</strong> A new service disruption has been posted! 
        <a href="#"><strong>More info &raquo;</strong></a>`;

      toast.notify(html, {
        duration: 8000,
        className: 'warning',
        position: {
          right: true,
          bottom: true
        }
      });
    }
  }
});

/**
 * Listens to incoming emergency message socket data. Responsible for
 * mapping `RSSItem` objects to more useful `EmergencyMessage`
 * instances, and building a templated list from the items (if any).
 * 
 * Checks and tracks view status of last received message; if last
 * has not been tracked as viewed, prompts user with a notification
 * and redirects to a new page. If already viewed, displays info bar.
 */
client.on<TYPE_EMERGENCY, RSSFeed>(TYPE_EMERGENCY, ({ data }) => {
  /** Sets and compares a cookie of last viewed pubDate */
  const viewedBefore = rss.checkViewStatus(TYPE_EMERGENCY, data);
  const rssItems = rss.parseItems(data, item => new EmergencyMessage(item));

  if (rssItems.length) {
    if (emergencyFeedMessage) {
      const html = rssItems.map(item => `<p class="emergencyTitle">${item.title}</p>
        <p class="emergencyDesc">${item.description}</p>
        <p class="emergencyDate">${item.pubDate}</p>`).join('\n');
      emergencyFeedMessage.innerHTML = html;
    }

    if (emergencyMessageBar && viewedBefore) {
      /** If viewed before, just display info bar */
      const html = rssItems.map(item => `<div class="row">
        <a href="${REDIRECT_URL}">
          <div class="emergencyAlert">
          Emergency Alert
          </div>
          <div class="emergencyMessage">
            <span class="emergencyTitle">${item.title}</span>
            <span class="emergencyDesc">${item.description}</span>
            <span class="emergencyDate">${item.pubDate}</span>
          </div>
        </a>
      </div>`).join('\n');
      emergencyMessageBar.innerHTML = html;
    }

    if (!viewedBefore) { //!emergencyMessageBar && !emergencyFeedMessage && 
      /** If not viewed, show notification and redirect to new page */
      const html = `<span class="icon_emergency alert text-larger"></span>
        <strong>Notice:</strong> You are about to be redirected to an emergency message!
        <br/><small>Redirecting in:</small> <strong class="countdown"></strong>`;

      toast.notify(html, {
        duration: 5000,
        className: 'alert',
        position: {
          right: true,
          bottom: true
        },
        onNotify,
        onDismiss
      });
    }
  }
});