<template>
  <div class="space-y-6">
    <!-- 操作栏 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <!-- 筛选条件 -->
        <div class="flex items-center space-x-3">
          <select 
            v-model="localFilters.priority"
            @change="updateFilters"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">按优先级</option>
            <option value="Vital">Vital</option>
            <option value="Routine">Routine</option>
            <option value="Fun">Fun</option>
          </select>

          <select 
            v-model="localFilters.tag"
            @change="updateFilters"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">按标签</option>
            <option v-for="tag in availableTags" :key="tag" :value="tag">{{ tag }}</option>
          </select>

          <select 
            v-model="localFilters.assignee"
            @change="updateFilters"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">按负责人</option>
            <option v-for="member in groupMembers" :key="member.id" :value="member.id">
              {{ member.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <!-- 排序 -->
        <select 
          v-model="localSort.field"
          @change="updateSort"
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="deadline">按截止时间</option>
          <option value="created">按创建时间</option>
          <option value="priority">按优先级</option>
        </select>

        <button 
          @click="toggleSortOrder"
          class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          :title="localSort.order === 'asc' ? '升序' : '降序'"
        >
          <ArrowUpDown class="w-4 h-4 text-gray-600" />
        </button>

        <!-- 新建日程 -->
        <button 
          @click="showCreateModal = true"
          class="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus class="w-4 h-4" />
          <span>新建日程</span>
        </button>
      </div>
    </div>

    <!-- 日程列表 -->
    <div class="bg-white rounded-lg border">
      <div class="divide-y divide-gray-200">
        <div 
          v-for="schedule in filteredSchedules" 
          :key="schedule.id"
          class="p-6 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <h3 
                  @click="toggleScheduleDetail(schedule.id)"
                  class="text-lg font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                >
                  {{ schedule.title }}
                </h3>
                <span 
                  :class="[
                    'px-2 py-1 text-xs rounded-full',
                    getPriorityClass(schedule.priority)
                  ]"
                >
                  {{ schedule.priority }}
                </span>
              </div>

              <p class="text-gray-600 mb-3">{{ schedule.description }}</p>

              <div class="flex items-center space-x-6 text-sm text-gray-500">
                <div class="flex items-center space-x-1">
                  <Calendar class="w-4 h-4" />
                  <span>截止：{{ formatDate(schedule.deadline) }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <User class="w-4 h-4" />
                  <span>{{ getAssigneeName(schedule.assignee) }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <Tag class="w-4 h-4" />
                  <span>{{ schedule.tags.join(', ') }}</span>
                </div>
              </div>

              <!-- 进度条 -->
              <div class="mt-3">
                <div class="flex items-center justify-between text-sm mb-1">
                  <span class="text-gray-600">进度</span>
                  <span class="text-gray-900">{{ schedule.progress }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    :style="{ width: schedule.progress + '%' }"
                  ></div>
                </div>
              </div>
            </div>

            <div class="flex items-center space-x-2 ml-4">
              <button 
                @click="editSchedule(schedule)"
                class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="编辑"
              >
                <Edit class="w-4 h-4" />
              </button>
              <button 
                @click="confirmDeleteSchedule(schedule)"
                class="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="删除"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- 展开的详情 -->
          <div v-if="expandedSchedule === schedule.id" class="mt-4 pt-4 border-t border-gray-200">
            <div class="space-y-4">
              <!-- 子任务 -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-medium text-gray-900">子任务</h4>
                  <button 
                    @click="addSubtask(schedule.id)"
                    class="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    + 添加子任务
                  </button>
                </div>
                <div class="space-y-2">
                  <div 
                    v-for="subtask in schedule.subtasks" 
                    :key="subtask.id"
                    class="flex items-center space-x-2"
                  >
                    <input 
                      type="checkbox" 
                      :checked="subtask.completed"
                      @change="toggleSubtask(schedule.id, subtask.id)"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span :class="subtask.completed ? 'line-through text-gray-500' : 'text-gray-900'">
                      {{ subtask.name }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 附件 -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-medium text-gray-900">附件</h4>
                  <button 
                    @click="uploadAttachment(schedule.id)"
                    class="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    + 上传附件
                  </button>
                </div>
                <div class="space-y-2">
                  <div 
                    v-for="file in schedule.attachments" 
                    :key="file.id"
                    class="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div class="flex items-center space-x-2">
                      <File class="w-4 h-4 text-gray-500" />
                      <span class="text-sm text-gray-900">{{ file.name }}</span>
                      <span class="text-xs text-gray-500">({{ formatFileSize(file.size) }})</span>
                    </div>
                    <button 
                      @click="downloadFile(file)"
                      class="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      下载
                    </button>
                  </div>
                </div>
              </div>

              <!-- 进度更新 -->
              <div>
                <h4 class="font-medium text-gray-900 mb-2">更新进度</h4>
                <div class="flex items-center space-x-3">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    :value="schedule.progress"
                    @input="updateProgress(schedule.id, $event.target.value)"
                    class="flex-1"
                  />
                  <span class="text-sm text-gray-600 w-12">{{ schedule.progress }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredSchedules.length === 0" class="p-12 text-center">
        <Calendar class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">暂无日程</h3>
        <p class="text-gray-500 mb-4">创建第一个日程开始协作</p>
        <button 
          @click="showCreateModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          新建日程
        </button>
      </div>
    </div>

    <!-- 新建日程弹窗 -->
    <CreateScheduleModal
      v-if="showCreateModal"
      :show="showCreateModal"
      :group-members="groupMembers"
      :available-tags="availableTags"
      @close="showCreateModal = false"
      @created="handleScheduleCreated"
    />

    <!-- 编辑日程弹窗 -->
    <EditScheduleModal
      v-if="showEditModal"
      :show="showEditModal"
      :schedule="editingSchedule"
      :group-members="groupMembers"
      :available-tags="availableTags"
      @close="showEditModal = false"
      @updated="handleScheduleUpdated"
    />

    <!-- 删除确认弹窗 -->
    <ConfirmModal
      v-if="showDeleteModal"
      :show="showDeleteModal"
      title="删除日程"
      :confirm-text="'确认删除'"
      :cancel-text="'取消'"
      confirm-class="bg-red-600 hover:bg-red-700"
      @confirm="deleteSchedule"
      @cancel="showDeleteModal = false"
    >
      <div class="space-y-4">
        <p class="text-gray-600">
          确定要删除日程 <strong>{{ deletingSchedule?.title }}</strong> 吗？
        </p>
        <p class="text-sm text-red-600">
          删除后不可恢复，相关文件也会被移除。
        </p>
      </div>
    </ConfirmModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { 
  Plus, ArrowUpDown, Calendar, User, Tag, Edit, Trash2, File 
} from 'lucide-vue-next'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import CreateScheduleModal from '@/components/group/CreateScheduleModal.vue'
import EditScheduleModal from '@/components/group/EditScheduleModal.vue'

const props = defineProps({
  groupId: {
    type: String,
    required: true
  },
  filters: {
    type: Object,
    default: () => ({})
  },
  sort: {
    type: Object,
    default: () => ({ field: 'deadline', order: 'asc' })
  }
})

const emit = defineEmits(['update-filters', 'update-sort'])

// 本地状态
const localFilters = reactive({ ...props.filters })
const localSort = reactive({ ...props.sort })

// 日程数据
const schedules = ref([
  {
    id: 1,
    title: '产品需求评审',
    description: '评审新版本的功能需求和用户体验设计',
    priority: 'Vital',
    deadline: '2024-01-15',
    assignee: 1,
    tags: ['产品', '评审'],
    progress: 75,
    subtasks: [
      { id: 1, name: '收集用户反馈', completed: true },
      { id: 2, name: '整理需求文档', completed: true },
      { id: 3, name: '设计评审会议', completed: false }
    ],
    attachments: [
      { id: 1, name: '需求文档.pdf', size: 1024000 },
      { id: 2, name: '用户调研报告.docx', size: 512000 }
    ]
  },
  {
    id: 2,
    title: '技术架构设计',
    description: '设计系统架构和技术选型',
    priority: 'Routine',
    deadline: '2024-01-20',
    assignee: 2,
    tags: ['技术', '架构'],
    progress: 30,
    subtasks: [
      { id: 4, name: '技术选型', completed: true },
      { id: 5, name: '架构图设计', completed: false }
    ],
    attachments: []
  }
])

// 群组成员
const groupMembers = ref([
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' }
])

// 可用标签
const availableTags = ref(['产品', '技术', '设计', '评审', '架构', '测试'])

// 弹窗状态
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const expandedSchedule = ref(null)

// 编辑/删除的日程
const editingSchedule = ref(null)
const deletingSchedule = ref(null)

// 筛选后的日程
const filteredSchedules = computed(() => {
  let result = [...schedules.value]

  // 应用筛选
  if (localFilters.priority) {
    result = result.filter(s => s.priority === localFilters.priority)
  }
  if (localFilters.tag) {
    result = result.filter(s => s.tags.includes(localFilters.tag))
  }
  if (localFilters.assignee) {
    result = result.filter(s => s.assignee === parseInt(localFilters.assignee))
  }

  // 应用排序
  result.sort((a, b) => {
    let aVal, bVal
    
    switch (localSort.field) {
      case 'deadline':
        aVal = new Date(a.deadline)
        bVal = new Date(b.deadline)
        break
      case 'created':
        aVal = new Date(a.createdAt || 0)
        bVal = new Date(b.createdAt || 0)
        break
      case 'priority':
        const priorityOrder = { 'Vital': 3, 'Routine': 2, 'Fun': 1 }
        aVal = priorityOrder[a.priority]
        bVal = priorityOrder[b.priority]
        break
      default:
        return 0
    }

    if (localSort.order === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  return result
})

// 监听props变化
watch(() => props.filters, (newFilters) => {
  Object.assign(localFilters, newFilters)
}, { deep: true })

watch(() => props.sort, (newSort) => {
  Object.assign(localSort, newSort)
}, { deep: true })

// 更新筛选条件
const updateFilters = () => {
  emit('update-filters', { ...localFilters })
}

// 更新排序
const updateSort = () => {
  emit('update-sort', { ...localSort })
}

// 切换排序顺序
const toggleSortOrder = () => {
  localSort.order = localSort.order === 'asc' ? 'desc' : 'asc'
  updateSort()
}

// 切换日程详情展开
const toggleScheduleDetail = (scheduleId) => {
  expandedSchedule.value = expandedSchedule.value === scheduleId ? null : scheduleId
}

// 编辑日程
const editSchedule = (schedule) => {
  editingSchedule.value = schedule
  showEditModal.value = true
}

// 确认删除日程
const confirmDeleteSchedule = (schedule) => {
  deletingSchedule.value = schedule
  showDeleteModal.value = true
}

// 删除日程
const deleteSchedule = () => {
  const index = schedules.value.findIndex(s => s.id === deletingSchedule.value.id)
  if (index > -1) {
    schedules.value.splice(index, 1)
  }
  showDeleteModal.value = false
  deletingSchedule.value = null
}

// 添加子任务
const addSubtask = (scheduleId) => {
  const schedule = schedules.value.find(s => s.id === scheduleId)
  if (schedule) {
    const name = prompt('请输入子任务名称：')
    if (name) {
      schedule.subtasks.push({
        id: Date.now(),
        name: name.trim(),
        completed: false
      })
    }
  }
}

// 切换子任务状态
const toggleSubtask = (scheduleId, subtaskId) => {
  const schedule = schedules.value.find(s => s.id === scheduleId)
  if (schedule) {
    const subtask = schedule.subtasks.find(st => st.id === subtaskId)
    if (subtask) {
      subtask.completed = !subtask.completed
      // 更新主任务进度
      const completedCount = schedule.subtasks.filter(st => st.completed).length
      schedule.progress = Math.round((completedCount / schedule.subtasks.length) * 100)
    }
  }
}

// 上传附件
const uploadAttachment = (scheduleId) => {
  const input = document.createElement('input')
  input.type = 'file'
  input.multiple = true
  input.onchange = (e) => {
    const files = Array.from(e.target.files)
    const schedule = schedules.value.find(s => s.id === scheduleId)
    if (schedule) {
      files.forEach(file => {
        schedule.attachments.push({
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size
        })
      })
    }
  }
  input.click()
}

// 下载文件
const downloadFile = (file) => {
  // 模拟文件下载
  console.log('下载文件:', file.name)
}

// 更新进度
const updateProgress = (scheduleId, progress) => {
  const schedule = schedules.value.find(s => s.id === scheduleId)
  if (schedule) {
    schedule.progress = parseInt(progress)
  }
}

// 处理日程创建
const handleScheduleCreated = (newSchedule) => {
  schedules.value.unshift(newSchedule)
  showCreateModal.value = false
}

// 处理日程更新
const handleScheduleUpdated = (updatedSchedule) => {
  const index = schedules.value.findIndex(s => s.id === updatedSchedule.id)
  if (index > -1) {
    schedules.value[index] = updatedSchedule
  }
  showEditModal.value = false
  editingSchedule.value = null
}

// 工具函数
const getPriorityClass = (priority) => {
  const classes = {
    'Vital': 'bg-red-100 text-red-800',
    'Routine': 'bg-yellow-100 text-yellow-800',
    'Fun': 'bg-green-100 text-green-800'
  }
  return classes[priority] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getAssigneeName = (assigneeId) => {
  const member = groupMembers.value.find(m => m.id === assigneeId)
  return member ? member.name : '未分配'
}
</script>
