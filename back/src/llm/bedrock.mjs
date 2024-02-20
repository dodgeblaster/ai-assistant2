import {
    BedrockRuntimeClient,
    InvokeModelCommand
} from '@aws-sdk/client-bedrock-runtime'

const client = new BedrockRuntimeClient({ region: 'us-east-1' })

const isFast = true
export default async function ai(
    mode,
    prompt,
    temperature = 0.9,
    maxTokens = 400,
    topK = 250,
    topP = 0.999,
    stop = 'Human:'
) {
    const templateJs = `

Human: You only respond with js code examples. None of the code should include npm installing anything.

    ${prompt}

    Assistant:`

    const templateRust = `

Human: I am new to rust lang and am trying to learn it. I would like to know how to do the following:

${prompt}

You only respond with rust code examples. 

Assistant: \`\`\`rust`

    const templateRephrase = `

Human: I am a new leader, and I want to build trust with my team. You are a John Maxwell expert, and have read all his books.

Here is an instruction I need to give to an employee:

<instruction>
${prompt}
</instruction>

Can you please rewrite this in a way that respects my employee, but also is clear and direct. Use all of the John Maxwell knowledge
you know to help rewrite this message. Rewrites should be as concise as possible and try not to sound too formal

Assistant:`

    const templateIdea = `

Human: I have an idea that I need to communicate to senior leadership of a tech company.

Here is the idea:

<idea>
${prompt}
</idea>

Can you give me 3 points on what this idea does right, give me 5 points critizing the idea, logic, and clarity
on the idea. Be brutal when making these points. Then offer suggestions for how this idea could be
communicated better.

Assistant:`

    const templateAny = `

Human: ${prompt}

Assistant:`

    let template = templateJs

    if (mode === 'rust') {
        template = templateRust
    }

    if (mode === 'rephrase') {
        template = templateRephrase
    }

    if (mode === 'idea') {
        template = templateIdea
    }

    if (mode === 'any') {
        template = templateAny
    }

    const promptParams = {
        prompt: template,
        max_tokens_to_sample: maxTokens,
        temperature,
        top_k: topK,
        top_p: topP,
        anthropic_version: 'bedrock-2023-05-31',
        stop_sequences: [stop]
    }

    const params = {
        modelId: isFast ? 'anthropic.claude-instant-v1' : 'anthropic.claude-v2',
        contentType: 'application/json',
        accept: '*/*',
        body: JSON.stringify(promptParams)
    }

    const command = new InvokeModelCommand(params)
    const data = await client.send(command)
    const asciiDecoder = new TextDecoder('ascii')
    const res = asciiDecoder.decode(data.body)

    if (mode === 'rust') {
        return ` \`\`\`rust` + JSON.parse(res).completion
    } else {
        return JSON.parse(res).completion
    }
}
