<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <div 
      v-for="notification in notifications" 
      :key="notification.id"
      class="bg-white rounded-lg shadow-lg border-l-4 p-4 max-w-sm"
      :class="getNotificationClass(notification.type)"
    >
      <div class="flex items-start justify-between">
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <Bell v-if="notification.type === 'reminder'" class="w-5 h-5" :class="getIconClass(notification.type)" />
            <AlertTriangle v-else-if="notification.type === 'urgent'" class="w-5 h-5" :class="getIconClass(notification.type)" />
            <CheckCircle v-else class="w-5 h-5" :class="getIconClass(notification.type)" />
          </div>
          <div class="flex-1">
            <h4 class="text-sm font-medium text-gray-900">{{ notification.title }}</h4>
            <p class="text-sm text-gray-600 mt-1">{{ notification.message }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ formatTime(notification.timestamp) }}</p>
          </div>
        </div>
        <button 
          @click="removeNotification(notification.id)"
          class="flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Bell, AlertTriangle, CheckCircle, X } from 'lucide-vue-next'

const notifications = ref([])
let notificationId = 0

// 通知类型样式
const getNotificationClass = (type) => {
  const classes = {
    'reminder': 'border-blue-500',
    'urgent': 'border-red-500',
    'success': 'border-green-500',
    'info': 'border-blue-500'
  }
  return classes[type] || 'border-gray-500'
}

const getIconClass = (type) => {
  const classes = {
    'reminder': 'text-blue-500',
    'urgent': 'text-red-500',
    'success': 'text-green-500',
    'info': 'text-blue-500'
  }
  return classes[type] || 'text-gray-500'
}

// 方法
const addNotification = (notification) => {
  const id = ++notificationId
  const newNotification = {
    id,
    ...notification,
    timestamp: new Date()
  }
  
  notifications.value.unshift(newNotification)
  
  // 自动移除通知
  setTimeout(() => {
    removeNotification(id)
  }, 5000)
}

const removeNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 检查任务提醒
const checkTaskReminders = () => {
  // 这里应该从实际的任务数据中检查
  // 模拟检查逻辑
  const now = new Date()
  
  // 检查即将到期的任务
  const urgentTasks = getUrgentTasks()
  urgentTasks.forEach(task => {
    addNotification({
      type: 'urgent',
      title: '任务即将到期',
      message: `「${task.title}」将在 ${getTimeRemaining(task.deadline)} 后到期`
    })
  })
  
  // 检查提醒时间
  const reminderTasks = getReminderTasks()
  reminderTasks.forEach(task => {
    addNotification({
      type: 'reminder',
      title: '任务提醒',
      message: `「${task.title}」的提醒时间到了`
    })
  })
}

// 模拟数据获取
const getUrgentTasks = () => {
  // 这里应该从实际数据中获取
  return []
}

const getReminderTasks = () => {
  // 这里应该从实际数据中获取
  return []
}

const getTimeRemaining = (deadline) => {
  const now = new Date()
  const diff = new Date(deadline) - now
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`
  } else {
    return `${minutes}分钟`
  }
}

// 定时检查
let intervalId = null

onMounted(() => {
  // 每分钟检查一次提醒
  intervalId = setInterval(checkTaskReminders, 60000)
  
  // 立即检查一次
  checkTaskReminders()
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

// 导出方法供其他组件使用
defineExpose({
  addNotification,
  removeNotification
})
</script>
