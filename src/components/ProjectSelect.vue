<template>
  <div class="custom-label">{{ label }}</div>
  <ion-item lines="none" class="select-item">
    <ion-select
      :value="localValue"
      @ionChange="onSelectChange"
      interface="popover"
      :placeholder="placeholder"
      class="select-inner"
      :disabled="disabled"
    >
      <ion-select-option
        v-for="(option, index) in options"
        :key="index"
        :value="option.value"
      >
        {{ option.label }}
      </ion-select-option>
    </ion-select>
  </ion-item>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { IonSelect, IonSelectOption, IonItem } from '@ionic/vue'

const props = defineProps({
  modelValue: String,
  options: {
    type: Array as () => { label: string; value: string }[],
    required: true
  },
  placeholder: String,
  label: String,
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const localValue = ref(props.modelValue)

watch(() => props.modelValue, val => {
  localValue.value = val
})

function onSelectChange(event: CustomEvent) {
  const newVal = event.detail.value
  localValue.value = newVal
  emit('update:modelValue', newVal)
}
</script>
<style>
.select-item {
  --padding-start: 0;
  --inner-padding-start: 0;
  --inner-padding-end: 0;
  --background: transparent;
  margin-left: 0;
  width: 100%;
}

.select-inner {
  width: 100%;
  text-align: left;
}

</style>