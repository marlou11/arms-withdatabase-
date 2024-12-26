// Function to show Farmer login modal
function showFarmerLogin() {
  document.getElementById("farmerModal").style.display = "block";
}

// Function to show Admin login modal
function showAdminLogin() {
  document.getElementById("adminModal").style.display = "block";
}

// Function to close modals
function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}


// Firebase configuration
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


// ... (Firebase initialization and hashPassword function remain the same) ...

// Farmer login validation function
// ... (your existing code for Firebase initialization, database reference, etc.) ...

// Farmer login validation function
async function validateFarmerLogin() { 
  const rsbaNumber = document.getElementById("rsbaNumber").value;
  const farmerPassword = document.getElementById("farmerPassword").value;
  const errorMsg = document.getElementById("farmerErrorMsg");

  return new Promise((resolve, reject) => {
      registrationFormDB.orderByChild("rsbaNumber")
          .equalTo(rsbaNumber)
          .once("value", (snapshot) => {
              let user = null;
              snapshot.forEach(childSnapshot => {
                  const userData = childSnapshot.val();
                  if (userData.status === "Approved" && userData.password === farmerPassword) {
                      user = userData;
                  }
              });

              if (!user) {
                  reject("No matching RSBA number or account not approved.");
              } else if (user.password !== farmerPassword) {
                  reject("Incorrect password. Please try again.");
              } else {
                  resolve(true); // Resolve with true for successful authentication
              }
          })
          .catch(error => {
              reject("An error occurred during login. Please try again later.");
          });
  })
}

//Call validateFarmerLogin and handle the result
async function handleFarmerLogin() {
  const errorMsg = document.getElementById("farmerErrorMsg");
  errorMsg.textContent = ""; // Clear previous error messages

  try {
      const isAuthenticated = await validateFarmerLogin();
      if (isAuthenticated) { // Check if authentication was successful
          alert("Farmer login successful!");
          closeModal("farmerModal");
          window.location.href = 'farmersportal.html'; // Redirect to farmersportal.html
      } 
  } catch (error) {
      errorMsg.textContent = error;
  }
}

//Attach the handleFarmerLogin function to your login button
document.getElementById('farmerLoginButton').addEventListener('click', handleFarmerLogin); 

// Admin login validation function with temporary credentials
function validateAdminLogin() {
  const adminEmail = document.getElementById("adminEmail").value;
  const adminPassword = document.getElementById("adminPassword").value;
  const errorMsg = document.getElementById("adminErrorMsg");

  // Temporary email and password for testing
  const tempEmail = "admin@temporary.com";
  const tempPassword = "Tumampoc@2021308501";

  if (adminEmail !== tempEmail || adminPassword !== tempPassword) {
    errorMsg.textContent = "Incorrect email or password. Please try again.";
    return false;
  }

  alert("Login successful!");
  closeModal("adminModal");
  setTimeout(() => window.location.href = 'admin.html',);
}

// Close the modal if user clicks outside of it
window.onclick = function(event) {
  const farmerModal = document.getElementById("farmerModal");
  const adminModal = document.getElementById("adminModal");
  if (event.target == farmerModal) {
    closeModal("farmerModal");
  } else if (event.target == adminModal) {
    closeModal("adminModal");
  }
};