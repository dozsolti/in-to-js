import { InToJSParser } from '../../index';
import { readFile } from '../../test_utils';

test("should skip one line", () => {
    const s = readFile('src/__tests__/in_files/skips/skip_1.in');

    const data = InToJSParser.create(s)
        .number('a')
        .skip()
        .number('b')
        .build();

    expect(data).toHaveProperty('a');
    expect(data.a).toEqual(100);

    expect(data).toHaveProperty('b');
    expect(data.b).toEqual(200);
});
test("should skip 3 lines", () => {
    const s = readFile('src/__tests__/in_files/skips/skip_3.in');

    const data = InToJSParser.create(s)
        .number('a')
        .skip(3)
        .number('b')
        .build();

    expect(data).toHaveProperty('a');
    expect(data.a).toEqual(100);

    expect(data).toHaveProperty('b');
    expect(data.b).toEqual(200);
});
test("should skip n lines", () => {
    const s = readFile('src/__tests__/in_files/skips/skip_n.in');

    const data = InToJSParser.create(s)
        .number('n')
        .number('a')
        .skip('n')
        .number('b')
        .build();

    expect(data).toHaveProperty('a');
    expect(data.a).toEqual(100);

    expect(data).toHaveProperty('b');
    expect(data.b).toEqual(200);
});