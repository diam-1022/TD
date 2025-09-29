<template>
  <div class="flex h-screen bg-gray-50">
    <!-- 侧边栏 -->
    <Sidebar />
    
    <!-- 主内容区域 -->
    <div class="flex-1 flex flex-col">
      <!-- 顶部栏 -->
      <Header />
      
      <!-- 日程管理内容 -->
      <main class="flex-1 p-6 overflow-y-auto">
        <!-- 页面标题和操作按钮 -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">日程管理</h1>
            <p class="text-gray-600 mt-1">管理您的任务和日程安排</p>
          </div>
          
          <div class="flex items-center space-x-3">
            <!-- 筛选和排序 -->
            <div class="flex items-center space-x-2">
              <select 
                v-model="selectedGroup" 
                class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">所有群组</option>
                <option v-for="group in groups" :key="group.id" :value="group.id">
                  {{ group.name }}
                </option>
              </select>
              
              <select 
                v-model="sortBy" 
                class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="deadline">按截止时间</option>
                <option value="priority">按优先级</option>
                <option value="created">按创建时间</option>
                <option value="progress">按进度</option>
              </select>
            </div>
            
            <!-- 新建任务按钮 -->
            <Button @click="showCreateModal = true" class="flex items-center space-x-2">
              <Plus class="w-4 h-4" />
              <span>新建任务</span>
            </Button>
          </div>
        </div>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent class="p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">总任务数</p>
                  <p class="text-2xl font-bold text-gray-900">{{ schedules.length }}</p>
                </div>
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <CheckSquare class="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent class="p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">进行中</p>
                  <p class="text-2xl font-bold text-yellow-600">{{ inProgressCount }}</p>
                </div>
                <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock class="w-4 h-4 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent class="p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">已完成</p>
                  <p class="text-2xl font-bold text-green-600">{{ completedCount }}</p>
                </div>
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle class="w-4 h-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent class="p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">即将到期</p>
                  <p class="text-2xl font-bold text-red-600">{{ urgentCount }}</p>
                </div>
                <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle class="w-4 h-4 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- 日程列表 -->
        <div class="space-y-4">
          <div 
            v-for="schedule in filteredSchedules" 
            :key="schedule.id"
            class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between">
              <!-- 左侧信息 -->
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <h3 class="text-lg font-semibold text-gray-900">{{ schedule.title }}</h3>
                  <Badge :variant="getPriorityVariant(schedule.priority)">
                    {{ schedule.priority }}
                  </Badge>
                  <Badge :variant="getStatusVariant(schedule.status)">
                    {{ schedule.status }}
                  </Badge>
                </div>
                
                <p class="text-gray-600 text-sm mb-3">{{ schedule.description }}</p>
                
                <!-- 标签 -->
                <div class="flex flex-wrap gap-2 mb-3">
                  <Badge 
                    v-for="tag in schedule.tags" 
                    :key="tag" 
                    variant="secondary"
                    class="text-xs"
                  >
                    {{ tag }}
                  </Badge>
                </div>
                
                <!-- 进度条 -->
                <div class="mb-3">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-sm text-gray-600">进度</span>
                    <span class="text-sm font-medium" :class="getProgressColor(schedule.progress)">
                      {{ schedule.progress }}%
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      class="h-2 rounded-full transition-all duration-300"
                      :class="getProgressBarColor(schedule.priority)"
                      :style="{ width: schedule.progress + '%' }"
                    ></div>
                  </div>
                </div>
                
                <!-- 时间信息 -->
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                  <div class="flex items-center space-x-1">
                    <Calendar class="w-4 h-4" />
                    <span>截止：{{ formatDate(schedule.deadline) }}</span>
                  </div>
                  <div class="flex items-center space-x-1">
                    <User class="w-4 h-4" />
                    <span>{{ schedule.assignee }}</span>
                  </div>
                  <div class="flex items-center space-x-1">
                    <Users class="w-4 h-4" />
                    <span>{{ getGroupName(schedule.groupId) }}</span>
                  </div>
                </div>
              </div>
              
              <!-- 右侧操作按钮 -->
              <div class="flex items-center space-x-2 ml-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  @click="viewSchedule(schedule.id)"
                >
                  <Eye class="w-4 h-4" />
                </Button>
                
                <Button 
                  v-if="canEdit(schedule)"
                  variant="outline" 
                  size="sm"
                  @click="editSchedule(schedule)"
                >
                  <Edit class="w-4 h-4" />
                </Button>
                
                <Button 
                  v-if="canDelete(schedule)"
                  variant="outline" 
                  size="sm"
                  @click="deleteSchedule(schedule.id)"
                  class="text-red-600 hover:text-red-700"
                >
                  <Trash2 class="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredSchedules.length === 0" class="text-center py-12">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar class="w-8 h-8 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">暂无日程</h3>
          <p class="text-gray-600 mb-4">开始创建您的第一个任务吧！</p>
          <Button @click="showCreateModal = true">
            <Plus class="w-4 h-4 mr-2" />
            新建任务
          </Button>
        </div>
      </main>
    </div>

    <!-- 创建/编辑任务弹窗 -->
    <ScheduleModal 
      v-if="showCreateModal || showEditModal"
      :schedule="editingSchedule"
      :is-edit="showEditModal"
      @close="closeModal"
      @save="handleSave"
    />

    <!-- 删除确认弹窗 -->
    <ConfirmModal
      v-if="showDeleteModal"
      title="删除任务"
      :message="`确定要删除任务「${deletingSchedule?.title}」吗？此操作不可撤销。`"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Plus, CheckSquare, Clock, CheckCircle, AlertTriangle, 
  Calendar, User, Users, Eye, Edit, Trash2 
} from 'lucide-vue-next'

import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import ScheduleModal from '@/components/schedule/ScheduleModal.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'

const router = useRouter()

// 响应式数据
const schedules = ref([])
const groups = ref([])
const selectedGroup = ref('')
const sortBy = ref('deadline')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const editingSchedule = ref(null)
const deletingSchedule = ref(null)

// 模拟数据
const mockSchedules = [
  {
    id: 1,
    title: '项目需求分析与设计',
    description: '完成新产品的需求分析，包括用户调研、功能规划、技术架构设计等',
    priority: 'Vital',
    status: '进行中',
    progress: 60,
    assignee: 'Mike Chen',
    groupId: 1,
    deadline: new Date('2024-12-31 18:00:00'),
    createdAt: new Date('2024-11-01'),
    tags: ['产品设计', '用户研究', '技术架构'],
    createdBy: 'admin',
    canEdit: ['admin', 'editor'],
    canDelete: ['admin']
  },
  {
    id: 2,
    title: '用户界面设计',
    description: '设计产品的用户界面，包括页面布局、交互设计等',
    priority: 'Routine',
    status: '待开始',
    progress: 0,
    assignee: 'Sarah Wang',
    groupId: 1,
    deadline: new Date('2024-12-15 17:00:00'),
    createdAt: new Date('2024-11-05'),
    tags: ['UI设计', '交互设计'],
    createdBy: 'editor',
    canEdit: ['admin', 'editor'],
    canDelete: ['admin']
  },
  {
    id: 3,
    title: '团队建设活动',
    description: '组织团队建设活动，提升团队凝聚力',
    priority: 'Fun',
    status: '已完成',
    progress: 100,
    assignee: 'David Liu',
    groupId: 2,
    deadline: new Date('2024-11-30 16:00:00'),
    createdAt: new Date('2024-10-20'),
    tags: ['团队建设', '活动策划'],
    createdBy: 'admin',
    canEdit: ['admin', 'editor'],
    canDelete: ['admin']
  }
]

const mockGroups = [
  { id: 1, name: '产品开发组' },
  { id: 2, name: '运营团队' },
  { id: 3, name: '设计团队' }
]

// 计算属性
const filteredSchedules = computed(() => {
  let filtered = schedules.value

  // 按群组筛选
  if (selectedGroup.value) {
    filtered = filtered.filter(schedule => schedule.groupId === parseInt(selectedGroup.value))
  }

  // 排序
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'deadline':
        return new Date(a.deadline) - new Date(b.deadline)
      case 'priority':
        const priorityOrder = { 'Vital': 3, 'Routine': 2, 'Fun': 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      case 'created':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'progress':
        return b.progress - a.progress
      default:
        return 0
    }
  })

  return filtered
})

const inProgressCount = computed(() => 
  schedules.value.filter(s => s.status === '进行中').length
)

const completedCount = computed(() => 
  schedules.value.filter(s => s.status === '已完成').length
)

const urgentCount = computed(() => {
  const now = new Date()
  const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
  return schedules.value.filter(s => 
    s.status !== '已完成' && 
    new Date(s.deadline) <= threeDaysLater
  ).length
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

const getGroupName = (groupId) => {
  const group = groups.value.find(g => g.id === groupId)
  return group ? group.name : '未知群组'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const canEdit = (schedule) => {
  // 这里可以根据用户权限判断，暂时模拟
  const currentUser = 'editor' // 模拟当前用户
  return schedule.canEdit.includes(currentUser)
}

const canDelete = (schedule) => {
  // 这里可以根据用户权限判断，暂时模拟
  const currentUser = 'admin' // 模拟当前用户
  return schedule.canDelete.includes(currentUser)
}

const viewSchedule = (id) => {
  router.push(`/schedule/${id}`)
}

const editSchedule = (schedule) => {
  editingSchedule.value = { ...schedule }
  showEditModal.value = true
}

const deleteSchedule = (schedule) => {
  deletingSchedule.value = schedule
  showDeleteModal.value = true
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingSchedule.value = null
}

const handleSave = (scheduleData) => {
  if (showEditModal.value) {
    // 编辑模式
    const index = schedules.value.findIndex(s => s.id === scheduleData.id)
    if (index > -1) {
      schedules.value[index] = { ...scheduleData }
    }
  } else {
    // 创建模式
    const newSchedule = {
      ...scheduleData,
      id: Date.now(),
      createdAt: new Date(),
      createdBy: 'currentUser', // 模拟当前用户
      canEdit: ['admin', 'editor'],
      canDelete: ['admin']
    }
    schedules.value.unshift(newSchedule)
  }
  closeModal()
}

const confirmDelete = () => {
  if (deletingSchedule.value) {
    const index = schedules.value.findIndex(s => s.id === deletingSchedule.value.id)
    if (index > -1) {
      schedules.value.splice(index, 1)
    }
  }
  showDeleteModal.value = false
  deletingSchedule.value = null
}

onMounted(() => {
  // 加载数据
  schedules.value = mockSchedules
  groups.value = mockGroups
})
</script>
