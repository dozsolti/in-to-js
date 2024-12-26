import { InToJSParser } from '../../index';
import { readFile } from '../../test_utils';

test("should read a single number", () => {
    const s = readFile('src/__tests__/in_files/numbers/single_number.in');

    const data = InToJSParser.create(s)
        .number('n')
        .build();

    expect(data).toHaveProperty('n');
    expect(data.n).toEqual(10);
});

test("should read the correct numbers", () => {
    const s = readFile('src/__tests__/in_files/numbers/two_numbers.in');

    const data = InToJSParser.create(s)
        .numbers('a b')
        .numbers('x/y', '/')
        .build();

    expect(data).toHaveProperty('a');
    expect(data).toHaveProperty('b');
    expect(data.a).toEqual(13);
    expect(data.b).toEqual(67);

    expect(data.x).toEqual(97.25);
    expect(data.y).toEqual(100);
});

test("should read all n numbers", () => {
    const s = readFile('src/__tests__/in_files/numbers/n_numbers.in');

    const data = InToJSParser.create(s)
        .number('n')
        .lines('arr', 'n')
        .build();

    expect(data.n).toEqual(10);
    expect(data).toHaveProperty('n');

    expect(data).toHaveProperty('arr');
    expect(data.arr.length).toEqual(data.n);
});