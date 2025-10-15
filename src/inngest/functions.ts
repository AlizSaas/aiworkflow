import { inngest } from "@/inngest/client";


import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
export const executeAI = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {

    const {steps} = await step.ai.wrap( 'Generating Text', generateText,{
      model: openai('gpt-4.1'),
      system:'You are a helpful assistant that helps people find information.',
      prompt: 'Write a short describtion about  cbr honda bikes.',
      experimental_telemetry:{
        isEnabled:true,
        recordInputs:true,
        recordOutputs:true,
      }


    });

    return steps;


  
  },
);