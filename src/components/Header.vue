<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { usePhotoStore } from '../stores/usePhotoStore';

const photoStore = usePhotoStore();
const { setAlbumInput } = photoStore;
const searchId = ref('');

const updateAlbumInput = () => {
    setAlbumInput(searchId.value);
}
</script>

<template>
    <div class="flex w-[600px] gap-2 justify-between items-center py-2">
        <h2 class="font-bold">Photos</h2>
        <div class="flex gap-2">
            <Input class="w-40" v-model="searchId" placeholder="Введите ID" />
            <Button @click="updateAlbumInput">Поиск</Button>
        </div>
    </div>
</template>

<style scoped></style>
