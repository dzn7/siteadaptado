// src/thank-you-script.js

// Definir products e complements globalmente para que o script da página de agradecimento
// possa acessá-los e reconstruir os nomes dos itens e complementos para a mensagem do WhatsApp.
const products = {
    tigela300: { name: 'Tigela de 300ml', price: 15, complements: 4 },
    tigela400: { name: 'Tigela de 400ml', price: 19, complements: 4 },
    tigela700: { name: 'Tigela de 700ml', price: 35, complements: 7 },
    copo250: { name: 'Copo de 250ml', price: 12, complements: 4 },
    copo300: { name: 'Copo de 300ml', price: 14, complements: 4 },
    copo400: { name: 'Copo de 400ml', price: 18, complements: 4 },
    barcaP: { name: 'Barca Pequena', price: 35, complements: 0 },
    barcaG: { name: 'Barca Grande', price: 65, complements: 0 }
};

const complements = {
    leite_po: { name: 'Leite em pó', price: 0, category: 'gratis' },
    castanha: { name: 'Castanha', price: 0, category: 'gratis' },
    amendoim: { name: 'Amendoim', price: 0, category: 'gratis' },
    granola: { name: 'Granola', price: 0, category: 'gratis' },
    sucrilhos: { name: 'Sucrilhos', price: 0, category: 'gratis' },
    tapioca: { name: 'Tapioca', price: 0, category: 'gratis' },
    pacoca: { name: 'Paçoca', price: 0, category: 'gratis' },
    cereja: { name: 'Cereja', price: 0, category: 'gratis' },
    choco_power: { name: 'Choco Power', price: 0, category: 'gratis' },
    flocos_arroz: { name: 'Flocos de arroz', price: 0, category: 'gratis' },
    marshmallow: { name: 'Marshmallow', price: 0, category: 'gratis' },
    jujuba: { name: 'Jujuba', price: 0, category: 'gratis' },
    mm: { name: 'M&M', price: 0, category: 'gratis' },
    bolacha: { name: 'Bolacha', price: 0, category: 'gratis' },
    bolacha_trit: { name: 'Bolacha (triturado)', price: 0, category: 'gratis' },
    bolacha_triunfo: { name: 'Bolacha (Triunfo)', price: 0, category: 'gratis' },
    chocolate_trit: { name: 'Chocolate (triturado)', price: 0, category: 'gratis' },
    granulado: { name: 'Granulado', price: 0, category: 'gratis' },
    banana: { name: 'Banana', price: 0, category: 'gratis' },
    uva: { name: 'Uva', price: 0, category: 'gratis' },
    cob_chocolate: { name: 'Chocolate', price: 0, category: 'cobertura' },
    cob_morango: { name: 'Morango', price: 0, category: 'cobertura' },
    cob_caramelo: { name: 'Caramelo', price: 0, category: 'cobertura' },
    cob_uva: { name: 'Uva', price: 0, category: 'cobertura' },
    cob_abacaxi: { name: 'Abacaxi', price: 0, category: 'cobertura' },
    leite_condensado: { name: 'Leite condensado', price: 0, category: 'cobertura' },
    cob_kiwi: { name: 'Kiwi', price: 0, category: 'cobertura' },
    nutella: { name: 'Nutella', price: 2, category: 'adicional' },
    doce_leite: { name: 'Doce de leite', price: 2, category: 'adicional' },
    kiwi: { name: 'Kiwi', price: 2, category: 'adicional' },
    creme_ninho: { name: 'Ninho', price: 2, category: 'creme' },
    creme_bacuri: { name: 'Bacuri', price: 2, category: 'creme' },
    creme_maracuja: { name: 'Maracujá', price: 2, category: 'creme' }
};

const YOUR_BACKEND_API_URL = "https://apihook.onrender.com/create-mercadopago-pix"; // <-- A URL da sua API de backend

document.addEventListener('DOMContentLoaded', async () => { // Torna a função async
    const qrCodeImageElement = document.getElementById('qr-code-image');
    const pixCopiaEColaInput = document.getElementById('pix-copia-e-cola');
    const confirmationMessageElement = document.getElementById('confirmation-message');
    const jaPagueiBtn = document.getElementById('ja-paguei-btn');

    jaPagueiBtn.addEventListener('click', jaPaguei); // Adiciona listener do botão

    // Inicia desabilitado até o QR code ser gerado ou dados carregados
    jaPagueiBtn.disabled = true;
    qrCodeImageElement.alt = "Gerando QR Code...";
    pixCopiaEColaInput.value = "Gerando código...";
    confirmationMessageElement.innerText = "Estamos gerando seu QR Code Pix. Aguarde um momento...";

    // Recupera os detalhes completos do pedido do localStorage
    const fullOrderDetailsString = localStorage.getItem('fullOrderDetails');

    if (fullOrderDetailsString) {
        try {
            const orderDetails = JSON.parse(fullOrderDetailsString);

            // Chama a API de backend para gerar o Pix
            const response = await fetch(YOUR_BACKEND_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderDetails) // Envia os detalhes do pedido
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erro do servidor: ${response.statusText}`);
            }

            const data = await response.json(); // Resposta com qrCodeImage e pixCopiaECola

            if (data.status === 'success' && data.qrCodeImage && data.pixCopiaECola) {
                qrCodeImageElement.src = data.qrCodeImage;
                qrCodeImageElement.alt = "QR Code Pix para Pagamento";
                pixCopiaEColaInput.value = data.pixCopiaECola;
                confirmationMessageElement.innerText = `Seu pedido de R$ ${orderDetails.total.toFixed(2).replace('.', ',')} foi gerado para pagamento Pix!`;
                jaPagueiBtn.disabled = false; // Habilita o botão "Já Paguei"
            } else {
                throw new Error('Resposta da API Pix incompleta. Tente novamente.');
            }

        } catch (error) {
            console.error('Erro ao gerar QR Code Pix na thank-you-pix.html:', error);
            confirmationMessageElement.innerText = `Ocorreu um erro ao gerar o pagamento Pix. Por favor, tente novamente ou escolha pagar pelo WhatsApp. Detalhes: ${error.message}`;
            qrCodeImageElement.alt = "Erro ao carregar QR Code";
            qrCodeImageElement.style.display = 'none';
            pixCopiaEColaInput.value = "Erro ao carregar código.";
            document.querySelector('.pix-code-area button').disabled = true;
            jaPagueiBtn.disabled = true;
        }
    } else {
        // Caso não haja dados do pedido (por exemplo, se o usuário acessou a página diretamente)
        confirmationMessageElement.innerText = "Nenhum detalhe de pedido encontrado. Por favor, volte e faça um novo pedido.";
        qrCodeImageElement.alt = "Nenhum QR Code para exibir.";
        qrCodeImageElement.style.display = 'none';
        pixCopiaEColaInput.value = "Nenhum código para exibir.";
        document.querySelector('.pix-code-area button').disabled = true;
        jaPagueiBtn.disabled = true;
    }
});

function copyPixCode() {
    const pixCodeInput = document.getElementById('pix-copia-e-cola');
    pixCodeInput.select();
    pixCodeInput.setSelectionRange(0, 99999); // Para dispositivos móveis
    document.execCommand('copy');
    alert('Código Pix copiado para a área de transferência!');
}

async function jaPaguei() {
    const fullOrderDetailsString = localStorage.getItem('fullOrderDetails');

    if (!fullOrderDetailsString) {
        alert("Não foi possível carregar os detalhes do pedido. Por favor, volte e faça um novo pedido.");
        return;
    }

    try {
        const orderDetails = JSON.parse(fullOrderDetailsString);

        // **Número do WhatsApp do Açaí em Casa**
        const whatsappNumber = "558699127297"; // <-- SUBSTITUA PELO SEU NÚMERO DE WHATSAPP COM DDI (55) E DDD (86)

        let whatsappMessage = `✅ *Olá, Açaí em Casa! Meu pedido já foi pago via Pix!* ✅\n\n`;
        whatsappMessage += `Meu nome é *${orderDetails.customerName || 'Cliente'}*.\n\n`;

        // Recria a lista de itens e complementos usando as constantes 'products' e 'complements'
        if (orderDetails.items && orderDetails.items.length > 0) {
            whatsappMessage += `*Detalhes do Pedido:*\n`;
            orderDetails.items.forEach((item, i) => {
                const productInfo = products[item.id]; // Usar item.id aqui se for o ID do produto
                const productName = productInfo ? productInfo.name : item.name;
                const productPrice = productInfo ? productInfo.price.toFixed(2).replace('.', ',') : item.price.toFixed(2).replace('.', ',');

                whatsappMessage += `- ${productName} (R$ ${productPrice})\n`;
                if (item.complements && item.complements.length > 0) {
                    const complementNames = item.complements.map(comp_id => {
                        const compInfo = complements[comp_id];
                        return compInfo ? compInfo.name : comp_id; // Pega o nome ou o ID se não encontrar
                    }).filter(Boolean).join(', ');
                    whatsappMessage += `  _Complementos:_ ${complementNames}\n`;
                }
            });
            whatsappMessage += `\n`;
        }

        whatsappMessage += `*Total do Pedido:* R$ ${orderDetails.total.toFixed(2).replace('.', ',')}\n`;
        whatsappMessage += `*Forma de Pagamento:* Pix (Pagamento Confirmado)\n`;

        if (orderDetails.deliveryOption && orderDetails.deliveryOption.type === 'Entrega') {
            whatsappMessage += `*Opção de Entrega:* Delivery\n`;
            whatsappMessage += `*Endereço:* ${orderDetails.deliveryOption.address}\n`;
        } else {
            whatsappMessage += `*Opção de Entrega:* Retirada no Local\n`;
        }

        whatsappMessage += `\n_Aguardando a confirmação e envio!_`;

        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappLink, '_blank');

        alert("Mensagem de confirmação de pagamento enviada! Aguarde nosso contato para a entrega.");

        // Limpar o localStorage após o cliente avisar do pagamento
        localStorage.removeItem('cart');
        localStorage.removeItem('pixQrCodeData'); // Embora não precise mais, bom para consistência
        localStorage.removeItem('orderConfirmationMessage');
        localStorage.removeItem('fullOrderDetails');

        // Redireciona para o início após enviar a mensagem de confirmação
        window.location.href = 'https://acaiemcasasite.onrender.com/';

    } catch (error) {
        console.error("Erro ao gerar mensagem de 'Já Paguei':", error);
        alert("Ocorreu um erro ao enviar a mensagem. Por favor, entre em contato com o Açaí em Casa pelo WhatsApp manualmente.");
    }
}
