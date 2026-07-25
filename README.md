# 🍔 SOS.LANCHES Delivery — Sistema White Label SaaS

Sistema de delivery profissional inspirado no iFood, Anota AI, Pedido.ai e Goomer, desenvolvido sob medida para o **SOS.LANCHES Delivery** em Londrina (Região Norte/PR) com arquitetura **Multi-Tenant White Label**.

---

## 🛠 Stack Tecnológica

- **Framework**: Next.js 15 (App Router)
- **UI & Library**: React 19, TypeScript
- **Styling**: Tailwind CSS v4, Lucide Icons, Framer Motion, Glassmorphism
- **Database & ORM**: PostgreSQL, Prisma ORM, Supabase Realtime
- **State & Workflow**: React Context with LocalStorage sync
- **Deployment**: Vercel Ready

---

## 🔥 Principais Funcionalidades

### 📱 **Loja Virtual (Storefront)**
- **Home & Hero Banner**: Slider com promoções da casa, categorias horizontais, produtos em destaque e avaliações dos clientes de Londrina.
- **Cardápio Completo**: Filtros por categoria, itens em promoção, mais vendidos, favoritos e ordenação por preço.
- **Personalizador de Lanches**: Escolha do pão, queijos e adicionais com validação min/max, informações nutricionais e campo de observações.
- **Carrinho & Checkout**: Cupons de desconto (`SOS10`, `FRETEGRATIS`), taxa de entrega por bairro de Londrina, pagamento via **PIX Instantâneo**, Cartão ou Dinheiro c/ Troco.
- **Rastreamento em Tempo Real**: Linha do tempo animada (Recebido ➔ Na Cozinha ➔ Saiu para Entrega ➔ Entregue).
- **Área do Cliente**: Saldo de pontos de fidelidade com resgate de prêmios e histórico com opção de **Repetir Pedido**.

---

### ⚙️ **Painel Administrativo & Operacional**
- **Dashboard Executivo**: Faturamento bruto, lucro estimado, ticket médio, entregadores online e resumo de vendas.
- **Quadro Kanban de Pedidos**: Movimentação visual de status, alertas sonoros de novos pedidos e **Gerador de Comanda Térmica (58mm e 80mm ESC/POS)**.
- **Cozinha (KDS)**: Tela inteira para a cozinha com temporizador de urgência colorido e atalhos rápidos.
- **Modo Garçom**: Mapa de mesas (Mesas 1 a 12), abertura de comanda, lançamento de produtos e fechamento de conta.
- **Módulo de Inteligência Artificial**: Motor de IA para recomendação de promoções, previsão de demanda nos fins de semana e reengajamento de clientes.
- **Financeiro**: Divisão de vendas por forma de pagamento e exportação de relatórios em CSV.

---

## 🚀 Como Rodar o Projeto

```bash
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev

# Compilar para produção
npm run build
```

---

## 🔗 Repositório no GitHub
- GitHub: [https://github.com/mslol21/teste-sos.git](https://github.com/mslol21/teste-sos.git)
