class NegociacaoController {
    
    constructor(){
        let $ = document.querySelector.bind(document);
        this._inputData = $("#data");
        this._inputQuantidade = $("#quantidade");
        this._inputValor = $("#valor");
        let self = this; // guarda em uma variável o valor de this
        this._listaNegociacoes = new Proxy(new ListaNegociacoes(), {

            get(target, prop, receiver) {
                if(['adiciona', 'esvazia'].includes(prop) && typeof(target[prop]) === typeof(Function)) {
                    return function() {
                        console.log(`método '${prop}' interceptado`);
                        Reflect.apply(target[prop], target, arguments);

                        // acessa o self que a instância de NegociacoesController
                        self._negociacoesView.update(target);
                    }
                }
                return Reflect.get(target, prop, receiver);   
            }
        });
        
        this._negociacoesView = new NegociacoesView($("#negociacoesView"));
        this._negociacoesView.update(this._listaNegociacoes);
        
        this._mensagem = new Mensagem();
        this._mensagemView = new MensagemView($("#mensagemView"));
        this._mensagemView.update(this._mensagem);
    }

    adiciona (event) {
        event.preventDefault();    
        let negociacao = this._criarNegociacao();
        this._limparFormulario();
        this._listaNegociacoes.adiciona(negociacao);
        this._mensagem.text = "Negociação adiconada com sucesso!";
        this._mensagemView.update(this._mensagem);
    }

    esvazia(event) {
        event.preventDefault();
        this._listaNegociacoes.esvazia();
        this._mensagem.text = "Negociação removida com sucesso!";
        this._mensagemView.update(this._mensagem);
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