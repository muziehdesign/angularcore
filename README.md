# ShoppingcartWeb

## Setup

1. create file `config.local.json` in `/src`. Body example:

    ```
    {

    }
    ```

## Design System

This project follows [Muzieh Design System](https://ruifang.github.io/designsystem)

## Extensions

1. Angular Language Service
1. Prettier
1. Tailwind CSS IntelliSense

## Command line tools
1. create-ts-index, `npx create-ts-index src/app/models`

## Naming conventions
1. Feature modules typically come with a list view and a detail view, they should be called `{feature}-list` and `{feature-detail}` respectively. For example: 
```
- order
    \order-list
        order-list.component.ts
    \order-details
        order-details.component.ts
```

## Todo

-   [ ] css framework, responsiveness
-   [ ] design system
-   [x] local configuration
-   [ ] module configuration
-   [ ] api client
-   [ ] logging
-   [ ] path setup
-   [ ] formatting
-   [ ] schematics
-   [ ] cypress
-   [ ] analytics
-   [x] authentication
-   [ ] authorization
-   [ ] error pages
-   [ ] forms
-   [ ] component styles
-   [ ] layout
-   [ ] health
-   [x] lazy module
-   [ ] commands
-   [ ] build
-   [ ] error handling
-   [ ] bootstrap failure
-   [ ] page service lifecycle
-   [ ] separation of ui and domain
-   [ ] state management

## Tasks

-   module import cleanup

## Notes

### authentication

-   When testing in private mode, allow third-party cookies to avoid authentication errors
-   Need to create signin-oidc.html and add output to angular.json
