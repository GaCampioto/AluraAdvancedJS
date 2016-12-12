class NegociacoesView extends View {

    template(model){
        return `
            <table class="table table-hover table-bordered">
                <thead>
                    <tr>
                        <th onclick="controller.ordena(event, 'data')">DATA</th>
                        <th onclick="controller.ordena(event, 'quantidade')">QUANTIDADE</th>
                        <th onclick="controller.ordena(event, 'valor')">VALOR</th>
                        <th onclick="controller.ordena(event, 'volume')">VOLUME</th>
                    </tr>
                </thead>
                
                <tbody>
                    ${model.negociacoes.map(negociacao => `
                        <tr>
                            <td>${DateHelper.dateToText(negociacao.data)}</td>
                            <td>${negociacao.quantidade}</td>
                            <td>${negociacao.valor}</td>
                            <td>${negociacao.volume}</td>
                        </tr>`).join("")
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3"></td>
                        <td>${model.volumeTotal}</td>                        
                    </tr>
                </tfoot>
            </table>
        `;
    }
}