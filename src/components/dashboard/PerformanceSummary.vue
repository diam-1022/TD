<template>
  <Card class="h-80">
    <CardHeader class="flex flex-row items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">我的群组</h3>
        <p class="text-sm text-gray-600">管理你的群组</p>
      </div>
      <div class="flex items-center space-x-2">
        <button 
          @click="showCreateModal = true"
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="创建群组"
        >
          <Plus class="w-4 h-4 text-gray-600" />
        </button>
        <button class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <MoreHorizontal class="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </CardHeader>
    
    <CardContent class="p-6 pt-0">
      <!-- 群组列表 -->
      <div class="space-y-3 max-h-48 overflow-y-auto">
        <div 
          v-for="group in groups" 
          :key="group.id"
          class="group relative p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          @click="enterGroup(group.id)"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h4 class="font-medium text-gray-900">{{ group.name }}</h4>
              <p class="text-sm text-gray-500">{{ group.memberCount }} 成员</p>
            </div>
            <div class="flex items-center space-x-1">
              <span 
                v-if="group.isAdmin" 
                class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
              >
                管理员
              </span>
            </div>
          </div>
          
          <!-- 悬停操作菜单 -->
          <div 
            v-if="group.isAdmin"
            class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div class="flex space-x-1">
              <button 
                @click.stop="editGroupName(group)"
                class="p-1 rounded hover:bg-gray-200 transition-colors"
                title="编辑名称"
              >
                <Edit class="w-3 h-3 text-gray-600" />
              </button>
              <button 
                @click.stop="confirmDeleteGroup(group)"
                class="p-1 rounded hover:bg-red-100 transition-colors"
                title="解散群组"
              >
                <Trash2 class="w-3 h-3 text-red-600" />
              </button>
            </div>
          </div>
        </div>
        
        <!-- 空状态 -->
        <div v-if="groups.length === 0" class="text-center py-8 text-gray-500">
          <Users class="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p class="text-sm">还没有群组</p>
          <button 
            @click="showCreateModal = true"
            class="text-blue-600 hover:text-blue-700 text-sm mt-1"
          >
            创建第一个群组
          </button>
        </div>
      </div>
    </CardContent>

    <!-- 创建群组弹窗 -->
    <ConfirmModal
      v-if="showCreateModal"
      :show="showCreateModal"
      title="创建群组"
      :confirm-text="'创建'"
      :cancel-text="'取消'"
      @confirm="createGroup"
      @cancel="showCreateModal = false"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">群组名称</label>
          <Input 
            v-model="newGroupName"
            placeholder="请输入群组名称"
            class="w-full"
          />
        </div>
      </div>
    </ConfirmModal>

    <!-- 编辑群组名称弹窗 -->
    <ConfirmModal
      v-if="showEditModal"
      :show="showEditModal"
      title="编辑群组名称"
      :confirm-text="'保存'"
      :cancel-text="'取消'"
      @confirm="saveGroupName"
      @cancel="showEditModal = false"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">群组名称</label>
          <Input 
            v-model="editingGroupName"
            placeholder="请输入群组名称"
            class="w-full"
          />
        </div>
      </div>
    </ConfirmModal>

    <!-- 解散群组确认弹窗 -->
    <ConfirmModal
      v-if="showDeleteModal"
      :show="showDeleteModal"
      title="解散群组"
      :confirm-text="'确认解散'"
      :cancel-text="'取消'"
      confirm-class="bg-red-600 hover:bg-red-700"
      @confirm="deleteGroup"
      @cancel="showDeleteModal = false"
    >
      <div class="space-y-4">
        <p class="text-gray-600">
          确定要解散群组 <strong>{{ deletingGroup?.name }}</strong> 吗？
        </p>
        <p class="text-sm text-red-600">
          此操作不可撤销，群组内的所有数据将被删除。
        </p>
      </div>
    </ConfirmModal>
  </Card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, MoreHorizontal, Edit, Trash2, Users } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Input from '@/components/ui/Input.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'

const router = useRouter()

// 群组数据
const groups = ref([
  {
    id: 1,
    name: '产品开发团队',
    memberCount: 8,
    isAdmin: true
  },
  {
    id: 2,
    name: '设计讨论组',
    memberCount: 5,
    isAdmin: false
  },
  {
    id: 3,
    name: '技术分享群',
    memberCount: 12,
    isAdmin: true
  }
])

// 弹窗状态
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

// 表单数据
const newGroupName = ref('')
const editingGroupName = ref('')
const editingGroup = ref(null)
const deletingGroup = ref(null)

// 创建群组
const createGroup = () => {
  if (!newGroupName.value.trim()) return
  
  const newGroup = {
    id: Date.now(),
    name: newGroupName.value.trim(),
    memberCount: 1,
    isAdmin: true
  }
  
  groups.value.unshift(newGroup)
  newGroupName.value = ''
  showCreateModal.value = false
}

// 进入群组
const enterGroup = (groupId) => {
  router.push(`/group/${groupId}`)
}

// 编辑群组名称
const editGroupName = (group) => {
  editingGroup.value = group
  editingGroupName.value = group.name
  showEditModal.value = true
}

// 保存群组名称
const saveGroupName = () => {
  if (!editingGroupName.value.trim()) return
  
  const group = groups.value.find(g => g.id === editingGroup.value.id)
  if (group) {
    group.name = editingGroupName.value.trim()
  }
  
  showEditModal.value = false
  editingGroup.value = null
  editingGroupName.value = ''
}

// 确认删除群组
const confirmDeleteGroup = (group) => {
  deletingGroup.value = group
  showDeleteModal.value = true
}

// 删除群组
const deleteGroup = () => {
  const index = groups.value.findIndex(g => g.id === deletingGroup.value.id)
  if (index > -1) {
    groups.value.splice(index, 1)
  }
  
  showDeleteModal.value = false
  deletingGroup.value = null
}
</script>
