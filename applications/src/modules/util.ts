export function delay(ms:number){
    return new Promise((resolve) => setTimeout(()=> {resolve(true)}, ms))
}

export function normalizeName(str:string){

    let result = [];

    let words = str.trim().split(' ');
    for (let i = 0; i < words.length; i++) {
        const word = words[i].trim();
        if(word === '') continue;
        const lowerCaseStr = word.toLowerCase();
        result.push(word[0].toUpperCase() + lowerCaseStr.substring(1)) 
    }

    return result.join(' ')
    
}
export function getDate(date:string| undefined = undefined){
    return date? (new Date(date)).toISOString():(new Date()).toISOString()
}