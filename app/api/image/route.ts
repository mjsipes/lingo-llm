export async function POST(req: Request) {
  console.log("image api hit");
  const { prompt, model } = await req.json();

  try {
    let processedPrompt = prompt;
    if (model === "dall-e-2") {
      processedPrompt = prompt.slice(-800);
    }

    console.log(`Generating image with prompt: ${processedPrompt}`);

    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          prompt: processedPrompt,
          n: 1,
          size: "1024x1024",
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("RESPONSE: api/image ... ");
    const imageUrl = data.data[0].url;

    return Response.json({ imageUrl });
  } catch (error) {
    console.error("Error generating image:", error);
    return Response.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
