
import db from './data/db';

const DB_KEY = 'vms_db';

const localStorageManager = {
  initializeDB: () => {
    if (!localStorage.getItem(DB_KEY)) {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    }
  },

  getDB: () => {
    return JSON.parse(localStorage.getItem(DB_KEY));
  },

  saveDB: (newDB) => {
    localStorage.setItem(DB_KEY, JSON.stringify(newDB));
  },

  getUsers: () => {
    const db = localStorageManager.getDB();
    return db.users;
  },

  getUser: (userId) => {
    const db = localStorageManager.getDB();
    return db.users.find((user) => user.id === userId);
  },

  addUser: (user) => {
    const db = localStorageManager.getDB();
    db.users.push(user);
    localStorageManager.saveDB(db);
  },

  updateUser: (updatedUser) => {
    const db = localStorageManager.getDB();
    const index = db.users.findIndex((user) => user.id === updatedUser.id);
    if (index !== -1) {
      db.users[index] = updatedUser;
      localStorageManager.saveDB(db);
    }
  },

  deleteUser: (userId) => {
    const db = localStorageManager.getDB();
    db.users = db.users.filter((user) => user.id !== userId);
    localStorageManager.saveDB(db);
  },

  getVisitors: () => {
    const db = localStorageManager.getDB();
    return db.visitors;
  },

  getVisitor: (visitorId) => {
    const db = localStorageManager.getDB();
    return db.visitors.find((visitor) => visitor.id === visitorId);
  },

  addVisitor: (visitor) => {
    const db = localStorageManager.getDB();
    db.visitors.push(visitor);
    localStorageManager.saveDB(db);
  },

  updateVisitor: (updatedVisitor) => {
    const db = localStorageManager.getDB();
    const index = db.visitors.findIndex((visitor) => visitor.id === updatedVisitor.id);
    if (index !== -1) {
      db.visitors[index] = updatedVisitor;
      localStorageManager.saveDB(db);
    }
  },

  deleteVisitor: (visitorId) => {
    const db = localStorageManager.getDB();
    db.visitors = db.visitors.filter((visitor) => visitor.id !== visitorId);
    localStorageManager.saveDB(db);
  },

  // Add similar functions for other data models (passes, zones, etc.)
};

export default localStorageManager;
