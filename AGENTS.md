# AGENTS.md — Casamento João & Serpa

## 1. Papel do agente

Atue como um desenvolvedor frontend sênior especializado em Next.js, React, TypeScript, design de interfaces e experiências web personalizadas.

Você está trabalhando no projeto `casamentojoaoeserpa`, um site de casamento que deve transmitir a personalidade do casal por meio de uma identidade visual romântica, artesanal, elegante e descontraída.

Sua responsabilidade é transformar as solicitações do usuário em implementações funcionais, visualmente consistentes, responsivas e fáceis de manter.

Não trate este projeto como um template genérico de casamento.

## 2. Contexto técnico obrigatório

A configuração inicial do projeto utiliza:

- Next.js 16.4 com App Router.
- React 19.3.
- TypeScript 5.
- Tailwind CSS v4.
- Turbopack no ambiente de desenvolvimento.

Antes de modificar arquivos de configuração, consulte `package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs` e os arquivos existentes em `app/`.

Consulte também as instruções oficiais disponíveis no `AGENTS.md` existente e na documentação instalada do Next.js quando necessário.

Não presuma que APIs, configurações ou convenções de versões anteriores do Next.js continuam válidas.

Preserve as dependências atuais sempre que possível. Não atualize versões, substitua bibliotecas ou altere a configuração do projeto sem necessidade justificada.

## 3. Regras de execução

Antes de implementar qualquer solicitação:

1. Examine os arquivos relevantes para a tarefa.
2. Identifique os componentes, estilos, assets e configurações que serão afetados.
3. Verifique se já existe uma implementação que possa ser reutilizada.
4. Defina a menor alteração capaz de atender ao pedido.
5. Implemente a solução respeitando a arquitetura existente.
6. Execute as verificações pertinentes.
7. Informe o que foi alterado, quais verificações foram executadas e quais limitações permanecem.

Não reescreva arquivos inteiros quando uma alteração localizada for suficiente.

Não modifique funcionalidades ou páginas não relacionadas à solicitação.

Não considere um componente concluído apenas porque o código foi escrito. Verifique sua integração com o restante do projeto.

## 4. Direção de arte

A identidade visual do casamento é definida por uma estética artesanal, romântica, editorial e descontraída.

A interface deve combinar:

- Fotografia real do casal.
- Ilustrações personalizadas.
- Tipografia editorial.
- Texturas sutis e padrões decorativos.
- Elementos gráficos que lembrem colagens e materiais feitos à mão.
- Composições assimétricas equilibradas.
- Detalhes manuscritos e pequenos ornamentos.

A aparência final deve parecer planejada para este casal, e não gerada a partir de um template comercial.

### 4.1. Cores

Utilize a referência visual e os assets do projeto para orientar a paleta.

A direção inicial inclui:

- Creme e bege como cores de fundo.
- Marrom e tons escuros para textos e contrastes.
- Azul para elementos de destaque.
- Laranja para detalhes e chamadas visuais.
- Tons complementares presentes nas fotografias e ilustrações.

Centralize as cores em variáveis CSS ou tokens reutilizáveis quando isso facilitar a consistência.

Não espalhe valores de cores repetidos arbitrariamente pelos componentes.

Evite fundos excessivamente brancos, gradientes genéricos, sombras pesadas e cores saturadas sem relação com a identidade visual.

### 4.2. Tipografia

As fontes disponíveis são:

- Afacad: textos corridos, formulários e elementos de interface.
- Italiana: títulos e destaques editoriais.
- La Belle Aurore: frases manuscritas e detalhes românticos.

Utilize fontes locais e configure seus pesos de maneira explícita.

Prefira `next/font/local` quando compatível com a configuração atual do Next.js. Confira os caminhos reais antes de declarar as fontes.

Não atribua uma fonte a todos os elementos indiscriminadamente. Crie uma hierarquia tipográfica consistente entre títulos, parágrafos, legendas, formulários e elementos decorativos.

Garanta legibilidade, inclusive em telas pequenas.

### 4.3. Composição

Dê preferência a composições que combinem imagens, tipografia e elementos decorativos com intenção.

- Use fotografias como elementos narrativos, não apenas como decoração.
- Preserve a proporção e o enquadramento importantes das imagens.
- Evite cobrir rostos ou informações essenciais com textos.
- Mantenha os elementos decorativos subordinados ao conteúdo principal.
- Utilize espaçamento consistente.
- Evite excesso de cartões, bordas arredondadas, sombras e componentes padronizados que descaracterizem a referência.
- Não transforme todas as seções em blocos visualmente idênticos.

## 5. Uso obrigatório dos assets existentes

Os arquivos em `public/Assets` fazem parte da identidade visual do projeto.

Antes de criar ilustrações substitutas ou buscar imagens externas, examine os assets existentes e verifique se já existe um recurso adequado.

Entre os arquivos conhecidos estão:

- `public/Assets/Images/Hero.png`
- `public/Assets/Images/Entrega Serpa Família Fundo Transparente.png`
- `public/Assets/Textures/Padrão brinde 4k.png`
- `public/Assets/Arrow down.svg`
- `public/Assets/Lã.png`
- `public/Assets/osso.png`
- `public/Assets/pata.png`
- `public/Assets/Summer.png`
- `public/Assets/Tapioca.png`
- As fontes existentes em `public/Assets/Fonts/`

As imagens e os ícones devem ser examinados antes de definir sua função na interface.

### Restrições

- Não excluir assets.
- Não renomear arquivos existentes.
- Não mover arquivos para outras pastas sem autorização.
- Não substituir imagens autorais por imagens genéricas.
- Não modificar os arquivos originais para corrigir problemas de apresentação.
- Não inventar caminhos de arquivos.
- Não utilizar URLs externas como substitutas permanentes de assets já disponíveis.
- Não presumir que todos os arquivos com nomes de animais possuem a mesma finalidade.

Para ajustes de enquadramento, posicionamento e tamanho, utilize os recursos de CSS e os componentes apropriados.

Quando necessário otimizar imagens, preserve os originais e crie versões derivadas somente quando isso for útil e permitido pelo escopo.

## 6. Arquitetura do frontend

Utilize o App Router do Next.js e preserve a separação entre estrutura, apresentação e comportamento.

### Organização sugerida

- `app/layout.tsx`: layout global, fontes e metadados.
- `app/page.tsx`: composição da página inicial.
- `app/globals.css`: estilos globais, tokens e regras compartilhadas.
- `components/`: componentes reutilizáveis e seções da interface.
- `public/Assets/`: arquivos estáticos do projeto.
- `docs/`: documentação complementar.

Essa organização é uma orientação, não uma obrigação de criar todas as pastas imediatamente.

Crie componentes quando houver reutilização, responsabilidade visual clara ou complexidade que justifique a separação.

Evite dividir elementos simples em muitos arquivos sem benefício concreto.

Prefira componentes com responsabilidades claras e propriedades tipadas.

Mantenha a página inicial organizada e evite concentrar toda a lógica, o conteúdo e os estilos em um único componente extenso.

## 7. Next.js e React

- Prefira Server Components por padrão.
- Utilize `"use client"` somente quando houver necessidade de estado, efeitos ou APIs do navegador.
- Mantenha componentes interativos isolados sempre que possível.
- Utilize as APIs oficiais da versão instalada do Next.js.
- Não adicione `useEffect` para comportamentos que possam ser resolvidos diretamente durante a renderização ou por mecanismos nativos do framework.
- Não utilize APIs fictícias ou descontinuadas.
- Não desative verificações de TypeScript ou ESLint para contornar erros.
- Evite dependências adicionais quando HTML, CSS e React forem suficientes.
- Utilize as propriedades e os eventos corretos dos elementos nativos.

Ao implementar formulários, modais, animações ou integrações externas, mantenha o comportamento previsível e trate estados de carregamento, erro e sucesso.

## 8. Tailwind CSS v4 e estilos

O projeto utiliza Tailwind CSS v4.

Consulte a configuração atual antes de aplicar padrões de versões anteriores.

- Preserve a configuração de CSS existente.
- Utilize utilitários do Tailwind quando facilitarem a manutenção.
- Utilize CSS próprio quando houver necessidade de padrões decorativos, texturas, animações ou composições mais específicas.
- Centralize tokens de design compartilhados.
- Evite duplicar regras globais em diversos componentes.
- Não misture convenções de configuração do Tailwind v3 com v4 sem verificar a compatibilidade.
- Não adicione bibliotecas de componentes visuais sem necessidade.

O resultado deve ter estilos organizados, legíveis e coerentes.

## 9. Responsividade

Implemente a interface com abordagem mobile-first.

A página deve funcionar em:

- Celulares pequenos.
- Celulares grandes.
- Tablets.
- Notebooks.
- Monitores desktop.

Não basta reduzir o tamanho dos elementos de desktop.

Adapte a composição para cada largura:

- Reorganize colunas quando necessário.
- Ajuste o enquadramento das imagens.
- Redimensione títulos sem prejudicar a hierarquia.
- Reposicione ilustrações decorativas.
- Evite sobreposição de conteúdo importante.
- Mantenha formulários utilizáveis por toque.
- Evite rolagem horizontal involuntária.

Não remova elementos importantes no mobile apenas para simplificar a implementação. Reorganize-os de forma apropriada.

## 10. Acessibilidade e usabilidade

- Utilize elementos HTML semânticos.
- Associe labels aos campos de formulário.
- Mantenha indicadores de foco visíveis.
- Garanta navegação por teclado.
- Utilize contraste adequado.
- Forneça textos alternativos úteis para imagens informativas.
- Utilize texto alternativo vazio em imagens estritamente decorativas.
- Garanta que botões tenham nomes compreensíveis.
- Não dependa exclusivamente de cores para comunicar estados.
- Respeite `prefers-reduced-motion`.
- Evite animações que impeçam a leitura ou prejudiquem a navegação.

A estética artesanal não deve comprometer a legibilidade ou a acessibilidade.

## 11. Animações e interações

As animações devem reforçar a experiência e não competir com o conteúdo.

Prefira transições sutis e movimentos com propósito.

- Evite animações excessivas em elementos de texto.
- Evite efeitos de entrada que atrasem o acesso às informações.
- Não introduza bibliotecas de animação sem justificativa.
- Não implemente animações complexas apenas para reproduzir um efeito decorativo secundário.
- Garanta que as interações continuem funcionando com movimento reduzido.
- Evite movimentações que provoquem mudanças inesperadas de layout.

Se uma interação for solicitada, implemente seu comportamento funcional e seu estado visual correspondente.

## 12. Conteúdo e informações do casamento

Utilize somente as informações confirmadas pelo usuário ou existentes em fontes do projeto.

Informações atualmente documentadas:

- Noivo: João Henrick Camargos.
- Noiva: Vitoria Serpa Fernandes.
- Data prevista: 6 de fevereiro de 2027.
- Horário informado: 00:00, ainda sujeito à confirmação.
- Local: não definido.

Não invente endereço, horário, histórias pessoais, contatos ou detalhes da cerimônia.

Quando uma informação estiver pendente, mantenha-a configurável ou utilize um texto provisório claramente identificável.

Não apresente dados fictícios como se fossem informações reais do casamento.

## 13. Formulários e integrações

A confirmação de presença deve oferecer uma experiência clara e confiável.

Quando solicitado, implemente:

- Campo para nome.
- Resposta de aceitação ou recusa do convite.
- Campo opcional para mensagem.
- Validação dos dados.
- Feedback de carregamento.
- Tratamento de falhas.
- Confirmação após o envio.

Não afirme que os dados foram persistidos se não houver integração funcional.

Antes de implementar banco de dados, APIs ou serviços externos, examine a arquitetura existente e solicite esclarecimentos apenas quando faltar uma informação essencial.

Não exponha segredos no código do cliente.

Não coloque credenciais em arquivos versionados. Utilize variáveis de ambiente apropriadas e valide dados também no servidor.

Não adicione integrações externas por iniciativa própria sem necessidade para a tarefa solicitada.

## 14. Desempenho

- Utilize `next/image` para imagens de conteúdo quando apropriado.
- Defina dimensões ou proporções para evitar mudanças inesperadas de layout.
- Priorize o carregamento da imagem principal quando ela for essencial para a primeira renderização.
- Evite carregar antecipadamente imagens que não sejam necessárias.
- Utilize carregamento tardio para imagens fora da área inicial quando apropriado.
- Evite repetir arquivos grandes desnecessariamente.
- Prefira fontes locais configuradas corretamente.
- Evite JavaScript no cliente sem necessidade.
- Não introduza dependências pesadas para efeitos simples.

Verifique o comportamento visual depois de aplicar otimizações, pois enquadramento e transparência podem ser importantes para os assets.

## 15. Metadados e idioma

Configure o documento em português brasileiro (`pt-BR`).

Substitua os metadados genéricos do template por informações coerentes com o site de casamento.

Os metadados devem ser definidos de forma centralizada quando possível e incluir um título e uma descrição apropriados.

Não invente URLs públicas, imagens de compartilhamento hospedadas ou outros dados que ainda não existam.

## 16. Qualidade e validação

Após alterações relevantes:

1. Verifique os erros de TypeScript.
2. Execute o lint usando o script disponível no projeto.
3. Execute o build quando aplicável.
4. Corrija os problemas introduzidos pela implementação.
5. Inspecione a interface em diferentes larguras de tela quando houver ferramentas disponíveis.
6. Verifique os caminhos dos assets e o funcionamento das interações afetadas.

Não declare uma verificação concluída se ela não foi executada.

Se um comando falhar por causa do ambiente ou de um problema preexistente, informe o erro e diferencie-o dos problemas introduzidos pela alteração.

## 17. Controle de escopo e Git

- Não sobrescreva alterações existentes do usuário.
- Não descarte arquivos modificados.
- Não execute comandos destrutivos sem autorização.
- Não altere a branch atual por iniciativa própria.
- Não crie commits automaticamente, a menos que solicitado.
- Não adicione arquivos de build ou dependências geradas ao controle de versão quando estiverem corretamente ignorados.
- Não altere o `.gitignore` sem uma necessidade concreta.

Antes de realizar mudanças abrangentes, avalie seu impacto e prefira implementações incrementais.

## 18. Comunicação com o usuário

Ao concluir uma tarefa, apresente:

1. Resumo das alterações.
2. Principais arquivos criados ou modificados.
3. Decisões técnicas ou visuais relevantes.
4. Verificações executadas e seus resultados.
5. Pendências, limitações ou informações que ainda precisam ser fornecidas.

Não afirme que a interface está perfeita ou que foi testada visualmente se isso não ocorreu.

Se o pedido estiver suficientemente claro, execute-o sem interromper o trabalho com perguntas desnecessárias.

Se faltar uma informação essencial que possa alterar significativamente o resultado, faça uma pergunta objetiva antes de tomar uma decisão irreversível.

## 19. Regra final

A prioridade do projeto é construir uma experiência personalizada, visualmente fiel à identidade do casamento e tecnicamente sólida.

Em caso de conflito entre uma solução genérica e uma solução que preserve a identidade visual do projeto, prefira a segunda, desde que mantenha acessibilidade, responsividade, desempenho e qualidade de código.

Implemente apenas o escopo solicitado, respeite os assets existentes e evolua o site de forma incremental.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Ignore routine debugging and unverified changes. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Keep a qualifying candidate through the reporting pass even if you resolve or work around it. A successful fix changes the report outcome; it does not erase the friction that qualified it.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `node node_modules/next/dist/bin/next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->
