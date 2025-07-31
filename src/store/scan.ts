import { defineStore } from 'pinia';

export const useScanStore = defineStore('scan', {
  state: () => ({
    result: '' as string, // 扫码结果
  }),
  actions: {
    setScanResult(content: string) {
      this.result = content;
    },
    clearResult() {
      this.result = '';
    },
  },
});
