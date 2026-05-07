import {
  getAlbumsStore,
  resetAlbumsStore,
  setAlbumsStore,
} from "../data/albums";
import type { Album, AlbumInput } from "../types/album";

const cloneAlbum = (album: Album): Album => ({ ...album });

export const listAlbums = (): Album[] => getAlbumsStore().map(cloneAlbum);

export const getAlbumById = (id: number): Album | undefined => {
  const album = getAlbumsStore().find((item) => item.id === id);
  return album ? cloneAlbum(album) : undefined;
};

export const getAlbumsByYear = (year: number): Album[] =>
  getAlbumsStore()
    .filter((item) => item.year === year)
    .map(cloneAlbum);

export const createAlbum = (input: AlbumInput): Album => {
  const albums = getAlbumsStore();
  const nextId = albums.length === 0 ? 1 : Math.max(...albums.map((item) => item.id)) + 1;
  const createdAlbum: Album = { id: nextId, ...input };
  setAlbumsStore([...albums, createdAlbum]);
  return cloneAlbum(createdAlbum);
};

export const updateAlbum = (id: number, input: AlbumInput): Album | undefined => {
  const albums = getAlbumsStore();
  const existingIndex = albums.findIndex((item) => item.id === id);
  if (existingIndex < 0) {
    return undefined;
  }

  const updatedAlbum: Album = { id, ...input };
  const updatedAlbums = [...albums];
  updatedAlbums[existingIndex] = updatedAlbum;
  setAlbumsStore(updatedAlbums);
  return cloneAlbum(updatedAlbum);
};

export const deleteAlbum = (id: number): boolean => {
  const albums = getAlbumsStore();
  const nextAlbums = albums.filter((item) => item.id !== id);
  if (nextAlbums.length === albums.length) {
    return false;
  }

  setAlbumsStore(nextAlbums);
  return true;
};

export const resetAlbums = (): void => {
  resetAlbumsStore();
};
