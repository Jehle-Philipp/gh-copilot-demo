import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import app from "../src/app";
import { resetAlbums } from "../src/services/albumsService";

describe("albums routes", () => {
  beforeEach(() => {
    resetAlbums();
  });

  it("lists albums", async () => {
    const response = await request(app).get("/albums");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(6);
    expect(response.body[0]).toMatchObject({
      id: 1,
      title: "You, Me and an App Id",
      artist: "Daprize",
      year: 2024,
      price: 10.99,
      image_url: "https://aka.ms/albums-daprlogo",
    });
  });

  it("gets album by id", async () => {
    const response = await request(app).get("/albums/2");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 2,
      title: "Seven Revision Army",
    });
  });

  it("returns 404 when album id does not exist", async () => {
    const response = await request(app).get("/albums/999");

    expect(response.status).toBe(404);
  });

  it("filters albums by year", async () => {
    const response = await request(app).get("/albums/year/2024");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(3);
    expect(response.body.every((album: { year: number }) => album.year === 2024)).toBe(true);
  });

  it("creates a new album and assigns next id", async () => {
    const payload = {
      title: "New Release",
      artist: "Cloud Beat",
      year: 2025,
      price: 11.5,
      image_url: "https://example.com/new-release.jpg",
    };

    const response = await request(app).post("/albums").send(payload);

    expect(response.status).toBe(201);
    expect(response.headers.location).toBe("/albums/7");
    expect(response.body).toMatchObject({ id: 7, ...payload });

    const listResponse = await request(app).get("/albums");
    expect(listResponse.body).toHaveLength(7);
  });

  it("updates an existing album", async () => {
    const payload = {
      title: "Scale It Way Up",
      artist: "KEDA Club",
      year: 2024,
      price: 15.99,
      image_url: "https://example.com/updated.jpg",
    };

    const response = await request(app).put("/albums/3").send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: 3, ...payload });
  });

  it("returns 404 when updating unknown album", async () => {
    const payload = {
      title: "Unknown",
      artist: "Unknown",
      year: 2024,
      price: 9.99,
      image_url: "https://example.com/unknown.jpg",
    };

    const response = await request(app).put("/albums/999").send(payload);

    expect(response.status).toBe(404);
  });

  it("deletes an album", async () => {
    const deleteResponse = await request(app).delete("/albums/4");

    expect(deleteResponse.status).toBe(204);

    const getResponse = await request(app).get("/albums/4");
    expect(getResponse.status).toBe(404);
  });

  it("returns 404 when deleting unknown album", async () => {
    const response = await request(app).delete("/albums/999");

    expect(response.status).toBe(404);
  });
});
