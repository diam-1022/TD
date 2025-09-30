<template>
  <div class="flex h-screen bg-gray-50">
    <!-- 侧边栏 -->
    <Sidebar />
    
    <!-- 主内容区域 -->
    <div class="flex-1 flex flex-col">
      <!-- 顶部栏 -->
      <Header />
      
      <!-- 仪表板内容 -->
      <main class="flex-1 p-6 overflow-y-auto">
        <!-- 问候语和生产力指标 -->
        <Greeting />
        
        <!-- 主要内容区域 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- 虚拟助手 -->
          <VirtualAssistant />
          
          <!-- 活动时间线 -->//未完成 只是大致做了个样式
          <ActivityTimeline />
        </div>
        
        <!-- 底部内容区域 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 待办事项 -->
          <TodoList />
          
          <!-- 性能总结 -->
          <PerformanceSummary />
        </div>
      </main>

      <!-- 通知服务 -->
      <NotificationService />
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'
import Greeting from '@/components/dashboard/Greeting.vue'
import VirtualAssistant from '@/components/dashboard/VirtualAssistant.vue'
import ActivityTimeline from '@/components/dashboard/ActivityTimeline.vue'
import TodoList from '@/components/dashboard/TodoList.vue'
import PerformanceSummary from '@/components/dashboard/PerformanceSummary.vue'
import NotificationService from '@/components/schedule/NotificationService.vue'
</script>
