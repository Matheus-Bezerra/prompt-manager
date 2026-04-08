# Rocketseat Prompt Manager ✨

<p align="center">
 <a href="#tecnologias">Tecnologias</a> •
 <a href="#preview">Preview</a> •
 <a href="#rodar">Rodar o projeto</a> •
 <a href="#server-actions">Server Actions</a> •
 <a href="#colaboradores">Colaboradores</a> •
 <a href="#contribuicao">Contribuição</a>
</p>

<p align="center">
    <b>Aplicação full stack para gerenciar prompts: criar, listar, buscar, editar, excluir e copiar o conteúdo para a área de transferência. Interface com sidebar responsiva, formulários validados e persistência em PostgreSQL.</b>
</p>

## 🎬 Preview

<p align="center">
  <img src="./docs/demo.gif" alt="Demonstração do Rocketseat Prompt Manager" />
</p>

## 💻 Tecnologias

### App & dados

- [Next.js 16](https://nextjs.org/) (App Router, Server Actions)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma 7](https://www.prisma.io/) + [PostgreSQL](https://www.postgresql.org/) (`pg`, `@prisma/adapter-pg`)
- [Zod](https://zod.dev/) (validação)
- [Docker](https://www.docker.com/) (PostgreSQL local via `docker-compose.yml`)

### UI & formulários

- [Tailwind CSS 4](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/) + padrão [shadcn/ui](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/) + [@hookform/resolvers](https://github.com/react-hook-form/resolvers)
- [nuqs](https://nuqs.47ng.com/) (estado na URL)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [Lucide React](https://lucide.dev/) (ícones)
- [Motion](https://motion.dev/) (animações)
- [Sonner](https://sonner.emilkowal.ski/) (toasts)
- [class-variance-authority](https://cva.style/docs), [clsx](https://github.com/lukeed/clsx), [tailwind-merge](https://github.com/dcastil/tailwind-merge)

### Qualidade & testes

- [Biome](https://biomejs.dev/) + [ESLint](https://eslint.org/) (`eslint-config-next`)
- [Jest](https://jestjs.io/) + [Testing Library](https://testing-library.com/)
- [Playwright](https://playwright.dev/) (E2E)
- [@faker-js/faker](https://fakerjs.dev/) (dados de teste)

## 🚀 Rodar o projeto

### Pré-requisitos

- [Node.js 20+](https://nodejs.org/) (recomendado; o projeto usa `@types/node` 20)
- [npm](https://www.npmjs.com/) ou [pnpm](https://pnpm.io/) / [Yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (PostgreSQL)
- [Git](https://git-scm.com/)

### Clonando o projeto

```bash
git clone https://github.com/seu-usuario/rocketseat-prompt-manager.git
cd rocketseat-prompt-manager
```

### Banco de dados

Na raiz do repositório:

```bash
docker compose up -d
```

Isso sobe o Postgres em `localhost:5432` (e um segundo serviço na porta `5433` para E2E, se você usar os testes end-to-end).

### Variáveis de ambiente

Crie um arquivo `.env` na raiz com a URL do banco, por exemplo:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/rocketseat_prompt_manager"
```

(Ajuste usuário, senha e host se você alterou o `docker-compose.yml`.)

### Instalação, migrations e app

```bash
npm install
npm run db:generate
npm run db:migrate
```

Opcional — popular dados iniciais:

```bash
npm run db:seed
```

Subir o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Scripts úteis

| Comando | Descrição |
|--------|-----------|
| `npm run dev` | Servidor Next.js em modo desenvolvimento |
| `npm run build` / `npm start` | Build e produção |
| `npm run lint` | Biome + ESLint |
| `npm run format` / `npm run check` | Formatação e check do Biome |
| `npm test` | Testes unitários (Jest) |
| `npm run test:e2e` | Testes E2E (Playwright) |
| `npm run db:studio` | Prisma Studio |

## 📍 Server Actions

O projeto não expõe uma API REST pública; a mutação e a leitura passam por [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) do Next.js (`src/app/actions/prompt.actions.ts`).

| Função | Descrição |
|--------|-----------|
| `createPromptAction` | Cria um prompt (`title`, `content`); título único no banco |
| `updatePromptAction` | Atualiza `title` e `content` por `id` |
| `deletePromptAction` | Remove o prompt pelo `id` |
| `searchPromptAction` | Busca por termo (`FormData` com campo `q`) |

**Exemplo de payload para criação (DTO validado com Zod):**

```json
{
  "title": "Resumo de reunião",
  "content": "Você é um assistente que resume notas em tópicos..."
}
```

**Modelo no banco (Prisma):** `Prompt` com `id`, `title` (único), `content`, `createdAt`, `updatedAt`.

## 🤝 Colaboradores

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/seu-usuario">
        <img src="https://avatars.githubusercontent.com/u/78742961?s=400&u=c88bb8c0c4246cfed678cc8c5a2bbf043a20ed0e&v=4" width="100px;" alt="Seu Nome"/><br>
        <sub>
          <b>Seu Nome</b>
        </sub>
      </a>
    </td>
  </tr>
</table>

## 📫 Contribuição

1. `git clone https://github.com/seu-usuario/rocketseat-prompt-manager.git`
2. `git checkout -b feature/NOME_DA_FEATURE`
3. Siga o padrão de commits do time
4. Abra um Pull Request explicando a feature ou correção. Se houver mudança visual, anexe prints ou atualize o GIF em `docs/demo.gif` e aguarde a revisão

### Documentações úteis

- [Como criar um Pull Request](https://docs.github.com/pt/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)
- [Padrão de commits (iuricode)](https://github.com/iuricode/padroes-de-commits)
- [Documentação do Next.js](https://nextjs.org/docs) (esta versão pode ter diferenças em relação a tutoriais antigos; confira a doc instalada em `node_modules/next/dist/docs/` quando necessário)
