<template>
  <div class="flex h-screen bg-gray-50">
    <!-- 侧边栏 -->
    <Sidebar />
    
    <!-- 主内容区域 -->
    <div class="flex-1 flex flex-col">
      <!-- 顶部栏 -->
      <Header />
      
      <!-- 日程详情内容 -->
      <main class="flex-1 p-6 overflow-y-auto">
        <!-- 返回按钮和标题 -->
        <div class="mb-6">
          <button 
            @click="$router.go(-1)"
            class="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft class="w-4 h-4" />
            <span>返回</span>
          </button>
          
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ schedule.title }}</h1>
              <div class="flex items-center space-x-4">
                <Badge :variant="getPriorityVariant(schedule.priority)">
                  {{ schedule.priority }}
                </Badge>
                <span class="text-gray-600">{{ schedule.category }}</span>
                <span class="text-gray-600">创建于 {{ formatDate(schedule.createdAt) }}</span>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <Button variant="outline" @click="showReminderModal = true">
                <Bell class="w-4 h-4 mr-2" />
                设置提醒
              </Button>
              <Button variant="outline">
                <Edit class="w-4 h-4 mr-2" />
                编辑
              </Button>
            </div>
          </div>
        </div>

        <!-- 主要内容区域 -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- 左侧：进度追踪和基本信息 -->
          <div class="lg:col-span-2 space-y-6">
            <!-- 进度追踪可视化 -->
            <Card>
              <CardHeader>
                <h3 class="text-lg font-semibold">进度追踪</h3>
              </CardHeader>
              <CardContent class="space-y-6">
                <!-- 进度条 -->
                <div>
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-medium text-gray-700">完成进度</span>
                    <span class="text-sm font-bold" :class="getProgressColor(schedule.progress)">
                      {{ schedule.progress }}%
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      class="h-3 rounded-full transition-all duration-300"
                      :class="getProgressBarColor(schedule.priority)"
                      :style="{ width: schedule.progress + '%' }"
                    ></div>
                  </div>
                </div>

                <!-- 倒计时模块 -->
                <div class="p-4 rounded-lg" :class="getCountdownBgClass()">
                  <div class="flex items-center justify-between mb-4">
                    <div>
                      <h4 class="font-semibold" :class="getCountdownTextClass()">
                        {{ getCountdownText() }}
                      </h4>
                      <p class="text-sm text-gray-600 mt-1">
                        截止时间：{{ formatDateTime(schedule.deadline) }}
                      </p>
                    </div>
                    <Clock class="w-8 h-8" :class="getCountdownIconClass()" />
                  </div>
                  
                  <!-- 倒计时组件 -->
                  <CountdownTimer 
                    :deadline="schedule.deadline"
                    :start-time="schedule.createdAt"
                    @timeout="handleTimeout"
                    @warning="handleWarning"
                  />
                </div>
              </CardContent>
            </Card>

            <!-- 日程描述 -->
            <Card>
              <CardHeader>
                <h3 class="text-lg font-semibold">日程描述</h3>
              </CardHeader>
              <CardContent>
                <p class="text-gray-700 leading-relaxed">{{ schedule.description }}</p>
              </CardContent>
            </Card>

            <!-- 评论协作 -->
            <Card>
              <CardHeader>
                <h3 class="text-lg font-semibold">评论协作</h3>
              </CardHeader>
              <CardContent>
                <!-- 评论输入 -->
                <div class="mb-4">
                  <div class="flex space-x-3">
                    <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span class="text-white text-sm font-medium">M</span>
                    </div>
                    <div class="flex-1">
                      <Input 
                        v-model="newComment"
                        placeholder="添加评论..."
                        class="mb-2"
                      />
                      <div class="flex justify-end">
                        <Button 
                          size="sm" 
                          @click="addComment"
                          :disabled="!newComment.trim()"
                        >
                          发布评论
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 评论列表 -->
                <div class="space-y-4">
                  <div 
                    v-for="comment in comments" 
                    :key="comment.id"
                    class="flex space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span class="text-white text-sm font-medium">{{ comment.author.charAt(0) }}</span>
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center justify-between mb-1">
                        <span class="text-sm font-medium text-gray-900">{{ comment.author }}</span>
                        <div class="flex items-center space-x-2">
                          <span class="text-xs text-gray-500">{{ formatTime(comment.createdAt) }}</span>
                          <button 
                            v-if="canDeleteComment(comment)"
                            @click="deleteComment(comment.id)"
                            class="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 class="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p class="text-sm text-gray-700">{{ comment.content }}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- 右侧：相关信息 -->
          <div class="space-y-6">
            <!-- 基本信息 -->
            <Card>
              <CardHeader>
                <h3 class="text-lg font-semibold">基本信息</h3>
              </CardHeader>
              <CardContent class="space-y-4">
                <div>
                  <label class="text-sm font-medium text-gray-600">负责人</label>
                  <div class="flex items-center space-x-2 mt-1">
                    <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span class="text-white text-xs">M</span>
                    </div>
                    <span class="text-sm">{{ schedule.assignee }}</span>
                  </div>
                </div>
                
                <div>
                  <label class="text-sm font-medium text-gray-600">状态</label>
                  <Badge :variant="getStatusVariant(schedule.status)" class="mt-1">
                    {{ schedule.status }}
                  </Badge>
                </div>
                
                <div>
                  <label class="text-sm font-medium text-gray-600">标签</label>
                  <div class="flex flex-wrap gap-2 mt-1">
                    <Badge v-for="tag in schedule.tags" :key="tag" variant="secondary">
                      {{ tag }}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- 相关文件 -->
            <Card>
              <CardHeader>
                <h3 class="text-lg font-semibold">相关文件</h3>
              </CardHeader>
              <CardContent>
                <div class="space-y-2">
                  <div class="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                    <FileText class="w-4 h-4 text-gray-500" />
                    <span class="text-sm">项目需求文档.pdf</span>
                  </div>
                  <div class="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                    <Image class="w-4 h-4 text-gray-500" />
                    <span class="text-sm">设计稿.png</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>

    <!-- 提醒设置弹窗 -->
    <ReminderModal 
      v-if="showReminderModal"
      :schedule="schedule"
      @close="showReminderModal = false"
      @save="handleReminderSave"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, Bell, Edit, Clock, Trash2, FileText, Image } from 'lucide-vue-next'

import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Input from '@/components/ui/Input.vue'
import ReminderModal from '@/components/schedule/ReminderModal.vue'
import CountdownTimer from '@/components/schedule/CountdownTimer.vue'

const route = useRoute()
const showReminderModal = ref(false)
const newComment = ref('')

// 模拟日程数据
const schedule = ref({
  id: route.params.id || '1',
  title: '项目需求分析与设计',
  description: '完成新产品的需求分析，包括用户调研、功能规划、技术架构设计等。需要与产品团队、设计团队密切协作，确保项目按时交付。',
  priority: 'Vital',
  category: '工作项目',
  status: '进行中',
  progress: 60,
  assignee: 'Mike Chen',
  deadline: new Date('2024-12-31 18:00:00'),
  createdAt: new Date('2024-11-01'),
  tags: ['产品设计', '用户研究', '技术架构']
})

// 模拟评论数据
const comments = ref([
  {
    id: 1,
    author: 'Sarah Wang',
    content: '用户调研部分已经完成，调研报告已上传到相关文件。',
    createdAt: new Date('2024-11-15 14:30:00')
  },
  {
    id: 2,
    author: 'David Liu',
    content: '技术架构设计需要进一步讨论，建议安排一次技术评审会议。',
    createdAt: new Date('2024-11-15 16:45:00')
  }
])

// 计算属性
const isOverdue = computed(() => {
  return new Date() > schedule.value.deadline
})

const timeRemaining = computed(() => {
  const now = new Date()
  const deadline = new Date(schedule.value.deadline)
  const diff = deadline.getTime() - now.getTime()
  
  if (diff <= 0) {
    const overdue = Math.abs(diff)
    return {
      days: Math.floor(overdue / (1000 * 60 * 60 * 24)),
      hours: Math.floor((overdue % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    }
  } else {
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    }
  }
})

// 方法
const getPriorityVariant = (priority) => {
  const variants = {
    'Vital': 'destructive',
    'Routine': 'default',
    'Fun': 'secondary'
  }
  return variants[priority] || 'default'
}

const getStatusVariant = (status) => {
  const variants = {
    '已完成': 'default',
    '进行中': 'secondary',
    '待开始': 'outline'
  }
  return variants[status] || 'outline'
}

const getProgressColor = (progress) => {
  if (progress >= 80) return 'text-green-600'
  if (progress >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

const getProgressBarColor = (priority) => {
  const colors = {
    'Vital': 'bg-red-500',
    'Routine': 'bg-blue-500',
    'Fun': 'bg-green-500'
  }
  return colors[priority] || 'bg-gray-500'
}

const getCountdownText = () => {
  if (isOverdue.value) {
    return `已超时 ${timeRemaining.value.days} 天 ${timeRemaining.value.hours} 小时`
  } else {
    return `距离截止时间还有 ${timeRemaining.value.days} 天 ${timeRemaining.value.hours} 小时`
  }
}

const getCountdownBgClass = () => {
  return isOverdue.value ? 'bg-red-50' : 'bg-blue-50'
}

const getCountdownTextClass = () => {
  return isOverdue.value ? 'text-red-700' : 'text-blue-700'
}

const getCountdownIconClass = () => {
  return isOverdue.value ? 'text-red-500' : 'text-blue-500'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const formatDateTime = (date) => {
  return new Date(date).toLocaleString('zh-CN')
}

const formatTime = (date) => {
  return new Date(date).toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const addComment = () => {
  if (!newComment.value.trim()) return
  
  const comment = {
    id: Date.now(),
    author: 'Mike Chen',
    content: newComment.value,
    createdAt: new Date()
  }
  
  comments.value.unshift(comment)
  newComment.value = ''
}

const deleteComment = (commentId) => {
  const index = comments.value.findIndex(c => c.id === commentId)
  if (index > -1) {
    comments.value.splice(index, 1)
  }
}

const canDeleteComment = (comment) => {
  // 这里可以根据用户权限判断，暂时允许删除自己的评论
  return comment.author === 'Mike Chen'
}

const handleReminderSave = (reminderData) => {
  console.log('保存提醒设置:', reminderData)
  showReminderModal.value = false
  // 这里可以调用 API 保存提醒设置
}

const handleTimeout = () => {
  console.log('任务已超时')
  // 可以触发通知或其他处理
}

const handleWarning = () => {
  console.log('任务即将到期')
  // 可以触发警告通知
}

onMounted(() => {
  // 根据路由参数加载日程数据
  console.log('加载日程详情:', route.params.id)
})
</script>
