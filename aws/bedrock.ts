// src/aws/bedrock.ts
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
    region: "us-east-1", // or your Bedrock region
    credentials: {
        accessKeyId: "",
        secretAccessKey: "",
    },
  });

export async function sendChatMessage(message: string) {
  const input = {
    modelId: "amazon.nova-pro-v1:0",
    body: JSON.stringify({
      messages: [
        { role: "user", content: [{ text: message }] }
      ],
      system: [
      { text:"make the answer concise but still give enough details"}
      ]
    }),
    contentType: "application/json",
    accept: "application/json"
  };

  const command = new InvokeModelCommand(input);
  const raw = await client.send(command);
  const json = JSON.parse(new TextDecoder().decode(raw.body));

  const text = json.output?.message?.content?.[0]?.text ?? ""; 
  return text;
}


