class NegociacaoController {
    
    constructor(){
        let $ = document.querySelector.bind(document);
        this._inputData = $("#data");
        this._inputQuantidade = $("#quantidade");
        this._inputValor = $("#valor");
        this._listaNegociacoes = new ListaNegociacoes();
    }

    adiciona (event) {
        event.preventDefault();    
            
        let negociacao = this._criarNegociacao();
        this._limparFormulario();

        this._listaNegociacoes.adiciona(negociacao);        

        console.log(negociacao);
        console.log(this._listaNegociacoes);
    }

    _criarNegociacao(){
        //Date recebe ANO / MES / DIA
        let data = new Date(DateHelper.textToDate(this._inputData.value));       
        return new Negociacao(data, this._inputQuantidade.value, this._inputValor.value);
    }

    _limparFormulario(){
        this._inputData.value = "";
        this._inputQuantidade.value = "";
        this._inputValor.value = "";

        focus(this._inputData);
    }

}