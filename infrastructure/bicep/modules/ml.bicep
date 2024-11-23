// modules/ml.bicep

// Parameters passed from main.bicep
param location string
param environmentName string
param projectName string
param tags object
param storageAccountId string    // ID of the storage account for ML data
param keyVaultId string         // ID of the Key Vault for ML secrets

// ML workspace name must be unique within resource group
var workspaceName = '${projectName}-${environmentName}-mlw'

// Azure ML Workspace resource definition
resource mlWorkspace 'Microsoft.MachineLearningServices/workspaces@2021-07-01' = {
  name: workspaceName
  location: location
  tags: tags
  identity: {
    type: 'SystemAssigned'      // Use managed identity for authentication
  }
  properties: {
    friendlyName: workspaceName
    storageAccount: storageAccountId     // Link to storage account
    keyVault: keyVaultId                 // Link to Key Vault
    applicationInsights: null            // Can be added later if needed
    containerRegistry: null              // Can be added later if needed
  }
}

// Outputs for other modules to use
output mlWorkspaceId string = mlWorkspace.id
output mlWorkspaceName string = mlWorkspace.name