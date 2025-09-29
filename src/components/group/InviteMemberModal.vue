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
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">邀请成员</h3>
                
                <div class="space-y-4">
                  <!-- 用户邮箱/用户名 -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">用户邮箱或用户名 *</label>
                    <input
                      v-model="form.userIdentifier"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="请输入用户邮箱或用户名"
                    />
                    <p v-if="errors.userIdentifier" class="mt-1 text-sm text-red-600">{{ errors.userIdentifier }}</p>
                  </div>

                  <!-- 角色选择 -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">角色 *</label>
                    <div class="space-y-2">
                      <label class="flex items-start">
                        <input
                          v-model="form.role"
                          type="radio"
                          value="admin"
                          class="mt-1 text-blue-600 focus:ring-blue-500"
                        />
                        <div class="ml-3">
                          <div class="text-sm font-medium text-gray-900">管理员</div>
                          <div class="text-sm text-gray-500">可以管理群组、邀请成员、删除内容</div>
                        </div>
                      </label>
                      
                      <label class="flex items-start">
                        <input
                          v-model="form.role"
                          type="radio"
                          value="editor"
                          class="mt-1 text-blue-600 focus:ring-blue-500"
                        />
                        <div class="ml-3">
                          <div class="text-sm font-medium text-gray-900">编辑者</div>
                          <div class="text-sm text-gray-500">可以创建和编辑内容，但不能管理群组</div>
                        </div>
                      </label>
                      
                      <label class="flex items-start">
                        <input
                          v-model="form.role"
                          type="radio"
                          value="viewer"
                          class="mt-1 text-blue-600 focus:ring-blue-500"
                        />
                        <div class="ml-3">
                          <div class="text-sm font-medium text-gray-900">查看者</div>
                          <div class="text-sm text-gray-500">只能查看内容，不能编辑</div>
                        </div>
                      </label>
                      
                      <label class="flex items-start">
                        <input
                          v-model="form.role"
                          type="radio"
                          value="restricted"
                          class="mt-1 text-blue-600 focus:ring-blue-500"
                        />
                        <div class="ml-3">
                          <div class="text-sm font-medium text-gray-900">受限用户</div>
                          <div class="text-sm text-gray-500">只能访问指定的内容</div>
                        </div>
                      </label>
                    </div>
                    <p v-if="errors.role" class="mt-1 text-sm text-red-600">{{ errors.role }}</p>
                  </div>

                  <!-- 邀请消息 -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">邀请消息</label>
                    <textarea
                      v-model="form.message"
                      rows="3"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="可选：添加个人化的邀请消息"
                    ></textarea>
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
              {{ isSubmitting ? '发送中...' : '发送邀请' }}
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
  }
})

const emit = defineEmits(['close', 'invited'])

// 表单数据
const form = reactive({
  userIdentifier: '',
  role: 'viewer',
  message: ''
})

// 错误信息
const errors = reactive({
  userIdentifier: '',
  role: ''
})

// 提交状态
const isSubmitting = ref(false)

// 表单验证
const validateForm = () => {
  errors.userIdentifier = ''
  errors.role = ''

  if (!form.userIdentifier.trim()) {
    errors.userIdentifier = '请输入用户邮箱或用户名'
    return false
  }

  if (!form.role) {
    errors.role = '请选择角色'
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

    // 模拟不同的响应情况
    const random = Math.random()
    
    if (random < 0.1) {
      // 用户不存在
      errors.userIdentifier = '未找到该用户，请确认账号正确'
      return
    } else if (random < 0.2) {
      // 用户已在群组中
      errors.userIdentifier = '该用户已在群组内'
      return
    }

    // 邀请成功
    const newMember = {
      id: Date.now(),
      name: form.userIdentifier.split('@')[0], // 简单提取用户名
      email: form.userIdentifier.includes('@') ? form.userIdentifier : `${form.userIdentifier}@example.com`,
      role: form.role,
      status: 'pending',
      joinedAt: new Date().toISOString(),
      isCurrentUser: false
    }

    emit('invited', newMember)
    
    // 重置表单
    Object.assign(form, {
      userIdentifier: '',
      role: 'viewer',
      message: ''
    })
    
    // 显示成功提示
    console.log('邀请已发送')
    
  } catch (error) {
    console.error('发送邀请失败:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
