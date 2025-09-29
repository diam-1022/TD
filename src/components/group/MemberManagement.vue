<template>
  <div class="space-y-6">
    <!-- 操作栏 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <!-- 筛选条件 -->
        <div class="flex items-center space-x-3">
          <select 
            v-model="localFilters.role"
            @change="updateFilters"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">按角色</option>
            <option value="admin">管理员</option>
            <option value="editor">编辑者</option>
            <option value="viewer">查看者</option>
            <option value="restricted">受限用户</option>
          </select>

          <select 
            v-model="localFilters.status"
            @change="updateFilters"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">按状态</option>
            <option value="active">活跃</option>
            <option value="pending">待确认</option>
            <option value="inactive">非活跃</option>
          </select>
        </div>
      </div>

      <button 
        @click="showInviteModal = true"
        class="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <UserPlus class="w-4 h-4" />
        <span>邀请成员</span>
      </button>
    </div>

    <!-- 成员列表 -->
    <div class="bg-white rounded-lg border">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                成员
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                角色
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                加入时间
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="member in filteredMembers" :key="member.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <span class="text-white font-medium text-sm">
                        {{ member.name.charAt(0) }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ member.name }}</div>
                    <div class="text-sm text-gray-500">{{ member.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <select
                  v-if="canEditRole(member)"
                  v-model="member.role"
                  @change="updateMemberRole(member)"
                  class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="admin">管理员</option>
                  <option value="editor">编辑者</option>
                  <option value="viewer">查看者</option>
                  <option value="restricted">受限用户</option>
                </select>
                <span v-else class="text-sm text-gray-900">{{ getRoleName(member.role) }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    getStatusClass(member.status)
                  ]"
                >
                  {{ getStatusName(member.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(member.joinedAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  v-if="canRemoveMember(member)"
                  @click="confirmRemoveMember(member)"
                  class="text-red-600 hover:text-red-900 transition-colors"
                >
                  移除
                </button>
                <span v-else class="text-gray-400">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredMembers.length === 0" class="p-12 text-center">
        <Users class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">暂无成员</h3>
        <p class="text-gray-500 mb-4">邀请成员加入群组</p>
        <button 
          @click="showInviteModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          邀请成员
        </button>
      </div>
    </div>

    <!-- 邀请成员弹窗 -->
    <InviteMemberModal
      v-if="showInviteModal"
      :show="showInviteModal"
      @close="showInviteModal = false"
      @invited="handleMemberInvited"
    />

    <!-- 移除成员确认弹窗 -->
    <ConfirmModal
      v-if="showRemoveModal"
      :show="showRemoveModal"
      title="移除成员"
      :confirm-text="'确认移除'"
      :cancel-text="'取消'"
      confirm-class="bg-red-600 hover:bg-red-700"
      @confirm="removeMember"
      @cancel="showRemoveModal = false"
    >
      <div class="space-y-4">
        <p class="text-gray-600">
          确定要移除成员 <strong>{{ removingMember?.name }}</strong> 吗？
        </p>
        <p class="text-sm text-red-600">
          移除后该成员将无法访问群组内容，相关数据会被保留。
        </p>
      </div>
    </ConfirmModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { UserPlus, Users } from 'lucide-vue-next'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import InviteMemberModal from '@/components/group/InviteMemberModal.vue'

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

// 本地状态
const localFilters = reactive({ ...props.filters })

// 成员数据
const members = ref([
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    role: 'admin',
    status: 'active',
    joinedAt: '2024-01-01T00:00:00Z',
    isCurrentUser: true
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    role: 'editor',
    status: 'active',
    joinedAt: '2024-01-05T00:00:00Z',
    isCurrentUser: false
  },
  {
    id: 3,
    name: '王五',
    email: 'wangwu@example.com',
    role: 'viewer',
    status: 'pending',
    joinedAt: '2024-01-10T00:00:00Z',
    isCurrentUser: false
  },
  {
    id: 4,
    name: '赵六',
    email: 'zhaoliu@example.com',
    role: 'restricted',
    status: 'inactive',
    joinedAt: '2024-01-08T00:00:00Z',
    isCurrentUser: false
  }
])

// 弹窗状态
const showInviteModal = ref(false)
const showRemoveModal = ref(false)
const removingMember = ref(null)

// 筛选后的成员
const filteredMembers = computed(() => {
  let result = [...members.value]

  // 应用筛选
  if (localFilters.role) {
    result = result.filter(m => m.role === localFilters.role)
  }
  if (localFilters.status) {
    result = result.filter(m => m.status === localFilters.status)
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

// 更新成员角色
const updateMemberRole = async (member) => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 显示成功提示
    console.log(`已将 ${member.name} 的角色更新为 ${getRoleName(member.role)}`)
  } catch (error) {
    console.error('更新角色失败:', error)
    // 恢复原角色
    // member.role = originalRole
  }
}

// 确认移除成员
const confirmRemoveMember = (member) => {
  removingMember.value = member
  showRemoveModal.value = true
}

// 移除成员
const removeMember = async () => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = members.value.findIndex(m => m.id === removingMember.value.id)
    if (index > -1) {
      members.value.splice(index, 1)
    }
    
    showRemoveModal.value = false
    removingMember.value = null
    
    // 显示成功提示
    console.log('成员已移除')
  } catch (error) {
    console.error('移除成员失败:', error)
  }
}

// 处理成员邀请
const handleMemberInvited = (newMember) => {
  members.value.push(newMember)
  showInviteModal.value = false
}

// 权限检查
const canEditRole = (member) => {
  // 当前用户是管理员且不是编辑自己
  return !member.isCurrentUser
}

const canRemoveMember = (member) => {
  // 不能移除自己
  return !member.isCurrentUser
}

// 工具函数
const getRoleName = (role) => {
  const roleNames = {
    'admin': '管理员',
    'editor': '编辑者',
    'viewer': '查看者',
    'restricted': '受限用户'
  }
  return roleNames[role] || role
}

const getStatusName = (status) => {
  const statusNames = {
    'active': '活跃',
    'pending': '待确认',
    'inactive': '非活跃'
  }
  return statusNames[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    'active': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'inactive': 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}
</script>
