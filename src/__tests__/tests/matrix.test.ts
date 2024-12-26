import { InToJSParser } from '../../index';
import { readFile } from '../../test_utils';

test("should read the 2D array correctly", () => {
    const s = readFile('src/__tests__/in_files/matrix/matrix.in');

    const data = InToJSParser.create(s)
        .number("m")
        .matrix("matrix", "m")
        .build();

    expect(data.m).toEqual(30);

    expect(data).toHaveProperty('matrix');
    expect(data.matrix.length).toEqual(data.m);
    expect(data.matrix[0].length).toEqual(data.m);
});
