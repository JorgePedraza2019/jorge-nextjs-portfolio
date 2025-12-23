export async function POST(req) {
  const { message } = await req.json();
  const dummyResponse = `Esto es un demo streaming para: "${message}"`;

  const encoder = new TextEncoder();
  let i = 0;

  return new Response(
    new ReadableStream({
      async pull(controller) {
        if (i < dummyResponse.length) {
          controller.enqueue(encoder.encode(dummyResponse[i]));
          i++;
          await new Promise((r) => setTimeout(r, 30)); // simula token por token
        } else {
          controller.close();
        }
      },
    }),
    { headers: { "Content-Type": "text/plain" } }
  );
}