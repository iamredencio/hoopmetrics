// main.bicep

// This is the main file that orchestrates all module deployments
// The 'targetScope' indicates we want to create resources at the subscription level
targetScope = 'subscription'

// Parameters that can be customized during deployment
param location string = 'eastus'          // Azure region where resources will be deployed
param environmentName string = 'dev'      // Environment (dev, test, prod, etc.)
param projectName string = 'nbaanalytics' // Name of the project

// Tags that will be applied to all resources for organization and cost management
var tags = {
  environment: environmentName
  project: projectName
  creator: 'IaC'
  dateCreated: utcNow('yyyy-MM-dd')
}

// Resource Group that will contain all resources
resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: '${projectName}-${environmentName}-rg'
  location: location
  tags: tags
}

// Storage Account deployment for data storage (raw data, scraping results, ML models)
module storage './modules/storage.bicep' = {
  scope: rg                               // Deploy within the resource group
  name: 'storageDeployment'              // Deployment name
  params: {
    location: location
    environmentName: environmentName
    projectName: projectName
    tags: tags
  }
}

// Cosmos DB deployment for NoSQL database (game data, player stats, real-time updates)
module cosmosDb './modules/cosmosdb.bicep' = {
  scope: rg
  name: 'cosmosDbDeployment'
  params: {
    location: location
    environmentName: environmentName
    projectName: projectName
    tags: tags
  }
}

// Azure Kubernetes Service deployment for container orchestration
// This will host our web application and API services
module aks './modules/aks.bicep' = {
  scope: rg
  name: 'aksDeployment'
  params: {
    location: location
    environmentName: environmentName
    projectName: projectName
    tags: tags
  }
}

// Key Vault deployment for secure secrets management
// Stores connection strings, API keys, and other sensitive information
module keyVault './modules/keyvault.bicep' = {
  scope: rg
  name: 'keyVaultDeployment'
  params: {
    location: location
    environmentName: environmentName
    projectName: projectName
    tags: tags
  }
}

// Azure ML Workspace deployment for machine learning operations
// Used for training and deploying ML models for game and player predictions
module mlWorkspace './modules/ml.bicep' = {
  scope: rg
  name: 'mlWorkspaceDeployment'
  params: {
    location: location
    environmentName: environmentName
    projectName: projectName
    tags: tags
    storageAccountId: storage.outputs.storageAccountId
    keyVaultId: keyVault.outputs.keyVaultId
  }
}