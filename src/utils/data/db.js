
import userData from './userData';
import visitorData from './visitorData';

const db = {
  users: userData,
  visitors: visitorData,
  passes: [],
  zones: [],
  keys: [],
  readers: [],
  adams: [],
  guardReaderMappings: [],
  reports: {
    readers: [],
    adam: [],
    zone: [],
    key: [],
    user: [],
    user_session: [],
    visitor: [],
    visitor_track: [],
    key_assigned: [],
  },
};

export default db;
