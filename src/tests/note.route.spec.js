const chai = require('chai');
const sinon = require('sinon');
const request = require('supertest');
const { expect } = chai;
const app = require('../app'); // Import the Express app
const Note = require('../models/note.model');

let sandbox;

describe("Integration Test /note API", () => {
    let noteMock;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        noteMock = { title: "Something", content: "Something as well" };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("POST /notes", () => {
        it("should create a new note", async () => {
            const res = await request(app).post("/notes").send(noteMock);
            expect(res.status).to.equal(201);
            expect(res.body.title).to.equal(noteMock.title);
        });

        it("should return an error if required fields are missing", async () => {
            const res = await request(app).post("/notes").send({});
            expect(res.status).to.equal(400);
            expect(res.body.error).to.equal("Title and content are required");
        });
    });

    describe("GET /notes", () => {
        it("should return all notes", async () => {
            sandbox.stub(Note, "find").resolves([noteMock]);
            const res = await request(app).get("/notes");
            expect(res.status).to.equal(200);
            expect(res.body.notes).to.be.an("array").that.deep.includes(noteMock);
        });
    });

    describe("PUT /notes/:id", () => {
        it("should update a note", async () => {
            const updatedNote = { title: "Updated", content: "Updated Content" };
            sandbox.stub(Note, "findByIdAndUpdate").resolves(updatedNote);
            const res = await request(app).put("/notes/123").send(updatedNote);
            expect(res.status).to.equal(200);
            expect(res.body.title).to.equal(updatedNote.title);
        });
    });

    describe("DELETE /notes/:id", () => {
        it("should delete a note", async () => {
            sandbox.stub(Note, "findByIdAndDelete").resolves(true);
            const res = await request(app).delete("/notes/123");
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal("Note deleted successfully");
        });
    });
});
