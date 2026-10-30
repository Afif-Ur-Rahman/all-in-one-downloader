type AppEnv = "dev" | "stag" | "prod";

const MODE = (process.env.MODE ?? "dev") as AppEnv;

export { MODE };
