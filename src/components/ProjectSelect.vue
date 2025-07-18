<template>
    <ion-item>
      <ion-label>Project</ion-label>
      <ion-select
        v-model="localValue"
        interface="popover"
        :placeholder="placeholder"
      >
        <ion-select-option
          v-for="(option, index) in options"
          :key="index"
          :value="option"
        >
          {{ option }}
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
    type: Array as () => string[],
    required: true
  },
  placeholder: {
    type: String,
    default: '请选择项目'
  }
})

const emit = defineEmits(['update:modelValue'])

const localValue = ref(props.modelValue)

// 监听父组件更新 → 同步到本地变量
watch(() => props.modelValue, (val) => {
  localValue.value = val
})

// 监听本地变量变动 → 触发更新到父组件
watch(localValue, (val) => {
  emit('update:modelValue', val)
})
</script>


