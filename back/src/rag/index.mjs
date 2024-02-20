import { embed } from './embed.mjs'
import { makeVectorDb } from './vector.mjs'

// look into https://github.com/typicode/lowdb

const SIZE = 20

const udata = {
    f34: {
        id: '234',
        data: `Air is the invisible mixture of gases that makes up the earth's atmosphere. It is composed primarily of nitrogen and oxygen, with small amounts of water vapor, carbon dioxide, and other trace gases. Air provides the oxygen needed for respiration and provides a medium for sound and heat transfer, making it vital for life on earth.`
    },
    a34: {
        id: 'a34',
        data: `Rock is a naturally occurring solid aggregate of one or more minerals or mineraloids. Rocks are extremely varied in their composition and can range from soft, fine-grained sedimentary rocks like clay and silt to hard, coarse-grained igneous rocks like granite. Dirt is loose particulate matter covering the surface of the earth, containing a mixture of organic matter, minerals, gases, liquids, and organisms that together support life.`
    },
    '2f4': {
        id: '2f4',
        data: `Water is a clear, odorless, and tasteless liquid. It is composed of two hydrogen atoms bonded to one oxygen atom. Water is fundamental to life on Earth and makes up the majority of the Earth's surface.`
    },
    '2x3': {
        id: '233',
        data: `Fire is the rapid oxidation of a material in the exothermic chemical process of combustion, releasing heat, light, and various reaction products. It requires fuel, oxygen, and an ignition source to initiate the combustion reaction. Fire has been an important part of human culture, being used for heat, cooking, industry, and as a visual representation of energy.`
    }
}

const data = {
    f34: {
        id: '234',
        data: "Air is the invisible mixture of gases that makes up the earth's atmosphere. It is composed primarily of nitrogen and oxygen, with small amounts of water vapor, carbon dioxide, and other trace gases. Air provides the oxygen needed for respiration and provides a medium for sound and heat transfer, making it vital for life on earth.",
        embeddings: [
            0.890625, 0.036865234, 0.6875, 0.51171875, -0.375, 0.33789062,
            -0.068847656, 0.00020694733, -0.00078964233, -0.13183594,
            0.16601562, 0.10888672, -0.083496094, -0.21582031, 0.14160156,
            -0.1328125, 0.00091552734, -0.03857422, -0.12451172, 0.24707031
        ]
    },
    a34: {
        id: 'a34',
        data: 'Rock is a naturally occurring solid aggregate of one or more minerals or mineraloids. Rocks are extremely varied in their composition and can range from soft, fine-grained sedimentary rocks like clay and silt to hard, coarse-grained igneous rocks like granite. Dirt is loose particulate matter covering the surface of the earth, containing a mixture of organic matter, minerals, gases, liquids, and organisms that together support life.',
        embeddings: [
            0.3984375, -0.234375, 0.22167969, 0.15039062, -0.15625, 0.43359375,
            0.2421875, 0.00035476685, 0.40625, -0.23632812, 0.31054688,
            0.15429688, -0.11816406, -0.22558594, -0.045654297, -0.035888672,
            0.14941406, -0.014953613, 0.014892578, 0.109375
        ]
    },
    '2f4': {
        id: '2f4',
        data: "Water is a clear, odorless, and tasteless liquid. It is composed of two hydrogen atoms bonded to one oxygen atom. Water is fundamental to life on Earth and makes up the majority of the Earth's surface.",
        embeddings: [
            0.6484375, -0.28515625, 0.61328125, 0.50390625, -0.48242188,
            0.047851562, 0.13183594, -0.000076293945, 0.36328125, -0.056884766,
            0.079589844, -0.1640625, 0.057373047, -0.15722656, 0.21582031,
            -0.05419922, 0.19824219, 0.038085938, -0.5546875, 0.17089844
        ]
    },
    '2x3': {
        id: '233',
        data: 'Fire is the rapid oxidation of a material in the exothermic chemical process of combustion, releasing heat, light, and various reaction products. It requires fuel, oxygen, and an ignition source to initiate the combustion reaction. Fire has been an important part of human culture, being used for heat, cooking, industry, and as a visual representation of energy.',
        embeddings: [
            -0.28125, 0.04296875, 0.20019531, 0.12695312, -0.41992188,
            0.15820312, 0.18164062, 0.00012874603, 0.09863281, -0.16503906,
            0.34765625, -0.17382812, 0.0036468506, -0.06542969, 0.22460938,
            -0.0020141602, 0.27539062, -0.17871094, -0.3203125, 0.11669922
        ]
    }
}

async function main() {
    // prep data with embeddings
    // for (const id of Object.keys(data)) {
    //     const item = data[id]
    //     const emb = await embed({ text: item.data })
    //     item.embeddings = emb.embedding.slice(0, SIZE)
    // }
    // console.log(JSON.stringify(data, null, 2))

    // make vector db
    const vdb = makeVectorDb(data, SIZE)

    // embed question
    const query = 'what is water'
    const emb = await embed({ text: query })

    // search db for relevant items:
    const result = vdb.search(emb.embedding.slice(0, SIZE), 2)
    console.log(result)
    console.log(result.map((id) => data[id]))
}

main()
