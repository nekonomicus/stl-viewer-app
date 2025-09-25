#!/bin/bash

# Create Render service via API
curl -X POST "https://api.render.com/v1/services" \
  -H "Authorization: Bearer rnd_g6ZtLQ3NdKuNaQGH3LvQzxFkkyKi" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "web_service",
    "name": "stl-viewer-app",
    "ownerId": "tea-csp8t4rgbbvc73cerssg",
    "repo": "https://github.com/nekonomicus/stl-viewer-app",
    "autoDeploy": "yes",
    "branch": "master",
    "buildCommand": "npm install",
    "startCommand": "npm start",
    "envVars": [],
    "serviceDetails": {
      "envSpecificDetails": {
        "buildCommand": "npm install",
        "startCommand": "npm start"
      },
      "env": "node",
      "plan": "starter"
    }
  }' | python3 -m json.tool