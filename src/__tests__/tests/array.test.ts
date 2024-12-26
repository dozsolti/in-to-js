import { InToJSParser } from '../../index';
import { readFile } from '../../test_utils';

test("should read array of numbers", () => {
    const s = readFile('src/__tests__/in_files/arrays/number_array.in');

    const data = InToJSParser.create(s)
        .array("arr", ' ', x => parseInt(x) * 10)
        .array("arr2", ' ')
        .build();

        
    expect(data.arr.length).toEqual(4);
    expect(data.arr).toEqual([10, 20, 30, 40]);
    expect(data.arr2).toEqual(['-1', '-2', '-3', '-4']);
});