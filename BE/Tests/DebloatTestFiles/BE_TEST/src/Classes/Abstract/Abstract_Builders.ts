export abstract class Base_Builder<T> {
    protected creations?: Array<T>;
    protected remember: boolean;

    constructor(trackCreations: boolean = false) {
        this.remember = trackCreations;
        this.creations = trackCreations ? new Array<T>(10) : undefined;
    }

    get CreationHistory() {
        return this.creations;
    }
    get IsTrackingHistory() {
        return this.remember;
    }
}

export abstract class Builder<T> extends Base_Builder<T> {
    constructor(trackCreations: boolean = false) {
        super(trackCreations);
    }

    public abstract Build(source: any): T | undefined;
}

export abstract class AsyncBuilder<T> extends Base_Builder<T> {
    constructor(trackCreations: boolean = false) {
        super(trackCreations);
    }

    public abstract Build(source: any): Promise<T | undefined>;
}
