// modules/storage.bicep

// Parameters passed from main.bicep
param location string            // Azure region
param environmentName string     // Environment (dev, test, prod)
param projectName string        // Project name
param tags object              // Resource tags

// Storage account name must be globally unique and can only contain lowercase letters and numbers
var storageAccountName = replace('${projectName}${environmentName}st', '-', '')

// Storage Account resource definition
resource storageAccount 'Microsoft.Storage/storageAccounts@2021-08-01' = {
  name: storageAccountName
  location: location
  tags: tags
  sku: {
    name: 'Standard_LRS'        // Locally redundant storage (cheapest option)
  }
  kind: 'StorageV2'            // General purpose v2 storage account
  properties: {
    accessTier: 'Hot'          // Optimized for frequently accessed data
    supportsHttpsTrafficOnly: true    // Enhanced security
    minimumTlsVersion: 'TLS1_2'       // Required security standard
    allowBlobPublicAccess: false      // Prevent public access to blobs
  }
}

// File service for potential future use (shared files, notebooks)
resource dataLakeService 'Microsoft.Storage/storageAccounts/fileServices@2021-08-01' = {
  parent: storageAccount
  name: 'default'
}

// Container for raw data storage
resource container 'Microsoft.Storage/storageAccounts/blobServices/containers@2021-08-01' = {
  name: '${storageAccount.name}/default/raw'
  properties: {
    publicAccess: 'None'        // Private access only
  }
}

// Output values that other modules might need
output storageAccountId string = storageAccount.id
output storageAccountName string = storageAccount.name