const sinon = require("sinon");
const chai = require("chai");
const sinonChai = require("sinon-chai");
const rewire = require("rewire");
const { expect } = chai;
chai.use(sinonChai);

const noteController = rewire("../controllers/note.controller.js");
const Note = require("../models/note.model.js");

describe("Test /note controller", () => {
    let saveStub, findOneStub, findStub, updateStub, deleteStub;
    let noteMock;

    beforeEach(() => {
        sandbox = sinon.createSandbox();

        noteMock = {
            _id: "01",
            title: "Something",
            content: "Something as well"
        };

        saveStub = sandbox.stub(Note.prototype, "save").resolves(noteMock);
        findOneStub = sandbox.stub(Note, "findById").resolves(noteMock);
        findStub = sandbox.stub(Note, "find").resolves([noteMock]);
        updateStub = sandbox.stub(Note, "findByIdAndUpdate").resolves(noteMock);
        deleteStub = sandbox.stub(Note, "findByIdAndDelete").resolves(true);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("createNote", () => {
        it("should create a new note", async () => {
            const result = await noteController.create(noteMock);
            expect(saveStub).to.have.been.calledOnce;
            expect(result).to.deep.equal(noteMock);
        });

        it("should throw an error when required fields are missing", async () => {
            const invalidNote = { title: "Not something" };

            try {
                await noteController.create(invalidNote);
                throw new Error("Unexpected success");
            } catch (err) {
                expect(err).to.be.an.instanceof(Error);
                expect(err.message).to.equal("Title and content are required");
            }
        });

        it("should handle errors thrown by save method", async () => {
            const errorMessage = "Database error";
            saveStub.rejects(new Error(errorMessage));

            try {
                await noteController.create(noteMock);
                throw new Error("Unexpected success");
            } catch (err) {
                expect(err).to.be.instanceOf(Error);
                expect(err.message).to.equal(errorMessage);
            }
        });
    });

    describe("readNote", () => {
        it("should return a note when called with findOne", async () => {
            const result = await noteController.findOne("01");

            expect(findOneStub).to.have.been.calledOnce;
            expect(result).to.deep.equal(noteMock);
        });

        it("should return all notes when called with findAll", async () => {
            const result = await noteController.findAll();

            expect(findStub).to.have.been.calledOnce;
            expect(result).to.deep.equal([noteMock]);
        });

        it("should throw an error when id is missing", async () => {
            try {
                await noteController.findOne();
                throw new Error("Unexpected success");
            } catch (err) {
                expect(err).to.be.an.instanceof(Error);
                expect(err.message).to.equal("Note id is required");
            }
        });
    });

    describe("updateNote", () => {
        it("should update a note", async () => {
            const updatedNote = {
                title: "Updated something",
                content: "Updated something"
            };

            updateStub.resolves(updatedNote);
            const result = await noteController.update("02", updatedNote);

            expect(updateStub).to.have.been.calledOnce;
            expect(result).to.deep.equal(updatedNote);
        });

        it("should throw an error when fields are missing", async () => {
            try {
                await noteController.update("03", {});
                throw new Error("Unexpected success");
            } catch (err) {
                expect(err).to.be.an.instanceof(Error);
                expect(err.message).to.equal("Title and content are required");
            }
        });
    });

    describe("deleteNote", () => {
        let deleteStub;

        beforeEach(() => {
            deleteStub = sandbox.stub(Note, "findByIdAndDelete").resolves(true);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("should delete a note", async () => {
            const result = await noteController.delete("02");

            expect(deleteStub).to.have.been.calledOnce;
            expect(result).to.be.true;
        });

        it("should return null if note not found", async () => {
            deleteStub.resolves(null);
            const result = await noteController.delete("03");

            expect(deleteStub).to.have.been.calledOnce;
            expect(result).to.be.null;
        });

        it("should throw an error when id is missing", async () => {
            try {
                await noteController.delete();
                throw new Error("Unexpected success");
            } catch (err) {
                expect(err).to.be.an.instanceof(Error);
                expect(err.message).to.equal("Note id is required");
            }
        });
    });
});
