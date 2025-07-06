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
    const consumoBruto = parseFloat(document.getElementById("consumo").value);
    const tipoRede = document.getElementById("rede").value;
    const resultado = document.getElementById("resultado");

    if (isNaN(consumoBruto) || consumoBruto <= 0) {
        resultado.innerHTML = "<p class='text-red-600 font-semibold'>⚠️ Informe um valor válido de consumo mensal.</p>";
        return;
    }

    let taxaDesconto = 0;
    if (tipoRede === "mono") taxaDesconto = 30;
    if (tipoRede === "bi") taxaDesconto = 50;
    if (tipoRede === "tri") taxaDesconto = 100;

    const consumoLiquido = Math.max(consumoBruto - taxaDesconto, 0);
    const geracaoPorPlaca = 63;
    const precoKWh = 1.00;

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
    <div class="mt-8 space-y-8">

      <div class="bg-white shadow-md rounded-lg p-6">
        <h3 class="text-xl font-bold mb-2 text-blue-700">🔋 Proposta Técnica – Sistema Fotovoltaico</h3>
        <p><strong>Cliente:</strong> Simulação Online</p>
        <p><strong>Eng. Responsável:</strong> Hector Felix – CREA RS264.617</p>
      </div>

      <div class="bg-white shadow-md rounded-lg p-6">
        <h3 class="text-xl font-bold mb-4 text-blue-700">📊 Dados do Sistema</h3>
        <table class="w-full text-left text-sm border border-gray-300">
          <tbody>
            <tr><td class="p-2 font-medium">Consumo informado</td><td class="p-2">${consumoBruto} kWh/mês</td></tr>
            <tr class="bg-gray-50"><td class="p-2 font-medium">Desconto da taxa mínima (${tipoRede.toUpperCase()})</td><td class="p-2">- ${taxaDesconto} kWh</td></tr>
            <tr><td class="p-2 font-medium">Consumo líquido</td><td class="p-2">${consumoLiquido} kWh/mês</td></tr>
            <tr class="bg-gray-50"><td class="p-2 font-medium">Nº de placas (Trina 610W)</td><td class="p-2">${placas} placas</td></tr>
            <tr><td class="p-2 font-medium">Nº de micro inversores</td><td class="p-2">${microInversores} unidades</td></tr>
            <tr class="bg-gray-50"><td class="p-2 font-medium">Geração mensal estimada</td><td class="p-2">${geracaoTotal} kWh</td></tr>
            <tr><td class="p-2 font-medium">Excedente de geração</td><td class="p-2">${percentualExcedente.toFixed(1)}%</td></tr>
            <tr class="bg-gray-50"><td class="p-2 font-medium">Área ocupada estimada</td><td class="p-2">~${(placas * 1.6).toFixed(1)} m²</td></tr>
          </tbody>
        </table>
      </div>

      <div class="bg-white shadow-md rounded-lg p-6">
        <h3 class="text-xl font-bold mb-4 text-blue-700">💰 Análise Financeira</h3>
        <table class="w-full text-left text-sm border border-gray-300">
          <tbody>
            <tr><td class="p-2 font-medium">Valor por placa</td><td class="p-2">R$ ${precoPorPlaca.toLocaleString()}</td></tr>
            <tr class="bg-gray-50"><td class="p-2 font-medium">Custo total do sistema</td><td class="p-2 font-bold text-green-700">R$ ${custoTotal.toLocaleString()}</td></tr>
            <tr><td class="p-2 font-medium">Economia mensal estimada</td><td class="p-2">R$ ${economiaMensal.toFixed(2)}</td></tr>
            <tr class="bg-gray-50"><td class="p-2 font-medium">Payback</td><td class="p-2">${paybackMeses.toFixed(1)} meses (~${paybackAnos} anos)</td></tr>
          </tbody>
        </table>
      </div>

      <div class="bg-white shadow-md rounded-lg p-6">
        <h3 class="text-xl font-bold mb-4 text-blue-700">📎 Itens Inclusos</h3>
        <ul class="list-disc list-inside space-y-1 text-gray-700">
          <li>Painéis Trina 610W</li>
          <li>Microinversores Deye (1 p/ 4 placas)</li>
          <li>Estrutura de fixação (aluzinco ou telhado metálico)</li>
          <li>String Box com proteções CA e CC</li>
          <li>Projeto com ART e homologação</li>
          <li>Aplicativo de monitoramento</li>
          <li>Garantia de 25 anos para placas</li>
        </ul>
      </div>

    </div>
    `;
}