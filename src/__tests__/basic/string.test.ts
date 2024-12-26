import { Parser } from '../../index';
import { readFile } from '../utils';

test("should read name", () => {
    const s = readFile('src/__tests__/in_files/strings/name.in');

    const data = Parser.create(s)
        .string("name")
        .build();

    
    expect(data.name).toEqual("John Doe");
});
test("should read all 3 names", () => {
    const s = readFile('src/__tests__/in_files/strings/names.in');

    const data = Parser.create(s)
        .string("name1")
        .string("name2")
        .string("name3")
        .build();

    
    expect(data.name1).toEqual("John Doe");
    expect(data.name2).toEqual("Jane Smith");
    expect(data.name3).toEqual("N/A");
});
test("should read lorem ipsum", () => {
    const s = readFile('src/__tests__/in_files/strings/lorem_ipsum.in');

    const data = Parser.create(s)
        .string("lorem")
        .build();

    
    expect(data.lorem).toContain("Lorem ipsum dolor sit");
    expect(data.lorem.length).toEqual(447);
});