/* eslint-disable @typescript-eslint/no-explicit-any */

type NamesToKeys<S extends string, Sep extends string> = S extends `${infer First}${Sep}${infer Rest}`
    ? First | NamesToKeys<Rest, Sep>
    : S;

export class InToJSParser<T extends Record<string, unknown> = Record<string, any>> {

    constructor(public obj: T, private fileContent: Array<string>, private i: number = 0) { }

    static create(fileContent: Array<string>, i = 0): InToJSParser {
        return new InToJSParser({}, fileContent, i);
    }

    /**
     * @param name name of the property
     * @example .number('n')
     */
    number<K extends string>(name: K): InToJSParser<T & { [k in K]: number }> {
        const nextPart = { [name]: parseFloat(this.fileContent[this.i]) };

        Object.assign(this.obj, nextPart);
        this.i++;

        return this as InToJSParser<T & { [k in K]: number }>;
    }

    /**
     * @param names 
     * @example .numbers('x')
     * @example .numbers('x y')
     * @example .numbers('x/y','/')
     */
    numbers<K extends string, Sep extends string>(
        names: K,
        splitBy: Sep = ' ' as Sep
    ): InToJSParser<T & { [q in NamesToKeys<typeof names, string extends Sep ? ' ' : Sep>]: number }> {

        const nextPart = {} as any;

        const variables = names.split(splitBy);
        const values = this.fileContent[this.i].split(splitBy).map(x => parseFloat(x));
        for (let i = 0; i < variables.length; i++)
            nextPart[String(variables[i])] = values[i];


        Object.assign(this.obj, nextPart);
        this.i++;

        return this as InToJSParser<T & { [q in NamesToKeys<typeof names, string extends Sep ? ' ' : Sep>]: number }>;
    }

    /**
     * @param length how many lines it should ignore. By default it skips one line.
     * @example .skip(3) // it skips 3 lines
     * @example .number('n').skip('n') // it skips n number of lines
     */
    skip(length: number | string = 1) {
        const n = typeof length === 'number' ? length : (this.obj[length] as number);
        this.i += n;
        return this;
    }

    /**
     * @param name name of the property
     * @example .string('str')
     */
    string<K extends string>(name: K): InToJSParser<T & { [k in K]: string }> {
        const nextPart = { [name]: this.fileContent[this.i] } as { [k in K]: string };

        Object.assign(this.obj, nextPart);
        this.i++;

        return this as InToJSParser<T & { [k in K]: string }>;
    }

    /**
     * @param name name of the property
     * @param splitBy Separator character. By default it splits every character.
     * @param mapFunc Transform every element in something else.
     * @example .array('arr') // line: 'LRLRLL' output: data.arr = ['L', 'R', 'L', 'R', 'L', 'L']
     * @example .array('arr', ' ', x => x*10) // line: '1 2 3 4' output: data.arr = [10, 20, 30, 40]
     */
    array<K extends string, V = string>(
        name: K,
        splitBy = '',
        mapFunc?: (x: string) => V
    ): InToJSParser<T & { [k in K]: Array<V extends undefined ? string : V> }> {
        if (!mapFunc)
            mapFunc = (x) => x as V;

        const nextPart = {
            [name]: this.fileContent[this.i].split(splitBy).map(mapFunc)
        } as { [k in K]: Array<ReturnType<typeof mapFunc>> };

        Object.assign(this.obj, nextPart);
        this.i++;

        return this as InToJSParser<T & { [k in K]: Array<V extends undefined ? string : V> }>;
    }

    /**
     * @param name name of the property
     * @param length number of line to read. Can be number or other property.
     * @param mapFunc Transform every element in something else.
     * @example .lines('commands', 'n')
     * @example .lines('commands', 2, line => line.toLowerCase())
     */
    lines<K extends string, V = string>(
        name: K,
        length: number | string,
        mapFunc?: (line: string) => V
    ): InToJSParser<T & { [k in K]: Array<V extends undefined ? string : V> }> {
        if (!mapFunc)
            mapFunc = (x) => x as V;

        const n = typeof length === 'number' ? length : (this.obj[length] as number);
        const arr = [];

        for (let i = 0; i < n; i++)
            arr.push(mapFunc(this.fileContent[this.i + i]));

        const nextPart = {
            [name]: arr
        } as { [k in K]: Array<ReturnType<typeof mapFunc>> };

        Object.assign(this.obj, nextPart);
        this.i += n;

        return this as InToJSParser<T & { [k in K]: Array<V extends undefined ? string : V> }>;
    }

    /**
     * @param name name of the property
     * @param length number of rows the 2D array has. Can be number or other property.
     * @param splitBy Separator character. By default it splits every character.
     * @param mapFunc Transform every element in something else.
     * @example .matrix('matrix', 3) // lines: '123\n456\n789' output: data.matrix = [[1,2,3], [4,5,6], [7,8,9]]
     * @example .matrix('matrix', 'n', " ",  x => x*10) // lines: '1 2 3\n4 5 6\n7 8 9' output: data.matrix = [[10,20,30], [40,50,60], [70,80,90]]
     */
    matrix<K extends string, V = string>(
        name: K,
        length: number | string,
        splitBy = '',
        mapFunc?: (line: string) => V
    ): InToJSParser<T & { [k in K]: Array<Array<V extends undefined ? string : V>> }> {

        if (!mapFunc)
            mapFunc = (x) => x as V;

        const n = typeof length === 'number' ? length : (this.obj[length] as number);
        const arr: Array<Array<any>> = [];

        for (let i = 0; i < n; i++)
            arr.push(this.fileContent[this.i + i].split(splitBy).map(mapFunc));


        const nextPart = {
            [name]: arr
        } as { [k in K]: Array<Array<ReturnType<typeof mapFunc>>> };

        Object.assign(this.obj, nextPart);
        this.i += n;

        return this as InToJSParser<T & { [k in K]: Array<Array<V extends undefined ? string : V>> }>;
    }

    /**
     * 
     * @param name name of the property
     * @param length number of objects. Can be number or other property.
     * @param builder custom Parser to extract the object's properties
     * @example .number('ghostCount').arrayOfObject("ghosts", 'ghostCount', P => P.string('name').numbers('x y').array("path")) // output: data.ghosts = [{ name: 'Casper', x: 10, y: 14, path: ['U', 'U', 'D', 'L', 'R', 'D'] }]
     */
    arrayOfObject<K extends string, V extends InToJSParser>(
        name: K,
        length: number | string,
        builder: (P: InToJSParser) => V
    ): InToJSParser<T & { [k in K]: Array<ReturnType<typeof builder>['obj']> }> {

        const n = typeof length === 'number' ? length : this.obj[length] as number;
        const arr = [];

        for (let i = 0; i < n; i++) {
            const temp = InToJSParser.create(this.fileContent, this.i);

            const parsed = builder(temp);
            const obj = parsed.build();

            arr.push(obj);

            this.i = parsed.i;
        }
        const nextPart = {
            [name]: arr
        } as { [k in K]: Array<Array<ReturnType<typeof builder>['obj']>> };

        Object.assign(this.obj, nextPart);

        return this as InToJSParser<T & { [k in K]: Array<ReturnType<typeof builder>['obj']> }>;
    }

    build(): T {
        return this.obj;
    }
}