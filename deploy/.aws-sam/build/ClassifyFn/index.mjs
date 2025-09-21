// lambda/index.mjs
import { InvokeEndpointCommand, SageMakerRuntimeClient } from "@aws-sdk/client-sagemaker-runtime";
import { Buffer } from "node:buffer";

const ENDPOINT_NAME = process.env.ENDPOINT_NAME;
const REGION = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "ap-southeast-1";
const smr = new SageMakerRuntimeClient({ region: REGION });

// Quick Malaysia recycling hints per class
const MY_RULES = {
    glass: { recyclable: true, note: "Clean bottles/jars. Remove caps, rinse." },
    metal: { recyclable: true, note: "Aluminum/steel cans accepted. Rinse; empty spray cans only." },
    paper: { recyclable: true, note: "Clean & dry paper/cardboard. No food-soiled/wet tissue." },
    plastic: { recyclable: "depends", note: "Check resin code. #1 PET & #2 HDPE widely accepted; others vary." },
};

function corsHeaders() {
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
    };
}

// Normalize AWS SDK v3 body (Uint8Array/Buffer/stream) to UTF-8 string
async function bodyToString(body) {
    if (!body) return "";
    if (body instanceof Uint8Array) return Buffer.from(body).toString("utf8");
    if (Buffer.isBuffer(body)) return body.toString("utf8");
    if (typeof body.on === "function") {
        const chunks = [];
        for await (const chunk of body) chunks.push(chunk);
        return Buffer.concat(chunks).toString("utf8");
    }
    return String(body);
}

export const handler = async (event) => {
    // CORS preflight
    if (event.requestContext?.http?.method === "OPTIONS") {
        return { statusCode: 200, headers: corsHeaders(), body: "" };
    }

    try {
        if (!ENDPOINT_NAME) {
            return {
                statusCode: 500,
                headers: corsHeaders(),
                body: JSON.stringify({ error: "missing_endpoint_name" }),
            };
        }

        const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        const b64 = body?.image_base64;
        if (!b64) {
            return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ error: "image_base64 missing" }) };
        }

        const bytes = Buffer.from(b64, "base64");

        const resp = await smr.send(
            new InvokeEndpointCommand({
                EndpointName: ENDPOINT_NAME,
                ContentType: "image/jpeg", // inference.py accepts image/*
                Body: bytes,
            })
        );

        const raw = await bodyToString(resp.Body);        // <-- fixed
        const modelOut = JSON.parse(raw);                 // { classes, probs, top_class, top_prob }

        const guidance = MY_RULES[modelOut.top_class] ?? {};
        const out = { ...modelOut, guidance };

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders() },
            body: JSON.stringify(out),
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            headers: corsHeaders(),
            body: JSON.stringify({ error: "classification_failed" }),
        };
    }
};
