#!/bin/bash

# Ensure Git tracks case changes
git config core.ignorecase false

# Array of model files
models=("User" "Team" "Lead" "Property")

# Loop through each model to fix casing
for model in "${models[@]}"; do
  echo "Fixing case for $model.js..."
  git mv "backend/src/models/${model}.js" "backend/src/models/${model}_temp.js"
  git mv "backend/src/models/${model}_temp.js" "backend/src/models/${model}.js"
done

# Stage all changes
git add backend/src/models/*.js

# Commit changes
git commit -m "Fix case for all model files for Linux deployment"

# Push to main
git push origin main

echo "✅ All model filenames fixed, committed, and pushed!"
