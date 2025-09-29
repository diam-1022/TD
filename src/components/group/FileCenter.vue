<template>
  <div class="space-y-6">
    <!-- 操作栏 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <!-- 筛选条件 -->
        <div class="flex items-center space-x-3">
          <select 
            v-model="localFilters.schedule"
            @change="updateFilters"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">按关联日程</option>
            <option v-for="schedule in groupSchedules" :key="schedule.id" :value="schedule.id">
              {{ schedule.title }}
            </option>
          </select>

          <select 
            v-model="localFilters.timeRange"
            @change="updateFilters"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">按上传时间</option>
            <option value="today">今日</option>
            <option value="week">本周</option>
            <option value="month">本月</option>
          </select>

          <select 
            v-model="localFilters.fileType"
            @change="updateFilters"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">按文件类型</option>
            <option value="document">文档</option>
            <option value="image">图片</option>
            <option value="archive">压缩包</option>
            <option value="other">其他</option>
          </select>
        </div>
      </div>

      <button 
        @click="showUploadModal = true"
        class="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Upload class="w-4 h-4" />
        <span>上传文件</span>
      </button>
    </div>

    <!-- 文件列表 -->
    <div class="bg-white rounded-lg border">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                文件
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                大小
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                关联日程
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                上传者
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                上传时间
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="file in filteredFiles" :key="file.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8">
                    <div 
                      :class="[
                        'h-8 w-8 rounded flex items-center justify-center',
                        getFileTypeClass(file.type)
                      ]"
                    >
                      <component :is="getFileIcon(file.type)" class="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ file.name }}</div>
                    <div class="text-sm text-gray-500">{{ file.type }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatFileSize(file.size) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button
                  @click="viewSchedule(file.scheduleId)"
                  class="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {{ getScheduleName(file.scheduleId) }}
                </button>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ file.uploader }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(file.uploadedAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-3">
                  <button
                    @click="downloadFile(file)"
                    class="text-blue-600 hover:text-blue-900 transition-colors"
                  >
                    下载
                  </button>
                  <button
                    v-if="canDeleteFile(file)"
                    @click="confirmDeleteFile(file)"
                    class="text-red-600 hover:text-red-900 transition-colors"
                  >
                    删除
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredFiles.length === 0" class="p-12 text-center">
        <Folder class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">暂无文件</h3>
        <p class="text-gray-500 mb-4">上传文件开始协作</p>
        <button 
          @click="showUploadModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          上传文件
        </button>
      </div>
    </div>

    <!-- 上传文件弹窗 -->
    <UploadFileModal
      v-if="showUploadModal"
      :show="showUploadModal"
      :group-schedules="groupSchedules"
      @close="showUploadModal = false"
      @uploaded="handleFileUploaded"
    />

    <!-- 删除文件确认弹窗 -->
    <ConfirmModal
      v-if="showDeleteModal"
      :show="showDeleteModal"
      title="删除文件"
      :confirm-text="'确认删除'"
      :cancel-text="'取消'"
      confirm-class="bg-red-600 hover:bg-red-700"
      @confirm="deleteFile"
      @cancel="showDeleteModal = false"
    >
      <div class="space-y-4">
        <p class="text-gray-600">
          确定要删除文件 <strong>{{ deletingFile?.name }}</strong> 吗？
        </p>
        <p class="text-sm text-red-600">
          删除后不可恢复，关联日程中的文件引用也会被移除。
        </p>
      </div>
    </ConfirmModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Upload, Folder, FileText, Image, Archive, File 
} from 'lucide-vue-next'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import UploadFileModal from '@/components/group/UploadFileModal.vue'

const props = defineProps({
  groupId: {
    type: String,
    required: true
  },
  filters: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update-filters'])

const router = useRouter()

// 本地状态
const localFilters = reactive({ ...props.filters })

// 文件数据
const files = ref([
  {
    id: 1,
    name: '需求文档.pdf',
    type: 'document',
    size: 1024000,
    scheduleId: 1,
    uploader: '张三',
    uploadedAt: '2024-01-10T10:00:00Z'
  },
  {
    id: 2,
    name: '用户调研报告.docx',
    type: 'document',
    size: 512000,
    scheduleId: 1,
    uploader: '李四',
    uploadedAt: '2024-01-11T14:30:00Z'
  },
  {
    id: 3,
    name: '架构设计图.png',
    type: 'image',
    size: 2048000,
    scheduleId: 2,
    uploader: '王五',
    uploadedAt: '2024-01-12T09:15:00Z'
  },
  {
    id: 4,
    name: '代码压缩包.zip',
    type: 'archive',
    size: 5120000,
    scheduleId: 2,
    uploader: '赵六',
    uploadedAt: '2024-01-13T16:45:00Z'
  }
])

// 群组日程
const groupSchedules = ref([
  { id: 1, title: '产品需求评审' },
  { id: 2, title: '技术架构设计' }
])

// 弹窗状态
const showUploadModal = ref(false)
const showDeleteModal = ref(false)
const deletingFile = ref(null)

// 筛选后的文件
const filteredFiles = computed(() => {
  let result = [...files.value]

  // 应用筛选
  if (localFilters.schedule) {
    result = result.filter(f => f.scheduleId === parseInt(localFilters.schedule))
  }
  
  if (localFilters.timeRange) {
    const now = new Date()
    const filterDate = new Date()
    
    switch (localFilters.timeRange) {
      case 'today':
        filterDate.setHours(0, 0, 0, 0)
        break
      case 'week':
        filterDate.setDate(now.getDate() - 7)
        break
      case 'month':
        filterDate.setMonth(now.getMonth() - 1)
        break
    }
    
    result = result.filter(f => new Date(f.uploadedAt) >= filterDate)
  }
  
  if (localFilters.fileType) {
    result = result.filter(f => f.type === localFilters.fileType)
  }

  return result
})

// 监听props变化
watch(() => props.filters, (newFilters) => {
  Object.assign(localFilters, newFilters)
}, { deep: true })

// 更新筛选条件
const updateFilters = () => {
  emit('update-filters', { ...localFilters })
}

// 下载文件
const downloadFile = (file) => {
  // 模拟文件下载
  console.log('下载文件:', file.name)
  // 实际实现中，这里会调用后端API获取下载链接
}

// 查看关联日程
const viewSchedule = (scheduleId) => {
  // 跳转到日程详情页
  router.push(`/group/${props.groupId}/schedule/${scheduleId}`)
}

// 确认删除文件
const confirmDeleteFile = (file) => {
  deletingFile.value = file
  showDeleteModal.value = true
}

// 删除文件
const deleteFile = async () => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = files.value.findIndex(f => f.id === deletingFile.value.id)
    if (index > -1) {
      files.value.splice(index, 1)
    }
    
    showDeleteModal.value = false
    deletingFile.value = null
    
    // 显示成功提示
    console.log('文件已删除')
  } catch (error) {
    console.error('删除文件失败:', error)
  }
}

// 处理文件上传
const handleFileUploaded = (newFile) => {
  files.value.unshift(newFile)
  showUploadModal.value = false
}

// 权限检查
const canDeleteFile = (file) => {
  // 这里可以根据用户权限和文件上传者来判断
  return true
}

// 工具函数
const getFileIcon = (type) => {
  const icons = {
    'document': FileText,
    'image': Image,
    'archive': Archive,
    'other': File
  }
  return icons[type] || File
}

const getFileTypeClass = (type) => {
  const classes = {
    'document': 'bg-blue-500',
    'image': 'bg-green-500',
    'archive': 'bg-yellow-500',
    'other': 'bg-gray-500'
  }
  return classes[type] || 'bg-gray-500'
}

const getScheduleName = (scheduleId) => {
  const schedule = groupSchedules.value.find(s => s.id === scheduleId)
  return schedule ? schedule.title : '未知日程'
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}
</script>
