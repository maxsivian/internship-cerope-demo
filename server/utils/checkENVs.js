export function checkENVs(array) {

    let errorArray = []

    for (let i = 0; i < array.length; i++) {
        // console.log(array[i]);
        if (!process.env[array[i]]) {
            errorArray.push(`${array[i]} is missing`)
        }
    }

    if (errorArray.length > 0) {
        // console.log(errorArray.join("\n"));
        for (let i = 0; i < errorArray.length; i++) {
            console.log(`⚠️  ${errorArray[i]}`);
        }
        throw new Error("Environment Variables Missing !")
    }
    else{
        console.log("✅ All environment variables present");
        console.log(array);
    }
}