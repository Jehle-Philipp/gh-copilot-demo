import { Router } from "express";
import {
  createAlbum,
  deleteAlbum,
  getAlbumById,
  getAlbumsByYear,
  listAlbums,
  updateAlbum,
} from "../services/albumsService";
import type { AlbumInput } from "../types/album";

const router = Router();

const parseNumericParam = (value: string): number | undefined => {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : undefined;
};

const isAlbumInput = (payload: unknown): payload is AlbumInput => {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  const candidate = payload as Partial<AlbumInput>;
  return (
    typeof candidate.title === "string" &&
    typeof candidate.artist === "string" &&
    typeof candidate.year === "number" &&
    typeof candidate.price === "number" &&
    typeof candidate.image_url === "string"
  );
};

router.get("/", (_req, res) => {
  return res.status(200).json(listAlbums());
});

router.get("/year/:year", (req, res) => {
  const year = parseNumericParam(req.params.year);
  if (year === undefined) {
    return res.status(400).json({ message: "Invalid year parameter" });
  }

  return res.status(200).json(getAlbumsByYear(year));
});

router.get("/:id", (req, res) => {
  const id = parseNumericParam(req.params.id);
  if (id === undefined) {
    return res.status(400).json({ message: "Invalid id parameter" });
  }

  const album = getAlbumById(id);
  if (!album) {
    return res.sendStatus(404);
  }

  return res.status(200).json(album);
});

router.post("/", (req, res) => {
  if (!isAlbumInput(req.body)) {
    return res.status(400).json({ message: "Invalid album payload" });
  }

  const createdAlbum = createAlbum(req.body);
  return res
    .status(201)
    .location(`/albums/${createdAlbum.id}`)
    .json(createdAlbum);
});

router.put("/:id", (req, res) => {
  const id = parseNumericParam(req.params.id);
  if (id === undefined) {
    return res.status(400).json({ message: "Invalid id parameter" });
  }

  if (!isAlbumInput(req.body)) {
    return res.status(400).json({ message: "Invalid album payload" });
  }

  const updatedAlbum = updateAlbum(id, req.body);
  if (!updatedAlbum) {
    return res.sendStatus(404);
  }

  return res.status(200).json(updatedAlbum);
});

router.delete("/:id", (req, res) => {
  const id = parseNumericParam(req.params.id);
  if (id === undefined) {
    return res.status(400).json({ message: "Invalid id parameter" });
  }

  const deleted = deleteAlbum(id);
  if (!deleted) {
    return res.sendStatus(404);
  }

  return res.sendStatus(204);
});

export default router;
