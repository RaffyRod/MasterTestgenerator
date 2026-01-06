#!/bin/bash

echo ""
echo "========================================"
echo " Master Test Generator - Quick Setup"
echo "========================================"
echo ""

node scripts/setup.js

if [ $? -ne 0 ]; then
    echo ""
    echo "Setup failed. Please check the errors above."
    exit 1
fi

