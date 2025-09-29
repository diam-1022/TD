<template>
  <div class="countdown-timer">
    <!-- 倒计时显示 -->
    <div class="flex items-center justify-center space-x-4 p-4 rounded-lg" :class="getCountdownClass()">
      <div class="text-center">
        <div class="text-2xl font-bold" :class="getTextClass()">{{ timeRemaining.days }}</div>
        <div class="text-xs text-gray-600">天</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold" :class="getTextClass()">{{ timeRemaining.hours }}</div>
        <div class="text-xs text-gray-600">小时</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold" :class="getTextClass()">{{ timeRemaining.minutes }}</div>
        <div class="text-xs text-gray-600">分钟</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold" :class="getTextClass()">{{ timeRemaining.seconds }}</div>
        <div class="text-xs text-gray-600">秒</div>
      </div>
    </div>
    
    <!-- 进度条 -->
    <div class="mt-4">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm font-medium text-gray-700">剩余时间</span>
        <span class="text-sm font-bold" :class="getTextClass()">
          {{ getCountdownText() }}
        </span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="h-2 rounded-full transition-all duration-1000"
          :class="getProgressBarClass()"
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
    </div>
    
    <!-- 状态信息 -->
    <div class="mt-3 text-center">
      <p class="text-sm" :class="getStatusTextClass()">
        {{ getStatusText() }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  deadline: {
    type: Date,
    required: true
  },
  startTime: {
    type: Date,
    default: () => new Date()
  },
  showSeconds: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['timeout', 'warning'])

// 响应式数据
const currentTime = ref(new Date())
let timer = null

// 计算属性
const timeRemaining = computed(() => {
  const now = currentTime.value
  const deadline = new Date(props.deadline)
  const diff = deadline.getTime() - now.getTime()
  
  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    }
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  
  return { days, hours, minutes, seconds }
})

const isOverdue = computed(() => {
  return new Date() > new Date(props.deadline)
})

const isWarning = computed(() => {
  const now = currentTime.value
  const deadline = new Date(props.deadline)
  const diff = deadline.getTime() - now.getTime()
  const oneDay = 24 * 60 * 60 * 1000
  
  return diff > 0 && diff <= oneDay
})

const progressPercentage = computed(() => {
  const now = currentTime.value
  const start = new Date(props.startTime)
  const deadline = new Date(props.deadline)
  const total = deadline.getTime() - start.getTime()
  const elapsed = now.getTime() - start.getTime()
  
  if (total <= 0) return 100
  if (elapsed <= 0) return 0
  
  return Math.min(100, Math.max(0, (elapsed / total) * 100))
})

// 方法
const getCountdownClass = () => {
  if (isOverdue.value) {
    return 'bg-red-50 border border-red-200'
  } else if (isWarning.value) {
    return 'bg-yellow-50 border border-yellow-200'
  } else {
    return 'bg-blue-50 border border-blue-200'
  }
}

const getTextClass = () => {
  if (isOverdue.value) {
    return 'text-red-600'
  } else if (isWarning.value) {
    return 'text-yellow-600'
  } else {
    return 'text-blue-600'
  }
}

const getProgressBarClass = () => {
  if (isOverdue.value) {
    return 'bg-red-500'
  } else if (isWarning.value) {
    return 'bg-yellow-500'
  } else {
    return 'bg-blue-500'
  }
}

const getStatusTextClass = () => {
  if (isOverdue.value) {
    return 'text-red-600'
  } else if (isWarning.value) {
    return 'text-yellow-600'
  } else {
    return 'text-blue-600'
  }
}

const getCountdownText = () => {
  if (isOverdue.value) {
    return '已超时'
  } else if (isWarning.value) {
    return '即将到期'
  } else {
    return '进行中'
  }
}

const getStatusText = () => {
  if (isOverdue.value) {
    return '任务已超时，请尽快处理'
  } else if (isWarning.value) {
    return '任务即将到期，请注意时间'
  } else {
    return '任务进行中'
  }
}

const updateTime = () => {
  currentTime.value = new Date()
  
  // 检查是否超时
  if (isOverdue.value) {
    emit('timeout')
  }
  
  // 检查是否进入警告状态
  if (isWarning.value) {
    emit('warning')
  }
}

onMounted(() => {
  // 每秒更新一次时间
  timer = setInterval(updateTime, 1000)
  updateTime()
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.countdown-timer {
  @apply w-full;
}
</style>
