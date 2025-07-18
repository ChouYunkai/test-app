<template>
  <div class="custom-label">{{ label }}</div>
  <ion-item class="select-item" lines="none">
    <ion-select
      v-model="localValue"
      interface="popover"
      :placeholder="placeholder"
      class="select-inner"
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

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  options: {
    type: Array as () => { label: string, value: string }[],
    required: true
  },
  placeholder: {
    type: String,
    default: '请选择项目'
  },
  label: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const localValue = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  localValue.value = val
})

watch(localValue, (val) => {
  console.log('emit value', val)  // 加入调试输出
  emit('update:modelValue', val)
})
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