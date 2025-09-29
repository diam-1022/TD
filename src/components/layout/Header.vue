<template>
  <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
    <!-- 左侧 Logo -->
    <div class="flex items-center space-x-3">
      <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
        <div class="w-4 h-4 border-2 border-white rounded-full"></div>
      </div>
      <h1 class="text-xl font-semibold text-gray-900">Intellecta</h1>
    </div>

    <!-- 中间主题切换 -->
    <div class="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
      <button 
        @click="toggleTheme"
        class="flex items-center space-x-2 px-3 py-1.5 rounded-md transition-colors"
        :class="isDark ? 'bg-white shadow-sm' : 'text-gray-500'"
      >
        <Moon v-if="!isDark" class="w-4 h-4" />
        <Sun v-else class="w-4 h-4" />
      </button>
    </div>

    <!-- 右侧搜索、通知和用户头像 -->
    <div class="flex items-center space-x-4">
      <button class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
        <Search class="w-5 h-5 text-gray-600" />
      </button>
      <NotificationCenter />
      <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
        <span class="text-white text-sm font-medium">M</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { Search, Moon, Sun } from 'lucide-vue-next'
import NotificationCenter from '@/components/notification/NotificationCenter.vue'

const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  // 这里可以添加主题切换逻辑
}
</script>
