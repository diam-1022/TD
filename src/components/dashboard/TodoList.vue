<template>
  <Card class="h-80">
    <CardHeader class="flex flex-row items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">待办事项</h3>
        <p class="text-sm text-gray-600">星期三，5月11日</p>
      </div>
      <div class="flex items-center space-x-2">
        <button 
          @click="navigateToScheduleManagement"
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="查看所有任务"
        >
          <ChevronRight class="w-4 h-4 text-gray-600" />
        </button>
        <button 
          @click="showCreateModal = true"
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="新建任务"
        >
          <Plus class="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </CardHeader>
    
    <CardContent class="space-y-4">
      <!-- 已完成任务 -->
      <div class="flex items-center space-x-3 p-3 rounded-lg" :class="taskStatus['completed-task-1'] ? 'bg-green-50' : 'bg-white border border-gray-200'">
        <div 
          class="w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-colors"
          :class="taskStatus['completed-task-1'] ? 'bg-green-500 hover:bg-green-600' : 'border-2 border-gray-300 hover:border-gray-400'"
          @click="toggleTaskStatus('completed-task-1')"
        >
          <Check v-if="taskStatus['completed-task-1']" class="w-3 h-3 text-white" />
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-900" :class="taskStatus['completed-task-1'] ? 'line-through' : ''">客户审查与反馈</p>
          <p class="text-xs text-gray-600">着陆页重新设计</p>
        </div>
      </div>

      <!-- 待完成任务 -->
      <div 
        class="flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors"
        :class="taskStatus['pending-task-2'] ? 'bg-green-50' : 'bg-white border border-gray-200 hover:bg-gray-50'"
        @click="navigateToSchedule('2')"
      >
        <div 
          class="w-5 h-5 rounded-full cursor-pointer transition-colors"
          :class="taskStatus['pending-task-2'] ? 'bg-green-500 hover:bg-green-600' : 'border-2 border-gray-300 hover:border-gray-400'"
          @click.stop="toggleTaskStatus('pending-task-2')"
        >
          <Check v-if="taskStatus['pending-task-2']" class="w-3 h-3 text-white" />
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-900" :class="taskStatus['pending-task-2'] ? 'line-through' : ''">团队会议</p>
          <p class="text-xs text-gray-600">今天 22:00 - 23:45</p>
        </div>
        <div class="flex items-center space-x-1">
          <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <span class="text-white text-xs">J</span>
          </div>
          <div class="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
            <span class="text-white text-xs">S</span>
          </div>
        </div>
      </div>

      <!-- 项目需求分析 -->
      <div 
        class="flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors"
        :class="taskStatus['pending-task-1'] ? 'bg-green-50' : 'bg-white border border-gray-200 hover:bg-gray-50'"
        @click="navigateToSchedule('1')"
      >
        <div 
          class="w-5 h-5 rounded-full cursor-pointer transition-colors"
          :class="taskStatus['pending-task-1'] ? 'bg-green-500 hover:bg-green-600' : 'border-2 border-gray-300 hover:border-gray-400'"
          @click.stop="toggleTaskStatus('pending-task-1')"
        >
          <Check v-if="taskStatus['pending-task-1']" class="w-3 h-3 text-white" />
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-900" :class="taskStatus['pending-task-1'] ? 'line-through' : ''">项目需求分析与设计</p>
          <p class="text-xs text-gray-600">截止：2024-12-31</p>
        </div>
        <div class="flex items-center space-x-1">
          <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span class="text-white text-xs">M</span>
          </div>
        </div>
      </div>

      <!-- 更多任务占位 -->
      <div class="space-y-2">
        <div class="h-4 bg-gray-100 rounded animate-pulse"></div>
        <div class="h-4 bg-gray-100 rounded animate-pulse w-3/4"></div>
        <div class="h-4 bg-gray-100 rounded animate-pulse w-1/2"></div>
      </div>
    </CardContent>
  </Card>

  <!-- 新建任务弹窗 -->
  <ScheduleModal 
    v-if="showCreateModal"
    @close="showCreateModal = false"
    @save="handleSave"
  />
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronRight, Check, Plus } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardContent from '@/components/ui/CardContent.vue'
import ScheduleModal from '@/components/schedule/ScheduleModal.vue'

const router = useRouter()
const showCreateModal = ref(false)

// 任务状态管理
const taskStatus = ref({
  'completed-task-1': true,  // 已完成
  'pending-task-1': false,   // 待完成
  'pending-task-2': false    // 待完成
})

const navigateToSchedule = (scheduleId) => {
  router.push(`/schedule/${scheduleId}`)
}

const navigateToScheduleManagement = () => {
  router.push('/schedule')
}

const handleSave = (scheduleData) => {
  console.log('新建任务:', scheduleData)
  showCreateModal.value = false
  // 这里可以触发父组件刷新数据
}

const toggleTaskStatus = (taskId) => {
  taskStatus.value[taskId] = !taskStatus.value[taskId]
  console.log(`任务 ${taskId} 状态已切换为:`, taskStatus.value[taskId] ? '已完成' : '待完成')
  // 这里可以调用 API 更新任务状态
}
</script>
