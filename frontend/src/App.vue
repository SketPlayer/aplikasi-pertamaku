<script setup>
import { ref } from 'vue';
import CommentSection from './components/CommentSection.vue';

const userId = ref('');
const users = ref(null);
const newEmail = ref('');
const errorMessage = ref(''); // Add error message ref

const getUser = async () => {
  if (!userId.value || isNaN(userId.value)) {
    errorMessage.value = "Please enter a valid User ID.";
    return;
  }
  errorMessage.value = ''; // Clear error if input is valid
  const response = await fetch(`https://20.5.130.115:3000/api/user/${userId.value}`);
  users.value = await response.json();
};

const changeEmail = async () => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex pattern
  if (!emailPattern.test(newEmail.value)) {
    errorMessage.value = "Please enter a valid email address.";
    return;
  }
  errorMessage.value = ''; // Clear error if input is valid
  await fetch(`https://20.5.130.115:3000/api/user/${userId.value}/change-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `email=${newEmail.value}`,
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
    <div v-if="errorMessage">{{ errorMessage }}</div> <!-- Show error message -->
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
