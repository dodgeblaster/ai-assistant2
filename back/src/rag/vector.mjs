import pkg from 'faiss-node'
const { IndexFlatL2, Index, IndexFlatIP, MetricType } = pkg

export function makeVectorDb(data, size = 3) {
    // make index
    const dimension = size
    const index = new IndexFlatL2(dimension)

    // add each items vectors in db, and keep track of which id corresponds to
    // each set of vectors
    let idIndex = []
    Object.keys(data).forEach((k) => {
        const x = data[k]
        index.add(x.embeddings)
        idIndex.push(k)
    })

    return {
        search: (embedding, amount = 3) => {
            // search vectors and get index of vectors that match most closely
            const results = index.search(embedding, amount)
            // look up the id that matches the vectors we found
            return results.labels.map((i) => idIndex[i])
        }
    }
}
