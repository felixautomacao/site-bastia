window.addEventListener("scroll", function() {
    const header = document.getElementById("main-header");
    if (window.scrollY > 100) {
        header.classList.add("shrink");
    } else {
        header.classList.remove("shrink");
    }
});

function toggleChat() {
    const chatContainer = document.getElementById("chat-container");
    chatContainer.classList.toggle("hidden");
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}



const toggleBtn = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const header = document.getElementById("main-header");

toggleBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
});

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        header.classList.add("shrink");
    } else {
        header.classList.remove("shrink");
    }
});

function sendMessage() {
    const userInput = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");

    if (userInput.value.trim() === "") return;

    chatBox.innerHTML += `<div class='p-2 bg-gray-200 rounded-md my-1'>${userInput.value}</div>`;
    userInput.value = ""; // Limpa o campo de entrada imediatamente

    const apiKey = "SUA_CHAVE_DA_OPENAI"; // 🔹 Substitua pela sua chave
    fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userInput.value }]
            })
        })
        .then(response => response.json())
        .then(data => {
            const botMessage = data.choices[0].message.content;
            chatBox.innerHTML += `<div class='p-2 bg-blue-100 rounded-md my-1'>🤖 ${botMessage}</div>`;
            chatBox.scrollTop = chatBox.scrollHeight;
        })
        .catch(error => console.error("Erro ao se comunicar com a API:", error));
}

function calcularSistema() {
    const nomeCliente = document.getElementById("nomeCliente").value;
    const regiaoCliente = document.getElementById("regiaoCliente").value;
    const telefoneCliente = document.getElementById("telefoneCliente").value;

    const consumoBruto = parseFloat(document.getElementById("consumo").value);
    const tipoRede = document.getElementById("rede").value;
    const resultado = document.getElementById("resultado");

    if (isNaN(consumoBruto) || consumoBruto <= 0) {
        resultado.innerHTML = "<p class='text-red-600 font-semibold'>⚠️ Informe um valor válido de consumo mensal.</p>";
        return;
    }

    // Regras comerciais
    let taxaDesconto = 0;
    if (tipoRede === "mono") taxaDesconto = 30;
    if (tipoRede === "bi") taxaDesconto = 50;
    if (tipoRede === "tri") taxaDesconto = 100;

    const consumoLiquido = Math.max(consumoBruto - taxaDesconto, 0);
    const geracaoPorPlaca = 63;
    const precoKWh = 1.0;

    let placas = Math.ceil(consumoLiquido / geracaoPorPlaca);
    if (placas % 2 !== 0) placas++;

    if (placas > 20) {
        resultado.innerHTML = "<p class='text-red-600 font-semibold'>⚠️ Este simulador suporta até 20 placas. Para sistemas maiores, entre em contato.</p>";
        return;
    }

    let precoPorPlaca = 2000;
    if (placas >= 10) precoPorPlaca = 1950;
    if (placas >= 16) precoPorPlaca = 1900;

    const custoTotal = placas * precoPorPlaca;
    const microInversores = Math.ceil(placas / 4);
    const geracaoTotal = placas * geracaoPorPlaca;
    const economiaMensal = geracaoTotal * precoKWh;
    const paybackMeses = custoTotal / economiaMensal;
    const paybackAnos = (paybackMeses / 12).toFixed(1);
    const percentualExcedente = ((geracaoTotal - consumoLiquido) / consumoLiquido) * 100;

    resultado.innerHTML = `
    <div class="bg-white rounded-xl shadow-lg p-6 space-y-8 text-gray-800">

      <!-- Proposta Técnica -->
      <div>
        <h2 class="text-2xl font-bold flex items-center mb-3">🔋 Proposta Técnica – Sistema Fotovoltaico</h2>
        <div class="text-sm text-gray-700 space-y-1">
          <p><strong>Cliente:</strong> ${nomeCliente}</p>
<p><strong>Região:</strong> ${regiaoCliente}</p>
<p><strong>Telefone:</strong> ${telefoneCliente}</p>

          <p><strong>Eng. Responsável:</strong> Hector Felix – CREA RS264.617</p>
        </div>
      </div>

      <!-- Dados do Sistema -->
      <div>
        <h2 class="text-2xl font-bold flex items-center mb-4">📊 Dados do Sistema</h2>
        <table class="min-w-full text-sm text-left border border-gray-200 rounded-lg">
          <tbody>
            <tr><td class="py-2 px-4 border-b">Consumo informado</td><td class="py-2 px-4 border-b">${consumoBruto} kWh/mês</td></tr>
            <tr><td class="py-2 px-4 border-b">Desconto da taxa mínima (${tipoRede.toUpperCase()})</td><td class="py-2 px-4 border-b">- ${taxaDesconto} kWh</td></tr>
            <tr><td class="py-2 px-4 border-b">Consumo líquido</td><td class="py-2 px-4 border-b">${consumoLiquido} kWh/mês</td></tr>
            <tr><td class="py-2 px-4 border-b">Nº de placas</td><td class="py-2 px-4 border-b">${placas}</td></tr>
            <tr><td class="py-2 px-4 border-b">Microinversores</td><td class="py-2 px-4 border-b">${microInversores}</td></tr>
            <tr><td class="py-2 px-4 border-b">Geração estimada</td><td class="py-2 px-4 border-b">${geracaoTotal} kWh/mês</td></tr>
            <tr><td class="py-2 px-4 border-b">Excedente de geração</td><td class="py-2 px-4 border-b">${percentualExcedente.toFixed(1)}%</td></tr>
            <tr><td class="py-2 px-4 border-b">Área estimada</td><td class="py-2 px-4 border-b">${(placas * 1.6).toFixed(1)} m²</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Análise Financeira -->
      <div>
        <h2 class="text-2xl font-bold flex items-center mb-4">💰 Análise Financeira</h2>
        <table class="min-w-full text-sm text-left border border-gray-200 rounded-lg">
          <tbody>
            <tr><td class="py-2 px-4 border-b">Valor por placa</td><td class="py-2 px-4 border-b">R$ ${precoPorPlaca.toLocaleString()}</td></tr>
            <tr><td class="py-2 px-4 border-b font-bold text-green-600">Valor total</td><td class="py-2 px-4 border-b font-bold text-green-600">R$ ${custoTotal.toLocaleString()}</td></tr>
            <tr><td class="py-2 px-4 border-b">Economia mensal</td><td class="py-2 px-4 border-b">R$ ${economiaMensal.toFixed(2)}</td></tr>
            <tr><td class="py-2 px-4 border-b">Payback</td><td class="py-2 px-4 border-b">${paybackMeses.toFixed(1)} meses (~${paybackAnos} anos)</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Botão WhatsApp -->
      <div class="mt-6 text-center">
        <a id="btn-whatsapp" href="#" target="_blank"
          class="hidden bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded shadow inline-block transition">
          📲 Enviar orçamento por WhatsApp
        </a>
      </div>
    </div>
    `;

    // Aguarda o DOM atualizar, depois configura o botão
    setTimeout(() => {
        const btnWpp = document.getElementById("btn-whatsapp");
        const numeroWpp = "5554984062271";

        const mensagem = `
Olá! Gostaria sou de mais informações sobre o orçamento solar:
• Cliente: ${nomeCliente}
• Região: ${regiaoCliente} 
• Telefone: ${telefoneCliente}
• Consumo informado: ${consumoBruto} kWh/mês
• Tipo de rede: ${tipoRede.toUpperCase()}
• Placas sugeridas: ${placas}
• Valor estimado: R$ ${custoTotal.toLocaleString()}
• Economia mensal: R$ ${economiaMensal.toFixed(2)}
• Payback: ${paybackMeses.toFixed(1)} meses (~${paybackAnos} anos)

Gerado automaticamente pelo site da Felix Automação.
        `;

        const link = `https://wa.me/${numeroWpp}?text=${encodeURIComponent(mensagem)}`;

        if (btnWpp) {
            btnWpp.href = link;
            btnWpp.classList.remove("hidden");
        }
    }, 50); // pequena pausa para o botão existir no DOM
}