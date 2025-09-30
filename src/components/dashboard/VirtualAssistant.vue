<template>
  <Card class="h-96">
    
    <CardContent class="flex flex-col h-full">
      <CardHeader class="flex flex-row items-center justify-between">
      <div class="flex items-center space-x-2">
        <div class="relative help-tooltip-container">
          <button 
            @click="showHelpTooltip = !showHelpTooltip"
            class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <HelpCircle class="w-4 h-4 text-gray-600" />
          </button>
          
          <!-- 帮助提示框 -->
          <div 
            v-if="showHelpTooltip"
            class="absolute top-12 left-0 z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4"
          >
            <div class="flex items-start space-x-3">
              <div class="w-8 h-8 bg-gradient-to-br from-pink-400 to-black-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-white text-xs font-medium">diam</span>
              </div>
              <div class="flex-1">
                <h4 class="text-sm font-semibold text-gray-900 mb-2">不会用就算了👍</h4>
              </div>
            </div>
            
            <!-- 关闭按钮 -->
            <button 
              @click="showHelpTooltip = false"
              class="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X class="w-3 h-3 text-gray-400" />
            </button>
          </div>
        </div>
        
        <button class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <MessageCircle class="w-4 h-4 text-gray-600" />
        </button>
        <button class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Settings class="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </CardHeader>
      <!-- 消息列表 -->
      <div class="flex-1 overflow-y-auto space-y-4 mb-4">
        <div 
          v-for="message in messages" 
          :key="message.id"
          class="flex items-start space-x-3"
          :class="{ 'flex-row-reverse space-x-reverse': message.isUser }"
        >
          <div 
            class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            :class="message.isUser 
              ? 'bg-gradient-to-br from-blue-400 to-blue-600' 
              : 'bg-gradient-to-br from-purple-400 to-purple-600'"
          >
            <span class="text-white text-sm font-medium">
              {{ message.isUser ? '我' : 'AI' }}
            </span>
          </div>
          <div class="flex-1">
            <div 
              class="rounded-lg p-3 max-w-xs"
              :class="message.isUser 
                ? 'bg-blue-500 text-white ml-auto' 
                : 'bg-gray-100 text-gray-800'"
            >
              <p class="text-sm">{{ message.text }}</p>
              <span 
                class="text-xs mt-1 block"
                :class="message.isUser ? 'text-blue-100' : 'text-gray-500'"
              >
                {{ message.time }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 消息输入区域 -->
      <div class="mt-auto">
        <div class="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
          <Input 
            v-model="messageInput"
            @keypress="handleKeyPress"
            placeholder="写一条消息" 
            class="border-0 bg-transparent focus-visible:ring-0"
          />
          <button class="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <Paperclip class="w-4 h-4 text-gray-600" />
          </button>
          <button 
            @click="sendMessage"
            class="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            :class="{ 'opacity-50 cursor-not-allowed': !messageInput.trim() }"
            :disabled="!messageInput.trim()"
          >
            <Send class="w-4 h-4 text-gray-600" />
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
import { ref, onMounted, onUnmounted } from 'vue'
import { HelpCircle, MessageCircle, Settings, Paperclip, Send, Mic, X } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Input from '@/components/ui/Input.vue'

// 控制帮助提示框显示状态
const showHelpTooltip = ref(false)

// 消息相关状态
const messageInput = ref('')
const messages = ref([
  {
    id: 1,
    text: '你好！我是虚拟助手。今天我能为你做些什么？',
    time: '9:32',//时间api接入
    isUser: false
  }
])

// 发送消息函数
const sendMessage = () => {
  if (messageInput.value.trim()) {
    // 添加用户消息
    messages.value.push({
      id: Date.now(),
      text: messageInput.value.trim(),
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      isUser: true
    })
    
    // 清空输入框
    messageInput.value = ''
    
    // 模拟AI回复
    setTimeout(() => {
      messages.value.push({
        id: Date.now() + 1,
        text: '我收到了你的消息，正在处理中...',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        isUser: false
      })
    }, 1000)
  }
}

// 处理回车键发送
const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    sendMessage()
  }
}

// 点击外部区域关闭提示框
const handleClickOutside = (event) => {
  if (showHelpTooltip.value && !event.target.closest('.help-tooltip-container')) {
    showHelpTooltip.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
