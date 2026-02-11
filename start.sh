#!/bin/bash
# Script para iniciar o projeto Melitton

echo "Iniciando o projeto Melitton..."

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "Instalando dependências..."
    npm install
fi

# Iniciar o servidor de desenvolvimento
echo "Iniciando o servidor de desenvolvimento..."
npm run dev