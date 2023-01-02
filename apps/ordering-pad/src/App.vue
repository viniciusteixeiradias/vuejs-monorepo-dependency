<script lang="ts" setup>
import { usePreferenceStore } from '@/stores/preference';

const { load } = usePreferenceStore();
load();
</script>

<template>
  <span>Ordering Pad</span>
  <router-view />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  padding-block: 15px;
  height: 100vh;
}
</style>
