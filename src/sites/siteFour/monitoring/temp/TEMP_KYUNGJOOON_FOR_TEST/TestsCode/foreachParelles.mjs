



async function test(){

    await [1, 2, 3].forEachParallel(async (element) => {
        console.log('Processed ' + element);
    });
}


test();

