write me a story. start with a boy who gets lost in the desert. include the words trees, leaves, branches, and bark


my mind is racing so i need to settle down and pick out my baby steps because i dont even know what im doing.
big picture there will be no text, big picture it will jsut be image, big picture we need to change from sonner to a better mode. 
right now i need to add debug infor for agentcardfox.



add streaming or caching to the owl
getting context for each image.
giving context to the lion.
loading state for image
add image input
adding randome word inspirator.

immediate next step = context to ai lion.

next step: add context and image to imageagents

saving this massive massive prompt, lets first change grok to a regular api call.:


hello, please help me improve the imageAgentUserPrompt in the same way that we improve the agentLionUserPrompt. i would like for the imageAgentUserPrompt to have context from the messages and selected text as well. can we please create a 2 use effects to manage the agentLionUserPrompt. i woud like for the image prompt to consist of two theings. background context and immediate subject. the immediate subject will be selectedText, when selected text changes, i would like for a state variable names immediateSubject to be generated via an api call to groq asking to analyze the contents of the selectedText and create an immediate subject line suitable for passing into an image gen model. likewise, i would like a useeffect that calls groq api whenever messages changes, i would like for it to take messages and say create an appropriate background context of the story from the messages suitable for giving imagery to an ai model. when it returns, it sets a variable called backgroundContext to the returned message, finally, pass in a prompt to the two image agents that combines the backgroundContect, immediateSubject, and styleGuidelines. here is an example of calling grok api:
here is example of hitting groq endpoint:
here is an example of hitting the groq endpoint:
const response = await fetch('/api/groq', {
 method: 'POST',
 headers: {
   'Content-Type': 'application/json',
 },
 body: JSON.stringify({
   systemPrompt: "You are a helpful assistant.",
   userPrompt: "What is the capital of France?",
 }),
});

const data = await response.json();
console.log(data.content); // The AI response

