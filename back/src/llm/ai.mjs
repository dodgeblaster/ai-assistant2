import ollama from 'ollama'

const modals = {
    tinyllama: 'tinyllama',
    llama2: 'llama2',
    codellama: 'codellama:7b',
    phi: 'phi'
}

export default async function ask(mode, q) {
    const systemJs =
        'You only respond with js code examples. None of the code should include npm installing anything'

    const systemRust =
        'You only respond with js code examples. None of the code should include npm installing anything'

    const systemRephrase = ` I am a new leader, and I want to build trust with my team. You are a John Maxwell expert, and have read all his books.
    Can you please rewrite my messages in a way that respects my employee, but also is clear and direct. Use all of the John Maxwell knowledge
you know to help rewrite my message.`

    const systemIdea = `I have an idea that I need to communicate to senior leadership of a tech company.

Can you give me 3 points on what this idea does right, give me 5 points critizing the idea, logic, and clarity
on the idea. Be brutal when making these points. Then offer suggestions for how this idea could be
communicated better.`
    let system = systemJs

    if (mode === 'rust') {
        system = systemRust
    }

    if (mode === 'rephrase') {
        system = systemRephrase
    }

    if (mode === 'idea') {
        system = systemIdea
    }

    const output = await ollama.generate({
        model: modals.llama2,
        system,
        options: {
            temperature: 0.9,
            seed: 100
        },
        prompt: `[INST]${q}[/INST]`
    })

    return output.response //.split('```javascript')[1].split('```')[0]
}
