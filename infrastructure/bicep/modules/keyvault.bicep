// modules/keyvault.bicep

// Parameters passed from main.bicep
param location string
param environmentName string
param projectName string
param tags object

// Key Vault name must be globally unique
var keyVaultName = '${projectName}-${environmentName}-kv'

// Key Vault resource definition
resource keyVault 'Microsoft.KeyVault/vaults@2021-06-01-preview' = {
  name: keyVaultName
  location: location
  tags: tags
  properties: {
    // Standard SKU for most scenarios
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    accessPolicies: []              // Access policies will be added after deployment
    enableRbacAuthorization: true   // Use Azure RBAC for access control
    enableSoftDelete: true          // Enable recycle bin for deleted secrets
    softDeleteRetentionInDays: 90   // Keep deleted secrets for 90 days
  }
}

// Outputs for other modules to use
output keyVaultId string = keyVault.id
output keyVaultName string = keyVault.name