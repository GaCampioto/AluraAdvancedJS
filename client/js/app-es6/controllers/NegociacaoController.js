import {Negociacao} from '../models/Negociacao';
import {ListaNegociacoes} from '../models/ListaNegociacoes';
import {Mensagem} from '../models/Mensagem';
import {NegociacaoService} from '../services/NegociacaoService';
import {ConnectionFactory} from '../services/ConnectionFactory';
import {NegociacaoDao} from '../dao/NegociacaoDao';
import {DateHelper} from '../helpers/DateHelper';
import {Bind} from '../helpers/Bind';
import {NegociacoesView} from '../views/NegociacoesView';
import {MensagemView} from '../views/MensagemView';

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

        this._service = new NegociacaoService();

        this._init();
    }

    _init(){
        ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.listarTodos())
            .then(negociacoes => 
                negociacoes.forEach(
                    negociacao => this._listaNegociacoes.adiciona(negociacao)))
            .catch((errorMessage) => this._mensagem.text = errorMessage);

        setInterval(() => this.importarNegociacoes(), 3000);
    }

    adiciona (event) {
        event.preventDefault();
        let negociacao = this._criarNegociacao();

        this._service
            .adiciona(negociacao)
            .then(() => {
                this._listaNegociacoes.adiciona(negociacao);
                this._limparFormulario();
                this._mensagem.text = "Negociação adiconada com sucesso!";
            })
            .catch((errorMessage) => this._Mensagem.text = errorMessage);
    }

    importarNegociacoes (){
        this._service
            .importa(this._listaNegociacoes.negociacoes)
            .then(negociacoes => 
                negociacoes.forEach(negociacao => {
                    this._listaNegociacoes.adiciona(negociacao);
                    this._mensagem.texto = 'Negociações do período importadas'}))
            .catch(errorMessage => this._mensagem.texto = errorMessage);
    }

    apagar(event) {
        event.preventDefault();
        this._service
            .apagar()
            .then(message => {
                this._listaNegociacoes.esvazia();
                this._mensagem.text = message;
            })
            .catch(message => this._mensagem = mensagem);
    }

    ordena(column){
        
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
        return new Negociacao(data, parseInt(this._inputQuantidade.value), parseFloat(this._inputValor.value));
    }

    _limparFormulario(){
        this._inputData.value = "";
        this._inputQuantidade.value = "";
        this._inputValor.value = "";

        focus(this._inputData);
    }

}

let negociacaoController = new NegociacaoController();

export function currentInstance(){
    return negociacaoController;
}