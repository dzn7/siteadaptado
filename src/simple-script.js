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

let selectedProduct = null;
let selectedComplements = new Set();
let cart = JSON.parse(localStorage.getItem('cart')) || []; 
let complementsScrollListener = null;

// --- FUNÇÕES GERAIS PARA MODAIS ---
function toggleModal(modalId, show) {
    const modalOverlay = document.getElementById(modalId);
    if (modalOverlay) {
        if (show) {
            modalOverlay.classList.add('is-visible');
            document.body.classList.add('modal-open');
            if (modalId === 'complements-modal-overlay') {
                const searchInput = document.getElementById('complement-search-input');
                if (searchInput) {
                    searchInput.value = '';
                    filterComplements();
                }
            }
        } else {
            modalOverlay.classList.remove('is-visible');
            document.body.classList.remove('modal-open');
        }
    }
}

// --- FUNÇÕES DO MODAL DO CARRINHO ---
function openCartModal() {
    renderModalCart(); 
    toggleModal('cart-modal-overlay', true);
}

function closeCartModal() {
    toggleModal('cart-modal-overlay', false);
}

// --- FUNÇÕES DO MODAL DE COMPLEMENTOS ---
function checkComplementsScrollPosition() {
    const scrollArea = document.querySelector('.complements-scroll-area');
    const actionButtons = document.querySelector('.complement-modal-actions');
    if (!scrollArea || !actionButtons) return;

    if (scrollArea.scrollHeight <= scrollArea.clientHeight) {
        actionButtons.classList.add('is-scrolled-to-bottom');
        return;
    }
    const scrolledToBottom = (scrollArea.scrollTop + scrollArea.clientHeight >= scrollArea.scrollHeight - 5);
    if (scrolledToBottom) {
        actionButtons.classList.add('is-scrolled-to-bottom');
    } else {
        actionButtons.classList.remove('is-scrolled-to-bottom');
    }
}

function setupComplementsModalScrollListener() {
    const scrollArea = document.querySelector('.complements-scroll-area');
    if (scrollArea) {
        if (complementsScrollListener) {
            scrollArea.removeEventListener('scroll', complementsScrollListener);
        }
        complementsScrollListener = checkComplementsScrollPosition;
        scrollArea.addEventListener('scroll', complementsScrollListener);
        checkComplementsScrollPosition();
    }
}

function cleanupComplementsModalScrollListener() {
    const scrollArea = document.querySelector('.complements-scroll-area');
    const actionButtons = document.querySelector('.complement-modal-actions');
    if (scrollArea && complementsScrollListener) {
        scrollArea.removeEventListener('scroll', complementsScrollListener);
        complementsScrollListener = null;
    }
    if (actionButtons) {
        actionButtons.classList.remove('is-scrolled-to-bottom');
    }
}

function openComplementsModal() {
    toggleModal('complements-modal-overlay', true);
    const product = products[selectedProduct];
    if (product && product.complements > 0) {
        document.getElementById('complement-limit-info-modal').innerText = `Escolha até ${product.complements} complementos grátis`;
    } else {
        document.getElementById('complement-limit-info-modal').innerText = `Sem complementos grátis para este item.`;
    }
    setTimeout(setupComplementsModalScrollListener, 100);
}

function closeComplementsModal() {
    toggleModal('complements-modal-overlay', false);
    cleanupComplementsModalScrollListener();
}

// --- LÓGICA DE SELEÇÃO E ADIÇÃO ---
function selectProduct(productId) {
    const product = products[productId];
    if (!product) {
        console.error("Produto não encontrado:", productId);
        return;
    }
    if (product.complements > 0) {
        selectedProduct = productId;
        selectedComplements.clear();
        document.querySelectorAll('input[data-complement-id]').forEach(input => input.checked = false);
        openComplementsModal();
    } else {
        cart.push({ productId: productId, complements: [] });
        saveCart(); // Salva o carrinho
        updateTotal();
        updateCartCount();
        validateOrder(false); // Atualiza o estado do botão "Enviar Pedido" (silencioso)
        openCartModal(); // Abre o modal do carrinho após adicionar o item
    }
}

function toggleComplement(id, checked) {
    if (!selectedProduct) return;
    const product = products[selectedProduct];
    const comp = complements[id];
    if (checked) {
        if (comp.category === 'gratis') {
            const current = Array.from(selectedComplements).filter(cid => complements[cid].category === 'gratis');
            if (current.length >= product.complements) {
                alert(`Só pode escolher até ${product.complements} complementos grátis.`);
                document.getElementById(id).checked = false;
                return;
            }
        }
        if (comp.category === 'cobertura') {
            const has = Array.from(selectedComplements).some(cid => complements[cid].category === 'cobertura');
            if (has) {
                alert('Você só pode escolher uma cobertura.');
                document.getElementById(id).checked = false;
                return;
            }
        }
        selectedComplements.add(id);
    } else {
        selectedComplements.delete(id);
    }
    updateTotal();
}

function confirmComplementsAndAddToCart() {
    if (!selectedProduct) {
        alert('Nenhum produto selecionado para adicionar!');
        return;
    }
    cart.push({ productId: selectedProduct, complements: Array.from(selectedComplements) });
    saveCart(); // Salva o carrinho
    selectedProduct = null;
    selectedComplements.clear();
    document.querySelectorAll('input[data-complement-id]').forEach(input => input.checked = false);
    updateTotal();
    updateCartCount();
    validateOrder(false); // Atualiza o estado do botão "Enviar Pedido" (silencioso)
    closeComplementsModal();
    openCartModal(); // Abre o modal do carrinho após adicionar o item
}

function cancelComplementsSelection() {
    selectedProduct = null;
    selectedComplements.clear();
    document.querySelectorAll('input[data-complement-id]').forEach(input => input.checked = false);
    document.querySelectorAll('.select-btn.selected').forEach(btn => btn.classList.remove('selected'));
    closeComplementsModal();
    updateTotal();
}

// --- PERSISTÊNCIA DO CARRINHO ---
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// --- FUNÇÕES DE RENDERIZAÇÃO E ATUALIZAÇÃO DE TOTAIS ---
function updateCartCount() {
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        cartCountEl.innerText = cart.length;
        cartCountEl.style.display = cart.length > 0 ? 'flex' : 'none'; 
    }
}

function updateModalTotal() {
    const modalTotalEl = document.getElementById('modal-total-price');
    if (!modalTotalEl) return;
    let total = 0;
    cart.forEach(item => {
        const product = products[item.productId];
        if (product) { 
            total += product.price;
            item.complements.forEach(id => {
                if (complements[id]) {
                    total += complements[id].price;
                }
            });
        } else {
            console.warn("Produto não encontrado no carrinho:", item.productId);
        }
    });
    modalTotalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function renderCart() {
    validateOrder(false); 
    updateCartCount();
}

function renderModalCart() {
    const list = document.getElementById('cart-modal-list');
    if (!list) return;
    list.innerHTML = ""; 

    if (cart.length === 0) {
        const li = document.createElement('li');
        li.textContent = "Seu carrinho está vazio.";
        li.style.textAlign = "center";
        li.style.fontStyle = "italic";
        li.style.color = "#888";
        li.style.borderBottom = "none";
        list.appendChild(li);
    } else {
        cart.forEach((item, index) => {
            const product = products[item.productId];
            if (!product) { 
                console.error("Produto no carrinho não encontrado na lista de produtos:", item.productId);
                return; 
            }
            const complementNames = item.complements.map(id => complements[id]?.name).filter(Boolean).join(", ");
            const li = document.createElement('li');
            li.innerHTML = `
                <div style="display: flex; justify-content: space-between; width: 100%; align-items: center; flex-wrap: wrap;">
                    <span>${product.name}</span>
                    <span style="font-weight: bold;">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
                    <button class="remove-item-btn" data-index="${index}" onclick="removeItemFromCart(${index})">X</button>
                </div>
                ${complementNames ? `<small style="flex-basis: 100%; font-size: 0.85em; color: #555;">+ Complementos: ${complementNames}</small>` : ''}
            `;
            list.appendChild(li);
        });
    }
    updateModalTotal();
}

// --- FUNÇÃO PARA REMOVER ITEM DO CARRINHO ---
function removeItemFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateTotal();
    updateCartCount();
    renderModalCart();
    validateOrder(false);
}


function updateTotal() {
    let currentTotal = 0;
    cart.forEach(item => {
        const product = products[item.productId];
        if (product) {
            currentTotal += product.price;
            item.complements.forEach(id => {
                if (complements[id]) {
                    currentTotal += complements[id].price;
                }
            });
        }
    });
    if (selectedProduct) { 
        const product = products[selectedProduct];
        if (product) {
            currentTotal += product.price;
            selectedComplements.forEach(id => {
                if (complements[id]) {
                    currentTotal += complements[id].price;
                }
            });
        }
    }

    if (document.getElementById('delivery-checkbox').checked) {
        currentTotal += 2;
    }
    
    document.getElementById('total-price').textContent = `R$ ${currentTotal.toFixed(2).replace('.', ',')}`;
}

// --- FUNÇÕES DE ENTREGA E PAGAMENTO ---
function handleDeliveryChange(el) {
    const pickupCheckbox = document.getElementById('pickup-checkbox');
    let addressSection = document.getElementById('delivery-address-section');
    if (el.checked) {
        pickupCheckbox.checked = false;
        if (!addressSection) {
            const deliverySection = document.querySelector('.delivery-section');
            const newAddressSection = document.createElement('div');
            newAddressSection.id = 'delivery-address-section';
            newAddressSection.innerHTML = `
                <h3>Local de Entrega</h3>
                <input type="text" id="delivery-address" placeholder="Rua, número, bairro, complemento..." />
            `;
            const mainPaymentChoiceSection = document.getElementById('main-payment-choice-section');
            deliverySection.parentNode.insertBefore(newAddressSection, mainPaymentChoiceSection);
        } else {
            addressSection.style.display = 'block';
        }
    } else {
        if (addressSection) {
            addressSection.style.display = 'none';
        }
    }
    updateTotal();
    validateOrder(false);
}

function handlePickupChange(el) {
    if (el.checked) {
        document.getElementById('delivery-checkbox').checked = false;
        const addressSection = document.getElementById('delivery-address-section');
        if (addressSection) {
            addressSection.style.display = 'none';
        }
    }
    updateTotal();
    validateOrder(false);
}

function selectPaymentMethod(method) {
    document.querySelectorAll('.payment-card').forEach(el => {
        el.classList.remove('selected');
    });

    const clickedCard = document.querySelector(`.payment-card[data-method="${method}"]`);
    if (clickedCard) {
        clickedCard.classList.add('selected');
    }

    document.querySelectorAll('input[name="payment"]').forEach(input => {
        input.checked = input.value === method;
    });

    document.getElementById("troco-section").style.display = method === "whatsapp-especie" ? "block" : "none";
    updateTotal();
    validateOrder(false);
}

// --- FUNÇÕES DE VALIDAÇÃO E DESTAQUE ---
function highlightField(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        if (element.type === 'checkbox' || element.type === 'radio') {
            const parentLabel = document.querySelector(`label[for="${elementId}"]`);
            const parentDiv = element.closest('.payment-options') || element.closest('.delivery-options-wrapper') || element.closest('.payment-mode-group') || element.closest('#main-payment-choice-section');
            
            if (parentLabel) {
                 parentLabel.classList.add('highlight-error');
                 setTimeout(() => parentLabel.classList.remove('highlight-error'), 2500);
                 parentLabel.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (parentDiv) {
                 parentDiv.classList.add('highlight-error');
                 setTimeout(() => parentDiv.classList.remove('highlight-error'), 2500);
                 parentDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
            element.classList.add('highlight-error');
            setTimeout(() => element.classList.remove('highlight-error'), 2500);
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        closeCartModal();
    }
}


function validateOrder(shouldHighlight = false) { 
    const confirmBtn = document.getElementById('confirm-all-btn');
    if (!confirmBtn) return false;

    if (cart.length === 0) {
        confirmBtn.disabled = true;
        if (shouldHighlight) { 
            alert("Seu carrinho está vazio! Por favor, adicione itens ao pedido.");
        }
        return false;
    }

    if (!document.getElementById('customer-name').value.trim()) {
        confirmBtn.disabled = true;
        if (shouldHighlight) { 
            alert("Por favor, digite seu nome completo para o pedido.");
            highlightField('customer-name');
        }
        return false;
    }

    const isDelivery = document.getElementById('delivery-checkbox').checked;
    const isPickup = document.getElementById('pickup-checkbox').checked;
    if (!isDelivery && !isPickup) {
        confirmBtn.disabled = true;
        if (shouldHighlight) { 
            alert("Por favor, selecione uma opção de entrega ou retirada para o seu pedido.");
            highlightField('delivery-checkbox');
        }
        return false;
    }

    if (isDelivery && !document.getElementById('delivery-address')?.value.trim()) {
        confirmBtn.disabled = true;
        if (shouldHighlight) { 
            alert("Por favor, preencha o endereço de entrega para que possamos levar seu pedido.");
            highlightField('delivery-address');
        }
        return false;
    }

    const paymentMethod = document.querySelector('input[name="payment"]:checked');
    if (!paymentMethod) {
        confirmBtn.disabled = true;
        if (shouldHighlight) { 
            alert("Por favor, selecione uma forma de pagamento.");
            highlightField('main-payment-choice-section');
        }
        return false;
    }

    if (paymentMethod.value === 'whatsapp-especie') {
        const trocoInput = document.getElementById('troco-value');
        const trocoValue = parseFloat(trocoInput.value.replace(',', '.'));
        
        if (trocoInput.offsetParent !== null && (isNaN(trocoValue) || trocoValue <= 0)) {
            confirmBtn.disabled = true;
            if (shouldHighlight) { 
                alert("Para pagamento em dinheiro, por favor, informe um valor válido e maior que zero para o troco.");
                highlightField('troco-value');
            }
            return false;
        }
    }
    
    confirmBtn.disabled = false;
    return true;
}

// --- FUNÇÕES DO MODAL PIX ---
function openPixModal(qrCodeBase64, pixCodeText) {
    const qrCodeImg = document.getElementById('pix-qr-code-img');
    const pixCodeSpan = document.getElementById('pix-copy-code-text');

    if (qrCodeImg && pixCodeSpan) {
        qrCodeImg.src = `data:image/png;base64,${qrCodeBase64}`;
        pixCodeSpan.textContent = pixCodeText;
        toggleModal('pix-modal-overlay', true);
    } else {
        alert("Erro ao exibir QR Code Pix. Tente novamente.");
    }
}

function closePixModal() {
    toggleModal('pix-modal-overlay', false);
    // Opcional: Limpar a imagem e o texto do QR Code ao fechar, para não exibir Pix antigo
    const qrCodeImg = document.getElementById('pix-qr-code-img');
    const pixCodeSpan = document.getElementById('pix-copy-code-text');
    if (qrCodeImg) qrCodeImg.src = '';
    if (pixCodeSpan) pixCodeSpan.textContent = '';
    
    // Você NÃO LIMPA O CARRINHO AQUI. 
    // O carrinho é limpo APENAS quando o webhook do Mercado Pago confirmar o pagamento para o seu backend.
    // O cliente pode fechar o modal, mas o pedido ainda está pendente de pagamento.
}

function copyPixCode() {
    const pixCodeText = document.getElementById('pix-copy-code-text').textContent;
    navigator.clipboard.writeText(pixCodeText)
        .then(() => {
            alert('Código Pix copiado para a área de transferência!');
        })
        .catch(err => {
            console.error('Erro ao copiar código Pix:', err);
            alert('Não foi possível copiar o código Pix automaticamente. Por favor, selecione e copie manualmente.');
        });
}


// --- FUNÇÃO FINAL DE CONFIRMAÇÃO ---
function confirmAllOrders() {
    if (!validateOrder(true)) { 
        return; 
    }

    const nome = document.getElementById('customer-name').value.trim();
    let msg = `Olá! Pedido de *${nome}*:\n\n`;
    let totalCalculadoParaMensagem = 0;
    
    cart.forEach((item, i) => {
        const prod = products[item.productId];
        if (!prod) { 
            console.error("Produto inválido no carrinho detectado ao enviar:", item.productId);
            return; 
        }
        msg += `🍧 *Açaí ${i + 1}:* ${prod.name} - R$ ${prod.price.toFixed(2).replace('.', ',')}\n`;
        totalCalculadoParaMensagem += prod.price;
        const cats = { gratis: [], cobertura: [], adicional: [], creme: [] };
        item.complements.forEach(id => {
            const c = complements[id];
            if (c) {
                cats[c.category]?.push(c.name);
                totalCalculadoParaMensagem += c.price;
            }
        });
        if (cats.gratis.length) msg += `*Complementos:* ${cats.gratis.join(", ")}\n`;
        if (cats.cobertura.length) msg += `*Cobertura:* ${cats.cobertura.join(", ")}\n`;
        if (cats.adicional.length) msg += `*Adicionais Pagos:* ${cats.adicional.join(", ")}\n`;
        if (cats.creme.length) msg += `*Cremes:* ${cats.cremes.join(", ")}\n`; // Cuidado aqui, era cats.creme
        msg += "\n";
    });

    const isDelivery = document.getElementById('delivery-checkbox').checked;
    if (isDelivery) {
        const deliveryAddress = document.getElementById('delivery-address').value.trim();
        msg += `🏍️ *Taxa de entrega:* R$ 2,00\n`;
        msg += `📍 *Local de entrega:* ${deliveryAddress}\n`;
        totalCalculadoParaMensagem += 2;
    } else {
        msg += `🚶 *Retirada no local*\n`;
    }

    msg += "\n";

    const paymentMethodValue = document.querySelector('input[name="payment"]:checked').value;

    if (paymentMethodValue.startsWith('whatsapp-')) {
        const methodType = paymentMethodValue.split('-')[1];

        if (methodType === 'pix') {
            msg += `💰 *Forma de Pagamento:* Pix (Combinar via WhatsApp)\n`;
        } else if (methodType === 'especie') {
            msg += `💵 *Forma de Pagamento:* Dinheiro (Combinar via WhatsApp)\n`;
            const trocoInput = document.getElementById('troco-value');
            const trocoParaValor = parseFloat(trocoInput.value.replace(',', '.'));
            
            if (trocoInput.offsetParent !== null && (isNaN(trocoParaValor) || trocoParaValor < totalCalculadoParaMensagem)) {
                alert(`Para pagamento em dinheiro, o valor para troco (R$ ${trocoParaValor.toFixed(2).replace('.', ',')}) não pode ser menor que o total do pedido (R$ ${totalCalculadoParaMensagem.toFixed(2).replace('.', ',')}). Por favor, ajuste o valor.`);
                highlightField('troco-value');
                return;
            }

            if (trocoInput.value) { 
                const trocoDevolvido = trocoParaValor - totalCalculadoParaMensagem;
                msg += `*Levar troco para:* R$ ${trocoParaValor.toFixed(2).replace('.', ',')}\n`;
                if (trocoDevolvido >= 0) {
                    msg += `*Devolver de troco:* R$ ${trocoDevolvido.toFixed(2).replace('.', ',')}\n`;
                }
            }
        } else if (methodType === 'cartao') {
            msg += `💳 *Forma de Pagamento:* Cartão (+R$ 1,00) (Combinar via WhatsApp)\n`;
            totalCalculadoParaMensagem += 1;
        }
        
        msg += `\n🧾 *Total Geral:* R$ ${totalCalculadoParaMensagem.toFixed(2).replace('.', ',')}`;
        msg += `\n\n_Finalizaremos o pagamento e a entrega pelo WhatsApp._`;

        const num = "558699127297"; 
        const whatsappUrl = `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
        window.open(whatsappUrl, "_blank");
        alert('Pedido enviado para o WhatsApp! Aguarde nossa resposta para confirmar e combinar o pagamento.');
        
        clearCart(); 
        closeCartModal();

    } else if (paymentMethodValue === 'online-pix') {
        const backendUrl = 'https://SEU_DOMINIO_BACKEND_RENDER.onrender.com'; // **ATENÇÃO: SUBSTITUA PELA SUA URL REAL DO BACKEND NO RENDER**
        
        // Dados do pedido para enviar ao backend
        const orderData = {
            customerName: nome,
            // É importante passar os itens do carrinho e outros detalhes que o backend precisa
            cartItems: cart.map(item => ({
                productId: item.productId,
                productName: products[item.productId]?.name || 'Item Desconhecido', // Fallback para nome
                productPrice: products[item.productId]?.price || 0,
                // Inclua complementos com nomes e preços para a descrição do item no MP
                complements: item.complements.map(comp_id => ({
                    id: comp_id,
                    name: complements[comp_id]?.name || 'Comp. Desconhecido',
                    price: complements[comp_id]?.price || 0
                }))
            })),
            delivery: isDelivery ? { address: document.getElementById('delivery-address').value.trim(), cost: 2 } : { type: 'pickup' },
            totalAmount: totalCalculadoParaMensagem,
            externalReference: "PEDIDO_" + Date.now() // Um ID único para seu pedido
        };

        alert(`Preparando o Pix para o valor de R$ ${totalCalculadoParaMensagem.toFixed(2).replace('.', ',')}.`);
        
        fetch(`${backendUrl}/create-mercadopago-pix`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        })
        .then(response => {
            if (!response.ok) {
                // Lidar com erros de HTTP (ex: 400, 500)
                return response.json().then(err => Promise.reject(err));
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success' && data.qr_code_base64 && data.qr_code) {
                // Exibir o QR Code e o código Copia e Cola em um modal NO SEU PRÓPRIO SITE
                openPixModal(data.qr_code_base64, data.qr_code);
                // Não limpar o carrinho aqui. A limpeza deve ser feita pelo webhook.
            } else {
                alert('Erro ao gerar Pix do Mercado Pago: ' + (data.message || 'Erro desconhecido. Por favor, tente novamente ou escolha pagar pelo WhatsApp.'));
            }
        })
        .catch(error => {
            console.error('Erro na requisição para o backend:', error);
            alert('Ocorreu um erro ao processar seu pagamento online. Tente novamente ou escolha pagar pelo WhatsApp. Detalhes: ' + (error.message || JSON.stringify(error)));
        });
    }
}

// --- FUNÇÃO LIMPAR TUDO ---
function clearCart() {
    cart.length = 0;
    saveCart();
    
    const addressInput = document.getElementById('delivery-address');
    if (addressInput) addressInput.value = '';
    document.getElementById('delivery-checkbox').checked = false;
    document.getElementById('pickup-checkbox').checked = false;
    const addressSection = document.getElementById('delivery-address-section');
    if (addressSection) addressSection.style.display = 'none';
    
    document.querySelectorAll('input[name="payment"]').forEach(input => input.checked = false);
    document.querySelectorAll('.payment-card').forEach(card => card.classList.remove('selected'));
    document.getElementById("troco-section").style.display = 'none';
    document.getElementById("troco-value").value = '';
    document.getElementById('customer-name').value = '';
    
    const confirmBtn = document.getElementById("confirm-all-btn");
    if (confirmBtn) {
        confirmBtn.disabled = true;
    }

    updateTotal();
    updateCartCount();
    renderModalCart();
    closeCartModal();
    closePixModal(); // Fecha também o modal do Pix, caso estivesse aberto
}

// --- NOVO: FUNÇÃO DE PESQUISA DE COMPLEMENTOS ---
function filterComplements() {
    const input = document.getElementById('complement-search-input');
    if (!input) return;
    const filter = input.value.toLowerCase();
    const complementCategories = document.querySelectorAll('.complement-category');
    
    complementCategories.forEach(category => {
        const complementItems = category.querySelectorAll('.complement-item');
        let categoryHasVisibleItems = false; 

        complementItems.forEach(item => {
            const label = item.querySelector('label');
            const text = label.textContent || label.innerText;

            if (text.toLowerCase().includes(filter)) {
                item.style.display = "";
                categoryHasVisibleItems = true;
            } else {
                item.style.display = "none";
            }
        });

        const categoryTitle = category.querySelector('h4');
        if (categoryTitle) {
            if (categoryHasVisibleItems || filter === '') {
                categoryTitle.style.display = "";
            } else {
                categoryTitle.style.display = "none";
            }
        }
    });
}

// --- INICIALIZAÇÃO AO CARREGAR A PÁGINA ---
document.addEventListener('DOMContentLoaded', () => {
    cart = JSON.parse(localStorage.getItem('cart')) || []; 
    
    updateTotal();
    updateCartCount();
    validateOrder(false); 
    closeCartModal();
    closeComplementsModal();
    closePixModal(); // Garante que o modal do Pix esteja fechado no carregamento

    const cartModalOverlay = document.getElementById('cart-modal-overlay');
    if (cartModalOverlay) {
        cartModalOverlay.addEventListener('click', function (event) {
            if (event.target === cartModalOverlay) { 
                closeCartModal();
            }
        });
    }
    const complementsModalOverlay = document.getElementById('complements-modal-overlay');
    if (complementsModalOverlay) {
        complementsModalOverlay.addEventListener('click', function (event) {
            if (event.target === complementsModalOverlay) { 
                cancelComplementsSelection();
            }
        });
    }
    // Adiciona listener para o modal Pix também
    const pixModalOverlay = document.getElementById('pix-modal-overlay');
    if (pixModalOverlay) {
        pixModalOverlay.addEventListener('click', function (event) {
            if (event.target === pixModalOverlay) {
                closePixModal();
            }
        });
    }

    document.getElementById('customer-name')?.addEventListener('input', () => validateOrder(false));
    document.getElementById('troco-value')?.addEventListener('input', () => validateOrder(false));
    document.getElementById('delivery-checkbox')?.addEventListener('change', () => validateOrder(false));
    document.getElementById('pickup-checkbox')?.addEventListener('change', () => validateOrder(false));

    document.querySelectorAll('.payment-card').forEach(card => {
        card.addEventListener('click', () => {
            validateOrder(false);
        });
    });
});
