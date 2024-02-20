import ask from './llm/ai.mjs'
import bedrock from './llm/bedrock.mjs'
import { makeServer } from './server.mjs'

function timer() {
    const start = Date.now()

    return () => {
        const end = Date.now()
        const time = end - start
        const formattedtime = (time / 1000).toFixed(2)
        return formattedtime
    }
}

makeServer([
    {
        path: '/submit',
        fn: async (data) => {
            const getTime = timer()

            if (data.mode === 'aws') {
                const result = await bedrock(data.strategy, data.question)
                return {
                    answer: result,
                    time: getTime()
                }
            }

            if (data.mode === 'local') {
                const result = await ask(data.strategy, data.question)
                return {
                    answer: result,
                    time: getTime()
                }
            }

            throw new Error('mode is invalid')
        }
    }
])
