# Unified Search - Shared component

The first step that a user has to take on landing on the widget ui is to find the institution. However, for supporting multiple providers, it is different from a provider-specific search, it needs some special abilities to:
  * Use one search to look up all selected providers. The data source needs to be complete and also be able to combine duplications--efficient mapping and indexing is critical
  * Include providers information in the search result and allow further logic to select one particular provider (Different providers require different institution identifiers, the search result would need to map it to the selected provider.) 
  * Strategies need to be applied when resolving the search result to select a provider.  
  As a result, the search component is made as a stand-alone service, available [here (coming soon)]()

The unified search ideally should be a community-maintained shared component, because it is a huge effort to maintain an up-to-date and full institution list with correct mapping to each provider. This is almost an impossible mission for one company to deal with. The good news is, this is non-secret.