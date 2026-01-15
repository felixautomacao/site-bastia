// Controle do Menu Mobile
const toggleBtn = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const navbar = document.getElementById("navbar");

if(toggleBtn){
    toggleBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
    });
}

// Efeito de transparência/cor sólida no Navbar ao rolar
window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navbar.classList.add("bg-gray-900/95", "shadow-md");
        navbar.classList.remove("bg-transparent");
    } else {
        // Pode adicionar lógica para voltar a transparente aqui se desejar
    }
});

// Fechar menu mobile ao clicar em um link
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// === LÓGICA DA CALCULADORA SOLAR ===
function calcularSistema() {
    // Coleta dos dados
    const nomeCliente = document.getElementById("nomeCliente").value || "Cliente";
    const regiaoCliente = document.getElementById("regiaoCliente").value || "Região não informada";
    const telefoneCliente = document.getElementById("telefoneCliente").value || "Não informado";
    const consumoBruto = parseFloat(document.getElementById("consumo").value);
    const tipoRede = document.getElementById("rede").value;
    const resultado = document.getElementById("resultado");

    // Validação simples
    if (isNaN(consumoBruto) || consumoBruto <= 0) {
        alert("Por favor, informe um consumo mensal válido.");
        return;
    }

    // Regras Simplificadas
    let taxaDesconto = 0;
    if (tipoRede === "mono") taxaDesconto = 30;
    if (tipoRede === "bi") taxaDesconto = 50;
    if (tipoRede === "tri") taxaDesconto = 100;

    const consumoLiquido = Math.max(consumoBruto - taxaDesconto, 0);
    const geracaoPorPlaca = 63; // Média estimada por placa
    
    // Cálculo de placas
    let placas = Math.ceil(consumoLiquido / geracaoPorPlaca);
    if (placas < 2) placas = 2; 

    // Regra de preço estimada
    let precoPorPlaca = 2000;
    if (placas >= 10) precoPorPlaca = 1950;
    if (placas >= 16) precoPorPlaca = 1900;

    const custoTotal = placas * precoPorPlaca;
    const geracaoTotal = placas * geracaoPorPlaca;
    
    // Economia estimada (Tarifa ~ R$1,05)
    const economiaMensal = geracaoTotal * 1.05; 
    const paybackMeses = custoTotal / economiaMensal;
    const paybackAnos = (paybackMeses / 12).toFixed(1);

    // Gerar HTML do Resultado
    resultado.innerHTML = `
        <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg animate-fade-in">
            <h3 class="text-xl font-bold text-gray-800 mb-4"><i class="fa-solid fa-check-circle text-green-500"></i> Resultado Estimado</h3>
            
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p class="text-xs text-gray-500 uppercase font-bold">Sistema Sugerido</p>
                    <p class="text-lg font-bold text-blue-700">${placas} Painéis</p>
                </div>
                <div>
                    <p class="text-xs text-gray-500 uppercase font-bold">Investimento Aprox.</p>
                    <p class="text-lg font-bold text-green-700">R$ ${custoTotal.toLocaleString('pt-BR')}</p>
                </div>
                <div>
                    <p class="text-xs text-gray-500 uppercase font-bold">Economia Mensal</p>
                    <p class="text-lg font-bold text-gray-800">R$ ${economiaMensal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                </div>
                 <div>
                    <p class="text-xs text-gray-500 uppercase font-bold">Retorno (Payback)</p>
                    <p class="text-lg font-bold text-orange-600">~${paybackAnos} anos</p>
                </div>
            </div>

            <div class="text-center mt-6">
                <a id="btn-whatsapp-orcamento" href="#" target="_blank" 
                   class="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition transform hover:scale-105">
                    <i class="fa-brands fa-whatsapp text-xl mr-2"></i> Enviar Orçamento no WhatsApp
                </a>
                <p class="text-xs text-gray-500 mt-2">Fale diretamente conosco e refine essa proposta.</p>
            </div>
        </div>
    `;

    // Configurar o link do WhatsApp com o número CORRIGIDO
    setTimeout(() => {
        const btn = document.getElementById("btn-whatsapp-orcamento");
        const texto = `
*Olá, Felix! Fiz uma simulação no site:*
👤 ${nomeCliente} (${regiaoCliente})
📱 ${telefoneCliente}
---------------------------
⚡ Consumo: ${consumoBruto} kWh (${tipoRede})
🌞 Sugestão: ${placas} Placas
💰 Valor Est.: R$ ${custoTotal.toLocaleString('pt-BR')}
---------------------------
*Gostaria de falar sobre esse orçamento.*
        `;
        // Número atualizado
        btn.href = `https://wa.me/5554984062271?text=${encodeURIComponent(texto)}`;
    }, 100);
}