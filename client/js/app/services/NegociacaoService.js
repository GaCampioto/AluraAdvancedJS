"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NegociacaoService = function () {
    function NegociacaoService() {
        _classCallCheck(this, NegociacaoService);

        this._HttpService = new HttpService();
    }

    _createClass(NegociacaoService, [{
        key: "obterNegociacoes",
        value: function obterNegociacoes() {
            return Promise.all([this._importarNegociacoesDaSemana(), this._importarNegociacoesDaSemanaAnterior(), this._importarNegociacoesDaSemanaRetrasada()]).then(function (negociacoesSemanas) {
                var negociacoes = negociacoesSemanas.reduce(function (flatArray, negociacoes) {
                    return flatArray.concat(negociacoes);
                }, []).map(function (negociacao) {
                    return new Negociacao(new Date(negociacao.data), negociacao.quantidade, negociacao.valor);
                });
                return negociacoes;
            }).catch(function (error) {
                throw new Error(error);
            });
        }
    }, {
        key: "importa",
        value: function importa(listaAtual) {
            return this.obterNegociacoes().then(function (negociacoes) {
                return negociacoes.filter(function (negociacao) {
                    return !listaAtual.some(function (negociacaoLista) {
                        return negociacao.equals(negociacaoLista);
                    });
                });
            }).catch(function (error) {
                console.log(error);
                throw new Error("Não foi possível recuperar as negociações");
            });
        }
    }, {
        key: "adiciona",
        value: function adiciona(negociacao) {
            return ConnectionFactory.getConnection().then(function (connection) {
                return new NegociacaoDao(connection);
            }).then(function (dao) {
                return dao.adiciona(negociacao);
            }).then(function () {
                return "Negociação adicionada com sucesso!";
            }).catch(function (errorMessage) {
                console.log(errorMessage);
                throw new Error("Não foi possível adicionar a negociação!");
            });
        }
    }, {
        key: "apagar",
        value: function apagar() {
            return ConnectionFactory.getConnection().then(function (connection) {
                return new NegociacaoDao(connection);
            }).then(function (dao) {
                return dao.apagarTodos();
            }).then(function (message) {
                return "Negociações apagadas com sucesso!";
            }).catch(function (errorMessage) {
                console.log(errorMessage);
                throw new Error("Não foi possível apagar as negociações!");
            });
        }
    }, {
        key: "_importarNegociacoesDaSemana",
        value: function _importarNegociacoesDaSemana() {
            return this._HttpService.get("/negociacoes/semana").then(function (negociacoes) {
                return negociacoes.map(function (objeto) {
                    return new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor);
                });
            }).catch(function (error) {
                console.log(error);
                throw new Error("Não foi possível recuperar as negociações da semana.");
            });
        }
    }, {
        key: "_importarNegociacoesDaSemanaAnterior",
        value: function _importarNegociacoesDaSemanaAnterior() {
            return this._HttpService.get("/negociacoes/anterior").then(function (negociacoes) {
                return negociacoes.map(function (objeto) {
                    return new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor);
                });
            }).catch(function () {
                console.log(error);
                throw new Error("Não foi possível recuperar as negociações da semana passada.");
            });
        }
    }, {
        key: "_importarNegociacoesDaSemanaRetrasada",
        value: function _importarNegociacoesDaSemanaRetrasada() {
            return this._HttpService.get("/negociacoes/retrasada").then(function (negociacoes) {
                return negociacoes.map(function (objeto) {
                    return new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor);
                });
            }).catch(function () {
                console.log(error);
                throw new Error("Não foi possível recuperar as negociações da semana retrasada.");
            });
        }
    }]);

    return NegociacaoService;
}();
//# sourceMappingURL=NegociacaoService.js.map