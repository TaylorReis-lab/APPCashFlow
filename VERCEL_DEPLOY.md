# 🚀 Como Fazer o Deploy do FINEXA no Vercel

O Vercel é excelente para hospedar tanto o seu App (Frontend React/Vite) quanto a sua API (Node/Express). Abaixo está o passo a passo completo para colocar o **FINEXA** no ar gratuitamente.

Como nosso projeto tem duas pastas (`/api` e o Frontend na raiz), você criará **dois projetos separados** dentro do painel do Vercel.

---

## ☁️ 1. Preparando o Banco de Dados (MongoDB Atlas)
O Vercel não roda bancos de dados locais (como nosso Docker/MongoDB local). Você precisa criar um banco em nuvem.
1. Crie uma conta gratuita no [MongoDB Atlas](https://www.mongodb.com/atlas/database).
2. Crie um novo Cluster (pode ser o Free "M0").
3. No menu "Database Access", crie um usuário (ex: `admin`) e anote a senha.
4. No menu "Network Access", clique em `Add IP Address` e selecione `Allow Access from Anywhere` (0.0.0.0/0).
5. No cluster, clique em "Connect", escolha "Drivers" e copie a **String de Conexão (URI)**.
   *Vai ser algo como:* `mongodb+srv://admin:<sua_senha>@cluster0.xxxxx.mongodb.net/finexa?retryWrites=true&w=majority`

---

## ⚙️ 2. Subindo a API (Backend) no Vercel

1. Faça o upload de todo o seu código para o **GitHub** (crie um repositório e faça o push).
2. Acesse o [Vercel](https://vercel.com) e conecte com o seu GitHub.
3. Clique em **"Add New..."** > **"Project"**.
4. Importe o seu repositório recém-criado.
5. Na tela "Configure Project":
   - **Project Name:** `finexa-api`
   - **Framework Preset:** `Other` (já configuramos o `vercel.json` na pasta).
   - **Root Directory:** Clique em `Edit` e selecione a pasta **`api`**.
   - **Environment Variables:** Adicione:
     - Chave: `MONGODB_URI` / Valor: `[sua_string_de_conexao_do_atlas_aqui]`
     - Chave: `JWT_SECRET` / Valor: `sua_chave_secreta_super_segura_aqui`
6. Clique em **Deploy**.
7. Após terminar, você ganhará uma URL como: `https://finexa-api.vercel.app`. **Guarde esta URL!** Você vai precisar dela.
*(Você pode testar acessando: `https://finexa-api.vercel.app/api/health`)*

---

## 📱 3. Subindo o App (Frontend) no Vercel

1. Volte ao painel inicial do Vercel e clique em **"Add New..."** > **"Project"**.
2. Importe **o mesmo repositório do GitHub** novamente.
3. Na tela "Configure Project":
   - **Project Name:** `finexa-app`
   - **Framework Preset:** `Vite` (o Vercel detecta automaticamente).
   - **Root Directory:** Deixe como está (raiz / `.` ).
   - **Environment Variables:** Adicione a variável apontando para a sua nova API:
     - Chave: `VITE_API_URL`
     - Valor: `[SUA_URL_DA_API_AQUI]/api` *(ex: `https://finexa-api.vercel.app/api`)*
4. Clique em **Deploy**.

---

### 🎉 Pronto!

Agora seu **Backend e Banco de Dados** estão rodando em nuvem (Serverless Express + MongoDB Atlas) e o seu **Frontend** está público e consumindo a sua própria API.

Se quiser usar o app no celular (como ensinamos no tutorial do Capacitor / `HOW_TO_BUILD_APK.md`), basta colocar no arquivo `.env` a mesma URL de Produção do Vercel (`VITE_API_URL=https://finexa-api.vercel.app/api`) antes de gerar o APK pelo Android Studio!
