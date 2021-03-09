// create variable to hold db connection
let db;
// establish a connection to IndexedDB database called 'budget-tracker' and set it to version 1.  
//Two parameters The name of the IndexedDB database you'd like to create (if it doesn't exist) or connect to (if it does exist).
//The version of the database. By default, we start it at 1. This parameter is used to determine whether the database's structure has changed between connections.
const request = indexedDB.open("budget-tracker", 1);

// this event will emit if the database version changes (non-existent to version 1, v1 to v2, etc.)
request.onupgradeneeded = function (event) {
  // save a reference to the database
  const db = event.target.result;
  // create an object store (table) called `new-budget`, set it to have an auto incrementing primary key of sorts
  db.createObjectStore("new-budget", { autoIncrement: true });
};

// upon a successful
request.onsuccess = function (event) {
  // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
  db = event.target.result;
  // check if app is online, if yes run uploadTransaction() function to send all local db data to api
  if (navigator.onLine) {
    // we haven't created this yet, but we will soon
    // uploadBankTransaction();
  }
};
request.onerror = function (event) {
  // log error here
  console.log(event.target.errorCode);
};

//This function is executed when submitting transaction while offline
function saveRecord(record) {
  //open a new transaction with the database with read and write permissions
  const transaction = db.transaction(['new_transaction'], 'readwrite');

  //access the object store for `new_transaction`
  const transactionObjectStore = transaction.objectStore('new_transaction');

  //add record to your store with add method
  transactionObjectStore.add(record);
}

