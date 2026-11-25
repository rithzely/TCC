const btnHamburguer = document.querySelector("#Btn-Hamburguer");
const menuNav = document.querySelector("#Menu");
const linksMenu = document.querySelectorAll(".Menu-Botoes a");

/*
// Selecionando o formulário
const formulario = document.getElementById("form-encomenda");

// Selecionando os campos
const nome = document.getElementById("nome");
const email = document.getElementById("email");
const telefone = document.getElementById("telefone");
const tipo = document.getElementById("tipo");
const quantidade = document.getElementById("quantidade");
const data = document.getElementById("data");
const ideia = document.getElementById("ideia");

// Impede que o cliente escolha uma data passada
const hoje = new Date();
const ano = hoje.getFullYear();
const mes = String(hoje.getMonth() + 1).padStart(2, "0");
const dia = String(hoje.getDate()).padStart(2, "0");

data.min = ${ano}-${mes}-${dia};


// Evento de envio do formulário
formulario.addEventListener("submit", function(event) {

    // Impede o recarregamento da página
    event.preventDefault();

    // Verifica se todos os campos foram preenchidos
    if (
        nome.value.trim() === "" ||
        email.value.trim() === "" ||
        telefone.value.trim() === "" ||
        tipo.value === "" ||
        quantidade.value === "" ||
        data.value === "" ||
        ideia.value.trim() === ""
    ) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    // Verifica a quantidade
    if (Number(quantidade.value) < 1) {
        alert("A quantidade deve ser de pelo menos 1 peça.");
        return;
    }

    // Verifica se a data não está no passado
    if (data.value < ${ano}-${mes}-${dia}) {
        alert("Escolha uma data válida para sua encomenda.");
        return;
    }

    // Organiza as informações da encomenda
    const mensagem = `
Olá! Gostaria de fazer uma encomenda de arte personalizada.

DADOS DO CLIENTE

Nome: ${nome.value}
E-mail: ${email.value}
Telefone: ${telefone.value}

DADOS DA ENCOMENDA

Tipo de arte: ${tipo.value}
Quantidade: ${quantidade.value}
Data desejada: ${data.value}

Descrição da ideia:
${ideia.value}

Gostaria de conversar sobre os detalhes da minha encomenda!
    `;

    // Número de WhatsApp da artista
    // SUBSTITUA PELO NÚMERO REAL
    const numeroWhatsApp = "5551999999999";

    // Cria o link do WhatsApp
    const linkWhatsApp =
        https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)};

    // Confirmação antes de abrir o WhatsApp
    const confirmar = confirm(
        "Sua encomenda está pronta para ser enviada! Deseja continuar pelo WhatsApp?"
    );

    if (confirmar) {

        // Abre o WhatsApp com os dados preenchidos
        window.open(linkWhatsApp, "_blank");

    }

});
*/



// Abre ou fecha o menu ao clicar no botão
btnHamburguer.addEventListener("click", () => {
  const estaAberto = menuNav.classList.toggle("ativo");
  btnHamburguer.classList.toggle("ativo");
  btnHamburguer.setAttribute("aria-expanded", estaAberto);
});

// Fecha o menu automaticamente após clicar em um link no celular
linksMenu.forEach((link) => {
  link.addEventListener("click", () => {
    menuNav.classList.remove("ativo");
    btnHamburguer.classList.remove("ativo");
    btnHamburguer.setAttribute("aria-expanded", "false");
  });
});

const areaAnexo = document.getElementById("Area-Anexo");
const inputAnexo = document.getElementById("referencias");
const previaAnexo = document.getElementById("Anexo-Previa");
const contadorAnexo = document.getElementById("Anexo-Contador");
const erroAnexo = document.getElementById("Anexo-Erro");

let imagensAnexo = [];

const limiteImagens = 5;
const limiteTamanho = 5 * 1024 * 1024;

const formatosPermitidos = [
    "image/jpeg",
    "image/png",
    "image/webp"
];

// Selecionar imagens pelo botão
inputAnexo.addEventListener("change", () => {
    adicionarImagens(inputAnexo.files);
});

// Arrastar imagens
areaAnexo.addEventListener("dragover", (event) => {
    event.preventDefault();
    areaAnexo.classList.add("arrastando");
});

// Retirar imagens da área
areaAnexo.addEventListener("dragleave", () => {
    areaAnexo.classList.remove("arrastando");
});

// Soltar imagens
areaAnexo.addEventListener("drop", (event) => {
    event.preventDefault();
    areaAnexo.classList.remove("arrastando");
    adicionarImagens(event.dataTransfer.files);
});

// Adicionar e validar imagens
function adicionarImagens(arquivos) {
    const erros = [];

    for (const arquivo of arquivos) {

        if (imagensAnexo.length >= limiteImagens) {
            erros.push("Você pode enviar até 5 imagens.");
            break;
        }

        if (!formatosPermitidos.includes(arquivo.type)) {
            erros.push(`${arquivo.name}: formato não permitido.`);
            continue;
        }

        if (arquivo.size > limiteTamanho) {
            erros.push(`${arquivo.name}: excede o limite de 5 MB.`);
            continue;
        }

        const repetida = imagensAnexo.some(imagem =>
            imagem.name === arquivo.name &&
            imagem.size === arquivo.size &&
            imagem.lastModified === arquivo.lastModified
        );

        if (repetida) {
            erros.push(`${arquivo.name}: imagem já selecionada.`);
            continue;
        }

        imagensAnexo.push(arquivo);
    }

    erroAnexo.textContent = erros.join(" ");
    atualizarImagens();
}

// Exibir as miniaturas
function atualizarImagens() {
    previaAnexo.innerHTML = "";

    imagensAnexo.forEach((arquivo, indice) => {

        const div = document.createElement("div");
        div.className = "Anexo-Imagem";

        const img = document.createElement("img");
        const url = URL.createObjectURL(arquivo);

        img.src = url;
        img.alt = arquivo.name;
        img.onload = () => URL.revokeObjectURL(url);
        img.onerror = () => URL.revokeObjectURL(url);

        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "Anexo-Remover";
        botao.textContent = "×";
        botao.setAttribute("aria-label", `Remover ${arquivo.name}`);

        botao.addEventListener("click", () => {
            imagensAnexo.splice(indice, 1);
            erroAnexo.textContent = "";
            atualizarImagens();
        });

        div.appendChild(img);
        div.appendChild(botao);
        previaAnexo.appendChild(div);
    });

    contadorAnexo.textContent =
        `${imagensAnexo.length} de 5 imagens selecionadas`;

    // Atualizar os arquivos do formulário
    const transferencia = new DataTransfer();

    imagensAnexo.forEach(arquivo => {
        transferencia.items.add(arquivo);
    });

    inputAnexo.files = transferencia.files;
}


/* ==================================================
   01. FILTRAGEM DAS CATEGORIAS DO PORTFÓLIO
================================================== */

const filtrosGaleria = document.querySelectorAll(
    "#Galeria-Menu [data-filtro]"
);

const gruposGaleria = document.querySelectorAll(
    "#Galeria-Menu [data-categoria]"
);

let filtroAtual = "todas";

// Mensagem para categorias que ainda não possuem obras
const mensagemGaleria = document.createElement("p");

mensagemGaleria.id = "Galeria-Vazia";
mensagemGaleria.textContent = "Novas obras em breve!";
mensagemGaleria.hidden = true;

document.querySelector("#Galeria-Menu").appendChild(mensagemGaleria);

// Aplicar filtro
function filtrarGaleria(filtro) {

    filtroAtual = filtro;

    let quantidadeObras = 0;

    filtrosGaleria.forEach(botao => {

        const selecionado = botao.dataset.filtro === filtro;

        botao.classList.toggle("ativo", selecionado);
        botao.setAttribute("aria-pressed", selecionado);

    });

    gruposGaleria.forEach(grupo => {

        const mostrar =
            filtro === "todas" ||
            grupo.dataset.categoria === filtro;

        grupo.classList.toggle("categoria-oculta", !mostrar);

        if (mostrar) {
            quantidadeObras += grupo.querySelectorAll("img").length;
        }

    });

    mensagemGaleria.hidden = quantidadeObras > 0;
}

// Eventos dos filtros
filtrosGaleria.forEach(botao => {

    botao.setAttribute("role", "button");
    botao.setAttribute("tabindex", "0");

    botao.addEventListener("click", () => {
        filtrarGaleria(botao.dataset.filtro);
    });

    // Permite selecionar categorias pelo teclado
    botao.addEventListener("keydown", event => {

        if (event.key === "Enter" || event.key === " ") {

            event.preventDefault();
            botao.click();

        }

    });

});

// Exibir todas as obras inicialmente
filtrarGaleria("todas");


/* ==================================================
   02. AMPLIAÇÃO DAS IMAGENS DO PORTFÓLIO
================================================== */

const modalGaleria = document.getElementById("Modal-Galeria");
const modalImagem = document.getElementById("Modal-Imagem");
const modalTitulo = document.getElementById("Modal-Titulo");
const modalCategoria = document.getElementById("Modal-Categoria");
const modalContador = document.getElementById("Modal-Contador");

const modalFechar = document.getElementById("Modal-Fechar");
const modalAnterior = document.getElementById("Modal-Anterior");
const modalProximo = document.getElementById("Modal-Proximo");

let imagensVisiveis = [];
let indiceImagem = 0;

// Identificar as imagens da categoria selecionada
function obterImagensVisiveis() {

    return Array.from(
        document.querySelectorAll(
            "#Galeria-Menu [data-categoria] img"
        )
    ).filter(imagem => {

        const grupo = imagem.closest("[data-categoria]");

        return filtroAtual === "todas" ||
            grupo.dataset.categoria === filtroAtual;

    });

}

// Atualizar imagem e informações do modal
function atualizarModal() {

    const imagem = imagensVisiveis[indiceImagem];
    const obra = imagem.parentElement;

    modalImagem.src = imagem.src;
    modalImagem.alt = imagem.alt;

    modalTitulo.textContent =
        obra.querySelector("figcaption")?.textContent ||
        imagem.alt;

    modalCategoria.textContent =
        obra.querySelector("p")?.textContent || "";

    modalContador.textContent =
        `${indiceImagem + 1} de ${imagensVisiveis.length}`;

    modalAnterior.hidden = imagensVisiveis.length <= 1;
    modalProximo.hidden = imagensVisiveis.length <= 1;

}

// Abrir modal
function abrirModal(imagem) {

    imagensVisiveis = obterImagensVisiveis();
    indiceImagem = imagensVisiveis.indexOf(imagem);

    if (indiceImagem === -1) return;

    atualizarModal();

    modalGaleria.showModal();
    document.body.classList.add("modal-aberto");

}

// Fechar modal
function fecharModal() {

    modalGaleria.close();

}

// Identificar clique nas imagens
document.querySelectorAll(
    "#Galeria-Menu [data-categoria] img"
).forEach(imagem => {

    imagem.setAttribute("tabindex", "0");
    imagem.setAttribute("role", "button");

    imagem.addEventListener("click", () => {
        abrirModal(imagem);
    });

    imagem.addEventListener("keydown", event => {

        if (event.key === "Enter" || event.key === " ") {

            event.preventDefault();
            abrirModal(imagem);

        }

    });

});

// Fechar pelo botão X
modalFechar.addEventListener("click", fecharModal);

// Fechar clicando fora da imagem
modalGaleria.addEventListener("click", event => {

    if (event.target === modalGaleria) {
        fecharModal();
    }

});

// Restaurar rolagem ao fechar
modalGaleria.addEventListener("close", () => {

    document.body.classList.remove("modal-aberto");

});


/* ==================================================
   03. NAVEGAÇÃO ENTRE AS IMAGENS AMPLIADAS
================================================== */

// Próxima imagem
function proximaImagem() {

    indiceImagem =
        (indiceImagem + 1) % imagensVisiveis.length;

    atualizarModal();

}

// Imagem anterior
function imagemAnterior() {

    indiceImagem =
        (indiceImagem - 1 + imagensVisiveis.length) %
        imagensVisiveis.length;

    atualizarModal();

}

modalProximo.addEventListener("click", proximaImagem);
modalAnterior.addEventListener("click", imagemAnterior);

// Navegação pelo teclado
document.addEventListener("keydown", event => {

    if (!modalGaleria.open) return;

    if (event.key === "Escape") {
        event.preventDefault();
        fecharModal();
    }

    if (event.key === "ArrowRight") {
        proximaImagem();
    }

    if (event.key === "ArrowLeft") {
        imagemAnterior();
    }

});


/* ==================================================
   04. MENU DE ACESSIBILIDADE
================================================== */

const btnAcessibilidade =
    document.getElementById("btn-acessibilidade");

const menuAcessibilidade =
    document.getElementById("menu-acessibilidade");

const btnAumentarFonte =
    document.getElementById("aumentar-fonte");

const btnDiminuirFonte =
    document.getElementById("diminuir-fonte");

const btnAltoContraste =
    document.getElementById("alto-contraste");

btnAcessibilidade.setAttribute("aria-expanded", "false");

// Abrir e fechar menu
btnAcessibilidade.addEventListener("click", () => {

    const oculto = menuAcessibilidade.classList.toggle("oculto");

    btnAcessibilidade.setAttribute("aria-expanded", !oculto);

});

// Fechar menu ao clicar fora
document.addEventListener("click", event => {

    if (!event.target.closest(".acessibilidade-container")) {

        menuAcessibilidade.classList.add("oculto");

        btnAcessibilidade.setAttribute("aria-expanded", "false");

    }

});

// Fechar menu pela tecla Esc
document.addEventListener("keydown", event => {

    if (
        event.key === "Escape" &&
        !menuAcessibilidade.classList.contains("oculto")
    ) {

        menuAcessibilidade.classList.add("oculto");

        btnAcessibilidade.setAttribute("aria-expanded", "false");

        btnAcessibilidade.focus();

    }

});


/* ==================================================
   05. AUMENTAR E DIMINUIR O TAMANHO DA FONTE
================================================== */

let nivelFonte = 0;

const elementosFonte = document.querySelectorAll(
    "h1, h2, h3, h4, p, small, a, label, button, " +
    "input, select, textarea, figcaption, li, span"
);

// Armazenar os tamanhos originais
const fontesOriginais = Array.from(elementosFonte).map(elemento => ({

    elemento: elemento,
    tamanho: parseFloat(getComputedStyle(elemento).fontSize),
    estiloOriginal: elemento.style.fontSize

}));

function atualizarFonte() {

    fontesOriginais.forEach(item => {

        if (nivelFonte === 0) {

            item.elemento.style.fontSize = item.estiloOriginal;

        } else {

            item.elemento.style.fontSize =
                `${item.tamanho * (1 + nivelFonte * 0.1)}px`;

        }

    });

    btnAumentarFonte.disabled = nivelFonte >= 4;
    btnDiminuirFonte.disabled = nivelFonte <= -2;

    localStorage.setItem("nivelFonte", nivelFonte);

}

// Aumentar fonte
btnAumentarFonte.addEventListener("click", () => {

    if (nivelFonte < 4) {

        nivelFonte++;
        atualizarFonte();

    }

});

// Diminuir fonte
btnDiminuirFonte.addEventListener("click", () => {

    if (nivelFonte > -2) {

        nivelFonte--;
        atualizarFonte();

    }

});

// Recuperar preferência do visitante
const fonteSalva = Number(localStorage.getItem("nivelFonte"));

if (Number.isFinite(fonteSalva)) {

    nivelFonte = Math.max(-2, Math.min(4, fonteSalva));
    atualizarFonte();

}


/* ==================================================
   06. MODO DE ALTO CONTRASTE
================================================== */

function aplicarContraste(ativado) {

    document.body.classList.toggle("alto-contraste", ativado);

    btnAltoContraste.setAttribute("aria-pressed", ativado);

    btnAltoContraste.textContent = ativado
        ? "🌓 Desativar contraste"
        : "🌓 Alto Contraste";

    localStorage.setItem("altoContraste", ativado);

}

btnAltoContraste.addEventListener("click", () => {

    const ativado =
        !document.body.classList.contains("alto-contraste");

    aplicarContraste(ativado);

});

// Recuperar preferência do visitante
aplicarContraste(
    localStorage.getItem("altoContraste") === "true"
);


/* ==================================================
   07. MÁSCARA DO NÚMERO DE TELEFONE
================================================== */

const campoTelefone = document.getElementById("telefone");

campoTelefone.setAttribute("maxlength", "15");
campoTelefone.setAttribute("inputmode", "tel");

campoTelefone.addEventListener("input", () => {

    let numero = campoTelefone.value.replace(/\D/g, "");

    numero = numero.slice(0, 11);

    if (numero.length > 10) {

        numero = numero.replace(
            /^(\d{2})(\d{5})(\d{4})$/,
            "($1) $2-$3"
        );

    } else if (numero.length > 6) {

        numero = numero.replace(
            /^(\d{2})(\d{4})(\d{1,4})$/,
            "($1) $2-$3"
        );

    } else if (numero.length > 2) {

        numero = numero.replace(
            /^(\d{2})(\d+)/,
            "($1) $2"
        );

    } else if (numero.length > 0) {

        numero = "(" + numero;

    }

    campoTelefone.value = numero;

    campoTelefone.setCustomValidity("");

});


/* ==================================================
   08. VALIDAÇÃO DO FORMULÁRIO DE ENCOMENDAS
================================================== */

const formularioEncomenda =
    document.getElementById("Encomenda-Forms");

const campoNome = document.getElementById("nome");
const campoIdeia = document.getElementById("ideia");

const botaoEnviar = formularioEncomenda.querySelector(
    'button[type="submit"]'
);

// Criar espaço para mensagens do formulário
const mensagemFormulario = document.createElement("p");

mensagemFormulario.id = "Formulario-Mensagem";
mensagemFormulario.setAttribute("role", "status");
mensagemFormulario.setAttribute("aria-live", "polite");

formularioEncomenda.appendChild(mensagemFormulario);

// Limpar erros ao corrigir os campos
[campoNome, campoIdeia, campoTelefone].forEach(campo => {

    campo.addEventListener("input", () => {

        campo.setCustomValidity("");

        mensagemFormulario.textContent = "";

    });

});

// Validar os dados preenchidos
function validarFormulario() {

    campoNome.setCustomValidity("");
    campoIdeia.setCustomValidity("");
    campoTelefone.setCustomValidity("");

    const nome = campoNome.value.trim();
    const ideia = campoIdeia.value.trim();

    const telefone =
        campoTelefone.value.replace(/\D/g, "");

    if (nome.length < 2) {

        campoNome.setCustomValidity(
            "Informe um nome válido."
        );

    }

    if (ideia.length < 10) {

        campoIdeia.setCustomValidity(
            "Descreva sua ideia com pelo menos 10 caracteres."
        );

    }

    if (
        telefone.length > 0 &&
        telefone.length !== 10 &&
        telefone.length !== 11
    ) {

        campoTelefone.setCustomValidity(
            "Informe um telefone válido com DDD."
        );

    }

    return formularioEncomenda.reportValidity();

}


/* ==================================================
   09. ENVIO DO FORMULÁRIO DE ENCOMENDAS
================================================== */

// Inserir futuramente o endereço do serviço de envio
const enderecoEnvio = "";

formularioEncomenda.addEventListener("submit", async event => {

    event.preventDefault();

    if (!validarFormulario()) return;

    // Impedir confirmação falsa enquanto não houver serviço
    if (!enderecoEnvio) {

        mensagemFormulario.className = "mensagem-erro";

        mensagemFormulario.textContent =
            "O envio de encomendas ainda não está disponível.";

        return;

    }

    const dadosFormulario = new FormData(formularioEncomenda);

    const textoOriginal = botaoEnviar.innerHTML;

    botaoEnviar.disabled = true;
    botaoEnviar.textContent = "Enviando...";

    mensagemFormulario.className = "";
    mensagemFormulario.textContent = "Enviando sua solicitação...";

    try {

        const resposta = await fetch(enderecoEnvio, {

            method: "POST",
            body: dadosFormulario,

            headers: {
                "Accept": "application/json"
            }

        });

        if (!resposta.ok) {

            throw new Error("Falha no envio.");

        }

        mensagemFormulario.className = "mensagem-sucesso";

        mensagemFormulario.textContent =
            "Solicitação enviada com sucesso! " +
            "Obrigada pelo carinho. Em breve entrarei em contato.";

        // Limpar formulário e imagens anexadas
        formularioEncomenda.reset();

        imagensAnexo = [];

        erroAnexo.textContent = "";

        atualizarImagens();

    } catch (erro) {

        mensagemFormulario.className = "mensagem-erro";

        mensagemFormulario.textContent =
            "Não foi possível enviar sua solicitação. " +
            "Por favor, tente novamente.";

    } finally {

        botaoEnviar.disabled = false;
        botaoEnviar.innerHTML = textoOriginal;

    }

});


/* ==================================================
   10. BOTÃO VOLTAR AO TOPO
================================================== */

const botaoTopo = document.getElementById("Voltar-Topo");

function atualizarBotaoTopo() {

    botaoTopo.classList.toggle(
        "visivel",
        window.scrollY > 500
    );

}

window.addEventListener("scroll", atualizarBotaoTopo, {
    passive: true
});

botaoTopo.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches ? "instant" : "smooth"

    });

});

atualizarBotaoTopo();


/* ==================================================
   11. DESTACAR A SEÇÃO ATUAL NO MENU
================================================== */

const secoesSite = document.querySelectorAll(
    "main section[id]"
);

const linksCabecalho = document.querySelectorAll(
    "#Menu a"
);

function atualizarMenuAtivo() {

    let secaoAtual = "Inicio";

    const alturaCabecalho =
        document.getElementById("Cabecalho").offsetHeight;

    secoesSite.forEach(secao => {

        if (
            secao.getBoundingClientRect().top <=
            alturaCabecalho + 100
        ) {

            secaoAtual = secao.id;

        }

    });

    // Identificar a última seção ao chegar ao final da página
    if (
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 5
    ) {

        secaoAtual = "Contato";

    }

    linksCabecalho.forEach(link => {

        const ativo =
            link.getAttribute("href") === "#" + secaoAtual &&
            !link.closest("#Menu-Botoes-Encomenda");

        link.classList.toggle("secao-ativa", ativo);

        if (ativo) {

            link.setAttribute("aria-current", "location");

        } else {

            link.removeAttribute("aria-current");

        }

    });

}

window.addEventListener("scroll", atualizarMenuAtivo, {
    passive: true
});

atualizarMenuAtivo();


/* ==================================================
   12. ANIMAÇÕES AO ROLAR A PÁGINA
================================================== */

const elementosAnimados = document.querySelectorAll(

    "#Sobre-Imagem, " +
    "#Sobre-Textos, " +
    "#Galeria > article:first-child, " +
    "#Galeria-Menu [data-categoria] > div, " +
    ".Encomenda-Etapa, " +
    "#Encomenda-Formulario, " +
    ".Contatos-Card"

);

const reduzirMovimento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (!reduzirMovimento && "IntersectionObserver" in window) {

    const observadorAnimacao = new IntersectionObserver(

        entradas => {

            entradas.forEach(entrada => {

                if (entrada.isIntersecting) {

                    entrada.target.classList.add("revelado");

                    observadorAnimacao.unobserve(entrada.target);

                }

            });

        },

        {
            threshold: 0.08
        }

    );

    elementosAnimados.forEach(elemento => {

        elemento.classList.add("animar-entrada");

        observadorAnimacao.observe(elemento);

    });

}


/* ==================================================
   13. CARREGAMENTO OTIMIZADO DAS IMAGENS
================================================== */

document.querySelectorAll(
    "#Galeria-Menu img"
).forEach(imagem => {

    imagem.loading = "lazy";
    imagem.decoding = "async";

});
