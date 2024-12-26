 
 let currentPage = 1;

 function goToNextPage(pageNumber) {
     document.getElementById('page' + currentPage).classList.remove('active');
     document.getElementById('page' + pageNumber).classList.add('active');
     currentPage = pageNumber;
 }

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

// reference your database
var registrationFormDB = firebase.database().ref("registrationForm");

document.getElementById("registrationForm").addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();

  var firstName = getElementVal('firstName').trim(); //Added trim
  var middleInitial = getElementVal('middleInitial').trim(); //Added trim
  var lastName = getElementVal('lastName').trim(); //Added trim
  var rsbaNumber = getElementVal('rsbaNumber').trim(); //Added trim
  var contactNumber = getElementVal('contactNumber').trim(); //Added trim
  var barangay = getElementVal('barangay').trim(); //Added trim
  var homeAddress = getElementVal('homeAddress').trim(); //Added trim
  var farmSize = getElementVal('farmSize').trim(); //Added trim
  var farmLocation = getElementVal('farmLocation').trim(); //Added trim
  var password = getElementVal('password').trim(); //Added trim
  var confirmPassword = getElementVal('confirmPassword').trim(); //Added trim and get confirmPassword


  //Improved empty field check using strict equality and length check
  if (!firstName || !lastName || !rsbaNumber || !contactNumber || !barangay || !homeAddress || !farmSize || !farmLocation || !password || !confirmPassword ||
      firstName.length === 0 || lastName.length === 0 || rsbaNumber.length === 0 || contactNumber.length === 0 || barangay.length === 0 || homeAddress.length === 0 || farmSize.length === 0 || farmLocation.length === 0 || password.length === 0 || confirmPassword.length === 0) {
      alert("Please fill in all fields.");
      return;
  }

  // Check if passwords match
  if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
  }

  // Validate password strength (at least 8 characters, 1 letter, and 1 number)
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  if (!password.match(passwordRegex)) {
      alert("Password must be at least 8 characters long, contain at least one letter and one number.");
      return;
  }

  // Hash the password before saving (replace with a strong hashing library like bcrypt)
  const hashedPassword = password; // **REPLACE THIS WITH A PROPER HASHING FUNCTION**

  // Create a new user object
  const newUser = {
      id: new Date().getTime(),
      firstName,
      middleInitial,
      lastName,
      rsbaNumber,
      contactNumber,
      barangay,
      homeAddress,
      farmSize,
      farmLocation,
      password: hashedPassword, // Store the hashed password
      status: "Pending"
  };

  saveMessages(newUser)
      .then(() => {
          alert("Registration successful!");
          window.location.href = "index.html"; // Redirect after successful save
      })
      .catch(error => {
          alert("Error during registration: " + error.message);
      });
}

const saveMessages = (newUser) => {
  return registrationFormDB.push().set(newUser);
};

const getElementVal = (id) => {
  return document.getElementById(id).value;
};



