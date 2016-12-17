export class DateHelper {
    constructor() {
        throw new Error ("Está classe não pode ser instanciada.'")
    }

    static textToDate(text){
        let regex = /\d{4}-\d{2}-\d{2}/;
        if(!regex.test(text))
            throw new Error ("O texto deve estar no formato yyyy-mm-dd");

       
        return new Date(...text
                            .split("-")
                            .map((element, index) => element - index % 2));     
    }

    static dateToText(data){
        return `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`;
    }
}