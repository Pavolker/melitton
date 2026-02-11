<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Melitton - Sistema de Gestão para Meliponários

Sistema completo para controle e gestão de colmeias de abelhas sem ferrão, com acompanhamento de iscas, inspeções e histórico de manejo.

## Funcionalidades

- Cadastro e gerenciamento de caixas de abelhas
- Controle de iscas para captura de enxames
- Histórico de inspeções e manejo
- Estatísticas e relatórios
- Sistema de backup e recuperação de dados

## Recursos de Segurança de Dados

- Armazenamento local como fallback quando o backend está indisponível
- Sincronização automática entre dados locais e remotos
- Exportação e importação de backups completos
- Indicador visual de status de sincronização

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Recuperação de Dados

Em caso de perda de dados no servidor, utilize a funcionalidade de importação no menu de configurações para restaurar seus dados a partir de um backup local.
