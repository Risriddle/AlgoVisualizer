// src/Algorithms/BFS.js
export const bfs = async (graph, startNode, setGraph, speedRef, isPausedRef) => {
    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    };

    const queue = [startNode];
    const visited = new Set();
    const updatedGraph = { ...graph };

    while (queue.length > 0) {
        if (isPausedRef.current) {
            // Wait until paused state is false
            await new Promise(resolve => {
                const checkPause = setInterval(() => {
                    if (!isPausedRef.current) {
                        clearInterval(checkPause);
                        resolve();
                    }
                }, 50); // Check every 50ms
            });
        }

        const currentNode = queue.shift();
        if (visited.has(currentNode)) continue;

        visited.add(currentNode);
        updatedGraph[currentNode].status = 'visited';
        setGraph({ ...updatedGraph });

        await sleep(1001 - speedRef.current); // Use speed from ref

        for (const neighbor of updatedGraph[currentNode].neighbors) {
            if (!visited.has(neighbor)) {
                queue.push(neighbor);
                updatedGraph[neighbor].status = 'inQueue';
                setGraph({ ...updatedGraph });
                await sleep(1001 - speedRef.current); // Use speed from ref
            }
        }
    }
};
