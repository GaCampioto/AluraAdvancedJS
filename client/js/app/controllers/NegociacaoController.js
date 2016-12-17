'use strict';

System.register(['../models/Negociacao', '../models/ListaNegociacoes', '../models/Mensagem', '../services/NegociacaoService', '../services/ConnectionFactory', '../dao/NegociacaoDao', '../helpers/DateHelper', '../helpers/Bind', '../views/NegociacoesView', '../views/MensagemView'], function (_export, _context) {
    "use strict";

    var Negociacao, ListaNegociacoes, Mensagem, NegociacaoService, ConnectionFactory, NegociacaoDao, DateHelper, Bind, NegociacoesView, MensagemView, _createClass, NegociacaoController, negociacaoController;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_modelsNegociacao) {
            Negociacao = _modelsNegociacao.Negociacao;
        }, function (_modelsListaNegociacoes) {
            ListaNegociacoes = _modelsListaNegociacoes.ListaNegociacoes;
        }, function (_modelsMensagem) {
            Mensagem = _modelsMensagem.Mensagem;
        }, function (_servicesNegociacaoService) {
            NegociacaoService = _servicesNegociacaoService.NegociacaoService;
        }, function (_servicesConnectionFactory) {
            ConnectionFactory = _servicesConnectionFactory.ConnectionFactory;
        }, function (_daoNegociacaoDao) {
            NegociacaoDao = _daoNegociacaoDao.NegociacaoDao;
        }, function (_helpersDateHelper) {
            DateHelper = _helpersDateHelper.DateHelper;
        }, function (_helpersBind) {
            Bind = _helpersBind.Bind;
        }, function (_viewsNegociacoesView) {
            NegociacoesView = _viewsNegociacoesView.NegociacoesView;
        }, function (_viewsMensagemView) {
            MensagemView = _viewsMensagemView.MensagemView;
        }],
        execute: function () {
            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            NegociacaoController = function () {
                function NegociacaoController() {
                    _classCallCheck(this, NegociacaoController);

                    var $ = document.querySelector.bind(document);
                    this._inputData = $("#data");
                    this._inputQuantidade = $("#quantidade");
                    this._inputValor = $("#valor");

                    this._ordemAtual = "";

                    this._listaNegociacoes = new Bind(new ListaNegociacoes(), new NegociacoesView($("#negociacoesView")), "adiciona", "esvazia", "ordenar", "inverterOrdem");

                    this._mensagem = new Bind(new Mensagem(), new MensagemView($("#mensagemView")), "text");

                    this._service = new NegociacaoService();

                    this._init();
                }

                _createClass(NegociacaoController, [{
                    key: '_init',
                    value: function _init() {
                        var _this = this;

                        ConnectionFactory.getConnection().then(function (connection) {
                            return new NegociacaoDao(connection);
                        }).then(function (dao) {
                            return dao.listarTodos();
                        }).then(function (negociacoes) {
                            return negociacoes.forEach(function (negociacao) {
                                return _this._listaNegociacoes.adiciona(negociacao);
                            });
                        }).catch(function (errorMessage) {
                            return _this._mensagem.text = errorMessage;
                        });

                        setInterval(function () {
                            return _this.importarNegociacoes();
                        }, 3000);
                    }
                }, {
                    key: 'adiciona',
                    value: function adiciona(event) {
                        var _this2 = this;

                        event.preventDefault();
                        var negociacao = this._criarNegociacao();

                        this._service.adiciona(negociacao).then(function () {
                            _this2._listaNegociacoes.adiciona(negociacao);
                            _this2._limparFormulario();
                            _this2._mensagem.text = "Negociação adiconada com sucesso!";
                        }).catch(function (errorMessage) {
                            return _this2._Mensagem.text = errorMessage;
                        });
                    }
                }, {
                    key: 'importarNegociacoes',
                    value: function importarNegociacoes() {
                        var _this3 = this;

                        this._service.importa(this._listaNegociacoes.negociacoes).then(function (negociacoes) {
                            return negociacoes.forEach(function (negociacao) {
                                _this3._listaNegociacoes.adiciona(negociacao);
                                _this3._mensagem.texto = 'Negociações do período importadas';
                            });
                        }).catch(function (errorMessage) {
                            return _this3._mensagem.texto = errorMessage;
                        });
                    }
                }, {
                    key: 'apagar',
                    value: function apagar(event) {
                        var _this4 = this;

                        event.preventDefault();
                        this._service.apagar().then(function (message) {
                            _this4._listaNegociacoes.esvazia();
                            _this4._mensagem.text = message;
                        }).catch(function (message) {
                            return _this4._mensagem = mensagem;
                        });
                    }
                }, {
                    key: 'ordena',
                    value: function ordena(column) {

                        if (this._ordemAtual == column) {
                            this._listaNegociacoes.inverterOrdem();
                        } else {
                            this._listaNegociacoes.ordenar(function (a, b) {
                                return a[column] - b[column];
                            });
                        }
                        this._ordemAtual = column;
                    }
                }, {
                    key: '_criarNegociacao',
                    value: function _criarNegociacao() {
                        //Date recebe ANO / MES / DIA
                        var data = new Date(DateHelper.textToDate(this._inputData.value));
                        return new Negociacao(data, parseInt(this._inputQuantidade.value), parseFloat(this._inputValor.value));
                    }
                }, {
                    key: '_limparFormulario',
                    value: function _limparFormulario() {
                        this._inputData.value = "";
                        this._inputQuantidade.value = "";
                        this._inputValor.value = "";

                        focus(this._inputData);
                    }
                }]);

                return NegociacaoController;
            }();

            negociacaoController = new NegociacaoController();
            function currentInstance() {
                return negociacaoController;
            }

            _export('currentInstance', currentInstance);
        }
    };
});
//# sourceMappingURL=NegociacaoController.js.map