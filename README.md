🐍 SENACK - Jogo da Cobrinha (Frontend)

Frontend da aplicação do clássico jogo da cobrinha (Snake Game) com um tema visual estilo pixel art/cyberpunk. O jogo é desenvolvido com tecnologias web puras e interage com uma API de ranking (Backend) para persistência de pontuações.

🚀 Tecnologias Utilizadas

HTML5: Estrutura base da interface (tela de jogo, placares, overlays).

CSS3: Estilização com o tema retrô (incluindo a fonte 'Press Start 2P'), garantindo layout responsivo.

JavaScript Puro (ES6+): Lógica do jogo, controle de estado e integração com a API.

Canvas API: Utilizado para a renderização gráfica do ambiente de jogo, cobra e comida.

✨ Funcionalidades do Jogo

Gameplay Clássico: Implementação fiel da mecânica do Snake, com controle de movimento, crescimento e detecção de Game Over (colisão com paredes ou corpo).

Controles Duplos: Suporte total a teclas de seta (Arrow Keys) e botões visíveis na tela (^, v, <, >) para jogabilidade otimizada em dispositivos móveis.

Placar em Tempo Real: Exibição da pontuação atual e do recorde geral (obtido do ranking).

Ranking Global (Leaderboard): Exibe o TOP 10 de pontuações mais altas, buscando os dados do servidor.

Envio de Score: Após o Game Over, permite ao jogador inserir seu nome e enviar a pontuação para o ranking (se for maior que 0).

Funcionalidade de Reset: Botão para resetar completamente o ranking através de uma requisição DELETE à API.

🛠️ Configuração e Execução (Frontend)

O frontend é uma aplicação estática e não requer um servidor dedicado para ser executado localmente.

Clone este repositório.

Navegue até o diretório frontend/.

Abra o arquivo index.html em seu navegador.

A aplicação está configurada para se comunicar com o backend no seguinte endereço de API: https://senack-backend.vercel.app/api/
