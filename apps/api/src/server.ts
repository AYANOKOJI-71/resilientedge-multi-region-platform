import cors from "@fastify/cors";
import Fastify from "fastify";
import { RegionalFailoverSimulator } from "./simulator.js";

const app = Fastify({ logger: true });
const simulator = new RegionalFailoverSimulator();
await app.register(cors, { origin: true });
app.get("/health", async () => ({ status: "ok", mode: "deterministic-local", cloudCalls: false }));
app.get("/api/overview", async () => simulator.overview());
app.post("/api/drills/regional-failover", async () => simulator.runFailoverDrill());
app.post("/api/drills/restore-primary", async () => simulator.restorePrimary());
const port = Number(process.env.RESILIENCE_API_PORT ?? 4600);
await app.listen({ port, host: "0.0.0.0" });
