import chalk from "chalk";
import { Application } from "express";

const colorBasedOnType = (method: string) => {
    switch (method) {
        case "POST":
            return chalk.yellowBright(method);
        case "GET":
            return chalk.greenBright(method);
        case "PUT":
            return chalk.blueBright(method);
        case "PATCH":
            return chalk.magenta(method);
        case "DELETE":
            return chalk.redBright(method);
        case "OPTIONS":
            return chalk.magentaBright(method);
    }
};

const handleRouteMethod = (method: string) => {
    if (method.length < 8) {
        method = colorBasedOnType(method) + " ".repeat(8 - method.length);
    }
    return method;
};

const getReadableParentPath = (newParentPath: string) => {
    newParentPath = newParentPath.replace("/", "");
    if (newParentPath.length === 0) return "Router: BASE";
    else return `${chalk.blueBright("Router:")} ${chalk.whiteBright.bold(newParentPath.toUpperCase())}`;
};

const listRoutes = (app: Application) => {
    const loggedRoutes = new Set<string>();

    const getRoutes = (stack: any[], parentPath: string = "") => {
        stack.forEach((layer) => {
            if (layer.route) {
                // Handle regular routes
                const path = normalizePath(parentPath + layer.route.path);
                layer.route.stack.forEach((routeLayer: any) => {
                    const route = `${handleRouteMethod(routeLayer.method.toUpperCase())} ${path}`;
                    if (!loggedRoutes.has(route)) {
                        console.log(`             ${route}/`);
                        loggedRoutes.add(route);
                    }
                });
            } else if (layer.name === "router" && layer.handle.stack) {
                // Handle nested routers
                const newParentPath = normalizePath(parentPath + cleanPath(layer.regexp.source));
                console.log(`     ${getReadableParentPath(newParentPath)}`);
                getRoutes(layer.handle.stack, newParentPath);
            }
        });
    };

    const cleanPath = (regexpPath: string): string => {
        // Remove non-capturing groups if they still exist
        return regexpPath.replace(/[^a-zA-Z0-9/:]/g, "");
    };

    const normalizePath = (path: string): string => {
        // Remove extra slashes and ensure single leading slash
        return path.replace(/\/{2,}/g, "/").replace(/\/$/, "") || "/";
    };

    // Start from the application's stack
    console.log(`✅ ${chalk.greenBright("Routes")}`);
    getRoutes(app._router.stack);
    console.log("\n");
};

export default listRoutes;
