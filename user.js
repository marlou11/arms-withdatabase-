document.body.style.overflow = "auto"; // Ensure scrolling is enabled


// user
const firebaseConfig = {
    apiKey: "AIzaSyD3T9qUP4VGZ8LxYFOeC4TYdx-fWGAoAmg",
    authDomain: "arms-3738c.firebaseapp.com",
    databaseURL: "https://arms-3738c-default-rtdb.firebaseio.com",
    projectId: "arms-3738c",
    storageBucket: "arms-3738c.firebasestorage.app",
    messagingSenderId: "34962607229",
    appId: "1:34962607229:web:18d3fec62bf374226b3514",
    measurementId: "G-M5QVGQYXQJ"
};

  // initialize firebase
firebase.initializeApp(firebaseConfig);
  
  

const registrationFormDB = firebase.database().ref("registrationForm");
const toggleButton = document.getElementById('toggleSidebar');
const sidebar = document.getElementById('sidebar');
const adminContent = document.querySelector('.admin');

toggleButton.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    adminContent.classList.toggle('full-width');
});

let users = []; // We'll fetch users from Firebase

// Function to fetch users from Firebase
function fetchUsers() {
    return new Promise((resolve, reject) => {
        registrationFormDB.on("value", (snapshot) => {
            users = []; // Clear existing users array
            snapshot.forEach((childSnapshot) => {
                const user = childSnapshot.val();
                user.id = childSnapshot.key; // Get the Firebase key as the ID
                users.push(user);
            });
            resolve(users);
        }, reject);
    });
}


function renderTable(usersToRender = users) {
    const tableBody = document.querySelector('#userTable tbody');
    tableBody.innerHTML = '';

    usersToRender.forEach(user => {
        const farmLocation = user.farmLocation || ''; // Show empty if no input
        const contactNumber = user.contactNumber || ''; // Show empty if no input
        const barangay = user.barangay || ''; // Show empty if no input
        const farmSize = user.farmSize ? `${user.farmSize} hectares` : ''; // Show empty if no input
        const status = user.status || 'Pending'; // Show 'Pending' if no status

        const firstName = user.firstName || 'N/A';
        const middleInitial = user.middleInitial || ''; // Middle initial
        const lastName = user.lastName || 'N/A';
        const homeAddress = user.homeAddress || ''; // Home Address

        const row = document.createElement('tr');
        if (status === 'Pending') {
            row.style.backgroundColor = '#A7DCA5';
        }

        let checkboxOrDeleteIcon = '';
        
        if (status === 'Approved') {
            // Replace checkbox with Font Awesome delete icon if status is "Approved"
            checkboxOrDeleteIcon = `<button class="delete-icon" data-id="${user.id}"><i class="fas fa-trash-alt"></i></button>`;
        } else {
            // Show checkbox if status is not "Approved"
            checkboxOrDeleteIcon = `<input type="checkbox" class="userCheckbox" data-id="${user.id}" />`;
        }

        row.innerHTML = `
            <td>${checkboxOrDeleteIcon}</td>
            <td>${firstName} ${middleInitial ? middleInitial + '.' : ''} ${lastName}</td>
            <td>${user.rsbaNumber || 'N/A'}</td>
            <td>${farmLocation}</td>
            <td>${farmSize}</td>
            <td>
                ${barangay}<br/>
                ${homeAddress || 'N/A'}
            </td>
            <td>${contactNumber}</td>
            <td>${status}</td>
        `;

        tableBody.appendChild(row);
    });

    // Add event listener for delete icons
    document.querySelectorAll('.delete-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            const userId = this.dataset.id;
            confirmDeleteUser(userId);
        });
    });
}

function confirmDeleteUser(userId) {
    const confirmed = confirm('Are you sure you want to delete this user?');
    if (confirmed) {
        deleteUser(userId);
    }
}

function deleteUser(userId) {
    const userRef = registrationFormDB.child(userId);
    userRef.remove()
        .then(() => {
            fetchUsers().then(renderTable); // Refetch after deletion
            alert('User deleted successfully!');
        })
        .catch(error => {
            console.error("Error deleting user:", error);
            alert("An error occurred while deleting the user. Please try again later.");
        });
}





function approveUser(userId) {
    const userRef = registrationFormDB.child(userId);
        userRef.update({ status: 'Approved' })
            .then(() => {
            fetchUsers().then(renderTable); //Refetch after update
            })
        .catch(error => {
            console.error("Error approving user:", error);
            // Handle error appropriately (e.g., show an error message)
        });
    }

function approveSelected() {
    const checkboxes = document.querySelectorAll('.userCheckbox:checked');
    const userIdsToApprove = Array.from(checkboxes).map(checkbox => checkbox.dataset.id);

    if (userIdsToApprove.length === 10) {
        alert("Please select at least 10 user to approve.");
        return;
    }

    Promise.all(userIdsToApprove.map(userId => {
        const userRef = registrationFormDB.child(userId);
        return userRef.update({ status: 'Approved' });
    }))
        .then(() => {
            fetchUsers().then(renderTable);
            alert("Selected users approved successfully!");
        })
        .catch(error => {
            console.error("Error approving selected users:", error);
            alert("An error occurred while approving selected users. Please try again later.");
        });
}

function denyUser() {
    const checkboxes = document.querySelectorAll('.userCheckbox:checked');
    const userIdsToDeny = Array.from(checkboxes).map(checkbox => checkbox.dataset.id);

    if (userIdsToDeny.length === 0) {
      alert("Select user to deny.");
        return;
    }

    if (userIdsToDeny.length > 1) {
        alert("You can only deny one user at a time.");
        return;
    }

    const userId = userIdsToDeny[0]; // Get the ID of the selected user
    confirmDenyUser(userId); // Call the function to confirm denial
  }
  


function confirmDenyUser(userId) {
    userIdToDeny = userId;
    document.getElementById('denyModal').classList.add('show');
}

function denyConfirmed() {
    if (userIdToDeny !== null) {
        const userRef = registrationFormDB.child(userIdToDeny);
        userRef.remove()
            .then(() => {
                fetchUsers().then(renderTable);
            })
            .catch(error => {
                console.error("Error denying user:", error);
                // Handle error appropriately
            });
    }
    closeModal();
}

function closeModal() {
    document.getElementById('denyModal').classList.remove('show');
}


// Initial fetch of users
fetchUsers().then(renderTable);