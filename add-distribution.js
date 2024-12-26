// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD3T9qUP4VGZ8LxYFOeC4TYdx-fWGAoAmg",
    authDomain: "arms-3738c.firebaseapp.com",
    databaseURL: "https://arms-3738c-default-rtdb.firebaseio.com",
    projectId: "arms-3738c",
    storageBucket: "arms-3738c.appspot.com",
    messagingSenderId: "34962607229",
    appId: "1:34962607229:web:18d3fec62bf374226b3514",
    measurementId: "G-M5QVGQYXQJ"
};

firebase.initializeApp(firebaseConfig);

// References to Firebase Realtime Database
const db = firebase.database();
const distributionBatchesRef = db.ref('distributionBatches');
const distributionHistoryRef = db.ref('distributionHistory');
const usersRef = db.ref('users');

distributionBatchesRef.once('value', (snapshot) => {
    distributionBatches = snapshot.val() || [];
    console.log('Fetched distribution batches:', distributionBatches);
});

distributionHistoryRef.once('value', (snapshot) => {
    distributionHistory = snapshot.val() || [];
    console.log('Fetched distribution history:', distributionHistory);
});

usersRef.once('value', (snapshot) => {
    users = snapshot.val() || [];
    approvedUsers = users.filter(user => user.status === 'Approved');
    console.log('Fetched users:', users);
});


function createNewBatch(event) {
    event.preventDefault(); // Prevent form from submitting normally

    const batchName = document.getElementById('batchName').value;
    const batchNumber = document.getElementById('batchNumber').value;
    const totalQuantity = parseInt(document.getElementById('totalQuantity').value);

    // Validation check
    if (!batchName || !batchNumber || isNaN(totalQuantity) || totalQuantity <= 0) {
        alert('Please fill out all fields with valid data!');
        return;
    }

    // Create a unique batch ID (e.g., based on timestamp)
    const batchId = 'BATCH-' + Date.now();

    const newBatch = {
        batchId: batchId,
        batchName: batchName,
        batchNumber: batchNumber,
        totalQuantity: totalQuantity,
        remainingQuantity: totalQuantity,
        createdAt: new Date().toISOString(),
        distributions: [] // Empty list for distributions
    };

    // Save the new batch to Firebase Realtime Database
    distributionBatchesRef.child(batchId).set(newBatch)
        .then(() => {
            console.log('Batch successfully created:', newBatch);
            closeBatchModal(); // Close the modal after creating the batch
            displayBatches();  // Update the batch display
        })
        .catch(error => {
            console.error('Error creating batch:', error);
            alert('An error occurred while creating the batch.');
        });
}
