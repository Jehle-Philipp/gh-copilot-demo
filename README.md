# Github Copilot demo 

## Demo Scenarios

### To start discovering Github Copilot jump to [`The Ultimate GitHub Copilot Tutorial on MOAW`](https://aka.ms/github-copilot-hol)
<br/>


## Solution Overview


This repository has been inspired by the [Azure Container Apps: Dapr Albums Sample](https://github.com/Azure-Samples/containerapps-dapralbums)

It's used as a code base to demonstrate Github Copilot capabilities.

The solution is composed of two services: the .net album API and the NodeJS album viewer.


### Album API (`album-api`)

The [`album-api`](./album-api) is an .NET 8 minimal Web API that manage a list of Albums in memory.

### Album Viewer (`album-viewer`)

The [`album-viewer`](./album-viewer) is a modern Vue.js 3 application built with TypeScript through which the albums retrieved by the API are surfaced. The application uses the Vue 3 Composition API with full TypeScript support for enhanced developer experience and type safety. In order to display the repository of albums, the album viewer contacts the backend album API.

## Getting Started

There are multiple ways to run this solution locally. Choose the method that best fits your development workflow.

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (version 16 or higher)
- [TypeScript](https://www.typescriptlang.org/) (automatically installed with project dependencies)
- [Visual Studio Code](https://code.visualstudio.com/) (recommended)

### Option 1: Using VS Code Debug Panel (Recommended)

This is the easiest way to run the solution with full debugging capabilities.

1. Open the solution in Visual Studio Code
2. Open the Debug panel (Ctrl+Shift+D / Cmd+Shift+D)
3. Select **"All services"** from the dropdown
4. Click the green play button or press F5

This will automatically:
- Build the .NET API and start it on `http://localhost:3000`
- Start the Vue.js TypeScript app on `http://localhost:3001`
- Open both services in your default browser

You can also run individual services:
- **"C#: Album API Debug"** - Runs only the .NET API
- **"Node.js: Album Viewer Debug"** - Runs only the Vue.js TypeScript frontend

### Option 2: Command Line

#### Starting the Album API (.NET)

```powershell
# Navigate to the API directory
cd albums-api

# Restore dependencies (first time only)
dotnet restore

# Run the API
dotnet run
```

The API will start on `http://localhost:3000` and you can access the Swagger documentation at `http://localhost:3000/swagger`.

#### Starting the Album Viewer (Vue.js + TypeScript)

```powershell
# Navigate to the viewer directory
cd album-viewer

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev

# Optional: Run TypeScript type checking
npm run type-check
```

The Vue.js TypeScript app will start on `http://localhost:3001` and automatically open in your browser.

#### Running Both Services

You can run both services simultaneously using separate terminal windows:

```powershell
# Terminal 1 - Start the API
cd albums-api
dotnet run

# Terminal 2 - Start the Vue TypeScript app
cd album-viewer
npm run dev
```

### Environment Configuration

The solution uses the following default configuration:

- **Album API**: Runs on `http://localhost:3000`
- **Album Viewer**: Runs on `http://localhost:3001` (TypeScript + Vue 3)
- **API Endpoint**: The Vue app is configured to call the API at `localhost:3000`

If you need to change these settings, you can modify:
- API port: `albums-api/Properties/launchSettings.json`
- Vue app configuration: Environment variables in `.vscode/launch.json` or set `VITE_ALBUM_API_HOST` environment variable

### Alternative: GitHub Codespaces

The easiest way is to open this solution in a GitHub Codespace, or run it locally in a devcontainer. The development environment will be automatically configured for you.

## Deploy On Azure

This repository includes Infrastructure as Code for Azure Container Apps in [iac/bicep/main.bicep](iac/bicep/main.bicep). Follow the steps below to deploy both services.

### Prerequisites

- Azure subscription with permission to create resource groups and Container Apps
- Azure CLI 2.57 or newer
- Docker (if you want to build images locally)

### 1. Sign In And Set Variables

```bash
az login
az account set --subscription "<YOUR_SUBSCRIPTION_ID_OR_NAME>"

export LOCATION="westeurope"
export RESOURCE_GROUP="rg-copilot-demo"
export ACR_NAME="acrcopilot$RANDOM"
export IMAGE_TAG="v1"
```

### 2. Create Resource Group And Container Registry

```bash
az group create --name "$RESOURCE_GROUP" --location "$LOCATION"

az acr create \
	--name "$ACR_NAME" \
	--resource-group "$RESOURCE_GROUP" \
	--sku Basic \
	--admin-enabled true

export ACR_LOGIN_SERVER=$(az acr show --name "$ACR_NAME" --resource-group "$RESOURCE_GROUP" --query loginServer -o tsv)
export ACR_USERNAME=$(az acr credential show --name "$ACR_NAME" --query username -o tsv)
export ACR_PASSWORD=$(az acr credential show --name "$ACR_NAME" --query "passwords[0].value" -o tsv)
```

### 3. Create Minimal Dockerfiles For This Repo

The API and viewer folders do not include Dockerfiles by default, so create them once before building images.

```bash
mkdir -p deploy

cat > deploy/Dockerfile.albums-api <<'EOF'
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ./albums-api ./albums-api
RUN dotnet restore ./albums-api/albums-api.csproj
RUN dotnet publish ./albums-api/albums-api.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80
ENTRYPOINT ["dotnet", "albums-api.dll"]
EOF

cat > deploy/nginx.viewer.template.conf <<'EOF'
server {
	listen 3000;
	server_name _;

	location /albums {
		proxy_pass https://${API_HOST}/albums;
		proxy_http_version 1.1;
		proxy_set_header Host ${API_HOST};
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
	}

	location / {
		root /usr/share/nginx/html;
		try_files $uri $uri/ /index.html;
	}
}
EOF

cat > deploy/Dockerfile.album-viewer <<'EOF'
FROM node:20-alpine AS build
WORKDIR /app
COPY ./album-viewer/package*.json ./
RUN npm ci
COPY ./album-viewer .
RUN npm run build

FROM nginx:1.27-alpine
ENV API_HOST=example.org
COPY ./deploy/nginx.viewer.template.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 3000
CMD ["/bin/sh", "-c", "envsubst '$API_HOST' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
EOF
```

### 4. Build And Push Images To ACR

Run these commands from the repository root.

```bash
az acr build --registry "$ACR_NAME" --image album-api:$IMAGE_TAG --file deploy/Dockerfile.albums-api .
az acr build --registry "$ACR_NAME" --image album-viewer:$IMAGE_TAG --file deploy/Dockerfile.album-viewer .
```

### 5. Deploy Azure Infrastructure And Container Apps

```bash
az deployment group create \
	--resource-group "$RESOURCE_GROUP" \
	--template-file iac/bicep/main.bicep \
	--parameters \
			registryName="$ACR_LOGIN_SERVER" \
			registryUsername="$ACR_USERNAME" \
			registryPassword="$ACR_PASSWORD" \
			apiImage="$ACR_LOGIN_SERVER/album-api:$IMAGE_TAG" \
			viewerImage="$ACR_LOGIN_SERVER/album-viewer:$IMAGE_TAG"
```

### 6. Configure Viewer To Reach The API

The viewer calls /albums, so set API_HOST on the viewer container app to the API public FQDN.

```bash
export API_FQDN=$(az containerapp show --name album-api --resource-group "$RESOURCE_GROUP" --query properties.configuration.ingress.fqdn -o tsv)

az containerapp update \
	--name album-viewer \
	--resource-group "$RESOURCE_GROUP" \
	--set-env-vars API_HOST="$API_FQDN"
```

### 7. Validate The Deployment

```bash
export VIEWER_FQDN=$(az containerapp show --name album-viewer --resource-group "$RESOURCE_GROUP" --query properties.configuration.ingress.fqdn -o tsv)
echo "Album Viewer URL: https://$VIEWER_FQDN"
echo "Album API URL:    https://$API_FQDN"
```

Open the viewer URL and verify albums load successfully.