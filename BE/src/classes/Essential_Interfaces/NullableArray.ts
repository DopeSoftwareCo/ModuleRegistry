// The whole point of this is to make this GUARDABLE

export class NullableArray<T> {
    protected content: Array<T>;
    protected isEmpty: boolean = true;
    protected isDefined: boolean = false;

    constructor(content?: Array<T>) {
        if (content) {
            this.content = content;
            this.isEmpty = content.length < 1;
            this.isDefined = true;
        } else {
            this.content = new Array<T>(1);
        }
    }

    get IsDefined(): boolean {
        return this.isDefined;
    }

    get IsEmpty(): boolean {
        return this.isEmpty;
    }

    get Content(): Array<T> {
        return this.content;
    }

    get UndefinedOr_Content(): Array<T> | undefined {
        return this.isDefined ? this.content : undefined;
    }

    set Content(newContent: Array<T>) {
        this.content = newContent;
        this.isEmpty = newContent.length < 1;
        this.isDefined = true;
    }
}
