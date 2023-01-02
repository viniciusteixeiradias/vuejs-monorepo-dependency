<script lang="ts" setup>
import { usePreferenceStore } from '@/stores/preference';
import { OrderTypeFilter } from '@fjord/core/models/order';
import { storeToRefs } from 'pinia';

const props = defineProps<{
  modelValue: OrderTypeFilter;
  hideTable?: boolean;
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', value: OrderTypeFilter): void;
}>();

const emit = (value: OrderTypeFilter) => emits('update:modelValue', value);

const actionButtons: OrderTypeFilter[] = [
  OrderTypeFilter.ALL,
  OrderTypeFilter.WALK_IN,
  OrderTypeFilter.DELIVERY,
  OrderTypeFilter.COLLECTION
];

const { useTakeaway, useTables } = storeToRefs(usePreferenceStore());

if (useTables.value && !props.hideTable) {
  actionButtons.push(OrderTypeFilter.TABLE);
}
</script>

<template>
  <q-btn-group v-if="useTakeaway">
    <q-btn
      v-sound-click
      v-for="button in actionButtons"
      :key="button"
      :color="props.modelValue === button ? 'positive' : 'primary'"
      @click="emit(button)"
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
