import { jest } from "@jest/globals";

global.fetch = jest.fn() as typeof fetch;
