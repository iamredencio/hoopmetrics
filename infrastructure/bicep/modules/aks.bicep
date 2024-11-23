// modules/aks.bicep

// Parameters passed from main.bicep
param location string
param environmentName string
param projectName string
param tags object

// Cluster name must be unique within resource group
var clusterName = '${projectName}-${environmentName}-aks'

// AKS Cluster resource definition
resource aksCluster 'Microsoft.ContainerService/managedClusters@2021-07-01' = {
  name: clusterName
  location: location
  tags: tags
  identity: {
    type: 'SystemAssigned'      // Use managed identity for authentication
  }
  properties: {
    dnsPrefix: '${projectName}${environmentName}'
    enableRBAC: true           // Enable role-based access control
    // Node pool configuration
    agentPoolProfiles: [
      {
        name: 'agentpool'
        count: 1               // Start with 1 node, can be scaled up
        vmSize: 'Standard_DS2_v2'  // General purpose VM size
        mode: 'System'
      }
    ]
  }
}

// Outputs for other modules to use
output aksId string = aksCluster.id
output aksName string = aksCluster.name