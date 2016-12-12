class NegociacaoDao {

    constructor(connection) {

        this._connection = connection;
        this._store = 'negociacoes';
    }

    adiciona(negociacao) {

        return new Promise((resolve, reject) => {
            let request = this
                ._connection
                .transaction([this._store],"readwrite")
                .objectStore(this._store)
                .add(negociacao);

            request.onsuccess = e => resolve();
            request.onerror = e => reject('Não foi possível adicionar a negociação');
        });
    }

    listarTodos() {
        return new Promise((resolve, reject) => {
            let cursor = this
                ._connection
                .transaction([this._store],"readwrite")
                .objectStore(this._store)
                .openCursor();

            let negociacoes = [];

            cursor.onsuccess = e => {
                let atual = e.target.result;
                if (atual){
                    let dado = atual.value;
                    negociacoes.push(new Negociacao(dado._data, dado._quantidade, dado._valor));
                    atual.continue();
                } else {
                    resolve(negociacoes);
                }
            };

            cursor.onerror = e => reject('Não foi possível recuperar todas as negociações');
        });

    }

    apagarTodos() {
        return new Promise((resolve, reject) => {
            let cursor = this
                ._connection
                .transaction([this._store],"readwrite")
                .objectStore(this._store)
                .clear();

            cursor.onsuccess = e => resolve('Negociações apagadas com sucesso');

            cursor.onerror = e => reject('Não foi possível apagar as negociacões');
        });
    }
}