# PixelPlush Website Refactoring Guide

This guide explains the changes made to consolidate common code and improve maintainability.

## Changes Made

1. Created a shared JavaScript file (`js/shared.js`) that contains:
   - Common constants
   - Authentication and account management
   - Helper functions

2. Updated the `transactions.html` and `pages/transactions.js` files to use this shared code

## How to Apply These Changes to Other Pages

### Step 1: Include the shared.js file in each HTML page

Add the following after loading ComfyTwitch and before loading the page-specific JS:

```html
<script src="public/comfytwitch.min.js"></script>
<!-- Include shared PixelPlush code -->
<script src="js/shared.js"></script>
<script src="pages/[page-name].js"></script>
```

### Step 2: Update each page's JavaScript file

Replace the common code with the shared functionality:

```javascript
// Use shared.js for common functionality
// Define any page-specific variables here

PlushAuth.init()
.then(async authResult => {
    if(authResult.authenticated) {
        try {
            // Page-specific functionality here
            
            // If you need catalog data:
            const catalogData = await PlushAuth.fetchCatalog();
            items = catalogData.items;
            
            // If you need transactions:
            const receipts = await PlushAuth.fetchTransactions();
            
            // Rest of your page-specific code...
        }
        catch(error) {
            console.log("Auth Validate Failed", error);
        }
    }
    else {
        // Handle unauthenticated state
    }
});

// Any additional page-specific functions
```

### Step 3: Remove inline scripts from HTML

Make sure all JavaScript code is moved to the appropriate .js files and remove any inline scripts from the HTML files.

## Benefits

1. **Reduced Duplication**: Common code is defined once and reused across pages
2. **Easier Maintenance**: Changes to authentication or API endpoints only need to be made in one place
3. **Better Organization**: Clearer separation between shared and page-specific code
4. **Backward Compatibility**: The shared code maintains the same global variables that existing code expects

## Next Steps for Further Refactoring

1. Convert more pages to use the shared code
2. Create page-specific modules for specialized functionality
3. Consider implementing a templating system for HTML components
4. Add more helper functions for common UI tasks

## Testing

After making these changes, be sure to test:
1. Authentication flow (login/logout)
2. Page-specific functionality
3. Error handling
