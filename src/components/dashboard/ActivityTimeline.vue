<template>
  <Card class="h-96">
    <CardHeader class="flex flex-row items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">我的活动</h3>
        <p class="text-sm text-gray-600">今天有什么在等待你</p>
      </div>
      <button class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
        <Calendar class="w-4 h-4 text-gray-600" />
      </button>
    </CardHeader>
    
    <CardContent>
      <!-- 时间线 -->
      <div class="relative">
        <!-- 时间轴 -->
        <div class="flex justify-between text-xs text-gray-500 mb-4">
          <span>07:00</span>
          <span>09:00</span>
          <span>11:00</span>
          <span>13:00</span>
          <span>15:00</span>
          <span>17:00</span>
          <span>19:00</span>
          <span>21:00</span>
          <span>23:00</span>
          <span>01:00</span>
          <span>02:00</span>
        </div>

        <!-- 当前时间线 -->
        <div class="absolute left-1/2 top-0 bottom-0 w-0.5 bg-red-500 transform -translate-x-1/2">
          <div class="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </div>

        <!-- 活动项目 -->
        <div class="space-y-3">
          <!-- 项目入职 -->
          <div class="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span class="text-white text-xs font-medium">G</span>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">项目入职</p>
              <p class="text-xs text-gray-600">Google Meeting</p>
            </div>
            <div class="flex items-center space-x-1">
              <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span class="text-white text-xs">+</span>
              </div>
            </div>
          </div>

          <!-- 设计研究 -->
          <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <span class="text-white text-xs font-medium">F</span>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">设计研究</p>
              <p class="text-xs text-gray-600">Figma 文件</p>
            </div>
            <div class="flex items-center space-x-1">
              <div class="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <span class="text-white text-xs">+</span>
              </div>
              <span class="text-xs text-gray-500">+5</span>
            </div>
          </div>

          <!-- 咖啡休息 -->
          <div class="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <span class="text-white text-xs font-medium">C</span>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">咖啡休息</p>
              <p class="text-xs text-gray-600">Co&Co 咖啡厅</p>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { Calendar } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardContent from '@/components/ui/CardContent.vue'
</script>
