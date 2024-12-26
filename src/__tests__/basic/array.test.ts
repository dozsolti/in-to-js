import { Parser } from '../../index';
import { readFile } from '../utils';

test("should read array of numbers", () => {
    const s = readFile('src/__tests__/in_files/arrays/number_array.in');

    const data = Parser.create(s)
        .array("arr", ' ', x => parseInt(x) * 10)
        .build();


    expect(data.arr.length).toEqual(4);
    expect(data.arr[0]).toEqual([10, 20, 30, 40]);
});