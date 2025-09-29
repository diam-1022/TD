<template>
  <div class="relative">
    <!-- 通知图标 -->
    <button 
      @click="toggleNotifications"
      class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <Bell class="w-5 h-5" />
      <!-- 未读通知红点 -->
      <span 
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <!-- 通知弹窗 -->
    <div 
      v-if="showNotifications"
      class="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
    >
      <!-- 弹窗头部 -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">通知</h3>
          <button 
            @click="markAllAsRead"
            class="text-sm text-blue-600 hover:text-blue-700"
          >
            全部已读
          </button>
        </div>
      </div>

      <!-- 通知列表 -->
      <div class="max-h-96 overflow-y-auto">
        <div v-if="notifications.length === 0" class="p-4 text-center text-gray-500">
          暂无通知
        </div>
        
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          class="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
          :class="{ 'bg-blue-50': !notification.read }"
          @click="handleNotificationClick(notification)"
        >
          <div class="flex items-start space-x-3">
            <!-- 通知图标 -->
            <div class="w-8 h-8 rounded-full flex items-center justify-center"
                 :class="getNotificationIconClass(notification.type)">
              <component :is="getNotificationIcon(notification.type)" class="w-4 h-4 text-white" />
            </div>
            
            <!-- 通知内容 -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 mb-1">
                {{ notification.title }}
              </p>
              <p class="text-sm text-gray-600 mb-2">
                {{ notification.message }}
              </p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">
                  {{ formatTime(notification.createdAt) }}
                </span>
                <span 
                  v-if="!notification.read"
                  class="w-2 h-2 bg-blue-500 rounded-full"
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 弹窗底部 -->
      <div class="p-4 border-t border-gray-200">
        <button 
          @click="viewAllNotifications"
          class="w-full text-center text-sm text-blue-600 hover:text-blue-700"
        >
          查看所有通知
        </button>
      </div>
    </div>

    <!-- 点击外部关闭 -->
    <div 
      v-if="showNotifications"
      class="fixed inset-0 z-40"
      @click="showNotifications = false"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Bell, Clock, AlertCircle, CheckCircle, Info } from 'lucide-vue-next'

const router = useRouter()
const showNotifications = ref(false)

// 模拟通知数据
const notifications = ref([
  {
    id: 1,
    type: 'reminder',
    title: '日程提醒',
    message: '项目需求分析与设计 将在 1 小时后截止',
    scheduleId: '1',
    read: false,
    createdAt: new Date('2024-11-15 17:00:00')
  },
  {
    id: 2,
    type: 'comment',
    title: '新评论',
    message: 'Sarah Wang 在 项目需求分析与设计 中添加了评论',
    scheduleId: '1',
    read: false,
    createdAt: new Date('2024-11-15 16:30:00')
  },
  {
    id: 3,
    type: 'deadline',
    title: '截止提醒',
    message: '团队会议 将在明天开始',
    scheduleId: '2',
    read: true,
    createdAt: new Date('2024-11-15 15:00:00')
  }
])

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

const getNotificationIcon = (type) => {
  const icons = {
    'reminder': Clock,
    'comment': Info,
    'deadline': AlertCircle,
    'completed': CheckCircle
  }
  return icons[type] || Info
}

const getNotificationIconClass = (type) => {
  const classes = {
    'reminder': 'bg-blue-500',
    'comment': 'bg-green-500',
    'deadline': 'bg-orange-500',
    'completed': 'bg-green-500'
  }
  return classes[type] || 'bg-gray-500'
}

const formatTime = (date) => {
  const now = new Date()
  const notificationTime = new Date(date)
  const diff = now.getTime() - notificationTime.getTime()
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 60) {
    return `${minutes} 分钟前`
  } else if (hours < 24) {
    return `${hours} 小时前`
  } else {
    return `${days} 天前`
  }
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    notification.read = true
  })
}

const handleNotificationClick = (notification) => {
  // 标记为已读
  notification.read = true
  
  // 根据通知类型跳转
  if (notification.scheduleId) {
    router.push(`/schedule/${notification.scheduleId}`)
  }
  
  showNotifications.value = false
}

const viewAllNotifications = () => {
  // 跳转到通知页面
  router.push('/notifications')
  showNotifications.value = false
}

// 模拟实时通知
let notificationInterval

onMounted(() => {
  // 每30秒检查一次新通知
  notificationInterval = setInterval(() => {
    // 这里可以调用 API 检查新通知
    console.log('检查新通知...')
  }, 30000)
})

onUnmounted(() => {
  if (notificationInterval) {
    clearInterval(notificationInterval)
  }
})
</script>
