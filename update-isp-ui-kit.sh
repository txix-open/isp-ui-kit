#!/bin/bash

# Script to update isp-ui-kit version across multiple projects

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [ -f "$SCRIPT_DIR/.env" ]; then
    export $(grep -v '^#' "$SCRIPT_DIR/.env" | xargs)
fi

if [ -z "$PROJECTS_DIR" ]; then
    echo "Error: PROJECTS_DIR not set in .env file"
    exit 1
fi

CURRENT_VERSION=$(jq -r '.version' "$SCRIPT_DIR/package.json")

if [ -z "$CURRENT_VERSION" ] || [ "$CURRENT_VERSION" == "null" ]; then
    echo "Error: Could not read version from package.json"
    exit 1
fi

echo "Current version: $CURRENT_VERSION"

PROJECT_BUMP_TYPE=""
while [[ $# -gt 0 ]]; do
    case $1 in
        --project-patch)
            PROJECT_BUMP_TYPE="patch"
            ;;
        --project-minor)
            PROJECT_BUMP_TYPE="minor"
            ;;
        --project-major)
            PROJECT_BUMP_TYPE="major"
            ;;
        *)
            echo "Unknown argument: $1"
            echo "Usage: $0 [--project-patch|--project-minor|--project-major]"
            exit 1
            ;;
    esac
    shift
done

NEW_VERSION="$CURRENT_VERSION"

echo "Updating isp-ui-kit to version $NEW_VERSION"

IFS=',' read -ra PROJECTS_ARRAY <<< "$PROJECTS"

cd "$PROJECTS_DIR"

for project in "${PROJECTS_ARRAY[@]}"; do
    if [ -d "$PROJECTS_DIR/$project" ]; then
        echo "----------------------------------------"
        echo "Processing $project..."
        
        cd "$PROJECTS_DIR/$project"
        
        if grep -q "isp-ui-kit" package.json 2>/dev/null; then
            # 1. Поднимаем версию в package.json (обновляем существующую запись)
            cat package.json | jq --arg ver "$NEW_VERSION" '
                if .dependencies and .dependencies["isp-ui-kit"] then 
                    .dependencies["isp-ui-kit"] = $ver 
                elif .devDependencies and .devDependencies["isp-ui-kit"] then 
                    .devDependencies["isp-ui-kit"] = $ver 
                end
            ' > package.json.tmp && mv package.json.tmp package.json
            
            # 2. Делаем npm install
            npm install

            # 3. Поднимаем версию целевого проекта (опционально)
            if [ -n "$PROJECT_BUMP_TYPE" ]; then
                npm version "$PROJECT_BUMP_TYPE" --no-git-tag-version
                echo "Bumped $project version: $PROJECT_BUMP_TYPE"
            fi
            
            # 4. Добавляем changelog
            if [ -f "CHANGELOG.md" ]; then
                CURRENT_VERSION=$(jq -r '.version' package.json)
                NEW_ENTRY="## $CURRENT_VERSION
- Обновлено
  - библиотека isp-ui-kit ($NEW_VERSION)

"
                tail -n +2 CHANGELOG.md > CHANGELOG.tmp
                echo "$NEW_ENTRY" > CHANGELOG.new
                cat CHANGELOG.tmp >> CHANGELOG.new
                mv CHANGELOG.new CHANGELOG.md
                rm -f CHANGELOG.tmp
            fi
            
            git add package.json package-lock.json CHANGELOG.md
            echo "Updated $project"
        else
            echo "Skipping $project - no isp-ui-kit dependency"
        fi
        
        cd "$PROJECTS_DIR"
    else
        echo "Project $project not found, skipping..."
    fi
done

echo "Done!"
