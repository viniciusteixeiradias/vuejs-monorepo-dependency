<script lang="ts" setup>
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: number
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>()

const val = ref(props.modelValue);

watch(() => props.modelValue, (newVal) => {
  val.value = newVal;
})

watch(() => val.value, () => {
  String(val.value) === ""
    ? emits('update:modelValue', 0)
    : emits('update:modelValue', val.value);
})

const decreasing = () => {
  val.value > 0
    ? emits('update:modelValue', --val.value)
    : emits('update:modelValue', 0);

}
const increment = () => {
  val.value >= 0
    ? emits('update:modelValue', ++val.value)
    : emits('update:modelValue', Math.abs(val.value) + 1);
}
</script>

<template>
  <div class="input-number">
    <q-btn
      label="-"
      color="primary"
      @click="decreasing"
    />
    <q-input
      v-model.number="val"
      v-bind="$attrs"
      type="number"
      filled
      dense
    />
    <q-btn
      label="+"
      color="primary"
      @click="increment"
    />
  </div>
</template>

<style lang="scss" scoped>
.input-number {
  display: flex;
}

.q-btn {
  width: 40px;
}

:deep() {
  input[type="number"]::-webkit-outer-spin-button, input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;

  }

  input[type="number"] {
    -moz-appearance: textfield;
  }
}
</style>
