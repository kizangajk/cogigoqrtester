// Array para armazenar os convites
const invites = [];

// Referências aos elementos do DOM
const inviteForm = document.getElementById('inviteForm');
const invitesContainer = document.getElementById('invites');

// Função para adicionar convite
inviteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const guestName = document.getElementById('guestName').value;
    const eventName = document.getElementById('eventName').value;

    // Cria o convite e o armazena no array
    const invite = { id: invites.length + 1, guestName, eventName };
    invites.push(invite);

    // Atualiza a exibição dos convites
    renderInvites();
    inviteForm.reset();
});

// Função para exibir os convites
function renderInvites() {
    invitesContainer.innerHTML = ''; // Limpa o container
    invites.forEach((invite) => {
        // Cria os elementos HTML para o convite
        const inviteElement = document.createElement('div');
        inviteElement.className = 'invite';
        inviteElement.innerHTML = `
            <p><strong>Convidado:</strong> ${invite.guestName}</p>
            <p><strong>Evento:</strong> ${invite.eventName}</p>
            <div class="qr-code" id="qr-${invite.id}"></div>
        `;

        // Adiciona o convite ao container
        invitesContainer.appendChild(inviteElement);

        // Gera o QR Code
        const qrCodeElement = document.getElementById(`qr-${invite.id}`);
        new QRCode(qrCodeElement, {
            text: JSON.stringify(invite),
            width: 100,
            height: 100,
        });
    });
}

// Referências aos elementos do DOM para validação
const qrCodeInput = document.getElementById('qrCodeInput');
const validateBtn = document.getElementById('validateBtn');
const validationResult = document.getElementById('validationResult');

// Função para validar o convite
validateBtn.addEventListener('click', () => {
    const qrCodeData = qrCodeInput.value; // Obtém o conteúdo inserido
    let validationMessage = 'Convite inválido ou não encontrado!';

    try {
        // Tenta decodificar o QR Code
        const decodedData = JSON.parse(qrCodeData);

        // Verifica se o convite existe no array
        const invite = invites.find((i) => i.id === decodedData.id);

        if (invite) {
            // Exibe mensagem de sucesso e marca o convite como usado
            validationMessage = `Convite válido! Convidado: ${invite.guestName} para o evento: ${invite.eventName}`;
            invite.used = true; // Marca o convite como usado
        }
    } catch (error) {
        validationMessage = 'Erro ao processar o QR Code!';
    }

    // Exibe o resultado da validação
    validationResult.textContent = validationMessage;
    qrCodeInput.value = ''; // Limpa o campo de entrada
});

// Atualize a renderização para mostrar se o convite já foi usado
function renderInvites() {
    invitesContainer.innerHTML = '';
    invites.forEach((invite) => {
        const inviteElement = document.createElement('div');
        inviteElement.className = 'invite';
        inviteElement.innerHTML = `
            <p><strong>Convidado:</strong> ${invite.guestName}</p>
            <p><strong>Evento:</strong> ${invite.eventName}</p>
            <p><strong>Status:</strong> ${invite.used ? 'Usado' : 'Pendente'}</p>
            <div class="qr-code" id="qr-${invite.id}"></div>
        `;
        invitesContainer.appendChild(inviteElement);

        const qrCodeElement = document.getElementById(`qr-${invite.id}`);
        new QRCode(qrCodeElement, {
            text: JSON.stringify(invite),
            width: 100,
            height: 100,
        });
    });
}

// Referências aos elementos do DOM
const qrImageInput = document.getElementById('qrImageInput');
const scanResult = document.getElementById('scanResult');

// Evento para quando uma imagem for carregada
qrImageInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        // Lê o arquivo como imagem
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);

        // Aguarda a imagem carregar
        img.onload = async () => {
            // Usa a biblioteca qr-scanner para decodificar o QR code
            try {
                const result = await QRScanner.scanImage(img);
                scanResult.textContent = `Resultado: ${result}`;
                validateQRCode(result); // Função para validar o QR code
            } catch (error) {
                scanResult.textContent = 'Erro: Não foi possível ler o QR Code.';
            }
        };
    }
});

// Função de validação do QR code (reutiliza a lógica anterior)
function validateQRCode(qrCodeData) {
    let validationMessage = 'Convite inválido ou não encontrado!';
    try {
        const decodedData = JSON.parse(qrCodeData);
        const invite = invites.find((i) => i.id === decodedData.id);

        if (invite) {
            validationMessage = `Convite válido! Convidado: ${invite.guestName} para o evento: ${invite.eventName}`;
            invite.used = true; // Marca o convite como usado
        }
    } catch (error) {
        validationMessage = 'Erro ao processar o QR Code!';
    }
    alert(validationMessage); // Exibe o resultado da validação
}


qrImageInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        console.log('Imagem carregada:', file);

        // Cria um elemento de imagem para a biblioteca processar
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);

        // Aguarda a imagem carregar
        img.onload = async () => {
            console.log('Imagem carregada para processamento.');

            try {
                // Tenta decodificar o QR Code
                const result = await QRScanner.scanImage(img);
                console.log('QR Code lido:', result);
                scanResult.textContent = `Resultado: ${result}`;
                validateQRCode(result); // Valida o QR Code
            } catch (error) {
                console.error('Erro ao ler o QR Code:', error);
                scanResult.textContent = 'Erro: Não foi possível ler o QR Code.';
            }
        };

        // Lida com erros de carregamento da imagem
        img.onerror = () => {
            console.error('Erro ao carregar a imagem.');
            scanResult.textContent = 'Erro: Imagem inválida.';
        };
    } else {
        console.warn('Nenhuma imagem foi selecionada.');
    }
});


img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const qrCodeData = jsQR(imageData.data, canvas.width, canvas.height);

    if (qrCodeData) {
        console.log('QR Code encontrado:', qrCodeData.data);
        scanResult.textContent = `Resultado: ${qrCodeData.data}`;
        validateQRCode(qrCodeData.data);
    } else {
        console.error('Nenhum QR Code encontrado na imagem.');
        scanResult.textContent = 'Erro: Nenhum QR Code encontrado.';
    }
};


function renderInvites() {
    invitesContainer.innerHTML = ''; // Limpa os convites antes de renderizar novamente

    invites.forEach((invite) => {
        const inviteElement = document.createElement('div');
        inviteElement.className = 'invite';
        inviteElement.innerHTML = `
            <p><strong>Convidado:</strong> ${invite.guestName}</p>
            <p><strong>Evento:</strong> ${invite.eventName}</p>
            <p><strong>Status:</strong> ${invite.used ? 'Usado' : 'Pendente'}</p>
            <div class="qr-code" id="qr-${invite.id}"></div>
            <button class="copy-btn" data-content='${JSON.stringify(invite)}'>Copiar Conteúdo</button>
        `;

        invitesContainer.appendChild(inviteElement);

        // Gera o QR Code
        const qrCodeElement = document.getElementById(`qr-${invite.id}`);
        new QRCode(qrCodeElement, {
            text: JSON.stringify(invite),
            width: 100,
            height: 100,
        });
    });

    // Adiciona evento aos botões "Copiar Conteúdo"
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            const content = event.target.getAttribute('data-content');
            navigator.clipboard.writeText(content).then(() => {
                alert('Conteúdo copiado para a área de transferência!');
            }).catch((err) => {
                console.error('Erro ao copiar:', err);
                alert('Não foi possível copiar o conteúdo.');
            });
        });
    });
}
