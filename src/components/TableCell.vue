<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
    sortKey: string | null,
    sortOrder: 'asc' | 'desc',
    setSort: (key: string) => void,
    column: string
}>()
</script>

<template>
    <div @click="props.setSort(props.column)" class="font-semibold text-gray-700 text-sm cursor-pointer">
        <slot />
        {{ props.sortKey === props.column ? (props.sortOrder === 'asc' ? '▲' : '▼') : '' }}
    </div>
</template>

<style scoped></style>
