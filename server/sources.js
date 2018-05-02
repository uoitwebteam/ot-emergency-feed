/**
 * Constants for holding source type references.
 */
const TYPE_DISRUPTION = 'disruption';
const TYPE_EMERGENCY = 'emergency';
const TYPE_WEATHER = 'weather';

const compare = (last, current) => {
  const [lastChannel] = last.rss.channel;
  const [currentChannel] = current.rss.channel;

  const lastItems = lastChannel.item;
  const currentItems = currentChannel.item

  if ((!lastItems && currentItems) || (!currentItems && lastItems)) return false;

  if (lastChannel.pubDate && currentChannel.pubDate) {
    const [lastPubDate] = lastChannel.pubDate;
    const [currentPubDate] = currentChannel.pubDate;
    return lastPubDate === currentPubDate;;
  }

  if (lastItems.length && currentItems.length) {
    if (lastItems.length !== currentItems.length) return false;
    const [{ pubDate: [lastItemPubDate] }] = lastItems;
    const [{ pubDate: [currentItemPubDate] }] = currentItems;
    return lastItemPubDate === currentItemPubDate;
  }
};

const SOURCE_LIST = [
  {
    type: TYPE_DISRUPTION,
    // url: 'http://localhost:8080/service_disruptions.xml',
    url: 'https://shared.uoit.ca/global/inc/get/servicedisruptionsdemo.xml',
    xml: true,
    compare
  },
  {
    type: TYPE_EMERGENCY,
    // url: 'http://localhost:8080/emergency_messages.xml',
    url: 'https://shared.uoit.ca/global/inc/get/emergencyfeeddemo.xml',
    interval: 1000,
    xml: true,
    compare
  }
]

exports = module.exports = { SOURCE_LIST, TYPE_DISRUPTION, TYPE_EMERGENCY, TYPE_WEATHER };