import { defineStore } from "pinia";
import { ref, watch } from "vue";
import axios from "axios";

interface Photo {
  id: number;
  albumId: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export const usePhotoStore = defineStore("photo", () => {
  const photos = ref<Photo[]>([]);
  const albumInput = ref<string>("");
  let isLoading = ref<boolean>(false);

  const fetchPhotos = async () => {
    isLoading.value = true;
    try {
      let params: { albumId?: number[] } = {};
      const albumIds = albumInput.value
        .split(" ")
        .map((id) => id.trim())
        .filter((id) => id !== "")
        .map(Number);

      if (albumIds.length > 0) {
        params.albumId = albumIds;
      }

      const response = await axios.get<Photo[]>(
        "https://jsonplaceholder.typicode.com/photos",
        { params }
      );

      photos.value = response.data;
    } catch (error) {
      console.error("Ошибка загрузки фотографий:", error);
    } finally {
      isLoading.value = false;
    }
  };

  watch(albumInput, fetchPhotos, { immediate: true });

  const setAlbumInput = (input: string) => {
    albumInput.value = input;
  };

  return { photos, albumInput, fetchPhotos, setAlbumInput, isLoading };
});
