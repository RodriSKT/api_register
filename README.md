# Hospital de Oftalmologia

Projeto full-stack usando:

- Front-end: HTML, CSS e JavaScript puro
- Back-end: Node.js + Express
- Persistência inicial: arquivo `data/appointments.json`
- API REST para médicos, especialidades, disponibilidades e agendamentos

## Como executar

1. Instale o Node.js 18 ou superior.
2. Abra o terminal na pasta do projeto.
3. Execute:

```bash
npm install
npm start
```

4. Acesse:

`http://localhost:3000`

Para desenvolvimento, use:

```bash
npm run dev
```

## Principais endpoints

- `GET /api/doctors`
- `GET /api/doctors?specialty=Catarata`
- `GET /api/specialties`
- `GET /api/doctors/:id/availability`
- `POST /api/appointments`

## Onde personalizar

- Médicos e horários: `server.js`
- Número do WhatsApp: procure por `5599999999999` em `public/index.html`
- Identidade visual: `public/css/style.css`
- Comportamento do site: `public/js/app.js`

## Próximas evoluções recomendadas

Para produção, substituir o arquivo JSON por PostgreSQL/MySQL, adicionar painel administrativo, autenticação, confirmação por WhatsApp/e-mail, bloqueio de horários, LGPD, validação de dados e controle de acesso.
