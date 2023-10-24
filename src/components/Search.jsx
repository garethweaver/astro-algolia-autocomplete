import { useState, useMemo } from "react";
import algoliasearch from "algoliasearch/lite";
import { createAutocomplete } from "@algolia/autocomplete-core";
import { getAlgoliaResults } from "@algolia/autocomplete-preset-algolia";

export default function ({ title }) {
  const searchClient = algoliasearch(
    "latency",
    "6be0576ff61c053d5f9a3225e2a90f76"
  );

  // (1) Create a React state.
  const [autocompleteState, setAutocompleteState] = useState({});
  const autocomplete = useMemo(
    () =>
      createAutocomplete({
        onStateChange({ state }) {
          // (2) Synchronize the Autocomplete state with the React state.
          setAutocompleteState(state);
        },
        id: 'Search thing',
        getSources() {
          return [
            // (3) Use an Algolia index source.
            {
              sourceId: "products",
              getItemInputValue({ item }) {
                return item.query;
              },
              getItems({ query }) {
                return getAlgoliaResults({
                  searchClient,
                  queries: [
                    {
                      indexName: "instant_search",
                      query,
                      params: {
                        hitsPerPage: 4,
                        highlightPreTag: "<mark>",
                        highlightPostTag: "</mark>",
                      },
                    },
                  ],
                });
              },
              getItemUrl({ item }) {
                return item.url;
              },
            },
          ];
        },
      }),
    []
  );

  return (
    <div>
      <h1>{title}</h1>
      <div className="aa-Autocomplete" {...autocomplete.getRootProps({})}>
        <input className="aa-Input" {...autocomplete.getInputProps({})} />
        <div className="aa-Panel" {...autocomplete.getPanelProps({})}>
          {autocompleteState.isOpen &&
            autocompleteState.collections.map((collection, index) => {
              const { source, items } = collection;
              return (
                <div key={`source-${index}`} className="aa-Source">
                  {items.length > 0 && (
                    <ul className="aa-List" {...autocomplete.getListProps()}>
                      {items.map((item) => (
                        <li
                          key={item.objectID}
                          className="aa-Item"
                          {...autocomplete.getItemProps({
                            item,
                            source,
                          })}
                        >
                          {item.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
