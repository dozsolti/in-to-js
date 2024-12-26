import { InToJSParser } from '../../index';
import { readFile } from '../../test_utils';

test("should read the ghosts correctly", () => {
    const s = readFile('src/__tests__/in_files/arrayOfObject/ghosts.in');

    const data = InToJSParser.create(s)
        .number("ghostCount")
        .arrayOfObject("ghosts", "ghostCount", P =>
            P
                .string('name')
                .numbers('x y')
                .number('walkingSpeed')
                .array('path')
        )
        .build();

    expect(data.ghostCount).toEqual(5);
    expect(data.ghosts.length).toEqual(data.ghostCount);

    expect(data.ghosts[0].name).toEqual("Casper the Friendly Fart");
    expect(data.ghosts[0].walkingSpeed).toBeGreaterThan(0);
    expect(data.ghosts[0].path).not.toBeNull();
});
