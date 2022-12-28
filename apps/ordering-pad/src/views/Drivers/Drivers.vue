<script lang="ts" setup>
import { useRouter } from 'vue-router';
import assert from 'assert';

const { back } = useRouter();
</script>

<template>
  <h1>I am drivers</h1>
  <button @click="back">Back</button>
</template>
