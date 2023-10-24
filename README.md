# Demonstrates the issue with Astro server rendering and Algolia Autocomplete

```
yarn dev # start dev server with all 3 components rendering
yarn build # will error if the server only search input is present
```
To get yarn build to work slash out the `Server render` component

* `Server render` component renders on the server and mounts with `client:idle`
causing an issue
* `Hot replace` has a fake input which renders on the server and then mounts the
Algolia autocomplete input over the top
* `Client render` only renders on the client and shows CLS issues as there is no
server rendered input
