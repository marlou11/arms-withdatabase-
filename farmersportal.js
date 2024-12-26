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
    // Initialize Firebase (make sure firebaseConfig is already defined)
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    const auth = firebase.auth();

      // Load user profile info
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const latestUser = users.length > 0 ? users[users.length - 1] : null;
  
      // Debugging: Check if user data is loaded correctly
      console.log(latestUser);
  
      // If a user exists, display their details
  if (latestUser) {
      document.getElementById('displayFirstName').innerText = `Welcome, ${latestUser.firstName}`;
      document.getElementById('firstName').innerText = latestUser.firstName;
      document.getElementById('lastName').innerText = latestUser.lastName;
      document.getElementById('rsbaNumber').innerText = latestUser.rsbaNumber;
      document.getElementById('contactNumber').innerText = latestUser.contactNumber;
      document.getElementById('barangay').innerText = latestUser.barangay;
      document.getElementById('farmLocation').innerText = latestUser.farmLocation;
      document.getElementById('farmSize').innerText = latestUser.farmSize;
      document.getElementById('status').innerText = latestUser.status;
  } else {
      // In case there's no user data
      console.log("No user found in localStorage");
      document.getElementById('displayFirstName').innerText = "Welcome, Guest!";
  }

  
      function uploadProfilePicture() {
          const input = document.getElementById('profilePictureInput');
          if (input.files && input.files[0]) {
              const reader = new FileReader();
              reader.onload = function (e) {
                  localStorage.setItem(`profilePicture-${latestUser.userId}`, e.target.result);
                  document.getElementById('profilePictureDisplay').innerHTML = `<img src="${e.target.result}" alt="Profile Picture" width="120" height="120">`;
              };
              reader.readAsDataURL(input.files[0]);
          }
      }
  
      function addActivity() {
          const activityType = document.getElementById('activityType').value;
          const activityImageInput = document.getElementById('activityImageInput');
          const activityCaption = document.getElementById('activityCaption').value;
          const userName = latestUser ? latestUser.firstName : 'Unknown User';
          const barangay = latestUser ? latestUser.barangay : 'Unknown Barangay'; // Get Barangay
  
          if (activityImageInput.files && activityImageInput.files[0]) {
              const reader = new FileReader();
              reader.onload = function (e) {
                  const activity = {
                  userId: latestUser.userId, // Add userId to differentiate activities
                  userName: userName,
                  activityType: activityType,
                  image: e.target.result,
                  caption: activityCaption,
                  timestamp: new Date().toLocaleString(),
                  barangay: barangay, // Store Barangay along with activity
                  rsbaNumber: latestUser.rsbaNumber // Store RSBA number in activity object
              };
  
                  // Store activities for the Barangay, categorized by Activity Type
                  let activitiesByBarangay = JSON.parse(localStorage.getItem(`activitiesByBarangay-${barangay}`)) || {};
                  if (!activitiesByBarangay[activityType]) {
                      activitiesByBarangay[activityType] = [];
                  }
                  activitiesByBarangay[activityType].push(activity);
  
                  // Save the updated activities back to localStorage
                  localStorage.setItem(`activitiesByBarangay-${barangay}`, JSON.stringify(activitiesByBarangay));
  
                  // Save activity in user's activities
                  let userActivities = JSON.parse(localStorage.getItem(`activities-${latestUser.userId}`)) || [];
                  userActivities.push(activity);
                  localStorage.setItem(`activities-${latestUser.userId}`, JSON.stringify(userActivities));
  
                  // Display Activities in Feed and Timeline
                  displayActivities();
                  updateTimeline();
              };
              reader.readAsDataURL(activityImageInput.files[0]);
          }
      }
  
      // Display all activities for the current user
      function displayActivities() {
          const activities = JSON.parse(localStorage.getItem(`activities-${latestUser.userId}`)) || [];
          const activityFeed = document.getElementById('activityFeed');
          activityFeed.innerHTML = activities.map((activity, index) => `
              <div class="activity-item">
                  <h3>${activity.userName} - ${activity.activityType}</h3>
                  <img src="${activity.image}" alt="Activity Image" onclick="openModal('${activity.image}')">
                  <p>${activity.caption}</p>
                  <span>${activity.timestamp}</span>
                  <div>
                   
                      <button class="button delete-button" onclick="deleteActivity(${index})">Delete</button>
                  </div>
              </div>
          `).join('');
      }
  
      // Update the activity timeline for the user
function updateTimeline() {
  const activities = JSON.parse(localStorage.getItem(`activities-${latestUser.userId}`)) || [];
  const timeline = document.getElementById('timeline');

  timeline.innerHTML = activities.map((activity, index) => `
      <div class="timeline-item" onclick="saveRSBANumber('${latestUser.rsbaNumber}')">
          <div class="timeline-date">${activity.timestamp}</div>
          <div class="timeline-content">
              <h4>${activity.activityType}</h4>  <!-- Display Activity Type -->
              <p>${activity.caption}</p>         <!-- Display Caption -->
              <p><strong>RSBA Number:</strong> ${latestUser.rsbaNumber}</p>  <!-- Display RSBA Number -->
              <span class="timestamp">${activity.timestamp}</span>  <!-- Display Timestamp -->
          </div>
      </div>
  `).join('');
}

// Function to save RSBA number in localStorage
function saveRSBANumber(rsbaNumber) {
  // Store the RSBA number in localStorage
  localStorage.setItem('selectedRSBANumber', rsbaNumber);

  // Redirect to another page where the RSBA number will be fetched
  
}


      // Open modal for full-screen image
      function openModal(imageSrc) {
          const modal = document.getElementById('imageModal');
          const modalImage = document.getElementById('modalImage');
          modal.style.display = "flex";
          modalImage.src = imageSrc;
      }
  
      // Close modal
      function closeModal() {
          const modal = document.getElementById('imageModal');
          modal.style.display = "none";
      }
  
      // Edit Activity
      function editActivity(index) {
          const activities = JSON.parse(localStorage.getItem(`activities-${latestUser.userId}`)) || [];
          const activity = activities[index];
          
          // Pre-fill the current details
          document.getElementById('editActivityCaption').value = activity.caption;
          
          // Optionally, show the current image in the edit modal
          document.getElementById('editModalImage').src = activity.image;
          
          // Show the edit modal
          document.getElementById('editModal').style.display = 'block';
          document.getElementById('editModal').dataset.index = index;
      }
  
      function saveEdit() {
          const index = document.getElementById('editModal').dataset.index;
          const newCaption = document.getElementById('editActivityCaption').value;
          const activities = JSON.parse(localStorage.getItem(`activities-${latestUser.userId}`)) || [];
          
          // If image is updated, handle that (optional step)
          const updatedImage = document.getElementById('editModalImage').src; // Assuming you're editing the image as well
          
          activities[index].caption = newCaption;
          activities[index].image = updatedImage;  // Update the image if changed
  
          localStorage.setItem(`activities-${latestUser.userId}`, JSON.stringify(activities));
          
          displayActivities();
          updateTimeline();
          closeEditModal();
      }
  
      // Close Edit Modal
      function closeEditModal() {
          document.getElementById('editModal').style.display = 'none';
      }
  
      // Delete an activity
      function deleteActivity(index) {
          const activities = JSON.parse(localStorage.getItem(`activities-${latestUser.userId}`)) || [];
          activities.splice(index, 1);
          localStorage.setItem(`activities-${latestUser.userId}`, JSON.stringify(activities));
  
          displayActivities();
          updateTimeline();
      }
  
      // Load activities for the current user on page load
      displayActivities();
      updateTimeline();