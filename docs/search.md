# Unified Search - Shared componet

The first step that a user has to take on landing on the widget ui is to find the institution. however, for supporting multiple providers, it is different from a provider-specific search, it needs some special abilties to:
  * Use one search to lookup all selected providers, the data source needs to be complete and also combining duplications, efficient mapping and indexing is crytical
  * Include providers information in the search result and allow further logic to select one particular provider(Different providers require different institution identifiers, the search result would need to map it to the selected provider.) 
  * Strategies need to be applied when resolving the search result to select a provider.  
  As a result, the search component is made as a stand-alone service, available [here (coming soon)]()

The unified search ideally should be a community maintained shared component, because it is a huge effort to maintain an up-to-date and full institution list with correct mapping to each provider. almost an impossible mission for one company to deal with. while the good news is, this is non-secret.