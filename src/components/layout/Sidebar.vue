<template>
  <div class="w-16 h-full bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-6">
    <!-- 汉堡菜单 -->
    <button class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
      <Menu class="w-5 h-5 text-gray-600" />
    </button>

    <!-- 导航图标 -->
    <div class="flex flex-col space-y-4">
      <button 
        class="p-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        @click="navigateToHome"
      >
        <Home class="w-5 h-5" />
      </button>
      <button 
        class="p-3 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        @click="navigateToSchedule"
      >
        <Grid3X3 class="w-5 h-5" />
      </button>
      <button 
        class="p-3 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        @click="navigateToGroup"
      >
        <Zap class="w-5 h-5" />
      </button>
      <button class="p-3 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
        <FileText class="w-5 h-5" />
      </button>
    </div>

    <!-- 底部刷新按钮 -->
    <div class="mt-auto">
      <button class="p-3 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
        <RotateCcw class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Menu, Home, Grid3X3, Zap, FileText, RotateCcw } from 'lucide-vue-next'

const router = useRouter()

const navigateToHome = () => {
  router.push('/')
}

const navigateToSchedule = () => {
  router.push('/schedule')
}

const navigateToGroup = () => {
  router.push('/group/1')
}
</script>
