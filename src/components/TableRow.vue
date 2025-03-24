<script setup lang="ts">
import { defineProps } from 'vue'
import { cn } from '@/lib/utils'


const props = defineProps<{
    class?: string
}>()
</script>

<template>

    <div :class="cn('grid grid-cols-[1fr_1fr_2fr_2fr_2fr] gap-2 border-t', props.class)">
        <slot />
    </div>
</template>

<style scoped></style>