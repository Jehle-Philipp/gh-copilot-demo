import type { Album } from "../types/album";

const seedAlbums: Album[] = [
  {
    id: 1,
    title: "You, Me and an App Id",
    artist: "Daprize",
    year: 2024,
    price: 10.99,
    image_url: "https://aka.ms/albums-daprlogo",
  },
  {
    id: 2,
    title: "Seven Revision Army",
    artist: "The Blue-Green Stripes",
    year: 2024,
    price: 13.99,
    image_url: "https://aka.ms/albums-containerappslogo",
  },
  {
    id: 3,
    title: "Scale It Up",
    artist: "KEDA Club",
    year: 2024,
    price: 13.99,
    image_url: "https://aka.ms/albums-kedalogo",
  },
  {
    id: 4,
    title: "Lost in Translation",
    artist: "MegaDNS",
    year: 2023,
    price: 12.99,
    image_url: "https://aka.ms/albums-envoylogo",
  },
  {
    id: 5,
    title: "Lock Down Your Love",
    artist: "V is for VNET",
    year: 2022,
    price: 12.99,
    image_url: "https://aka.ms/albums-vnetlogo",
  },
  {
    id: 6,
    title: "Sweet Container O' Mine",
    artist: "Guns N Probeses",
    year: 2021,
    price: 14.99,
    image_url: "https://aka.ms/albums-containerappslogo",
  },
];

let albums: Album[] = [...seedAlbums];

const clone = (album: Album): Album => ({ ...album });

export const getAlbumsStore = (): Album[] => albums;

export const setAlbumsStore = (nextAlbums: Album[]): void => {
  albums = nextAlbums;
};

export const resetAlbumsStore = (): void => {
  albums = [...seedAlbums];
};

export const getSeedAlbums = (): Album[] => seedAlbums.map(clone);
