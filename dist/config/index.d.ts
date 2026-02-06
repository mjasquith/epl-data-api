interface Config {
    footballDataApiToken: string;
    cache?: {
        defaultTtlMs?: number;
        matches?: {
            fixtures?: number;
            results?: number;
        };
    };
}
export declare const config: Config;
export {};
//# sourceMappingURL=index.d.ts.map