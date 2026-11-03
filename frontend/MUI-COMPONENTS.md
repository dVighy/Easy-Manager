# Material UI — Easy Manager

## Dependências adicionadas

- `@mui/material`: componentes de interface.
- `@mui/icons-material`: ícones oficiais.
- `@emotion/react` e `@emotion/styled`: engine de estilos exigida pelo Material UI.

## Instalação

Na pasta `frontend`:

```bash
npm install
npm run dev
```

## Componentes centralizados

O arquivo `src/components/ui/index.ts` exporta os componentes MUI e ícones que formam a base da interface. Exemplo:

```tsx
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  DashboardIcon,
} from './components/ui';
```

Ajuste o caminho relativo conforme a localização do arquivo que estiver usando.

## Tema

O tema global está em `src/theme.ts` e já é aplicado em `src/main.tsx` com `ThemeProvider` e `CssBaseline`. A paleta é apenas uma base inicial e pode ser ajustada à identidade visual aprovada para o sistema.

## Correções incluídas

- `MenuBar.ts` foi renomeado para `MenuBar.tsx`, pois contém JSX.
- Removida uma expressão JSX inválida (`< />`) de `Home.tsx`.
- Dependências do Material UI adicionadas ao `package.json`.

Observação: o `package-lock.json` precisa ser atualizado executando `npm install` na pasta `frontend`.
