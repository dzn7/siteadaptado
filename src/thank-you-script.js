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


document.addEventListener('DOMContentLoaded', () => {
    const qrCodeImageElement = document.getElementById('qr-code-image');
    const pixCopiaEColaInput = document.getElementById('pix-copia-e-cola');
    const confirmationMessageElement = document.getElementById('confirmation-message');
    const jaPagueiBtn = document.getElementById('ja-paguei-btn');

    // Recupera os dados do localStorage
    const pixQrCodeDataString = localStorage.getItem('pixQrCodeData');
    const orderConfirmationMessage = localStorage.getItem('orderConfirmationMessage');
    const fullOrderDetailsString = localStorage.getItem('fullOrderDetails'); // Dados completos do pedido

    // Exibe a mensagem de confirmação
    if (orderConfirmationMessage) {
        confirmationMessageElement.innerText = orderConfirmationMessage;
    }

    // Exibe o QR Code e o código Copia e Cola
    if (pixQrCodeDataString) {
        try {
            const pixData = JSON.parse(pixQrCodeDataString);

            if (pixData.image) {
                qrCodeImageElement.src = pixData.image;
                qrCodeImageElement.alt = "QR Code Pix para Pagamento";
            } else {
                qrCodeImageElement.alt = "QR Code não disponível. Use o código Pix Copia e Cola.";
                qrCodeImageElement.style.display = 'none'; // Esconde a imagem se não tiver URL
            }

            // CORREÇÃO: Usar pixData.copiaECola corretamente
            if (pixData.copiaECola) {
                pixCopiaEColaInput.value = pixData.copiaECola;
            } else {
                pixCopiaEColaInput.value = "Código Pix não disponível.";
                document.querySelector('.pix-code-area button').disabled = true; // Desabilita o botão de copiar
            }

            // Ativa o botão "Já Paguei" se houver dados de pedido
            if (fullOrderDetailsString) {
                jaPagueiBtn.disabled = false;
            } else {
                jaPagueiBtn.disabled = true;
            }

        } catch (e) {
            console.error("Erro ao parsear dados do QR Code do localStorage:", e);
            confirmationMessageElement.innerText = "Ocorreu um erro ao carregar os detalhes do pagamento. Por favor, entre em contato.";
            qrCodeImageElement.alt = "Erro ao carregar QR Code";
            qrCodeImageElement.style.display = 'none';
            pixCopiaEColaInput.value = "Erro ao carregar código.";
            document.querySelector('.pix-code-area button').disabled = true;
            jaPagueiBtn.disabled = true; // Desabilita o botão em caso de erro
        }
    } else {
        // Caso não haja dados do QR Code (por exemplo, se o usuário acessou a página diretamente)
        confirmationMessageElement.innerText = "Nenhum detalhe de pedido Pix encontrado. Por favor, faça um novo pedido.";
        qrCodeImageElement.alt = "Nenhum QR Code para exibir.";
        qrCodeImageElement.style.display = 'none';
        pixCopiaEColaInput.value = "Nenhum código para exibir.";
        document.querySelector('.pix-code-area button').disabled = true;
        jaPagueiBtn.disabled = true; // Desabilita o botão se não houver dados
    }

    // Adiciona o evento de clique ao botão "Já Paguei"
    jaPagueiBtn.addEventListener('click', jaPaguei);
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
        localStorage.removeItem('pixQrCodeData');
        localStorage.removeItem('orderConfirmationMessage');
        localStorage.removeItem('fullOrderDetails');

        // Redireciona para o início após enviar a mensagem de confirmação
        window.location.href = 'https://acaiemcasasite.onrender.com/';

    } catch (error) {
        console.error("Erro ao gerar mensagem de 'Já Paguei':", error);
        alert("Ocorreu um erro ao enviar a mensagem. Por favor, entre em contato com o Açaí em Casa pelo WhatsApp manualmente.");
    }
}