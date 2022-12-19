<script lang="ts" setup>
import { reactive } from 'vue';
import { Order } from '../models/order';

interface State {
  order: Order
}

const state = reactive<State>({
  order: {
    uuid: '',
    clientUuid: '',
    value: 0
  }
})

const increment = () => state.order.value++;
</script>

<template>
  <h1>Today Order</h1>
  <button type="button" @click="increment">Increment</button>
  {{ state.order }}
</template>
