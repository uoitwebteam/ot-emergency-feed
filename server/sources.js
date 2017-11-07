/**
 * Constants for holding source type references.
 */
const TYPE_DISRUPTION = 'disruption';
const TYPE_EMERGENCY = 'emergency';
const TYPE_WEATHER = 'weather';

const SOURCE_LIST = [
  {
    type: TYPE_DISRUPTION,
    // url: 'http://localhost:8080/service_disruptions.xml',
    url: 'https://shared.uoit.ca/global/inc/get/servicedisruptionsdemo.xml',
    compare: (
      { rss: { channel: [{ pubDate: [oldData] }] } },
      { rss: { channel: [{ pubDate: [newData] }] } }
    ) => oldData === newData,
    xml: true
  },
  {
    type: TYPE_EMERGENCY,
    // url: 'http://localhost:8080/emergency_messages.xml',
    url: 'https://shared.uoit.ca/global/inc/get/emergencyfeeddemo.xml',
    compare: (
      { rss: { channel: [{ item: [{ pubDate: [oldData] }] }] } },
      { rss: { channel: [{ item: [{ pubDate: [newData] }] }] } },
    ) => oldData === newData,
    // interval: 1000,
    xml: true
  }
]

exports = module.exports = { SOURCE_LIST, TYPE_DISRUPTION, TYPE_EMERGENCY, TYPE_WEATHER };