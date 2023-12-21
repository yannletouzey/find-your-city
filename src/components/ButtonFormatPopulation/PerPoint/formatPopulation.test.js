import { formatPopulation } from "./formatPopulation";

describe("formatPopulation", () => {
    test("formatPopulation", () => {
        expect(formatPopulation(123456789)).toBe("123,456,789");
    })
    test("formatPopulation", () => {
        expect(formatPopulation(123)).toBe("123");
    })
    test("formatPopulation", () => {
        expect(formatPopulation(1234)).toBe("1,234");
    })
    test("formatPopulation", () => {
        expect(formatPopulation(12345)).toBe("12,345");
    })
})