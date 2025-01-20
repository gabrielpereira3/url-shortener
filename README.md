# URL Shortener API

URL Shortener é uma API RESTful construída com **Node.js** e **NestJS** para encurtar URLs. O sistema permite que usuários autenticados e não autenticados encurtem URLs, e fornece funcionalidades avançadas para usuários autenticados, como listagem, edição e exclusão de URLs encurtadas.

---

## 🌐 API Disponível no Google Cloud Platform

A API do URL Shortener está atualmente hospedada no **Google Cloud Platform** e pode ser acessada através do seguinte endereço:

- **Base URL da API**: [http://34.127.107.109:3000](http://34.127.107.109:3000)

### 📄 Documentação Swagger

A documentação da API, incluindo todas as rotas e detalhes de uso, está disponível através do Swagger no seguinte endereço:

- **Swagger UI**: [http://34.127.107.109:3000/api/docs](http://34.127.107.109:3000/api/docs)

Utilize a documentação para explorar as funcionalidades da API e testar as rotas diretamente na interface do Swagger.


---

## **Funcionalidades**

- **Encurtamento de URLs:**
  - Permite encurtar URLs para até 6 caracteres.
  - Exemplo:
    - Entrada: `https://example.com/long-url`
    - Saída: `http://localhost/aZbKq7`

- **Autenticação de Usuários:**
  - Cadastro de novos usuários.
  - Login com autenticação via Bearer Token (JWT).

- **Gerenciamento de URLs:**
  - Listar URLs encurtadas pelo usuário (autenticado), incluindo contagem de cliques.
  - Editar a URL original de URLs encurtadas.
  - Excluir URLs logicamente (soft delete).

- **Redirecionamento e Contabilização:**
  - Redireciona para a URL original ao acessar a URL encurtada.
  - Contabiliza o número de acessos.

---

## **Como Rodar o Projeto**

### **Pré-requisitos**

- **Node.js**: Última versão LTS (>= 18.x).
- **Docker e Docker Compose**: Para rodar o ambiente completo localmente.
- **Git**: Para clonar o repositório.

### **Instalação**

1. Clone o repositório:

   ```bash
   git clone https://github.com/gabrielpereira3/url-shortener.git
   cd url-shortener
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:

   - Crie um arquivo `.env` na raiz do projeto.
   - Copie o conteúdo de `.env.example` fazendo as modificações necessárias.

4. Suba o ambiente com Docker Compose:

   ```bash
   docker-compose up --build
   ```

5. Acesse a API em: `http://localhost:3000`

---

## **Documentação da API**

A API está documentada com **Swagger**. Para acessar a documentação:

1. Suba o ambiente local.
2. Abra o navegador e acesse: `http://localhost:3000/api/docs`.

---

## **Endpoints**

### **Autenticação**

- **POST /auth/login**: Faz login e retorna um token JWT.
  - **Corpo da Requisição:**
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
  - **Resposta:**
    ```json
    {
      "accessToken": "jwt_token"
    }
    ```

### **Usuários**

- **POST /users/create**: Cria um novo usuário.
  - **Corpo da Requisição:**
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
  - **Resposta:**
    ```json
    {
      "userId": "uuid",
      "email": "user@example.com",
      "createdAt": "2025-01-19T20:00:00.000Z"
    }
    ```

### **URLs**

- **POST /urls/shorten**: Encurta uma URL.
  - **Corpo da Requisição:**
    ```json
    {
      "longUrl": "https://example.com/long-url"
    }
    ```
  - **Resposta:**
    ```json
    {
      "urlId": "uuid",
      "longUrl": "https://example.com/long-url",
      "shortUrl": "http://localhost/aZbKq7",
      "createdAt": "2025-01-19T20:00:00.000Z"
    }
    ```

- **GET /urls/listByUser**: Lista URLs encurtadas do usuário autenticado.
  - **Cabeçalho:**
    ```json
    {
      "Authorization": "Bearer jwt_token"
    }
    ```
  - **Resposta:**
    ```json
    [
      {
        "urlId": "uuid",
        "longUrl": "https://example.com",
        "shortUrl": "http://localhost/aZbKq7",
        "clicks": 10
      }
    ]
    ```

- **PATCH /urls/update/:token**: Atualiza a URL original de uma URL encurtada.
  - **Corpo da Requisição:**
    ```json
    {
      "newLongUrl": "https://newexample.com"
    }
    ```

- **DELETE /urls/delete/:token**: Exclui uma URL encurtada logicamente.

- **GET /:token**: Redireciona para a URL original e contabiliza o acesso.

---

## **Testes**

Execute os testes unitários com:

```bash
npm run test
```

---

## **Pontos de Melhoria**

1. **Banco de Dados Distribuído:**
   - Utilizar um banco de dados distribuído para alta disponibilidade e escalabilidade.

2. **Cache:**
   - Implementar um sistema de cache (Redis) para melhorar a performance em URLs acessadas frequentemente.

3. **Balanceamento de Carga:**
   - Adicionar um balanceador de carga (NGINX ou AWS ELB) para distribuir requisições entre múltiplas instâncias.

4. **Filas Assíncronas:**
   - Processar tarefas como contagem de cliques de forma assíncrona usando RabbitMQ ou Kafka.

---

## **Autor**

[Gabriel Pereira Soares](https://github.com/gabrielpereira3)

---

## **Licença**

Este projeto está licenciado sob a Licença MIT.

