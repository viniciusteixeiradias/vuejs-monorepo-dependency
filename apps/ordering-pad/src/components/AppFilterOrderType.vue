<script lang="ts" setup>
import { OrderTypeFilter } from '@fjord/core/src/models/order';
import { computed } from 'vue';

const props = defineProps<{
  modelValue: OrderTypeFilter;
  hideTable?: boolean;
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', value: OrderTypeFilter): void;
}>();

// const { useTables, useTakeaway } = useGetters<PreferenceGetters>('preference');
const useTables = true, useTakeaway = true;

const orderType = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits('update:modelValue', value);
  }
});

const actionButtons: OrderTypeFilter[] = [
  OrderTypeFilter.ALL,
  OrderTypeFilter.WALK_IN,
  OrderTypeFilter.DELIVERY,
  OrderTypeFilter.COLLECTION
];

if (useTables && !props.hideTable) {
  actionButtons.push(
    OrderTypeFilter.TABLE
  );
}
</script>

<template>
  <q-btn-group v-if="useTakeaway">
    <q-btn
      v-for="button in actionButtons"
      :key="button"
      :color="orderType === button ? 'positive' : 'primary'"
      @click="orderType = button"
    >
      {{ button }}
    </q-btn>
  </q-btn-group>
</template>

<style lang="scss" scoped>
.q-btn {
  text-transform: capitalize;
}
</style>
