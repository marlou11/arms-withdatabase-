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

  
  
firebase.initializeApp(firebaseConfig);
const registrationFormDB = firebase.database().ref("registrationForm"); // Adjust path if needed


let approvedUsers = [];

// Function to fetch approved users from Firebase
function fetchApprovedUsers() {
    return new Promise((resolve, reject) => {
        registrationFormDB.orderByChild("status")
            .equalTo("Approved")
            .once("value", (snapshot) => {
                approvedUsers = [];
                snapshot.forEach(childSnapshot => {
                    const user = childSnapshot.val();
                    user.id = childSnapshot.key;
                    approvedUsers.push(user);
                });
                resolve(approvedUsers);
            }, reject);
    });
}

// Function to populate the approved users table
function populateApprovedUsers() {
    const approvedUsersBody = document.getElementById('approvedUsersBody');
    approvedUsersBody.innerHTML = ''; // Clear the table

    fetchApprovedUsers()
        .then(users => {
            if (users.length === 0) {
                approvedUsersBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No approved users</td></tr>';
                return;
            }
            renderApprovedUsersTable(users); //Call a separate function for rendering
            updateBarangayCounts();
        })
        .catch(error => {
            console.error("Error fetching approved users:", error);
            approvedUsersBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Error loading data</td></tr>';
        });
}

//Separate function to render the table
function renderApprovedUsersTable(users) {
    const approvedUsersBody = document.getElementById('approvedUsersBody');
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.rsbaNumber}</td>
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.homeAddress}</td>
            <td>${user.contactNumber}</td>
            <td>${user.farmLocation}</td>
            <td>${user.farmSize}</td>
        `;
        approvedUsersBody.appendChild(row);
    });
}

// Function to update Barangay counts 
function updateBarangayCounts() {
    const barangayCounts = {};
    approvedUsers.forEach(user => {
        if (!barangayCounts[user.barangay]) {
            barangayCounts[user.barangay] = 0;
        }
        barangayCounts[user.barangay]++;
    });
    const barangayElements = document.querySelectorAll('.barangay');
    barangayElements.forEach(element => {
        const barangayName = element.textContent.split(' ')[0].trim();

        const count = barangayCounts[barangayName] || 0;
        element.textContent = `${barangayName} (${count})`;
    });
}

// Function to display records for a specific barangay 
function showBarangayRecords(barangay) {
    const filteredUsers = approvedUsers.filter(user => user.barangay === barangay);
    

     // Generate table HTML for the selected barangay
     let tableHTML = `
     <h2>Approved Users in ${barangay}</h2>
     <table> 
         <thead>
             <tr>
                 <th>RSBA Number</th>
                 <th>Name</th>
                 <th>Barangay / Home Address</th>
                 <th>Phone</th>
                 <th>Farm Location</th>
                 <th>Farm Size</th>
             </tr>
         </thead>
         <tbody>
 `;

 // Add user rows to the table
 filteredUsers.forEach(user => {
     tableHTML += `
         <tr>
             <td>${user.rsbaNumber}</td>
             <td>${user.firstName} ${user.lastName}</td>
             <td>${user.homeAddress}</td>
             <td>${user.contactNumber}</td>
             <td>${user.farmLocation}</td>
             <td>${user.farmSize}</td>
         </tr>
     `;
 });

 tableHTML += '</tbody></table>';

  // Inject the generated table into the page
  document.getElementById('tableContainer').innerHTML = tableHTML;

}

 // Toggle Barangay Container visibility when clicking on "Farmers"
 document.getElementById('farmersMenu').addEventListener('click', function () {
    this.classList.toggle('active');
});

// Filter approved users based on search query
function filterApprovedUsers() {
    const searchTerm = document.getElementById('searchBar').value.toLowerCase();
    const filteredUsers = approvedUsers.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.rsbaNumber.toLowerCase().includes(searchTerm) ||
        user.barangay.toLowerCase().includes(searchTerm) ||
        user.farmLocation.toLowerCase().includes(searchTerm) ||
        user.farmSize.toLowerCase().includes(searchTerm)
    );

    const approvedUsersBody = document.getElementById('approvedUsersBody');
    approvedUsersBody.innerHTML = '';

    if (filteredUsers.length === 0) {
        approvedUsersBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No matching users</td></tr>';
        return;
    }

    filteredUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.rsbaNumber}</td>
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.homeAddress}</td> <!-- Display home address in Barangay column -->
            <td>${user.contactNumber}</td>
            <td>${user.farmLocation}</td>
            <td>${user.farmSize}</td>
        `;
        approvedUsersBody.appendChild(row);
    });

    // Update Barangay Counts after filtering
    updateBarangayCounts();
}

        // Open the "Add New Account" modal
        function openAddAccountModal() {
            console.log('Opening Modal');
            document.getElementById('addAccountModal').classList.add('show');
        }

        // Close the "Add New Account" modal
        function closeAddAccountModal() {
            console.log('Closing Modal');
            document.getElementById('addAccountModal').classList.remove('show');
        }


        // Open the "Add New Account" modal
        function openAddAccountModal() {
            console.log('Opening Modal');
            document.getElementById('addAccountModal').classList.add('show');
        }

        // Close the "Add New Account" modal
        function closeAddAccountModal() {
            console.log('Closing Modal');
            document.getElementById('addAccountModal').classList.remove('show');
        }


// Function to handle the form submission
document.getElementById('addAccountForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting the default way

    // Get form values
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const rsbaNumber = document.getElementById('rsbaNumber').value;
    const contactNumber = document.getElementById('contactNumber').value;
    const homeAddress = document.getElementById('homeAddress').value;
    const farmLocation = document.getElementById('farmLocation').value;
    const farmSize = document.getElementById('farmSize').value;
    const barangay = document.getElementById('barangay').value;
    const password = document.getElementById('password').value;
    
    // Create a new user object
    const newUser = {
        id: Date.now(),  // Use timestamp as a unique ID
        firstName,
        lastName,
        rsbaNumber,
        contactNumber,
        homeAddress,
        farmLocation,
        farmSize,
        barangay,
        password,
        status: 'Approved' // Automatically set status to 'Approved'
    };


    registrationFormDB.push().set(newUser)
        .then(() => {
            populateApprovedUsers();
            updateBarangayCounts();
            closeAddAccountModal();
            alert("New farmer account added successfully!");
        })
        .catch(error => {
            console.error("Error adding new user:", error);
            alert("An error occurred while adding the new user. Please try again later.");
        });

        document.getElementById('toggleSidebar').addEventListener('click', function() {
            const sidebar = document.getElementById('sidebar');
            sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
        });
});


//Initial fetch
window.onload = populateApprovedUsers;