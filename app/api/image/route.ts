import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { prompt, model } = await req.json();
  console.log("\n\nimage api hit for ", model);

  // Check user credits
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return Response.json({ error: "Authentication required" }, { status: 401 });
  }

  const currentCredits = user.user_metadata?.credits || 0;
  console.log(`User ${user.id} has ${currentCredits} credits`);

  if (currentCredits < 1) {
    return Response.json({ 
      error: "Insufficient credits. You need 1 credit to generate an image." 
    }, { status: 402 });
  }

  try {
    let processedPrompt = prompt;
    if (model === "dall-e-2") {
      processedPrompt = prompt.slice(-800);
    }

    console.log(`Generating image with prompt: ${processedPrompt}\n\n`);

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

    // Fetch fresh credit count right before decrementing to avoid race conditions
    const { data: { user: freshUser }, error: freshUserError } = await supabase.auth.getUser();
    
    if (freshUserError || !freshUser) {
      console.error("Error fetching fresh user data:", freshUserError);
      return Response.json({ imageUrl }); // Still return the image, but don't update credits
    }

    const freshCredits = freshUser.user_metadata?.credits || 0;
    console.log(`Fresh credit check: ${freshCredits} credits remaining`);

    if (freshCredits < 1) {
      console.log("No credits remaining after fresh check, skipping decrement");
      return Response.json({ imageUrl }); // Still return the image, but don't update credits
    }

    // Deduct 1 credit after successful image generation
    const newCredits = freshCredits - 1;
    const { error: updateError } = await supabase.auth.updateUser({
      data: { 
        ...freshUser.user_metadata,
        credits: newCredits 
      }
    });

    if (updateError) {
      console.error("Error updating credits:", updateError);
    } else {
      console.log(`Credits updated: ${freshCredits} -> ${newCredits}`);
    }

    return Response.json({ imageUrl });
  } catch (error) {
    console.error("Error generating image:", error);
    return Response.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
