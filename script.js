// ================= SELEÇÃO DOS BOTÕES DO CABEÇALHO =================



let paginaAtual = window.location.pathname.split('/').pop();

if (paginaAtual === "") paginaAtual = "cards.html";



const botoes = document.querySelectorAll('.cabeçalho-botton');

botoes.forEach(botao => {

    if (botao.getAttribute('href') === paginaAtual) {

        botao.classList.add('selecionado');

    }

});



// ================= GERENCIADOR DE ACESSOS E TOP JOGOS =================

// Lista mestre de jogos do site
const jogosGameVerse = [
    { id: 'fallout76', titulo: 'Fallout 76', categoria: 'Sobrevivência', img: 'imagens/Fallout76.jpg', link: 'fallout76.html' },
    { id: 'mk11', titulo: 'Mortal Kombat 11', categoria: 'Luta', img: 'imagens/Mortal_Kombat_11.jpg', link: 'mortalKombat11.html' },
    { id: 'gta6', titulo: 'GTA 6', categoria: 'Ação', img: 'imagens/GTA_VI_250x250.jpg', link: 'gta6.html' },
    { id: 'terraria', titulo: 'Terraria', categoria: 'Sobrevivência', img: 'imagens/Terraria.png', link: 'terraria.html' },
    { id: 'rdr', titulo: 'Red Dead Redemption', categoria: 'Faroeste', img: 'imagens/Red_Dead_Redemption_capa.png', link: 'rdr.html' },
    { id: 'cyberpunk', titulo: 'Ciberpunk 2077', categoria: 'RPG', img: 'imagens/Cyberpunk_2077_capa.png', link: 'cp2077.html' },
    { id: 'forza', titulo: 'ForzaHorizon', categoria: 'Corrida', img: 'imagens/Forza_Horizon.jpg', link: 'forza.html' },
    { id: 'resident', titulo: 'ResidentEvil', categoria: 'Terror', img: 'imagens/Resident_Evil_capa.png', link: 're.html' }
];

// Obtém o histórico de acessos salvo no navegador
function obterHistoricoAcessos() {
    const historico = localStorage.getItem('gv_acessos');
    return historico ? JSON.parse(historico) : {};
}

// Contabiliza o clique no jogo
function registrarAcesso(idJogo) {
    const acessos = obterHistoricoAcessos();
    acessos[idJogo] = (acessos[idJogo] || 0) + 1;
    localStorage.setItem('gv_acessos', JSON.stringify(acessos));
}

// Renderiza os 3 jogos mais acessados na página Home (cards.html)
function renderizarTop3Home() {
    const container = document.getElementById('top-jogos-container');
    if (!container) return; // Se não estiver na página home, interrompe

    const acessos = obterHistoricoAcessos();

    // Associa os acessos a cada jogo
    const jogosComAcessos = jogosGameVerse.map(jogo => ({
        ...jogo,
        totalAcessos: acessos[jogo.id] || 0
    }));

    // Ordena do mais acessado para o menos acessado
    jogosComAcessos.sort((a, b) => b.totalAcessos - a.totalAcessos);

    // Pega apenas os 3 primeiros
    const top3 = jogosComAcessos.slice(0, 3);

    // Injeta os cards HTML na página
    container.innerHTML = top3.map(jogo => `
        <a href="${jogo.link}" onclick="registrarAcesso('${jogo.id}')">
            <div class="caixa-jogos">
                <div class="caixa-jogos-img"><img src="${jogo.img}" alt="${jogo.titulo}"></div>
                <div class="caixa-jogos-categoria">${jogo.categoria}</div>
                <p class="caixa-jogos-titulo"><b>${jogo.titulo}</b></p>
            </div>
        </a>
    `).join('');
}

// Executa automaticamente ao carregar a página
document.addEventListener('DOMContentLoaded', renderizarTop3Home);





// ================= SISTEMA DE FAVORITOS ========================================

// 1. Obtém os favoritos salvos
function obterFavoritos() {
    const salvos = localStorage.getItem('gv_favoritos');
    return salvos ? JSON.parse(salvos) : [];
}

// 2. Alterna o estado de favorito
function toggleFavorito(event, idJogo) {
    event.preventDefault();
    
    let favoritos = obterFavoritos();
    const index = favoritos.indexOf(idJogo);

    if (index === -1) {
        favoritos.push(idJogo);
    } else {
        favoritos.splice(index, 1);
    }

    localStorage.setItem('gv_favoritos', JSON.stringify(favoritos));
    atualizarBotoesFavoritos();
    
    // Atualiza a tela instantaneamente se o usuário estiver na página de favoritos
    if (document.getElementById('lista-favoritos-container')) {
        renderizarPaginaFavoritos();
    }
}

// 3. Atualiza o visual dos botões nas telas
function atualizarBotoesFavoritos() {
    const favoritos = obterFavoritos();
    const botoes = document.querySelectorAll('.btn-favoritar');
    
    botoes.forEach(botao => {
        const idDoJogo = botao.id.replace('btn-', '');
        if (favoritos.includes(idDoJogo)) {
            botao.classList.add('ativo');
            botao.innerHTML = 'Favoritado';
        } else {
            botao.classList.remove('ativo');
            botao.innerHTML = 'Favoritar';
        }
    });
}

// 4. Renderiza os jogos na página exclusiva de Favoritos
function renderizarPaginaFavoritos() {
    const container = document.getElementById('lista-favoritos-container');
    if (!container) return; 

    const favoritosSalvos = obterFavoritos();
    
    if (favoritosSalvos.length === 0) {
        container.innerHTML = '<p style="font-size: 18px;">Você ainda não tem jogos favoritos.</p>';
        return;
    }

    // Filtra a sua lista base jogosGameVerse
    const jogosParaMostrar = jogosGameVerse.filter(jogo => favoritosSalvos.includes(jogo.id));

    // Reutiliza a sua estrutura HTML da caixa-jogos
    container.innerHTML = jogosParaMostrar.map(jogo => `
        <a href="${jogo.link}" onclick="registrarAcesso('${jogo.id}')">
            <div class="caixa-jogos">
                <div class="caixa-jogos-img"><img src="${jogo.img}" alt="${jogo.titulo}"></div>
                <div class="caixa-jogos-categoria">${jogo.categoria}</div>
                <p class="caixa-jogos-titulo"><b>${jogo.titulo}</b></p>
                
                <button class="btn-favoritar" id="btn-${jogo.id}" onclick="toggleFavorito(event, '${jogo.id}')">
                    Favoritar
                </button>
            </div>
        </a>
    `).join('');
    
    atualizarBotoesFavoritos();
}

// Executa a verificação dos botões ao carregar qualquer página
document.addEventListener('DOMContentLoaded', () => {
    atualizarBotoesFavoritos();
    renderizarPaginaFavoritos();
});


// ================= DETECTOR DO CÓDIGO KONAMI =================



const sequenciaSecreta = [

    'arrowup', 'arrowup', 'arrowdown', 'arrowdown', 

    'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'

];

let posicaoAtual = 0;



document.addEventListener('keydown', (event) => {

    if (event.key.toLowerCase() === sequenciaSecreta[posicaoAtual]) {

        posicaoAtual++;

        if (posicaoAtual === sequenciaSecreta.length) {

            abrirCMD();

            posicaoAtual = 0;

        }

    } else {

        posicaoAtual = 0;

    }

});



// ================= LÓGICA DO CMD =================



function abrirCMD() {

    const cmd = document.getElementById('cmd-container');

    const input = document.getElementById('cmd-input');



    if (cmd) {

        cmd.classList.remove('cmd-escondido');

        if (input) {

            setTimeout(() => {

                input.value = ''; 

                input.focus();

            }, 10); 

        }

    }

}



function fecharCMD() {

    const cmd = document.getElementById('cmd-container');

    if (cmd) cmd.classList.add('cmd-escondido');

}



const cmdBodyArea = document.getElementById('cmd-body-area');

if(cmdBodyArea) {

    cmdBodyArea.addEventListener('click', () => {

        const input = document.getElementById('cmd-input');

        if(input) input.focus();

    });

}



const cmdInput = document.getElementById('cmd-input');

if (cmdInput) {

    cmdInput.addEventListener('keydown', (event) => {

        if (event.key === 'Enter') {

            const comando = cmdInput.value.trim().toLowerCase();

            const historico = document.getElementById('cmd-historico');



            if (comando !== "") {

                historico.innerHTML += `<div><span class="cmd-prompt">C:\\Users\\Jogador&gt;</span>${cmdInput.value}</div>`;



                if (comando === 'exit') {

                    fecharCMD();

                } else if (comando === 'clear' || comando === 'cls') {

                    historico.innerHTML = '';

                } else if (comando === 'help') {

                    historico.innerHTML += `<div style="color: #3b824e;">Comandos disponíveis:<br> cls    - Limpa a tela<br> exit   - Fecha o terminal<br> invaders - Inicia o protocolo de defesa</div>`;

                } else if (comando === 'invaders') {

                    historico.innerHTML += `<div style="color: #3b824e;">Iniciando protocolo de defesa GameVerse Invaders...</div>`;

                    setTimeout(() => {

                        fecharCMD();

                        iniciarJogo();

                    }, 1000); 

                } else {

                    historico.innerHTML += `<div style="color: #3b824e;">'${comando}' não é reconhecido como um comando interno ou externo, um programa operável ou um arquivo em lotes.</div>`;

                }



                cmdInput.value = '';

                const cmdBody = document.querySelector('.cmd-body');

                if (cmdBody) cmdBody.scrollTop = cmdBody.scrollHeight;

            }

        }

    });

}



// ================= MINIGAME: GAMEVERSE INVADERS =================



let gameLoop;

let ctx;

let canvas;



const game = {

    player: { x: 275, y: 350, w: 50, h: 20, speed: 5, dx: 0, cor: '#3b824e' },

    bullets: [],

    enemies: [],

    pontos: 0,

    ativo: false

};



function iniciarJogo() {

    const container = document.getElementById('game-container');

    canvas = document.getElementById('gameCanvas');

    ctx = canvas.getContext('2d');



    container.classList.remove('cmd-escondido');

    game.ativo = true;

    game.pontos = 0;

    game.bullets = [];

    game.enemies = [];

    game.player.x = canvas.width / 2 - 25;



    for(let i=0; i<6; i++) {

        for(let j=0; j<3; j++) {

            game.enemies.push({

                x: i * 60 + 50, y: j * 40 + 30, w: 30, h: 20,

                cor: '#7a3131', speedX: 1, vivo: true

            });

        }

    }



    document.addEventListener('keydown', controlesJogoDown);

    document.addEventListener('keyup', controlesJogoUp);

    gameLoop = requestAnimationFrame(atualizarJogo);

}



function fecharJogo() {

    const container = document.getElementById('game-container');

    container.classList.add('cmd-escondido');

    game.ativo = false;

    cancelAnimationFrame(gameLoop);

    document.removeEventListener('keydown', controlesJogoDown);

    document.removeEventListener('keyup', controlesJogoUp);

}



function controlesJogoDown(e) {

    if(!game.ativo) return;

    if(e.key === 'ArrowLeft') game.player.dx = -game.player.speed;

    if(e.key === 'ArrowRight') game.player.dx = game.player.speed;

    if(e.key === ' ' || e.key === 'ArrowUp') { 

        game.bullets.push({ x: game.player.x + 22, y: game.player.y, w: 4, h: 10, speed: 7 });

    }

    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {

        e.preventDefault();

    }

}



function controlesJogoUp(e) {

    if(!game.ativo) return;

    if(e.key === 'ArrowLeft' || e.key === 'ArrowRight') game.player.dx = 0;

}



function atualizarJogo() {

    if(!game.ativo) return;



    // Limpa a tela

    ctx.fillStyle = '#000000';

    ctx.fillRect(0, 0, canvas.width, canvas.height);



    // Garante que o emoji fique alinhado com a caixa de colisão

    ctx.textBaseline = 'top';



    // ================= 1. NAVE DO JOGADOR =================

    game.player.x += game.player.dx;

    if(game.player.x < 0) game.player.x = 0;

    if(game.player.x + game.player.w > canvas.width) game.player.x = canvas.width - game.player.w;



    // Desenha a nave com emoji (ex: 🚀)

    ctx.font = '26px Arial';

    ctx.fillText('🛸', game.player.x + 10, game.player.y - 5);



    // ================= 2. TIROS =================

    for (let i = 0; i < game.bullets.length; i++) {

        let b = game.bullets[i];

        b.y -= b.speed;



        // Desenha o tiro com emoji (ex: 🔥 ou ⚡)

        ctx.font = '14px Arial';

        ctx.fillText('⚡', b.x - 4, b.y);



        if(b.y < 0) game.bullets.splice(i, 1);

    }



    // ================= 3. INIMIGOS (ALIENS) =================

    let inverteDirecao = false;

    let ganhou = true;



    for (let inimigo of game.enemies) {

        if(inimigo.vivo) {

            ganhou = false; 

            inimigo.x += inimigo.speedX;

            if(inimigo.x <= 0 || inimigo.x + inimigo.w >= canvas.width) inverteDirecao = true;



            // Desenha o alien com emoji (ex: 👾, 👽 ou 🛸)

            ctx.font = '22px Arial';

            ctx.fillText('👾', inimigo.x + 4, inimigo.y);



            // Verifica colisão do tiro com o alien

            for (let i = 0; i < game.bullets.length; i++) {

                let b = game.bullets[i];

                if (b.x < inimigo.x + inimigo.w && b.x + b.w > inimigo.x &&

                    b.y < inimigo.y + inimigo.h && b.y + b.h > inimigo.y) {

                    inimigo.vivo = false;

                    game.bullets.splice(i, 1);

                    game.pontos += 10;

                }

            }

        }

    }



    if(inverteDirecao) {

        for (let inimigo of game.enemies) {

            inimigo.speedX *= -1;

            inimigo.y += 20; 

        }

    }



    // ================= PONTUAÇÃO E VITÓRIA =================

    ctx.fillStyle = '#3b824e';

    ctx.font = '16px Consolas';

    ctx.fillText('Pontos: ' + game.pontos, 10, 20);



    if(ganhou) {

        ctx.fillStyle = '#3b824e';

        ctx.font = '30px Consolas';

        ctx.fillText('VOCÊ VENCEU!', canvas.width/2 - 90, canvas.height/2);

    }



    gameLoop = requestAnimationFrame(atualizarJogo);

}