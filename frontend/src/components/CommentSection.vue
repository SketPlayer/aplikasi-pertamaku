<script setup>
import { ref } from 'vue';
import DOMPurify from 'dompurify';  // Import DOMPurify

const comment = ref('');
const comments = ref('');

const submitComment = () => {
  comments.value += `<p>${DOMPurify.sanitize(comment.value)}</p>`;  // Sanitize input
  comment.value = '';
};
</script>

<template>
  <div>
    <h3>Comments</h3>
    <input v-model="comment" placeholder="Leave a comment" />
    <button @click="submitComment">Submit</button>
    <div v-html="comments"></div>
  </div>
</template>
