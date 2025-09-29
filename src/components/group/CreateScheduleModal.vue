<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- 背景遮罩 -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- 弹窗内容 -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <form @submit.prevent="handleSubmit">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">新建日程</h3>
                
                <div class="space-y-4">
                  <!-- 标题 -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
                    <input
                      v-model="form.title"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="请输入日程标题"
                    />
                    <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
                  </div>

                  <!-- 描述 -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
                    <textarea
                      v-model="form.description"
                      rows="3"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="请输入日程描述"
                    ></textarea>
                  </div>

                  <!-- 任务平台类型 -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">任务平台类型</label>
                    <select
                      v-model="form.platform"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">请选择平台</option>
                      <option value="jira">Jira</option>
                      <option value="trello">Trello</option>
                      <option value="asana">Asana</option>
                      <option value="notion">Notion</option>
                      <option value="other">其他</option>
                    </select>
                  </div>

                  <!-- 截止时间 -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">截止时间 *</label>
                    <input
                      v-model="form.deadline"
                      type="datetime-local"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p v-if="errors.deadline" class="mt-1 text-sm text-red-600">{{ errors.deadline }}</p>
                  </div>

                  <!-- 优先级 -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">优先级</label>
                    <div class="flex space-x-4">
                      <label class="flex items-center">
                        <input
                          v-model="form.priority"
                          type="radio"
                          value="Vital"
                          class="text-red-600 focus:ring-red-500"
                        />
                        <span class="ml-2 text-sm text-gray-700">Vital</span>
                      </label>
                      <label class="flex items-center">
                        <input
                          v-model="form.priority"
                          type="radio"
                          value="Routine"
                          class="text-yellow-600 focus:ring-yellow-500"
                        />
                        <span class="ml-2 text-sm text-gray-700">Routine</span>
                      </label>
                      <label class="flex items-center">
                        <input
                          v-model="form.priority"
                          type="radio"
                          value="Fun"
                          class="text-green-600 focus:ring-green-500"
                        />
                        <span class="ml-2 text-sm text-gray-700">Fun</span>
                      </label>
                    </div>
                  </div>

                  <!-- 标签 -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">标签</label>
                    <div class="space-y-2">
                      <!-- 已有标签 -->
                      <div class="flex flex-wrap gap-2">
                        <label
                          v-for="tag in availableTags"
                          :key="tag"
                          class="flex items-center"
                        >
                          <input
                            v-model="form.tags"
                            type="checkbox"
                            :value="tag"
                            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span class="ml-2 text-sm text-gray-700">{{ tag }}</span>
                        </label>
                      </div>
                      
                      <!-- 自定义标签 -->
                      <div class="flex space-x-2">
                        <input
                          v-model="newTag"
                          type="text"
                          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="添加新标签"
                          @keyup.enter="addCustomTag"
                        />
                        <button
                          type="button"
                          @click="addCustomTag"
                          class="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          添加
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- 分配成员 -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">分配成员</label>
                    <div class="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
                      <label
                        v-for="member in groupMembers"
                        :key="member.id"
                        class="flex items-center"
                      >
                        <input
                          v-model="form.assignees"
                          type="checkbox"
                          :value="member.id"
                          class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span class="ml-2 text-sm text-gray-700">{{ member.name }}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 按钮 -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? '创建中...' : '创建日程' }}
            </button>
            <button
              type="button"
              @click="$emit('close')"
              class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  groupMembers: {
    type: Array,
    default: () => []
  },
  availableTags: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'created'])

// 表单数据
const form = reactive({
  title: '',
  description: '',
  platform: '',
  deadline: '',
  priority: 'Routine',
  tags: [],
  assignees: []
})

// 错误信息
const errors = reactive({
  title: '',
  deadline: ''
})

// 新标签
const newTag = ref('')

// 提交状态
const isSubmitting = ref(false)

// 添加自定义标签
const addCustomTag = () => {
  if (newTag.value.trim() && !props.availableTags.includes(newTag.value.trim())) {
    props.availableTags.push(newTag.value.trim())
    form.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

// 表单验证
const validateForm = () => {
  errors.title = ''
  errors.deadline = ''

  if (!form.title.trim()) {
    errors.title = '请输入日程标题'
    return false
  }

  if (!form.deadline) {
    errors.deadline = '请选择截止时间'
    return false
  }

  const deadline = new Date(form.deadline)
  const now = new Date()
  if (deadline <= now) {
    errors.deadline = '截止时间不能早于当前时间'
    return false
  }

  return true
}

// 提交表单
const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newSchedule = {
      id: Date.now(),
      title: form.title.trim(),
      description: form.description.trim(),
      platform: form.platform,
      deadline: form.deadline,
      priority: form.priority,
      tags: [...form.tags],
      assignee: form.assignees[0] || null, // 主要负责人
      assignees: form.assignees,
      progress: 0,
      subtasks: [],
      attachments: [],
      createdAt: new Date().toISOString()
    }

    emit('created', newSchedule)
    
    // 重置表单
    Object.assign(form, {
      title: '',
      description: '',
      platform: '',
      deadline: '',
      priority: 'Routine',
      tags: [],
      assignees: []
    })
    
    // 显示成功提示
    // 这里可以添加通知组件
    
  } catch (error) {
    console.error('创建日程失败:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
