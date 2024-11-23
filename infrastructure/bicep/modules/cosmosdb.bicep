// modules/cosmosdb.bicep

// Parameters passed from main.bicep
param location string
param environmentName string
param projectName string
param tags object

// Variables for resource naming
var accountName = '${projectName}-${environmentName}-cosmos'
var databaseName = 'nbaanalytics'

// Cosmos DB Account resource definition
resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2021-10-15' = {
  name: accountName
  location: location
  tags: tags
  kind: 'GlobalDocumentDB'      // SQL API type
  properties: {
    // Consistency configuration for balance between data consistency and performance
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    // Geographic configuration
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false  // Can be enabled for higher availability
      }
    ]
    databaseAccountOfferType: 'Standard'
    enableAutomaticFailover: false
    // Enable serverless capacity mode for cost optimization
    capabilities: [
      {
        name: 'EnableServerless'
      }
    ]
  }
}

// Database definition within the Cosmos account
resource database 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2021-10-15' = {
  parent: cosmosAccount
  name: databaseName
  properties: {
    resource: {
      id: databaseName
    }
  }
}

// Outputs for other modules to use
output cosmosDbId string = cosmosAccount.id
output cosmosDbEndpoint string = cosmosAccount.properties.documentEndpoint