<template>
  <h1>Welcome!</h1>
  <li>
    <router-link style="font-size: 2rem; padding: 2rem" :to="{ name: 'today-orders' }">Today Order</router-link>
    <router-link style="font-size: 2rem; padding: 2rem" :to="{ name: 'drivers-orders' }">Drivers</router-link>
    <router-link style="font-size: 2rem; padding: 2rem" :to="{ name: 'z-report' }">Z Report</router-link>
    <router-link style="font-size: 2rem; padding: 2rem" :to="{ name: 'settings' }">Settings</router-link>
  </li>
</template>
