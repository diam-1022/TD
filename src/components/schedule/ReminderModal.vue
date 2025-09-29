<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <div class="p-6">
        <!-- 标题 -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">设置提醒</h3>
          <button 
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- 日程信息 -->
        <div class="mb-6 p-3 bg-gray-50 rounded-lg">
          <h4 class="font-medium text-gray-900">{{ schedule.title }}</h4>
          <p class="text-sm text-gray-600 mt-1">
            截止时间：{{ formatDateTime(schedule.deadline) }}
          </p>
        </div>

        <!-- 提醒选项 -->
        <div class="space-y-3 mb-6">
          <label class="flex items-center space-x-3 cursor-pointer">
            <input 
              type="radio" 
              v-model="selectedReminder" 
              value="1hour"
              class="w-4 h-4 text-blue-600"
            />
            <span class="text-sm text-gray-700">提前 1 小时</span>
          </label>
          
          <label class="flex items-center space-x-3 cursor-pointer">
            <input 
              type="radio" 
              v-model="selectedReminder" 
              value="1day"
              class="w-4 h-4 text-blue-600"
            />
            <span class="text-sm text-gray-700">提前 1 天</span>
          </label>
          
          <label class="flex items-center space-x-3 cursor-pointer">
            <input 
              type="radio" 
              v-model="selectedReminder" 
              value="3days"
              class="w-4 h-4 text-blue-600"
            />
            <span class="text-sm text-gray-700">提前 3 天</span>
          </label>
          
          <label class="flex items-center space-x-3 cursor-pointer">
            <input 
              type="radio" 
              v-model="selectedReminder" 
              value="custom"
              class="w-4 h-4 text-blue-600"
            />
            <span class="text-sm text-gray-700">自定义时间</span>
          </label>
        </div>

        <!-- 自定义时间选择 -->
        <div v-if="selectedReminder === 'custom'" class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            提前提醒时间
          </label>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-gray-600 mb-1">天数</label>
              <Input 
                v-model.number="customDays"
                type="number"
                min="0"
                placeholder="0"
                class="text-sm"
              />
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1">小时</label>
              <Input 
                v-model.number="customHours"
                type="number"
                min="0"
                max="23"
                placeholder="0"
                class="text-sm"
              />
            </div>
          </div>
        </div>

        <!-- 提醒预览 -->
        <div class="mb-6 p-3 bg-blue-50 rounded-lg">
          <h5 class="text-sm font-medium text-blue-900 mb-1">提醒时间预览</h5>
          <p class="text-sm text-blue-700">
            {{ getReminderPreview() }}
          </p>
        </div>

        <!-- 按钮 -->
        <div class="flex justify-end space-x-3">
          <Button 
            variant="outline" 
            @click="$emit('close')"
          >
            取消
          </Button>
          <Button 
            @click="saveReminder"
            :disabled="!isValidReminder"
          >
            保存提醒
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { X } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'

const props = defineProps({
  schedule: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

const selectedReminder = ref('1day')
const customDays = ref(0)
const customHours = ref(0)

const isValidReminder = computed(() => {
  if (selectedReminder.value === 'custom') {
    return customDays.value > 0 || customHours.value > 0
  }
  return true
})

const formatDateTime = (date) => {
  return new Date(date).toLocaleString('zh-CN')
}

const getReminderPreview = () => {
  const deadline = new Date(props.schedule.deadline)
  let reminderTime
  
  switch (selectedReminder.value) {
    case '1hour':
      reminderTime = new Date(deadline.getTime() - 60 * 60 * 1000)
      break
    case '1day':
      reminderTime = new Date(deadline.getTime() - 24 * 60 * 60 * 1000)
      break
    case '3days':
      reminderTime = new Date(deadline.getTime() - 3 * 24 * 60 * 60 * 1000)
      break
    case 'custom':
      const totalHours = (customDays.value * 24) + customHours.value
      reminderTime = new Date(deadline.getTime() - totalHours * 60 * 60 * 1000)
      break
    default:
      reminderTime = deadline
  }
  
  return formatDateTime(reminderTime)
}

const saveReminder = () => {
  if (!isValidReminder.value) return
  
  const reminderData = {
    scheduleId: props.schedule.id,
    type: selectedReminder.value,
    customDays: selectedReminder.value === 'custom' ? customDays.value : 0,
    customHours: selectedReminder.value === 'custom' ? customHours.value : 0,
    reminderTime: getReminderPreview()
  }
  
  emit('save', reminderData)
}
</script>
