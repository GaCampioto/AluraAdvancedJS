class NegociacaoController {
    
    constructor(){
        let $ = document.querySelector.bind(document);
        this._inputData = $("#data");
        this._inputQuantidade = $("#quantidade");
        this._inputValor = $("#valor");

        this._ordemAtual = "";

        this._listaNegociacoes = new Bind(
            new ListaNegociacoes(),
            new NegociacoesView($("#negociacoesView")),
            "adiciona", "esvazia", "ordenar", "inverterOrdem"
        );
        
        this._mensagem = new Bind(
            new Mensagem(),
            new MensagemView($("#mensagemView")),
            "text"
        );
    }

    adiciona (event) {
        event.preventDefault();    
        this._listaNegociacoes.adiciona(this._criarNegociacao());
        this._limparFormulario();
        this._mensagem.text = "Negociação adiconada com sucesso!";
    }

    importarNegociacoes (event){
        event.preventDefault();
        let service = new NegociacaoService();
        service.obterNegociacoes()
            .then(negociacoes => {
                console.log(negociacoes);
                negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
                this._mensagem.text = "Negociações importadas com sucesso";
            })
            .catch(error => this._mensagem.text = error);

    }

    esvazia(event) {
        event.preventDefault();
        this._listaNegociacoes.esvazia();
        this._mensagem.text = "Negociação removida com sucesso!";
    }

    ordena (event, column){
        event.preventDefault();
        
        if(this._ordemAtual == column){
            this._listaNegociacoes.inverterOrdem();
        } else {
            this._listaNegociacoes.ordenar( (a,b) => a[column] - b[column]);
        }
        this._ordemAtual = column;
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