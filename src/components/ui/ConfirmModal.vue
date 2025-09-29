<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <div class="p-6">
        <!-- 标题 -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
          <button 
            @click="$emit('cancel')"
            class="text-gray-400 hover:text-gray-600"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- 消息内容 -->
        <div class="mb-6">
          <p class="text-gray-700">{{ message }}</p>
        </div>

        <!-- 按钮 -->
        <div class="flex justify-end space-x-3">
          <Button 
            variant="outline" 
            @click="$emit('cancel')"
          >
            取消
          </Button>
          <Button 
            variant="destructive"
            @click="$emit('confirm')"
          >
            确认
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { X } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'

defineProps({
  title: {
    type: String,
    default: '确认操作'
  },
  message: {
    type: String,
    required: true
  }
})

defineEmits(['confirm', 'cancel'])
</script>
