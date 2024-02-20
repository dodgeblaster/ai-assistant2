import {
    BedrockRuntimeClient,
    InvokeModelCommand
} from '@aws-sdk/client-bedrock-runtime'

const client = new BedrockRuntimeClient({ region: 'us-east-1' })

const isFast = true
export async function embed({ text }) {
    const promptParams = {
        inputText: text
    }

    const params = {
        modelId: 'amazon.titan-embed-text-v1',
        contentType: 'application/json',
        accept: '*/*',
        body: JSON.stringify(promptParams)
    }

    const command = new InvokeModelCommand(params)
    const data = await client.send(command)
    const asciiDecoder = new TextDecoder('ascii')
    const res = asciiDecoder.decode(data.body)
    return JSON.parse(res)
}
