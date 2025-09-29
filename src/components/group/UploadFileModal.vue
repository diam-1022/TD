<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- 背景遮罩 -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- 弹窗内容 -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">上传文件</h3>
              
              <div class="space-y-4">
                <!-- 文件选择 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">选择文件 *</label>
                  <div 
                    @click="triggerFileInput"
                    @dragover.prevent
                    @drop.prevent="handleDrop"
                    class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                  >
                    <Upload class="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p class="text-sm text-gray-600">点击选择文件或拖拽文件到此处</p>
                    <p class="text-xs text-gray-500 mt-1">支持多文件上传，最大 100MB</p>
                  </div>
                  <input
                    ref="fileInput"
                    type="file"
                    multiple
                    @change="handleFileSelect"
                    class="hidden"
                  />
                </div>

                <!-- 关联日程 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">关联日程 *</label>
                  <select
                    v-model="selectedSchedule"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">请选择关联日程</option>
                    <option v-for="schedule in groupSchedules" :key="schedule.id" :value="schedule.id">
                      {{ schedule.title }}
                    </option>
                  </select>
                  <p v-if="errors.schedule" class="mt-1 text-sm text-red-600">{{ errors.schedule }}</p>
                </div>

                <!-- 文件列表 -->
                <div v-if="selectedFiles.length > 0">
                  <label class="block text-sm font-medium text-gray-700 mb-1">待上传文件</label>
                  <div class="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
                    <div 
                      v-for="(file, index) in selectedFiles" 
                      :key="index"
                      class="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div class="flex items-center space-x-2">
                        <File class="w-4 h-4 text-gray-500" />
                        <span class="text-sm text-gray-900">{{ file.name }}</span>
                        <span class="text-xs text-gray-500">({{ formatFileSize(file.size) }})</span>
                      </div>
                      <button
                        @click="removeFile(index)"
                        class="text-red-600 hover:text-red-800 text-sm"
                      >
                        移除
                      </button>
                    </div>
                  </div>
                </div>

                <!-- 上传进度 -->
                <div v-if="uploading" class="space-y-2">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">上传进度</span>
                    <span class="text-gray-900">{{ uploadProgress }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      :style="{ width: uploadProgress + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 按钮 -->
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            @click="handleUpload"
            :disabled="!canUpload || uploading"
            class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ uploading ? '上传中...' : '开始上传' }}
          </button>
          <button
            @click="$emit('close')"
            :disabled="uploading"
            class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Upload, File } from 'lucide-vue-next'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  groupSchedules: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'uploaded'])

// 文件输入引用
const fileInput = ref(null)

// 表单数据
const selectedFiles = ref([])
const selectedSchedule = ref('')
const uploading = ref(false)
const uploadProgress = ref(0)

// 错误信息
const errors = reactive({
  schedule: ''
})

// 计算属性
const canUpload = computed(() => {
  return selectedFiles.value.length > 0 && selectedSchedule.value
})

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value.click()
}

// 处理文件选择
const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  addFiles(files)
}

// 处理拖拽
const handleDrop = (event) => {
  const files = Array.from(event.dataTransfer.files)
  addFiles(files)
}

// 添加文件
const addFiles = (files) => {
  const maxSize = 100 * 1024 * 1024 // 100MB
  
  files.forEach(file => {
    if (file.size > maxSize) {
      alert(`文件 ${file.name} 超过最大限制（100MB），请压缩后上传`)
      return
    }
    
    // 检查是否已存在同名文件
    const exists = selectedFiles.value.some(f => f.name === file.name)
    if (!exists) {
      selectedFiles.value.push(file)
    }
  })
}

// 移除文件
const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

// 上传文件
const handleUpload = async () => {
  if (!canUpload.value) return

  // 验证关联日程
  if (!selectedSchedule.value) {
    errors.schedule = '请选择关联日程'
    return
  }

  uploading.value = true
  uploadProgress.value = 0

  try {
    // 模拟上传过程
    for (let i = 0; i < selectedFiles.value.length; i++) {
      const file = selectedFiles.value[i]
      
      // 模拟上传进度
      for (let progress = 0; progress <= 100; progress += 10) {
        uploadProgress.value = Math.round(((i * 100 + progress) / selectedFiles.value.length))
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      // 创建文件记录
      const newFile = {
        id: Date.now() + i,
        name: file.name,
        type: getFileType(file.name),
        size: file.size,
        scheduleId: parseInt(selectedSchedule.value),
        uploader: '当前用户', // 实际应用中从用户状态获取
        uploadedAt: new Date().toISOString()
      }
      
      emit('uploaded', newFile)
    }
    
    // 重置状态
    selectedFiles.value = []
    selectedSchedule.value = ''
    uploadProgress.value = 0
    
    // 显示成功提示
    console.log('文件上传成功')
    
  } catch (error) {
    console.error('文件上传失败:', error)
    alert('文件上传失败，请重试')
  } finally {
    uploading.value = false
  }
}

// 工具函数
const getFileType = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase()
  
  const documentTypes = ['pdf', 'doc', 'docx', 'txt', 'rtf']
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg']
  const archiveTypes = ['zip', 'rar', '7z', 'tar', 'gz']
  
  if (documentTypes.includes(extension)) return 'document'
  if (imageTypes.includes(extension)) return 'image'
  if (archiveTypes.includes(extension)) return 'archive'
  return 'other'
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>
