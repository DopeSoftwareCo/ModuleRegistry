export const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();

export const testToken =
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Il94X0ZQczk3THZOTVhfQzQwSlNfciJ9.eyJ1c2VybmFtZSI6ImRlZmF1bHR1c2VyIiwiaXNzIjoiaHR0cHM6Ly9kZXYtcXl5NWpmaDFmY3Zvb2Jjay51cy5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NjcwYWFhOWQ2OTBjNmZlOGUwZDBjZWIxIiwiYXVkIjoiaHR0cHM6Ly9ncnAtMS1zd2UtMjAyNC8iLCJpYXQiOjE3MjkxMTc5MTAsImV4cCI6MTcyOTE1MzkxMCwiZ3R5IjoicGFzc3dvcmQiLCJhenAiOiJQRGc0RzBGSHpXZHJXVDJ1aElEQTJRTjBRSGdxeGFYSCIsInBlcm1pc3Npb25zIjpbImFkbWluIiwiZGVmYXVsdFVzZXIiXX0.hKo0EPhp0IBDNlMocwjd1vVf4yfooz_MQTTqINAuLFCdrnsERN5Wj2RARMfjOKIFI33VLEGkcB_mIDh7fqn4cka9heuccsW80-HnkZymv8ZpyY5i4tFIMsiwFUUujO1xVKRb0i2Vbg01TExAbh67Hc_U27UHX6VS3PoE8nVJDaOb6VXc-CzTtySrp_UrFNrBAUAFQd_RpWBNInYT3USQBhNLAuWztFY75xGCl3Y_Mki_XDJxE1JtpJLyV3AKN39ggQVEy0Z5es4JG8T3GTN2fhXUVUhfQpSIRMBHpRLR2DAjbUhMbf828CGJk-8oLdSy05_jk6bWKQ8L14iy0wuB4A';
