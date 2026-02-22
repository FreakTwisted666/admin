#!/bin/bash

# AdminFlow AI - Quick Start Script
# This script helps you set up the project quickly

echo "🚀 AdminFlow AI - Quick Setup"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    echo "Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found"
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your API keys:"
    echo "   - MISTRAL_API_KEY (from https://mistral.ai/)"
    echo "   - GOOGLE_CLIENT_ID"
    echo "   - GOOGLE_CLIENT_SECRET"
    echo "   - GOOGLE_REFRESH_TOKEN"
    echo ""
    echo "Press Enter to continue after configuring .env..."
    read
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Start development server
echo ""
echo "🚀 Starting development server..."
echo ""
echo "Open http://localhost:4321/ in your browser"
echo ""
npm run dev
