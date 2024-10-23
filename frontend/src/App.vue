<script setup>
import { ref } from 'vue';
import CommentSection from './components/CommentSection.vue';

const userId = ref('');
const users = ref(null);
const newEmail = ref('');
const csrfToken = ref('');  // Declare csrfToken here

// Function to get user info and store CSRF token
const getUser = async () => {
  const response = await fetch(`http://20.5.130.115:3000/api/user/${userId.value}`);
  const data = await response.json();
  users.value = data.users;  // Assign the users array
  csrfToken.value = data.csrfToken;  // Store the CSRF token
};

// Function to get CSRF token from cookies (you might not need this if you're passing the token from the server)
function getCSRFToken() {
  const name = 'csrf-token=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArr = decodedCookie.split(';');
  for (let i = 0; i < cookieArr.length; i++) {
    let cookie = cookieArr[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return '';
}

// Function to change email, including CSRF token in the request header
const changeEmail = async () => {
  const token = csrfToken.value || getCSRFToken();  // Use the csrfToken ref or get it from cookies
  await fetch(`http://20.5.130.115:3000/api/user/${userId.value}/change-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'CSRF-Token': token,  // Include the CSRF token in headers
    },
    body: `email=${newEmail.value}`,
    credentials: 'include', // Include cookies in the request
  });
};
</script>

<template>
  <div id="app">
    <h1>User Dashboard</h1>
    <div>
      <input v-model="userId" placeholder="Enter User ID" />
      <button @click="getUser">Get User Info</button>
    </div>
    <div v-if="users">
      <template v-for="user in users" :key="user.id">
        <h2>{{ user.name }}</h2>
        <p>Email: {{ user.email }}</p>
        <hr />
      </template>
    </div>
    <CommentSection />
    <form @submit.prevent="changeEmail">
      <h3>Change Email</h3>
      <input v-model="newEmail" placeholder="New Email" />
      <button type="submit">Submit</button>
    </form>
  </div>
</template>
