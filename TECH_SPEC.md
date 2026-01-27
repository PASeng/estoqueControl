# Documento de Especificação Técnica — Projeto Kamilla Intelligence

## 1. Visão Geral do Projeto
Desenvolvimento de uma aplicação web/mobile para Gestão de Consignação de Joias e Semijoias. O sistema controla o fluxo de mercadorias entre o estoque central e as vendedoras consignadas (externas). O diferencial da aplicação é o uso de Inteligência Artificial para cadastro de produtos (visão computacional) e para análise de desempenho de vendas (relatórios de fechamento).

**Objetivo de Negócio:** maximizar a circulação de mercadorias, visto que há mais vendedoras cadastradas do que maletas disponíveis. O sistema deve priorizar a logística e a inteligência de vendas.

## 2. Requisitos de Infraestrutura
- **Entrega:** totalmente containerizada para fácil deploy.
- **Container:** Docker e Docker Compose.
- **Banco de Dados:** PostgreSQL.
- **Backend:** preferência por stack compatível com bibliotecas de IA (ex: Python/FastAPI ou Node.js).
- **Frontend:** aplicação Web Responsiva (PWA) ou Mobile Híbrido.
- **Ambiente alvo:** Debian 12 em VM (Proxmox).

## 3. Módulos e Funcionalidades

### 3.1. Navegação e UI (Interface do Usuário)
- **Estilo visual:** design clean, fundo claro, uso de cards com sombras suaves para separar informações.
- **Menu de navegação:** barra fixa no rodapé (Bottom Navigation Bar) com ícones de acesso rápido:
  - **Início:** Dashboard.
  - **Equipe:** Gestão de vendedoras.
  - **Estoque/Acervo:** Gestão de produtos.
  - **Nova Maleta/Maletas:** Controle de consignação.
  - **Retorno/Fechamento:** Processo de devolução.

### 3.2. Dashboard Principal (Tela Inicial)
Painel gerencial para visão rápida do negócio:
- **Cabeçalho:** nome do sistema e botão de ação rápida **“Gerar Relatório PDF”** (resumo gerencial).
- **Status de IA:** card de destaque informando se há novas análises de fechamento prontas (ex: “Pronto para nova análise”).
- **KPIs (Indicadores):**
  - **Região Líder:** qual zona geográfica está vendendo mais.
  - **Vendas Mês:** valor monetário acumulado no mês atual.
- **Gráficos de tendência:** visualização de desempenho (semana a semana, mês a mês).
- **Próximos fechamentos:** lista das maletas próximas da data de recolhimento (vencimento), alertando sobre a necessidade de rotação.

### 3.3. Gestão de Estoque (Acervo) com IA
Módulo para cadastro e controle de peças (ouro, prata, banhados).
- **Identificação:** cada produto deve ter um ID único gerado automaticamente (incremental ou hash) e campo para Código de Barras.
- **Cadastro via IA:**
  1. Usuário tira/envia uma foto da peça (ex: anel cravejado).
  2. A IA processa a imagem e verifica no banco se o item já existe (reconhecimento de padrão).
  3. Cenários:
     - **Existe:** o sistema informa a existência e sugere apenas incrementar o estoque.
     - **Novo:** a IA sugere descrição e categoria; o usuário confirma e adiciona o preço.

### 3.4. Gestão de Equipe (Vendedoras)
Cadastro completo das consignadas.
- **Dados:** nome, CPF, endereço.
- **Geolocalização:** campo “Ponto GPS”. Ao clicar, abre o app de mapas (Google Maps/Waze) para facilitar rota de entrega/coleta.
- **Documentos:** upload de foto (RG, CPF ou comprovante de residência) vinculado ao perfil.
- **Histórico:** visualização de maletas já retiradas e histórico financeiro.

### 3.5. Gestão de Maletas e Consignação
Este é o “coração” do sistema de rodízio.
- **Montagem:** interface para associar itens do estoque a uma maleta (ID ex: MA-001).
- **Status da maleta:**
  - **Disponível:** no escritório.
  - **Em campo:** com vendedora (atrelada a um ID de vendedora).
  - **Aguardando:** pronta, mas não retirada.
- **Definição de vencimento:** ao entregar uma maleta, define-se a **Data de Fechamento** obrigatória para garantir rotação do ativo.

### 3.6. Processo de Fechamento (Retorno e IA)
Fluxo para devolução de maleta.
- **Conferência:** usuário bipa ou seleciona os itens que retornaram.
- **Cálculo:** o sistema calcula automaticamente o vendido (**Enviado – Retornado = Vendido**).
- **Relatório de IA (feedback):**
  - Ao concluir o fechamento, uma IA analisa a transação.
  - **Output esperado:** texto descritivo com tendências.
  - **Exemplo:** “Neste ciclo, a vendedora focou em anéis de ouro, mas devolveu todas as peças de prata. Sugere-se enviar menos prata na próxima maleta.”

## 4. Estrutura de Dados e Lógica
- **Rastreabilidade:** o banco deve permitir “matchs” complexos. Precisamos saber:
  - Onde a maleta MA-001 esteve nos últimos 6 meses.
  - Quais produtos específicos têm maior saída com a Vendedora X.
- **Estoque:** suportar movimentação rápida (entrada e saída de consignação não é baixa de estoque; é transferência de custódia). A baixa real ocorre na venda confirmada no fechamento.
