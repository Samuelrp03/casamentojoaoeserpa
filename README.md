# Casamento João & Serpa

Site oficial do casamento de João Henrique Camargos e Vitoria Serpa Fernandes, desenvolvido para apresentar o casal, compartilhar informações sobre a cerimônia e permitir que os convidados confirmem sua presença.

## 1. Objetivo do projeto

Desenvolver uma experiência web personalizada para o casamento, com uma identidade visual romântica, artesanal e descontraída.

O site deve funcionar como um convite digital interativo, reunindo:

- Apresentação visual do casal.
- História e informações sobre os noivos.
- Data e local do casamento.
- Confirmação de presença (RSVP).
- Campo para mensagens dos convidados.
- Elementos ilustrados que representem o casal e seus animais de estimação.

As seções devem ser implementadas progressivamente, mantendo consistência visual, acessibilidade, responsividade e facilidade de manutenção.

## 2. Tecnologias

- **Next.js 16.4:** framework web com App Router.
- **React 19.3:** biblioteca para construção da interface.
- **TypeScript 5:** tipagem estática.
- **Tailwind CSS v4:** estilização.
- **Turbopack:** ferramenta de desenvolvimento integrada ao Next.js.

As versões acima representam a configuração inicial documentada do projeto. Consulte `package.json` antes de adicionar dependências ou alterar configurações.

## 3. Identidade visual

A referência visual do projeto utiliza uma combinação de fotografia, ilustração, texturas e tipografia editorial.

### Direção de arte

- Romântica, artesanal e acolhedora.
- Elegante sem parecer excessivamente formal.
- Descontraída, com elementos que expressem a personalidade do casal.
- Inspirada em convites personalizados, colagens e trabalhos manuais.
- Composição que mistura fotografias reais e ilustrações autorais.

### Paleta e tipografia

A paleta deve ser extraída da referência visual e dos assets existentes. Priorize tons de creme, bege, marrom, azul e laranja, utilizando cores complementares apenas quando fizerem sentido no conjunto.

Fontes disponíveis:

- `Afacad`: textos, formulários e elementos de interface.
- `Italiana`: títulos e elementos editoriais.
- `La Belle Aurore`: frases manuscritas e detalhes decorativos.

Não substitua essas fontes por fontes genéricas sem uma justificativa visual ou técnica.

### Composição

- Fotografias grandes e expressivas na apresentação inicial.
- Títulos com aparência editorial.
- Elementos decorativos inspirados em colagens e materiais impressos.
- Ilustrações do casal e dos pets integradas à composição.
- Texturas discretas no fundo das seções.
- Espaçamento generoso e hierarquia visual clara.

A referência visual é uma direção de arte, não uma justificativa para reproduzir rigidamente um layout que não funcione em telas menores.

## 4. Assets disponíveis

Os arquivos visuais existentes devem ser reutilizados sempre que forem adequados.

### Fontes

- `public/Assets/Fonts/Afacad/`
- `public/Assets/Fonts/Italiana/Italiana-Regular.ttf`
- `public/Assets/Fonts/La Belle Aurore/LaBelleAurore-Regular.ttf`

### Imagens

- `public/Assets/Images/Hero.png`
- `public/Assets/Images/Entrega Serpa Família Fundo Transparente.png`

### Texturas

- `public/Assets/Textures/Padrão brinde 4k.png`

### Elementos decorativos e ilustrações

- `public/Assets/Arrow down.svg`
- `public/Assets/Lã.png`
- `public/Assets/osso.png`
- `public/Assets/pata.png`
- `public/Assets/Summer.png`
- `public/Assets/Tapioca.png`

Antes de utilizar um arquivo, confira seu conteúdo, suas dimensões e sua finalidade. Não presuma que o nome de um asset descreve completamente sua aparência.

Os caminhos e nomes dos arquivos devem ser preservados, respeitando maiúsculas, minúsculas e espaços.

## 5. Estrutura planejada da página inicial

A Home deverá evoluir para uma página única com navegação por rolagem e seções visualmente integradas.

1. **Hero:** fotografia principal, nomes dos noivos, frase de abertura e indicação para rolar a página.
2. **Apresentação dos noivos:** textos biográficos e ilustrações personalizadas.
3. **Informações do casamento:** data, horário e local, com espaço para integração com mapa.
4. **Confirmação de presença:** formulário RSVP com nome, resposta ao convite e mensagem opcional.
5. **Elementos complementares:** ilustrações, pets e outros detalhes que enriqueçam a experiência.

Essa estrutura é um planejamento inicial. Os componentes devem ser criados somente quando a etapa correspondente for solicitada ou aprovada.

### Informações iniciais

- Noivo: João Henrique Camargos.
- Noiva: Vitoria Serpa Fernandes.
- Data prevista: 6 de fevereiro de 2027.
- Horário informado: 00:00, sujeito à confirmação.
- Local: ainda não definido.

Não invente endereço, horário definitivo, informações pessoais ou conteúdo biográfico. Utilize os dados fornecidos e mantenha campos provisórios quando necessário.

## 6. Confirmação de presença (RSVP)

O formulário deverá permitir que o convidado:

- Informe seu nome.
- Aceite ou decline o convite.
- Escreva uma mensagem opcional para o casal.
- Envie sua resposta e receba um retorno visual claro.

A implementação deverá prever validação de campos, estados de carregamento, tratamento de erros e confirmação de envio.

O armazenamento persistente e a integração com banco de dados serão definidos em uma etapa específica. Não simule que os dados foram salvos quando ainda não existir integração funcional.

## 7. Arquitetura e organização

Utilize o App Router do Next.js e mantenha a página organizada em componentes reutilizáveis.

Estrutura sugerida, a ser adotada conforme a implementação evoluir:

- `app/`: rotas, layout global e estilos.
- `components/`: componentes compartilhados e seções da página.
- `public/Assets/`: fontes, imagens, ilustrações e texturas.
- `docs/`: documentação técnica e decisões de design.

Evite criar abstrações desnecessárias. A estrutura deve refletir a complexidade real do projeto.

## 8. Responsividade e acessibilidade

O site deve funcionar em dispositivos móveis, tablets e computadores.

- Desenvolver com abordagem mobile-first.
- Evitar rolagem horizontal indevida.
- Adaptar imagens, textos, formulários e ilustrações a diferentes larguras.
- Manter contraste adequado entre texto e fundo.
- Utilizar HTML semântico e rótulos acessíveis nos formulários.
- Permitir navegação por teclado e foco visível.
- Fornecer textos alternativos apropriados para imagens relevantes.
- Respeitar a preferência por redução de movimento quando houver animações.

## 9. Desempenho e qualidade

- Preferir o componente `Image` do Next.js para imagens de conteúdo.
- Otimizar o carregamento de imagens grandes.
- Utilizar fontes locais de forma eficiente.
- Evitar bibliotecas adicionais sem necessidade.
- Preservar a tipagem do TypeScript.
- Executar verificações de lint, tipos e build quando aplicáveis.
- Não considerar uma implementação concluída sem verificar os resultados.

## 10. Execução local

Instale as dependências:

```bash
npm install
```

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

Execute as verificações disponibilizadas pelo projeto:

```bash
npm run lint
npm run build
```

Consulte `package.json` para confirmar os scripts disponíveis.

## 11. Estado atual

O repositório parte do scaffold inicial do Next.js. Os assets do casamento estão disponíveis em `public/Assets`, mas a interface temática ainda precisa ser implementada.

O desenvolvimento deve ocorrer incrementalmente, priorizando a fidelidade visual à referência, a qualidade do código e a preservação dos arquivos existentes.

## 12. Princípio de desenvolvimento

O objetivo não é construir um template genérico de casamento. O objetivo é criar uma experiência personalizada que represente a identidade do casal e transforme o convite digital em uma extensão visual da celebração.

Cada nova seção deve contribuir para essa experiência sem comprometer usabilidade, desempenho ou consistência.
