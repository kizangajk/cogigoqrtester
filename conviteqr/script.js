function carregarPessoas() {
  fetch('dados.json')
    .then(response => response.json())
    .then(dados => {
      const lista = document.getElementById('pessoa-lista');
      dados.forEach(pessoa => {
        const item = document.createElement('li');
        item.textContent = pessoa.nome;

        const link = document.createElement('a');
        link.href = `detalhes.html?codigo=${pessoa.codigo}`;
        link.textContent = ' Ver Detalhes';

        const qrCodeCanvas = document.createElement('canvas');
        QRCode.toCanvas(qrCodeCanvas, `detalhes.html?codigo=${pessoa.codigo}`, function (error) {
          if (error) console.error(error);
        });

        item.appendChild(link);
        item.appendChild(qrCodeCanvas);
        lista.appendChild(item);
      });
    });
}
