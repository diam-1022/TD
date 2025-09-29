<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <!-- 标题 -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-gray-900">
            {{ isEdit ? '编辑任务' : '新建任务' }}
          </h3>
          <button 
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- 表单 -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- 基本信息 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                任务标题 <span class="text-red-500">*</span>
              </label>
              <Input 
                v-model="form.title"
                placeholder="请输入任务标题"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                负责人
              </label>
              <Input 
                v-model="form.assignee"
                placeholder="请输入负责人"
              />
            </div>
          </div>

          <!-- 描述 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              任务描述
            </label>
            <textarea 
              v-model="form.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入任务描述"
            ></textarea>
          </div>

          <!-- 优先级和状态 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                优先级 <span class="text-red-500">*</span>
              </label>
              <select 
                v-model="form.priority"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">请选择优先级</option>
                <option value="Vital">Vital - 重要紧急</option>
                <option value="Routine">Routine - 常规任务</option>
                <option value="Fun">Fun - 轻松有趣</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                状态
              </label>
              <select 
                v-model="form.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="待开始">待开始</option>
                <option value="进行中">进行中</option>
                <option value="已完成">已完成</option>
              </select>
            </div>
          </div>

          <!-- 时间和群组 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                截止时间 <span class="text-red-500">*</span>
              </label>
              <Input 
                v-model="form.deadline"
                type="datetime-local"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                所属群组
              </label>
              <select 
                v-model="form.groupId"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">请选择群组</option>
                <option v-for="group in groups" :key="group.id" :value="group.id">
                  {{ group.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- 进度 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              完成进度
            </label>
            <div class="flex items-center space-x-3">
              <input 
                v-model.number="form.progress"
                type="range"
                min="0"
                max="100"
                class="flex-1"
              />
              <span class="text-sm font-medium text-gray-700 w-12">
                {{ form.progress }}%
              </span>
            </div>
          </div>

          <!-- 标签 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              标签
            </label>
            <div class="flex flex-wrap gap-2 mb-2">
              <Badge 
                v-for="tag in form.tags" 
                :key="tag" 
                variant="secondary"
                class="flex items-center space-x-1"
              >
                <span>{{ tag }}</span>
                <button 
                  type="button"
                  @click="removeTag(tag)"
                  class="ml-1 hover:text-red-500"
                >
                  <X class="w-3 h-3" />
                </button>
              </Badge>
            </div>
            <div class="flex space-x-2">
              <Input 
                v-model="newTag"
                placeholder="输入标签名称"
                @keyup.enter="addTag"
                class="flex-1"
              />
              <Button 
                type="button"
                variant="outline"
                @click="addTag"
                :disabled="!newTag.trim()"
              >
                添加
              </Button>
            </div>
          </div>

          <!-- 子任务 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              子任务
            </label>
            <div class="space-y-2 mb-2">
              <div 
                v-for="(subtask, index) in form.subtasks" 
                :key="index"
                class="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg"
              >
                <input 
                  v-model="subtask.completed"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600"
                />
                <Input 
                  v-model="subtask.title"
                  placeholder="子任务标题"
                  class="flex-1"
                />
                <button 
                  type="button"
                  @click="removeSubtask(index)"
                  class="text-red-500 hover:text-red-700"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
            <Button 
              type="button"
              variant="outline"
              @click="addSubtask"
              class="w-full"
            >
              <Plus class="w-4 h-4 mr-2" />
              添加子任务
            </Button>
          </div>

          <!-- 按钮 -->
          <div class="flex justify-end space-x-3 pt-4 border-t">
            <Button 
              type="button"
              variant="outline" 
              @click="$emit('close')"
            >
              取消
            </Button>
            <Button 
              type="submit"
              :disabled="!isFormValid"
            >
              {{ isEdit ? '保存修改' : '创建任务' }}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { X, Plus, Trash2 } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Badge from '@/components/ui/Badge.vue'

const props = defineProps({
  schedule: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'save'])

// 表单数据
const form = ref({
  title: '',
  description: '',
  priority: '',
  status: '待开始',
  progress: 0,
  assignee: '',
  groupId: '',
  deadline: '',
  tags: [],
  subtasks: []
})

const newTag = ref('')
const groups = ref([])

// 计算属性
const isFormValid = computed(() => {
  return form.value.title.trim() && 
         form.value.priority && 
         form.value.deadline
})

// 方法
const addTag = () => {
  if (newTag.value.trim() && !form.value.tags.includes(newTag.value.trim())) {
    form.value.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

const removeTag = (tag) => {
  const index = form.value.tags.indexOf(tag)
  if (index > -1) {
    form.value.tags.splice(index, 1)
  }
}

const addSubtask = () => {
  form.value.subtasks.push({
    title: '',
    completed: false
  })
}

const removeSubtask = (index) => {
  form.value.subtasks.splice(index, 1)
}

const handleSubmit = () => {
  if (!isFormValid.value) return
  
  // 格式化截止时间
  const scheduleData = {
    ...form.value,
    deadline: new Date(form.value.deadline),
    progress: parseInt(form.value.progress)
  }
  
  emit('save', scheduleData)
}

const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    priority: '',
    status: '待开始',
    progress: 0,
    assignee: '',
    groupId: '',
    deadline: '',
    tags: [],
    subtasks: []
  }
}

// 监听props变化
watch(() => props.schedule, (newSchedule) => {
  if (newSchedule && props.isEdit) {
    // 编辑模式，填充表单
    form.value = {
      title: newSchedule.title || '',
      description: newSchedule.description || '',
      priority: newSchedule.priority || '',
      status: newSchedule.status || '待开始',
      progress: newSchedule.progress || 0,
      assignee: newSchedule.assignee || '',
      groupId: newSchedule.groupId || '',
      deadline: newSchedule.deadline ? 
        new Date(newSchedule.deadline).toISOString().slice(0, 16) : '',
      tags: [...(newSchedule.tags || [])],
      subtasks: [...(newSchedule.subtasks || [])]
    }
  } else {
    // 创建模式，重置表单
    resetForm()
  }
}, { immediate: true })

onMounted(() => {
  // 模拟群组数据
  groups.value = [
    { id: 1, name: '产品开发组' },
    { id: 2, name: '运营团队' },
    { id: 3, name: '设计团队' }
  ]
})
</script>
