<template>
  <Card class="h-96">
    <CardHeader class="flex flex-row items-center justify-between">
      <div class="flex items-center space-x-2">
        <button class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <HelpCircle class="w-4 h-4 text-gray-600" />
        </button>
        <button class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <MessageCircle class="w-4 h-4 text-gray-600" />
        </button>
        <button class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Settings class="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </CardHeader>
    
    <CardContent class="flex flex-col h-full">
      <!-- 虚拟助手头像和消息 -->
      <div class="flex items-start space-x-3 mb-6">
        <div class="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
          <span class="text-white text-sm font-medium">AI</span>
        </div>
        <div class="flex-1">
          <div class="bg-gray-100 rounded-lg p-3 max-w-xs">
            <p class="text-sm text-gray-800">你好！我是虚拟助手。今天我能为你做些什么？</p>
            <span class="text-xs text-gray-500 mt-1 block">9:32</span>
          </div>
        </div>
      </div>

      <!-- 消息输入区域 -->
      <div class="mt-auto">
        <div class="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
          <Input 
            placeholder="写一条消息" 
            class="border-0 bg-transparent focus-visible:ring-0"
          />
          <button class="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <Paperclip class="w-4 h-4 text-gray-600" />
          </button>
          <button class="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <Smile class="w-4 h-4 text-gray-600" />
          </button>
          <button class="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <Mic class="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { HelpCircle, MessageCircle, Settings, Paperclip, Smile, Mic } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Input from '@/components/ui/Input.vue'
</script>
