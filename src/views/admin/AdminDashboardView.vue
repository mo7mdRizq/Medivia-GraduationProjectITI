<script setup>
import { 
  UsersIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/vue/24/outline'

const stats = [
  { name: 'Total Users', value: '2,543', change: '+12.5%', type: 'increase', icon: UsersIcon },
  { name: 'Total Revenue', value: '$45,231', change: '+2.1%', type: 'increase', icon: CurrencyDollarIcon },
  { name: 'Active Sessions', value: '1,231', change: '-3.2%', type: 'decrease', icon: ChartBarIcon },
]

const activity = [
  { id: 1, user: 'Sarah Wilson', action: 'Created a new account', time: '2 minutes ago', avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson&background=random' },
  { id: 2, user: 'Dr. Michael Brown', action: 'Uploaded a new report', time: '1 hour ago', avatar: 'https://ui-avatars.com/api/?name=Michael+Brown&background=random' },
  { id: 3, user: 'James Smith', action: 'Updated profile details', time: '3 hours ago', avatar: 'https://ui-avatars.com/api/?name=James+Smith&background=random' },
  { id: 4, user: 'Emily Davis', action: 'Scheduled an appointment', time: '5 hours ago', avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=random' },
]
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p class="mt-1 text-sm text-gray-500">Overview of your system performance and activity.</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div 
        v-for="stat in stats" 
        :key="stat.name" 
        class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">{{ stat.name }}</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">{{ stat.value }}</p>
          </div>
          <div class="p-3 bg-brand-50 rounded-lg">
            <component :is="stat.icon" class="w-6 h-6 text-brand-600" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <component 
            :is="stat.type === 'increase' ? ArrowUpIcon : ArrowDownIcon" 
            class="w-4 h-4 mr-1"
            :class="stat.type === 'increase' ? 'text-green-500' : 'text-red-500'"
          />
          <span 
            class="font-medium"
            :class="stat.type === 'increase' ? 'text-green-600' : 'text-red-600'"
          >
            {{ stat.change }}
          </span>
          <span class="text-gray-400 ml-2">from last month</span>
        </div>
      </div>
    </div>

    <!-- Charts & Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Mock Chart Section -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 class="text-lg font-bold text-gray-900 mb-4">User Growth</h3>
        <div class="h-64 flex items-end space-x-2 justify-between px-2">
           <!-- Simple CSS Bar Chart Mockup -->
           <div class="w-full bg-brand-100 rounded-t-sm h-[40%] hover:bg-brand-200 transition-colors cursor-pointer relative group">
             <div class="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded">40%</div>
           </div>
           <div class="w-full bg-brand-100 rounded-t-sm h-[70%] hover:bg-brand-200 transition-colors cursor-pointer relative group">
             <div class="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded">70%</div>
           </div>
           <div class="w-full bg-brand-100 rounded-t-sm h-[50%] hover:bg-brand-200 transition-colors cursor-pointer relative group">
             <div class="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded">50%</div>
           </div>
           <div class="w-full bg-brand-100 rounded-t-sm h-[85%] hover:bg-brand-200 transition-colors cursor-pointer relative group">
             <div class="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded">85%</div>
           </div>
           <div class="w-full bg-brand-500 rounded-t-sm h-[60%] hover:bg-brand-600 transition-colors cursor-pointer relative group shadow-brand">
             <div class="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded">60%</div>
           </div>
        </div>
        <div class="flex justify-between mt-4 text-xs text-gray-500">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div class="space-y-4">
          <div v-for="item in activity" :key="item.id" class="flex items-start space-x-3">
            <img :src="item.avatar" alt="" class="w-10 h-10 rounded-full bg-gray-100">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900">
                {{ item.user }}
              </p>
              <p class="text-sm text-gray-500 truncate">
                {{ item.action }}
              </p>
            </div>
            <div class="text-xs text-gray-400">
              {{ item.time }}
            </div>
          </div>
        </div>
        <button class="w-full mt-6 py-2 text-sm text-brand-600 font-medium hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors">
          View All History
        </button>
      </div>
    </div>
  </div>
</template>
