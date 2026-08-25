# PersonalFight

Site institucional estático do professor Clayton Rodrigues Israel para divulgação de aulas particulares de Muay Thai, Jiu-Jitsu, Boxe e MMA.

O site continua sendo construído somente com HTML, CSS e JavaScript. O Vite é usado apenas como servidor local para permitir a abertura pelo terminal com atualização automática; não foi adicionado nenhum framework.

## Como abrir no VS Code

1. Abra o VS Code e acesse **Arquivo > Abrir Pasta**.
2. Selecione a pasta `PersonalFight`.
3. Abra **Terminal > Novo Terminal**.
4. Instale as dependências com `npm install`.

## Como abrir pelo terminal

Na pasta do projeto, execute:

```bash
npm install
npm run dev
```

O navegador abrirá automaticamente em `http://127.0.0.1:5501/`. O terminal deve permanecer aberto enquanto o site estiver em execução. Para encerrar o servidor, pressione `Ctrl+C`.

As alterações em `index.html`, `style.css` e `script.js` atualizam a página automaticamente.

Se a porta 5501 já estiver sendo utilizada, o Vite selecionará a próxima porta disponível e mostrará o endereço correto no terminal.

## Como visualizar com a extensão Live Server

O terminal é o fluxo principal. Como alternativa, abra **Extensões** (`Ctrl+Shift+X`), procure por **Live Server**, de Ritwick Dey, e clique em **Instalar**.

O arquivo `.vscode/extensions.json` já recomenda a extensão correta.

1. Abra `index.html` no VS Code.
2. Clique em **Go Live** na barra de status, no canto inferior direito.
3. O navegador abrirá `http://127.0.0.1:5500/`.

Também é possível clicar com o botão direito em `index.html` e escolher **Open with Live Server**. Para encerrar, clique novamente na porta exibida na barra de status.

Quando a barra de status mostrar **Port: 5500**, a extensão já está servindo o site. Não use simultaneamente o Live Server da extensão e o servidor do terminal se quiser evitar dois endereços locais abertos.

## Estrutura

```text
PersonalFight/
├── .vscode/
│   ├── extensions.json
│   └── settings.json
├── assets/
│   └── images/
├── package.json
├── package-lock.json
├── index.html
├── robots.txt
├── style.css
├── script.js
└── README.md
```

- `index.html`: conteúdo e estrutura semântica.
- `style.css`: visual, animações e responsividade.
- `script.js`: menu móvel, navegação ativa, modalidades interativas, parallax leve, galeria e ano automático.
- `assets/images/`: fotografias utilizadas no site.
- `package.json`: fornece o comando `npm run dev` com o servidor local Vite.
- `robots.txt`: permite a indexação pública do conteúdo pelos mecanismos de busca.

## Recursos do site

- Menu fixo, responsivo e navegável por teclado.
- Narrativa editorial numerada, manifesto e seções institucionais sobre experiência, aulas, trajetória e benefícios.
- Seletor interativo das quatro modalidades, com suporte às setas do teclado, `Home` e `End`.
- Ficha rápida atualizada automaticamente conforme a modalidade selecionada.
- Faixa contínua de valores, revelações suaves ao rolar e parallax discreto na imagem inicial.
- Atendimento guiado pelo WhatsApp: o formulário monta uma mensagem personalizada e abre a conversa com o professor.
- Composição editorial em cartões para apresentar programa, metodologia, experiência e formatos de aula.
- Fundos cinematográficos originais de arena e octógono, otimizados em JPEG e sem marcas de terceiros.
- Galeria responsiva com ampliação de imagens, navegação anterior e próxima, gestos de toque e fechamento por `Escape`.
- Botões de contato direcionados ao WhatsApp configurado no projeto.
- Animações discretas com suporte a `prefers-reduced-motion`.
- Metadados de SEO e Open Graph sem domínio ou rede social inventados.

## Como editar

- Textos, links e seções: edite `index.html`.
- Cores, fontes, espaçamentos e layouts: edite `style.css`. As cores principais estão nas variáveis do início do arquivo.
- Menu e animações: edite `script.js`.
- Imagens: adicione o arquivo em `assets/images/` e atualize o `src` correspondente no HTML.

Use nomes de arquivo em letras minúsculas, sem espaços e com a extensão do formato real. Em imagens informativas, mantenha um texto alternativo descritivo no atributo `alt`. O Live Server recarrega a página quando os arquivos são salvos.

## Como enviar mudanças ao GitHub

Abra **Terminal > Novo Terminal** no VS Code e execute:

```bash
git status
git add .
git commit -m "Descreva a alteração realizada"
git push origin main
```

Revise o resultado de `git status` antes de adicionar os arquivos. Se o repositório utilizar outra branch, substitua `main` pelo nome correto. A configuração existente do Git não foi modificada.
