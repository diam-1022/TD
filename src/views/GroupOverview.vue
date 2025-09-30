
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 页面头部 -->
    <div class="bg-white border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <button 
              @click="$router.back()"
              class="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft class="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 class="text-xl font-semibold text-gray-900">{{ groupName }}</h1>
              <p class="text-sm text-gray-500">群组概况</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <span class="text-sm text-gray-500">{{ memberCount }} 成员</span>
            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-medium">{{ groupName.charAt(0) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 标签栏 -->
    <div class="bg-white border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="switchTab(tab.id)"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- 日程列表 -->
      <ScheduleList 
        v-if="activeTab === 'schedule'"
        :group-id="groupId"
        :filters="tabStates.schedule.filters"
        :sort="tabStates.schedule.sort"
        @update-filters="updateScheduleFilters"
        @update-sort="updateScheduleSort"
      />

      <!-- 成员管理 -->
      <MemberManagement 
        v-if="activeTab === 'members'"
        :group-id="groupId"
        :filters="tabStates.members.filters"
        @update-filters="updateMemberFilters"
      />

      <!-- 文件中心 -->
      <FileCenter 
        v-if="activeTab === 'files'"
        :group-id="groupId"
        :filters="tabStates.files.filters"
        @update-filters="updateFileFilters"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import ScheduleList from '@/components/group/ScheduleList.vue'
import MemberManagement from '@/components/group/MemberManagement.vue'
import FileCenter from '@/components/group/FileCenter.vue'

const route = useRoute()
const groupId = route.params.id

// 标签配置
const tabs = [
  { id: 'schedule', name: '日程列表' },
  { id: 'members', name: '成员管理' },
  { id: 'files', name: '文件中心' }
]

// 当前激活标签
const activeTab = ref('schedule')

// 群组信息
const groupName = ref('产品开发团队')
const memberCount = ref(8)

// 各标签的状态保持
const tabStates = reactive({
  schedule: {
    filters: {
      priority: '',
      tag: '',
      assignee: ''
    },
    sort: {
      field: 'deadline',
      order: 'asc'
    }
  },
  members: {
    filters: {
      role: '',
      status: ''
    }
  },
  files: {
    filters: {
      schedule: '',
      timeRange: '',
      fileType: ''
    }
  }
})

// 切换标签
const switchTab = (tabId) => {
  activeTab.value = tabId
}

// 更新日程筛选条件
const updateScheduleFilters = (filters) => {
  tabStates.schedule.filters = { ...filters }
}

// 更新日程排序
const updateScheduleSort = (sort) => {
  tabStates.schedule.sort = { ...sort }
}

// 更新成员筛选条件
const updateMemberFilters = (filters) => {
  tabStates.members.filters = { ...filters }
}

// 更新文件筛选条件
const updateFileFilters = (filters) => {
  tabStates.files.filters = { ...filters }
}

// 获取群组信息
const fetchGroupInfo = async () => {
  // 模拟API调用
  // const response = await api.getGroup(groupId)
  // groupName.value = response.name
  // memberCount.value = response.memberCount
}

onMounted(() => {
  fetchGroupInfo()
})
</script>
