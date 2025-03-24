<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import TableRow from './TableRow.vue'
import TableCell from './TableCell.vue'
import { usePhotoStore } from '../stores/usePhotoStore.ts'
import { storeToRefs } from 'pinia'

const photoStore = usePhotoStore()
const { photos, isLoading } = storeToRefs(photoStore)

const visiblePhotos = ref<number>(30)
const batchSize = 20
const observer = ref<IntersectionObserver | null>(null)
const loadMoreRef = ref<HTMLElement | null>(null)


const sortKey = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')

const sortedPhotos = computed(() => {
    if (!sortKey.value) return photos.value.slice(0, visiblePhotos.value)

    return [...photos.value].sort((a, b) => {
        const valA = a[sortKey.value as keyof typeof a]
        const valB = b[sortKey.value as keyof typeof b]

        if (typeof valA === 'string' && typeof valB === 'string') {
            return sortOrder.value === 'asc'
                ? valA.localeCompare(valB)
                : valB.localeCompare(valA)
        }

        if (typeof valA === 'number' && typeof valB === 'number') {
            return sortOrder.value === 'asc'
                ? valA - valB
                : valB - valA
        }

        return 0
    }).slice(0, visiblePhotos.value)
})

const setSort = (key: string): void => {
    if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortKey.value = key
        sortOrder.value = 'asc'
    }
}

const loadMore = (): void => {
    visiblePhotos.value += batchSize
}

onMounted(() => {
    observer.value = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !isLoading.value) {
            loadMore()
        }
    }, { threshold: 1.0 })

    if (loadMoreRef.value) {
        observer.value.observe(loadMoreRef.value)
    }
})

onUnmounted(() => {
    if (observer.value) {
        observer.value.disconnect()
    }
})
</script>

<template>
    <Card class="w-[600px] h-[600px] overflow-y-auto">
        <TableRow class="py-4 bg-gray-100 sticky top-0 z-10">
            <TableCell :sortKey="sortKey" :sortOrder="sortOrder" :setSort="setSort" column="id">Id</TableCell>
            <TableCell :sortKey="sortKey" :sortOrder="sortOrder" :setSort="setSort" column="albumId">Альбом</TableCell>
            <TableCell :sortKey="sortKey" :sortOrder="sortOrder" :setSort="setSort" column="title">Название</TableCell>
            <TableCell :sortKey="sortKey" :sortOrder="sortOrder" :setSort="setSort" column="url">Ссылка</TableCell>
            <TableCell :sortKey="sortKey" :sortOrder="sortOrder" :setSort="setSort" column="thumbnailUrl">Миниатюра
            </TableCell>
        </TableRow>

        <div class="overflow-y-auto max-h-[540px]">
            <TableRow v-for="photo in sortedPhotos" :key="photo.id" v-if="!isLoading">
                <div class="text-sm text-gray-800">{{ photo.id }}</div>
                <div class="text-sm text-gray-800">{{ photo.albumId }}</div>
                <div class="text-sm text-gray-800 truncate" :title="photo.title">{{ photo.title }}</div>
                <div class="text-sm text-gray-800 truncate" :title="photo.url">{{ photo.url }}</div>
                <div class="text-sm text-gray-800 truncate" :title="photo.thumbnailUrl">{{ photo.thumbnailUrl }}</div>
            </TableRow>

            <TableRow v-if="isLoading" class="py-5">
                <Skeleton class="h-5 rounded-full" />
                <Skeleton class="h-5 rounded-full" />
                <Skeleton class="h-5 rounded-full" />
                <Skeleton class="h-5 rounded-full" />
                <Skeleton class="h-5 rounded-full" />
            </TableRow>

            <div ref="loadMoreRef" class="h-2"></div>
        </div>
    </Card>
</template>

<style scoped></style>
