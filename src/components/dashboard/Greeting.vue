<template>
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">bro早上好啊(๑•̀ㅂ•́)و✧</h1>
    <p class="text-gray-600 text-lg">多多少少干点活儿嗷</p>
    
    <!-- 生产力指标 -->
    <div class="flex items-center space-x-8 mt-6">
      <div class="flex items-center space-x-2">
        <span class="text-2xl font-bold text-gray-900">2,543</span>
        <span class="text-gray-600">已完成任务</span>
        <TrendingUp class="w-4 h-4 text-green-500" />
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-2xl font-bold text-gray-900">82%</span>
        <span class="text-gray-600">节省时间</span>
        <TrendingUp class="w-4 h-4 text-green-500" />
      </div>
    </div>

    <!-- 添加任务按钮 -->
    <Button class="mt-6 bg-black text-white hover:bg-gray-800" @click="navigateToSchedule">
      <Plus class="w-4 h-4 mr-2" />
      添加任务
    </Button>
  </div>
</template>

<script setup>
import { TrendingUp, Plus } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'

const router = useRouter()

const navigateToSchedule = () => {
  router.push('/schedule')
}
</script>
