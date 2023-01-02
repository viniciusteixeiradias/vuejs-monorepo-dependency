<script lang="ts" setup>
import { usePreferenceStore } from '@/stores/preference';

const { load } = usePreferenceStore();
load();
</script>

<template>
  <router-view />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: #333333;
  padding-block: 15px;
  height: 100vh;
}
</style>
