class NegociacaoService {

    constructor(){
        this._HttpService = new HttpService();
    }

    obterNegociacoes(){
        return Promise.all([
                this._importarNegociacoesDaSemana(),
                this._importarNegociacoesDaSemanaAnterior(),
                this._importarNegociacoesDaSemanaRetrasada()]
            )
            .then(negociacoesSemanas => {
                let negociacoes = negociacoesSemanas.reduce((flatArray, negociacoes) => flatArray.concat(negociacoes), [])
                    .map(negociacao => new Negociacao(new Date(negociacao.data), negociacao.quantidade, negociacao.valor));
                return negociacoes;
            }).catch(error => {
                throw new Error(error)
            });
    }

    importa(listaAtual){
        return this.obterNegociacoes()
                .then(negociacoes => 
                    negociacoes.filter(negociacao => 
                        !listaAtual.some( negociacaoLista => 
                            negociacao.equals(negociacaoLista))))
                .catch(error => {
                    console.log(error);
                    throw new Error("Não foi possível recuperar as negociações");
                });
    }

    adiciona(negociacao){
        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.adiciona(negociacao))
            .then(() => "Negociação adicionada com sucesso!")
            .catch(errorMessage => {
                console.log(errorMessage);
                throw new Error("Não foi possível adicionar a negociação!");
            });
    }

    apagar(){
        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.apagarTodos())
            .then(message => "Negociações apagadas com sucesso!")
            .catch(errorMessage => {
                console.log(errorMessage);
                throw new Error("Não foi possível apagar as negociações!");
            });
    }    

    _importarNegociacoesDaSemana(){
        return  this._HttpService.get("/negociacoes/semana")
            .then(negociacoes => {
                return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor))
            })
            .catch((error) => {
                console.log(error)
                throw new Error("Não foi possível recuperar as negociações da semana.")
            });
    }

    _importarNegociacoesDaSemanaAnterior(){
        return this._HttpService.get("/negociacoes/anterior")
            .then(negociacoes => {
                return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor))
            })
            .catch(() => {
                console.log(error)
                throw new Error("Não foi possível recuperar as negociações da semana passada.")
            });
    }

    _importarNegociacoesDaSemanaRetrasada(){
        return this._HttpService.get("/negociacoes/retrasada")
            .then(negociacoes => {
                return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor))
            })
            .catch(() => {
                console.log(error)
                throw new Error("Não foi possível recuperar as negociações da semana retrasada.")
            });
    }
}