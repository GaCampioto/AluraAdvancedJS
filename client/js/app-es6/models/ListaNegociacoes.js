class ListaNegociacoes {
    
    constructor (armadilha){
        this._negociacoes = [];
        this._armadilha = armadilha;
    }

    adiciona(negociacao){
        this._negociacoes.push(negociacao);
    }

    esvazia(){
        this._negociacoes = [];
    }

    ordenar(criteria){
        this._negociacoes.sort(criteria);
    }

    inverterOrdem(column){
        this._negociacoes.reverse();
    }

    get negociacoes(){
        return [].concat(this._negociacoes);
    }

    get volumeTotal(){
        return this._negociacoes.reduce((total, n) => total + n.volume, 0.0);
    }
}