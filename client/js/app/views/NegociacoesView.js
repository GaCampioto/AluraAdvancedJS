class NegociacoesView extends View {

    template(model){
        return `
            <table class="table table-hover table-bordered">
                <thead>
                    <tr>
                        <th>DATA</th>
                        <th>QUANTIDADE</th>
                        <th>VALOR</th>
                        <th>VOLUME</th>
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
                        <td>${model.negociacoes.reduce((total, element) => total + element.volume, 0)}</td>                        
                    </tr>
                </tfoot>
            </table>
        `;
    }
}