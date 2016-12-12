var ConnectionFactory = (function() {
    const stores = ['negociacoes'];
    const version = 2;
    const dbName = 'negociacoesDB';

    let connection = null;

    let close = null;

    return class ConnectionFactory{

        constructor(){
            throw new Error('Você não pode criar instâncias de ConnectionFactory, utilize o método getConnection');
        }

        static getConnection (){
            return new Promise((resolve, reject) => {
                let openRequest = window.indexedDB.open(dbName, version);

                openRequest.onupgradeneeded = e => {
                    ConnectionFactory._createStores(connection);
                };

                openRequest.onsuccess = e => {
                    if (!connection){
                        connection = e.target.result;
                        close = connection.close.bind(connection);
                        connection.close = function() {
                            console.log('Você não deve utilizar o método close do indexedDB, utilize ConnectionFactory.closeConnection()');
                        }
                    }
                    resolve(connection);
                };

                openRequest.onerror = e => {
                    console.log(e.target.error);
                    reject(e.target.error.name);
                };
            });
        }

        static _createStores (connection) {
            store.forEach(store => {
                if(connection.objectStoreNames.contains(store)){
                    connection.deleteObjectStore(store);
                }
                connection.createObjectStore(store, {autoIncrement : true});    
            });
        }

        static closeConnection(){
            close();
            connection = null;
            close = null;
        }
    }

})();