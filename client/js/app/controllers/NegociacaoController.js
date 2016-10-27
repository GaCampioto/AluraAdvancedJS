class NegociacaoController {
    
    constructor(){
        let $ = document.querySelector.bind(document);
        this._inputData = $("#data");
        this._inputQuantidade = $("#quantidade");
        this._inputValor = $("#valor");
    }

    adiciona (event) {
        event.preventDefault();
        //Date recebe ANO / MES / DIA

        let data = new Date(
            ...this._inputData
                   .value
                   .split("-")
                   .map((element, index) => element - index % 2));    
        let negociacao = new Negociacao(data, this._inputQuantidade.value, this._inputValor.value);
        
        this._inputData.value = "";
        this._inputQuantidade.value = "";
        this._inputValor.value = "";

        focus(this._inputData);

        console.log(negociacao);
    }

}